export interface Artwork {
  id: string;
  title: string;
  artist: string;
  gallery: string;
  price: string;
  dimensions: string;
  medium: string;
  year: string;
  notes: string;
  imageUri: string;
  createdAt: string;
  updatedAt: string;
  listIds: string[];
  isFavorite: boolean;
}

export interface ArtworkList {
  id: string;
  name: string;
  description: string;
  artworkIds: string[];
  createdAt: string;
  updatedAt: string;
}

export type ArtworkFilterType = 'all' | 'favorites' | 'recent' | string;