import { Token } from './';

export interface ILexer {
    peekNextToken(): Token;
    getNextToken(): Token;
}
