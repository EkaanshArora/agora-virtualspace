import type { CSSProperties } from "react";

export const styles = {
  videoHolder: {
    position: "absolute",
    height: 120,
    right: 0,
    width: "100vw",
    zIndex: 10,
    bottom: 0,
    display: "flex",
    justifyContent: "center",
  } as CSSProperties,
  parent: { width: "100vw", height: "100vh" } as CSSProperties,
  videoTile: { height: "100%", width: 240 } as CSSProperties,
  videoTileMuted: { height: "100%", width: 240,backgroundColor: "#ff00ff", alignItems: "center" } as CSSProperties
};
