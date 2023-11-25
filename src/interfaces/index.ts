export interface IBlock {
  title: string;
  text: string;
}

export interface ITrack {
  id?: number;
  title: string;
  artist: string;
  blocks: IBlock[];
  tonality: string;
}
