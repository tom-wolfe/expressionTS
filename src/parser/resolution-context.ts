export interface ResolutionContext {
  resolve(name: string[]): any;
}

const DEFAULT_FUNCTIONS: { [key: string]: any } = {
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

export class DefaultResolutionContext implements ResolutionContext {
  private _environment: { [key: string]: any } = {};
  private _mergedEnvironment: { [key: string]: any } = DEFAULT_FUNCTIONS;

  constructor(environment?: { [key: string]: any }) {
    this.environment = environment;
  }

  public get environment(): { [key: string]: any } {
    return this._environment
  }

  public set environment(value: { [key: string]: any }) {
    this._environment = value;
    this._mergedEnvironment = Object.assign({}, DEFAULT_FUNCTIONS, this._environment);
  }

  public resolve(name: string[]): any {
    return name.reduce((p, c) => p[c], this._mergedEnvironment);
  }
}
