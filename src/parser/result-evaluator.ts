import { IEvaluationContext } from './evaluation-context.interface';

export type ResultEvaluator = (context: IEvaluationContext) => number;
