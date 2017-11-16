import * as Lexer from '../../src/lexer';
import { StringCharacterStream } from '../../src/lexer/string-character-stream';

describe('DefaultLexer', () => {
    const input = 'floor(4*6**2+5*10/2+4)'
    describe('constructor', () => {
        it('does not throw for string input.', function () {
            expect(() => {
                const lexer = new Lexer.DefaultLexer(input);
            }).not.toThrow();
        });
        it('does not throw for stream input.', function () {
            expect(() => {
                const lexer = new Lexer.DefaultLexer(new StringCharacterStream(input));
            }).not.toThrow();
        });
        it('throws for invalid input.', function () {
            expect(() => {
                const lexer = new Lexer.DefaultLexer(6 as any);
            }).toThrow();
        });
    });
    describe('getNextToken', () => {
        it('last token is a terminator', () => {
            const lexer = new Lexer.DefaultLexer('');
            const token = lexer.getNextToken();
            expect(token).toEqual(new Lexer.Token(Lexer.TokenType.Terminator, 0));
        });
        it('returns correct tokens (simple)', () => {
            const inputSimple = 'floor(4*6)';
            const lexer = new Lexer.DefaultLexer(inputSimple);
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, 0, 'floor'));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.ParenthesisOpen, 5, '('));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 6, '4'));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Asterisk, 7, '*'));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 8, '6'));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.ParenthesisClose, 9, ')'));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Terminator, 10));
        });
        it('returns correct tokens (simple)', () => {
            const inputSimple = 'floor(x+y)';
            const lexer = new Lexer.DefaultLexer(inputSimple);
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, 0, 'floor'));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.ParenthesisOpen, 5, '('));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, 6, 'x'));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Plus, 7, '+'));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, 8, 'y'));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.ParenthesisClose, 9, ')'));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Terminator, 10));
        });
        it('returns correct tokens (complex)', () => {
            const lexer = new Lexer.DefaultLexer(input); // floor(4*6**2+5*10/2+4)
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, 0, 'floor'));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.ParenthesisOpen, 5, '('));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 6, '4'));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Asterisk, 7, '*'));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 8, '6'));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.DoubleAsterisk, 9, '**'));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 11, '2'));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Plus, 12, '+'));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 13, '5'));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Asterisk, 14, '*'));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 15, '10'));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Slash, 17, '/'));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 18, '2'));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Plus, 19, '+'));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 20, '4'));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.ParenthesisClose, 21, ')'));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Terminator, 22));
        });
        // it('interprets remaining operators correctly', () => {
        //     const lexer = new Lexer.Lexer('2d10%8-2*3**1d4!>1<2<=2>=2d3!!=3+{4,5}');
        //     expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 0, '2'));
        //     expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, 1, 'd'));
        //     expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 2, '10'));
        //     expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Percent, 4, '%'));
        //     expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 5, '8'));
        //     expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Minus, 6, '-'));
        //     expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 7, '2'));
        //     expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Asterisk, 8, '*'));
        //     expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 9, '3'));
        //     expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.DoubleAsterisk, 10, '**'));
        //     expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 12, '1'));
        //     expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, 13, 'd'));
        //     expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 14, '4'));
        //     expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Greater, 16, '>'));
        //     expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 17, '1'));
        //     expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Less, 18, '<'));
        //     expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 19, '2'));
        //     expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.LessOrEqual, 20, '<='));
        //     expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 22, '2'));
        //     expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.GreaterOrEqual, 23, '>='));
        //     expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 25, '2'));
        //     expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, 26, 'd'));
        //     expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 27, '3'));
        //     expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Equals, 30, '='));
        //     expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 31, '3'));
        //     expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Plus, 32, '+'));
        //     expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 34, '4'));
        //     expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Comma, 35, ','));
        //     expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 36, '5'));
        //     expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Terminator, 38));
        // });
        it('interprets a floating point number correctly', () => {
            const lexer = new Lexer.DefaultLexer('2.23');
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 0, '2.23'));
        });
        it('throws on unrecognized tokens', () => {
            const lexer = new Lexer.DefaultLexer('test_face');
            lexer.getNextToken();
            expect(() => { lexer.getNextToken() }).toThrow();
        });
        it('skips over whitespace.', () => {
            const lexer = new Lexer.DefaultLexer('2  d\t10 \t + \t\t 3');
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 0, '2'));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, 3, 'd'));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 5, '10'));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Plus, 10, '+'));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 15, '3'));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Terminator, 16));
        });
    });
    describe('peekNextToken', () => {
        it('gives next token without cycling through.', () => {
            const lexer = new Lexer.DefaultLexer(input);
            lexer.getNextToken();
            expect(lexer.peekNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.ParenthesisOpen, 5, '('));
            expect(lexer.peekNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.ParenthesisOpen, 5, '('));
            lexer.getNextToken();
            expect(lexer.peekNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 6, '4'));
            lexer.getNextToken();
            lexer.getNextToken();
            expect(lexer.peekNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 8, '6'));
        });
    });
});
