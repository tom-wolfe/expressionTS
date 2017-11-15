import * as Ast from '../ast';
import { ErrorMessage } from './error-message';

export interface IInterpreter<TResult> {
    interpret(expression: Ast.ExpressionNode): TResult;
    evaluate(expression: Ast.ExpressionNode, errors: ErrorMessage[]): any;
}
