export interface IBlock {
  title: string;
  text: string;
}

export interface ITrack {
  id: string;
  title: string;
  artist: string;
  blocks: IBlock[];
  tonality: string;
}
