import { Order, Product } from '../model/order';
import { deepClone } from '../utils/utils';

export const productsMock: Product[] = [
  {
    description: 'produckMock',
    price: 10,
  },
];

export const orderMock: Order = {
  products: deepClone(productsMock),
  status: true,
  totalProducts: 1,
  total: 10,
  id: 1,
};
