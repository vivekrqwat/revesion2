// ReadOnlyTipTap.jsx
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function ReadOnlyTipTap({ content }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || '', // TipTap content (HTML string)
    editable: false, // read-only mode
  });

  return <EditorContent editor={editor} />;
}
