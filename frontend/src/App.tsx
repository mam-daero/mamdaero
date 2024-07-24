import { useState } from 'react';
import './styles/index.css';
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="App">
        <div className="text-3xl font-bold underline">test</div>
        <div className="card">
          <button onClick={() => setCount(count => count + 1)}>count is {count}</button>
        </div>
      </div>
    </>
  );
}

export default App;
