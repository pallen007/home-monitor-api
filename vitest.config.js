"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("vitest/config");
exports.default = (0, config_1.defineConfig)({
    test: {
        environment: 'node',
        globals: true,
        include: ['src/__test__/**/*.ts', 'src/**/*.{test,spec}.ts'],
    },
});
