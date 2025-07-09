# Dashboard Operacional - Frontend

This document provides a step-by-step guide to setting up and running the development environment, tests, and execution of the project.

## Requirements

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (recommended version: LTS)
- [npm](https://www.npmjs.com/)

## Project Setup

### 1. Clone the Repository

```sh
git clone https://tools.ages.pucrs.br/dashboard-operacional/frontend.git
cd frontend
```

### 2. Install Dependencies

```sh
npm install
```

## Running the Development Server

To start the application in development mode, run:

```sh
npm run dev
```

The project will be available at `http://localhost:5173/`.

## Testing

### Unit and Integration Tests (Vitest)

To run unit and integration tests with Vitest:

```sh
npm run test
```

### End-to-End Tests (Cypress)

To run E2E tests, first start the server:

```sh
npm run dev
```

Then, in another terminal, run Cypress:

To open the Cypress interactive interface:
```sh
npm run cypress
```

To run tests in headless mode:
```sh
npm run cypress:headless
```

## Building for Production

To generate an optimized production build, run:

```sh
npm run build
```

The final files will be available in the `build/` directory.

## Final Considerations

This project follows best practices for React development, including automated testing with Jest and Cypress. Be sure to keep dependencies updated and follow best practices when writing new tests.

If you have any questions, check the official documentation of the tools used:

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vitest](https://vitest.dev/)
- [Cypress](https://www.cypress.io/)

