import { ErrorMessage } from './error-message';
import { Evaluator } from './evaluator';

export class ParseResult {
  errors: ErrorMessage[] = [];
  evaluator: Evaluator;
}
