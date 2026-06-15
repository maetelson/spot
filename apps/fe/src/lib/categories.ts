import type { Category } from '@/types/place';

// Category + tab metadata — PRD §9.1 (tabs), §13.3 (required core conditions),
// §16.2 (mood / style option sets). Pure data consumed by tabs, filters, forms.

export interface CategoryMeta {
  id: Category;
  label: string;
  emoji: string;
}

/** Registerable categories (the "전체/all" tab is map/list-only, not registerable). */
export const CATEGORIES: readonly CategoryMeta[] = [
  { id: 'cafe', label: '카페', emoji: '☕' },
  { id: 'food', label: '맛집', emoji: '🍽️' },
  { id: 'flower', label: '꽃집', emoji: '💐' },
  { id: 'clothing', label: '옷', emoji: '👗' },
] as const;

export type CategoryTab = Category | 'all';

export const ALL_TAB = { id: 'all', label: '전체', emoji: '📍' } as const;

export const CATEGORY_EMOJI: Record<Category, string> = {
  cafe: '☕',
  food: '🍽️',
  flower: '💐',
  clothing: '👗',
};

/** mood / style option sets (§16.2). */
export const MOOD_OPTIONS: Record<'cafe' | 'food', string[]> = {
  cafe: ['조용함', '감성', '뷰맛집', '대화하기좋음', '혼자좋음'],
  food: ['데이트', '단체', '가족', '혼밥'],
};

export const STYLE_TAGS = [
  '미니멀',
  '빈티지',
  '스트릿',
  '페미닌',
  '캐주얼',
  '럭셔리',
  'Y2K',
  '워크웨어',
] as const;
