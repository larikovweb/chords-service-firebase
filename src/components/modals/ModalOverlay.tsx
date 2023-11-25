import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { FC } from 'react';

type Props = {
  open?: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
};

export const ModalOverlay: FC<Props> = ({ open = false, children, setOpen, onClick }) => {
  return (
    <>
      {open && (
        <Wrapper onClick={onClick}>
          <Overlay onClick={() => setOpen(false)} />
          <Content>{children}</Content>
        </Wrapper>
      )}
    </>
  );
};

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  animation: ${fadeIn} 0.3s;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Content = styled.div`
  position: relative;
  border-radius: 0.75rem;
  background: #fff;
  padding: 1.75rem 1.25rem;
`;
