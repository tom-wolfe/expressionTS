import { Evaluator, ResolutionContext } from '../../src/parser';

describe('Evaluator', () => {
  describe('evaluate', () => {
    it('calls the nested expression.', () => {
      let called = false;
      const exp = () => called = true;
      const evaluator = new Evaluator(exp);
      evaluator.evaluate();
      expect(called).toBeTruthy();
    });
    it('increments the counter after each execution.', () => {
      let counter = 0;
      const exp = (s, c: ResolutionContext) => {
        expect(c.index).toEqual(counter);
        counter++;
      }
      const evaluator = new Evaluator(exp);
      evaluator.evaluate();
      evaluator.evaluate();
      evaluator.evaluate();
    });
    it('Resets on reset.', () => {
      let counter = 0;
      const exp = (s, c: ResolutionContext) => {
        expect(c.index).toEqual(counter);
        counter++;
      }
      const evaluator = new Evaluator(exp);
      evaluator.evaluate();
      evaluator.evaluate();
      evaluator.evaluate();

      evaluator.reset();
      counter = 0;

      evaluator.reset();
    });
  });
});
