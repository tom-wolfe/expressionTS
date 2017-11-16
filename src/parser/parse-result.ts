import { ErrorMessage } from './error-message';
import { ResultEvaluator } from './result-evaluator';

export class ParseResult {
    errors: ErrorMessage[] = [];
    evaluator: ResultEvaluator;
}
