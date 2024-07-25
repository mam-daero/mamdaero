import { useState } from 'react';
import RoundedButton from './components/button/RoundedButton.tsx';
import SquareButton from './components/button/SquareButton.tsx';
function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <div className="App"></div>
      {/* <RoundedButton label="테스트" onClick={f} size="sm" user="counselor"></RoundedButton> */}
    </>
  );
}

export default App;
