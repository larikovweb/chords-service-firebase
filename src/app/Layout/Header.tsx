import styled from '@emotion/styled';
import { FC } from 'react';
import { Container } from '../../styled/components';
import { Link } from 'react-router-dom';
import { ADMIN_ROUTE, LOGIN_ROUTE, TRACKS_ROUTE } from '../../utils/consts';
import { $phoneWidth, $primaryColor } from '../../styled/variables';
import { useAuth } from '../../hooks/useAuth';

export const Header: FC = () => {
  const { isAuth, logout } = useAuth();

  return (
    <Wrapper>
      <Container>
        <Link to={TRACKS_ROUTE}>Треки</Link>
        <Btns>
          {isAuth ? (
            <>
              <Link to={ADMIN_ROUTE}>Админка</Link>
              <Link to="#" onClick={logout}>
                Выйти
              </Link>
            </>
          ) : (
            <Link to={LOGIN_ROUTE}>Войти</Link>
          )}
        </Btns>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.header`
  padding: 1.5rem 0;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  > * {
    display: flex;
    justify-content: space-between;
  }
  a {
    border-radius: 0.75rem;
    border: 0.0625rem solid rgba(100, 100, 213, 0.08);
    background: #fff;
    padding: 0.75rem 1.5rem;
    color: ${$primaryColor};
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin-right: 1rem;
  }
  @media screen and (max-width: ${$phoneWidth}) {
    margin-bottom: 0.5rem;
  }
`;

const Btns = styled.div`
  display: flex;
`;
