/* eslint-disable no-restricted-syntax */

const nameGetter = (state) => ({
  getName: () => state.name,
});

const markGetter = (state) => ({
  getMark: () => state.mark,
});

const markSetter = (state) => ({
  setMark: (symbol) => {
    if (state.mark === null) {
      state.mark = symbol;
    }
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

const arrayGetter = (state) => ({
  getArray: () => state.array,
});

const gameSquareIDsGetter = (state) => ({
  getGameSquareIDs: () => state.gameSquareIDs,
});

const markCounter = (state) => ({
  countMarks: (symbol) => {
    let marks = 0;
    for (const square of state.array) {
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
    array: [
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
    ...arrayGetter(state),
    ...gameSquareIDsGetter(state),
    ...markCounter(state),
  };
})();

const winSetChecker = () => ({
  checkWinSet: (winSet) => {
    const notificationText = document.querySelector("#notificationText");
    if (winSet.countMarks("X") === 3) {
      notificationText.textContent = "X WINS";
      gameDirector.setWinner();
    } else if (winSet.countMarks("O") === 3) {
      notificationText.textContent = "O WINS";
      gameDirector.setWinner();
    }
  },
});

const WinSet = (set) => {
  const state = {
    array: set,
  };
  return {
    ...arrayGetter(state),
    ...winSetChecker(state),
    ...markCounter(state),
  };
};

const subArrayGetter = (state) => ({
  getSubArray: () => state.subArrays,
});

const winChecker = (state) => ({
  checkWin: () => {
    for (const winSet of state.array) {
      winSet.checkWinSet(winSet);
    }
  },
});

const winSets = (() => {
  const allSquares = gameboard.getArray();

  const topRow = WinSet(allSquares.slice(0, 3));
  const midRow = WinSet(allSquares.slice(3, 6));
  const bottomRow = WinSet(allSquares.slice(6, 9));
  const leftColumn = WinSet([allSquares[0], allSquares[3], allSquares[6]]);
  const centerColumn = WinSet([allSquares[1], allSquares[4], allSquares[7]]);
  const rightColumn = WinSet([allSquares[2], allSquares[5], allSquares[8]]);
  const diagonalX = WinSet([allSquares[0], allSquares[4], allSquares[8]]);
  const diagonalY = WinSet([allSquares[2], allSquares[4], allSquares[6]]);

  const WinSetGroup = (set) => {
    const state = {
      array: set,
    };
    return { ...arrayGetter(state) };
  };

  const rowsAndColumns = WinSetGroup([
    topRow,
    midRow,
    bottomRow,
    leftColumn,
    centerColumn,
    rightColumn,
  ]);
  const diagonals = WinSetGroup([diagonalX, diagonalY]);

  const state = {
    subArrays: [rowsAndColumns, diagonals],
    array: [
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
    ...arrayGetter(state),
    ...subArrayGetter(state),
    ...winChecker(state),
  };
})();

const gameController = (state) => ({
  controlGame: (process) => {
    gameDirector.setCurrentProcess(process);
    switch (state.currentProcess) {
      case "newGame":
        gameDirector.clearSquares();
        gameDirector.controlGame("playerTurn");
        break;
      case "playerTurn":
        gameDirector.notifyCurrentPlayer();
        gameDirector.setCurrentProcess("awaitMoveSelection");
        break;
      case "receiveMoveSelection":
        winSets.checkWin();
        if (gameDirector.getWinner() === null) {
          gameDirector.incrementTurn();
          gameDirector.controlGame("playerTurn");
        } else {
          gameDirector.setCurrentProcess(null);
        }
        break;
      default:
        gameDirector.setCurrentProcess(null);
        break;
    }
  },
});

const domSquareClearer = () => ({
  clearSquares: () => {
    const domSquares = document.querySelectorAll(".gameSquare");

    for (const domSquare of domSquares) {
      domSquare.textContent = "";
    }
  },
});

const domAssigner = () => ({
  assignSquares: () => {
    const domSquares = document.querySelectorAll(".gameSquare");
    const newGameButton = document.querySelector("#newGameButton");

    for (const domSquare of domSquares) {
      domSquare.addEventListener("click", () => {
        // eslint-disable-next-line no-use-before-define
        gameDirector.applyMoveSelection(domSquare.id);
        // eslint-disable-next-line no-use-before-define
        gameDirector.controlGame("receiveMoveSelection");
      });
    }
    newGameButton.addEventListener("click", () => {
      // eslint-disable-next-line no-use-before-define
      gameDirector.controlGame("newGame");
    });
  },
});

const playerNotifier = (state) => ({
  notifyCurrentPlayer: () => {
    const notificationText = document.querySelector("#notificationText");
    notificationText.textContent = `${state.currentPlayerTurn}, it is your turn!`;
  },
});

const moveSelectionApplicator = (state) => ({
  applyMoveSelection: (domSquareID) => {
    const domSquare = document.querySelector(`#${domSquareID}`);
    domSquare.textContent = state.currentSymbol;
    const gameboardSquare = gameboard.getGameSquareIDs().indexOf(domSquareID);
    gameboard.getArray()[gameboardSquare].setMark(state.currentSymbol);
  },
});

const currentProcessGetter = (state) => ({
  getCurrentProcess: () => state.currentProcess,
});

const currentProcessSetter = (state) => ({
  setCurrentProcess: (process) => {
    state.currentProcess = process;
  },
});

const turnIncrementer = (state) => ({
  incrementTurn: () => {
    if (state.currentPlayerTurn === 'player1') {
      state.currentPlayerTurn = "player2";
    } else if (state.currentPlayerTurn === 'player2') {
      state.currentPlayerTurn = "player1";
    };
    if (state.currentSymbol === 'X') {
      state.currentSymbol = "O";
    } else if (state.currentSymbol === 'O') {
      state.currentSymbol = "X";
    };
  },
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
    currentPlayerTurn: "player2",
    currentSymbol: "O",
    player1Symbol: "X",
    player2Symbol: "O",
    currentProcess: null,
    winner: null,
  };

  return {
    ...gameController(state),
    ...nameGetter(state),
    ...domSquareClearer(state),
    ...domAssigner(state),
    ...playerNotifier(state),
    ...moveSelectionApplicator(state),
    ...winChecker(winSets.state),
    ...currentProcessGetter(state),
    ...currentProcessSetter(state),
    ...turnIncrementer(state),
    ...winnerGetter(state),
    ...winnerSetter(state),
  };
})();

const possibleMoveUpdater = (state) => ({
  updatePossibleMoves: () => {
    for (const square of state.possibleMoves) {
      if (square.getMark() !== null) {
        state.possibleMoves.splice(state.possibleMoves.indexOf(square), 1);
      }
    }
  },
});

const possibleMoveGetter = (state) => ({
  getPossibleMoves: () => state.possibleMoves,
});

const moveMaker = (state) => {
  const squares = gameboard.getArray();
  const makeAnyMove = () => {
    for (const square of squares) {
      if (square.getMark === null) {
        square.setMark(state.symbol);
        winSets.checkWin();
      }
    }
  };
  const makeCrucialMove = () => {
    for (const square of winSets.getArray()) {
      square.setMark(state.symbol);
    }
    winSets.checkWin();
  };
  const makeMove = () => {
    if (state.skill < Math.floor(Math.random() * 10)) {
      return makeAnyMove();
    }
    for (const winSet of winSets.getArray()) {
      if (
        winSet.countMarks(state.symbol) === 2 &&
        winSet.countMarks(state.opponentSymbol) === 0
      ) {
        return makeCrucialMove();
      }
    }
    for (const winSet of winSets.getArray()) {
      if (
        winSet.countMarks(state.symbol) === 0 &&
        winSet.countMarks(state.opponentSymbol) === 2
      ) {
        return makeCrucialMove();
      }
    }
    for (const winSet of winSets.getSubArray()[0].getArray()) {
      if (
        winSet.countMarks(state.symbol) === 1 &&
        winSet.countMarks(state.opponentSymbol) === 0
      ) {
        for (const square of winSet.getArray()) {
          if (square.getMark() === null && square.getPosition() === "corner") {
            square.setMark(state.symbol);
            return winSets.checkWin();
          }
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
          square.getPosition() === "corner"
        ) {
          squares[4].setMark(state.symbol);
          return winSets.checkWin();
        }
      }
    }
    for (const square of squares) {
      if (square.getPosition() === "corner" && square.getMark() === null) {
        square.setMark(state.symbol);
        return winSets.checkWin();
      }
    }
    return makeAnyMove();
  };

  return { makeMove };
};

const skillSetter = (state) => ({
  setSkill: (integer) => {
    state.skill = integer;
  },
});

const ai = (() => {
  const state = {
    skill: 100,
    possibleMoves: gameboard.getArray(),
    symbol: "X",
    opponentSymbol: "O",
  };
  return {
    ...possibleMoveUpdater(state),
    ...possibleMoveGetter(state),
    ...moveMaker(state),
    ...skillSetter(state),
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
  },
});

const colorController = (() => {
  const state = {
    rainbowHue: Math.floor(Math.random() * 360),
    body: document.querySelector("body"),
  };
  return { ...rainbowShifter(state), ...colorUpdater(state) };
})();

setInterval(colorController.shiftRainbow, 250);
setInterval(colorController.updateColor, 250);

gameDirector.assignSquares();

// gameDirector flow:
// 1) Initialize Board or increment currentPlayerTurn : gamedirector.assignSquares()
// 2) Notify Player of Turn gameDirector.notifyCurrentPlayer()
// 3) Process Player's turn selection : gamedirector.applyMoveSelection()
// 4) Check if the player has won. If they have, celebrate! : gamedirector.checkWin()
//
//
