import { IndividualCustomer, EnterpriseCustomer } from './customer';

// factory para cliente pessoa física
const createIndividualCustomer = (
  firstName: string,
  lastName: string,
  cpf: string,
): IndividualCustomer => {
  return new IndividualCustomer(firstName, lastName, cpf);
};

// factory para cliente pessoa jurídica
const createEnterpriseCustomer = (
  name: string,
  cnpj: string,
): EnterpriseCustomer => {
  return new EnterpriseCustomer(name, cnpj);
};

// afterEach fora dos describes: aplica a limpeza de mocks para TODOS os grupos do arquivo
afterEach(() => jest.clearAllMocks());

describe('IndividualCustomer', () => {
  it('should have firstName, lastName and cpf', () => {
    const sut = createIndividualCustomer('Luiz', 'Otávio', '111.111');

    // verifica existência e valor de cada propriedade
    expect(sut).toHaveProperty('firstName', 'Luiz');
    expect(sut).toHaveProperty('lastName', 'Otávio');
    expect(sut).toHaveProperty('cpf', '111.111');
  });

  it('should have methods to get name and idn for individual customers', () => {
    const sut = createIndividualCustomer('Luiz', 'Otávio', '111.111');

    // verifica se getName() concatena firstName + lastName corretamente
    expect(sut.getName()).toBe('Luiz Otávio');

    // verifica que getIDN() retorna o CPF para pessoa física
    expect(sut.getIDN()).toBe('111.111');
  });
});

describe('EnterpriseCustomer', () => {
  it('should have name and cnpj', () => {
    const sut = createEnterpriseCustomer('Udemy', '222');

    expect(sut).toHaveProperty('name', 'Udemy');
    expect(sut).toHaveProperty('cnpj', '222');
  });

  it('should have methods to get name and idn for enterprise customers', () => {
    const sut = createEnterpriseCustomer('Udemy', '222');

    // verifica que getName() retorna só o nome para pessoa jurídica
    expect(sut.getName()).toBe('Udemy');

    // verifica que getIDN() retorna o CNPJ para pessoa jurídica
    expect(sut.getIDN()).toBe('222');
  });
});
