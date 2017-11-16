import { ResultEvaluator } from './result-evaluator';

export interface IEvaluationContext {
  evaluateFunction(name: string): (...args: number[]) => number;
  evaluateVariable(name: string): number;
}
