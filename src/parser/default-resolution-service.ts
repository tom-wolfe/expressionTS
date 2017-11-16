import { ResolutionContext } from './resolution-context';
import { ResolutionService } from './resolution-service.interface';

export class DefaultResolutionService implements ResolutionService {
  public variables: { [key: string]: any };
  public functions: { [key: string]: (...args: any[]) => any };

  public resolveFunction(name: string, context: ResolutionContext): (...args: any[]) => any {
    return this.functions[name];
  }
  public resolveVariable(name: string, context: ResolutionContext): any {
    return this.variables[name];
  }
}
