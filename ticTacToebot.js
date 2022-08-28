const domAssigner = state => ({
    assignSquares: () => {
        const domSquares = document.querySelectorAll('.gameSquare');

        for (let domSquare of domSquares) {
            domSquare.addEventListener('click', function() {gameDirector.applyMoveSelection(domSquare.id)})
    }}
})

const domSquareClearer = state => ({
    clearSquares: () => {
        const domSquares = document.querySelectorAll('.gameSquare');

        for (let domSquare of domSquares) {
            domSquare.innerHTML = '';
    }}
})

const nameGetter = state => ({
    getName: () => state.name
});

const arrayGetter = state => ({
    getArray: () => state.array
})

const subArrayGetter = state => ({
    getSubArray: () => state.subArrays
})

const positionGetter = state => ({
    getPosition: () => state.position
})

const markGetter = state => ({
    getMark: () => state.mark
});

const markSetter = state => ({
    setMark: (symbol) => {
        if (state.mark === null) {
            state.mark = symbol;
        }
    }
});

const markCounter = state => ({
    countMarks: (symbol) => {
        let marks = 0;
        for (let square of state.array) {
            if (square.getMark() === symbol) {
                marks += 1
            }
        }
        return marks;
    }
})

const possibleMoveGetter = state => ({
    getPossibleMoves: () => state.possibleMoves
})

const possibleMoveUpdater = state => ({
    updatePossibleMoves: () => {
        for (let square of state.possibleMoves) {
            if (square.getMark() !== null) {
                state.possibleMoves.splice(state.possibleMoves.indexOf(square), 1) 
            }
        }
    }
});

const winChecker = state => ({
    checkWin: () => {for (let winSet of state.array) {
        winSet.checkWinSet(winSet);
    }}
});

const winSetChecker = state => ({
    checkWinSet: (winSet) => {
        if (winSet.countMarks('X') === 3) {
            console.log("X WIN")
        } else if (winSet.countMarks('O') === 3) {
            console.log("O WIN")
        }
    }
});

const skillSetter = state => ({
    setSkill: (integer) => {
        state.skill = integer
    }
})

const moveMaker = state => {
    const squares = gameboard.getArray();
    const makeAnyMove = () => {
        for (let square of squares) {
            if (square.getMark === null) {
                square.setMark(state.symbol);
                winSets.checkWin();
            }
        }
    }
    const makeCrucialMove = () => {
            for (let square of winSets.getArray()) {
                square.setMark(state.symbol)
            }
            winSets.checkWin();
    }
    const makeMove = () => {
        if (state.skill < Math.floor(Math.random() * 10)) {
            return makeAnyMove();
        }
        for (let winSet of winSets.getArray()) {
            if (winSet.countMarks(state.symbol) === 2 &&
                winSet.countMarks(state.opponentSymbol) === 0) {
                return makeCrucialMove();
            }
        }
        for (let winSet of winSets.getArray()) {
            if (winSet.countMarks(state.symbol) === 0 &&
                winSet.countMarks(state.opponentSymbol) === 2) {
                return makeCrucialMove();
            }
        }
        for (let winSet of winSets.getSubArray()[0].getArray()) {
            if (winSet.countMarks(state.symbol) === 1 &&
                winSet.countMarks(state.opponentSymbol) === 0) {
                for (let square of winSet.getArray()) {
                    if (square.getMark() === null && 
                        square.getPosition() === 'corner') {
                        square.setMark(state.symbol);
                        return winSets.checkWin();
                    }
                }
            }
        }
        if (gameboard.countMarks(state.symbol) === 0 &&
            gameboard.countMarks(state.opponentSymbol) === 1) {
            for (let square of squares) {
                if (square.getMark() === state.opponentSymbol && 
                    square.getPosition() === 'corner') {
                    squares[4].setMark(state.symbol);
                    return winSets.checkWin();
                }
            }
        }
        for (let square of squares) {
            if (square.getPosition() === 'corner' && 
                square.getMark() === null) {
                square.setMark(state.symbol);
                return winSets.checkWin();
            }
        }
        return makeAnyMove();
    }

    return {makeMove}
}

const Square = (name, position) => {
    const state = {
        name,
        position,
        mark: null
    }
    return Object.assign({}, nameGetter(state), 
        markGetter(state), markSetter(state), positionGetter(state))
};

const WinSet = set => {
    const state = {
        array: set
    }
    return Object.assign({}, arrayGetter(state), winSetChecker(state), markCounter(state))
};

const WinSetGroup = set => {
    const state = {
        array: set
    }
    return Object.assign({}, arrayGetter(state))
};

const gameboard = (() => {
    const topLeft = Square('topLeft', 'corner');
    const topCenter = Square('topCenter', 'side');
    const topRight = Square('topRight', 'corner');
    const midLeft = Square('midLeft', 'side');
    const midCenter = Square('midCenter', 'inner');
    const midRight = Square('midRight', 'side');
    const bottomLeft = Square('bottomLeft', 'corner');
    const bottomCenter = Square('bottomCenter', 'side');
    const bottomRight = Square('bottomRight', 'corner');

    const state = {
        name: 'gameboard',
        array: [topLeft, topCenter, topRight, midLeft, midCenter, 
        midRight, bottomLeft, bottomCenter, bottomRight]
    }

    return Object.assign ({}, arrayGetter(state), nameGetter(state), markCounter(state));
})();

const winSets = (() => {
    const allSquares = gameboard.getArray();

    const topRow = WinSet(allSquares.slice(0, 3));
    const midRow = WinSet(allSquares.slice(3, 6));
    const bottomRow = WinSet(allSquares.slice(6,9));
    const leftColumn = WinSet([allSquares[0], allSquares[3], allSquares[6]]);
    const centerColumn = WinSet([allSquares[1], allSquares[4], allSquares[7]]);
    const rightColumn = WinSet([allSquares[2], allSquares[5], allSquares[8]]);
    const diagonalX = WinSet([allSquares[0], allSquares[4], allSquares[8]]);
    const diagonalY = WinSet([allSquares[2], allSquares[4], allSquares[6]]);

    const rowsAndColumns = WinSetGroup([topRow, midRow, bottomRow, leftColumn, 
        centerColumn, rightColumn]);
    const diagonals = WinSetGroup([diagonalX, diagonalY]);

    const state = {
        subArrays: [rowsAndColumns, diagonals],
        array: [topRow, midRow, bottomRow, leftColumn, 
            centerColumn, rightColumn, diagonalX, diagonalY]
    }

    return Object.assign ({}, arrayGetter(state), subArrayGetter(state), winChecker(state));
})();

const ai = (() => { 
    const state = {
        skill: 100,
        possibleMoves: gameboard.getArray(),
        symbol: 'X',
        opponentSymbol: 'O'
    }
    return Object.assign ({}, possibleMoveUpdater(state), possibleMoveGetter(state), 
        moveMaker(state), skillSetter(state))
})();

const rainbowHueGetter = state => ({
    getRainbowHue: () => state.rainbowHue
});

const rainbowShifter = state => ({
    shiftRainbow: () => {if (state.rainbowHue < 360) {
        state.rainbowHue++;
    } else {
        state.rainbowHue = 1;
    }}
});

const colorUpdater = state => ({
    updateColor: () => document.querySelector('body').style.color = 
        `hsl(${state.rainbowHue}, 100%, 80%)`
})

const colorController = (() => {
    const state = {
        rainbowHue: Math.floor(Math.random() * 360),
        body: document.querySelector('body'),
    };
    // setInterval(shiftRainbow, 250);
    // updateColor();
    return Object.assign ({}, rainbowShifter(state), colorUpdater(state));
})();

const playerNotifier = state => ({
    notifyCurrentPlayer: () => {
        console.log(`${state.currentPlayerTurn}, it is your turn!`);
    }
});

const moveSelectionApplicator = state => ({
    applyMoveSelection: (domSquareID) => {
        const selectedSquare = document.querySelector('#' + domSquareID)
        selectedSquare.innerHTML = state.currentSymbol;
        // domSquareID.setMark(state.currentSymbol);
    }
});

const gameDirector = (() => {
    const state = {
        name: 'gameDirector',
        currentPlayerTurn: 'player2',
        currentSymbol: 'O',
        player1Symbol: 'X',
        player2Symbol: 'O',
        lastCompletedProcess: null
    }
    return Object.assign ({}, nameGetter(state), domSquareClearer(state), domAssigner(state), playerNotifier(state), moveSelectionApplicator(state), winChecker(winSets.state))
})();

// gameDirector flow:
// 1) Initialize Board or increment currentPlayerTurn : gamedirector.assignSquares()
// 2) Notify Player of Turn gameDirector.notifyCurrentPlayer()
// 3) Process Player's turn selection : gamedirector.applyMoveSelection()
// 4) Check if the player has won. If they have, celebrate! : gamedirector.checkWin()
//
//
