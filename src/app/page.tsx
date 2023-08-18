'use client';

import { ChevronDown, Growth } from '@carbon/icons-react';

import { Icons } from '~/components/atoms/Icons';
import { OrderBook } from '~/components/organims/OrderBook';

export default function Home() {
  return (
    <main className="">
      <header className="flex h-12 items-center justify-start gap-8 border-b px-2">
        <div className="flex h-12 items-center justify-start border-r">
          <Icons.Bitcoin className="h-4 w-4" />
          <span className="pl-2 pr-10">BTC/USDT</span>
          <ChevronDown />
        </div>
        <div className="inline-flex items-center justify-start gap-4">
          <span className="text-xs">29,242.18</span>
          <span className="text-xs text-muted-foreground">
            Last trade price
          </span>
        </div>
        <div className="inline-flex items-center justify-start gap-4">
          <Growth className="h-4 w-4 rotate-180 text-negative" />
          <span className="text-xs text-negative">-0.58%</span>
          <span className="text-xs text-muted-foreground">24h Change</span>
        </div>
        <div className="inline-flex items-center justify-start gap-4">
          <Growth className="h-4 w-4 text-positive" />
          <span className="text-xs text-positive">+1.038%</span>
          <span className="text-xs text-muted-foreground">24h High</span>
        </div>
        <div className="inline-flex items-center justify-start gap-4">
          <Growth className="h-4 w-4 rotate-180 text-negative" />
          <span className="text-xs text-negative">-0.69%</span>
          <span className="text-xs text-muted-foreground">24h Low</span>
        </div>
        <div className="inline-flex items-center justify-start gap-4">
          <span className="text-xs">28,022.41</span>
          <span className="text-xs text-muted-foreground">24h Volume(BTC)</span>
        </div>
        <div className="inline-flex items-center justify-start gap-4">
          <span className="text-xs">821,288,129.60</span>
          <span className="text-xs text-muted-foreground">
            24h Volume(USDT)
          </span>
        </div>
      </header>
      <section className="grid min-h-screen gap-x-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="col-span-1">
          <OrderBook />
        </div>
        <section className="col-span-3 border">
          <p>Candle Stick</p>
        </section>
      </section>
    </main>
  );
}
