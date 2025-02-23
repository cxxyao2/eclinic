import { defineConfig } from "cypress";

export default defineConfig({

  component: {
    devServer: {
      framework: "angular",
      bundler: "webpack",
    },
    specPattern: "**/*.cy.ts",
  },
  e2e: {
    baseUrl: 'http://localhost:4200',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    backendURL: 'http://localhost:5215',
    viewport_w: 2560,
    viewport_h: 1440,
  }
});



