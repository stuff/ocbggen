import { useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import Template from './Template';
import Thumb from './Thumb';

import './App.css';

const themes = [
  {
    backgroundColor: '#003668',
    color: '#FFFFFF',
  },
  {
    backgroundColor: '#7451EB',
    color: '#FFFFFF',
  },
  {
    backgroundColor: '#00F8F6',
    color: '#003668',
  },
  {
    backgroundColor: '#00EDA2',
    color: '#003668',
  },
  {
    backgroundColor: '#F6EF59',
    color: '#003668',
  },
  {
    backgroundColor: '#F45B55',
    color: '#FFFFFF',
  },
];

function triggerDownload(imgURI, filename = 'openclassrooms-background.png') {
  var evt = new MouseEvent('click', {
    view: window,
    bubbles: false,
    cancelable: true,
  });

  var a = document.createElement('a');
  a.setAttribute('download', filename);
  a.setAttribute('href', imgURI);
  a.setAttribute('target', '_blank');

  a.dispatchEvent(evt);
}

const App = () => {
  const [text, setText] = useState('Enter \r\nSomething');
  const [themeIndex, setThemeIndex] = useState(0);

  const svgRef = useRef();
  const canvasRef = useRef();

  const handleGetImage = (e) => {
    e.preventDefault();

    var ctx = canvasRef.current.getContext('2d');
    var data = new XMLSerializer().serializeToString(svgRef.current);
    var DOMURL = window.URL || window.webkitURL;

    var img = new Image();
    var svgBlob = new Blob([data], {
      type: 'image/svg+xml;charset=utf-8',
    });
    var url = DOMURL.createObjectURL(svgBlob);

    img.onload = function () {
      ctx.drawImage(img, 0, 0);
      DOMURL.revokeObjectURL(url);

      var imgURI = canvasRef.current
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');

      triggerDownload(imgURI);
    };

    img.src = url;
  };

  const handleKeyDown = (e) => {
    const { code } = e;
    const value = e.target.value;
    const count = value.split('\n').length;

    if (code === 'Enter' && count === 3) {
      e.preventDefault();
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleRadioChange = (e) => {
    setThemeIndex(Number(e.target.value));
  };

  return (
    <>
      <div className="app">
        <div className="editor">
          <div>
            <Template logoText={text} ref={svgRef} theme={themes[themeIndex]} />
          </div>

          <form className="editor__form" onSubmit={handleGetImage}>
            {themes.map((theme, n) => (
              <span key={`theme${n}`}>
                <input
                  type="radio"
                  name="radio-group"
                  id={`theme${n}`}
                  onChange={handleRadioChange}
                  value={n}
                  checked={themeIndex === n}
                />
                <label htmlFor={`theme${n}`}>
                  <Thumb theme={theme} selected={themeIndex === n} />
                </label>
              </span>
            ))}

            <Form.Group>
              <Form.Label htmlFor="text">Text:</Form.Label>
              <Form.Control
                id="text"
                as="textarea"
                spellCheck="false"
                rows={3}
                value={text}
                onKeyDown={handleKeyDown}
                onChange={handleTextChange}
              />
            </Form.Group>

            <Form.Group>
              <Button type="submit">Get image</Button>
            </Form.Group>
            <div>
              <strong>Note:</strong><br />you'll probably see that the background is flipped in your video conference tool. It's not an issue, just the preview in your tool, the others will see the background correctly!
            </div>
          </form>
        </div>
      </div>

      <canvas className="canvas" width="2956" height="1652" ref={canvasRef}></canvas>
    </>
  );
};

export default App;
