import * as Ast from '../../src/ast';
import * as Interpreter from '../../src/interpreter';

describe('Interpreter', () => {
    describe('evaluate', () => {
        it('correctly evaluates a function(floor(5 / 2)).', () => {
            const func = Ast.Factory.create(Ast.NodeType.Function, 'floor');

            const exp = Ast.Factory.create(Ast.NodeType.Divide);
            exp.addChild(Ast.Factory.create(Ast.NodeType.Number, 5));
            exp.addChild(Ast.Factory.create(Ast.NodeType.Number, 2));

            func.addChild(exp);

            const interpreter = new Interpreter.Interpreter();
            const errors: Interpreter.ErrorMessage[] = [];
            const res = interpreter.evaluate(func, errors);
            expect(res).toBe(2);
        });
        it('correctly evaluates a function(ceil(5 / 2)).', () => {
            const func = Ast.Factory.create(Ast.NodeType.Function, 'ceil');

            const exp = Ast.Factory.create(Ast.NodeType.Divide);
            exp.addChild(Ast.Factory.create(Ast.NodeType.Number, 5));
            exp.addChild(Ast.Factory.create(Ast.NodeType.Number, 2));

            func.addChild(exp);

            const interpreter = new Interpreter.Interpreter();

            const errors: Interpreter.ErrorMessage[] = [];
            const res = interpreter.evaluate(func, errors);
            expect(res).toBe(3);
        });
        it('correctly evaluates a function(sqrt(9)).', () => {
            const func = Ast.Factory.create(Ast.NodeType.Function, 'sqrt');
            func.addChild(Ast.Factory.create(Ast.NodeType.Number, 9));

            const interpreter = new Interpreter.Interpreter();
            const errors: Interpreter.ErrorMessage[] = [];
            const res = interpreter.evaluate(func, errors);
            expect(res).toBe(3);
        });
        it('correctly evaluates a function(abs(-9)).', () => {
            const func = Ast.Factory.create(Ast.NodeType.Function, 'abs');

            const negate = Ast.Factory.create(Ast.NodeType.Negate);
            negate.addChild(Ast.Factory.create(Ast.NodeType.Number, 9));

            func.addChild(negate);

            const interpreter = new Interpreter.Interpreter();
            const errors: Interpreter.ErrorMessage[] = [];
            const res = interpreter.evaluate(func, errors);
            expect(res).toBe(9);
        });
        it('correctly evaluates a function(round(5 / 2)).', () => {
            const func = Ast.Factory.create(Ast.NodeType.Function, 'round');

            const exp = Ast.Factory.create(Ast.NodeType.Divide);
            exp.addChild(Ast.Factory.create(Ast.NodeType.Number, 5));
            exp.addChild(Ast.Factory.create(Ast.NodeType.Number, 2));

            func.addChild(exp);

            const interpreter = new Interpreter.Interpreter();
            const errors: Interpreter.ErrorMessage[] = [];
            const res = interpreter.evaluate(func, errors);
            expect(res).toBe(3);
        });
        it('throws an error on an unknown function.', () => {
            const func = Ast.Factory.create(Ast.NodeType.Function, 'xxx');

            const exp = Ast.Factory.create(Ast.NodeType.Divide);
            exp.addChild(Ast.Factory.create(Ast.NodeType.Number, 5));
            exp.addChild(Ast.Factory.create(Ast.NodeType.Number, 2));

            func.addChild(exp);

            const interpreter = new Interpreter.Interpreter();
            const errors: Interpreter.ErrorMessage[] = [];
            expect(() => interpreter.evaluate(func, errors)).toThrow();
        });
    });
});
