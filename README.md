# ⚡ Lumi - Teste Técnico | Desenvolvedor Full Stack

Este repositório apresenta a solução para o desafio de extração e exibição de dados de faturas de energia elétrica, utilizando uma arquitetura escalável baseada em Clean Architecture com NestJS, Prisma e PostgreSQL.

---

## 🚀 Tecnologias Utilizadas

- **Backend:** [NestJS](https://nestjs.com/)
- **ORM:** Prisma
- **Banco de dados:** PostgreSQL
- **PDF Parser:** pdf-parse
- **Arquitetura:** Clean Architecture
- **Containerização:** Docker + Docker Compose
- **Armazenamento de Arquivos:** Local FileSystem

---

## 📦 Como rodar o projeto

> Certifique-se de ter o **Docker** e **Docker Compose** instalados na sua máquina.

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/teste-lumi.git
cd teste-lumi/backend

# Suba a aplicação
docker-compose up --build
```

A API ficará disponível em:  
👉 `http://localhost:3000`

---

## 🔧 Endpoints principais

### 📤 Upload de Fatura (PDF)

```http
POST /invoices/upload
Content-Type: multipart/form-data
Campo: files (array de arquivos PDF)
```

**Resposta esperada:**

```json
[
  {
    "file": "arquivo.pdf",
    "status": "ok",
    "result": {
      "clientNumber": "123456789",
      "referenceMonth": "04/2024",
      "valorTotalSemGD": 123.45,
      "economiaGD": 67.89
    }
  }
]
```

---

### 📥 Download do PDF da Fatura

```http
GET /bills/download/:id
```

Faz o download do arquivo PDF vinculado à fatura com o ID especificado.

---

### 🧾 Criar Cliente manualmente

```http
POST /clients
```

```json
{
  "number": "123456789"
}
```

---

### 📄 Criar Fatura manualmente

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

## 🧠 Arquitetura do Backend

Organizado com base em **Clean Architecture**, com camadas bem definidas:

```bash
modules/
├── bills/
│   ├── application/        # Casos de uso
│   ├── domain/             # Entidades, interfaces e contratos
│   ├── infra/              # Implementações concretas (e.g. PDF parser, storage)
│   └── interface/          # Controllers HTTP
├── clients/
│   ├── application/
│   ├── domain/
│   ├── infra/
│   └── interface/
└── shared/                 # PrismaService, módulos globais
```

---

## 📂 Armazenamento de Arquivos PDF

Os arquivos PDF são armazenados localmente em:

```
uploads/invoices/
```

O nome do arquivo segue o formato:  
📄 `clientNumber-referenceMonth.pdf`

---

## 🧠 Autor

Feito com ☕ por **Marx**  

Entre em contato no [LinkedIn](https://www.linkedin.com/in/marx-roberto/)
