// Data model — PRD v2.1 §16.
// A Place is a discriminated union on `category`, so each category carries
// exactly its own fields (§16.2) on top of the shared base.

export type Category = 'cafe' | 'food' | 'flower' | 'clothing';

export type PowerOutlet = 'none' | 'few' | 'plenty';
export type Waiting = 'none' | 'some' | 'heavy';
export type PriceRange = '₩' | '₩₩' | '₩₩₩';

export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface TimeRange {
  open: string; // "10:00"
  close: string; // "22:00"
}

/** Opening hours — PRD §13.4. */
export interface OpeningHours {
  mode: 'everyday' | 'perDay';
  everyday: TimeRange | null;
  perDay: Partial<Record<Weekday, TimeRange | null>> | null;
}

/** Fields shared by every category (§16.1). */
export interface BasePlace {
  id: string;
  ownerId: string;
  name: string;
  address?: string;
  lat?: number;
  lng?: number;
  kakaoPlaceUrl?: string;
  neighborhood: string; // Neighborhood.id (one of the 27 presets)
  openingHours: OpeningHours | null;
  rating: number | null; // 1–5, not shown on cards
  memo: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CafePlace extends BasePlace {
  category: 'cafe';
  powerOutlet: PowerOutlet; // required core condition
  wifi?: boolean;
  laptopFriendly?: boolean;
  mood?: string[];
}

export interface FoodPlace extends BasePlace {
  category: 'food';
  waiting: Waiting; // required core condition
  reservationUrl?: string | null;
  foodType?: string;
  mood?: string[];
}

export interface FlowerPlace extends BasePlace {
  category: 'flower';
  walkInToday: boolean; // required core condition
  instagramUrl?: string | null;
}

export interface ClothingPlace extends BasePlace {
  category: 'clothing';
  // required: at least one styleTag OR a priceRange
  styleTags?: string[];
  priceRange?: PriceRange | null;
  instagramUrl?: string | null;
}

export type Place = CafePlace | FoodPlace | FlowerPlace | ClothingPlace;
