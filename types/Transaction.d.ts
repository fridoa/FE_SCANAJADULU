export interface ITransactionItem {
  product_id: string;
  name: string;
  current_price: number;
  quantity: number;
  subtotal: number;
}

export interface ITransaction {
  _id?: string;
  transaction_date: Date;
  total_price: number;
  money_receive: number;
  money_return: number;
  items: ITransactionItem[];
}