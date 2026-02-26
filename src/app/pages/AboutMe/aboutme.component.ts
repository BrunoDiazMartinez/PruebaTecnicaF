import { Component } from '@angular/core';

interface PersonalInfo {
  name: string;
  lastName: string;
  age: number;
  university: string;
  birthPlace: string;
  role: string;
  bio: string;
  interests: {
    music: string[];
    movies: string[];
    series: string[];
    books: string[];
  };
}

@Component({
  selector: 'app-aboutme',
  standalone: true,
  imports: [],
  templateUrl: './aboutme.component.html',
  styleUrl: './aboutme.component.scss'
})
export class AboutMeComponent {
  personalInfo: PersonalInfo = {
    name: 'Moises',
    lastName: 'Diaz Martinez',
    age: 25,
    university: 'UPIICSA',
    birthPlace: 'Ciudad de México, México',
    role: 'Desarrollador Full Stack',
    bio: 'Soy un apasionado desarrollador con experiencia en tecnologías modernas como Angular, Node.js y más. Me encanta crear aplicaciones web interactivas y resolver problemas complejos. Siempre estoy buscando aprender nuevas tecnologías y mejorar mis habilidades.',
    interests: {
      music: [
        'TRAP',
        'Electrónica',
        'ROCK',
        'J-POP',
        'Dupstep'
      ],
      movies: [
        'Interstellar',
        'UP',
        'El Padrino',
        'Your Name',
        'Pulp Fiction'
      ],
      series: [
        'Two and a Half Men',
        'The Office',
        'How I Met Your Mother',
        'American Horror Story'
      ],
      books: [
        'La guerra de los mundos - H.G. Wells',
        'Hábitos atómicos - James Clear',
        'El poder de los hábitos - Charles Duhigg',
        'Viaje al centro de la tierra - Julio Verne',
        'Mangas'
      ]
    }
  };
}
