import { useState } from 'react';

import NavClient from '@/components/navigation/NavClient.tsx';
import MainPageClient from '@/pages/MainPageClient.tsx';
import MainPageCounselor from '@/pages/MainPageCounselor.tsx';
function App() {
  const [count, setCount] = useState(0);
  return (
    <div className="App">
      <NavClient />
      <MainPageClient />
      <MainPageCounselor />
    </div>
  );
}

export default App;
