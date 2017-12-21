/* cSpell:disable */

const watching = process.env.npm_lifecycle_script.indexOf("--single-run") === -1;

module.exports = function (config) {
    config.set({
        browserNoActivityTimeout: 20000,
        frameworks: ["jasmine", "karma-typescript"],
        files: [
            { pattern: "spec/**/*.ts" },
            { pattern: "src/**/*.ts" },
        ],
        preprocessors: {
            "**/*.ts": ["karma-typescript"],
        },
        reporters: ["progress", "karma-typescript"],
        browsers: ["Chrome"],
        plugins: [
            "karma-chrome-launcher",
            "karma-jasmine",
            "karma-typescript"
        ],
        customLaunchers: {
            chromeTravisCi: {
                base: "Chrome",
                flags: ["--no-sandbox"]
            }
        },
        karmaTypescriptConfig: {
            coverageOptions: {
                instrumentation: true
            },
            compilerOptions: {
                "lib": [
                    "es2016",
                    "dom"
                ]
            },
            reports: {
                lcovonly: {
                    directory: "coverage",
                    filename: "lcov.info",
                    subdirectory: "lcov"
                }
            }
        }
    });

    if (watching) {
        config.karmaTypescriptConfig.coverageOptions.instrumentation = false;
    }

    if (process.env.TRAVIS) {
        config.browsers = ["chromeTravisCi"];
    }
};