import { Type, Static } from '@sinclair/typebox';
import { compileAdapterValidator } from '../adapter-validator';
import { ResponseValidator } from '../validation';

/**
 * External icon
 */
export type Icon = Static<typeof Icon>;
export const Icon = Type.Object({
  size: Type.String(),
  url: Type.String(),
});

/**
 * List of icons
 */
export type IconInfo = Static<typeof IconInfo>;
export const IconInfo = Type.Object({
  icons: Type.Array(Icon),
});

/**
 * Adapter that will provide a list of icons for a protocol
 */
export interface IconAdapter {
  /**
   * Get a list of protocol infos
   */
  getIcons: () => Promise<IconInfo>;
}

export const iconAdapterValidators: ResponseValidator<IconAdapter> = {
  getIcons: compileAdapterValidator(IconInfo),
};
