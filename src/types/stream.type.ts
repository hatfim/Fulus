export type OrderBookOrders = {
  price: number;
  amount: number;
  total: number;
};

export type OrderBook = {
  bids: OrderBookOrders[];
  asks: OrderBookOrders[];
};
