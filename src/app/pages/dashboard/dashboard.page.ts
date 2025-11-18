// src/app/pages/dashboard/dashboard.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService, UserRole } from '../../services/auth.service';
import { AppUser } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  imports: [IonicModule, CommonModule],
})
export class DashboardPage implements OnInit {
  userRole: UserRole | null = null;
  userName = '';

constructor(private auth: AuthService, private router: Router) {
  this.auth.profile$.subscribe((profile: AppUser | null) => {
    this.userName = profile?.email ?? 'Usuario';
    this.userRole = profile?.role ?? 'medidor';
  });
}


  ngOnInit() {
    this.auth.profile$.subscribe(profile => {
      this.userRole = (profile?.role as UserRole) ?? null;
      this.userName = profile?.email ?? '';   // lo que muestras en {{ userName }}
    });
  }

  // usado en (click)="logout()"
  async logout() {
    await this.auth.signOut();
    this.router.navigate(['/login']);
  }

  // usado en (click)="go('/ruta')"
  go(path: string) {
    this.router.navigate([path]);
  }
}
