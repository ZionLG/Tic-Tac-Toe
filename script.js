const player = (name, symbol) => {
  let _name = name;
  let _symbol = symbol;

  const getName = () => _name;
  const setName = (newName) => (_name = newName);
  const getSymbol = () => _symbol;

  return { getName, setName, getSymbol };
};

const displayController = (() => {
  const $restartBtn = document.getElementById("restart");

  const restartGame = () => {
    gameBoard.clearBoard();
    displayController.HideRestart();
  };

  $restartBtn.addEventListener("click", restartGame);

  const showRestart = () => {
    $restartBtn.style.display = "block";
  };

  const HideRestart = () => {
    $restartBtn.style.display = "none";
  };

  return {
    showRestart,
    HideRestart,
  };
})();

const gameBoard = (() => {
  // prettier-ignore
  let board = ["", "", "",
               "", "", "",
               "", "", ""];

  let startedGame = true;
  const firstPlayer = player("Player 1", "O");
  const secondPlayer = player("Player 2", "X");
  let currentPlayer = firstPlayer;

  const $gameContainer = document.getElementById("game-container");

  const createHTMLElement = (element) => {
    const gridBlock = document.createElement("div");
    if (startedGame) {
      gridBlock.addEventListener("click", addMark);
    }
    gridBlock.innerText = element;
    return gridBlock;
  };

  const render = () => {
    $gameContainer.replaceChildren();
    board.forEach((element) => {
      $gameContainer.append(createHTMLElement(element));
    });
  };

  const addMark = (e) => {
    const index = Array.from(e.target.parentElement.children).indexOf(e.target);
    if (!isValid(index, currentPlayer.getSymbol())) {
      return false;
    }

    board[index] = currentPlayer.getSymbol();
    render();
    if (!winAction()) changePlayer();
    return true;
  };

  const changePlayer = () => {
    console.log(currentPlayer.getName());

    if (currentPlayer === firstPlayer) currentPlayer = secondPlayer;
    else currentPlayer = firstPlayer;
  };

  const isValid = (index) => {
    return (
      typeof index === "number" && board[index] === "" && index < board.length
    );
  };
  const clearBoard = () => {
    // prettier-ignore
    board = ["", "", "",
             "", "", "",
             "", "", ""];

    currentPlayer = firstPlayer;
    render();
  };

  const checkWin = () => {
    return (
      (board[0] === board[1] && board[0] === board[2] && board[0] !== "") ||
      (board[3] === board[4] && board[3] === board[5] && board[3] !== "") ||
      (board[6] === board[7] && board[6] === board[8] && board[6] !== "") ||
      (board[0] === board[3] && board[0] === board[6] && board[0] !== "") ||
      (board[1] === board[4] && board[1] === board[7] && board[1] !== "") ||
      (board[2] === board[5] && board[2] === board[8] && board[2] !== "") ||
      (board[0] === board[4] && board[0] === board[8] && board[0] !== "") ||
      (board[2] === board[4] && board[2] === board[6] && board[2] !== "")
    );
  };

  const winAction = () => {
    if (checkWin) {
      console.log(
        currentPlayer.getSymbol() +
          " " +
          currentPlayer.getName() +
          " Won the game"
      );
      displayController.showRestart();
      return true;
    } else if (!board.includes("")) {
      console.log("Tie");
      displayController.showRestart();
      return true;
    }
    return false;
  };
  render();

  return {
    firstPlayer,
    secondPlayer,
    clearBoard,
  };
})();
