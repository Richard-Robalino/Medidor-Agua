import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, RefresherCustomEvent } from '@ionic/angular';
import { ReadingsService, ReadingWithProfile } from '../../services/readings.service';

@Component({
  standalone: true,
  selector: 'app-all-readings',
  imports: [IonicModule, CommonModule],
  templateUrl: './all-readings.page.html',
  styleUrls: ['./all-readings.page.scss']
})
export class AllReadingsPage implements OnInit {
  readings: ReadingWithProfile[] = [];
  loading = false;

  constructor(private readingsSvc: ReadingsService) {}

  ngOnInit() {
    this.load();
  }

  async load(event?: RefresherCustomEvent) {
    this.loading = !event;
    try {
      this.readings = await this.readingsSvc.getAllReadings();
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
      event?.target.complete();
    }
  }

  mapLink(r: ReadingWithProfile): string {
    return this.readingsSvc.getGoogleMapsLink(r);
  }
}
