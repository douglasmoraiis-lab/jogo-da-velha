import { useState } from 'react';

// Define o tipo para os valores de um quadrado: 'X', 'O' ou nulo (vazio)
type SquareValue = 'X' | 'O' | null;

// Componente para um único quadrado no tabuleiro
function Square({ value, onSquareClick }: { value: SquareValue; onSquareClick: () => void }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

// Componente principal do tabuleiro
function Board() {
  // Estado para controlar de quem é a vez (X começa)
  const [isXNext, setIsXNext] = useState<boolean>(true);
  
  // Estado para armazenar o valor de cada um dos 9 quadrados
  const [squares, setSquares] = useState<SquareValue[]>(Array(9).fill(null));

  // Função chamada quando um quadrado é clicado
  function handleClick(i: number) {
    // Se o quadrado já estiver preenchido ou se o jogo já tiver um vencedor, não faz nada
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    // Cria uma cópia do array de quadrados para manter a imutabilidade
    const nextSquares = squares.slice();
    
    // Define 'X' ou 'O' no quadrado clicado
    nextSquares[i] = isXNext ? 'X' : 'O';

    // Atualiza o estado do tabuleiro e passa a vez para o próximo jogador
    setSquares(nextSquares);
    setIsXNext(!isXNext);
  }

  // Função para reiniciar o jogo
  function handleReset() {
    setSquares(Array(9).fill(null));
    setIsXNext(true);
  }

  // Determina o vencedor ou o status atual do jogo
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

  return (
    <div className="game-container">
      <div className="status">{status}</div>
      <div className="board">
        <div className="board-row">
          <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
          <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
          <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
        </div>
        <div className="board-row">
          <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
          <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
          <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
        </div>
        <div className="board-row">
          <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
          <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
          <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
        </div>
      </div>
      <button className="reset-button" onClick={handleReset}>
        Reiniciar Jogo
      </button>
    </div>
  );
}

// Função auxiliar para calcular o vencedor
function calculateWinner(squares: SquareValue[]): SquareValue {
  // Todas as combinações possíveis de vitória
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    // Verifica se os três quadrados da linha têm o mesmo valor ('X' ou 'O')
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]; // Retorna 'X' ou 'O'
    }
  }

  return null; // Retorna nulo se não houver vencedor
}


// Exporta o componente principal para ser usado no seu app
export default Board;