import { ParseResult } from './parse-result';

export interface IParser {
    parse(): ParseResult;
}
