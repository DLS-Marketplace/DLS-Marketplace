export const CATEGORIES = ['food', 'assignments', 'clothes', 'jobs', 'other'] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  food: 'Food',
  assignments: 'Assignments',
  clothes: 'Clothes',
  jobs: 'Jobs',
  other: 'Other',
};

export const PRODUCT_SORTS = ['newest', 'price_asc', 'price_desc'] as const;
export type ProductSort = (typeof PRODUCT_SORTS)[number];

export const MAX_IMAGES_PER_PRODUCT = 5;
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'] as const;

export const TITLE_MIN_LENGTH = 3;
export const TITLE_MAX_LENGTH = 80;
export const DESCRIPTION_MAX_LENGTH = 2000;
export const MAX_PRICE_CENTS = 1_000_000;
export const NAME_MAX_LENGTH = 50;
