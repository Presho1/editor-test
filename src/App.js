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

  const handleMouseUp = (event) => {
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

  const applyFormatting = (command, value = null) => {
    if (selectionRange) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(selectionRange);

      document.execCommand(command, false, value);
      setSelectionRange(null);
      setShowToolbar(false);
    }
  };

  return (
    <div style={{ padding: '50px' }}>
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
      {showToolbar && (
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
            onClick={() => applyFormatting('bold')}
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
            onClick={() => applyFormatting('underline')}
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
            onClick={() => applyFormatting('justifyLeft')}
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
            onClick={() => applyFormatting('justifyCenter')}
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
            onClick={() => applyFormatting('justifyRight')}
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
            onClick={() => applyFormatting('justifyFull')}
            style={{
              backgroundColor: '#f0f0f0',
              border: 'none',
              padding: '5px 10px',
              cursor: 'pointer',
            }}
          >
            Justify
          </button>
        </div>
      )}
    </div>
  );
};

export default TextEditor;

