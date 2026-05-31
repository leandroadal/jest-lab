/**
 * DIP -  Dependency Inversion Principle
 *
 * Dependa de abstrações, não de implementações concretas.
 *
 * - Módulos de alto nível não devem depender de módulos de baixo nível; ambos devem depender de abstrações (interfaces).
 */

// Neste exemplo, a classe order está dependendo de classes concretas

import { Messaging } from './services/messaging';
import { Order } from './classes/Order';
import { ShoppingCart } from './classes/ShoppingCart';
import { Persistency } from './services/Persistency';
import { Product } from './classes/Product';
import { FiftyPercentDiscount } from './classes/Discount';
import { EnterpriseCustomer } from './classes/customer';

const fiftyPercentDiscount = new FiftyPercentDiscount();
const shoppingCart = new ShoppingCart(fiftyPercentDiscount);
const messaging = new Messaging();
const persistency = new Persistency();
const enterpriseCustomer = new EnterpriseCustomer(
  'Empresa Gigante',
  '2222222222222222',
);
const order = new Order(
  shoppingCart,
  messaging,
  persistency,
  enterpriseCustomer,
);

shoppingCart.addItem(new Product('Camiseta', 49.91));
shoppingCart.addItem(new Product('Caderno', 9.9123));
shoppingCart.addItem(new Product('Lápis', 1.59));

console.log(shoppingCart.items);
console.log(shoppingCart.totalWithDiscount());
console.log(order.orderStatus);
order.checkout();
console.log(order.orderStatus);
