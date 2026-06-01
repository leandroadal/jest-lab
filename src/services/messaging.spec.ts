import { Messaging } from './messaging';

// factory function: centraliza a criação do sut
// se o construtor mudar, só precisa atualizar aqui
const createSut = () => {
  return new Messaging();
};

describe('Messaging', () => {
  // limpa todos os mocks/spies após cada teste
  afterEach(() => jest.clearAllMocks());

  it('should return undefined', () => {
    const sut = createSut();

    expect(sut.sendMessage('teste')).toBeUndefined();
  });

  it('should call console.log with "Mensagem enviada:" and msg', () => {
    const sut = createSut();
    const consoleSpy = jest.spyOn(console, 'log');

    sut.sendMessage('teste');

    // verifica múltiplos argumentos na mesma chamada
    expect(consoleSpy).toHaveBeenCalledWith('Mensagem enviada:', 'teste');
  });

  it('should call console.log once', () => {
    const sut = createSut();
    const consoleSpy = jest.spyOn(console, 'log');

    sut.sendMessage('teste');

    // verifica se o console.log foi chamado x vezes
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
});
