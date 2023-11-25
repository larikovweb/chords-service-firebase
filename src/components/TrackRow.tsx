import styled from '@emotion/styled';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { $phoneWidth, $primaryColor } from '../styled/variables';
import { ITrack } from '../interfaces';
import { TRACK_ROUTE } from '../utils/consts';

type Props = {
  track: ITrack;
  children?: React.ReactNode;
};

export const TrackRow: FC<Props> = ({ track, children }) => {
  return (
    <Wrapper to={`${TRACK_ROUTE}/${track.id}`}>
      <Col>
        <b>{track.title}</b>
        <span>{track.artist}</span>
      </Col>
      <Buttons>{children}</Buttons>
    </Wrapper>
  );
};

const Wrapper = styled(Link)`
  padding: 1.5rem 1rem;
  display: flex;
  align-items: center;
  padding-left: 4rem;
  position: relative;
  transition: background 0.3s;
  &:not(:last-child) {
    border-bottom: 0.0625rem solid rgba(25, 25, 28, 0.08);
  }
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 1rem;
    transform: translateY(-50%);
    width: 2rem;
    height: 2rem;
    background-color: #fafafa;
    border-radius: 100%;
    border: 0.0625rem solid ${$primaryColor};
    z-index: 0;
  }
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 1.7rem;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0.625rem 0 0.625rem 1rem;
    border-color: transparent transparent transparent ${$primaryColor};
    z-index: 1;
  }
  &:hover {
    background: #f9fafc;
  }
  b {
    color: ${$primaryColor};
    font-weight: bold;
    margin-bottom: 0.5rem;
    font-size: 1rem;
  }
  span {
    font-size: 0.875rem;
    opacity: 0.75;
  }
  @media screen and (max-width: ${$phoneWidth}) {
    padding-left: 0;
    padding-right: 0;
    &::before,
    &::after {
      display: none;
    }
  }
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
`;

const Buttons = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
`;
