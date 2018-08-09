import { ObjectMap } from './object-map';

export interface ResolutionContext {
  resolve(name: string[]): any;
}

const DEFAULT_FUNCTIONS: ObjectMap = {
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
  private _environment: ObjectMap = {};
  private _mergedEnvironment: ObjectMap = DEFAULT_FUNCTIONS;

  constructor(environment?: ObjectMap) {
    this.environment = environment;
  }

  public get environment(): ObjectMap {
    return this._environment
  }

  public set environment(value: ObjectMap) {
    this._environment = value;
    this._mergedEnvironment = Object.assign({}, DEFAULT_FUNCTIONS, this._environment);
  }

  public resolve(name: string[]): any {
    return name.reduce((p, c) => p[c], this._mergedEnvironment);
  }
}
