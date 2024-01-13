"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { GameGrid } from "./GameGrid";

import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();
  const search_params = useSearchParams();

  const raw_width = search_params.get("width");
  const raw_height = search_params.get("height");

  if (!raw_width || !raw_height) {
    router.push("/");
    return <div>invalid config</div>;
  }

  const width = parseInt(raw_width);
  const height = parseInt(raw_height);

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <GameGrid width={width} height={height} />
      </div>
    </div>
  );
}
