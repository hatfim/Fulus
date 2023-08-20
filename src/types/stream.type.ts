export type Timeframe =
  | '1d'
  | '1h'
  | '1m'
  | '1w'
  | '2h'
  | '3m'
  | '4h'
  | '5m'
  | '6h'
  | '12h'
  | '15m'
  | '30m';

export type Candle = {
  readonly time: number;
  readonly open: number;
  readonly high: number;
  readonly low: number;
  readonly close: number;
  readonly volume: number;
};

export type OrderBookOrders = {
  price: number;
  amount: number;
  total: number;
};

export type OrderBook = {
  bids: OrderBookOrders[];
  asks: OrderBookOrders[];
};

export type OHLCVOptions = {
  readonly symbol: string;
  readonly interval: Timeframe;
};
