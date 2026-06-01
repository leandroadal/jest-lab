import { Discount } from './Discount';
import { CartItem } from './interfaces/cart-item';

export class ShoppingCart {
  private readonly _itens: CartItem[] = [];

  constructor(private readonly discount: Discount) {}

  addItem(item: CartItem): void {
    this._itens.push(item);
  }

  removeItem(index: number): void {
    this._itens.splice(index, 1);
  }

  public get items(): Readonly<CartItem[]> {
    return this._itens;
  }

  total(): number {
    return +this._itens
      .reduce((total, next) => total + next.price, 0)
      .toFixed(2);
  }

  totalWithDiscount(): number {
    return this.discount.calculate(this.total());
  }

  isEmpty(): boolean {
    return this._itens.length === 0;
  }

  clear(): void {
    console.log('Carrinho de compras foi limpo...');
    this._itens.length = 0;
  }
}
