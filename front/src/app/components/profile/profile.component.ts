import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  // Your profile logic
  favoris = {
    restaurants: [{ nom: 'Le Gourmet' }, { nom: 'Bistro Parisien' }],
    activitesTouristiques: [{ nom: 'Musée du Louvre' }, { nom: 'Tour Eiffel' }],
    activitesPleinAir: [{ nom: 'Randonnée en forêt' }, { nom: 'Kayak sur la Seine' }],
    hotels: [{ nom: 'Hôtel de Ville' }, { nom: 'Château Luxueux' }]
  };
  modifierProfil() {
    console.log("Redirection vers la page de modification du profil...");
    // Implémentez ici la navigation ou l'affichage du formulaire d'édition
  }
};
