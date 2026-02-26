import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { Country, CountryResponse, CountriesResponse } from '../models/country.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private readonly http = inject(HttpClient);
  
  private readonly apiUrl = environment.apiUrl;

  getCountryByCode(code: string): Observable<Country> {
    return this.http.get<CountryResponse>(`${this.apiUrl}/countries/${code}`).pipe(
      retry(2),
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  getAllCountries(): Observable<Country[]> {
    return this.http.get<CountriesResponse>(`${this.apiUrl}/countries`).pipe(
      retry(2),
      map(response => response.data),
      catchError(this.handleError)
    );
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
      country.continent.toLowerCase().includes(term)
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

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      const serverError = error.error?.error;
      if (serverError) {
        errorMessage = `${serverError.message}`;
      } else {
        errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }

    console.error('CountryService Error:', {
      status: error.status,
      message: errorMessage,
      error: error.error
    });

    return throwError(() => ({
      message: errorMessage,
      status: error.status,
      details: error.error
    }));
  }
}
