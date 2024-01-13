import React from "react";
import { Alert, Button, Grid, Paper, Typography } from "@mui/material";
import styles from "./page.module.css";
import {
  ColumnFullError,
  Connect4Logic,
  E_Player,
  WinnerError,
} from "./GameState";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { useRouter } from "next/navigation";

interface I_GameGridElement_Props {
  x: number;
  y: number;
  width: number;
  player_state: E_Player;
  onClick: (x: number) => void;
}

// Grid Element to act as the game board piece.
const GameGridElement = React.memo<I_GameGridElement_Props>(
  function GameGridElement({ x, y, width, player_state, onClick }) {
    const color_class = React.useMemo(() => {
      switch (player_state) {
        case E_Player.None:
          return "";
        case E_Player.Red:
          return styles.player_red;
        case E_Player.Yellow:
          return styles.player_yellow;
      }
    }, [player_state]);

    return (
      <Grid item xs={12 / width} className={styles.grid_element}>
        <Paper
          className={[color_class, styles.grid_element_paper].join(" ")}
          onClick={() => {
            onClick(x);
          }}
        />
      </Grid>
    );
  }
);

interface I_GameGrid_Props {
  width: number;
  height: number;
}

// Game grid to handle all the rendering and logic of the game.
export const GameGrid: React.FC<I_GameGrid_Props> = ({ height, width }) => {
  const router = useRouter();
  const [current_player, setCurrentPlayer] = React.useState<E_Player>(
    E_Player.Red
  );

  const [game_state, setGameState] = React.useState<E_Player[]>(
    new Array<E_Player>(height * width).fill(E_Player.None)
  );

  const connect_4_logic = React.useMemo(
    () => new Connect4Logic(width, height),
    [height, width]
  );

  const handleColumnClick = React.useCallback(
    (x: number) => {
      try {
        var board = connect_4_logic.insert_into_column(
          game_state,
          x,
          current_player
        );
      } catch (err) {
        if (err instanceof ColumnFullError) {
          alert("Column is full!");
          return;
        } else if (err instanceof WinnerError) {
          alert(
            `Player ${err.winner === E_Player.Red ? "Red" : "Yellow"} won!`
          );
          return;
        }
        throw err;
      }

      setGameState(board);
      setCurrentPlayer((current_player) =>
        current_player === E_Player.Red ? E_Player.Yellow : E_Player.Red
      );
    },
    [connect_4_logic, current_player, game_state]
  );

  const grid_component = React.useMemo(() => {
    const list = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const player_state = connect_4_logic.get(game_state, x, y);

        list.push(
          <GameGridElement
            key={`${x}-${y}-${player_state}`}
            x={x}
            y={y}
            width={width}
            player_state={player_state}
            onClick={handleColumnClick}
          />
        );
      }
    }
    return list;
  }, [connect_4_logic, game_state, handleColumnClick, height, width]);

  const current_player_severity = React.useMemo(() => {
    switch (current_player) {
      case E_Player.None:
        return "info";
      case E_Player.Red:
        return "error";
      case E_Player.Yellow:
        return "warning";
    }
  }, [current_player]);

  return (
    <>
      {/* Header */}
      <div className={styles.header}>
        <Typography variant="h3" className={styles.header_text}>
          Connect 4 - {height}x{width}
        </Typography>
        <div className={styles.button_bar}>
          <Button
            variant="contained"
            startIcon={<ArrowBackIosIcon />}
            onClick={() => {
              router.push("/");
            }}
          >
            Back to home
          </Button>
          <div className={styles.game_buttons}>
            <Button
              variant="outlined"
              startIcon={<SwapHorizIcon />}
              onClick={() => {
                setCurrentPlayer((current_player) =>
                  current_player === E_Player.Red
                    ? E_Player.Yellow
                    : E_Player.Red
                );
              }}
            >
              Swap Players
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setGameState(
                  new Array<E_Player>(height * width).fill(E_Player.None)
                );
                setCurrentPlayer(E_Player.Red);
              }}
              startIcon={<RestartAltIcon />}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Game Board */}
      <Grid container spacing={2}>
        {grid_component}
      </Grid>

      {/* Footers with info */}
      <Alert severity={current_player_severity}>
        Current player: {current_player === E_Player.Red ? "Red" : "Yellow"}
      </Alert>

      <Alert severity="info">Click on a column to insert a token.</Alert>
    </>
  );
};
