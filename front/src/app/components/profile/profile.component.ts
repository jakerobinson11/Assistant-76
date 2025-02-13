import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FavoriteService } from '../../services/favorite.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  favorites: any[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: object, private favoriteService: FavoriteService) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
    const storedIds = localStorage.getItem('ids');
    const ids: string[] = storedIds ? JSON.parse(storedIds) : [];
    // Afficher les IDs dans la console
    console.dir(ids);
    }
  }

  fetchFavorites(): void {
    this.favoriteService.getFavorites().subscribe(favorites => {
      this.favorites = favorites;
    }, error => {
      console.error('Error fetching favorites:', error);
    });
  }
}
