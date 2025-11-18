// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { appConfig } from './app/app.config';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import {  homeOutline } from 'ionicons/icons';
import { enableProdMode } from '@angular/core';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
// 👇 IMPORTAR Y REGISTRAR ICONOS
import { addIcons } from 'ionicons';
import {
  waterOutline,
  eyeOutline,
  mapOutline,
  analyticsOutline,
  logOutOutline,
  cameraOutline,
  documentTextOutline,
  
  documentText,
} from 'ionicons/icons';

addIcons({
  'log-out-outline': logOutOutline,
  'camera-outline': cameraOutline,
  'document-text-outline': documentTextOutline,
  'analytics-outline': analyticsOutline,      // por si usas analytics-outline
  'document-text': documentText,  
  'water-outline': waterOutline,
  'eye-outline': eyeOutline,
  'map-outline': mapOutline,
  'home-outline': homeOutline,
});

// Bootstrap normal
bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular(),
    provideRouter(routes),
    provideHttpClient(),
  ],
}).catch(err => console.error(err));
defineCustomElements(window);