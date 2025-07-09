export interface Genre {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  genreId: string;
}

export interface Song {
  id: string;
  name: string;
  songUrl: string;
  artistId: string;
}
