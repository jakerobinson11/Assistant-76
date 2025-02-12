import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';  // Import your user service

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user = {
    firstName: ''  // Default fallback value if no user is logged in
  };

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    // Check if we are in the browser (client-side)
    if (typeof window !== 'undefined') {
      // Fetch user data from the backend
      this.userService.getUserInfo().subscribe(
        (data) => {
          this.user.firstName = data.firstName;
          localStorage.setItem('userFirstName', data.firstName);  // Store it in localStorage
        },
        (error) => {
          console.error('Error fetching user info:', error);
          // Fallback to localStorage if API fails
          this.user.firstName = localStorage.getItem('userFirstName') || 'Prenom';
        }
      );
  }
}

  logout(): void {
    // Remove user session data (e.g., token, user info) from local storage
    localStorage.removeItem('userToken');
    localStorage.removeItem('userFirstName');

    // Redirect to Symfony logout route (if Symfony is handling the session)
    window.location.href = 'http://localhost:8000/logout';  // Symfony's logout URL
  }
}
