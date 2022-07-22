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
  const $oneCard = document.getElementById("one-container");
  const $tieCard = document.getElementById("tie-container");
  const $twoCard = document.getElementById("two-container");
  const $startBtn = document.getElementById("start-game");
  const $settingsBtn = document.getElementById("settings-btn");

  const $playerOneName = document.getElementById("player-one");
  const $playerTwoName = document.getElementById("player-two");
  const $form = document.getElementsByTagName("form")[0];

  const oneWon = () => {
    $oneCard.children[1].innerText =
      Number($oneCard.children[1].innerText) + 1 + "";
  };
  const twoWon = () => {
    $twoCard.children[1].innerText =
      Number($twoCard.children[1].innerText) + 1 + "";
  };

  const tie = () => {
    $tieCard.children[1].innerText =
      Number($tieCard.children[1].innerText) + 1 + "";
  };

  const restartGame = () => {
    gameBoard.clearBoard();
    displayController.HideRestart();
  };

  const startGame = (e) => {
    e.preventDefault();
    $form.style.display = "none";
    $settingsBtn.style.display = "inline";
    if ($playerOneName.value !== "") {
      $oneCard.children[0].innerText = $playerOneName.value + " - O";
    } else {
      $oneCard.children[0].innerText = "Player 1 - O";
    }
    console.log($twoCard.children[0].innerText);

    if ($playerTwoName.value !== "") {
      $twoCard.children[0].innerText = $playerTwoName.value + " - X";
    } else {
      $twoCard.children[0].innerText = "Player 2 - X";
    }
    gameBoard.startGame();
  };

  const resetScore = () => {
    $tieCard.children[1].innerText = "0";
    $oneCard.children[1].innerText = "0";
    $twoCard.children[1].innerText = "0";
  };

  const showSettings = () => {
    $form.style.display = "flex";
    $settingsBtn.style.display = "none";
    resetScore();
    restartGame();
    gameBoard.pauseGame();
  };

  $restartBtn.addEventListener("click", restartGame);
  $startBtn.addEventListener("click", startGame);
  $settingsBtn.addEventListener("click", showSettings);

  const showRestart = () => {
    $restartBtn.style.display = "block";
  };

  const HideRestart = () => {
    $restartBtn.style.display = "none";
  };

  return {
    showRestart,
    HideRestart,
    oneWon,
    twoWon,
    tie,
  };
})();

const gameBoard = (() => {
  // prettier-ignore
  let board = ["", "", "",
               "", "", "",
               "", "", ""];

  let startedGame = false;
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
    if (element === "O") {
      gridBlock.style.color = "#0092ca";
    }

    if (element === "X") {
      gridBlock.style.color = "tomato";
    }

    return gridBlock;
  };

  const startGame = () => {
    startedGame = true;
    render();
  };

  const pauseGame = () => {
    startedGame = false;
    render();
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
    if (checkWin()) {
      if (currentPlayer === firstPlayer) displayController.oneWon();
      else displayController.twoWon();

      displayController.showRestart();

      return true;
    } else if (!board.includes("")) {
      displayController.tie();
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
    startGame,
    pauseGame,
  };
})();
