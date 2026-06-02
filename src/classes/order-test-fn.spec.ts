import { Order } from './Order';
import { ShoppingCartProtocol } from './interfaces/shopping-cart-protocol';
import { MessagingProtocol } from './interfaces/messaging-protocol';
import { PersistencyProtocol } from './interfaces/persistency-protocol';
import { CustomerOrder } from './interfaces/customer-protocol';

const createSut = () => {
  // jest.Mocked<T>: transforma cada método da interface em jest.fn() tipado
  // isso garante que o mock respeita o contrato da interface em tempo de compilação
  const shoppingCartMock: jest.Mocked<ShoppingCartProtocol> = {
    items: [],

    // jest.fn() sem configuração: função vazia que só rastreia chamadas
    // útil para métodos void que não precisam retornar nada
    addItem: jest.fn(),
    removeItem: jest.fn(),

    // mockReturnValue: define o valor padrão retornado em TODAS as chamadas
    // diferente de mockReturnValueOnce que vale só para a próxima chamada
    total: jest.fn().mockReturnValue(1),
    totalWithDiscount: jest.fn().mockReturnValue(2),
    isEmpty: jest.fn().mockReturnValue(false),

    clear: jest.fn(),
  };

  const messagingMock: jest.Mocked<MessagingProtocol> = {
    // jest.fn() aqui substitui o sendMessage real
    // podemos verificar se foi chamado e com quais argumentos
    sendMessage: jest.fn(),
  };

  const persistencyMock: jest.Mocked<PersistencyProtocol> = {
    // Se existisse nenhuma persistência real aconteceria, mas a chamada seria rastreada
    saveOrder: jest.fn(),
  };

  const customerMock: jest.Mocked<CustomerOrder> = {
    // mockReturnValue com string: define o retorno fixo para o teste
    // evita depender de uma implementação real de Customer
    getName: jest.fn().mockReturnValue('Luiz'),
    getIDN: jest.fn().mockReturnValue('111.111'),
  };

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
    customerMock,
  };
};

describe('Order', () => {
  // jest.clearAllMocks: reseta o rastreamento de todos os jest.fn() após cada teste
  // sem isso, chamadas de um teste "vazariam" para o próximo
  afterEach(() => jest.clearAllMocks());

  it('should not checkout if cart is empty', () => {
    const { sut, shoppingCartMock } = createSut();

    // mockReturnValueOnce: sobrescreve o retorno APENAS na próxima chamada
    // após ser consumido, volta ao valor padrão definido no mockReturnValue (false)
    shoppingCartMock.isEmpty.mockReturnValueOnce(true);

    sut.checkout();

    expect(shoppingCartMock.isEmpty).toHaveBeenCalledTimes(1);
    expect(sut.orderStatus).toBe('open');
  });

  it('should checkout if cart is not empty', () => {
    const { sut, shoppingCartMock } = createSut();

    // false já é o padrão do mock

    sut.checkout();

    expect(shoppingCartMock.isEmpty).toHaveBeenCalledTimes(1);
    expect(sut.orderStatus).toBe('closed');
  });

  it('should send an email with totalWithDiscount to customer', () => {
    const { sut, messagingMock, shoppingCartMock } = createSut();

    sut.checkout();

    // toHaveBeenCalledWith: verifica o argumento exato passado para o jest.fn()
    // shoppingCartMock.totalWithDiscount() retorna 2 (mockReturnValue definido na factory)
    expect(messagingMock.sendMessage).toHaveBeenCalledWith(
      `Seu pedido com total de ${shoppingCartMock.totalWithDiscount()} foi recebido.`,
    );
  });

  it('should call totalWithDiscount once on checkout', () => {
    const { sut, shoppingCartMock } = createSut();

    sut.checkout();

    // toHaveBeenCalled: verifica se o jest.fn() foi chamado ao menos uma vez
    expect(shoppingCartMock.totalWithDiscount).toHaveBeenCalled();

    // total() NÃO foi chamado diretamente
    // no checkout() — ele só é chamado internamente dentro do totalWithDiscount()
    // do ShoppingCart real, mas como foi usado mock, são funções independentes
    expect(shoppingCartMock.total).not.toHaveBeenCalled();
  });

  it('should save order', () => {
    const { sut, persistencyMock } = createSut();

    sut.checkout();

    expect(persistencyMock.saveOrder).toHaveBeenCalledTimes(1);
  });

  it('should clear cart after checkout', () => {
    const { sut, shoppingCartMock } = createSut();

    sut.checkout();

    expect(shoppingCartMock.clear).toHaveBeenCalledTimes(1);
  });

  it('should call customer getName and getIDN on checkout', () => {
    const { sut, customerMock } = createSut();

    sut.checkout();

    // verifica que ambos os métodos do customer foram chamados
    // o checkout usa getName e getIDN no console.log final
    expect(customerMock.getName).toHaveBeenCalledTimes(1);
    expect(customerMock.getIDN).toHaveBeenCalledTimes(1);
  });
});
