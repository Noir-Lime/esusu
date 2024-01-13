import { clone, cloneDeep } from "lodash";

export enum E_Player {
  None,
  Red,
  Yellow,
}

type New_Game_State = {
  board: E_Player[];
  winner: E_Player;
};

export class ColumnFullError extends Error {}
export class WinnerError extends Error {
  public winner: E_Player;
  constructor(winner: E_Player) {
    super();
    this.winner = winner;
  }
}

export class Connect4Logic {
  public width: number;
  public height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  public get(board: E_Player[], x: number, y: number): E_Player {
    return board[x + y * this.width];
  }

  public set(
    board: E_Player[],
    x: number,
    y: number,
    value: E_Player
  ): E_Player[] {
    const copy = cloneDeep(board);
    copy[x + y * this.width] = value;
    return copy;
  }

  /**
   * Check if a board has a winner
   */
  private has_winner(board: E_Player[], x: number, y: number) {
    const player = board[x + y * this.width];

    // If the player is none, then there is no winner
    if (player === E_Player.None) {
      return false;
    }

    /**
     * We want to cover all the directions from the current position, but it needs to be "sliding window",
     * which means that we need to check both directions from the current position.
     * We do this by starting with a direction, then checking 4 strides in that direction, then checking 4 strides in the opposite direction.
     * When we encounter a piece that is not the player, we stop checking that direction.
     * Every piece we find that is the player, we increment a counter.
     * If the counter reaches 4, then we have a winner.
     */
    const directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ];

    for (const [dx, dy] of directions) {
      let count = 1;
      for (let stride = 1; stride < 4; stride++) {
        // Get the new position from the stride and the direction
        const x2 = x + stride * dx;
        const y2 = y + stride * dy;

        // Check to make sure it's in bounds and that the piece is the player's
        if (
          x2 < 0 ||
          x2 >= this.width ||
          y2 < 0 ||
          y2 >= this.height ||
          board[x2 + y2 * this.width] !== player
        ) {
          // Break if any of the conditions are not met
          break;
        }
        count++;
      }
      for (let stride = 1; stride < 4; stride++) {
        // Get the new position from the stride and the negative of the direction
        const x2 = x - stride * dx;
        const y2 = y - stride * dy;

        // Check to make sure it's in bounds and that the piece is the player's
        if (
          x2 < 0 ||
          x2 >= this.width ||
          y2 < 0 ||
          y2 >= this.height ||
          board[x2 + y2 * this.width] !== player
        ) {
          // Break if any of the conditions are not met
          break;
        }
        count++;
      }

      // If we have 4 in a row, then we have a winner
      if (count >= 4) {
        return true;
      }
    }
    return false;
  }

  // Logic to handle inserting a piece into a column given a board and active player.
  public insert_into_column(
    board: E_Player[],
    column: number,
    value: E_Player
  ): E_Player[] {
    for (let y = this.height - 1; y >= 0; y--) {
      if (this.get(board, column, y) === E_Player.None) {
        const new_board = this.set(board, column, y, value);

        // Check if the game is over
        if (this.has_winner(new_board, column, y)) {
          throw new WinnerError(value);
        } else {
          return new_board;
        }
      }
    }
    throw new ColumnFullError();
  }
}
