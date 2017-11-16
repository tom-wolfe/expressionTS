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
        switch (expression.type) {
            case Ast.NodeType.Number: return this.evaluateNumber(expression, errors);
            case Ast.NodeType.Add: return this.evaluateAdd(expression, errors);
            case Ast.NodeType.Divide: return this.evaluateDivide(expression, errors);
            case Ast.NodeType.Exponent: return this.evaluateExponent(expression, errors);
            case Ast.NodeType.Function: return this.evaluateFunction(expression, errors);
            case Ast.NodeType.Modulo: return this.evaluateModulo(expression, errors);
            case Ast.NodeType.Multiply: return this.evaluateMultiply(expression, errors);
            case Ast.NodeType.Negate: return this.evaluateNegate(expression, errors);
            case Ast.NodeType.Subtract: return this.evaluateSubtract(expression, errors);
            case Ast.NodeType.Variable: return this.evaluateVariable(expression, errors);
            default:
                errors.push(new ErrorMessage(`Unrecognized node type '${expression.type}'.`, expression));
                return 0;
        }
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

    evaluateVariable(expression: Ast.ExpressionNode, errors: ErrorMessage[]): number {
        // TODO: Look up variable value.
        return 0;
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
}
