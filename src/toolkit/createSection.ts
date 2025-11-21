import { hydrateRoot } from "react-dom/client";
import type { Schema } from "./defineSectionSchema";
import React from "react";

export const createSection = (app: React.ReactNode, schema: Schema<{}>) => {
  const isClient = typeof window !== "undefined";

  if (isClient) {
    return (rootContainer: Element | string) => {
      const container =
        typeof rootContainer === "string"
          ? document.querySelector(rootContainer)
          : rootContainer;
      if (!container) {
        throw new Error(`Container not found: ${rootContainer}`);
      }
      React.startTransition(() => {
        hydrateRoot(container, app);
      });
    };
  }

  return {
    app,
    schema,
  };
};
