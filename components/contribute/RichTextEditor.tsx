'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-gray-600 bg-gray-700">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
          editor.isActive('bold')
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
        }`}
      >
        B
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-3 py-1.5 rounded text-sm font-medium italic transition-colors ${
          editor.isActive('italic')
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
        }`}
      >
        I
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`px-3 py-1.5 rounded text-sm font-medium underline transition-colors ${
          editor.isActive('underline')
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
        }`}
      >
        U
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`px-3 py-1.5 rounded text-sm font-medium line-through transition-colors ${
          editor.isActive('strike')
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
        }`}
      >
        S
      </button>
      
      <div className="w-px bg-gray-500 mx-1" />
      
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
          editor.isActive('heading', { level: 1 })
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
        }`}
      >
        H1
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
          editor.isActive('heading', { level: 2 })
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
        }`}
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
          editor.isActive('heading', { level: 3 })
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
        }`}
      >
        H3
      </button>
      
      <div className="w-px bg-gray-500 mx-1" />
      
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
          editor.isActive('bulletList')
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
        }`}
      >
        • List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
          editor.isActive('orderedList')
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
        }`}
      >
        1. List
      </button>
      
      <div className="w-px bg-gray-500 mx-1" />
      
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
          editor.isActive('codeBlock')
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
        }`}
      >
        {'</>'}
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
          editor.isActive('blockquote')
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
        }`}
      >
        Quote
      </button>
      
      <div className="w-px bg-gray-500 mx-1" />
      
      <button
        type="button"
        onClick={() => {
          const url = window.prompt('Enter URL:');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
          editor.isActive('link')
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
        }`}
      >
        Link
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive('link')}
        className="px-3 py-1.5 rounded text-sm font-medium bg-gray-600 text-gray-200 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Unlink
      </button>
      
      <div className="w-px bg-gray-500 mx-1" />
      
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="px-3 py-1.5 rounded text-sm font-medium bg-gray-600 text-gray-200 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Undo
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="px-3 py-1.5 rounded text-sm font-medium bg-gray-600 text-gray-200 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Redo
      </button>
    </div>
  );
};

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start typing...',
  label,
  required = false,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none min-h-[300px] p-4 focus:outline-none text-gray-100',
      },
    },
  });

  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-gray-200 mb-2">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      <div className="border-2 border-gray-700 rounded-lg overflow-hidden bg-gray-800">
        <MenuBar editor={editor} />
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
