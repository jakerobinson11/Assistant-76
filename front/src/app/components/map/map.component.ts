import { Component, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FavoriteService } from '../../services/favorite.service'; // Import FavoriteService

function addIdToLocalStorage(id: number): void {
  // Récupérer le tableau existant du localStorage
  const storedIds = localStorage.getItem('ids');
  let ids: number[] = storedIds ? JSON.parse(storedIds) : [];

  // Ajouter l'ID au tableau
  ids.push(id);

  // Stocker le tableau mis à jour dans le localStorage
  localStorage.setItem('ids', JSON.stringify(ids));
}


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})


export class MapComponent implements AfterViewInit {
  private map!: any;
  private markers: any[] = [];
  private L: any; // Store Leaflet instance
  public favorites: any[] = []; // Store favorite locations
  private lastSelectedCategory: string = 'restaurant'; // Store last selected category
  private filterOptions: any = {}; // Store filter options for categories
  public favoriteArray: any = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private favoriteService: FavoriteService // Inject FavoriteService
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      import('leaflet').then(L => {
        this.L = L;
        this.initMap();
        this.fetchLocations(this.lastSelectedCategory); // Default category
      });
    }
  }

  private initMap(): void {
    this.map = this.L.map('map', {
      center: [49.4432, 1.0999], // Default location (Rouen)
      zoom: 13
    });

    setTimeout(() => {
      this.map.invalidateSize();
    }, 100);

    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Listen for map moves to update the locations based on new view bounds
    this.map.on('moveend', () => {
      const bounds = this.map.getBounds();
      this.fetchLocationsFromBounds(bounds, this.lastSelectedCategory);
    });
  }

  public onCategoryChange(event: Event): void {
    const selectedType = (event.target as HTMLSelectElement).value;
    this.lastSelectedCategory = selectedType; // Update the category
    this.fetchLocations(selectedType);
  }

  public onFilterChange(filter: string, value: any): void {
    this.filterOptions[this.lastSelectedCategory] = {
      ...this.filterOptions[this.lastSelectedCategory],
      [filter]: value
    };
    this.fetchLocations(this.lastSelectedCategory);
  }

  public onCitySearch(event: Event): void {
    const city = (event.target as HTMLInputElement).value;
    this.fetchCityCoordinates(city);
  }

  private fetchLocations(type: string): void {
    const bounds = this.map.getBounds();
    this.fetchLocationsFromBounds(bounds, type);
  }

  private fetchLocationsFromBounds(bounds: any, type: string = 'restaurant'): void {
    const north = bounds.getNorth();
    const east = bounds.getEast();
    const south = bounds.getSouth();
    const west = bounds.getWest();

    // Limit the number of results to prevent overload
    const overpassQuery = this.createOverpassQuery(type, south, west, north, east);

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

    fetch(url)
      .then(response => response.json())
      .then(data => this.addMarkers(data.elements))
      .catch(error => console.error('Error fetching locations:', error));
  }

  private createOverpassQuery(type: string, south: number, west: number, north: number, east: number): string {
    let query = '';
    const filters = this.filterOptions[type] || {};
  
    switch (type) {
      case 'hotel':
        query = `
          [out:json];
          node["tourism"="hotel"](${south},${west},${north},${east});
          node["tourism"="hostel"](${south},${west},${north},${east});
          node["tourism"="guest_house"](${south},${west},${north},${east});
          node["tourism"="motel"](${south},${west},${north},${east});
          ${filters.stars ? `node["stars"="${filters.stars}"](${south},${west},${north},${east});` : ''}
          out body 100;
        `;
        break;
  
      case 'tourism':
        query = `
        [out:json];
        node["tourism"~"museum|monument|attraction|aquarium|artwork|zoo"](${south},${west},${north},${east});
        ${filters.museum ? `node["tourism"="museum"](${south},${west},${north},${east});` : ''}
        ${filters.monument ? `node["tourism"="monument"](${south},${west},${north},${east});` : ''}
        ${filters.attraction ? `node["tourism"="attraction"](${south},${west},${north},${east});` : ''}
        ${filters.aquarium ? `node["tourism"="aquarium"](${south},${west},${north},${east});` : ''}
        ${filters.artwork ? `node["tourism"="artwork"](${south},${west},${north},${east});` : ''}
        ${filters.artwork ? `node["tourism"="zoo"](${south},${west},${north},${east});` : ''}
        out body 100;
      `;
        break;
  
      case 'park':
        query = `
          [out:json];
          node["leisure"~"park|garden|nature_reserve"](${south},${west},${north},${east});
          ${filters.park ? `node["leisure"="park"](${south},${west},${north},${east});` : ''}
          ${filters.nature_reserve ? `node["leisure"="nature_reserve"](${south},${west},${north},${east});` : ''}
          ${filters.garden ? `node["leisure"="garden"](${south},${west},${north},${east});` : ''}
          out body 100;
        `;
        break;
  
      default:
        query = `
          [out:json];
          node["amenity"="${type}"](${south},${west},${north},${east});
          out body 100;
        `;
        break;
    }
  
    return query;
  }
  
  private fetchCityCoordinates(city: string): void {
    const geoUrl = `https://nominatim.openstreetmap.org/search?city=${city}&format=json`;

    fetch(geoUrl)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          this.map.setView([lat, lon], 13); // Move map to new city
          this.fetchLocations(this.lastSelectedCategory); // Fetch last selected category for new location
        }
      })
      .catch(error => console.error('Error fetching city coordinates:', error));
  }

  private addMarkers(locations: any[]): void {
    // Remove existing markers
    this.markers.forEach(marker => marker.remove());
    this.markers = [];

    locations.forEach(location => {
      const popupContent = `
        <b>${location.tags.name || 'Unknown'}</b><br>
        ${location.tags.amenity}
        <br><button (click)="${this.addToFavorites(location.id, location.lat, location.lon, location.tags.name || 'Unknown')}">
          ❤️ Favorite
        </button>
      `;

      const marker = this.L.marker([location.lat, location.lon])
        .addTo(this.map)
        .bindPopup(popupContent);

      this.markers.push(marker);
    });
  }

  private addToFavorites(id:number, lat: number, lon: number, name: string): void {
    addIdToLocalStorage(id);
    /* console.log(id); */
    /* this.favoriteService.addFavorite({ lat, lon, name }).subscribe(response => {
      console.log('Added to favorites:', response);
      this.favorites.push({ lat, lon, name });
    }, error => {
      console.error('Error adding to favorites:', error);
    }); */
  }

  /* private removeFromFavorites(lat: number, lon: number, name: string): void {
    // Assuming you have a favoriteService with removeFavorite() method
    this.favoriteService.removeFavorite({ lat, lon, name }).subscribe(response => {
      console.log('Removed from favorites:', response);
      this.favorites = this.favorites.filter(fav => fav.lat !== lat || fav.lon !== lon); // Remove the location from the favorites list
    }, error => {
      console.error('Error removing from favorites:', error);
    });
  } */
}





