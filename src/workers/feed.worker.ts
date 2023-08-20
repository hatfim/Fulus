import type {
  IOrderBookState,
  ITickerShape,
  TOrderDelta,
  TOrderRow,
} from '~/types/feed.type';
import type {
  Candle,
  OHLCVOptions,
  OrderBook,
  OrderBookOrders,
} from '~/types/stream.type';
import {
  afterDecimal,
  executeFetch,
  groupTickRows,
  jsonParse,
  logger,
  orderByTimestampAndCheckAscending,
} from '~/utils';

type Data = Array<Record<string, any>>;
type MessageHandlers = {
  [topic: string]: (json: Data) => void;
};

class WebSocketStream {
  private feed?: WebSocket;

  private symbol: string;

  private tickSize: number;

  isDisposed: boolean = false;

  messageHandlers: MessageHandlers = {};

  pingAt = 0;

  pingTimeoutId?: NodeJS.Timeout;

  constructor(ticker: ITickerShape = { symbol: 'ETHUSDT', tickSize: 0.1 }) {
    this.symbol = ticker.symbol;
    this.tickSize = ticker.tickSize;

    if (this.isConnected) return;
    let called = 1;
    console.log((called += 1));

    this.connectAndSubscribe();
    this.getOHLCV();
  }

  get isConnected() {
    return this.feed?.readyState === WebSocket.OPEN;
  }

  getOHLCV() {
    return this.fetchOHLCV(
      { symbol: this.symbol, interval: '5m' },
      (candle) => {
        postMessage({
          type: 'CANDLE',
          data: orderByTimestampAndCheckAscending(candle),
        });
      },
    );
  }

  connectAndSubscribe = () => {
    this.feed = new WebSocket('wss://fstream.binance.com/ws');

    this.feed.addEventListener('open', this.onOpen);
    this.feed.addEventListener('message', this.onMessage);
    this.feed.addEventListener('close', this.onClose);
  };

  onOpen = () => {
    this.listenOrderBook(this.symbol, this.tickSize, (orderbook) => {
      postMessage({
        type: 'ORDERBOOK',
        data: orderbook,
      });
    });
  };

  onMessage = ({ data }: MessageEvent) => {
    if (!this.isDisposed) {
      const handlers = Object.entries(this.messageHandlers);

      for (const [topic, handler] of handlers) {
        if (data.includes(`e":"${topic}`)) {
          const json = jsonParse(data);
          if (json) handler(Array.isArray(json) ? json : [json]);
          break;
        }
      }
    }
  };

  onClose = () => {
    if (!this.isDisposed) {
      logger.warn('WebSocket connection disconnected, reconnecting...');
    }

    if (this.pingTimeoutId) {
      clearTimeout(this.pingTimeoutId);
      this.pingTimeoutId = undefined;
    }

    this.feed?.removeEventListener?.('open', this.onOpen);
    this.feed?.removeEventListener?.('message', this.onMessage);
    this.feed?.removeEventListener?.('close', this.onClose);

    if (!this.isDisposed) {
      this.connectAndSubscribe();
    }
  };

  dispose = () => {
    this.feed?.close?.();
    this.isDisposed = true;
  };

  listenOrderBook = (
    symbol: string,
    tickSize: number,
    callback: (orderBook: IOrderBookState) => void,
  ) => {
    let timeoutId: NodeJS.Timeout | null = null;

    const topic = `${symbol.toLowerCase()}@depth`;
    const orderBookState: OrderBook = { bids: [], asks: [] };
    const orderBookSnapshot: IOrderBookState = {
      symbol,
      bids: [],
      asks: [],
      maxPriceSize: 0,
    };
    const innerState = {
      updates: [] as any[],
      isSnapshotLoaded: false,
    };

    const fetchSnapshot = async () => {
      const url = `https://fapi.binance.com/fapi/v1/depth?symbol=${symbol}&limit=1000`;
      const data = await executeFetch(url, { method: 'get' });

      if (!this.isDisposed) {
        // save snapshot into orderBook object
        orderBookState.bids = data.bids.map(([price, amount]: string[]) => ({
          price: parseFloat(price),
          amount: parseFloat(amount),
          total: 0,
        }));

        orderBookState.asks = data.asks.map(([price, amount]: string[]) => ({
          price: parseFloat(price),
          amount: parseFloat(amount),
          total: 0,
        }));

        // drop events where u < lastUpdateId
        innerState.updates = innerState.updates.filter(
          (update: Record<string, any>) => update.u > data.lastUpdateId,
        );

        // apply all updates
        innerState.updates.forEach((update: Record<string, any>) => {
          this.processOrderBookUpdate(orderBookState, update);
        });

        // sortOrderBook(orderBookState);
        // calcOrderBookTotal(orderBookState);
        const newOrder = this.groupOrderBookRow({
          bids: orderBookState.bids,
          asks: orderBookState.asks,
          symbol,
          tickSize,
          decimalPlace: afterDecimal(tickSize),
        });
        Object.assign(orderBookSnapshot, newOrder);

        innerState.isSnapshotLoaded = true;
        innerState.updates = [];

        callback(orderBookSnapshot);
      }
    };

    const waitForConnectedAndSubscribe = () => {
      if (this.isConnected) {
        // 1. subscribe to the topic
        // 2. wait for the first message and send request to snapshot
        // 3. store all incoming updates in an array
        // 4. when the snapshot is received, apply all updates and send the order book to the callback
        // 5. then on each update, apply it to the order book and send it to the callback
        this.messageHandlers.depthUpdate = ([data]: Data) => {
          // incorrect symbol, we don't take account
          if (data.s !== symbol) return;

          // first update, request snapshot
          if (!innerState.isSnapshotLoaded && innerState.updates.length === 0) {
            fetchSnapshot();
            innerState.updates = [data];
            return;
          }

          // more updates, but snapshot is not loaded yet
          if (!innerState.isSnapshotLoaded) {
            innerState.updates.push(data);
            return;
          }

          // snapshot is loaded, apply updates and callback
          this.processOrderBookUpdate(orderBookState, data);
          // sortOrderBook(orderBookState);
          // calcOrderBookTotal(orderBookState);
          const newOrder = this.groupOrderBookRow({
            bids: orderBookState.bids,
            asks: orderBookState.asks,
            symbol,
            tickSize,
            decimalPlace: afterDecimal(tickSize),
          });
          Object.assign(orderBookSnapshot, newOrder);

          callback(orderBookSnapshot);
        };

        const payload = { method: 'SUBSCRIBE', params: [topic], id: 1 };
        this.feed?.send?.(JSON.stringify(payload));
      } else {
        timeoutId = setTimeout(() => waitForConnectedAndSubscribe(), 100);
      }
    };

    waitForConnectedAndSubscribe();

    return () => {
      delete this.messageHandlers.depthUpdate;
      orderBookState.asks = [];
      orderBookState.bids = [];
      innerState.updates = [];
      innerState.isSnapshotLoaded = false;

      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      if (this.isConnected) {
        const payload = { method: 'UNSUBSCRIBE', params: [topic], id: 1 };
        this.feed?.send?.(JSON.stringify(payload));
      }
    };
  };

  // eslint-disable-next-line class-methods-use-this
  fetchOHLCV = async (
    opts: OHLCVOptions,
    callback: (candle: Candle[]) => void,
  ) => {
    const url = `https://fapi.binance.com/fapi/v1/klines?symbol=${opts.symbol}&interval=${opts.interval}&limit=500`;
    const data = await executeFetch(url, { method: 'get' });

    const candles: Candle[] = data.map(
      ([time, open, high, low, close, volume]: [
        number,
        string,
        string,
        string,
        string,
        string,
      ]) => {
        return {
          time: time / 1000,
          open: parseFloat(open),
          high: parseFloat(high),
          low: parseFloat(low),
          close: parseFloat(close),
          volume: parseFloat(volume),
        };
      },
    );

    callback(candles);
  };

  // eslint-disable-next-line class-methods-use-this
  private processOrderBookUpdate = (
    orderBook: OrderBook,
    update: Record<string, any>,
  ) => {
    const sides = { bids: update.b, asks: update.a };

    Object.entries(sides).forEach(([side, data]) => {
      // we need this for ts compile
      if (side !== 'bids' && side !== 'asks') return;

      data.forEach(([p, a]: string[]) => {
        const price = parseFloat(p);
        const amount = parseFloat(a);
        const index = orderBook[side].findIndex((b) => b.price === price);

        if (index === -1 && amount > 0) {
          orderBook[side].push({ price, amount, total: 0 });
          return;
        }

        if (amount === 0) {
          orderBook[side].splice(index, 1);
          return;
        }

        // eslint-disable-next-line no-param-reassign
        orderBook[side][index].amount = amount;
      });
    });
  };

  // eslint-disable-next-line class-methods-use-this
  private mapDeltaArrayToHash(deltaArray: TOrderDelta[], decimalPlace: number) {
    const deltaHash = deltaArray.reduce(
      (acc: { [key: number]: TOrderRow }, curr) => {
        const { price, amount, total } = curr;
        acc[price] = {
          price: price.toFixed(decimalPlace),
          amount,
          total,
        };

        return acc;
      },
      {},
    );
    return deltaHash;
  }

  private groupOrderBookRow({
    bids,
    asks,
    symbol,
    tickSize,
    decimalPlace,
  }: {
    bids: OrderBookOrders[];
    asks: OrderBookOrders[];
    symbol: string;
    tickSize: number;
    decimalPlace: number;
  }) {
    const newMaxPriceSize = asks
      .concat(bids)
      .filter((d) => d.amount)
      .map((d) => d.amount)
      .reduce((acc, curr) => acc + curr, 0);

    const orderBookSnapshot: IOrderBookState = {
      symbol,
      asks: groupTickRows(
        this.mapDeltaArrayToHash(asks, decimalPlace),
        tickSize,
      ),
      bids: groupTickRows(
        this.mapDeltaArrayToHash(bids, decimalPlace),
        tickSize,
      ),
      maxPriceSize: newMaxPriceSize,
    };
    return orderBookSnapshot;
  }
}

const feed = new WebSocketStream();

onmessage = (event: MessageEvent) => {
  switch (event.data.type) {
    case 'KILL_FEED': {
      feed.dispose();
      break;
    }
    default: {
      logger.warn(`Instructions not specific enough: ${event}`);
    }
  }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {};
