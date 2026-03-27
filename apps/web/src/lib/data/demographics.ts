/**
 * Demographics data for dashboard
 * Country and region distribution statistics
 */

export interface DemographicDataItem {
	country?: string;
	countryCode?: string; // ISO 3166-1 alpha-2 code
	region?: string;
	users: number;
}

// Country data - 8 countries with user counts
export const COUNTRY_DATA: readonly DemographicDataItem[] = [
	{ country: "Indonesia", countryCode: "ID", users: 3500 },
	{ country: "United States", countryCode: "US", users: 2800 },
	{ country: "Japan", countryCode: "JP", users: 1900 },
	{ country: "Singapore", countryCode: "SG", users: 1200 },
	{ country: "Malaysia", countryCode: "MY", users: 850 },
	{ country: "Thailand", countryCode: "TH", users: 720 },
	{ country: "Philippines", countryCode: "PH", users: 580 },
	{ country: "Vietnam", countryCode: "VN", users: 450 },
] as const;

// Region data - 8 Indonesian cities with user counts
export const REGION_DATA: readonly DemographicDataItem[] = [
	{ region: "Jakarta", users: 2100 },
	{ region: "Surabaya", users: 1400 },
	{ region: "Bandung", users: 980 },
	{ region: "Bali", users: 720 },
	{ region: "Medan", users: 580 },
	{ region: "Semarang", users: 490 },
	{ region: "Yogyakarta", users: 380 },
	{ region: "Makassar", users: 290 },
] as const;
