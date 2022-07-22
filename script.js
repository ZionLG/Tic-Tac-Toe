const player = (name, symbol) => {
  let _name = name;
  let _symbol = symbol;

  const getName = () => _name;
  const setName = (newName) => (_name = newName);
  const getSymbol = () => _symbol;

  return { getName, setName, getSymbol };
};

const gameBoard = (() => {
  // prettier-ignore
  let board = ["", "", "",
               "", "", "",
               "", "", ""];

  const firstPlayer = player("Player 1", "O");
  const secondPlayer = player("Player 2", "X");
  let currentPlayer = firstPlayer;

  const $gameContainer = document.getElementById("game-container");

  const createHTMLElement = (element) => {
    const gridBlock = document.createElement("div");
    gridBlock.addEventListener("click", addMark);
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
    if (!checkWin()) changePlayer();
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
  };
  const checkWin = () => {
    if (
      (board[0] === board[1] && board[0] === board[2] && board[0] !== "") ||
      (board[3] === board[4] && board[3] === board[5] && board[3] !== "") ||
      (board[6] === board[7] && board[6] === board[8] && board[6] !== "") ||
      (board[0] === board[3] && board[0] === board[6] && board[0] !== "") ||
      (board[1] === board[4] && board[1] === board[7] && board[1] !== "") ||
      (board[2] === board[5] && board[2] === board[8] && board[2] !== "") ||
      (board[0] === board[4] && board[0] === board[8] && board[0] !== "") ||
      (board[2] === board[4] && board[2] === board[6] && board[2] !== "")
    ) {
      console.log(
        currentPlayer.getSymbol() +
          " " +
          currentPlayer.getName() +
          " Won the game"
      );
      clearBoard();
      return true;
    } else if (!board.includes("")) {
      console.log("Tie");
      clearBoard();
      return true;
    }
    return false;
  };

  render();

  return {
    firstPlayer,
    secondPlayer,
  };
})();
