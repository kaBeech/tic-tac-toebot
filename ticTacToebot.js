

// Grid:
//  TL TC TR
//  ML MC MR
//  BL BC BR

// UNBEATABLE AI:  
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
// if (there exists a corner that shares a row or column with one other AI mark and zero human marks) {
//     mark that corner
// }
//
// if (human has 2 or more corners marked and AI has 0 corners marked) {
//     mark a random side
// }
//
// if (human has 1 corner marked and AI has 0 marks on the board) {
//     mark the center
// }
//
// if (any corners are available) {
//     mark a random corner
// }
//
// if (any sides are available) {
//     mark a random side
// }
//
// else {
//     mark a random square
// }