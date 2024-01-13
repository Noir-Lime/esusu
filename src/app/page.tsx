"use client";

import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import styles from "./page.module.css";
import React from "react";
import { useRouter } from "next/navigation";

/**
 * The Home page. Allows the user to configure the game.
 */
export default function Home() {
  const [width, setWidth] = React.useState(7);
  const [height, setHeight] = React.useState(6);

  const router = useRouter();

  return (
    <main className={styles.root}>
      <div className={styles.content}>
        <Typography>Connect 4 Configruation</Typography>
        <div className={styles.form}>
          <FormControl>
            <FormLabel>Width</FormLabel>
            <RadioGroup
              value={width}
              onChange={(e) => {
                setWidth(parseInt(e.target.value));
              }}
            >
              <FormControlLabel value={5} control={<Radio />} label="5" />
              <FormControlLabel value={6} control={<Radio />} label="6" />
              <FormControlLabel value={7} control={<Radio />} label="7" />
              <FormControlLabel value={8} control={<Radio />} label="8" />
              <FormControlLabel value={9} control={<Radio />} label="9" />
            </RadioGroup>
          </FormControl>
          <FormControl>
            <FormLabel>Height</FormLabel>
            <RadioGroup
              value={height}
              onChange={(e) => {
                setHeight(parseInt(e.target.value));
              }}
            >
              <FormControlLabel value={4} control={<Radio />} label="4" />
              <FormControlLabel value={5} control={<Radio />} label="5" />
              <FormControlLabel value={6} control={<Radio />} label="6" />
              <FormControlLabel value={7} control={<Radio />} label="7" />
              <FormControlLabel value={8} control={<Radio />} label="8" />
            </RadioGroup>
          </FormControl>
        </div>

        <Button
          variant="contained"
          onClick={() => {
            const search_params = new URLSearchParams();
            search_params.set("width", width.toString());
            search_params.set("height", height.toString());

            router.push(`/game?${search_params.toString()}`);
          }}
        >
          Start
        </Button>
      </div>
    </main>
  );
}
