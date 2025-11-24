import { hydrateRoot } from 'react-dom/client';
import type { Schema } from './defineSectionSchema';
import React from 'react';

export const createSection = (app: React.ReactNode, schema: Schema<{}>) => {
  const isClient = typeof window !== 'undefined';

  if (isClient) {
    const search = new URL(import.meta.url).search;
    const sectionId = new URLSearchParams(search).get('id');
    if (!sectionId) {
      throw new Error('Section ID not found');
    }
    const container = document.getElementById(sectionId);

    if (!container) {
      throw new Error(`Container not found: ${sectionId}`);
    }
    React.startTransition(() => {
      hydrateRoot(container, app);
    });
  }

  return {
    app,
    schema,
  };
};
