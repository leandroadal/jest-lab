import { Product } from './Product';

// factory function com parâmetros: permite criar o sut com valores diferentes por teste
const createSut = (name: string, price: number): Product => {
  return new Product(name, price);
};

describe('Product', () => {
  afterEach(() => jest.clearAllMocks());

  it('should have properties name and price', () => {
    const sut = createSut('Camiseta', 49.9);

    // verifica que a propriedade 'name' existe E vale 'Camiseta'
    expect(sut).toHaveProperty('name', 'Camiseta');

    // usado para floats pois evita erros de precisão binária
    // 49.9 internamente pode ser 49.900000000000006
    expect(sut.price).toBeCloseTo(49.9);
  });
});
