import React from 'react';

import { cn } from '~/lib/utils';
import type { IOrderRowHash, TAskOrBid } from '~/types/feed.type';

interface IOrderTable {
  rows: IOrderRowHash;
  maxPriceSize: number;
  askOrBid: TAskOrBid;
  ticker: string;
}
const OrderTable = ({ rows, maxPriceSize, askOrBid, ticker }: IOrderTable) => {
  const askOrBidOptions = {
    ask: { key: 'ask', text: 'text-negative', bg: 'bg-negative' },
    bid: { key: 'bid', text: 'text-positive', bg: 'bg-positive' },
  };
  const displayRows = Object.keys(rows)
    .map((key) => rows[key as unknown as number])
    .filter((k) => k);

  return (
    <section className="py-4">
      <header className="relative flex h-5 items-center px-4 pb-4 text-xs">
        <div className="flex-1">Price(USDT)</div>
        <div className="flex-1 text-right">Amount(ETH)</div>
        <div className="flex-1 text-right">Total)</div>
      </header>
      <main className="h-[320px] overflow-hidden">
        {displayRows.map((row) => {
          const { price, amount, total } = row;
          const colorSpriteWidth = (total / maxPriceSize) * 100;
          return (
            <div
              key={`${askOrBid}-${price}-${ticker}`}
              className="relative flex h-5 items-center"
            >
              <div className="z-10 flex w-full gap-2 px-4 text-xs">
                <div className={cn('flex-1', askOrBidOptions[askOrBid].text)}>
                  {price}
                </div>
                <div className="flex-1 text-right">{amount}</div>
                <div className="flex-1 text-right">{total}</div>
              </div>
              <div
                className={cn(
                  'absolute left-full right-0 top-0 z-0 h-5 w-full opacity-20',
                  askOrBidOptions[askOrBid].bg,
                )}
                style={{ transform: `translateX(-${colorSpriteWidth}%)` }}
              />
            </div>
          );
        })}
      </main>
    </section>
  );
};

export { OrderTable };
