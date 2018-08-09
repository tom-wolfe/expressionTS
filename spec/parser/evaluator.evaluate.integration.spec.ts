import * as Parser from '../../src/parser';

describe('Evaluator (integration)', () => {
  describe('evaluate', () => {
    it('Can parse and evaluate a simple expression.', () => {
      const parser = new Parser.Parser('1 + 1');
      const result = parser.parse();
      expect(result.errors.length).toBe(0);
      expect(result.evaluator.evaluate()).toBe(2);
    });
    it('Can parse and evaluate a function.', () => {
      const parser = new Parser.Parser('abs(-1)');
      const result = parser.parse();
      expect(result.errors.length).toBe(0);
      expect(result.evaluator.evaluate()).toBe(1);
    });
    it('Can parse and evaluate a function with variable.', () => {
      const parser = new Parser.Parser('abs(x)');
      const service = new Parser.DefaultResolutionService();
      service.environment = {
        x: -3
      };
      const result = parser.parse(service);
      expect(result.errors.length).toBe(0);
      expect(result.evaluator.evaluate()).toBe(3);
    });
  });
});
