/* eslint-disable no-restricted-syntax */

const nameGetter = (state) => ({
  getName: () => state.name,
});

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

const symbolGetter = (state) => ({
  getSymbol: () => state.symbol,
});

const speciesGetter = (state) => ({
  getSpecies: () => state.species,
});

const Player = (name, symbol, species) => {
  const state = {
    name,
    symbol,
    species,
  };
  return {
    ...nameGetter(state),
    ...symbolGetter(state),
    ...speciesGetter(state),
  }
}

const gameSquaresGetter = (state) => ({
  getArray: () => state.gameSquares,
});

const gameSquareIDsGetter = (state) => ({
  getGameSquareIDs: () => state.gameSquareIDs,
});

const markCounter = (state) => ({
  countMarks: (symbol) => {
    let marks = 0;
    if (symbol === "all") {
      for (const square of state.gameSquares) {
        if (square.getMark() !== null) {
          marks += 1;
        }
      }
      return marks;
    }
    for (const square of state.gameSquares) {
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
    gameSquares: [
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
    ...gameSquaresGetter(state),
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
    } else if (winSet.countMarks("O") === 3) {
      notificationText.textContent = "O WINS";
      gameDirector.setWinner();
    }
  },
});

const WinSet = (set) => {
  const state = {
    gameSquares: set,
  };
  return {
    ...gameSquaresGetter(state),
    ...winSetChecker(state),
    ...markCounter(state),
  };
};

const subArrayGetter = (state) => ({
  getSubArray: () => state.subArrays,
});

const winChecker = () => ({
  checkWin: () => {
    if (gameboard.countMarks("all") === 9) {
      notificationText.textContent = "CAT'S GAME!";
      gameDirector.setWinner("Draw");
    } else {
      for (const winSet of winSets.getArray()) {
        winSet.checkWinSet(winSet);
      }
      if (gameDirector.getWinner() === null) {
        gameDirector.incrementTurn();
      }
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
      gameSquares: set,
    };
    return { ...gameSquaresGetter(state) };
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
    gameSquares: [
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
    ...gameSquaresGetter(state),
    ...subArrayGetter(state),
    ...winChecker(state),
  };
})();

const newGameStarter = () => ({
  startNewGame: () => {
    gameDirector.clearGameboardSquares();
    gameDirector.clearDOMSquares();
    gameDirector.setWinner(null);
    gameDirector.notifyCurrentPlayer();
  },
});

const gameboardSquareClearer = () => ({
  clearGameboardSquares: () => {
    const gameboardSquares = gameboard.getArray();

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
    const newGameButton = document.querySelector("#newGameButton");

    for (const domSquare of domSquares) {
      domSquare.addEventListener("click", () => {
        // eslint-disable-next-line no-use-before-define
        gameDirector.handleMoveSelection(domSquare.id);
      });
    }
    newGameButton.addEventListener("click", () => {
      // eslint-disable-next-line no-use-before-define
      gameDirector.startNewGame();
    });
  },
});

const playerNotifier = (state) => ({
  notifyCurrentPlayer: () => {
    const notificationText = document.querySelector("#notificationText");
    notificationText.textContent = `${state.currentPlayerTurn}, it is your turn!`;
    gameDirector.setWaitingStatus(true);
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
  handleMoveSelection: (moveSelection) => {
    const gameboardSquareIndex = gameboard
      .getGameSquareIDs()
      .indexOf(moveSelection);
    const gameboardSquare = gameboard.getArray()[gameboardSquareIndex];
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
  applyMoveSelection: (moveSelection, gameboardSquare) => {
    const domSquare = document.querySelector(`#${moveSelection}`);
    domSquare.textContent = state.currentSymbol;
    gameboardSquare.setMark(state.currentSymbol);
    gameDirector.checkWin();
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
    if (state.currentPlayerTurn === "player1") {
      state.currentPlayerTurn = "player2";
    } else if (state.currentPlayerTurn === "player2") {
      state.currentPlayerTurn = "player1";
    }
    if (state.currentSymbol === "X") {
      state.currentSymbol = "O";
    } else if (state.currentSymbol === "O") {
      state.currentSymbol = "X";
    }
    gameDirector.notifyCurrentPlayer();
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
    waiting: false,
  };

  return {
    ...newGameStarter(state),
    ...waitingStatusGetter(state),
    ...waitingStatusSetter(state),
    ...nameGetter(state),
    ...gameboardSquareClearer(state),
    ...domSquareClearer(state),
    ...domAssigner(state),
    ...playerNotifier(state),
    ...moveSelectionHandler(state),
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
