'use client';

import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code,
  Heading1, Heading2, Heading3, List, ListOrdered, Quote,
  Undo, Redo, Link as LinkIcon, Image as ImageIcon,
} from 'lucide-react';

interface MenuBarProps {
  editor: Editor;
  onImageUpload: () => void;
}

export default function MenuBar({ editor, onImageUpload }: MenuBarProps) {
  const addLink = () => {
    const url = window.prompt('آدرس لینک:');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const Btn = ({ onClick, active, disabled, children, title }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded transition ${active ? 'bg-gray-800 text-white' : 'hover:bg-gray-100'} disabled:opacity-30`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-wrap gap-2 p-3 border-b-2 bg-gray-50" style={{ borderColor: '#E5E5E5' }}>
      <Btn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="بازگشت">
        <Undo size={18} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="جلو">
        <Redo size={18} />
      </Btn>
      
      <div className="w-px bg-gray-300 mx-1" />
      
      <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="H1">
        <Heading1 size={18} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="H2">
        <Heading2 size={18} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="H3">
        <Heading3 size={18} />
      </Btn>
      
      <div className="w-px bg-gray-300 mx-1" />
      
      <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
        <Bold size={18} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
        <Italic size={18} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
        <UnderlineIcon size={18} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strike">
        <Strikethrough size={18} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="کد">
        <Code size={18} />
      </Btn>
      
      <div className="w-px bg-gray-300 mx-1" />
      
      <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="لیست">
        <List size={18} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="لیست شماره‌دار">
        <ListOrdered size={18} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="نقل قول">
        <Quote size={18} />
      </Btn>
      
      <div className="w-px bg-gray-300 mx-1" />
      
      <Btn onClick={addLink} active={editor.isActive('link')} title="لینک">
        <LinkIcon size={18} />
      </Btn>
      <Btn onClick={onImageUpload} title="آپلود عکس">
        <ImageIcon size={18} />
      </Btn>
    </div>
  );
}
