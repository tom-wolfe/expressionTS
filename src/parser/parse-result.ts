import { ErrorMessage } from './error-message';
import { ResultEvaluator } from './result-evaluator.type';

export class ParseResult {
  constructor(public expression: ResultEvaluator, public errors: ErrorMessage[]) { }
}
