import type { IOrderRowHash, TOrderRowUntotaled } from '~/types/feed.type';
import type { OrderBook } from '~/types/stream.type';

import { add, afterDecimal } from './safe-math';

export const sortOrderBook = (orderBook: OrderBook) => {
  orderBook.asks.sort((a, b) => a.price - b.price);
  orderBook.bids.sort((a, b) => b.price - a.price);
};

export const calcOrderBookTotal = (orderBook: OrderBook) => {
  Object.values(orderBook).forEach((orders) => {
    orders.forEach((order, idx) => {
      // eslint-disable-next-line no-param-reassign
      order.total =
        idx === 0 ? order.amount : add(order.amount, orders[idx - 1].total);
    });
  });
};

const roundDownToTickDecimals = (
  input: number,
  tickSize: number,
  decimalPlace: number,
) => {
  if (decimalPlace === 0) {
    return Math.floor(input);
  }
  // round down input to the decimal of the tickSize
  const roundedToDecimalOfTickSize =
    Math.floor(input * 10 ** decimalPlace) / 10 ** decimalPlace;
  // Divide the rounded by the floor(tickSize)
  const roundedDown = parseFloat(
    (
      Math.floor(
        parseFloat((roundedToDecimalOfTickSize / tickSize).toFixed(10)),
      ) * tickSize
    ).toFixed(decimalPlace),
  );
  return roundedDown;
};

export const groupTickRows = (
  orderDeltas: { [key: number]: TOrderRowUntotaled },
  tickSize: number,
): IOrderRowHash => {
  const decimalPlace = afterDecimal(tickSize);

  let newtotal = 0;

  const grouping = Object.keys(orderDeltas)
    .map((key: string) => orderDeltas[parseFloat(key)])
    .sort((a, b) => {
      return parseFloat(a.price) - parseFloat(b.price);
    })
    .filter((k) => k)
    .map((delta) => {
      const { price, amount } = delta;
      newtotal += amount;
      return {
        price: roundDownToTickDecimals(
          parseFloat(price),
          tickSize,
          decimalPlace,
        ).toFixed(decimalPlace),
        amount,
        total: newtotal.toFixed(4),
      };
    })
    .reduce((acc, curr) => {
      return {
        ...acc,
        [curr.price]: curr,
      };
    }, {});
  return grouping;
};
