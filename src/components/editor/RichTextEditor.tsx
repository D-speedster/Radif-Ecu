'use client';

import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import MenuBar from './MenuBar';
import api from '@/lib/api';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: false,
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto my-4',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
      Underline,
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // آپلود عکس
  const handleImageUpload = useCallback(async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // بررسی حجم (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم فایل نباید بیش از 5 مگابایت باشد');
        return;
      }

      try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await api.post('/upload/article-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.success && response.data.url) {
          // آدرس کامل تصویر (Backend URL + relative path)
          const imageUrl = `${process.env.NEXT_PUBLIC_API_URL === '/api' 
            ? '' 
            : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${response.data.url}`;
          
          editor?.chain().focus().setImage({ src: imageUrl }).run();
        } else {
          alert('خطا در آپلود تصویر');
        }
      } catch (error: any) {
        console.error('Image upload error:', error);
        alert(error.response?.data?.message || 'خطا در آپلود تصویر');
      }
    };

    input.click();
  }, [editor]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-64 border-2 border-gray-300 rounded-lg">
        <p className="text-gray-500">در حال بارگذاری ویرایشگر...</p>
      </div>
    );
  }

  return (
    <div className="border-2 rounded-lg overflow-hidden" style={{ borderColor: '#E5E5E5' }}>
      <MenuBar editor={editor} onImageUpload={handleImageUpload} />
      <EditorContent editor={editor} className="bg-white" />
    </div>
  );
}
