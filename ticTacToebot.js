/* eslint-disable no-restricted-syntax */

const nameDisplayGetter = (state) => ({
  getNameDisplay: () => state.nameDisplay,
});

const nameDisplayUpdater = (state) => ({
  updateNameDisplay: (newName) => {
    state.nameDisplay.textContent = newName;
  },
});

const player1Card = (() => {
  const state = {
    nameDisplay: document.querySelector("#player1Name"),
  };

  return {
    ...nameDisplayGetter(state),
    ...nameDisplayUpdater(state),
  };
})();

const player2Card = (() => {
  const state = {
    nameDisplay: document.querySelector("#player2Name"),
  };

  return {
    ...nameDisplayGetter(state),
    ...nameDisplayUpdater(state),
  };
})();

const indexGetter = (state) => ({
  getIndex: () => state.index,
});

const nameGetter = (state) => ({
  getName: () => state.name,
});

const nameSetter = (state) => ({
  setName: (newName) => {
    state.name = newName;
  },
});

const nameChanger = () => ({
  changeName: function changeName() {
    if (gameDirector.getActiveStatus() === true) {
      return;
    }
    this.setName(prompt("Enter Player1's Name", "Human Challenger"));
    player1Card.updateNameDisplay(this.getName());
  },
});

const cardNameGetter = (state) => ({
  getCardName: () => state.cardName,
});

const skillLevelGetter = (state) => ({
  getSkillLevel: () => state.skillLevel,
});

const SkillClass = (index, name, cardName, skillLevel) => {
  const state = {
    index,
    name,
    cardName,
    skillLevel,
  };
  return {
    ...indexGetter(state),
    ...nameGetter(state),
    ...cardNameGetter(state),
    ...skillLevelGetter(state),
  };
};

const easy = SkillClass("0", "easy", "Random Picker", "0");
const medium = SkillClass("1", "medium", "Distracted Doodler", "50");
const hard = SkillClass("2", "hard", "Schoolyard Champ", "80");
const impossible = SkillClass("3", "impossible", "Unbeatable Master", "100");

const skillListGetter = (state) => ({
  getSkillList: () => state.skillList,
});

const skillClassIncrementer = (state) => ({
  incrementSkillClass: () => {
    const skillList = ai.getSkillList();
    const newSkillClassIndex = toolbox.getIncrementedIndex(
      skillList,
      state.skillClass
    );
    state.skillClass = skillList[newSkillClassIndex];
  },
});

const skillChanger = () => ({
  changeSkill: function changeSkill() {
    if (gameDirector.getActiveStatus() === true) {
      return;
    }
    const player2SkillButton = document.querySelector("#player2SkillButton");
    this.incrementSkillClass();
    player2Card.updateNameDisplay(this.getSkillClass().getCardName());
    this.setName(this.getSkillClass().getCardName());
    player2SkillButton.textContent = this.getSkillClass()
      .getName()
      .toUpperCase();
  },
});

const incrementedIndexGetter = () => ({
  getIncrementedIndex: (array, value) => {
    let newIndex = array.indexOf(value) + 1;
    if (newIndex >= array.length) {
      newIndex = 0;
    }
    return newIndex;
  },
});

const randomIntegerGetter = () => ({
  getRandomInteger: (minInteger, range) =>
    Math.floor(Math.random() * range) + minInteger,
});

const toolbox = (() => {
  const state = {
    name: "toolbox",
  };

  return {
    ...incrementedIndexGetter(state),
    ...randomIntegerGetter(state),
  };
})();

const symbolButtonUpdater = (state) => ({
  updateSymbolButtons: () => {
    state.player1SymbolButton.textContent = player1.getSymbol();
  }
});

const turnOrderButtonUpdater = (state) => ({
  updateTurnOrderButtons: () => {
    state.player1TurnOrderButton.textContent = player1.getTurnOrder();
  }
});

const displayController = (() => {
  const state = {
    player1SymbolButton: document.querySelector("#player1SymbolButton"),
    player1TurnOrderButton: document.querySelector("#player1TurnOrderButton"),

  };

  return {
    ...symbolButtonUpdater(state),
    ...turnOrderButtonUpdater(state),
  }
})();

const symbolIncrementer = (state) => ({
  incrementSymbol: function incrementSymbol() {
    const symbolList = gameDirector.getSymbolList();
    const newSymbolIndex = toolbox.getIncrementedIndex(
      symbolList,
      state.symbol
    );
    state.symbol = symbolList[newSymbolIndex];
  },
});

const symbolChanger = (state) => ({
  changeSymbol: function changeSymbol() {
    if (gameDirector.getActiveStatus() === true) {
      return;
    }
    this.incrementSymbol();
    displayController.updateSymbolButtons();
  },
});

const symbolGetter = (state) => ({
  getSymbol: () => state.symbol,
});

const turnOrderIncrementer = (state) => ({
  incrementTurnOrder: function incrementTurnOrder() {
    const turnOrderList = gameDirector.getTurnOrderList();
    const newTurnOrderIndex = toolbox.getIncrementedIndex(
      turnOrderList,
      state.turnOrder
    );
    state.turnOrder = turnOrderList[newTurnOrderIndex];
  },
});

const turnOrderChanger = (state) => ({
  changeTurnOrder: function changeTurnOrder() {
    if (gameDirector.getActiveStatus() === true) {
      return;
    }
    this.incrementTurnOrder();
    displayController.updateTurnOrderButtons();
  }
});

const speciesGetter = (state) => ({
  getSpecies: () => state.species,
});

const possibleMoveGetter = (state) => ({
  getPossibleMoves: () => state.possibleMoves,
});

const possibleMoveAdder = (state) => ({
  addPossibleMove: (possibleMove) => {
    state.possibleMoves.push(possibleMove);
  },
});

const possibleMoveChooser = (state) => ({
  chooseFromPossibleMoves: () => {
    const selectionIndex = toolbox.getRandomInteger(0, state.possibleMoves.length);
    const moveSelection = state.possibleMoves[selectionIndex];
    state.possibleMoves = [];
    return moveSelection;
  },
});

const skillClassGetter = (state) => ({
  getSkillClass: () => state.skillClass,
});

const skillClassSetter = (state) => ({
  setSkillClass: (newSkillClass) => {
    state.skillClass = newSkillClass;
  },
});

const humanChecker = (state) => ({
  checkHuman: () => state.humanQuestionMark,
});

const HumanInterface = () => {
  const state = {
    humanQuestionMark: "yes",
  };
  return {
    ...checkHuman(state),
  };
};

const AIInterface = (skillClass) => {
  const state = {
    possibleMoves: [],
    skillClass,
  };
  return {
    ...skillChanger(state),
    ...possibleMoveAdder(state),
    ...possibleMoveGetter(state),
    ...possibleMoveChooser(state),
    ...skillClassGetter(state),
    ...skillClassSetter(state),
    ...skillClassIncrementer(state),
  };
};

const turnOrderGetter = (state) => ({
  getTurnOrder: () => state.turnOrder,
});

const Player = (name, symbol, species, input) => {
  const state = {
    name,
    symbol,
    species,
    input,
    possibleMoves: [],
    skillClass: hard,
    turnOrder: "1ST",
  };
  return {
    ...turnOrderGetter(state),
    ...turnOrderChanger(state),
    ...turnOrderIncrementer(state),
    ...nameGetter(state),
    ...nameSetter(state),
    ...nameChanger(state),
    ...skillChanger(state),
    ...symbolGetter(state),
    ...symbolChanger(state),
    ...symbolIncrementer(state),
    ...speciesGetter(state),
    ...possibleMoveAdder(state),
    ...possibleMoveGetter(state),
    ...possibleMoveChooser(state),
    ...skillClassGetter(state),
    ...skillClassSetter(state),
    ...skillClassIncrementer(state),
  };
};
// Notes for later RE: Imput. p sure the syntax is wrong
const player1 = Player(
  "Human Challenger",
  "O",
  "human",
  "const humanInput1 = HumanInterface()"
);
const player2 = Player(
  "Schoolyard Champ",
  "X",
  "computer",
  "const computerInput1 = AIInterface()"
);

const markGetter = (state) => ({
  getMark: () => state.mark,
});

const markSetter = (state) => ({
  setMark: (symbol) => {
    state.mark = symbol;
  },
});

const positionGetter = (state) => ({
  getPosition: () => state.position,
});

const Square = (name, position) => {
  const state = {
    name,
    position,
    mark: null,
  };
  return {
    ...nameGetter(state),
    ...markGetter(state),
    ...markSetter(state),
    ...positionGetter(state),
  };
};

const squaresArrayGetter = (state) => ({
  getSquaresArray: () => state.squaresArray,
});

const winsetsArrayGetter = (state) => ({
  getWinsetsArray: () => state.winsetsArray,
});

const gameSquareIDsGetter = (state) => ({
  getGameSquareIDs: () => state.gameSquareIDs,
});

const markCounter = (state) => ({
  countMarks: (symbol) => {
    let marks = 0;
    if (symbol === "all") {
      for (const square of state.squaresArray) {
        if (square.getMark() !== null) {
          marks += 1;
        }
      }
      return marks;
    }
    for (const square of state.squaresArray) {
      if (square.getMark() === symbol) {
        marks += 1;
      }
    }
    return marks;
  },
});

const gameboard = (() => {
  const topLeft = Square("topLeft", "corner");
  const topCenter = Square("topCenter", "side");
  const topRight = Square("topRight", "corner");
  const midLeft = Square("midLeft", "side");
  const midCenter = Square("midCenter", "inner");
  const midRight = Square("midRight", "side");
  const bottomLeft = Square("bottomLeft", "corner");
  const bottomCenter = Square("bottomCenter", "side");
  const bottomRight = Square("bottomRight", "corner");

  const state = {
    name: "gameboard",
    squaresArray: [
      topLeft,
      topCenter,
      topRight,
      midLeft,
      midCenter,
      midRight,
      bottomLeft,
      bottomCenter,
      bottomRight,
    ],
    gameSquareIDs: [
      "topLeft",
      "topCenter",
      "topRight",
      "midLeft",
      "midCenter",
      "midRight",
      "bottomLeft",
      "bottomCenter",
      "bottomRight",
    ],
  };

  return {
    ...nameGetter(state),
    ...squaresArrayGetter(state),
    ...gameSquareIDsGetter(state),
    ...markCounter(state),
  };
})();

const winsetChecker = () => ({
  checkWinset: (winset) => {
    const notificationText = document.querySelector("#notificationText");
    if (winset.countMarks(gameDirector.getCurrentPlayer().getSymbol()) === 3) {
      notificationText.textContent = `${gameDirector
        .getCurrentPlayer()
        .getName()
        .toUpperCase()} WINS`;
      gameDirector.setWinner();
      gameDirector.setActiveStatus(false);
    }
  },
});

const Winset = (set) => {
  const state = {
    squaresArray: set,
  };
  return {
    ...squaresArrayGetter(state),
    ...winsetChecker(state),
    ...markCounter(state),
  };
};

const winSupersetArrayGetter = (state) => ({
  getWinSupersetArray: () => state.winSupersetArray,
});

const winChecker = () => ({
  checkWin: function checkWin() {
    for (const winset of winsets.getWinsetsArray()) {
      winset.checkWinset(winset);
    }
    if (
      gameDirector.getWinner() === null &&
      gameboard.countMarks("all") === 9
    ) {
      notificationText.textContent = "CAT'S GAME!";
      gameDirector.setWinner("Draw");
      gameDirector.setActiveStatus(false);
    }
    if (gameDirector.getWinner() === null) {
      gameDirector.incrementTurn();
    }
  },
});

const winsets = (() => {
  const allSquares = gameboard.getSquaresArray();

  const topRow = Winset(allSquares.slice(0, 3));
  const midRow = Winset(allSquares.slice(3, 6));
  const bottomRow = Winset(allSquares.slice(6, 9));
  const leftColumn = Winset([allSquares[0], allSquares[3], allSquares[6]]);
  const centerColumn = Winset([allSquares[1], allSquares[4], allSquares[7]]);
  const rightColumn = Winset([allSquares[2], allSquares[5], allSquares[8]]);
  const diagonalX = Winset([allSquares[0], allSquares[4], allSquares[8]]);
  const diagonalY = Winset([allSquares[2], allSquares[4], allSquares[6]]);

  const WinsetGroup = (set) => {
    const state = {
      winsetsArray: set,
    };
    return { ...winsetsArrayGetter(state) };
  };

  const rowsAndColumns = WinsetGroup([
    topRow,
    midRow,
    bottomRow,
    leftColumn,
    centerColumn,
    rightColumn,
  ]);
  const diagonals = WinsetGroup([diagonalX, diagonalY]);

  const state = {
    winSupersetArray: [rowsAndColumns, diagonals],
    winsetsArray: [
      topRow,
      midRow,
      bottomRow,
      leftColumn,
      centerColumn,
      rightColumn,
      diagonalX,
      diagonalY,
    ],
  };

  return {
    ...winsetsArrayGetter(state),
    ...winSupersetArrayGetter(state),
    ...winChecker(state),
  };
})();

const playerButtonDeactivator = () => ({
  deactivatePlayerButtons: () => {
    const playerButtons = document.querySelectorAll(".playerButton");
    for (const playerButton of playerButtons) {
      playerButton.classList.remove("invertColor");
      playerButton.style["background-color"] = "#000408";
    }
  },
});

const newGameStarter = () => ({
  startNewGame: function startNewGame() {
    this.setActiveStatus(true);
    this.deactivatePlayerButtons();
    this.clearGameboardSquares();
    this.clearDOMSquares();
    this.setWinner(null);
    this.notifyCurrentPlayer();
  },
});

const gameboardSquareClearer = () => ({
  clearGameboardSquares: () => {
    const gameboardSquares = gameboard.getSquaresArray();

    for (const gameboardSquare of gameboardSquares) {
      gameboardSquare.setMark(null);
    }
  },
});

const domSquareClearer = () => ({
  clearDOMSquares: () => {
    const domSquares = document.querySelectorAll(".gameSquare");

    for (const domSquare of domSquares) {
      domSquare.textContent = "";
    }
  },
});

const domAssigner = () => ({
  assignSquares: () => {
    const domSquares = document.querySelectorAll(".gameSquare");
    const player1Buttons = document.querySelectorAll(".player1Button");
    const player2Buttons = document.querySelectorAll(".player2Button");
    const newGameButton = document.querySelector("#newGameButton");

    for (const domSquare of domSquares) {
      domSquare.addEventListener("click", () => {
        human.selectHumanMove(domSquare.id);
      });
    }
    // player1Buttons[0].addEventListener("click", () => {
    //   player1.changeSpecies();
    // });
    player1Buttons[1].addEventListener("click", () => {
      player1.changeName();
    });
    player1Buttons[2].addEventListener("click", () => {
      player1.changeSymbol();
    });
    player1Buttons[3].addEventListener("click", () => {
      player1.changeTurnOrder();
    });
    // player2Buttons[0].addEventListener("click", () => {
    //   player2.changeSpecies();
    // });
    player2Buttons[1].addEventListener("click", () => {
      player2.changeSkill();
    });
    // player2Buttons[2].addEventListener("click", () => {
    //   player2.changeSymbol();
    // });
    // player2Buttons[3].addEventListener("click", () => {
    //   player2.changeTurnOrder();
    // });
    newGameButton.addEventListener("click", () => {
      gameDirector.startNewGame();
    });
  },
});

const playerNotifier = (state) => ({
  notifyCurrentPlayer: function notifyCurrentPlayer() {
    const notificationText = document.querySelector("#notificationText");
    notificationText.textContent = `${state.currentPlayer.getName()}, it is your turn!`;
    this.setWaitingStatus(true);
    if (state.currentPlayer.getSpecies() === "computer") {
      ai.selectMove();
    }
  },
});

const waitingStatusGetter = (state) => ({
  getWaitingStatus: () => state.waitingStatus,
});

const waitingStatusSetter = (state) => ({
  setWaitingStatus: (waitingStatus) => {
    state.waitingStatus = waitingStatus;
  },
});

const moveSelectionHandler = () => ({
  handleMoveSelection: function handleMoveSelection(moveSelection) {
    const gameboardSquareIndex = gameboard
      .getGameSquareIDs()
      .indexOf(moveSelection);
    const gameboardSquare = gameboard.getSquaresArray()[gameboardSquareIndex];
    if (
      gameDirector.getWaitingStatus() === true &&
      gameboardSquare.getMark() === null
    ) {
      gameDirector.setWaitingStatus(false);
      gameDirector.applyMoveSelection(moveSelection, gameboardSquare);
    }
  },
});

const moveSelectionApplicator = (state) => ({
  applyMoveSelection: function applyMoveSelection(
    moveSelection,
    gameboardSquare
  ) {
    const domSquare = document.querySelector(`#${moveSelection}`);
    domSquare.textContent = state.currentPlayer.getSymbol();
    gameboardSquare.setMark(state.currentPlayer.getSymbol());
    this.checkWin();
  },
});

const currentPlayerGetter = (state) => ({
  getCurrentPlayer: () => state.currentPlayer,
});

const currentPlayerSetter = (state) => ({
  setCurrentPlayer: (currentPlayer) => {
    state.currentPlayer = currentPlayer;
  },
});

const activeStatusGetter = (state) => ({
  getActiveStatus: () => state.activeStatus,
});

const activeStatusSetter = (state) => ({
  setActiveStatus: (status) => {
    state.activeStatus = status;
  },
});

const turnIncrementer = (state) => ({
  incrementTurn: function incrementTurn() {
    if (state.currentPlayer === player1) {
      state.currentPlayer = player2;
    } else if (state.currentPlayer === player2) {
      state.currentPlayer = player1;
    }
    this.notifyCurrentPlayer();
  },
});

const symbolListGetter = (state) => ({
  getSymbolList: () => state.symbolList,
});

const turnOrderListGetter = (state) => ({
  getTurnOrderList: () => state.turnOrderList,
});

const winnerGetter = (state) => ({
  getWinner: () => state.winner,
});

const winnerSetter = (state) => ({
  setWinner: (winner) => {
    state.winner = winner;
  },
});

const gameDirector = (() => {
  const state = {
    name: "gameDirector",
    currentPlayer: player2,
    activeStatus: false,
    winner: null,
    waitingStatus: false,
    symbolList: ["X", "O", "RND"],
    turnOrderList: ["1ST", "2ND", "RND"],
  };

  return {
    ...newGameStarter(state),
    ...playerButtonDeactivator(state),
    ...waitingStatusGetter(state),
    ...waitingStatusSetter(state),
    ...nameGetter(state),
    ...currentPlayerSetter(state),
    ...currentPlayerGetter(state),
    ...gameboardSquareClearer(state),
    ...domSquareClearer(state),
    ...domAssigner(state),
    ...playerNotifier(state),
    ...moveSelectionHandler(state),
    ...moveSelectionApplicator(state),
    ...winChecker(winsets.state),
    ...activeStatusGetter(state),
    ...activeStatusSetter(state),
    ...turnIncrementer(state),
    ...turnOrderListGetter(state),
    ...symbolListGetter(state),
    ...winnerGetter(state),
    ...winnerSetter(state),
  };
})();

const moveSelector = (state) => {
  const squares = gameboard.getSquaresArray();
  const currentPlayer = gameDirector.getCurrentPlayer();
  const think = () => {
    const notificationText = document.querySelector("#notificationText");
    notificationText.textContent = `${currentPlayer.getName()} is thinking...`;
    const moveSelection = currentPlayer.chooseFromPossibleMoves();
    setTimeout(gameDirector.handleMoveSelection, 1000, moveSelection.getName());
  };
  const selectAnyMove = () => {
    for (const square of squares) {
      if (square.getMark() === null) {
        currentPlayer.addPossibleMove(square);
      }
    }
    return think();
  };

  const selectCrucialMove = (winset) => {
    for (const square of winset.getSquaresArray()) {
      if (square.getMark() === null) {
        currentPlayer.addPossibleMove(square);
      }
    }
    return think();
  };
  const selectMove = () => {
    const skillDC = getRandomInteger(1, 100);
    if (player2.getSkillClass().getSkillLevel() < skillDC) {
      return selectAnyMove();
    }
    for (const winset of winsets.getWinsetsArray()) {
      if (
        winset.countMarks(state.symbol) === 2 &&
        winset.countMarks(state.opponentSymbol) === 0
      ) {
        return selectCrucialMove(winset);
      }
    }
    for (const winset of winsets.getWinsetsArray()) {
      if (
        winset.countMarks(state.symbol) === 0 &&
        winset.countMarks(state.opponentSymbol) === 2
      ) {
        return selectCrucialMove(winset);
      }
    }
    for (const winset of winsets.getWinSupersetArray()[0].getWinsetsArray()) {
      if (
        winset.countMarks(state.symbol) === 1 &&
        winset.countMarks(state.opponentSymbol) === 0
      ) {
        for (const square of winset.getSquaresArray()) {
          if (square.getMark() === null && square.getPosition() === "corner") {
            currentPlayer.addPossibleMove(square);
          }
        }
        if (currentPlayer.getPossibleMoves().length > 0) {
          return think();
        }
      }
    }
    for (const winset of winsets.getWinSupersetArray()[0].getWinsetsArray()) {
      if (
        winset.countMarks(state.symbol) === 1 &&
        winset.countMarks(state.opponentSymbol) === 0
      ) {
        for (const square of winset.getSquaresArray()) {
          if (square.getMark() === null) {
            currentPlayer.addPossibleMove(square);
          }
        }
        if (currentPlayer.getPossibleMoves().length > 0) {
          return think();
        }
      }
    }
    if (
      gameboard.countMarks(state.symbol) === 0 &&
      gameboard.countMarks(state.opponentSymbol) === 1
    ) {
      for (const square of squares) {
        if (
          square.getMark() === state.opponentSymbol &&
          square.getPosition() === "corner" &&
          squares[4].getMark() === null
        ) {
          currentPlayer.addPossibleMove(squares[4]);
          return think();
        }
      }
    }
    for (const square of squares) {
      if (square.getPosition() === "corner" && square.getMark() === null) {
        currentPlayer.addPossibleMove(square);
      }
    }
    if (currentPlayer.getPossibleMoves().length > 0) {
      return think();
    }
    return selectAnyMove();
  };

  return { selectMove };
};

const ai = (() => {
  const state = {
    skillList: [easy, medium, hard, impossible],
    symbol: "X",
    opponentSymbol: "O",
  };
  return {
    ...moveSelector(state),
    ...skillListGetter(state),
  };
})();

const humanMoveSelector = () => ({
  selectHumanMove: (moveSelection) => {
    if (gameDirector.getCurrentPlayer().getSpecies() === "human") {
      gameDirector.handleMoveSelection(moveSelection);
    }
  },
});

const human = (() => {
  const state = {
    species: "human",
  };
  return {
    ...humanMoveSelector(state),
  };
})();

const rainbowShifter = (state) => ({
  shiftRainbow: () => {
    if (state.rainbowHue < 360) {
      state.rainbowHue += 1;
    } else {
      state.rainbowHue = 1;
    }
  },
});

const colorUpdater = (state) => ({
  updateColor: () => {
    document.querySelector(
      "body"
    ).style.color = `hsl(${state.rainbowHue}, 100%, 80%)`;
    const colorInvertedElements = document.querySelectorAll(".invertColor");
    for (const element of colorInvertedElements) {
      element.style["background-color"] = `hsl(${state.rainbowHue}, 100%, 80%)`;
    }
  },
});

const colorController = (() => {
  const state = {
    rainbowHue: toolbox.getRandomInteger(1, 360),
    body: document.querySelector("body"),
  };
  return { ...rainbowShifter(state), ...colorUpdater(state) };
})();

const pageInitializer = () => ({
  initializePage: () => {
    setInterval(colorController.shiftRainbow, 250);
    setInterval(colorController.updateColor, 250);
    gameDirector.assignSquares();
  },
});

const pageController = (() => {
  const state = {
    name: "pageController",
  };
  return { ...nameGetter(state), ...pageInitializer(state) };
})();

pageController.initializePage();
