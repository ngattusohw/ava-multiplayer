import { useGameStore } from './store/gameStore';
import { Lobby } from './components/Lobby';
import { MatchingGame } from './components/MatchingGame';
import { ChainBuilder } from './components/ChainBuilder';

function App() {
  const { mode } = useGameStore();

  return (
    <>
      {mode === 'lobby' && <Lobby />}
      {mode === 'matching' && <MatchingGame />}
      {mode === 'chain-builder' && <ChainBuilder />}
      {mode === 'results' && <Lobby />}
    </>
  );
}

export default App;
