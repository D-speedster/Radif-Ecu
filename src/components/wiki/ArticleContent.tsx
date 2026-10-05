import React from 'react';

interface ArticleContentProps {
  content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div
      className="prose prose-lg max-w-none
        prose-headings:text-gray-900 prose-headings:font-bold
        prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-8
        prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-6
        prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-5
        prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
        prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800
        prose-strong:text-gray-900 prose-strong:font-bold
        prose-em:italic
        prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:text-gray-800
        prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
        prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
        prose-ul:list-disc prose-ul:mr-6 prose-ul:mb-4
        prose-ol:list-decimal prose-ol:mr-6 prose-ol:mb-4
        prose-li:text-gray-700 prose-li:mb-2
        prose-img:rounded-lg prose-img:shadow-md prose-img:max-w-full prose-img:h-auto prose-img:my-6
        prose-table:border-collapse prose-table:w-full prose-table:my-6
        prose-th:border prose-th:border-gray-300 prose-th:bg-gray-100 prose-th:p-3 prose-th:font-bold prose-th:text-right
        prose-td:border prose-td:border-gray-300 prose-td:p-3 prose-td:text-right
        prose-hr:border-gray-300 prose-hr:my-8"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
