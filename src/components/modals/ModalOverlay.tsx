import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { FC, useEffect, useRef } from 'react';
import { $phoneWidth } from '../../styled/variables';
import { useLocation } from 'react-router-dom';

type Props = {
  open?: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
};

export const ModalOverlay: FC<Props> = ({ open = false, children, setOpen }) => {
  const location = useLocation();
  const wasOpen = useRef(open);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    wasOpen.current = open;

    if (open && location.pathname !== '#modal') {
      window.history.pushState(null, '', '#modal');
    } else if (!open && location.pathname === '#modal') {
      window.history.back();
    }
  }, [open, location]);

  useEffect(() => {
    if (location.pathname !== '#modal' && wasOpen.current) {
      setOpen(false);
    }
  }, [location, setOpen]);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      window.history.back();
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [open]);

  return (
    <>
      {open && (
        <Wrapper ref={modalRef}>
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
  @media screen and (max-width: ${$phoneWidth}) {
    width: 94%;
  }
`;
