import { ErrorMessage } from './error-message';
import { ExpressionNode } from '../ast';
import { IInterpreter } from './interpreter.interface';

export type FunctionDefinition<TResult> =
  (interpreter: IInterpreter<TResult>, functionNode: ExpressionNode, errors: ErrorMessage[]) => number;
