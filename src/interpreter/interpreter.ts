import * as Ast from '../ast';
import { DefaultFunctionDefinitions } from './default-function-definitions';
import { ErrorMessage } from './error-message';
import { FunctionDefinitionList } from './function-definition-list';
import { IInterpreter } from './interpreter.interface';
import { Result } from './result';

export class Interpreter implements IInterpreter<Result> {
    protected functions: FunctionDefinitionList<Result>;

    constructor(functions?: FunctionDefinitionList<Result>) {
        this.functions = DefaultFunctionDefinitions;
        (<any>Object).assign(this.functions, functions);
    }

    interpret(expression: Ast.ExpressionNode): Result {
        const exp = expression.copy();
        const errors: ErrorMessage[] = []
        const total = this.evaluate(exp, errors);
        return new Result(total, errors);
    }

    evaluate(expression: Ast.ExpressionNode, errors: ErrorMessage[]): any {
        if (!expression) { errors.push(new ErrorMessage('Unexpected null node reference found.', expression)); return 0; }
        if (expression.type === Ast.NodeType.Number) {
            return this.evaluateNumber(expression, errors);
        } else if (!expression.value) {
            let value: any = 0;
            switch (expression.type) {
                case Ast.NodeType.Add: value = this.evaluateAdd(expression, errors); break;
                case Ast.NodeType.Subtract: value = this.evaluateSubtract(expression, errors); break;
                case Ast.NodeType.Multiply: value = this.evaluateMultiply(expression, errors); break;
                case Ast.NodeType.Divide: value = this.evaluateDivide(expression, errors); break;
                case Ast.NodeType.Modulo: value = this.evaluateModulo(expression, errors); break;
                case Ast.NodeType.Negate: value = this.evaluateNegate(expression, errors); break;
                case Ast.NodeType.Exponent: value = this.evaluateExponent(expression, errors); break;
                case Ast.NodeType.Function: value = this.evaluateFunction(expression, errors); break;
                default:
                    errors.push(new ErrorMessage(`Unrecognized node type '${expression.type}'.`, expression));
                    return 0;
            }
            expression.value = value;
        }
        return expression.value;
    }

    evaluateAdd(expression: Ast.ExpressionNode, errors: ErrorMessage[]): number {
        if (!this.expectChildCount(expression, 2, errors)) { return 0; }
        return this.evaluate(expression.getChild(0), errors) + this.evaluate(expression.getChild(1), errors);
    }

    evaluateSubtract(expression: Ast.ExpressionNode, errors: ErrorMessage[]): number {
        if (!this.expectChildCount(expression, 2, errors)) { return 0; }
        return this.evaluate(expression.getChild(0), errors) - this.evaluate(expression.getChild(1), errors);
    }

    evaluateMultiply(expression: Ast.ExpressionNode, errors: ErrorMessage[]): number {
        if (!this.expectChildCount(expression, 2, errors)) { return 0; }
        return this.evaluate(expression.getChild(0), errors) * this.evaluate(expression.getChild(1), errors);
    }

    evaluateDivide(expression: Ast.ExpressionNode, errors: ErrorMessage[]): number {
        if (!this.expectChildCount(expression, 2, errors)) { return 0; }
        return this.evaluate(expression.getChild(0), errors) / this.evaluate(expression.getChild(1), errors);
    }

    evaluateModulo(expression: Ast.ExpressionNode, errors: ErrorMessage[]): number {
        if (!this.expectChildCount(expression, 2, errors)) { return 0; }
        return this.evaluate(expression.getChild(0), errors) % this.evaluate(expression.getChild(1), errors);
    }

    evaluateExponent(expression: Ast.ExpressionNode, errors: ErrorMessage[]): number {
        if (!this.expectChildCount(expression, 2, errors)) { return 0; }
        return Math.pow(this.evaluate(expression.getChild(0), errors), this.evaluate(expression.getChild(1), errors));
    }

    evaluateNegate(expression: Ast.ExpressionNode, errors: ErrorMessage[]): number {
        if (!this.expectChildCount(expression, 1, errors)) { return 0; }
        return -this.evaluate(expression.getChild(0), errors);
    }

    evaluateNumber(expression: Ast.ExpressionNode, errors: ErrorMessage[]): number {
        return expression.value;
    }

    evaluateFunction(expression: Ast.ExpressionNode, errors: ErrorMessage[]): number {
        const fName = `${expression.value}`;
        if (Object.keys(this.functions).indexOf(fName) === -1) {
            errors.push(new ErrorMessage(`Unknown function: ${fName}`, expression));
        }
        const result = this.functions[fName](this, expression, errors);
        console.log('result', result);
        return result;
    }

    private expectChildCount(expression: Ast.ExpressionNode, count: number, errors: ErrorMessage[]): boolean {
        const findCount = expression.getChildCount();
        if (findCount < count) {
            const err = new ErrorMessage(`Expected ${expression.type} node to have ${count} children, but found ${findCount}.`, expression);
            errors.push(err);
            return false;
        }
        return true;
    }

    private evaluateComparison(lhs: number, expression: Ast.ExpressionNode, errors: ErrorMessage[]): boolean {
        if (!this.expectChildCount(expression, 1, errors)) { return false };
        switch (expression.type) {
            case Ast.NodeType.Equal: return lhs === this.evaluate(expression.getChild(0), errors);
            case Ast.NodeType.Greater: return lhs > this.evaluate(expression.getChild(0), errors);
            case Ast.NodeType.GreaterOrEqual: return lhs >= this.evaluate(expression.getChild(0), errors);
            case Ast.NodeType.Less: return lhs < this.evaluate(expression.getChild(0), errors);
            case Ast.NodeType.LessOrEqual: return lhs <= this.evaluate(expression.getChild(0), errors);
            default:
                errors.push(new ErrorMessage(`Unrecognized comparison operator '${expression.type}'.`, expression));
                return false;
        }
    }
}
