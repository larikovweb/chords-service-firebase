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

export interface IUser {
  email: string | null;
  token: string | null;
  id: string | null;
}

export interface IGroup {
  id: string;
  name: string;
  tracks: string[];
}
