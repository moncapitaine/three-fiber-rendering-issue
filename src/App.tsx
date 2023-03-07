import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import { ExampleCanvas } from './ExampleCanvas';

function App() {
  const [rotation, setRotation] = useState(1.0);

  useEffect(() => {
    setInterval(() => setRotation((x) => x + 0.001), 20);
  }, []);

  return (
    <div className="App">
      <h2>Rendering issue</h2>
      <div
        style={{
          margin: '3em auto',
          padding: 0,
          boxSizing: 'border-box',
          backgroundColor: '#555555',
          width: '70vw',
          height: '70vh',
        }}
      >
        <ExampleCanvas rotation={Math.PI * Math.sin(rotation)} />
      </div>
    </div>
  );
}

export default App;
