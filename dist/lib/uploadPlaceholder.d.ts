import { EditorState, Plugin } from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';
declare const uploadPlaceholder: Plugin<DecorationSet>;
export default uploadPlaceholder;
export declare function findPlaceholder(state: EditorState, id: string): [number, number] | null;
//# sourceMappingURL=uploadPlaceholder.d.ts.map