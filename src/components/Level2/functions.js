// functions.js

export const addFlag = (cell, flags, setFlagsLeft, gameBoard, setGameBoard, checkForWin, isGameOver) => {
  if (isGameOver) return;
  if (!cell.isCovered && flags < 5) {
    const updatedBoard = [...gameBoard];
    if (!cell.isFlagged) {
      cell.isFlagged = true;
      setFlagsLeft((prevFlagsLeft) => prevFlagsLeft - 1);
    } else {
      cell.isFlagged = false;
      setFlagsLeft((prevFlagsLeft) => prevFlagsLeft + 1);
    }
    setGameBoard(updatedBoard);
    checkForWin();
  }
};

export const click = (cell, isGameOver, handleGameOver, gameBoard, setGameBoard, checkSquare, checkForWin) => {
  if (isGameOver) return;
  if (!cell.isCovered || cell.isFlagged) return;

  if (cell.isMine) {
    handleGameOver();
  } else {
    if (cell.neighborMines === 0) {
      checkSquare(cell);
    } else {
      cell.isCovered = false;
      const updatedBoard = [...gameBoard];
      setGameBoard(updatedBoard);
    }

    checkForWin();
  }
};

export const checkSquare = (cell, cols, rows, gameBoard, click) => {
  const { row, col } = cell;
  const isLeftEdge = col === 0;
  const isRightEdge = col === cols - 1;

  setTimeout(() => {
    if (col > 0 && !isLeftEdge) {
      click(gameBoard[row][col - 1]);
    }
    if (col < cols - 1 && !isRightEdge) {
      click(gameBoard[row][col + 1]);
    }
    if (row > 0) {
      click(gameBoard[row - 1][col]);
      if (!isLeftEdge) click(gameBoard[row - 1][col - 1]);
      if (!isRightEdge) click(gameBoard[row - 1][col + 1]);
    }
    if (row < rows - 1) {
      click(gameBoard[row + 1][col]);
      if (!isLeftEdge) click(gameBoard[row + 1][col - 1]);
      if (!isRightEdge) click(gameBoard[row + 1][col + 1]);
    }
  }, 10);
};

export const GameOver = (setIsGameOver, setResult, gameBoard, setGameBoard) => {
  setIsGameOver(true);
  setResult('Hearts! Game Over!');

  // Show all hearts
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
