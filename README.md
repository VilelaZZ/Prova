# StockFlow

Sistema de controle de estoque desenvolvido como projeto de Hackathon Full Stack, utilizando Java Spring Boot, Angular e Expo (React Native).

## Sobre o projeto

Uma pequena empresa precisa controlar seus produtos e registrar entradas e saídas de mercadorias. Para atender a essa necessidade, foi desenvolvido o **StockFlow**, um sistema simples de controle de estoque composto por três partes:

- **Backend:** API REST desenvolvida em Java com Spring Boot.
- **Frontend Web:** interface desenvolvida com Angular.
- **Frontend Mobile:** aplicativo desenvolvido com Expo e React Native.

As duas interfaces consomem a **mesma API REST**. Dessa forma, um produto cadastrado no Angular também pode ser visualizado no aplicativo mobile, enquanto uma movimentação registrada no Expo atualiza o estoque apresentado na interface web após a atualização dos dados.

### Objetivo

Demonstrar conhecimentos técnicos de desenvolvimento Full Stack, integração entre aplicações, implementação de regras de negócio, organização de tarefas, versionamento e colaboração em equipe.

## Tecnologias utilizadas

- Java
- Spring Boot
- Maven
- Angular
- TypeScript
- Expo
- React Native
- Git e GitHub

## Como executar o projeto (Pré-requisitos)

Cada parte do sistema deve ser executada em um terminal separado. Para utilizar a aplicação completa, inicie primeiro o backend e depois as interfaces.

### 1. Backend — Java Spring Boot

Abra um terminal na pasta `backend`:

```bash
cd backend
```

Execute a aplicação utilizando o Maven Wrapper:

**Windows:**

```bash
mvnw.cmd spring-boot:run
```

**Linux/macOS:**

```bash
./mvnw spring-boot:run
```

Após a inicialização, a API estará disponível, por padrão, em:

```text
http://localhost:8080
```

### 2. Frontend Web — Angular

Abra outro terminal na pasta `frontend-web`:

```bash
cd frontend-web
```

Instale as dependências:

```bash
npm install
```

Inicie a aplicação:

```bash
npx ng serve
```

Após a compilação, acesse:

```text
http://localhost:4200
```

### 3. Frontend Mobile — Expo

Abra outro terminal na pasta `frontend-mobile`:

```bash
cd frontend-mobile
```

Instale as dependências:

```bash
npm install
```

Inicie o Expo:

```bash
npx expo start
```

O terminal exibirá um QR Code e opções para executar o aplicativo. Você poderá utilizar o Expo Go em um dispositivo compatível ou executar a aplicação em um emulador.

**Configuração da API:** verifique se o endereço da API configurado no aplicativo corresponde ao endereço em que o backend está sendo executado.

- No navegador ou emulador Android, `localhost` pode ter comportamentos diferentes dependendo do ambiente.
- Em um celular físico, utilize o endereço IP local do computador na rede, em vez de `localhost`.
- Certifique-se de que o celular e o computador estejam conectados à mesma rede.

## Integração entre as aplicações

O StockFlow utiliza uma arquitetura em que as duas interfaces se comunicam com o mesmo backend.

```text
       FRONTEND WEB                 FRONTEND MOBILE
          Angular                      Expo
             |                           |
             |                           |
             +------------+--------------+
                          |
                          v
                    API REST
                  Spring Boot
                          |
                          v
                    Banco H2
```

As operações realizadas em uma interface são persistidas pelo backend e podem ser consultadas pela outra interface.

## Equipe

Projeto desenvolvido em equipe durante o Hackathon Full Stack.

**Integrantes:**

- Lucas Fernandes Vilela
- Millene Soares de Carvalho
- Pedro Henrique Alves Gonçalves
