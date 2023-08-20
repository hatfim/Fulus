/* eslint-disable no-console */
import { useEffect, useRef, useState } from 'react';

import type { IOrderBookState } from '~/types/feed.type';

interface IUseFeedWorker {
  status: string;
  feed: Worker | null;
  orderBook: IOrderBookState | undefined;
}
export const useFeedWorker = (): IUseFeedWorker => {
  const [status, setStatus] = useState('loading');
  const [orderBook, setOrderBook] = useState<IOrderBookState>();
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
          case 'FEED_KILLED':
            console.log('frontend: feed killed');
            break;
          default:
            console.info('no data');
        }
      };
      setStatus('ready');
    })();
  }, []);

  if (worker && worker?.current && status === 'ready') {
    return {
      status: 'ready',
      feed: worker.current,
      orderBook,
    };
  }
  return {
    status: 'loading',
    feed: null,
    orderBook,
  };
};
