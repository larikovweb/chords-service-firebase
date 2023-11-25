import { FC } from 'react';

type Props = {
  text: string;
  transposeAmount: number;
  chords: string[];
};

export const TransposeChords: FC<Props> = ({ text, transposeAmount, chords }) => {
  const transposeChords = (text: string, transposeAmount: number): JSX.Element => {
    const regex = /\{([A-Za-z0-9#]+)\}/g;
    console.log(text);
    const transposedChords = text.split(regex).map((part, index) => {
      if (index % 2 === 1) {
        const chord = part;
        const isMinorChord = chord.endsWith('m');
        const chordWithoutSuffix = isMinorChord ? chord.slice(0, -1) : chord;
        const chordIndex = chords.indexOf(chordWithoutSuffix);
        const transposedIndex = (chordIndex + transposeAmount) % chords.length;
        const transposedChord = chords[transposedIndex][0] + (isMinorChord ? 'm' : '');
        return (
          <i key={index}>
            {transposedChord}
            {chords[transposedIndex][1] ?? ''}
          </i>
        );
      } else {
        return part;
      }
    });

    return <>{transposedChords}</>;
  };

  return <pre>{transposeChords(text, transposeAmount)}</pre>;
};
