import { Persistency } from './Persistency';

describe('Persistency', () => {
  // afterEach - executa após CADA teste do describe
  // jest.clearAllMocks: limpa chamadas, instâncias e resultados de todos os mocks/spies
  // evita que dados de um teste "vazem" para o próximo
  afterEach(() => jest.clearAllMocks());

  it('should return undefined', () => {
    // sut (System Under Test): convenção para nomear o objeto sendo testado
    const sut = new Persistency();

    // verifica se o valor é undefined
    expect(sut.saveOrder()).toBeUndefined(); // não tem return, então retorna undefined por padrão
  });

  it('should call console.log once', () => {
    const sut = new Persistency();

    // jest.spyOn: cria um "espião" em um método existente de um objeto
    // permite monitorar chamadas sem substituir a implementação original
    const consoleSpy = jest.spyOn(console, 'log'); // aqui espia o método 'log' do objeto 'console'

    sut.saveOrder();

    // verifica quantas vezes o spy foi chamado
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });

  it('should call console.log with "Pedido salvo com sucesso..."', () => {
    const sut = new Persistency();
    const consoleSpy = jest.spyOn(console, 'log');

    sut.saveOrder();

    // verifica se o spy foi chamado com o argumento exato
    expect(consoleSpy).toHaveBeenCalledWith('Pedido salvo com sucesso...');
  });
});
