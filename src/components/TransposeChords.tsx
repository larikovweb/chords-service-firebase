// TransposeChords.tsx
import React from 'react';

const baseChords = ['A', 'B', 'H', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
const minor = 'm';
const adjustments: { [key: string]: string } = {
  'Cm#': 'C#m',
  'Dm#': 'D#m',
  'Fm#': 'F#m',
  'Gm#': 'G#m',
};

const transposeChord = (chord: string, semitoneShift: number): string => {
  const isMinor = chord.endsWith(minor);
  const rootChord = isMinor ? chord.slice(0, -1) : chord;

  const index = baseChords.indexOf(rootChord);
  if (index === -1) {
    throw new Error(`Invalid chord: ${chord}`);
  }

  const newIndex = (index + semitoneShift + baseChords.length) % baseChords.length;
  let newChord = baseChords[newIndex];

  if (isMinor) {
    newChord += minor;
  }

  // После транспонирования необходимо проверить, не нужно ли поменять порядок 'm#' на '#m'
  for (const adjustment in adjustments) {
    if (newChord === adjustments[adjustment]) {
      newChord = adjustment;
      break;
    }
  }

  return newChord;
};

const TransposeChords: React.FC<{ text: string; transposeAmount: number }> = ({
  text,
  transposeAmount,
}) => {
  const regex = /\{([A-Za-z0-9#]+)\}/g;

  const transposedText = text.split(regex).map((part, index) => {
    if (index % 2 === 1) {
      // Adjust the chord if necessary
      const adjustedChord = adjustments[part] || part;
      try {
        const transposedChord = transposeChord(adjustedChord, transposeAmount);
        return <i key={index}>{transposedChord}</i>;
      } catch (error) {
        console.error(error);
        return <i key={index}>{part}</i>; // Return original part if there is an error
      }
    } else {
      return part;
    }
  });

  return <pre>{transposedText}</pre>;
};

export default TransposeChords;
