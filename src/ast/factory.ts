import { ExpressionNode } from './expression-node';
import { NodeType } from './node-type';

export class Factory {
    static create(type: NodeType, value?: any): ExpressionNode {
        const node = new ExpressionNode(type);
        node.value = value;
        return node;
    }
}
