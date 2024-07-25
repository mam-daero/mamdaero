import { useState } from 'react';

import NavClient from '@/components/navigation/NavClient.tsx';
import MainPage from '@/pages/MainPage.tsx';
function App() {
  const [count, setCount] = useState(0);
  return (
    <div className="App">
      <MainPage />
      <NavClient />
    </div>
  );
}

export default App;
