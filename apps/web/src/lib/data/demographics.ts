/**
 * Demographics data - kept for backward compatibility.
 * @deprecated Import from @/lib/data/analytics-data instead.
 */

import { STAT_DEFINITIONS } from "@/lib/types/analytics";
import { ageData, countryData, genderData, regionData } from "./analytics-data";

export const COUNTRY_DATA = countryData;
export const REGION_DATA = regionData;
export type { DemographicDataItem } from "@/lib/types";
export { ageData, genderData, STAT_DEFINITIONS };
