/**
 * AI Post generation constants.
 *
 * This file now re-exports constants from platforms.ts
 * for backward compatibility.
 *
 * @deprecated Import platform configurations from @/lib/constants/platforms instead.
 */

export {
  platforms,
  contentTypes,
  tones,
  goals,
  generatePost,
} from "./platforms";
