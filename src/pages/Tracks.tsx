import styled from '@emotion/styled';
import { FC, useState } from 'react';
import { Container, GeneralBox, GeneralLabel, Input } from '../styled/components';
import { HelmetHead } from '../components/HelmetHead';
import useFetchData from '../hooks/useFetchData';
import { getData } from '../services/firebaseService';
import { IGroup, ITrack } from '../interfaces';
import { TrackRow } from '../components/TrackRow';
import { transformObjectToArray } from '../helpers/fn';
import { Groups } from '../components/Groups';
import { $phoneWidth } from '../styled/variables';

const Tracks: FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<IGroup | null>(null);
  const [search, setSearch] = useState('');
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const {
    data,
    error,
    loading: isLoading,
  } = useFetchData<{ [key: string]: ITrack }>(getData, 'tracks');

  const handleGroupClick = (group: IGroup) => {
    setSelectedGroup((currentGroup) => (currentGroup?.id === group.id ? null : group));
  };

  const filteredTracks = transformObjectToArray(data).filter(
    (track) =>
      track.title.toLowerCase().includes(search.toLowerCase()) ||
      track.artist.toLowerCase().includes(search.toLowerCase()),
  );

  const loading = isLoading && <div>Идет загрузка...</div>;
  const errorMessage = error && <div>Произошла ошибка при загрузке объявлений</div>;
  const content = data && (
    <>
      {filteredTracks
        .filter((track) => (selectedGroup ? selectedGroup.tracks.includes(track.id) : true))
        .map((track) => (
          <TrackRow key={track.id} track={track} />
        ))}
    </>
  );

  return (
    <>
      <HelmetHead title="Заголовок Главной" descr="Описание Главной" />
      <Wrapper>
        <Groups onGroupClick={handleGroupClick} selectedGroupId={selectedGroup?.id} />
        <GeneralBox>
          <GeneralLabel>Треки</GeneralLabel>
          <Input placeholder="Поиск" value={search} onChange={handleSearchChange} />
          <Scroll>
            {loading}
            {errorMessage}
            {content}
          </Scroll>
        </GeneralBox>
      </Wrapper>
    </>
  );
};

const Wrapper = styled(Container)`
  display: grid;
  grid-template-columns: 25rem 1fr;
  gap: 1.5rem;
  min-height: 80vh;
  @media screen and (max-width: ${$phoneWidth}) {
    grid-template-columns: 1fr;
  }
`;

const Scroll = styled.div`
  max-height: calc(100vh - 10.5rem);
  overflow-y: auto;
  overflow-x: none;
  -webkit-overflow-scrolling: touch;
  scrollbar-color: rgba(25, 25, 28, 0.2) rgba(25, 25, 28, 0.15); /* «цвет ползунка» «цвет полосы скроллбара» */
  scrollbar-width: thin;
  padding: 0.5rem;
  margin-top: 1rem;
  &::-webkit-scrollbar {
    width: 0.35rem;
    height: 0.35rem;
    background-color: rgba(25, 25, 28, 0.15);
    border-radius: 0.25rem;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(25, 25, 28, 0.2);
    border-radius: 0.25rem;
    transition: background-color 0.3s;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(25, 25, 28, 0.3);
  }

  /* Стрелки */
  &::-webkit-scrollbar-button:vertical:start:decrement {
    background: transparent;
  }

  &::-webkit-scrollbar-button:vertical:end:increment {
    background: transparent;
  }

  &::-webkit-scrollbar-button:horizontal:start:decrement {
    background: transparent;
  }

  &::-webkit-scrollbar-button:horizontal:end:increment {
    background: transparent;
  }
`;

export default Tracks;
