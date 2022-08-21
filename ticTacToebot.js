// const Square = (name, row, column, position, diagonal) => {
//     let marker = null;
//     const getName = () => name;
//     const getRow = () => row;
//     const getColumn = () => column;
//     const getPosition = () => position;
//     const getDiagonal = () => diagonal;
//     const getMarker = () => marker;
//     const mark = symbol => {
//         marker = symbol;
//     };
//     return {getName, getRow, getColumn, getPosition, getDiagonal, getMarker, mark}
// }

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

const Square = name => {
    let state = {
        name,
        mark: null
    }
    return Object.assign({}, nameGetter(state), markGetter(state), markSetter(state))
};

// const topLeft = Square('topLeft');
// const topCenter = Square('topCenter');
// const topRight = Square('topRight');
// const midLeft = Square('midLeft');
// const midCenter = Square('midCenter');
// const midRight = Square('midRight');
// const bottomLeft = Square('bottomLeft');
// const bottomCenter = Square('bottomCenter');
// const bottomRight = Square('bottomRight');

const WinSet = (name, ...squares) => {
    const topRow = squares;
};

const gameboard = (() => {
    const topLeft = Square('topLeft');
    const topCenter = Square('topCenter');
    const topRight = Square('topRight');
    const midLeft = Square('midLeft');
    const midCenter = Square('midCenter');
    const midRight = Square('midRight');
    const bottomLeft = Square('bottomLeft');
    const bottomCenter = Square('bottomCenter');
    const bottomRight = Square('bottomRight');

    const array = [topLeft, topCenter, topRight, midLeft, midCenter, 
        midRight, bottomLeft, bottomCenter, bottomRight];
    // const topRow = [topLeft, topCenter, topRight];
    // const midRow = [midLeft, midCenter, midRight];
    // const bottomRow = [bottomLeft, bottomCenter, bottomRight];
    // const leftColumn = [topLeft, midLeft, bottomLeft];
    // const centerColumn = [topCenter, midCenter, bottomCenter];
    // const rightColumn = [topRight, midRight, bottomRight];
    const getArray = () => array;
    const getName = () => 'gameboard';
    return {getArray, getName};
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