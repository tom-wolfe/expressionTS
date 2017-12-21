export class ResolutionContext {
  functionName: string;
  index = 0;
}

export interface ResolutionService {
  resolveFunction(name: string, context: ResolutionContext): (...args: any[]) => any;
  resolveVariable(name: string, context: ResolutionContext): any;
}

export interface FunctionMap { [key: string]: (...args: any[]) => any };

const DEFAULT_FUNCTIONS: FunctionMap = {
  abs: Math.abs,
  pow: Math.pow,
  floor: Math.floor,
  ceil: Math.ceil,
  exp: Math.exp,
  log: Math.log,
  log10: Math.log10,
  max: Math.max,
  min: Math.min,
  sign: Math.sign,
  sqrt: Math.sqrt
};

export class DefaultResolutionService implements ResolutionService {
  private _mergedFunctions: FunctionMap = DEFAULT_FUNCTIONS;
  private _functions: FunctionMap = {};

  public variables: { [key: string]: any } = {};

  public get functions(): FunctionMap {
    return this._functions;
  }

  public set functions(value: FunctionMap) {
    this._functions = value;
    this._mergedFunctions = Object.assign({}, DEFAULT_FUNCTIONS, this._functions);
  }

  public resolveFunction(name: string, context: ResolutionContext): (...args: any[]) => any {
    return this._mergedFunctions[name];
  }
  public resolveVariable(name: string, context: ResolutionContext): any {
    return this.variables[name];
  }
}
