# jest-lab

Repositório de aprendizado pessoal do **Jest** — o framework de testes mais popular do ecossistema JavaScript/TypeScript.

## Pré-requisitos e Instalação

Para configurar o Jest com suporte a TypeScript, é necessário instalar o Jest, o compilador do TypeScript, as definições de tipos e o `ts-jest` (um pré-processador que permite ao Jest compilar TypeScript antes de rodar os testes).

### 1. Instalação das dependências

No terminal, execute o comando abaixo para instalar as dependências de desenvolvimento:

```bash
npm install --save-dev jest typescript ts-jest @types/jest
```

### 2. Inicialização das configurações

Crie os arquivos de configuração básicos utilizando os comandos abaixo:

```bash
# Inicializa o arquivo tsconfig.json do TypeScript
npx tsc --init

# Inicializa o arquivo de configuração do Jest adaptado para TypeScript
npx ts-jest config:init
```

### 3. Scripts no `package.json`

Adicione os seguintes scripts ao seu `package.json` para facilitar a execução dos testes:

```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

---

## 🔑 Principais funções

### `describe` e `it` / `test`

Organize seus testes em blocos temáticos.

```ts
describe("Calculadora", () => {
  it("deve somar dois números", () => {
    expect(1 + 1).toBe(2);
  });

  test("deve subtrair dois números", () => {
    expect(5 - 3).toBe(2);
  });
});
```

---

### Matchers Comuns (Asserções)

Os matchers são utilizados para comparar os resultados obtidos com os resultados esperados.

### `expect` + Matchers

O coração das asserções do Jest.

```ts
// Igualdade
expect(2 + 2).toBe(4);                            // ===
expect({ name: "Ana" }).toEqual({ name: "Ana" }); // igualdade profunda

// Verdadeiro / Falso
expect(true).toBeTruthy();
expect(null).toBeFalsy();
expect(null).toBeNull();
expect(undefined).toBeUndefined();

// Números
expect(10).toBeGreaterThan(5);
expect(0.1 + 0.2).toBeCloseTo(0.3); // evita erros de float

// Strings
expect("hello world").toContain("world");
expect("jest é incrível").toMatch(/incrível/);

// Arrays
expect([1, 2, 3]).toHaveLength(3);
expect([1, 2, 3]).toContain(2);

// Objetos
expect({ id: 1, name: "Ana" }).toHaveProperty("name", "Ana");

// Negação — use .not antes de qualquer matcher
expect(1 + 1).not.toBe(5);
```

### Testando erros

```ts
function dividir(a: number, b: number): number {
  if (b === 0) throw new Error("Divisão por zero");
  return a / b;
}

it("deve lançar erro ao dividir por zero", () => {
  expect(() => dividir(10, 0)).toThrow("Divisão por zero");
  expect(() => dividir(10, 0)).toThrow(Error);
});
```

---

### Testes Assíncronos

O Jest suporta testes de código assíncrono por meio de `async/await` ou manipulando Promises diretamente.

Na implementação:

```typescript
export function buscarDados(): Promise<string> {
  return new Promise((resolve) => setTimeout(() => resolve("dados recebidos"), 100));
}
```

No teste:

```typescript
import { buscarDados } from './math';

describe('Testes assíncronos', () => {
  test('deve buscar dados com async/await', async () => {
    const resultado = await buscarDados();
    expect(resultado).toBe("dados recebidos");
  });

  test('deve buscar dados validando via resolves', () => {
    return expect(buscarDados()).resolves.toBe("dados recebidos");
  });
});
```

Outros exemplos:

```ts
// Com async/await
it("deve buscar usuário", async () => {
  const user = await fetchUser(1);
  expect(user.name).toBe("Ana");
});

// Com Promises
it("deve resolver a promise", () => {
  return expect(Promise.resolve("ok")).resolves.toBe("ok");
});

it("deve rejeitar a promise", () => {
  return expect(Promise.reject(new Error("falhou"))).rejects.toThrow("falhou");
});
```

---

### Setup e Teardown (Ciclos de Vida)

Muitas vezes, é necessário executar alguma configuração antes de rodar os testes e limpar o ambiente após a execução.

```typescript
describe('Ciclo de vida dos testes', () => {
  beforeAll(() => {
    // Executa uma vez antes de todos os testes deste bloco
    console.log("Inicializando banco de dados de teste...");
  });

  afterAll(() => {
    // Executa uma vez após todos os testes deste bloco
    console.log("Fechando banco de dados de teste...");
  });

  beforeEach(() => {
    // Executa antes de cada teste individualmente
    console.log("Limpando dados temporários...");
  });

  afterEach(() => {
    // Executa após cada teste individualmente
    console.log("Teste finalizado.");
  });

  test('Teste Exemplo 1', () => {
    expect(1 + 1).toBe(2);
  });
});
```

---

### Mocks e Spies

Os Mocks permitem simular o comportamento de funções ou módulos reais para isolar a unidade de código que está sendo testada.

#### Mocks com `jest.fn()`

```ts
it("deve chamar o callback", () => {
  const callback = jest.fn();

  [1, 2, 3].forEach(callback);

  expect(callback).toHaveBeenCalledTimes(3);
  expect(callback).toHaveBeenCalledWith(1, 0, [1, 2, 3]);
});

it("deve retornar valor mockado", () => {
  const mock = jest.fn().mockReturnValue(42);

  expect(mock()).toBe(42);
});

it("mock assíncrono", async () => {
  const fetchData = jest.fn().mockResolvedValue({ id: 1, name: "Ana" });

  const result = await fetchData();
  expect(result.name).toBe("Ana");
});
```

---

#### `jest.spyOn`

Espiona métodos reais sem substituí-los completamente.

```ts
it("deve chamar console.log", () => {
  const spy = jest.spyOn(console, "log").mockImplementation(() => {});

  console.log("teste");

  expect(spy).toHaveBeenCalledWith("teste");
  spy.mockRestore(); // restaura o original
});
```

---

#### `jest.mock` — Mockando módulos

```ts
// src/emailService.ts
export const sendEmail = (to: string) => { /* lógica real */ };

// src/user.test.ts
import { sendEmail } from "./emailService";

jest.mock("./emailService"); // substitui o módulo por automock

it("deve enviar e-mail ao criar usuário", () => {
  createUser("ana@email.com");
  expect(sendEmail).toHaveBeenCalledWith("ana@email.com");
});
```

#### Quando escolher Mock (`jest.fn` / `jest.mock`) ou Spy (`jest.spyOn`)?

Embora ambos os conceitos sejam usados para monitorar o comportamento de funções em testes, eles possuem propósitos e comportamentos iniciais diferentes.

##### 1. Escolha Mock (`jest.fn` ou `jest.mock`) quando

* **Isolamento Completo:** Você deseja substituir totalmente uma dependência real que possui efeitos colaterais complexos (ex: chamadas a APIs externas, consultas a bancos de dados, leitura de arquivos).
* **Ausência de Comportamento Real:** A lógica interna da dependência não importa para o teste atual, apenas o valor que ela retorna.
* **Funções de Callback:** Você precisa criar uma função genérica (fictícia) para passar como argumento para outra função e verificar se ela foi executada corretamente.

**Exemplo de uso (`jest.fn`):**

```typescript
// Substitui a função de envio de e-mail por uma versão vazia que apenas registra as chamadas
const enviarEmailMock = jest.fn().mockReturnValue(true);

test('deve processar cadastro mesmo sem enviar e-mail real', () => {
  const resultado = processarCadastro("user@email.com", enviarEmailMock);
  expect(enviarEmailMock).toHaveBeenCalledWith("user@email.com");
});
```

---

##### 2. Escolha Spy (`jest.spyOn`) quando

* **Preservar a Implementação Original:** Você deseja verificar se um método foi chamado e com quais argumentos, mas ainda quer que o código original desse método seja executado.
* **Sobrescrita Temporária:** Você quer modificar temporariamente o comportamento de apenas um método específico de uma classe ou objeto, mas planeja restaurar o comportamento original logo em seguida para não afetar outros testes.
* **Espionar Bibliotecas Terceiras:** Você deseja monitorar chamadas a métodos de um objeto importado globalmente (como o objeto `Math` ou `console`).

**Exemplo de uso (`jest.spyOn`):**

```typescript
test('deve registrar mensagens no console sem impedir a exibição', () => {
  const consoleSpy = jest.spyOn(console, 'log');

  // Executa o método que internamente chama o console.log
  minhaFuncaoComLog();

  // Verifica se o console.log foi chamado
  expect(consoleSpy).toHaveBeenCalled();

  // Restaura a implementação original do console.log para os próximos testes
  consoleSpy.mockRestore();
});
```

---

##### Tabela Comparativa

| Critério | Mock (`jest.fn` / `jest.mock`) | Spy (`jest.spyOn`) |
| :--- | :--- | :--- |
| **Implementação original** | É descartada. Por padrão, retorna `undefined` a menos que seja configurado um retorno. | É mantida por padrão (a menos que você configure explicitamente uma implementação substituta). |
| **Alvo principal** | Funções isoladas, callbacks ou módulos inteiros importados. | Métodos específicos pertencentes a um objeto ou classe existente. |
| **Restauração** | Difícil de restaurar o comportamento original, pois a função foi substituída ou criada do zero. | Simples de restaurar para o estado original utilizando o método `.mockRestore()`. |
| **Caso de uso comum** | Simular uma chamada de API (`axios.get`) ou um driver de banco de dados. | Verificar se um método de log ou de auditoria de um serviço foi executado. |

---

## Cobertura de Código (Code Coverage)

A cobertura de código analisa quais partes do seu código-fonte foram de fato executadas durante os testes automatizados.

### Como Executar

Para gerar o relatório de cobertura, execute o comando:

```bash
npm run test:coverage
# ou
npx jest --coverage
```

### Como Ler os Resultados

Após executar o comando com a flag de cobertura, o Jest gera uma tabela no terminal com as seguintes métricas:

* **% Stmts (Statements):** Percentual de declarações/instruções de código que foram executadas.
* **% Branch (Branches):** Percentual de caminhos de decisão (estruturas de controle como `if/else`, `switch/case`) executados.
* **% Funcs (Functions):** Percentual de funções declaradas que foram invocadas.
* **% Lines (Lines):** Percentual de linhas de código que foram executadas.
* **Uncovered Line #s:** Indica em quais linhas específicas do arquivo o fluxo do teste não passou.

## 📖 Referências

* [Documentação oficial do Jest](https://jestjs.io/docs/getting-started)
