export interface GraphQLCountry {
  code: string;
  name: string;
  native: string;
  phone: string;
  phones: string[];
  continent: GraphQLContinent;
  capital: string;
  currency: string;
  currencies: string[];
  emoji: string;
  emojiU: string;
  languages: GraphQLLanguage[];
  states: GraphQLState[];
  awsRegion: string;
}

export interface GraphQLContinent {
  code: string;
  name: string;
}

export interface GraphQLLanguage {
  code: string;
  name: string;
  native: string;
}

export interface GraphQLState {
  code: string;
  name: string;
}

export interface RestCountry {
  name: {
    common: string;
    official: string;
    nativeName?: { [key: string]: { official: string; common: string } };
  };
  cca2: string;
  cca3: string;
  ccn3?: string;
  cioc?: string;
  independent?: boolean;
  status: string;
  unMember: boolean;
  currencies?: { [key: string]: { name: string; symbol: string } };
  idd: {
    root?: string;
    suffixes?: string[];
  };
  capital?: string[];
  altSpellings: string[];
  region: string;
  subregion?: string;
  languages?: { [key: string]: string };
  translations: { [key: string]: { official: string; common: string } };
  latlng: [number, number];
  landlocked: boolean;
  borders?: string[];
  area: number;
  demonyms?: {
    [key: string]: {
      f: string;
      m: string;
    };
  };
  flag: string;
  maps: {
    googleMaps: string;
    openStreetMaps: string;
  };
  population: number;
  gini?: { [key: string]: number };
  fifa?: string;
  car: {
    signs?: string[];
    side: string;
  };
  timezones: string[];
  continents: string[];
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  coatOfArms: {
    png?: string;
    svg?: string;
  };
  startOfWeek: string;
  capitalInfo: {
    latlng?: [number, number];
  };
  postalCode?: {
    format: string;
    regex?: string;
  };
}

export interface Country {
  code: string;
  cca3?: string;
  name: string;
  native?: string;
  capital: string;
  
  continent: string;
  continentCode?: string;
  region?: string;
  subregion?: string;
  latlng?: [number, number];
  landlocked?: boolean;
  borders?: string[];
  area?: number;
  
  phone?: string;
  phones?: string[];
  
  currency?: string;
  currencies?: string[];
  currencyDetails?: { [key: string]: { name: string; symbol: string } };
  
  languages: string[];
  languageDetails?: GraphQLLanguage[];
  emoji?: string;
  emojiU?: string;
  
  population: number;
  demonyms?: {
    [key: string]: {
      f: string;
      m: string;
    };
  };
  
  independent?: boolean;
  unMember?: boolean;
  fifa?: string;
  
  flag: string;
  flags?: {
    png: string;
    svg: string;
    alt?: string;
  };
  coatOfArms?: {
    png?: string;
    svg?: string;
  };
  
  timezones: string[];
  awsRegion?: string;
  startOfWeek?: string;
  car?: {
    signs?: string[];
    side: string;
  };
  postalCode?: {
    format: string;
    regex?: string;
  };
  
  states?: GraphQLState[];
  
  maps?: {
    googleMaps: string;
    openStreetMaps: string;
  };
  
  metadata?: CountryMetadata;
}

export interface CountryMetadata {
  cca2: string;
  cca3: string;
  officialName: string;
  nativeName: string;
  region: string;
  subregion: string;
  continent: Continent;
  states: string[];
  emoji: string;
  flagEmoji: string;
}

export interface Continent {
  code: string;
  name: string;
}

export interface CountryResponse {
  success: boolean;
  data: Country;
}

export interface CountriesResponse {
  success: boolean;
  count: number;
  data: Country[];
}

export interface ApiError {
  error: {
    message: string;
    code: string;
    statusCode: number;
    details?: any;
    timestamp: string;
  };
}

