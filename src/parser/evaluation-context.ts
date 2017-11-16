import { IEvaluationContext } from './evaluation-context.interface';

export class EvaluationContext implements IEvaluationContext {
  public variables: { [key: string]: any };
  public functions: { [key: string]: (...args: any[]) => any };

  public evaluateFunction(name: string): (...args: any[]) => any {
    return this.functions[name];
  }
  public evaluateVariable(name: string): any {
    return this.variables[name];
  }
}
