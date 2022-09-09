/* eslint-disable import/no-extraneous-dependencies */
import { pathsToModuleNameMapper } from "ts-jest";

import { compilerOptions } from "./tsconfig.json";

export default {
  preset: "ts-jest",
  clearMocks: true,
  bail: true,
  coverageProvider: "v8",
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/modules/**/useCases/**/*.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ["text-summary", "lcov"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/src/",
  }),
  testEnvironment: "node",
  testMatch: ["**/*.spec.ts"],
};
