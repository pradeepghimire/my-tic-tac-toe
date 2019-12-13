import { Component, OnInit } from '@angular/core';
import {max} from "rxjs/operators";

@Component({
  selector: 'app-solo-board',
  templateUrl: './solo-board.component.html',
  styleUrls: ['./solo-board.component.scss']
})
export class SoloBoardComponent implements OnInit {
  rows = [0, 1, 2];
  columns = [0, 1, 2];
  botTurn = false;
  notification: string = null;
  gameOver: boolean;
  board = new Array(2);
  player = new Array(2);
  bot = new Array(2);

  constructor() { }

  ngOnInit() {
    this.botTurn = Math.random() > 0.5;

    for (let row = 0; row < 3; row++) {
      this.board[row] = new Array(2);
      this.player[row] = new Array(2);
      this.bot[row] = new Array(2);
    }

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        this.board[row][col] = { available: true, player: null};
        this.player[row][col] = false;
        this.bot[row][col] = false;
      }
    }

    if (this.botTurn) {
      this.botMove();
    }
  }

  notify(message, time = 10000) {
    this.notification = message;
    setTimeout(() => {this.notification = null; }, time);
  }

  onCellSelect(row, col) {
    //
    if (this.botTurn) {
      this.notify('Wait for computer\'s move', 500);
    }
    if (this.gameOver) {
      this.notify('Game over ! reset to play more');
      return;
    }
    if (!this.isAvailable(row, col)) {
      this.notify('Cell not Available !');
      return;
    }
    const cell = this.getCell(row, col);
    cell.available = false;
    cell.player = 2;
    this.player[row][col] = true;
    this.checkWinCondition(2);
    if (this.gameOver) {return; }
    this.botTurn = true;
    setTimeout(() => { this.botMove(); }, 1000);
  }

  getAvailableBoard(board) {
    const moves = [];
    this.rows.forEach(row => {
      this.columns.forEach(col => {
        if (board[row][col].available === true) {
          moves.push([row, col]);
        }
      });
    });
    return moves;
  }

  // evaluation function
  evaluate(board) {
    // Checking for Rows
    for ( let row = 0; row < 3; row++) {
       if (board[row][0].player === board[row][1].player && board[row][1].player === board[row][2].player) {
          if (board[row][0].player === 1) {
            return +10;
          } else {
            return  -10;
          }
       }
    }

    // Checking for Columns
    for ( let col = 0; col < 3; col++) {
       if (board[0][col].player === board[1][col].player && board[1][col].player === board[2][col].player) {
          if (board[0][col].player === 1) {
            return +10;
          } else {
            return  -10;
          }
       }
    }

    // Checking for Diagonals
    if (board[0][0].player === board[1][1].player && board[1][1].player === board[2][2].player) {
      if (board[0][0].player === 1) {
        return +10;
      } else {
        return  -10;
      }
    }
    if (board[0][2].player === board[1][1].player && board[1][1].player === board[2][0].player) {
      if (board[0][2].player === 1) {
        return +10;
      } else {
        return  -10;
      }
    }

    // Else if none of them have won then return 0
    return 0;
  }

  minMax(board, depth, isMaximizingPlayer) {
    const score = this.evaluate(board);
    // If Maximizer has won the game return its evaluated score
    if (score === 10) {
      return score;
    }
    // If Minimizer has won the game return its evaluated score
    if (score === -10) {
      return score;
    }

    // If there are no more moves and no winner then it is a draw
    if (!this.isMovesLeft(board)) {
       return 0;
    }

    // if not continue

    // if maximizer's turn
    if (isMaximizingPlayer) {
      let best = -1000;
      // Traverse all cells
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          // if cell is empty
          if (board[row][col].available !== true) {
            // Make the move
            board[row][col].available = false;
            board[row][col].player = 1;

            // Call miniMax recursively and choose the maximum value
            best = Math.max(best, this.minMax(board, depth + 1, !isMaximizingPlayer));

            // Undo the move
            board[row][col].available = true;
            board[row][col].player = null;
          }
        }
      }
      return best;

    } else {
      let best = 1000;
      // Traverse all cells
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          // if cell is empty
          if (board[row][col].available !== true) {
            // Make the move
            board[row][col].available = false;
            board[row][col].player = 2;

            // Call miniMax recursively and choose the maximum value
            best = Math.min(this.minMax(board, depth + 1, isMaximizingPlayer));

            // Undo the move
            board[row][col].available = true;
            board[row][col].player = null;
          }
        }
      }
      return best;
    }
  }

  findBestMove(board) {
    let bestVal = -1000;
    const bestMove = {row: -1, col: -1};

    // Traverse all cells, evaluate miniMax function for all empty cells. And return the cell with optimal value.
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (board[row][col].available) {
          // Make the move
          board[row][col].available = false;
          board[row][col].player = 1;
          // compute evaluation function for this move.
          const moveValue = this.minMax(board, 0, false);
          // undo the move
          board[row][col].available = true;
          board[row][col].player = null;

          // If the value of the current move is more than the best value, then update best
          if (moveValue > bestVal) {
            bestMove.row = row;
            bestMove.col = col;
            bestVal = moveValue;
          }
        }
      }
    }
    return bestMove;
  }

  botMove() {
    // find best move by applying Min-Max algorithm
    const bestMove = this.findBestMove(this.board);
    this.bot[bestMove.row][bestMove.col] = true;
    this.board[bestMove.row][bestMove.col].available = false;
    this.board[bestMove.row][bestMove.col].player = 1;

    this.checkWinCondition(1);
    this.botTurn = false;
  }

  isMovesLeft(board) {
    let count = 0;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (board[row][col].available === true) {
          count++;
        }
      }
    }
    return count !== 0;
  }

  countSelected(playerCells) {
    let count = 0;
    this.rows.forEach(row => {
      this.columns.forEach(col => {
        if (playerCells[row][col] === true) {
          count++;
        }
      });
    });
    return count;
  }

  checkWinCondition(player: number) {
    let currentPlayer = null;
    let msg = null;
    if (this.botTurn) {
      msg = 'Computer won !';
      currentPlayer = this.bot;
    } else {
      msg = 'You won !';
      currentPlayer = this.player;
    }

    if (this.countSelected(currentPlayer) < 3) {
      // game still left
      return;
    }

    // check win condition
    if (
      (currentPlayer[0][0] && currentPlayer[0][1] && currentPlayer[0][2]) ||
      (currentPlayer[1][0] && currentPlayer[1][1] && currentPlayer[1][2]) ||
      (currentPlayer[2][0] && currentPlayer[2][1] && currentPlayer[2][2]) ||
      (currentPlayer[0][0] && currentPlayer[1][0] && currentPlayer[2][0]) ||
      (currentPlayer[0][1] && currentPlayer[1][1] && currentPlayer[2][1]) ||
      (currentPlayer[0][2] && currentPlayer[1][2] && currentPlayer[2][2]) ||
      (currentPlayer[0][0] && currentPlayer[1][1] && currentPlayer[2][2]) ||
      (currentPlayer[0][2] && currentPlayer[1][1] && currentPlayer[2][0])
    ) {
      this.notify(msg);
      this.gameOver = true;
      return;
    }
    // check draw condition
    if ( this.isMovesLeft(this.board)) {
      this.notify('Game Draw !');
      this.gameOver = true;
    }

  }

  getCell(row, col) {
    return this.board[row][col];
  }

  isAvailable(row, col) {
    return this.board[row][col].available;
  }

  getText(row, col) {
    const cell = this.getCell(row, col);
    if (cell.available === true) {
      return '';
    }
    if ( cell.player === 1) {
      return 'X';
    } else {
      return 'O';
    }
  }

  resetBoard() {
    this.notification = null;
    this.gameOver = false;
    this.ngOnInit();
  }
}
