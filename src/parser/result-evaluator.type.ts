import { ResolutionContext } from './resolution-context';
import { ResolutionService } from './resolution-service.interface';

export type ResultEvaluator = (resolver: ResolutionService, context: ResolutionContext) => any;
