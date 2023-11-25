import styled from '@emotion/styled';
import { FC, useEffect, useState } from 'react';
import { ITrack } from '../interfaces';
import { trackAPI } from '../services/TracksService';
import {
  Button,
  ButtonTransparent,
  GeneralBox,
  GeneralLabel,
  Input,
  Select,
  TextArea,
} from '../styled/components';
import { IconAdd, IconDelete } from '../icons';
import { InputField } from './fields/InputField';
import { Controller, useForm } from 'react-hook-form';
import { $phoneWidth, $primaryColor } from '../styled/variables';

type Props = {
  editableTrack?: ITrack;
  setEditableTrack: React.Dispatch<React.SetStateAction<ITrack | undefined>>;
};

const chords = [
  'A',
  'B',
  'H',
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'Am',
  'Bm',
  'Hm',
  'Cm',
  'Cm#',
  'Dm',
  'Dm#',
  'Em',
  'Fm',
  'Fm#',
  'Gm',
  'Gm#',
];

export const FormTrack: FC<Props> = ({ editableTrack, setEditableTrack }) => {
  const [createTrack] = trackAPI.useCreateTrackMutation();
  const [updateTrack] = trackAPI.useUpdateTrackMutation();

  const [textBlocks, setTextBlocks] = useState<string[]>(['']);

  const onSubmit = async (data: ITrack) => {
    if (editableTrack) {
      await updateTrack({ ...data, id: editableTrack.id });
      reset();
      setTextBlocks(['']);
      setEditableTrack(undefined);
    } else {
      await createTrack(data);
      setTextBlocks(['']);
      reset();
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm<ITrack>();

  useEffect(() => {
    if (editableTrack) {
      setValue('title', editableTrack.title);
      setValue('artist', editableTrack.artist);
      setValue('blocks', editableTrack.blocks);
      setValue('tonality', editableTrack.tonality);
      setTextBlocks([...editableTrack.blocks.map((b) => b.title)]);
    }
  }, [editableTrack, setValue]);

  const handleAddTextBlock = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setTextBlocks((prevTextBlocks) => [...prevTextBlocks, '']);
  };

  const handleDeleteTextBlock = (index: number) => {
    setTextBlocks((prevTextBlocks) => prevTextBlocks.filter((_, i) => i !== index));
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <GeneralBox>
        <Head>
          <GeneralLabel>Общая информация о треке</GeneralLabel>
          <ResetBtn
            onClick={() => {
              reset();
              setEditableTrack(undefined);
              setTextBlocks(['']);
            }}>
            RESET
          </ResetBtn>
        </Head>
        <RowInfo>
          <InputField label="Введите название трека" error={errors.title?.message}>
            <Input
              {...register('title', { required: 'Название трека обязательно' })}
              placeholder="Название"
            />
          </InputField>
          <InputField label="Введите имя исполнителя" error={errors.artist?.message}>
            <Input
              {...register('artist', { required: 'Имя исполнителя обязательно' })}
              placeholder="Имя"
            />
          </InputField>
          <InputField label="Введите оригинальную тональность" error={errors.tonality?.message}>
            <Select {...register('tonality', { required: 'Тональность трека обязательна' })}>
              {chords.map((chord) => (
                <option key={chord} value={chord}>
                  {chord}
                </option>
              ))}
            </Select>
          </InputField>
        </RowInfo>
      </GeneralBox>
      <GeneralBox>
        <GeneralLabel>Текстовые блоки трека</GeneralLabel>
        <TextBlocks>
          {textBlocks.map((_, index) => (
            <TextBlock key={index}>
              <Controller
                name={`blocks.${index}.title`}
                control={control}
                rules={{ required: 'Название текстового блока обязательно' }}
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                  <InputField error={error?.message} label="Название текстового блока">
                    <Input value={value || ''} onChange={onChange} placeholder="Название" />
                  </InputField>
                )}
              />
              <Controller
                name={`blocks.${index}.text`}
                control={control}
                rules={{ required: 'Текст трека обязателен' }}
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                  <InputField error={error?.message} label="Текст песни">
                    <TextArea value={value || ''} onChange={onChange} placeholder="Текст" />
                  </InputField>
                )}
              />
              {textBlocks.length > 1 && (
                <DeleteBtn onClick={() => handleDeleteTextBlock(index)}>
                  <IconDelete />
                </DeleteBtn>
              )}
            </TextBlock>
          ))}
        </TextBlocks>
        <AddBtn onClick={handleAddTextBlock}>
          <IconAdd /> Добавить текстовый блок
        </AddBtn>
      </GeneralBox>
      <SubmitBtn type="submit">{editableTrack ? 'Сохранить' : 'Добавить трек'}</SubmitBtn>
    </Form>
  );
};

const Form = styled.form`
  display: grid;
  gap: 1rem;
`;

const Head = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const ResetBtn = styled.div`
  cursor: pointer;
  color: ${$primaryColor};
`;

const RowInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 1rem;
  @media screen and (max-width: ${$phoneWidth}) {
    grid-template-columns: 1fr;
  }
`;

const TextBlocks = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  @media screen and (max-width: ${$phoneWidth}) {
    grid-template-columns: 1fr;
  }
`;

const TextBlock = styled(GeneralBox)`
  position: relative;
  padding: 1rem;
`;

const AddBtn = styled(ButtonTransparent)`
  margin: 0.75rem auto 0;
`;

const DeleteBtn = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(25%, -25%);
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 91, 91, 0.5);
  border-radius: 0.5rem;
  transition: background 0.3s;
  &:hover {
    background: rgba(255, 91, 91, 1);
  }
  svg {
    width: 1rem;
    height: 1rem;
    fill: #fff;
    stroke: #fff;
  }
`;

const SubmitBtn = styled(Button)`
  width: 100%;
`;
