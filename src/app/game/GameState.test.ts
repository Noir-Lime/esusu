import { describe, expect, it } from "vitest";
import { Connect4Logic, E_Player, WinnerError } from "./GameState";

describe("Game State Test", () => {
  const width = 7;
  const height = 6;

  it("should construct properly", () => {
    const game_state = new Connect4Logic(width, height);

    expect(game_state.width).toBe(width);
    expect(game_state.height).toBe(height);
  });

  it("should get properly", () => {
    const board = new Array(width * height).fill(E_Player.None);
    const board_2 = new Array(width * height).fill(E_Player.Red);
    const board_3 = new Array(width * height).fill(E_Player.Yellow);

    const game_state = new Connect4Logic(width, height);

    expect(game_state.get(board, 0, 0)).toBe(E_Player.None);
    expect(game_state.get(board_2, 0, 0)).toBe(E_Player.Red);
    expect(game_state.get(board_3, 0, 0)).toBe(E_Player.Yellow);
  });

  it("should set properly", () => {
    let board = new Array(width * height).fill(E_Player.None);

    const game_state = new Connect4Logic(width, height);

    board = game_state.set(board, 1, 1, E_Player.Red);
    board = game_state.set(board, 1, 2, E_Player.Red);
    board = game_state.set(board, 1, 3, E_Player.Red);
    board = game_state.set(board, 2, 2, E_Player.Yellow);
    board = game_state.set(board, 2, 3, E_Player.Yellow);
    board = game_state.set(board, 2, 4, E_Player.Yellow);
    board = game_state.set(board, 1, 3, E_Player.Yellow);

    let red_count = 0;
    let yellow_count = 0;

    for (const piece of board) {
      if (piece === E_Player.Red) {
        red_count++;
      } else if (piece === E_Player.Yellow) {
        yellow_count++;
      }
    }

    expect(red_count).toBe(2);
    expect(yellow_count).toBe(4);
  });

  it("should detect a proper winner", () => {
    let board_winner = new Array(width * height).fill(E_Player.None);
    const game_state = new Connect4Logic(width, height);

    const winningMove = (
      ...args: Parameters<typeof game_state.insert_into_column>
    ) => {
      game_state.insert_into_column(...args);
    };

    board_winner = game_state.insert_into_column(board_winner, 0, E_Player.Red);
    board_winner = game_state.insert_into_column(board_winner, 1, E_Player.Red);
    board_winner = game_state.insert_into_column(board_winner, 2, E_Player.Red);
    expect(() => winningMove(board_winner, 3, E_Player.Red)).toThrowError(
      WinnerError
    );

    let board_no_winner = new Array(width * height).fill(E_Player.None);

    board_no_winner = game_state.insert_into_column(
      board_no_winner,
      0,
      E_Player.Red
    );
    board_no_winner = game_state.insert_into_column(
      board_no_winner,
      1,
      E_Player.Yellow
    );
    board_no_winner = game_state.insert_into_column(
      board_no_winner,
      2,
      E_Player.Red
    );
    expect(() =>
      winningMove(board_no_winner, 3, E_Player.Red)
    ).not.toThrowError(WinnerError);

    let board_diagonal_winner: E_Player[] = new Array(width * height).fill(
      E_Player.None
    );

    board_diagonal_winner = game_state.insert_into_column(
      board_diagonal_winner,
      0,
      E_Player.Red
    );
    board_diagonal_winner = game_state.insert_into_column(
      board_diagonal_winner,
      1,
      E_Player.Yellow
    );
    board_diagonal_winner = game_state.insert_into_column(
      board_diagonal_winner,
      1,
      E_Player.Red
    );
    board_diagonal_winner = game_state.insert_into_column(
      board_diagonal_winner,
      2,
      E_Player.Yellow
    );
    board_diagonal_winner = game_state.insert_into_column(
      board_diagonal_winner,
      2,
      E_Player.Yellow
    );
    board_diagonal_winner = game_state.insert_into_column(
      board_diagonal_winner,
      2,
      E_Player.Red
    );
    board_diagonal_winner = game_state.insert_into_column(
      board_diagonal_winner,
      3,
      E_Player.Yellow
    );
    board_diagonal_winner = game_state.insert_into_column(
      board_diagonal_winner,
      3,
      E_Player.Yellow
    );
    board_diagonal_winner = game_state.insert_into_column(
      board_diagonal_winner,
      3,
      E_Player.Yellow
    );

    expect(() =>
      winningMove(board_diagonal_winner, 3, E_Player.Yellow)
    ).toThrowError(WinnerError);
  });
});
