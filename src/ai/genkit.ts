'use server';

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Initialize the Genkit AI singleton
export const ai = genkit({
  plugins: [
    googleAI(),
  ],
  // Log errors to the console.
  logLevel: 'error',
});
