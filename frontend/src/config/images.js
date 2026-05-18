import discovered from 'virtual:imototo-assets';
import { buildSiteImages } from './buildImages';

const built = buildSiteImages(discovered);

export const IMAGES = built.IMAGES;
export const HERO_SLIDES = built.HERO_SLIDES;
export const GALLERY = built.GALLERY;
export const FLYERS = built.FLYERS;

/** @deprecated use GALLERY */
export const GALLERY_KEYS = [];
