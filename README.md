# Lumi - Teste Técnico | Desenvolvedor Full Stack Pleno

Este repositório apresenta a solução para o desafio de extração e exibição de dados de faturas de energia elétrica, utilizando uma arquitetura escalável baseada em Clean Architecture com NestJS, Prisma e PostgreSQL.

---

## 🚀 Tecnologias

- **Backend:** [NestJS](https://nestjs.com/)
- **ORM:** Prisma
- **Banco de dados:** PostgreSQL
- **PDF Parser:** pdf-parse
- **Arquitetura:** Clean Architecture
- **Containerização:** Docker + Docker Compose

---

## 📦 Como rodar o projeto

> Certifique-se de ter o Docker e Docker Compose instalados.

```bash
# Clone o repositório
$ git clone https://github.com/seu-usuario/teste-lumi.git
$ cd teste-lumi/backend

# Suba a aplicação
$ docker-compose up --build
```

A API ficará disponível em `http://localhost:3000`

---

## 🔧 Endpoints principais

### 🔹 Upload de Fatura (PDF)

```http
POST /invoices/upload
Content-Type: multipart/form-data
Campo: file
```

**Resposta esperada:**
```json
{
  "message": "Fatura processada com sucesso",
  "client": {
    "id": "uuid",
    "number": "123456789"
  },
  "bill": {
    "id": "uuid",
    "referenceMonth": "2024-04-01T00:00:00.000Z",
    "consumoTotal": 526,
    "economiaGD": 0
  }
}
```

### 🔹 Criar Cliente manualmente

```http
POST /clients
```

```json
{
  "number": "123456789"
}
```

### 🔹 Criar Fatura manualmente

```http
POST /bills
```

```json
{
  "clientId": "uuid-do-cliente",
  "referenceMonth": "2024-04-01",
  "energiaEletricaKwh": 50,
  "energiaEletricaValor": 100,
  "energiaSceeKwh": 476,
  "energiaSceeValor": 200,
  "energiaCompensadaKwh": 0,
  "energiaCompensadaValor": 0,
  "contribIlumPublicaValor": 10
}
```

---

## 💡 Arquitetura do Backend (Clean Architecture)

```txt
modules/
└── bills/
    ├── application/
    │   └── use-cases/
    │       └── process-invoice.use-case.ts
    ├── domain/
    │   ├── entities/
    │   ├── repositories/
    │   └── services/
    ├── infra/
    │   └── services/
    └── interface/
        └── controllers/
```

- `interface`: camada que lida com HTTP
- `application`: onde ficam os use-cases
- `domain`: entidades, interfaces e contratos
- `infra`: implementações concretas (ex: parser PDF)
