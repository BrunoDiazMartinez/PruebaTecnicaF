import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Apollo, gql } from 'apollo-angular';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';
import {
  Country,
  GraphQLCountry,
  RestCountry,
  GraphQLLanguage,
  GraphQLState
} from '../models/country.model';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})
export class UnifiedCountryService {
  private readonly http = inject(HttpClient);
  private readonly apollo = inject(Apollo);
  private readonly logService = inject(LogService);

  private readonly REST_API_URL = 'https://restcountries.com/v3.1/all';
  
  private countriesCache$?: Observable<Country[]>;

  private readonly ALL_COUNTRIES_QUERY = gql`
    query GetAllCountries {
      countries {
        code
        name
        native
        phone
        phones
        continent {
          code
          name
        }
        capital
        currency
        currencies
        emoji
        emojiU
        languages {
          code
          name
          native
        }
        states {
          code
          name
        }
        awsRegion
      }
    }
  `;

  getAllCountries(): Observable<Country[]> {
    if (this.countriesCache$) {
      return this.countriesCache$;
    }

    this.countriesCache$ = forkJoin({
      graphql: this.getCountriesFromGraphQL(),
      rest: this.getCountriesFromREST()
    }).pipe(
      map(({ graphql, rest }) => {
        this.logService.success(`Datos cargados exitosamente`);
        this.logService.log(`🔷 GraphQL API - Total: ${graphql.length} países`);
        this.logService.logTable('GraphQL - Primeros 5 países', 
          graphql.slice(0, 5).map(c => ({
            code: c.code,
            name: c.name,
            native: c.native,
            capital: c.capital,
            currency: c.currency,
            emoji: c.emoji
          }))
        );
        
        this.logService.log(`🔶 REST API - Total: ${rest.length} países`);
        this.logService.logTable('REST - Primeros 5 países',
          rest.slice(0, 5).map(c => ({
            code: c.cca2,
            name: c.name.common,
            population: c.population,
            area: c.area,
            region: c.region,
            independent: c.independent
          }))
        );

        return this.mergeCountryData(graphql, rest);
      }),
      shareReplay(1),
      catchError(error => {
        this.logService.error('Error al obtener países: ' + error.message);
        console.error('Error al obtener países:', error);
        this.countriesCache$ = undefined;
        return throwError(() => error);
      })
    );

    return this.countriesCache$;
  }

  getCountryByCode(code: string): Observable<Country> {
    return this.getAllCountries().pipe(
      map(countries => {
        const country = countries.find(
          c => c.code.toLowerCase() === code.toLowerCase() || 
               c.cca3?.toLowerCase() === code.toLowerCase()
        );
        
        if (!country) {
          throw new Error(`País con código ${code} no encontrado`);
        }
        
        return country;
      })
    );
  }

  clearCache(): void {
    this.countriesCache$ = undefined;
  }

  private getCountriesFromGraphQL(): Observable<GraphQLCountry[]> {
    return this.apollo.query<{ countries: GraphQLCountry[] }>({
      query: this.ALL_COUNTRIES_QUERY,
      fetchPolicy: 'network-only'
    }).pipe(
      map(result => result.data?.countries || []),
      catchError(error => {
        console.error('Error en GraphQL:', error);
        return of([]);
      })
    );
  }

  // Método para obtener datos de la REST API
  private getCountriesFromREST(): Observable<RestCountry[]> {
    return this.http.get<RestCountry[]>(this.REST_API_URL).pipe(
      catchError(error => {
        console.error('Error en REST API:', error);
        return of([]);
      })
    );
  }

  private mergeCountryData(
    graphqlData: GraphQLCountry[],
    restData: RestCountry[]
  ): Country[] {
    const restIndex = new Map<string, RestCountry>();
    restData.forEach(country => {
      restIndex.set(country.cca2, country);
      restIndex.set(country.cca3, country);
    });

    return graphqlData.map(gqlCountry => {
      const restCountry = restIndex.get(gqlCountry.code);

      return this.createUnifiedCountry(gqlCountry, restCountry);
    }).filter(country => country !== null) as Country[];
  }

  private createUnifiedCountry(
    gql: GraphQLCountry,
    rest?: RestCountry
  ): Country | null {
    try {
      const languages = gql.languages?.map(lang => lang.name) || [];
      const capital = gql.capital || rest?.capital?.[0] || 'N/A';
      const unified: Country = {
        code: gql.code,
        cca3: rest?.cca3,
        name: gql.name,
        native: gql.native || this.extractNativeName(rest),
        capital: capital,

        continent: gql.continent?.name || rest?.region || 'N/A',
        continentCode: gql.continent?.code,
        region: rest?.region,
        subregion: rest?.subregion,
        latlng: rest?.latlng,
        landlocked: rest?.landlocked,
        borders: rest?.borders,
        area: rest?.area || 0,

        phone: gql.phone,
        phones: gql.phones,

        currency: gql.currency,
        currencies: gql.currencies || [],
        currencyDetails: rest?.currencies,

        languages: languages,
        languageDetails: gql.languages,
        emoji: gql.emoji,
        emojiU: gql.emojiU,

        population: rest?.population || 0,
        demonyms: rest?.demonyms,

        independent: rest?.independent,
        unMember: rest?.unMember,
        fifa: rest?.fifa,

        flag: rest?.flags?.svg || rest?.flags?.png || '',
        flags: rest?.flags,
        coatOfArms: rest?.coatOfArms,

        timezones: rest?.timezones || [],
        awsRegion: gql.awsRegion,
        startOfWeek: rest?.startOfWeek,
        car: rest?.car,
        postalCode: rest?.postalCode,

        states: gql.states,

        maps: rest?.maps,

        metadata: rest ? {
          cca2: rest.cca2,
          cca3: rest.cca3,
          officialName: rest.name.official,
          nativeName: this.extractNativeName(rest) || rest.name.common,
          region: rest.region,
          subregion: rest.subregion || '',
          continent: {
            code: gql.continent?.code || '',
            name: gql.continent?.name || rest.region
          },
          states: gql.states?.map(s => s.name) || [],
          emoji: gql.emoji || '',
          flagEmoji: rest.flag
        } : undefined
      };

      return unified;
    } catch (error) {
      console.error(`Error procesando país ${gql.code}:`, error);
      return null;
    }
  }

  private extractNativeName(rest?: RestCountry): string | undefined {
    if (!rest?.name?.nativeName) return undefined;

    const nativeNames = Object.values(rest.name.nativeName);
    return nativeNames[0]?.common || nativeNames[0]?.official;
  }

  searchCountries(searchTerm: string, countries: Country[]): Country[] {
    if (!searchTerm.trim()) {
      return countries;
    }

    const term = searchTerm.toLowerCase().trim();
    return countries.filter(country =>
      country.name.toLowerCase().includes(term) ||
      country.code.toLowerCase().includes(term) ||
      country.capital.toLowerCase().includes(term) ||
      country.continent.toLowerCase().includes(term) ||
      country.native?.toLowerCase().includes(term) ||
      country.region?.toLowerCase().includes(term)
    );
  }

  filterByContinent(continent: string, countries: Country[]): Country[] {
    if (!continent || continent === 'all') {
      return countries;
    }
    return countries.filter(country => 
      country.continent.toLowerCase() === continent.toLowerCase()
    );
  }

  sortCountries(
    countries: Country[], 
    sortBy: 'name' | 'population' | 'code' = 'name',
    order: 'asc' | 'desc' = 'asc'
  ): Country[] {
    return [...countries].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'population':
          comparison = a.population - b.population;
          break;
        case 'code':
          comparison = a.code.localeCompare(b.code);
          break;
      }
      
      return order === 'asc' ? comparison : -comparison;
    });
  }
}
