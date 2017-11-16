import { ResultEvaluator } from './result-evaluator';

export interface IEvaluationContext {
  evaluateFunction(name: string): (...args: any[]) => any;
  evaluateVariable(name: string): any;
}
