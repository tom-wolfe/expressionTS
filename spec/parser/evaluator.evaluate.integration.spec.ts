import * as Parser from '../../src/parser';

describe('Evaluator (integration)', () => {
  describe('evaluate', () => {
    it('Can parse and evaluate a simple expression.', () => {
      const result = new Parser.Parser().parse('1 + 1');
      expect(result.errors.length).toBe(0);
      expect(result.expression()).toBe(2);
    });
    it('Can parse and evaluate a function.', () => {
      const result = new Parser.Parser().parse('abs(-1)');
      expect(result.errors.length).toBe(0);
      expect(result.expression()).toBe(1);
    });
    it('Can parse and evaluate a function with variable.', () => {
      const result = new Parser.Parser().parse('abs(x)');
      expect(result.errors.length).toBe(0);
      expect(result.expression({
        x: -3
      })).toBe(3);
    });
    it('Can parse and evaluate the example from the readme.', () => {
      const context = {
        x: 10,
        foo: { bar: 6 },
        double: (value: number) => value * 2
      };
      const parser = new Parser.Parser();
      const result = parser.parse('double(x * foo.bar)');
      expect(result.errors.length).toBe(0);
      expect(result.expression(context)).toBe(120);
    });
  });
});
