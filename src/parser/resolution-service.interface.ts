import { ResolutionContext } from './resolution-context';

export interface ResolutionService {
  resolveFunction(name: string, context: ResolutionContext): (...args: any[]) => any;
  resolveVariable(name: string, context: ResolutionContext): any;
}
