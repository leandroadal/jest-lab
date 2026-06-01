// describe: agrupa testes relacionados sob um nome
describe('Primitive values', () => {
  // it: define um caso de teste individual com descrição
  it('should test jest assertions', () => {
    const number = 10;

    // toBeLessThan: verifica se o valor é menor que o argumento
    expect(number).toBeLessThan(11);

    // toBeLessThanOrEqual: verifica se o valor é menor ou igual ao argumento
    expect(number).toBeLessThanOrEqual(10);

    // toBeCloseTo: verifica igualdade aproximada para números de ponto flutuante
    expect(number).toBeCloseTo(10.001);
    expect(number).toBeCloseTo(9.996);

    // not: inverte o que vem seguir - nesse caso, toBeNull
    expect(number).not.toBeNull();

    // toHaveProperty: verifica se o valor possui determinada propriedade
    // números em JS são objetos primitivos e herdam métodos como 'toString'
    expect(number).toHaveProperty('toString');
  });

  it('should split tests', () => {
    const number = 10;

    // toBe: comparação estrita (===)
    expect(number).toBe(10);

    // toEqual: comparação profunda de valor — para primitivos equivale ao toBe
    expect(number).toEqual(10);

    // not.toBeFalsy: garante que o valor NÃO é falsy (false, 0, '', null, undefined, NaN)
    expect(number).not.toBeFalsy();

    // toBeTruthy: garante que o valor é truthy (qualquer valor que não seja falsy)
    expect(number).toBeTruthy();

    // toBeGreaterThan: verifica se o valor é maior que o argumento
    expect(number).toBeGreaterThan(9);

    // toBeGreaterThanOrEqual: verifica se o valor é maior ou igual ao argumento
    expect(number).toBeGreaterThanOrEqual(10);
  });
});

describe('Objects', () => {
  it('should test jest assertions with objects', () => {
    const person = { name: 'Luiz', age: 30 };
    const anotherPerson = { ...person }; // cópia superficial — mesmos valores, referência diferente

    // toEqual: compara o conteúdo/estrutura profunda dos objetos
    // se fosse toBe falharia aqui pois as referências são diferentes
    expect(person).toEqual(anotherPerson);

    // toHaveProperty: verifica se o objeto possui a propriedade 'age'
    expect(person).toHaveProperty('age');

    // not.toHaveProperty: verifica que o objeto NÃO possui a propriedade 'lastName'
    expect(person).not.toHaveProperty('lastName');

    // toHaveProperty com segundo argumento: verifica a propriedade E seu valor
    expect(person).toHaveProperty('age', 30);

    // toBe em string: comparação estrita de valor primitivo dentro do objeto
    expect(person.name).toBe('Luiz');
  });
});
