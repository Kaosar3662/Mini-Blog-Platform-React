/* eslint-disable no-unused-vars */
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { HeadingNode } from '@lexical/rich-text';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import Toolbar from './Toolbar';

import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import WhileChange from './WhileChange';

interface LexicalEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const LexicalEditor: React.FC<LexicalEditorProps> = ({ value, onChange }) => {
  const initialConfig = {
    namespace: 'MyEditor',
    theme: {
      paragraph: 'text-gray-800 mb-2',
      heading: {
        h1: 'text-3xl font-bold text-gray-900 mt-4 mb-2',
        h2: 'text-2xl font-bold text-gray-800 mt-3 mb-2',
        h3: 'text-xl font-semibold text-gray-800 mt-2 mb-2',
        h4: 'text-lg font-semibold text-gray-800 mt-2 mb-2',
        h5: 'text-base font-semibold text-gray-800 mt-2 mb-2',
        h6: 'text-sm font-semibold text-gray-800 mt-2 mb-2',
      },
      list: {
        ul: 'list-disc ml-6 mb-2',
        ol: 'list-decimal ml-6 mb-2',
        listitem: 'text-gray-800',
      },
      text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
        strikethrough: 'line-through',
        code: 'bg-gray-100 px-1 rounded font-mono text-red-600',
      },
      code: 'bg-gray-900 text-white p-4 rounded-md font-mono text-sm my-2 block',
      quote: 'border-l-4 border-gray-300 pl-4 italic text-gray-600 my-2',
    },
    onError: (err: Error) => console.error(err),
    nodes: [
      HeadingNode,
      CodeNode,
      CodeHighlightNode,
    ],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="flex flex-col border bg-gray-100 border-gray-300 p-1.5 rounded-xl h-full overflow-hidden">
        <Toolbar />

        <div className="relative flex-1 overflow-y-auto scrollbar-hide">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-full p-3 outline-none text-gray-800" />
            }
            placeholder={
              <div className="absolute top-4 left-4 text-gray-400 pointer-events-none italic">
                Start writing something...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <WhileChange value={value} onChange={onChange } />
        </div>
      </div>
    </LexicalComposer>
  );
};

export default LexicalEditor;
