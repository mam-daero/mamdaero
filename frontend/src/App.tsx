import { useState } from 'react';

import NavClient from 'components/navigation/NavClient.tsx';
import RoundedButton from 'components/button/RoundedButton.tsx';
import SquareButton from 'components/button/SquareButton.tsx';
function App() {
  const [count, setCount] = useState(0);
  return (
    <div className="App">
      <NavClient />
      {/* <RoundedButton label="테스트" onClick={f} size="sm" user="counselor"></RoundedButton> */}
    </div>
  );
}

export default App;
