import { useState, useEffect, useCallback } from 'react';

type SquareValue = 'X' | 'O' | null;
const COMPUTER_PLAYER = 'O';
const HUMAN_PLAYER = 'X';

function Square({ value, onSquareClick }: { value: SquareValue; onSquareClick: () => void }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

// COMPONENTE PRINCIPAL
function Board() {
  const [gameMode, setGameMode] = useState<'two-player' | 'single-player' | null>(null);
  // 1. Atualiza o estado para incluir 'medium'
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null);

  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [squares, setSquares] = useState<SquareValue[]>(Array(9).fill(null));

  const handleClick = useCallback((i: number, isComputerMove: boolean = false) => {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    
    if(gameMode === 'single-player' && !isXNext && !isComputerMove) {
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[i] = isXNext ? HUMAN_PLAYER : COMPUTER_PLAYER;

    setSquares(nextSquares);
    setIsXNext(!isXNext);
  }, [squares, isXNext, gameMode]);

  // Efeito que aciona a jogada do computador
  useEffect(() => {
    if (gameMode === 'single-player' && !isXNext && !calculateWinner(squares)) {
      
      let computerMove: number = -1;

      // 2. Adiciona a lógica para o nível médio
      if (difficulty === 'hard') {
        computerMove = findBestMove(squares);
      } else if (difficulty === 'medium') {
        computerMove = findMediumMove(squares);
      } else { // 'easy'
        const emptySquares = squares
          .map((square, index) => (square === null ? index : null))
          .filter((val) => val !== null) as number[];
        
        if (emptySquares.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptySquares.length);
            computerMove = emptySquares[randomIndex];
        }
      }

      if (computerMove !== -1) {
        setTimeout(() => {
          handleClick(computerMove, true); 
        }, 500);
      }
    }
  }, [isXNext, squares, gameMode, difficulty, handleClick]);

  function handleReset() {
    setSquares(Array(9).fill(null));
    setIsXNext(true);
  }

  function handleBackToMenu() {
    handleReset();
    setGameMode(null);
    setDifficulty(null);
  }

  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every(square => square !== null);
  let status;

  if (winner) {
    status = `Vencedor: ${winner}`;
  } else if (isDraw) {
    status = 'Empate!';
  } else {
    status = `Próximo jogador: ${isXNext ? 'X' : 'O'}`;
  }
  
  // RENDERIZAÇÃO CONDICIONAL DA UI

  if (!gameMode) {
    return (
      <div className="game-container">
        <h1>Jogo da Velha</h1>
        <div className="mode-selection">
          <button className="mode-button" onClick={() => setGameMode('single-player')}>
            Jogar Sozinho (vs. PC)
          </button>
          <button className="mode-button" onClick={() => setGameMode('two-player')}>
            Jogar em Dupla
          </button>
        </div>
      </div>
    );
  }

  if (gameMode === 'single-player' && !difficulty) {
    return (
      <div className="game-container">
        <h1>Escolha a Dificuldade</h1>
        {/* 3. Adiciona o botão de dificuldade Média */}
        <div className="mode-selection">
          <button className="mode-button easy" onClick={() => setDifficulty('easy')}>
            Fácil
          </button>
          <button className="mode-button medium" onClick={() => setDifficulty('medium')}>
            Médio
          </button>
          <button className="mode-button hard" onClick={() => setDifficulty('hard')}>
            Impossível
          </button>
        </div>
        <button className="back-button" onClick={handleBackToMenu}>Voltar</button>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="status">{status}</div>
      <div className="board">
        {squares.map((square, i) => (
          <Square key={i} value={square} onSquareClick={() => handleClick(i)} />
        ))}
      </div>
      <div className="button-group">
        <button className="reset-button" onClick={handleReset}>
          Reiniciar Jogo
        </button>
        <button className="reset-button" onClick={handleBackToMenu}>
          Mudar Modo
        </button>
      </div>
    </div>
  );
}

// FUNÇÕES AUXILIARES (fora do componente)

function calculateWinner(squares: SquareValue[]): SquareValue {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// --- LÓGICA NÍVEL MÉDIO ---
function findMediumMove(squares: SquareValue[]): number {
  const emptySquares = squares
    .map((sq, index) => (sq === null ? index : null))
    .filter((val) => val !== null) as number[];

  // 1. Checa se o COMPUTADOR pode ganhar
  for (const i of emptySquares) {
    const tempSquares = squares.slice();
    tempSquares[i] = COMPUTER_PLAYER;
    if (calculateWinner(tempSquares) === COMPUTER_PLAYER) {
      return i; // Jogada vencedora
    }
  }

  // 2. Checa se o HUMANO pode ganhar (e bloqueia)
  for (const i of emptySquares) {
    const tempSquares = squares.slice();
    tempSquares[i] = HUMAN_PLAYER;
    if (calculateWinner(tempSquares) === HUMAN_PLAYER) {
      return i; // Bloqueia o oponente
    }
  }

  // 3. Se não houver jogadas críticas, joga aleatoriamente
  const randomIndex = Math.floor(Math.random() * emptySquares.length);
  return emptySquares[randomIndex];
}

// --- LÓGICA MINIMAX (NÍVEL DIFÍCIL) ---

function findBestMove(squares: SquareValue[]): number {
  let bestVal = -Infinity;
  let bestMove = -1;

  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      squares[i] = COMPUTER_PLAYER;
      const moveVal = minimax(squares, 0, false);
      squares[i] = null;

      if (moveVal > bestVal) {
        bestMove = i;
        bestVal = moveVal;
      }
    }
  }
  return bestMove;
}

function minimax(board: SquareValue[], depth: number, isMaximizing: boolean): number {
  const winner = calculateWinner(board);

  if (winner === COMPUTER_PLAYER) return 10 - depth;
  if (winner === HUMAN_PLAYER) return depth - 10;
  if (board.every(square => square !== null)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = COMPUTER_PLAYER;
        best = Math.max(best, minimax(board, depth + 1, !isMaximizing));
        board[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = HUMAN_PLAYER;
        best = Math.min(best, minimax(board, depth + 1, !isMaximizing));
        board[i] = null;
      }
    }
    return best;
  }
}

export default Board;