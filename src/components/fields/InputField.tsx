import styled from '@emotion/styled';
import React, { FC } from 'react';
import { $primaryColor, $redColor } from '../../styled/variables';

type Props = {
  children: React.ReactNode;
  error?: string | undefined;
  label?: string | undefined;
};

export const InputField: FC<Props> = ({ children, error, label }) => {
  return (
    <Wrap>
      {label && <Label>{label}</Label>}
      <Content error={Boolean(error)}>{children}</Content>
      {error && <Error>{error}</Error>}
    </Wrap>
  );
};

const Label = styled.label`
  font-size: 0.75rem;
  color: ${$primaryColor};
  margin-bottom: 0.25rem;
`;
const Content = styled.div(({ error }: { error: boolean }) => ({
  color: error ? $redColor : 'inherit',
  width: '100%',
}));

const Wrap = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  padding-bottom: 1.2rem;
  transition: padding 0.3s;
`;

const Error = styled.span`
  font-size: 0.65rem;
  min-height: 1rem;
  color: ${$redColor};
  width: 100%;
  bottom: 0;
  position: absolute;
  left: 0;
  z-index: 1;
`;
