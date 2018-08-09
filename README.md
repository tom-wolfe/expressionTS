# expressionTS  [![NPM version](https://badge.fury.io/js/expressionts.svg)](http://badge.fury.io/js/expressionts)

[![Build Status](https://travis-ci.org/trwolfe13/expressionTS.svg?branch=master)](https://travis-ci.org/trwolfe13/expressionTS) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/a41fe0aa8b904edbbb68ce9132e44373)](https://www.codacy.com/app/trwolfe13/expressionTS?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=trwolfe13/expressionTS&amp;utm_campaign=Badge_Grade) [![Codacy Badge](https://api.codacy.com/project/badge/Coverage/a41fe0aa8b904edbbb68ce9132e44373)](https://www.codacy.com/app/trwolfe13/expressionTS?utm_source=github.com&utm_medium=referral&utm_content=trwolfe13/expressionTS&utm_campaign=Badge_Coverage)

A library written in TypeScript for parsing and interpreting expressions.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Installing

```batchfile
npm install --save expressionTS
```

### Usage

```typescript
const environment = new DefaultResolutionService({
  x: 10,
  foo: {
    bar: 6
  },
  double: (value: number) => value * 2
});
const parser = new Parser('double(x * foo.bar)');
const result = parser.parse(environment);
console.log(result.evaluator.evaluate()); // Logs 120.
```

## Installing Dependencies

Installing the dependencies is done using a standard ```npm i```.

## Running the Tests

```shell
npm test
```

## Building the project

```shell
npm run build
```

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/trwolfe13/expressionTS/tags).

## Authors

* **Tom Wolfe** - *Initial work* - [trwolfe13](https://github.com/trwolfe13)

See also the list of [contributors](https://github.com/trwolfe13/expressionTS/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
