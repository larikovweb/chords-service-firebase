import { FC } from 'react';
import { GeneralBox, GeneralLabel } from '../styled/components';
import { IconAdd, IconDelete, IconEdit } from '../icons';
import styled from '@emotion/styled';
import { $primaryColor, $redColor } from '../styled/variables';
import { ModalControl } from './modals/ModalControl';
import { ModalGroup } from './modals/ModalGroup';
import { useAuth } from '../hooks/useAuth';
import { deleteData, getData } from '../services/firebaseService';
import useFetchData from '../hooks/useFetchData';
import { IGroup } from '../interfaces';
import { transformObjectToArray } from '../helpers/fn';

export const Groups: FC<{
  onGroupClick: (group: IGroup) => void;
  selectedGroupId: string | undefined;
}> = ({ onGroupClick, selectedGroupId }) => {
  const { isAuth } = useAuth();

  const {
    data,
    error,
    loading: isLoading,
    refetch: refetchGroups,
  } = useFetchData<{ [key: string]: IGroup }>(getData, 'groups');

  const loading = isLoading && <div>Идет загрузка...</div>;
  const errorMessage = error && <div>Произошла ошибка при загрузке треков</div>;
  const content = data && (
    <Wrapper>
      {transformObjectToArray(data).map((group) => (
        <Group
          key={group.id}
          group={group}
          onClick={() => onGroupClick(group)}
          refetchGroups={refetchGroups}
          isAuth={isAuth}
          selected={group.id === selectedGroupId}
        />
      ))}
    </Wrapper>
  );

  return (
    <GeneralBox>
      <Head>
        <b>Группы</b>
        {isAuth && (
          <ModalControl modal={<ModalGroup refetchGroups={refetchGroups} />}>
            <Btn>
              Добавить <IconAdd />
            </Btn>
          </ModalControl>
        )}
      </Head>
      <Scroll>
        {loading}
        {errorMessage}
        {content}
      </Scroll>
    </GeneralBox>
  );
};

const Group: FC<{
  group: IGroup;
  onClick: () => void;
  isAuth?: boolean;
  selected?: boolean;
  refetchGroups: () => void;
}> = ({ group, onClick, isAuth, selected, refetchGroups }) => {
  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      !confirm(`Вы действительно хотите удалить группу ${group.name}? Это действие необратимо.`)
    ) {
      return;
    }
    try {
      const response = await deleteData(`groups/${group.id}`);
      if (response.error) {
        console.error(response.error);
      } else {
        refetchGroups();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <GroupWrapper $selected={selected} onClick={onClick}>
      <Name>{group.name}</Name>
      {isAuth && (
        <Btns>
          <ModalControl modal={<ModalGroup isEdit group={group} refetchGroups={refetchGroups} />}>
            <Btn>
              <IconEdit />
            </Btn>
          </ModalControl>
          <Btn onClick={handleDeleteClick}>
            <IconDelete />
          </Btn>
        </Btns>
      )}
    </GroupWrapper>
  );
};

const Head = styled(GeneralLabel)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: 1;
  b {
    opacity: 0.5;
  }
`;

const Btn = styled.button`
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: ${$primaryColor};
  background: none;
  border: none;
  cursor: pointer;
  transition: opacity 0.3s;
  &:hover {
    opacity: 0.75;
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
    fill: ${$primaryColor};
    stroke: ${$primaryColor};
    margin-left: 0.5rem;
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

const Wrapper = styled.div`
  display: grid;
  gap: 0.5rem;
`;

const GroupWrapper = styled.div<{ $selected?: boolean }>`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 0.5rem;
  background: #fff;
  transition: box-shadow 0.3s;
  box-shadow: ${({ $selected }) => ($selected ? '0 0 1rem 0 rgba(25, 25, 28, 0.12)' : 'none')};
`;

const Name = styled.div`
  font-size: 1.25rem;
  word-wrap: break-word;
  overflow-wrap: anywhere;
`;

const Btns = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  > * {
    &:last-child {
      svg {
        fill: ${$redColor};
        stroke: ${$redColor};
      }
    }
  }
`;
