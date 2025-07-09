import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import type { Genre, Artist, Song } from "../models/music";
import { uploadImage, uploadAudio } from "./cloudinaryService";

export type GenreWithFile = Omit<Genre, "id" | "imageUrl"> & {
  imageFile?: File;
};
export type ArtistWithFile = Omit<Artist, "id" | "imageUrl"> & {
  imageFile?: File;
};
export type SongWithFile = Omit<Song, "id" | "songUrl"> & { songFile?: File };

export const getGenres = async (): Promise<Genre[]> => {
  const genresCollection = collection(db, "genres");
  const genreSnapshot = await getDocs(genresCollection);
  return genreSnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as Genre,
  );
};

export const getArtistsByGenre = async (genreId: string): Promise<Artist[]> => {
  const artistsCollection = collection(db, "artists");
  const q = query(artistsCollection, where("genreId", "==", genreId));
  const artistSnapshot = await getDocs(q);
  return artistSnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as Artist,
  );
};

export const getSongsByArtist = async (artistId: string): Promise<Song[]> => {
  const songsCollection = collection(db, "songs");
  const q = query(songsCollection, where("artistId", "==", artistId));
  const songSnapshot = await getDocs(q);
  return songSnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as Song,
  );
};

export const createGenre = async (genreData: GenreWithFile): Promise<Genre> => {
  if (!genreData.imageFile)
    throw new Error("Image file is required for creating a genre.");

  const imageUrl = await uploadImage(genreData.imageFile);
  const newGenreData = { name: genreData.name, imageUrl };

  const docRef = await addDoc(collection(db, "genres"), newGenreData);
  return { id: docRef.id, ...newGenreData };
};

export const updateGenre = async (
  genreId: string,
  genreData: Partial<GenreWithFile>,
): Promise<void> => {
  const dataToUpdate: Partial<Genre> = { name: genreData.name };

  if (genreData.imageFile) {
    dataToUpdate.imageUrl = await uploadImage(genreData.imageFile);
  }

  const genreRef = doc(db, "genres", genreId);
  await updateDoc(genreRef, dataToUpdate);
};

export const deleteGenre = async (genreId: string): Promise<void> => {
  await deleteDoc(doc(db, "genres", genreId));
};

export const createArtist = async (
  artistData: ArtistWithFile,
): Promise<Artist> => {
  if (!artistData.imageFile)
    throw new Error("Image file is required for creating an artist.");

  const imageUrl = await uploadImage(artistData.imageFile);
  const newArtistData = {
    name: artistData.name,
    genreId: artistData.genreId,
    imageUrl,
  };

  const docRef = await addDoc(collection(db, "artists"), newArtistData);
  return { id: docRef.id, ...newArtistData };
};

export const updateArtist = async (
  artistId: string,
  artistData: Partial<ArtistWithFile>,
): Promise<void> => {
  const dataToUpdate: Partial<Artist> = {
    name: artistData.name,
    genreId: artistData.genreId,
  };

  if (artistData.imageFile) {
    dataToUpdate.imageUrl = await uploadImage(artistData.imageFile);
  }

  const artistRef = doc(db, "artists", artistId);
  await updateDoc(artistRef, dataToUpdate);
};

export const deleteArtist = async (artistId: string): Promise<void> => {
  await deleteDoc(doc(db, "artists", artistId));
};

export const createSong = async (songData: SongWithFile): Promise<Song> => {
  if (!songData.songFile)
    throw new Error("MP3 file is required for creating a song.");
  const songUrl = await uploadAudio(songData.songFile);
  const newSongData = {
    name: songData.name,
    artistId: songData.artistId,
    songUrl,
  };

  const docRef = await addDoc(collection(db, "songs"), newSongData);
  return { id: docRef.id, ...newSongData };
};

export const updateSong = async (
  songId: string,
  songData: Partial<SongWithFile>,
): Promise<void> => {
  const dataToUpdate: Partial<Song> = {
    name: songData.name,
    artistId: songData.artistId,
  };

  if (songData.songFile) {
    dataToUpdate.songUrl = await uploadAudio(songData.songFile);
  }

  const songRef = doc(db, "songs", songId);
  await updateDoc(songRef, dataToUpdate);
};

export const deleteSong = async (songId: string): Promise<void> => {
  await deleteDoc(doc(db, "songs", songId));
};
