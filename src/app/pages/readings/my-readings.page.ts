import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, RefresherCustomEvent } from '@ionic/angular';
import { ReadingsService, Reading } from '../../services/readings.service';

@Component({
  standalone: true,
  selector: 'app-my-readings',
  imports: [IonicModule, CommonModule],
  templateUrl: './my-readings.page.html',
  styleUrls: ['./my-readings.page.scss']
})
export class MyReadingsPage implements OnInit {
  readings: Reading[] = [];
  loading = false;

  constructor(private readingsSvc: ReadingsService) {}

  ngOnInit() {
    this.load();
  }

  async load(event?: RefresherCustomEvent) {
    this.loading = !event;
    try {
      this.readings = await this.readingsSvc.getMyReadings();
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
      event?.target.complete();
    }
  }

  mapLink(reading: Reading): string {
    return this.readingsSvc.getGoogleMapsLink(reading);
  }
}
