# AgentApply

AgentApply is a lightweight browser automation platform that automatically fills and submits job applications on a mock Applicant Tracking System (ATS). The project focuses on reliability engineering concepts including form filling, failure logging, retry mechanisms, and application tracking.

## Table of contents

- [AgentApply](#agentapply)
  - [Table of contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Project Structure](#project-structure)
  - [Working](#working)
  - [Development](#development)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)
    - [Testing](#testing)
      - [All Tests](#all-tests)
      - [Unit Tests](#unit-tests)
      - [Integration Tests](#integration-tests)
      - [E2E (End-to-end) Tests](#e2e-end-to-end-tests)

## Features

- **Intelligent Browser Agent**: Stagehand-powered automation with smart selector fallbacks.
- **Application Tracking**: Complete lifecycle management from PENDING to SUCCESS/FAILED.
- **Automatic Retry**: Built-in retry mechanism with exponential backoff.
- **Failure Logging**: Detailed failure logs with screenshots and context.
- **Real-time Dashboard**: Visual overview of all applications and their status.
- **Dark Mode Support**: Full dark/light theme support with system preference detection.
- **Job Selection**: Browse and select from available positions in the mock ATS.
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile.

## Tech Stack

- Web app: React.js + TypeScript + Tailwind CSS + Vite
- API app: Node.js + Express.js + Prisma + PostgreSQL
- Agent app: Node.js + Stagehand (Browser Automation) + Prisma + PostgreSQL
- ATS app: Node.js + Express.js + Prisma + PostgreSQL
- Testing: Vitest + Supertest + Playwright (E2E)
- Package Management: pnpm + Turborepo
- Deployment: Docker + Docker Compose + GitHub Actions (CI/CD) + [Vercel](https://vercel.com) (frontend) + [Render](https://render.com) (backend) + [Neon](https://neon.com) (database)

## Project Structure

```text
agentapply/
├── .github/
│   └── workflows/                     # GitHub Actions workflows
├── apps/
│   ├── web/                           # React.js frontend app
│   │   ├── src/
│   │   │   ├── assets/                # Static assets
│   │   │   ├── components/            # Reusable components
│   │   │   ├── features/              # Feature modules
│   │   │   ├── hooks/                 # Custom hooks
│   │   │   ├── layouts/               # Layout components
│   │   │   ├── pages/                 # Page components
│   │   │   ├── services/              # API services
│   │   │   ├── styles/                # Global styles
│   │   │   ├── routes/                # Route configuration
│   │   │   ├── types/                 # TypeScript types
│   │   │   ├── utils/                 # Utility functions
│   │   │   ├── config/                # App configuration
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   └── index.html
│   │   ├── vite.config.ts
│   │   ├── vitest.config.ts
│   │   ├── package.json
│   │   └── Dockerfile
│   ├── api/                          # API Gateway and Backend Service
│   │   ├── index.ts                  # Native Node.js HTTP Proxy (delegates to v1)
│   │   ├── package.json       
│   │   └── v1/                       # Version 1 API Application
│   │       ├── tsconfig.json       
│   │       └── src/                  # Express application logic
│   ├── agent/                        # Browser Automation Worker
│   │   ├── index.ts                  # Native Node.js HTTP Proxy (delegates to v1)
│   │   ├── package.json       
│   │   └── v1/                       # Version 1 Agent Application
│   │       ├── tsconfig.json       
│   │       └── src/                  # Express runner listener for Stagehand orchestration  
│   └── ats/                          # Isolated Mock Job Portal Service
│       ├── package.json       
│       └── src/       
│           └── index.ts              # Express app serving static application forms
├── packages/
│   ├── e2e-tests/                     # Playwright E2E tests
│   ├── eslint-config/                 # Shared ESLint config
│   └── tsconfig/                      # Shared TypeScript config
├── docker-compose.yml
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── package.json
└── turbo.json
```

## Working

The system operates as an In-Process Module Proxy system across three main backend components:

```text
                       ┌────────────────┐
                       │  React.js App  |
                       └────────────────┘
                               |         
                               │  Create App
                               │
                               ▼
                       ┌────────────────┐
                       │    API App     │
                       └────────────────┘
                               │   
      Trigger Internal /start  │  Update Status via Database
                               |
                               ▼
                       ┌──────────────┐
                       │   Agent App  │
                       │  (Stagehand) │
                       └──────────────┘
                               |   
                               |  Launch script 
                               |
                               ▼
                       ┌──────────────┐
                       │   Mock ATS   │
                       │   (Express)  │
                       └──────────────┘
```

1. Dispatch: The user creates a job submission via the API. The API service uses AgentClientService to signal the Agent App's internal `/start` endpoint.

2. Proxy Layer: The root `index.ts` files inside `apps/api` and `apps/agent` use Node's native `node:http` module to forward HTTP requests directly to the in-memory v1 Express instances without network overhead.

3. Execution: The Agent App initializes Stagehand/Playwright, navigating directly to the configured target `atsUrl` (such as the standalone Mock ATS).

4. Interaction: The agent automatically inspects form fields, fills in applicant credentials, and clicks submit.

5. Feedback Loop: As execution progresses, Stagehand emits log events back to the primary database, updating the user dashboard timeline in real time.

## Development

### Prerequisites

- Node.js (preferably, version >= v24.x)
- PostgreSQL (preferably, version >= v18.x)
- pnpm (preferably, version >= v11.5.2)
- Docker (preferably the latest version)
- Git (preferably the latest version)

### Setup

To modify and use this project locally on your system, follow these steps:

1. Clone the project's repository.

   ```shell
   git clone https://github.com/rajatyadav01/agentapply.git
   ```

2. Go to the project folder using the CLI.

   ```shell
   cd agentapply
   ```

3. Install all dependencies at the root of the monorepo using pnpm.

   ```shell
   pnpm install
   ```

4. Rename the `.env.example` file to `.env` at the root of the monorepo.

5. Create an `user` with `password` and a `database` using the created `user` as owner in the PostgreSQL database since those are required to connect to the database. For this, you can either use the default values from the `env.example` file or use different values. Also, values of other variables can also be either used from the `env.example` file or different values based on your preference.

6. Apply the migrations to setup the database using `Prisma`.

   ```shell
   pnpm db:migrate
   ```

7. Run the `Express` api app.

   ```shell
   pnpm dev:api
   ```

8. Open a different instance of the CLI that you are using or another instance of the code editor and run the `Express` agent app.

   ```shell
   pnpm dev:agent
   ```

9. Open a different instance of the CLI and run the `Express` ats app.

   ```shell
   pnpm dev:ats
   ```

10. Open a different instance of the CLI and run the `React.js` web app.

    ```shell
    pnpm dev:web
    ```

11. After all the apps have been started, open any browser and go to `http://localhost:5173` to access the web application.<br /><br />

To setup the project using Docker:

1. Clone the project's repository.

   ```shell
   git clone https://github.com/rajatyadav01/agentapply.git
   ```

2. Go to the project folder using the CLI.

   ```shell
   cd agentapply
   ```

3. Run the project using docker-compose.

   ```shell
   docker-compose up --build
   ```

4. After all the containers have been started, open any browser and go to `http://localhost:5175` to access the web application.

### Testing

To run a test suite, run the script at the root of the monorepo.

#### All Tests

```shell
pnpm test
```

#### Unit Tests

```shell
pnpm test:unit
```

#### Integration Tests

```shell
pnpm test:integration
```

#### E2E (End-to-end) Tests

```shell
pnpm test:e2e
```
