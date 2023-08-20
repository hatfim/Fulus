export interface ITickerShape {
  symbol: string;
  tickSize: number;
}

export type TOrderRow = {
  price: TPriceDisplay;
  amount: number;
  total: number;
};

export type TOrderRowUntotaled = {
  price: TPriceDisplay;
  amount: number;
  total?: number;
};

export type TAskOrBid = 'ask' | 'bid';

type TPriceDisplay = string;
type TPrice = number;
type TSize = number;
export type TOrderDeltaForDisplay = [TPriceDisplay, TSize];
export type TOrderDelta = {
  price: TPrice;
  amount: number;
  total: number;
};

export interface ICryptoFacilitiesWSSnapshot {
  product_id: string;
  numLevels: number;
  feed: string;
  bids: TOrderDelta[];
  asks: TOrderDelta[];
}

export interface IOrderRowHash {
  [key: number]: TOrderRow;
}

export interface IOrderBookState {
  symbol: string;
  asks: IOrderRowHash;
  bids: IOrderRowHash;
  maxPriceSize: number;
}

export interface ISourceOrderBook {
  product_id: string;
  numLevels: number;
  feed: string;
  asks: { [key: number]: TOrderDelta };
  bids: { [key: number]: TOrderDelta };
}

export interface IGranularOrderDelta {
  product_id: string;
  feed: string;
  asks: TOrderDelta[];
  bids: TOrderDelta[];
}

export interface IOHLCVData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
