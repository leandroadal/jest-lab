/* eslint-disable @typescript-eslint/no-unused-vars */
import { Order } from './Order';
import { ShoppingCartProtocol } from './interfaces/shopping-cart-protocol';
import { CartItem } from './interfaces/cart-item';
import { MessagingProtocol } from './interfaces/messaging-protocol';
import { PersistencyProtocol } from './interfaces/persistency-protocol';
import { CustomerOrder } from './interfaces/customer-protocol';

// mock manual: implementa a interface com valores fixos/vazios
// diferente do spyOn (que espia um objeto real), aqui controlamos
// totalmente o comportamento de cada dependência do Order
class ShoppingCartMock implements ShoppingCartProtocol {
  get items(): Readonly<CartItem[]> {
    return [];
  }
  addItem(_item: CartItem): void {}
  removeItem(_index: number): void {}
  total(): number {
    return 1;
  }
  totalWithDiscount(): number {
    return 2;
  }
  // retorna false por padrão — pode ser sobrescrito com mockReturnValueOnce nos testes
  isEmpty(): boolean {
    return false;
  }
  clear(): void {}
}

class MessagingMock implements MessagingProtocol {
  sendMessage() {}
}

class PersistencyMock implements PersistencyProtocol {
  saveOrder() {}
}

class CustomerMock implements CustomerOrder {
  getName() {
    return '';
  }
  getIDN() {
    return '';
  }
}

// factory retorna o sut e todos os mocks — cada teste desestrutura só o que precisa espiar
const createSut = () => {
  const shoppingCartMock = new ShoppingCartMock();
  const messagingMock = new MessagingMock();
  const persistencyMock = new PersistencyMock();
  const customerMock = new CustomerMock();
  const sut = new Order(
    shoppingCartMock,
    messagingMock,
    persistencyMock,
    customerMock,
  );
  return {
    sut,
    shoppingCartMock,
    messagingMock,
    persistencyMock,
  };
};

describe('Order', () => {
  it('should not checkout if cart is empty', () => {
    const { sut, shoppingCartMock } = createSut();

    // mockReturnValueOnce: sobrescreve o retorno do mock APENAS na próxima chamada
    // aqui força isEmpty() a retornar true, simulando carrinho vazio
    const shoppingCartMockSpy = jest
      .spyOn(shoppingCartMock, 'isEmpty')
      .mockReturnValueOnce(true);

    sut.checkout();

    expect(shoppingCartMockSpy).toHaveBeenCalledTimes(1);
    // pedido deve continuar 'open' pois o carrinho está vazio
    expect(sut.orderStatus).toBe('open');
  });

  it('should checkout if cart is not empty', () => {
    const { sut, shoppingCartMock } = createSut();

    // simula carrinho com itens
    // ShoppingCartMock já retorna false por padrão, mas o mockReturnValueOnce
    // torna a intenção do teste explícita
    const shoppingCartMockSpy = jest
      .spyOn(shoppingCartMock, 'isEmpty')
      .mockReturnValueOnce(false);

    sut.checkout();

    expect(shoppingCartMockSpy).toHaveBeenCalledTimes(1);
    // pedido deve ser 'closed' após checkout bem-sucedido
    expect(sut.orderStatus).toBe('closed');
  });

  it('should send an email to customer', () => {
    const { sut, messagingMock } = createSut();

    // verifica se Order chama sendMessage para notificar o cliente
    const messagingMockSpy = jest.spyOn(messagingMock, 'sendMessage');
    sut.checkout();

    expect(messagingMockSpy).toHaveBeenCalledTimes(1);
  });

  it('should save order', () => {
    const { sut, persistencyMock } = createSut();

    // verificar se o checkout o chama saveOrder
    const persistencyMockSpy = jest.spyOn(persistencyMock, 'saveOrder');
    sut.checkout();

    expect(persistencyMockSpy).toHaveBeenCalledTimes(1);
  });

  it('should clear cart', () => {
    const { sut, shoppingCartMock } = createSut();

    // espia clear para verificar que o carrinho é limpo após o checkout
    const shoppingCartMockSpy = jest.spyOn(shoppingCartMock, 'clear');
    sut.checkout();

    expect(shoppingCartMockSpy).toHaveBeenCalledTimes(1);
  });
});
