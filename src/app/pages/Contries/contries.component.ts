import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CountryService } from '../../services/country.service';
import { Country } from '../../models/country.model';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-contries',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './contries.component.html',
  styleUrl: './contries.component.scss'
})
export class ContriesComponent implements OnInit {
  private readonly countryService = inject(CountryService);

  countries = signal<Country[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  searchTerm = signal<string>('');
  selectedContinent = signal<string>('all');
  sortBy = signal<'name' | 'population' | 'code'>('name');
  selectedCountry = signal<Country | null>(null);
  loadingDetails = signal<boolean>(false);

  filteredCountries = computed(() => {
    let result = this.countries();

    if (this.selectedContinent() !== 'all') {
      result = this.countryService.filterByContinent(this.selectedContinent(), result);
    }

    if (this.searchTerm().trim()) {
      result = this.countryService.searchCountries(this.searchTerm(), result);
    }

    result = this.countryService.sortCountries(result, this.sortBy());

    return result;
  });

  continents = computed(() => {
    const continentSet = new Set(this.countries().map(c => c.continent));
    return Array.from(continentSet).sort();
  });

  ngOnInit(): void {
    this.loadCountries();
  }

  loadCountries(): void {
    this.loading.set(true);
    this.error.set(null);

    this.countryService.getAllCountries().subscribe({
      next: (countries) => {
        this.countries.set(countries);
        this.loading.set(false);
        console.log('Países cargados:', countries.length);
      },
      error: (error) => {
        this.error.set(error.message || 'Error al cargar países');
        this.loading.set(false);
        console.error('Error al cargar países:', error);
      }
    });
  }

  loadCountryDetails(code: string): void {
    this.loadingDetails.set(true);
    this.countryService.getCountryByCode(code).subscribe({
      next: (country) => {
        this.selectedCountry.set(country);
        this.loadingDetails.set(false);
        console.log('País cargado:', country);
      },
      error: (error) => {
        console.error('Error al cargar país:', error);
        this.loadingDetails.set(false);
        alert(`Error al cargar detalles: ${error.message}`);
      }
    });
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
  }

  onContinentChange(continent: string): void {
    this.selectedContinent.set(continent);
  }

  onSortChange(sortBy: 'name' | 'population' | 'code'): void {
    this.sortBy.set(sortBy);
  }

  selectCountry(country: Country): void {
    this.selectedCountry.set(country);
    this.loadCountryDetails(country.code);
  }

  closeDetails(): void {
    this.selectedCountry.set(null);
  }

  retry(): void {
    this.loadCountries();
  }

  formatPopulation(population: number): string {
    return new Intl.NumberFormat('es-ES').format(population);
  }

  formatArea(area: number): string {
    return new Intl.NumberFormat('es-ES', { maximumFractionDigits: 2 }).format(area);
  }

  translateWeekday(day: string): string {
    const translations: { [key: string]: string } = {
      'monday': 'Lunes',
      'tuesday': 'Martes',
      'wednesday': 'Miércoles',
      'thursday': 'Jueves',
      'friday': 'Viernes',
      'saturday': 'Sábado',
      'sunday': 'Domingo'
    };
    return translations[day.toLowerCase()] || day;
  }

  formatPhones(phones: string[]): string {
    return phones.map(p => '+' + p).join(', ');
  }

  getCurrencyEntries(currencyDetails: { [key: string]: { name: string; symbol: string } }): { code: string; value: { name: string; symbol: string } }[] {
    return Object.entries(currencyDetails).map(([code, value]) => ({ code, value }));
  }

  translateContinent(continent: string): string {
    const translations: { [key: string]: string } = {
      'Africa': 'África',
      'Antarctica': 'Antártida',
      'Asia': 'Asia',
      'Europe': 'Europa',
      'North America': 'América del Norte',
      'Oceania': 'Oceanía',
      'South America': 'América del Sur'
    };
    return translations[continent] || continent;
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedContinent.set('all');
    this.sortBy.set('name');
  }

  hasActiveFilters(): boolean {
    return this.searchTerm().trim() !== '' || this.selectedContinent() !== 'all';
  }

  downloadPDF(): void {
    const country = this.selectedCountry();
    if (!country) return;

    const doc = new jsPDF();
    let yPos = 20;
    const lineHeight = 7;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;

    const addText = (text: string, isBold = false) => {
      if (yPos > pageHeight - margin) {
        doc.addPage();
        yPos = 20;
      }
      if (isBold) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
      }
      doc.text(text, 15, yPos);
      yPos += lineHeight;
    };

    // Título
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`Informacion del Pais: ${country.name}`, 15, yPos);
    yPos += 10;

    // Fuente de datos
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text('Fuente: Backend que combina GraphQL Countries API + REST Countries API', 15, yPos);
    yPos += 10;

    // INFORMACIÓN GENERAL (GraphQL + REST)
    addText('=== INFORMACION GENERAL ===', true);
    addText(`Codigo ISO 2: ${country.code} [GraphQL]`);
    if (country.cca3) addText(`Codigo ISO 3: ${country.cca3} [REST]`);
    addText(`Nombre: ${country.name} [GraphQL]`);
    if (country.native) addText(`Nombre Nativo: ${country.native} [GraphQL]`);
    addText(`Capital: ${country.capital} [GraphQL/REST]`);
    addText(`Continente: ${country.continent} [GraphQL]`);
    if (country.region) addText(`Region: ${country.region} [REST]`);
    if (country.subregion) addText(`Subregion: ${country.subregion} [REST]`);
    if (country.independent !== undefined) addText(`Independiente: ${country.independent ? 'Si' : 'No'} [REST]`);
    if (country.unMember !== undefined) addText(`Miembro ONU: ${country.unMember ? 'Si' : 'No'} [REST]`);
    yPos += 3;

    // GEOGRAFÍA (REST)
    addText('=== GEOGRAFIA (REST API) ===', true);
    if (country.latlng && country.latlng.length === 2) {
      addText(`Coordenadas: ${country.latlng[0].toFixed(4)}N, ${country.latlng[1].toFixed(4)}E`);
    }
    if (country.area) addText(`Area: ${this.formatArea(country.area)} km2`);
    if (country.landlocked !== undefined) addText(`Sin litoral: ${country.landlocked ? 'Si' : 'No'}`);
    if (country.borders && country.borders.length > 0) {
      addText(`Fronteras (${country.borders.length}): ${country.borders.join(', ')}`);
    }
    yPos += 3;

    // POBLACIÓN (REST)
    addText('=== POBLACION Y DEMOGRAFIA (REST API) ===', true);
    addText(`Poblacion: ${this.formatPopulation(country.population)} habitantes`);
    if (country.demonyms && country.demonyms['spa']) {
      addText(`Gentilicio (M): ${country.demonyms['spa'].m}`);
      addText(`Gentilicio (F): ${country.demonyms['spa'].f}`);
    }
    yPos += 3;

    // ECONOMÍA (GraphQL + REST)
    addText('=== ECONOMIA ===', true);
    if (country.currencyDetails) {
      const currencies = this.getCurrencyEntries(country.currencyDetails);
      currencies.forEach(curr => {
        addText(`Moneda: ${curr.value.name} (${curr.value.symbol}) [${curr.code}] [REST]`);
      });
    } else if (country.currency) {
      addText(`Moneda: ${country.currency} [GraphQL]`);
    }
    yPos += 3;

    // COMUNICACIÓN (GraphQL + REST)
    addText('=== COMUNICACION ===', true);
    if (country.phone) addText(`Codigo de Area: +${country.phone} [GraphQL]`);
    if (country.phones && country.phones.length > 0) {
      addText(`Codigos telefonicos: ${this.formatPhones(country.phones)} [GraphQL]`);
    }
    if (country.postalCode) {
      addText(`Formato Codigo Postal: ${country.postalCode.format} [REST]`);
    }
    yPos += 3;

    // IDIOMAS (GraphQL)
    addText('=== IDIOMAS (GraphQL API) ===', true);
    if (country.languages && country.languages.length > 0) {
      addText(`Idiomas (${country.languages.length}): ${country.languages.join(', ')}`);
    }
    yPos += 3;

    // ZONAS HORARIAS (REST)
    addText('=== ZONAS HORARIAS (REST API) ===', true);
    if (country.timezones && country.timezones.length > 0) {
      country.timezones.forEach(tz => addText(`- ${tz}`));
    }
    yPos += 3;

    // TRANSPORTE (REST)
    if (country.car) {
      addText('=== TRANSPORTE (REST API) ===', true);
      addText(`Lado de Conduccion: ${country.car.side === 'right' ? 'Derecha' : 'Izquierda'}`);
      if (country.car.signs && country.car.signs.length > 0) {
        addText(`Codigo de Matricula: ${country.car.signs.join(', ')}`);
      }
      yPos += 3;
    }

    // DEPORTES (REST)
    if (country.fifa) {
      addText('=== DEPORTES (REST API) ===', true);
      addText(`Codigo FIFA: ${country.fifa}`);
      yPos += 3;
    }

    // ESTADOS/PROVINCIAS (GraphQL)
    if (country.states && country.states.length > 0) {
      addText(`=== ESTADOS/PROVINCIAS (${country.states.length}) - GraphQL API ===`, true);
      country.states.forEach(state => addText(`- ${state.name}`));
      yPos += 3;
    }

    // OTROS DATOS (REST)
    addText('=== OTROS DATOS (REST API) ===', true);
    if (country.startOfWeek) addText(`Inicio de Semana: ${this.translateWeekday(country.startOfWeek)}`);
    if (country.emoji) addText(`Emoji: ${country.emoji} [GraphQL]`);
    if (country.awsRegion) addText(`Region AWS: ${country.awsRegion} [GraphQL]`);
    yPos += 5;

    // Pie de página
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    const footerText = `Generado el: ${new Date().toLocaleString('es-ES')}`;
    doc.text(footerText, 15, yPos);

    const fileName = `${country.name.replace(/\s+/g, '_')}_Info.pdf`;
    doc.save(fileName);
  }
}
