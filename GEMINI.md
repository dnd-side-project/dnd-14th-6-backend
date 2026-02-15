# Gemini Context: dnd-14th-6-backend

## Project Overview

This is a **NestJS** backend application for the DND 14th cohort, team 6. It utilizes **PostgreSQL** as the database, managed by **Prisma ORM**. The project is set up with **PNPM** as the package manager and includes strict linting and formatting rules.

### Key Technologies
*   **Framework**: NestJS v11
*   **Language**: TypeScript
*   **Database**: PostgreSQL
*   **ORM**: Prisma
*   **Package Manager**: PNPM
*   **API Documentation**: Swagger (OpenAPI)
*   **Real-time**: Server-Sent Events (SSE) support

## Getting Started

### Prerequisites
*   Node.js (Check `.nvmrc` for specific version)
*   PNPM (`npm install -g pnpm`)
*   PostgreSQL Database

### Installation
```bash
# Install dependencies
pnpm install
```

### Database Setup
Ensure your `.env` file is configured with the correct `DATABASE_URL`.

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations (if applicable)
npx prisma migrate dev
```

### Running the Application
```bash
# Development mode (watch)
pnpm run start:dev

# Production mode
pnpm run start:prod
```

The application runs on port `3000` by default (or `PORT` env var).
Global API prefix is set to `/api`.
Swagger documentation is available at `/api-docs`.

## Key Commands

| Command | Description |
| :--- | :--- |
| `pnpm build` | Compiles the application to `dist/` |
| `pnpm test` | Runs unit tests using Jest |
| `pnpm test:e2e` | Runs end-to-end tests |
| `pnpm lint` | Lints code using ESLint |
| `pnpm format` | Formats code using Prettier |

## Project Structure

*   `src/`: Main source code
    *   `main.ts`: Application entry point (bootstrap).
    *   `app.module.ts`: Root module.
    *   `config/`: Configuration files (e.g., Swagger).
    *   `prisma/`: Prisma service and module.
    *   `common/`: Shared utilities, interceptors, and interfaces.
*   `prisma/`: Database schema (`schema.prisma`) and migrations.
*   `test/`: E2E tests configuration.
*   `.github/`: GitHub Actions workflows (`develop.yml`) and templates.

## Development Standards

### Git Conventions
Commit messages should follow the format: `tag: message` (Tag in lowercase).

| Tag | Description |
| :--- | :--- |
| `fix` | Bug fix |
| `refactor` | Code refactoring |
| `docs` | Documentation updates |
| `chore` | Build tasks, package manager configs, etc. |
| `init` | Project initialization |
| `hotfix` | Urgent fixes for production |
| `remove` | Removing code/files |
| `rename` | Renaming files |
| `test` | Test related changes |

### Git Flow
*   `main`: Production/Release branch.
*   `develop`: Default development branch.

### PR Process
1.  Create PR.
2.  Request AI Agent review (e.g., Gemini, Copilot).
3.  Address AI feedback.
4.  Human review.
5.  Address Human feedback.
6.  Merge.
