import { ResolutionContext, ResolutionService } from './resolution-service';

export type ResultEvaluator = (resolver: ResolutionService, context: ResolutionContext) => any;
