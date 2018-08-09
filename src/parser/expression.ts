import { ObjectMap } from './object-map';
import { ResolutionContext } from './resolution-context';

export type Expression = (context?: (ResolutionContext | ObjectMap)) => any;
