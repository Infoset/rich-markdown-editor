"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const client_1 = require("react-dom/client");
const styled_components_1 = require("styled-components");
const theme_1 = require("../styles/theme");
class ComponentView {
    constructor(component, { editor, extension, node, view, getPos, decorations }) {
        this.isSelected = false;
        this.component = component;
        this.editor = editor;
        this.extension = extension;
        this.getPos = getPos;
        this.decorations = decorations;
        this.node = node;
        this.view = view;
        this.dom = node.type.spec.inline
            ? document.createElement('span')
            : document.createElement('div');
        this.renderElement();
    }
    renderElement() {
        const { dark } = this.editor.props;
        const theme = this.editor.props.theme || (dark ? theme_1.dark : theme_1.light);
        const children = this.component({
            theme,
            node: this.node,
            isSelected: this.isSelected,
            isEditable: this.view.editable,
            getPos: this.getPos,
        });
        this.root = (0, client_1.createRoot)(this.dom);
        this.root.render(React.createElement(styled_components_1.ThemeProvider, { theme: theme }, children));
    }
    update(node) {
        if (node.type !== this.node.type) {
            return false;
        }
        this.node = node;
        this.renderElement();
        return true;
    }
    selectNode() {
        if (this.view.editable) {
            this.isSelected = true;
            this.renderElement();
        }
    }
    deselectNode() {
        if (this.view.editable) {
            this.isSelected = false;
            this.renderElement();
        }
    }
    stopEvent() {
        return true;
    }
    destroy() {
        if (this.root) {
            this.root.unmount();
        }
    }
    ignoreMutation() {
        return true;
    }
}
exports.default = ComponentView;
//# sourceMappingURL=ComponentView.js.map