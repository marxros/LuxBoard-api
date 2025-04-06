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
git clone https://github.com/marxros/LuxBoard-api.git
cd LuxBoard-api

# Suba a aplicação
docker-compose up --build
```

A API ficará disponível em:  
👉 `http://localhost:3000`

---

## 🧠 Arquitetura do Backend

Organizado com base em **Clean Architecture**, com camadas bem definidas:

```bash
LuxBoard-api/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── modules/
│   │   ├── bills/
│   │   │   ├── application/
│   │   │   │   ├── dto/
│   │   │   │   └── use-cases/
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   ├── repositories/
│   │   │   │   └── services/
│   │   │   └── infra/
│   │   │       ├── controllers/
│   │   │       ├── presenters/
│   │   │       └── storage/
│   │   └── clients/
│   │       ├── application/
│   │       │   ├── dto/
│   │       │   └── use-cases/
│   │       ├── domain/
│   │       │   ├── entities/
│   │       │   └── repositories/
│   │       └── infra/
│   │           └── controllers/
│   ├── shared/
│   │   └── prisma.service.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   └── main.ts
├── test/
├── .eslintrc.js
├── .gitignore
├── .prettierrc
├── Dockerfile
├── README.md
├── docker-compose.yml
├── jest.config.ts
├── nest-cli.json
├── package-lock.json
├── package.json
├── tsconfig.build.json
└── tsconfig.json               # PrismaService, módulos globais
```

## 🧠 Autor

Feito com ☕ por **Marx**  

Entre em contato no [LinkedIn](https://www.linkedin.com/in/marx-roberto/)
