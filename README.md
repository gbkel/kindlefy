<p align="center">
	<img src="./typescript_icon.png" height="150" width="150" alt="icon example" />
</p>	

<h3 align="center">
  A ready-to-use Typescript Project Template 🌉
</h3>

<p align="center">
	<a href="https://github.com/microsoft/TypeScript">
		<img alt="typescript" src="https://camo.githubusercontent.com/41c68e9f29c6caccc084e5a147e0abd5f392d9bc/68747470733a2f2f62616467656e2e6e65742f62616467652f547970655363726970742f7374726963742532302546302539462539322541412f626c7565">
	</a>
</p>

## 📌 Overview

That's a ready to use Typescript Project Template to help you creating typescript apps fastly since we know the most painful part of it is setting up a basic and useful environment.

## 🕋 What you are able to
**1. Path Aliases:** You can create path aliases following the example on tsconfig.json and package.json.
```ts
// Instead of doing that
import { App } from "./src/App"

// Do that
import { App } from "~/App"
```

**2. Tests:** You can create unit tests (App.spec.ts) and integration tests (App.test.ts).
```sh
# Run all tests
npm test

# Run integration tests
npm run test:integration

# Run unit tests
npm run test:unit
```

**3. Docker Resources:** You can add docker resources to your project using the docker-compose (docker-compose.yaml) file.
```sh
npm run dev:resources
```

**4. Git Hooks:** With help of Husky (.huskyrc.json), all Git Commits are verified by tests and the git commit linter in order to ensure they follow the Git Karma principles. Besides, all Git Pushes are verified by a full test pipeline.

**5. Code Style/Quality Assurance:** With help of ESLint (.eslintrc.json), all the code inside source folder are verified in order to make sure it follows the rules you have set.

## 🔧 Technologies

- Typescript
- Husky
- Lint Staged
- ESLint
- Jest
- Git Commit Message Linter

## 🚀 Getting started

### Development
1. Clone this repository
2. Start coding
```sh
# Use this command to test without settings up unit and integration tests
npm run dev

# Use this command to test with unit and integration tests
npm run test
```

### Production
1. Run the following commands
```sh
# Run all tests
npm run test

# Build application
npm run build

# Run built application
npm start
```
