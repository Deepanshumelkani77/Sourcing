import React, { useRef, useEffect } from 'react'

const RichTextEditor = ({ value, onChange, placeholder = 'Write your content here...' }) => {
  const editorRef = useRef(null)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const ToolbarButton = ({ command, value, label, icon }) => (
    <button
      type="button"
      onClick={() => execCommand(command, value)}
      className="p-2 hover:bg-gray-200 rounded transition-colors"
      title={label}
    >
      {icon}
    </button>
  )

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        <div className="flex gap-1 mr-2">
          <ToolbarButton
            command="formatBlock"
            value="H2"
            label="Heading 2"
            icon={<span className="font-bold">H2</span>}
          />
          <ToolbarButton
            command="formatBlock"
            value="H3"
            label="Heading 3"
            icon={<span className="font-bold">H3</span>}
          />
          <ToolbarButton
            command="formatBlock"
            value="P"
            label="Paragraph"
            icon={<span className="font-normal">P</span>}
          />
        </div>

        <div className="w-px bg-gray-300 mx-2" />

        <div className="flex gap-1 mr-2">
          <ToolbarButton
            command="bold"
            label="Bold"
            icon={<span className="font-bold">B</span>}
          />
          <ToolbarButton
            command="italic"
            label="Italic"
            icon={<span className="italic">I</span>}
          />
          <ToolbarButton
            command="underline"
            label="Underline"
            icon={<span className="underline">U</span>}
          />
          <ToolbarButton
            command="strikeThrough"
            label="Strikethrough"
            icon={<span className="line-through">S</span>}
          />
        </div>

        <div className="w-px bg-gray-300 mx-2" />

        <div className="flex gap-1 mr-2">
          <ToolbarButton
            command="insertUnorderedList"
            label="Bullet List"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            }
          />
          <ToolbarButton
            command="insertOrderedList"
            label="Numbered List"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20h14M7 12h14M7 4h14M3 4h.01M3 12h.01M3 20h.01" />
              </svg>
            }
          />
        </div>

        <div className="w-px bg-gray-300 mx-2" />

        <div className="flex gap-1 mr-2">
          <ToolbarButton
            command="justifyLeft"
            label="Align Left"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" />
              </svg>
            }
          />
          <ToolbarButton
            command="justifyCenter"
            label="Align Center"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M4 18h16" />
              </svg>
            }
          />
          <ToolbarButton
            command="justifyRight"
            label="Align Right"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M4 18h16" />
              </svg>
            }
          />
        </div>

        <div className="w-px bg-gray-300 mx-2" />

        <div className="flex gap-1">
          <ToolbarButton
            command="createLink"
            label="Insert Link"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            }
          />
          <ToolbarButton
            command="unlink"
            label="Remove Link"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.B56 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[300px] p-4 outline-none prose max-w-none"
        style={{
          minHeight: '300px',
          padding: '1rem',
          outline: 'none'
        }}
        dangerouslySetInnerHTML={{ __html: value }}
      />

      {/* CSS Styles for Editor */}
      <style jsx>{`
        .prose h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 1rem 0 0.5rem;
          line-height: 1.3;
        }
        .prose h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0.875rem 0 0.5rem;
          line-height: 1.4;
        }
        .prose p {
          margin: 0.5rem 0;
          line-height: 1.6;
        }
        .prose ul, .prose ol {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }
        .prose li {
          margin: 0.25rem 0;
        }
        .prose a {
          color: #F41703;
          text-decoration: underline;
        }
        .prose strong {
          font-weight: 700;
        }
        .prose em {
          font-style: italic;
        }
        .prose blockquote {
          border-left: 4px solid #F41703;
          padding-left: 1rem;
          margin: 1rem 0;
          color: #666;
          font-style: italic;
        }
      `}</style>
    </div>
  )
}

export default RichTextEditor
