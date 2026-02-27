import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $getRoot, $insertNodes } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';

interface WhileChangeProps {
  value: string;
  onChange: (value: string) => void;
  updateTrigger?: number | string | boolean;
}

const WhileChange: React.FC<WhileChangeProps> = ({ value, onChange, updateTrigger }) => {
  const [editor] = useLexicalComposerContext();

  // Update editor content only when updateTrigger changes (i.e., on edit)
  useEffect(() => {
    if (!value) return;

    editor.update(() => {
      const currentHTML = $generateHtmlFromNodes(editor);
      if (currentHTML !== value) {
        $getRoot().clear();
        const parser = new DOMParser();
        const dom = parser.parseFromString(value, 'text/html');
        const nodes = $generateNodesFromDOM(editor, dom);
        $insertNodes(nodes);
      }
    });
  }, [value, updateTrigger, editor]);

  return (
    <OnChangePlugin
      onChange={(editorState: any) => {
        editorState.read(() => {
          onChange($generateHtmlFromNodes(editor));
        });
      }}
    />
  );
};

export default WhileChange;