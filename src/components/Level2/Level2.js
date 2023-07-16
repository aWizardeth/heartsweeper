import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Level2.css';
import heartImage from './heart.png';
import flagImage from './flag.png';
import gameboard1 from './gameboard.png';
import heartIcon from './heart.svg';

const Level2 = ({ levelPoints }) => {

  const [gameBoard, setGameBoard] = useState([]);
  const [flagsLeft, setFlagsLeft] = useState(0);
  const [result, setResult] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  const [heartPositions, setHeartPositions] = useState(new Set());
  const [totalHearts, setTotalHearts] = useState(0);

  const [round, setRound] = useState(1);
  const [level2Points, setLevel2Points] = useState(levelPoints);

  const gameBoardRef = useRef(null);

  const [cols, setCols] = useState(0);
  const [rows, setRows] = useState(0);

  const [backgroundImage, setBackgroundImage] = useState('');

  const calculateGameBoardSize = useCallback(() => {
    const gameBoardWidth = window.innerWidth * 0.75;
    const maxWidth = 800;

    let limitedGameBoardWidth = gameBoardWidth;
    if (gameBoardWidth > maxWidth) {
      limitedGameBoardWidth = maxWidth;
    }

    const cellWidth = Math.floor(limitedGameBoardWidth / cols);
    const gameBoardHeight = cellWidth * rows;

    if (gameBoardRef.current) {
      gameBoardRef.current.style.width = `${limitedGameBoardWidth}px`;
      gameBoardRef.current.style.height = `${gameBoardHeight}px`;

      const styles = {
        "--game-board-size": `${gameBoardHeight}px`,
        "--cell-size": `${cellWidth}px`,
      };

      Object.assign(gameBoardRef.current.style, styles);
    }
  }, [rows, cols]);

  const generateHeartPositions = useCallback(() => {
    const mines = totalHearts;
    const newHeartPositions = new Set();

    while (newHeartPositions.size < mines) {
      const randomRow = Math.floor(Math.random() * rows);
      const randomCol = Math.floor(Math.random() * cols);

      newHeartPositions.add(`${randomRow}-${randomCol}`);
    }

    setHeartPositions(newHeartPositions);
    setTotalHearts(newHeartPositions.size);
    setFlagsLeft(newHeartPositions.size);
  }, [rows, cols, totalHearts]);

  const countNeighborMines = useCallback((board, row, col) => {
    let count = 0;
    const isLeftEdge = col === 0;
    const isRightEdge = col === cols - 1;

    if (col > 0 && !isLeftEdge && board[row][col - 1].isMine) count++;
    if (col < cols - 1 && !isRightEdge && board[row][col + 1].isMine) count++;
    if (row > 0) {
      if (board[row - 1][col].isMine) count++;
      if (!isLeftEdge && board[row - 1][col - 1].isMine) count++;
      if (!isRightEdge && board[row - 1][col + 1].isMine) count++;
    }
    if (row < rows - 1) {
      if (board[row + 1][col].isMine) count++;
      if (!isLeftEdge && board[row + 1][col - 1].isMine) count++;
      if (!isRightEdge && board[row + 1][col + 1].isMine) count++;
    }

    return count;
  }, [rows, cols]);

  const createBoard = useCallback(() => {
    const newBoard = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({
        isMine: false,
        isCovered: true,
        isFlagged: false,
        neighborMines: 0,
        value: 0,
      }))
      
    );

  // Update the backgroundImage state variable with the desired image URL

  setBackgroundImage(gameboard1);

    // Set the mine positions based on the heart positions
    heartPositions.forEach((position) => {
      const [row, col] = position.split("-");
      newBoard[row][col].isMine = true;
    });

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cell = newBoard[row][col];
        if (!cell.isMine) {
          const neighborMines = countNeighborMines(newBoard, row, col);
          cell.neighborMines = neighborMines;
          cell.value = neighborMines;
        }
      }
    }
  
    setGameBoard(newBoard);
  }, [rows, cols, heartPositions, countNeighborMines]);

  useEffect(() => {
    calculateGameBoardSize();
  }, [rows, cols, calculateGameBoardSize]);

  useEffect(() => {
    generateHeartPositions();
  }, [generateHeartPositions]);

  useEffect(() => {
    if (round === 1) {
      createBoard();
    }
  }, [createBoard, round]);

  useEffect(() => {
    // Adjust the number of columns and rows based on the current round
    if (round === 1) {
      setCols(5);
      setRows(5);
      setTotalHearts(1);
    }
    if (round === 2) {
      setCols(10);
      setRows(10);
      setTotalHearts(4);
    }
    // Add more conditions for additional rounds
  
    calculateGameBoardSize();
    createBoard();
  }, [round, calculateGameBoardSize, createBoard]);

  const handleCellClick = (row, col) => {
    if (isGameOver || gameBoard[row][col].isFlagged || !gameBoard[row][col].isCovered) return;

    const cell = gameBoard[row][col];

    if (cell.isMine) {
      gameOver();
    } else {
      uncoverCell(row, col);

      if (cell.value === 0) {
        const visited = [`${row}-${col}`];
        checkNeighborCells(row, col, visited);
      }
    }
  };

  const uncoverCell = (row, col) => {
    const cell = gameBoard[row][col];
    if (!cell.isCovered || gameBoard[row][col].isFlagged) return;

    setGameBoard((prevGameBoard) => {
      const updatedBoard = prevGameBoard.map((boardRow, rowIndex) =>
        boardRow.map((boardCell, colIndex) =>
          rowIndex === row && colIndex === col
            ? { ...boardCell, isCovered: false }
            : boardCell
        )
      );

      const uncoveredCells = updatedBoard.flat().filter((cell) => !cell.isCovered).length;

      if (uncoveredCells === rows * cols - totalHearts) {
        WinRound();
      }

      return updatedBoard;
    });
  };

  const checkNeighborCells = (row, col, visited) => {
    const isLeftEdge = col === 0;
    const isRightEdge = col === cols - 1;
    const isTopEdge = row === 0;
    const isBottomEdge = row === rows - 1;

    const directions = [
      [-1, 0],
      [1, 0], // Top and bottom cells
    ];

    if (!isLeftEdge) {
      directions.push([-1, -1], [0, -1], [1, -1]); // Cells to the left
    }

    if (!isRightEdge) {
      directions.push([-1, 1], [0, 1], [1, 1]); // Cells to the right
    }

    if (!isTopEdge) {
      directions.push([-1, -1], [-1, 0], [-1, 1]); // Cells above
    }

    if (!isBottomEdge) {
      directions.push([1, -1], [1, 0], [1, 1]); // Cells below
    }

    directions.forEach(([rowOffset, colOffset]) => {
      const newRow = row + rowOffset;
      const newCol = col + colOffset;

      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
        const cellAround = gameBoard[newRow][newCol];

        if (cellAround.isCovered && !visited.includes(`${newRow}-${newCol}`)) {
          visited.push(`${newRow}-${newCol}`);
          uncoverCell(newRow, newCol);
          if (cellAround.value === 0) {
            checkNeighborCells(newRow, newCol, visited);
          }
        }
      }
    });
  };

  const handleRightClick = (event, row, col) => {
    event.preventDefault();
    if (isGameOver) return;

    toggleFlag(row, col);
  };

  const toggleFlag = (row, col) => {
    const cell = gameBoard[row][col];

    if (!cell.isCovered) return;

    if (cell.isFlagged) {
      const updatedBoard = [...gameBoard];
      const updatedCell = { ...cell, isFlagged: false };

      updatedBoard[row][col] = updatedCell;

      setGameBoard(updatedBoard);
      setFlagsLeft((prevFlagsLeft) => prevFlagsLeft + 1);
    } else {
      if (flagsLeft > 0) {
        const updatedBoard = [...gameBoard];
        const updatedCell = { ...cell, isFlagged: true };

        updatedBoard[row][col] = updatedCell;

        setGameBoard(updatedBoard);
        setFlagsLeft((prevFlagsLeft) => prevFlagsLeft - 1);
      }
    }
  };

  const gameOver = () => {
    setIsGameOver(true);
    setResult('Game Over! You lose.');

    const updatedBoard = [...gameBoard];
    updatedBoard.forEach((row) => {
      row.forEach((cell) => {
        if (cell.isMine) {
          cell.isCovered = false;
        }
      });
    });
    setGameBoard(updatedBoard);
  };

  const WinRound = () => {
    if (!isGameOver) {
      setIsGameOver(true);
      setResult('Congratulations! You win!');
   
      // Uncover all cells with mines
      setGameBoard((prevGameBoard) => {
        const updatedBoard = prevGameBoard.map((boardRow) =>
          boardRow.map((cell) =>
            cell.isMine ? { ...cell, isCovered: false } : cell
          )
        );
        return updatedBoard;
      });
       }
  };
  
  useEffect(() => {
    if (isGameOver) {
      console.log('Current Round:', round);
      console.log('Total Hearts:', totalHearts);
    }
  }, [isGameOver, round, totalHearts]);
  
  const handleNextRound = () => {
    setGameBoard([]);
    setFlagsLeft(0);
    setResult('');
    setIsGameOver(false);
    setHeartPositions(new Set());
    setTotalHearts(0);
  
    // Reset the game state and move to the next round
    setRound((prevRound) => prevRound + 1);
  
    // Calculate the new game board size
    calculateGameBoardSize();
  
    // Generate new heart positions for the next round
    generateHeartPositions();
  
    // Call createBoard again to generate a new game board and calculate neighboring mines
    createBoard();
  };
  
  
  
  const renderGameBoard = () => {
 
    return (
      <div className="level2-container">
        <div className="top-section">
          <div className="points">Points: {level2Points}</div>
          <div className="result">{result}</div>
          <div className="flags-left">Flags Left: {flagsLeft}</div>
        </div>
        <div className="game-board-wrapper">
          <div className="game-board" ref={gameBoardRef} onContextMenu={handleContextMenu} style={{ backgroundImage: `url(${backgroundImage})` }}>
            {gameBoard.map((row, rowIndex) => (
              <div className="row" key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <div
                    className={`cell ${cell.isCovered ? "" : "uncovered"}`}
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    onContextMenu={(event) => handleRightClick(event, rowIndex, colIndex)}
                  >
                    {!cell.isCovered && !cell.isMine && cell.neighborMines > 0 && (
                      <div className={`number ${getNumberColor(cell.neighborMines)}`}>
                        {cell.neighborMines}
                      </div>
                    )}
                    {cell.isFlagged && cell.isCovered && (
                      <img src={flagImage} alt="🚩" className="flag" />
                    )}
                    {!cell.isCovered && cell.isMine && (
                      <img src={heartImage} alt="Heart" className="heart" />
                    )}
                  </div>
                ))}
              </div>
            ))}
            {isGameOver && (
              <button className="next-round-button" onClick={handleNextRound}>
              <img className="heart-icon" src={heartIcon} alt="Heart" />
              <span className="heart-text">Next Round</span>
            </button>

            )}
          </div>
        </div>
      </div>
    );
  };
  

  const handleContextMenu = (event) => {
    event.preventDefault(); // Prevent the default context menu from appearing
  };

  const getNumberColor = (number) => {
    switch (number) {
      case 1:
        return 'one';
      case 2:
        return 'two';
      case 3:
        return 'three';
      case 4:
        return 'four';
      case 5:
        return 'five';
      default:
        return '';
    }
  };

  return renderGameBoard();
};

export default Level2;
