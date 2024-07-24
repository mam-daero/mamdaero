import { useState } from 'react';
import './styles/index.css';

import NavClient from './components/navigation/NavClient.tsx';
function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <NavClient />
    </div>
  );
}

export default App;
