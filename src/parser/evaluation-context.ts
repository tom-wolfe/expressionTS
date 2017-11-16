import { IEvaluationContext } from './evaluation-context.interface';

export class EvaluationContext implements IEvaluationContext {
  public variables: { [key: string]: number };
  public functions: { [key: string]: (...args: number[]) => number };

  public evaluateFunction(name: string): (...args: number[]) => number {
    return this.functions[name];
  }
  public evaluateVariable(name: string): number {
    return this.variables[name];
  }
}
