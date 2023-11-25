import { FC, ReactNode, useState } from 'react';
import { ModalOverlay } from './ModalOverlay';

type Props = {
  modal: ReactNode;
  children: ReactNode;
};

export const ModalControl: FC<Props> = ({ modal, children }) => {
  const [open, setOpen] = useState(false);
  const handleChildClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  return (
    <>
      <div
        style={{ cursor: 'pointer', width: 'fit-content' }}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}>
        {children}
      </div>
      <ModalOverlay onClick={handleChildClick} setOpen={setOpen} open={open}>
        {modal}
      </ModalOverlay>
    </>
  );
};
