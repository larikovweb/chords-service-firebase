import styled from '@emotion/styled';
import { FC, useState } from 'react';
import {
  ButtonTransparent,
  Container,
  GeneralBox,
  GeneralLabel,
  Input,
} from '../styled/components';
import { FormTrack } from '../components/FormTrack';
import { TrackRow } from '../components/TrackRow';
import { IconDelete, IconEdit } from '../icons';
import { $phoneWidth, $redColor } from '../styled/variables';
import { ITrack } from '../interfaces';
import { deleteData, getData } from '../services/firebaseService';
import useFetchData from '../hooks/useFetchData';
import { transformObjectToArray } from '../helpers/fn';

const Admin: FC = () => {
  const [editableTrack, setEditableTrack] = useState<ITrack>();
  const [search, setSearch] = useState('');
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const {
    data: tracks,
    error,
    loading: isLoading,
    refetch,
  } = useFetchData<{ [key: string]: ITrack }>(getData, 'tracks');

  const deleteTrack = async (trackId: string) => {
    const response = await deleteData(`tracks/${trackId}`);
    if (response.error) {
      console.error(response.error);
      return;
    }
    refetch();
  };

  const filteredTracks = transformObjectToArray(tracks).filter(
    (track) =>
      track.title.toLowerCase().includes(search.toLowerCase()) ||
      track.artist.toLowerCase().includes(search.toLowerCase()),
  );

  const loading = isLoading && <div>Идет загрузка...</div>;
  const errorMessage = error && <div>Произошла ошибка при загрузке объявлений</div>;
  const content =
    tracks &&
    filteredTracks.map((track, i) => (
      <TrackRow key={i} track={track}>
        <DeleteBtn
          onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            if (window.confirm('Вы уверены, что хотите удалить трек?')) {
              deleteTrack(track.id);
              refetch();
            }
          }}>
          <IconDelete />
        </DeleteBtn>
        <EditBtn
          onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            setEditableTrack(track);
          }}>
          <IconEdit />
        </EditBtn>
      </TrackRow>
    ));

  return (
    <Wrapper>
      <FormTrack
        refetch={refetch}
        setEditableTrack={setEditableTrack}
        editableTrack={editableTrack}
      />
      <List>
        <GeneralBox>
          <GeneralLabel>Созданные треки</GeneralLabel>
          <Input placeholder="Поиск" value={search} onChange={handleSearchChange} />

          <Scroll>
            {loading}
            {errorMessage}
            {content}
          </Scroll>
        </GeneralBox>
      </List>
    </Wrapper>
  );
};

const Wrapper = styled(Container)`
  position: relative;
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr 1fr;
  @media screen and (max-width: ${$phoneWidth}) {
    grid-template-columns: 1fr;
  }
`;

const Scroll = styled.div`
  max-height: calc(100vh - 14rem);
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

const List = styled.div`
  > * {
    position: sticky;
    top: 1rem;
    height: fit-content;
  }
`;

const DeleteBtn = styled(ButtonTransparent)`
  color: ${$redColor};
  padding: 0.5rem;
  margin-right: 0.5rem;
  border: none;
  svg {
    fill: ${$redColor};
    stroke: ${$redColor};
  }
`;

const EditBtn = styled(ButtonTransparent)`
  padding: 0.5rem;
  border: none;
`;

export default Admin;
