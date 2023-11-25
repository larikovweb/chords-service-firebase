import styled from '@emotion/styled';
import { FC, useEffect, useState } from 'react';
import {
  ButtonTransparent,
  Container,
  GeneralBox,
  GeneralLabel,
  Select,
} from '../styled/components';
import { HelmetHead } from '../components/HelmetHead';
import { $phoneWidth, $primaryColor } from '../styled/variables';
import { trackAPI } from '../services/TracksService';
import { useParams } from 'react-router-dom';
import { ITrack } from '../interfaces';
import { InputField } from '../components/fields/InputField';
import { IconArrow, IconPause } from '../icons';
import { rem } from '../styled/mixins';

const chords = ['A', 'B', 'H', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

const chordsM = ['Am', 'Bm', 'Hm', 'Cm', 'Cm#', 'Dm', 'Dm#', 'Em', 'Fm', 'Fm#', 'Gm', 'Gm#'];

const Track: FC = () => {
  const trackId = useParams<{ id: string }>().id;
  const { data: track, error, isLoading } = trackAPI.useFetchTrackQuery(trackId ? +trackId : 0);

  const loading = isLoading && <div>Идет загрузка...</div>;
  const errorMessage = error && <div>Произошла ошибка при загрузке объявлений</div>;
  const content = track && <ViewResult track={track} />;

  return (
    <>
      <HelmetHead title="Страница трека" descr="Страница трека" />
      <MyContainer>
        {loading}
        {errorMessage}
        {content}
      </MyContainer>
    </>
  );
};

const ViewResult: FC<{ track: ITrack[] }> = ({ track }) => {
  const selectedTrack = track[0];
  const [scrollSpeed, setScrollSpeed] = useState(0);
  const [isPaused, setPaused] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const activeChords = chords.includes(selectedTrack.tonality) ? chords : chordsM;

  const [transposeAmount, setTransposeAmount] = useState(
    activeChords.findIndex((chord) => chord === selectedTrack.tonality),
  );

  const handleScrollTop = () => {
    setScrollSpeed((state) => state + 1);
  };

  const handleScrollBottom = () => {
    setScrollSpeed((state) => state - 1);
  };

  const handlePause = () => {
    setPaused(!isPaused);
  };

  const transposeChords = (text: string, transposeAmount: number): JSX.Element => {
    const regex = /\{([A-Za-z0-9#]+)\}/g;

    const transposedChords = text.split(regex).map((part, index) => {
      if (index % 2 === 1) {
        const chord = part;
        const chordIndex = chords.indexOf(chord);
        const transposedIndex = (chordIndex + transposeAmount) % chords.length;
        const transposedChord = chords[transposedIndex];
        return <i key={index}>{transposedChord}</i>;
      } else {
        return part;
      }
    });

    console.log(transposedChords);

    return <>{transposedChords}</>;
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    const scrollPage = () => {
      if (scrollSpeed > 0 && !isPaused) {
        window.scrollTo({
          top: window.pageYOffset + scrollSpeed,
          behavior: 'smooth',
        });
      }
    };

    if (scrollSpeed > 0) {
      timer = setInterval(scrollPage, 50);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [scrollSpeed, isPaused]);

  return (
    <>
      <HelmetHead title={selectedTrack.title} descr={selectedTrack.title} />
      <Sidebar>
        <GeneralLabel>{selectedTrack.title}</GeneralLabel>
        <Settings>
          <InputField label="Тональность">
            <Select
              value={transposeAmount}
              onChange={(val) => setTransposeAmount(Number(val.target.value))}>
              {activeChords.map((chord, i) => (
                <Option key={chord} value={i}>
                  {chord}
                </Option>
              ))}
            </Select>
            <input
              style={{ width: '100%' }}
              type="range"
              min={0}
              max={activeChords.length - 1}
              value={transposeAmount}
              onChange={(e) => setTransposeAmount(Number(e.target.value))}
            />
          </InputField>
          <Row>
            <ButtonTransparent onClick={() => setFontSize((state) => state + 1)}>
              + шрифт
            </ButtonTransparent>
            <ButtonTransparent onClick={() => setFontSize((state) => state - 1)}>
              - шрифт
            </ButtonTransparent>
          </Row>
        </Settings>
      </Sidebar>
      <Wrapper>
        <GeneralLabel>Текст</GeneralLabel>
        {selectedTrack.blocks.map((t, i) => (
          <Block style={{ fontSize: rem(fontSize) }} key={i}>
            <Name>{t.title}</Name>
            <pre>{transposeChords(t.text, transposeAmount)}</pre>
          </Block>
        ))}
        <ArrowsWrap>
          <Arrows>
            <ScrollTop onClick={handleScrollTop}>
              <IconArrow />
            </ScrollTop>
            <SpeedCount>{scrollSpeed}</SpeedCount>
            <ScrollBottom onClick={handleScrollBottom}>
              <IconArrow />
            </ScrollBottom>
            <PauseBtn style={{ opacity: isPaused ? 0.5 : 1 }} onClick={handlePause}>
              <IconPause />
            </PauseBtn>
          </Arrows>
        </ArrowsWrap>
      </Wrapper>
    </>
  );
};

const Wrapper = styled(GeneralBox)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin: 0 auto;
  justify-content: center;
  width: 100%;
  position: relative;
`;

const Sidebar = styled(GeneralBox)`
  max-height: calc(100vh - 2rem);
  position: sticky;
  top: 1rem;
  left: 0;
  @media screen and (max-width: ${$phoneWidth}) {
    position: relative;
    margin-bottom: 1rem;
  }
`;

const MyContainer = styled(Container)`
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 1.5rem;
  @media screen and (max-width: ${$phoneWidth}) {
    grid-template-columns: 1fr;
  }
`;

const Block = styled.div`
  position: relative;
  border: 0.0625rem solid ${$primaryColor};
  padding: 1.5em 1em;
  border-radius: 0.25rem;
  pre {
    white-space: break-spaces;
    line-height: 130%;
    font-size: inherit;
  }
  i {
    color: ${$primaryColor};
    font-weight: bold;
  }
`;

const Name = styled.div`
  position: absolute;
  top: 0;
  font-size: inherit;
  left: 1rem;
  transform: translateY(-50%);
  border-radius: 0.5rem;
  width: fit-content;
  text-transform: uppercase;
  padding: 0.25rem 0.5rem;
  background: #fff;
  color: ${$primaryColor};
`;

const Settings = styled.div``;

const Row = styled.div`
  display: flex;
  > * {
    width: 100% !important;
    &:not(:last-child) {
      margin-right: 1rem;
    }
  }
`;

const Option = styled.option`
  padding: 0.5rem 0.75rem;
`;

const ArrowsWrap = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
`;

const Arrows = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: sticky;
  top: 1rem;
  right: 0;
  border-radius: 0.25rem;
  transform: translateX(50%);
  background-color: #ffff;
  padding: 0.5rem;
  box-shadow: 0 0 0.25rem rgba(0, 0, 0, 0.3);
`;

const ScrollTop = styled.div`
  cursor: pointer;
  svg {
    width: 1rem;
    height: 1rem;
    fill: ${$primaryColor};
    stroke: ${$primaryColor};
  }
`;

const PauseBtn = styled.div`
  cursor: pointer;
  svg {
    width: 1rem;
    height: 1rem;
    fill: ${$primaryColor};
    stroke: ${$primaryColor};
  }
`;

const SpeedCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: ${$primaryColor};
`;

const ScrollBottom = styled.div`
  transform: scale(1, -1);
  cursor: pointer;
  svg {
    width: 1rem;
    height: 1rem;
    fill: ${$primaryColor};
    stroke: ${$primaryColor};
  }
`;

export default Track;
