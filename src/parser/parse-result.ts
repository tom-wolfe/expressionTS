import { ErrorMessage } from './error-message';
import { Expression } from './expression';

export class ParseResult {
  constructor(public expression: Expression, public errors: ErrorMessage[]) { }
}
