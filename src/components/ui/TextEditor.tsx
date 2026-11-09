'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { cn } from '@/lib/utils';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function TextEditor({ value, onChange, className }: TextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'min-h-[120px] px-3 py-2 text-sm text-foreground focus:outline-none',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className={cn('border border-input rounded-xl bg-background focus-within:border-[#42A5F5] focus-within:ring-2 focus-within:ring-[#42A5F5]/20 transition-all', className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b border-input px-2 py-1.5">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            'p-1.5 rounded hover:bg-muted transition-colors',
            editor.isActive('bold') ? 'bg-muted text-foreground' : 'text-muted-foreground'
          )}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            'p-1.5 rounded hover:bg-muted transition-colors',
            editor.isActive('italic') ? 'bg-muted text-foreground' : 'text-muted-foreground'
          )}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            'p-1.5 rounded hover:bg-muted transition-colors',
            editor.isActive('bulletList') ? 'bg-muted text-foreground' : 'text-muted-foreground'
          )}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            'p-1.5 rounded hover:bg-muted transition-colors',
            editor.isActive('orderedList') ? 'bg-muted text-foreground' : 'text-muted-foreground'
          )}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
