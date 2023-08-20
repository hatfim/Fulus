import type { Candle } from '~/types/stream.type';

export function timeToLocal(timestamp: number): string {
  const date = new Date(timestamp * 1000); // Convert to milliseconds
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function orderByTimestampAndCheckAscending(candles: Candle[]): Candle[] {
  const sortedCandles = candles.slice().sort((a, b) => a.time - b.time);

  // eslint-disable-next-line no-plusplus
  for (let i = 1; i < sortedCandles.length; i++) {
    if (sortedCandles[i].time < sortedCandles[i - 1].time) {
      throw new Error(`Data is not sorted in ascending order at index=${i}`);
    }
  }

  return sortedCandles;
}
