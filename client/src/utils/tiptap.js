const TiptapMenuBar = ({ editor }) => {
  if (!editor) return null;

  const handleBulletListClick = () => {
    editor.chain().focus().toggleBulletList().run();
  };

  const handleOrderedListClick = () => {
    editor.chain().focus().toggleOrderedList().run();
  };

  return (
    <div className="mb-3 flex flex-wrap gap-2 border border-gray-300 p-3 rounded-md bg-blue-50">
      {[ 
        { label: 'Bold', command: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
        { label: 'Italic', command: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
        { label: 'Strike', command: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive('strike') },
        { label: 'Paragraph', command: () => editor.chain().focus().setParagraph().run(), active: editor.isActive('paragraph') },
        { label: 'H1', command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }) },
        { label: 'H2', command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
        { label: 'H3', command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive('heading', { level: 3 }) },
        { label: 'Bullet list', command: handleBulletListClick, active: editor.isActive('bulletList') },
        { label: 'Number list', command: handleOrderedListClick, active: editor.isActive('orderedList') },
        { label: 'Clear marks', command: () => editor.chain().focus().unsetAllMarks().run() },
        { label: 'Clear nodes', command: () => editor.chain().focus().clearNodes().run() },
        { label: 'Code block', command: () => editor.chain().focus().toggleCodeBlock().run(), active: editor.isActive('codeBlock') },
        { label: 'Blockquote', command: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote') },
        { label: 'Horizontal rule', command: () => editor.chain().focus().setHorizontalRule().run() },
        { label: 'Hard break', command: () => editor.chain().focus().setHardBreak().run() },
        { label: 'Undo', command: () => editor.chain().focus().undo().run(), disabled: !editor.can().chain().focus().undo().run() },
        { label: 'Redo', command: () => editor.chain().focus().redo().run(), disabled: !editor.can().chain().focus().redo().run() },
      ].map(({ label, command, active, disabled }, idx) => (
        <button
          key={idx}
          onClick={command}
          disabled={disabled}
          className={`text-sm px-3 py-1 rounded border transition duration-150
            ${active 
              ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-100 hover:text-black' 
              : 'bg-white text-gray-800 border-gray-300 hover:bg-blue-50 hover:border-blue-400 hover:text-black' }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default TiptapMenuBar;
