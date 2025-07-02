# Contributing Guidelines

Thank you for considering contributing to this project! 
Please follow these guidelines to help us maintain a high-quality codebase.

## Getting Started

- Clone the repository and create your branch from `main`.
- Install dependencies using `npm install`.
- Make sure your code follows the existing style and conventions.

## Making Changes

- Write clear, concise commit messages.
- Add or update tests for your changes.
- Run `npm test` to ensure all tests pass before submitting a pull request.
- If you add new features or fix bugs, update the relevant documentation.

## Pull Requests

- Open a pull request with a clear description of your changes.
- Reference any related issues in your PR description.
- Ensure your branch is up to date with `main` before submitting.
- Be responsive to feedback and make requested changes promptly.

## Code of Conduct

- Be respectful and considerate in all interactions.
- Report any unacceptable behavior to the maintainers.

## Coding Standards and Conventions

- **Linting:**  
  This project uses ESLint with the Airbnb TypeScript base, Prettier, and custom rules.
    - Run `npm run lint` before committing.
    - Key rules:
        - Max 500 lines per file, max 100 lines per function (except in test files).
        - No `console` statements.
        - Enforced import sorting and code complexity limits.
        - Use consistent spacing and formatting as enforced by Prettier.

- **Formatting:**  
  Prettier is used for code formatting.
    - Use single quotes, trailing commas, and a print width of 120 characters.
    - Run `npm run format` to auto-format your code.

- **Testing:**  
  All code must be covered by unit and end-to-end tests using Jest.
    - 100% coverage is required for lines, functions, branches, and statements.
    - Place unit tests alongside source files as `*.spec.ts`.
    - Place E2E tests in the `tests/` directory as `*.e2e-spec.ts`.
    - Run `npm test` to check coverage and test results.

Please ensure your contributions follow these standards to maintain code quality and consistency.

Thank you for helping us improve this project!
