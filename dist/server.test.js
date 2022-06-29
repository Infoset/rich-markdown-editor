"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
test('renders an empty doc', () => {
    const ast = server_1.parser.parse('');
    expect(ast === null || ast === void 0 ? void 0 : ast.toJSON()).toEqual({
        content: [{ type: 'paragraph' }],
        type: 'doc',
    });
});
//# sourceMappingURL=server.test.js.map