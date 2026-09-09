export type ServiceTag =
  | "mais-procurado"
  | "novidade"
  | "indicado-para-iniciantes";

export interface Service {
  name: string;
  slug: string;
  description: string;
  application: number;
  maintenance: number;
  tag?: ServiceTag;
  featured?: boolean;
}

export interface GalleryItem {
  id: number;
  src?: string;
  alt?: string;
  label: string;
  technique: string;
}

export interface Service {
  name: string;
  slug: string;
  description: string;
  application: number;
  maintenance: number;
  tag?: ServiceTag;
  featured?: boolean;
}

export interface GalleryItem {
  id: number;
  src?: string;
  alt?: string;
  label: string;
  technique: string;
  size?: "square" | "tall" | "wide";
  featured?: boolean;
}
