import React, { useState } from 'react';

import { Icons } from '~/components/atoms/Icons';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/molecules/Select';
import { useFeedWorker } from '~/hooks/useFeedWorker';

import { OrderTable } from './OrderTable';

export function OrderBook() {
  const { status, feed, orderBook } = useFeedWorker();
  const [tickSize] = useState('0.1');

  const tickSizeOptions = ['0.01', '0.1', '1', '10', '50'];

  setTimeout(() => {
    feed?.postMessage({
      type: 'KILL_FEED',
    });
  }, 10000);

  if (status === 'loading' || orderBook === undefined) {
    return <p>Feed Connection Loading...</p>;
  }

  return (
    <div className="py-4">
      <section className="flex items-center justify-between px-4">
        <div className="inline-flex items-center justify-start">
          <span>
            <Icons.OrderBookDefault className="h-8 w-8 text-muted-foreground" />
          </span>
          <span>
            <Icons.OrderBookBuy className="h-8 w-8 text-muted-foreground" />
          </span>
          <span>
            <Icons.OrderBookSell className="h-8 w-8 text-muted-foreground" />
          </span>
        </div>
        <div>
          <Select>
            <SelectTrigger className="w-24">
              <SelectValue placeholder={tickSize} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {tickSizeOptions.map((ticksize) => {
                  return (
                    <SelectItem key={ticksize} value={ticksize}>
                      {ticksize}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </section>
      <OrderTable
        rows={orderBook.asks}
        maxPriceSize={orderBook.maxPriceSize}
        askOrBid="ask"
        ticker={orderBook.symbol}
      />
      <OrderTable
        rows={orderBook.bids}
        maxPriceSize={orderBook.maxPriceSize}
        askOrBid="bid"
        ticker={orderBook.symbol}
      />
    </div>
  );
}
