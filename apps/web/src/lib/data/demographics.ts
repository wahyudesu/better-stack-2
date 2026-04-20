/**
 * Demographics data - kept for backward compatibility.
 * @deprecated Import from @/lib/data/analytics-data instead.
 */

import { countryData, regionData, ageData, genderData } from "./analytics-data";
import { STAT_DEFINITIONS } from "./analytics-data";

export { COUNTRY_DATA as countryData, REGION_DATA as regionData, ageData, genderData, STAT_DEFINITIONS };
export type { DemographicDataItem } from "./analytics-data";
