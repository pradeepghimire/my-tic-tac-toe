import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-two-board',
  templateUrl: './two-board.component.html',
  styleUrls: ['./two-board.component.scss']
})
export class TwoBoardComponent implements OnInit {
  rows = [0, 1, 2];
  columns = [0, 1, 2];
  turn: number;
  notification: string = null;
  board = new Array(2);
  player1 = new Array(2);
  player2 = new Array(2);
  gameOver: boolean;
  playSolo: boolean = false;

  constructor() { }

  ngOnInit() {
    this.turn = 1;
    if (Math.random() > 0.5) {
      this.turn = 2;
    }

    this.rows.forEach(row => {
      this.board[row] = new Array(2);
      this.player1[row] = new Array(2);
      this.player2[row] = new Array(2);
    });

    this.rows.forEach(row => {
      this.columns.forEach(col => {
        this.board[row][col] = { available: true, player: null};
        this.player1[row][col] = false;
        this.player2[row][col] = false;
      });
    });
    this.gameOver = false;
  }

  notify(message, time = 10000) {
    this.notification = message;
    setTimeout(() => {this.notification = null; }, time);
  }

  onCellSelect(row, col) {
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

    if (this.turn === 1) {
      cell.player = 1;
      this.player1[row][col] = true;
      this.checkWinCondition(1);
      this.turn = 2;
    } else {
      cell.player = 2;
      this.player2[row][col] = true;
      this.checkWinCondition(2);
      this.turn = 1;
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

  countLeft() {
    let count = 0;
    this.rows.forEach(row => {
      this.columns.forEach(col => {
        if (this.board[row][col].available === true) {
          count++;
        }
      });
    });
    return count;
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
    let cplayer = null;

    if (player === 1) {
      cplayer = this.player1;
    } else {
      cplayer = this.player2;
    }

    if (this.countSelected(cplayer) < 3) {
      // game still left
      return;
    }

    // check win condition
    if (
      (cplayer[0][0] && cplayer[0][1] && cplayer[0][2]) ||
      (cplayer[1][0] && cplayer[1][1] && cplayer[1][2]) ||
      (cplayer[2][0] && cplayer[2][1] && cplayer[2][2]) ||
      (cplayer[0][0] && cplayer[1][0] && cplayer[2][0]) ||
      (cplayer[0][1] && cplayer[1][1] && cplayer[2][1]) ||
      (cplayer[0][2] && cplayer[1][2] && cplayer[2][2]) ||
      (cplayer[0][0] && cplayer[1][1] && cplayer[2][2]) ||
      (cplayer[0][2] && cplayer[1][1] && cplayer[2][0])
    ) {
      this.notify('Player-' + player + ' wins !');
      this.gameOver = true;
      return;
    }
    // check draw condition
    if ( this.countLeft() === 0 ) {
      this.notify('Game Draw !');
      this.gameOver = true;
    }

  }

  resetBoard() {
    this.notification = null;
    this.ngOnInit();
  }

  onChangeMode() {
    this.playSolo = !this.playSolo;
    this.resetBoard();
  }
}
