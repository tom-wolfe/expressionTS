import { ErrorMessage } from './error-message';

export class Result {
    readonly total: number;
    errors: ErrorMessage[];

    constructor(total: number, errors: ErrorMessage[]) {
        this.total = total;
        this.errors = errors;
    }
}
