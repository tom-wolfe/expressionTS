import { DefaultResolutionService, ResolutionContext, ResolutionService } from './resolution-service';
import { ResultEvaluator } from './result-evaluator.type';

export class Evaluator {
  private context: ResolutionContext;
  private service: ResolutionService;
  private expression: ResultEvaluator;

  constructor(expression: ResultEvaluator, service?: ResolutionService) {
    this.service = service || new DefaultResolutionService();
    this.context = new ResolutionContext();
    this.expression = expression;
  }

  evaluate(): any {
    const result = this.expression(this.service, this.context);
    this.context.index = (this.context.index || 0) + 1;
    return result;
  }

  reset(): void {
    this.context = new ResolutionContext();
  }
}
