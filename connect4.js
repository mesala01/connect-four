/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;


let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  for(let row= 0; row < HEIGHT; row ++){
    const arr = new Array(WIDTH).fill(0);
    board.push(arr);
  }
}

/** makeHtmlBoard: make HTML table and row of column dropRows. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  //getting the table element that will be the board from HTML
  const htmlBoard = document.querySelector('#board');

  // TODO: add comment for this code
  //creating the first row for the board. 
  const dropRow = document.createElement("tr");
  dropRow.setAttribute("id", "column-dropRow");
  dropRow.addEventListener("click", handleClick);

  // creating the top clickable cells from which the players can drop their pieces.
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    // adding the top cells to first row
    dropRow.append(headCell);
  }

  htmlBoard.append(dropRow);    // adding the first row to the board.


  // TODO: add comment for this code
  // creating HEIGHT number of rows
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
      /* creating WIDTH number of cells for each row */
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      /*creating an empty div container to contain the piece dropped by the players.
      This div will is the round shape in each cell on the board. */
      const hole = document.createElement('div');
      hole.classList.add('hole');
      hole.setAttribute("id", `${y}-${x}`);
      /*adding the roumd div to the each cell */
      cell.append(hole);
      row.append(cell);
    }
    /* addind each row to the board. */
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return dropRow empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  for(let row= HEIGHT-1; row >-1; row--){
    if(!board[row][x]){
      return row;
    }   
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const piece = document.createElement('div');
  piece.classList.add('piece');
  piece.classList.add(`p${currPlayer}`);
  //piece.style.dropRow = -50 * (y + 2);

  const spot = document.getElementById(`${y}-${x}`);
  spot.append(piece);

}

/** endGame: announce game end */
function endGame(msg) {
  // TODO: pop up alert message
  let message = document.querySelector("#msg");
  const popup = document.querySelector("#popup");
  message.innerText = msg;
  popup.style.display ="block";
}

/** handleClick: handle click of column dropRow to play piece */

function handleClick(evt) {
  /* get x from ID of clicked cell */
  let x = +evt.target.id;

  /* get next spot in column (if none, ignore click) */
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  board[y][x]= currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if (board.every(row => row.every(cell => cell>=1))) {
    endGame(`It's a tie! Please try again!`);
  }


  // switch players
  // TODO: switch currPlayer 1 <-> 2
  if(currPlayer === 1){
    currPlayer = 2;
  }
  else{
    currPlayer = 1
  }


}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.
  
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      /* for every row and every colum on the board, create an array of every 4 consecutive cells 
      */
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
      /* check if there is a win horizontally, vertically or diagonally */
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true; 
      }
    }
  }
}

/* closes the endGame popup and clear the board by reloading the page. */
const close_btn = document.querySelector("#close-popup");
close_btn.addEventListener("click", function(){
  const popup = document.querySelector("#popup");
  popup.style.display ="none";
  window.location.reload();
})

/* creates a new 2D array and  the virtual board  on load. */
makeBoard();
makeHtmlBoard();
