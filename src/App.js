// // import './App.css';

// // function App() {
// //   return (
// //     <div>
// //       <header>
// //         <div>Hello</div>
// //       </header>
// //     </div>
// //   );
// // }

// // export default App;



import React, { useState, useEffect, useRef } from 'react';

const TextEditor = () => {
  const [selectionRange, setSelectionRange] = useState(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const textRef = useRef();

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
      const range = selection.getRangeAt(0);
      setSelectionRange(range);

      const rect = range.getBoundingClientRect();
      setToolbarPosition({ top: rect.top - 40 + window.scrollY, left: rect.left + window.scrollX });
      setShowToolbar(true);
    } else {
      setShowToolbar(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const applyStyle = (style) => {
    if (selectionRange) {
      const span = document.createElement('span');
      span.style.cssText = style;

      try {
        selectionRange.surroundContents(span);
      } catch (e) {
        const fragment = selectionRange.extractContents();
        span.appendChild(fragment);
        selectionRange.insertNode(span);
      }

      setSelectionRange(null);
      setShowToolbar(false);
    }
  };

  const applyAlignment = (alignment) => {
    if (selectionRange) {
      const div = document.createElement('div');
      div.style.textAlign = alignment;
      div.style.display = 'block';

      try {
        selectionRange.surroundContents(div);
      } catch (e) {
        const fragment = selectionRange.extractContents();
        div.appendChild(fragment);
        selectionRange.insertNode(div);
      }

      setSelectionRange(null);
      setShowToolbar(false);
    }
  };

  const copyToClipboard = async () => {
    if (selectionRange) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(selectionRange);

      try {
        await navigator.clipboard.writeText(selection.toString());
        alert('Text copied to clipboard');
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }

      setSelectionRange(null);
      setShowToolbar(false);
    }
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (selectionRange) {
        const range = selectionRange;
        range.deleteContents();
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);

        // Move cursor to the end of the inserted text
        const newRange = document.createRange();
        newRange.setStartAfter(textNode);
        newRange.collapse(true);

        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  return (
    <div style={{ padding: '50px' }}>

{/* {showToolbar && ( */}
        <div
          style={{
            position: 'absolute',
            top: toolbarPosition.top,
            left: toolbarPosition.left,
            backgroundColor: 'white',
            border: '1px solid #ccc',
            padding: '5px',
            display: 'flex',
            gap: '5px',
          }}
        >
          <button
            onClick={() => applyStyle('font-weight: bold;')}
            style={{
              backgroundColor: '#f0f0f0',
              border: 'none',
              padding: '5px 10px',
              cursor: 'pointer',
            }}
          >
            Bold
          </button>
          <button
            onClick={() => applyStyle('text-decoration: underline;')}
            style={{
              backgroundColor: '#f0f0f0',
              border: 'none',
              padding: '5px 10px',
              cursor: 'pointer',
            }}
          >
            Underline
          </button>
          <button
            onClick={() => applyAlignment('left')}
            style={{
              backgroundColor: '#f0f0f0',
              border: 'none',
              padding: '5px 10px',
              cursor: 'pointer',
            }}
          >
            Left
          </button>
          <button
            onClick={() => applyAlignment('center')}
            style={{
              backgroundColor: '#f0f0f0',
              border: 'none',
              padding: '5px 10px',
              cursor: 'pointer',
            }}
          >
            Center
          </button>
          <button
            onClick={() => applyAlignment('right')}
            style={{
              backgroundColor: '#f0f0f0',
              border: 'none',
              padding: '5px 10px',
              cursor: 'pointer',
            }}
          >
            Right
          </button>
          <button
            onClick={() => applyAlignment('justify')}
            style={{
              backgroundColor: '#f0f0f0',
              border: 'none',
              padding: '5px 10px',
              cursor: 'pointer',
            }}
          >
            Justify
          </button>
          <button
            onClick={copyToClipboard}
            style={{
              backgroundColor: '#f0f0f0',
              border: 'none',
              padding: '5px 10px',
              cursor: 'pointer',
            }}
          >
            Copy
          </button>
          <button
            onClick={pasteFromClipboard}
            style={{
              backgroundColor: '#f0f0f0',
              border: 'none',
              padding: '5px 10px',
              cursor: 'pointer',
            }}
          >
            Paste
          </button>
        </div>
      {/* )} */}
      <div
        ref={textRef}
        contentEditable
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          minHeight: '200px',
          outline: 'none',
        }}
      >
        Select text in this editable area to see formatting options.
      </div>
    </div>
  );
};

export default TextEditor;
