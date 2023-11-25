import styled from '@emotion/styled';
import { $primaryColor } from './variables';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const Form = styled.form`
  display: grid;
  gap: 0.5rem;
  width: 100%;
  max-width: 20rem;
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  background: #fff;
  box-shadow: 0 0 1rem 0 rgba(25, 25, 28, 0.12);
  button {
    width: 100%;
  }
`;

const Links = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.5rem;
  a {
    color: ${$primaryColor};
  }
`;

export const Auth = {
  Wrapper,
  Title,
  Form,
  Links,
};
