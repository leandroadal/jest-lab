import {
  Discount,
  FiftyPercentDiscount,
  NoDiscount,
  TenPercentDiscount,
} from './Discount';

// factory function genérica: recebe a CLASSE como argumento em vez de uma instância
// 'new () => Discount' é um construtor que não recebe parâmetros e retorna Discount
// permite reutilizar a factory para qualquer subclasse de Discount
const createSut = (className: new () => Discount): Discount => {
  return new className();
};

describe('Discount', () => {
  afterEach(() => jest.clearAllMocks());

  it('should have no discount', () => {
    // passa a classe NoDiscount como argumento — a factory instancia ela internamente
    const sut = createSut(NoDiscount);

    // garante que 10.99 sem desconto continua sendo ~10.99
    expect(sut.calculate(10.99)).toBeCloseTo(10.99);
  });

  it('should apply 50% discount on price', () => {
    const sut = createSut(FiftyPercentDiscount);

    // 150.5 * 0.5 = 75.25 — toBeCloseTo lida com possível imprecisão de float
    expect(sut.calculate(150.5)).toBeCloseTo(75.25);
  });

  it('should apply 10% discount on price', () => {
    const sut = createSut(TenPercentDiscount);

    // 10 * 0.9 = 9
    expect(sut.calculate(10)).toBeCloseTo(9);
  });
});
