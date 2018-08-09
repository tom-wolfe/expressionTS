import * as Parser from '../../src/parser';

describe('Evaluator (integration)', () => {
  describe('evaluate', () => {
    it('Can parse and evaluate a simple expression.', () => {
      const parser = new Parser.Parser('1 + 1');
      const result = parser.parse();
      expect(result.errors.length).toBe(0);
      expect(result.expression()).toBe(2);
    });
    it('Can parse and evaluate a function.', () => {
      const parser = new Parser.Parser('abs(-1)');
      const result = parser.parse();
      expect(result.errors.length).toBe(0);
      expect(result.expression()).toBe(1);
    });
    it('Can parse and evaluate a function with variable.', () => {
      const parser = new Parser.Parser('abs(x)');
      const context = new Parser.DefaultResolutionContext({
        x: -3
      });
      const result = parser.parse();
      expect(result.errors.length).toBe(0);
      expect(result.expression(context)).toBe(3);
    });
    it('Can parse and evaluate the example from the readme.', () => {
      const environment = new Parser.DefaultResolutionContext({
        x: 10,
        foo: {
          bar: 6
        },
        double: (value: number) => value * 2
      });
      const parser = new Parser.Parser('double(x * foo.bar)');
      const result = parser.parse();
      expect(result.errors.length).toBe(0);
      expect(result.expression(environment)).toBe(120);
    });
  });
});
