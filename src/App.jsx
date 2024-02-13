import React, { useRef, useState, useLayoutEffect } from 'react';
import './App.css';
import Game from './components/game';
import Stats from './components/stats';

function App() {
  // References
  const gameRef = useRef(null);
  const statsRef = useRef(null);
  const [gameLoaded, setGameLoaded] = useState(false);

  useLayoutEffect(() => {
    setGameLoaded(true)
  }, [])
  
  // Render
  return (
    <div className="h-screen flex items-center justify-center">
      <div>
        <Game ref={gameRef} stats={statsRef} />
        {(gameLoaded) && <Stats className="mt-4" ref={statsRef} game={gameRef.current} />}
      </div>
    </div>
  );
}

export default App;
