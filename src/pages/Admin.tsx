import styled from '@emotion/styled';
import { FC, useState } from 'react';
import { ButtonTransparent, Container, GeneralBox, GeneralLabel } from '../styled/components';
import { FormTrack } from '../components/FormTrack';
import { trackAPI } from '../services/TracksService';
import { TrackRow } from '../components/TrackRow';
import { IconDelete, IconEdit } from '../icons';
import { $phoneWidth, $redColor } from '../styled/variables';
import { ITrack } from '../interfaces';

const Admin: FC = () => {
  const [editableTrack, setEditableTrack] = useState<ITrack>();

  const { data: tracks, error, isLoading, refetch } = trackAPI.useFetchAllTracksQuery(1000);
  const [deleteTrack] = trackAPI.useDeleteTrackMutation();

  const loading = isLoading && <div>Идет загрузка...</div>;
  const errorMessage = error && <div>Произошла ошибка при загрузке объявлений</div>;
  const content =
    tracks &&
    tracks.map((track) => (
      <TrackRow key={track.id} track={track}>
        <DeleteBtn
          onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            if (window.confirm('Вы уверены, что хотите удалить трек?')) {
              deleteTrack(track);
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
      <FormTrack setEditableTrack={setEditableTrack} editableTrack={editableTrack} />
      <List>
        <GeneralBox>
          <GeneralLabel>Созданные треки</GeneralLabel>
          {loading}
          {errorMessage}
          {content}
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

const List = styled.div`
  > * {
    position: sticky;
    top: 1rem;
    height: fit-content;
    max-height: calc(100vh - 2rem);
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
      display: none;
      opacity: 0;
    }
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
