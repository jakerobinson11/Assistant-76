import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component'; 
import { MapComponent } from './components/map/map.component';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },  // Add profile route
  { path: 'map', component: MapComponent },
  { path: '', redirectTo: '/register', pathMatch: 'full' },  // Redirect root to register page
  { path: '**', redirectTo: '/register' }  // Catch-all redirect
];
