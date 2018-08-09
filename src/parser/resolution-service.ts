export class ResolutionContext {
  functionName: string[];
  index = 0;
}

export interface ResolutionService {
  resolve(name: string[], context: ResolutionContext): any;
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
  private _environment: { [key: string]: any } = {};
  private _mergedEnvironment: { [key: string]: any } = DEFAULT_FUNCTIONS;

  public get environment(): { [key: string]: any } {
    return this._environment
  }

  public set environment(value: { [key: string]: any }) {
    this._environment = value;
    this._mergedEnvironment = Object.assign({}, DEFAULT_FUNCTIONS, this._environment);
  }

  public resolve(name: string[], context: ResolutionContext): any {
    return name.reduce((p, c) => p[c], this._mergedEnvironment);
  }
}
