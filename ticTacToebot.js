

const nameGetter = state => ({
    getName: () => state.name
});

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

const arrayGetter = state => ({
    getArray: () => state.array
})

const subArrayGetter = state => ({
    getSubArray: () => state.subArrays
})

const positionGetter = state => ({
    getPosition: () => state.position
})

const possibleMoveGetter = state => ({
    getPossibleMoves: () => state.possibleMoves
})

const Square = (name, position) => {
    const state = {
        name,
        position,
        mark: null
    }
    return Object.assign({}, nameGetter(state), 
        markGetter(state), markSetter(state), positionGetter(state))
};

const markCounter = state => ({
    countMarks: (symbol) => {
        let marks = 0;
        for (square of state.array) {
            if (square.getMark() === symbol) {
                marks += 1
            }
        };
        return marks;
    }
})

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

const winSetChecker = state => ({
    checkWinSet: (winSet) => {
        if (winSet.countMarks('X') === 3) {
            console.log("X WIN")
        } else if (winSet.countMarks('O') === 3) {
            console.log("O WIN")
        };
    }
});

const winChecker = state => ({
    checkWin: () => {for (winSet of state.array) {
        winSet.checkWinSet(winSet);
    }}
});

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

const possibleMoveUpdater = state => ({
    updatePossibleMoves: () => {
        for (square of state.possibleMoves) {
            if (square.getMark() !== null) {
                state.possibleMoves.splice(state.possibleMoves.indexOf(square), 1) 
            }
        }
    }
});

const moveMaker = state => {
    const squares = gameboard.getArray();
    const makeCrucialMove = () => {
            for (square of winSet.getArray()) {
                square.setMark(state.symbol)
            }
            winSets.checkWin();
    }
    const makeMove = () => {
        for (winSet of winSets.getArray()) {
            if (winSet.countMarks(state.symbol) === 2 &&
                winSet.countMarks(state.opponentSymbol) === 0) {
                return makeCrucialMove();
            }
        }
        for (winSet of winSets.getArray()) {
            if (winSet.countMarks(state.symbol) === 0 &&
                winSet.countMarks(state.opponentSymbol) === 2) {
                return makeCrucialMove();
            }
        }
        for (winSet of winSets.getSubArray()[0].getArray()) {
            if (winSet.countMarks(state.symbol) === 1 &&
                winSet.countMarks(state.opponentSymbol) === 0) {
                for (square of winSet.getArray()) {
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
            for (square of squares) {
                if (square.getMark() === opponentSymbol && 
                    square.getPosition() === 'corner') {
                    squares[4].setMark(state.symbol);
                    return winSets.checkWin();
                }
            }
        }
        for (square of squares) {
            if (square.getPosition() === 'corner' && 
                square.getMark() === null) {
                square.setMark(state.symbol);
                return winSets.checkWin();
            }
        }
        for (square of squares) {
            if (square.getMark === null) {
                square.setMark(state.symbol);
                return winSets.checkWin;
            }
        }
    }
    return {makeMove}
}

const ai = (() => { 
    const state = {
        possibleMoves: gameboard.getArray(),
        symbol: 'X',
        opponentSymbol: 'O'
    }
    return Object.assign ({}, possibleMoveUpdater(state), possibleMoveGetter(state), 
        moveMaker(state))
})();

// Grid: 
//  TL TC TR   X    Y   C S C
//  ML MC MR     XY     S I S
//  BL BC BR   Y    X   C S C

// UNBEATABLE AI (DRUNKEN MASTER):  
// if (any row or column contains two AI marks and zero human marks) {
//     mark the third cell in that row or column
// }
//
// if (any diagonal contains two AI marks and zero human marks) {
//     mark the third cell in that diagonal
// }
//
// if (any row or column contains two human marks and zero AI marks) {
//     mark the third cell in that row or column
// }
//
// if (any diagonal contains two human marks and zero AI marks) {
//     mark the third cell in that diagonal
// }
//
//
// if (any row or column contains one AI marked corner and zero human marks) {
//     mark the other corner in that row or column
// }
//
// if (human has 2 or more corners marked and AI has 0 corners marked) {
//     mark a random side
// } [redundant for Unbeatable Master]
//
// if (human has 1 corner marked and AI has 0 marks on the board) {
//     mark the inner square
// }
//
// if (any corners are available) {
//     mark a random corner
// }
//
// if (any sides are available) {
//     mark a random side
// } [redundant for Unbeatable Master]
//
// else {
//     mark a random square
// }

// Use counters to tally up total numbers of marks in groups. For example,
// the inner square would +1 to the middle, center, X, Y, and inner counters.
// The center left squre would +1 to the center, left, and side counters.

// Give AI a 'memory bank' of rows, columns, and diagonals (winSets) that can still be
// used for a winning play. IE it would start out as [T, M, B, L, C, R, X, Y].
// As human player marks squares, remove those winSets
// from the AI 'memory bank.'

// AI SKILL LEVELS: Random Picker, Distracted Doodler, Aloof Android (Minimax), 
//  Schoolyard Champion, Training Unit (Minimax), Drunken Master (Unbeatable), 
//  Supercomputer (Unbeatable, Minimax)
// AI RANDOM PICK PERCENTAGE: 100%; 50%; 50%; 10%; 10%; 0%; 0%