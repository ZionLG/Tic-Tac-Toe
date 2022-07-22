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
  const $aiCheck = document.getElementById("ai");
  const $aiLevel = document.getElementById("ai-level").value;

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
    gameBoard.startGame();
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
    if ($aiCheck.checked) {
      gameBoard.enableAi($aiLevel);
    } else {
      gameBoard.enableAi("");
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
  let _board = ["", "", "",
               "", "", "",
               "", "", ""];

  let _startedGame = false;
  let _aiOn = "";
  const firstPlayer = player("Player 1", "O");
  const secondPlayer = player("Player 2", "X");
  let _currentPlayer = firstPlayer;

  const $gameContainer = document.getElementById("game-container");

  const enableAi = (aiLevel) => {
    _aiOn = aiLevel;
  };

  const createHTMLElement = (element) => {
    const gridBlock = document.createElement("div");
    if (_startedGame) {
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
    _startedGame = true;
    render();
  };

  const pauseGame = () => {
    _startedGame = false;
    render();
  };

  const render = () => {
    $gameContainer.replaceChildren();
    _board.forEach((element) => {
      $gameContainer.append(createHTMLElement(element));
    });
  };

  const addMark = (e) => {
    const index = Array.from(e.target.parentElement.children).indexOf(e.target);
    if (!isValid(index, _currentPlayer.getSymbol())) {
      return;
    }

    _board[index] = _currentPlayer.getSymbol();
    render();
    if (!winAction()) {
      changePlayer();

      if (_aiOn === "easy") {
        easyAi();
      }
    }
  };

  const changePlayer = () => {
    console.log(_currentPlayer.getName());

    if (_currentPlayer === firstPlayer) _currentPlayer = secondPlayer;
    else _currentPlayer = firstPlayer;
  };

  const isValid = (index) => {
    return (
      typeof index === "number" && _board[index] === "" && index < _board.length
    );
  };
  const clearBoard = () => {
    // prettier-ignore
    _board = ["", "", "",
             "", "", "",
             "", "", ""];

    _currentPlayer = firstPlayer;
    render();
  };

  const checkWin = () => {
    return (
      (_board[0] === _board[1] &&
        _board[0] === _board[2] &&
        _board[0] !== "") ||
      (_board[3] === _board[4] &&
        _board[3] === _board[5] &&
        _board[3] !== "") ||
      (_board[6] === _board[7] &&
        _board[6] === _board[8] &&
        _board[6] !== "") ||
      (_board[0] === _board[3] &&
        _board[0] === _board[6] &&
        _board[0] !== "") ||
      (_board[1] === _board[4] &&
        _board[1] === _board[7] &&
        _board[1] !== "") ||
      (_board[2] === _board[5] &&
        _board[2] === _board[8] &&
        _board[2] !== "") ||
      (_board[0] === _board[4] &&
        _board[0] === _board[8] &&
        _board[0] !== "") ||
      (_board[2] === _board[4] && _board[2] === _board[6] && _board[2] !== "")
    );
  };

  const winAction = () => {
    if (checkWin()) {
      if (_currentPlayer === firstPlayer) displayController.oneWon();
      else displayController.twoWon();

      displayController.showRestart();
      pauseGame();
      return true;
    } else if (!_board.includes("")) {
      displayController.tie();
      displayController.showRestart();
      pauseGame();
      return true;
    }

    return false;
  };

  const easyAi = () => {
    let markIndex;
    while (!isValid(markIndex, _currentPlayer.getSymbol())) {
      markIndex = Math.floor(Math.random() * 9);
    }

    _board[markIndex] = _currentPlayer.getSymbol();
    render();
    if (!winAction()) changePlayer();
  };

  render();

  return {
    firstPlayer,
    secondPlayer,
    clearBoard,
    startGame,
    pauseGame,
    enableAi,
  };
})();
