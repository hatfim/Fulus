/* eslint-disable no-console */
import type { OhlcData } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';

import type { IOrderBookState } from '~/types/feed.type';
import { logger } from '~/utils';

interface IUseFeedWorker {
  status: string;
  feed: Worker | null;
  orderBook: IOrderBookState | undefined;
  candles?: OhlcData[] | [];
}
export const useFeedWorker = (): IUseFeedWorker => {
  const [status, setStatus] = useState('loading');
  const [orderBook, setOrderBook] = useState<IOrderBookState>();
  const [candles, setCandles] = useState<OhlcData[]>();
  const worker = useRef<Worker>();

  useEffect(() => {
    (async () => {
      console.log('useFeedWorker');
      worker.current = new Worker(
        new URL('~/workers/feed.worker', import.meta.url),
      );
      worker.current.onmessage = (event) => {
        switch (event.data.type) {
          case 'ORDERBOOK': {
            const orderBookSnapshot: IOrderBookState = event.data.data;
            setOrderBook(Object.freeze(orderBookSnapshot));
            break;
          }
          case 'CANDLE': {
            const CandlesSnapshot = event.data.data;
            setCandles(Object.freeze(CandlesSnapshot));
            break;
          }
          case 'FEED_KILLED':
            logger.info('frontend: feed killed');
            break;
          default:
            logger.info('no data');
        }
      };
      setStatus('ready');
      logger.info('ready');
    })();
  }, []);

  if (worker && worker?.current && status === 'ready') {
    return {
      status: 'ready',
      feed: worker.current,
      orderBook,
      candles,
    };
  }
  return {
    status: 'loading',
    feed: null,
    orderBook,
    candles,
  };
};
