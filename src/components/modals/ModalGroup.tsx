import { FC, useEffect, useState } from 'react';
import { InputField } from '../fields/InputField';
import { Button, GeneralBox, Input } from '../../styled/components';
import styled from '@emotion/styled';
import { IGroup, ITrack } from '../../interfaces';
import { getData, setData, updateData } from '../../services/firebaseService';
import useFetchData from '../../hooks/useFetchData';
import { transformObjectToArray } from '../../helpers/fn';
import { Controller, useForm } from 'react-hook-form';
import { $phoneWidth, $primaryColor } from '../../styled/variables';

export const ModalGroup: FC<{ isEdit?: boolean; group?: IGroup; refetchGroups: () => void }> = ({
  refetchGroups,
  isEdit,
  group,
}) => {
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const {
    data,
    error,
    loading: isLoading,
  } = useFetchData<{ [key: string]: ITrack }>(getData, 'tracks');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<IGroup>({
    defaultValues: {
      name: isEdit ? group?.name : '',
      tracks: isEdit ? group?.tracks : [],
    },
  });

  const onSubmit = async (data: IGroup) => {
    if (isEdit) {
      await updateData(`groups/${group?.id}`, data); // Обновляем группу если isEdit true
    } else {
      await setData('groups', data); // Создаем новую группу если isEdit false
    }
    refetchGroups();
    reset();
    setSelectedTracks([]);
  };

  const handleTrackClick = (id: string) => {
    setSelectedTracks((prev) => {
      if (prev.includes(id)) {
        return prev.filter((trackId) => trackId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  useEffect(() => {
    setValue('tracks', selectedTracks);
  }, [selectedTracks, setValue]);

  useEffect(() => {
    if (isEdit) {
      setSelectedTracks(group?.tracks || []); // Устанавливаем начальное значение selectedTracks для редактирования группы
    }
  }, [isEdit, group]);

  const filteredTracks = transformObjectToArray(data).filter(
    (track) =>
      track.title.toLowerCase().includes(search.toLowerCase()) ||
      track.artist.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) {
    return <div>Идет загрузка...</div>;
  }

  if (error) {
    return <div>Произошла ошибка при загрузке треков</div>;
  }

  return (
    <>
      <Wrapper>
        <Title>{isEdit ? 'Редактировать группу' : 'Новая группа'}</Title>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <InputField error={errors.name?.message} label="Название">
            <Input
              {...register('name', { required: 'Поле обязательно для заполнения' })}
              placeholder="Название"
            />
          </InputField>
          <TracksWrapper>
            <b>Выберите треки</b>
            <Input placeholder="Поиск" value={search} onChange={handleSearchChange} />
            <Controller
              name="tracks"
              control={control}
              rules={{
                validate: (value) => value.length > 0 || 'Необходимо выбрать хотя бы один трек',
              }}
              render={({ field }) => (
                <InputField error={errors.tracks?.message}>
                  <Tracks>
                    {filteredTracks.map((track) => (
                      <TrackCrad
                        key={track.id}
                        track={track}
                        onClick={() => {
                          handleTrackClick(track.id);
                          field.onChange(selectedTracks);
                        }}
                        selected={selectedTracks.includes(track.id)}
                      />
                    ))}
                  </Tracks>
                </InputField>
              )}
            />
          </TracksWrapper>
          <Button>Сохранить</Button>
        </Form>
      </Wrapper>
    </>
  );
};

const TrackCrad: FC<{ track: ITrack; onClick: () => void; selected: boolean }> = ({
  track,
  onClick,
  selected,
}) => {
  return (
    <TrackItem $selected={selected} onClick={onClick}>
      <Check $selected={selected}>
        <i />
      </Check>
      <Info>
        <b>{track.title}</b>
        <span>{track.artist}</span>
      </Info>
    </TrackItem>
  );
};

const Wrapper = styled.div`
  width: 30rem;
  @media screen and (max-width: ${$phoneWidth}) {
    width: 100%;
  }
`;

const Title = styled.h3`
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: grid;
  width: 100%;
  button {
    width: 100%;
  }
`;

const TracksWrapper = styled(GeneralBox)`
  display: grid;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  > b {
    font-weight: 500;
    font-size: 1rem;
  }
`;

const Tracks = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  overflow-y: auto;
  max-height: 20rem;
  overflow-x: none;
  -webkit-overflow-scrolling: touch;
  scrollbar-color: rgba(25, 25, 28, 0.2) rgba(25, 25, 28, 0.15); /* «цвет ползунка» «цвет полосы скроллбара» */
  scrollbar-width: thin;
  @media screen and (max-width: ${$phoneWidth}) {
    grid-template-columns: 1fr;
  }
  &::-webkit-scrollbar {
    width: 0.5rem;
    height: 0.5rem;
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

const TrackItem = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  border-width: 0.0625rem;
  border-style: solid;
  border-color: ${({ $selected }) => ($selected ? $primaryColor : 'rgba(0, 0, 0, 0.1)')};
  transition: opacity 0.3s;
  opacity: ${({ $selected }) => $selected && 1} !important;
  &:hover {
    opacity: 0.75;
  }
`;

const Check = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 100%;
  border: 0.0625rem solid rgba(0, 0, 0, 0.1);
  background: #fafafa;
  i {
    width: 1rem;
    height: 1rem;
    border-radius: 100%;
    background: ${$primaryColor};
    opacity: ${({ $selected }) => ($selected ? 1 : 0)};
    transition: opacity 0.3s;
  }
`;

const Info = styled.div`
  display: grid;
  gap: 0.25rem;
  text-align: right;
  b {
    opacity: 1;
    font-size: 1rem;
  }
  span {
    opacity: 0.5;
    font-size: 0.875rem;
  }
`;
