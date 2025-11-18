import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonicModule,
  ToastController,
  LoadingController
} from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { ReadingsService } from '../../services/readings.service';

@Component({
  standalone: true,
  selector: 'app-new-reading',
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './new-reading.page.html',
  styleUrls: ['./new-reading.page.scss']
})
export class NewReadingPage {
  meterValue: number | null = null;
  observations = '';

  lat: number | null = null;
  lng: number | null = null;

  meterPhotoPreview: string | null = null;
  facadePhotoPreview: string | null = null;

  private meterPhotoFile?: Blob;
  private facadePhotoFile?: Blob;

  constructor(
    private readingsSvc: ReadingsService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  async takeMeterPhoto() {
    try {
      const photo = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });

      if (photo.webPath) {
        this.meterPhotoPreview = photo.webPath;
        const response = await fetch(photo.webPath);
        this.meterPhotoFile = await response.blob();
      }
    } catch (err) {
      console.error(err);
      this.showToast('No se pudo tomar la foto del medidor');
    }
  }

  async takeFacadePhoto() {
    try {
      const photo = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });

      if (photo.webPath) {
        this.facadePhotoPreview = photo.webPath;
        const response = await fetch(photo.webPath);
        this.facadePhotoFile = await response.blob();
      }
    } catch (err) {
      console.error(err);
      this.showToast('No se pudo tomar la foto de la fachada');
    }
  }

  async getLocation() {
    try {
      const pos = await Geolocation.getCurrentPosition();
      this.lat = pos.coords.latitude;
      this.lng = pos.coords.longitude;
      this.showToast('Ubicación obtenida correctamente');
    } catch (err) {
      console.error(err);
      this.showToast('No se pudo obtener la ubicación');
    }
  }

  canSave(): boolean {
    return (
      this.meterValue !== null &&
      this.lat !== null &&
      this.lng !== null &&
      !!this.meterPhotoFile &&
      !!this.facadePhotoFile
    );
  }

  async save() {
    if (!this.canSave()) {
      this.showToast('Completa valor, fotos y ubicación antes de guardar');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Guardando lectura...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const meterUrl = await this.readingsSvc.uploadImage(
        this.meterPhotoFile!,
        'medidor'
      );
      const facadeUrl = await this.readingsSvc.uploadImage(
        this.facadePhotoFile!,
        'fachada'
      );

      await this.readingsSvc.createReading({
        meterValue: this.meterValue!,
        observations: this.observations,
        lat: this.lat!,
        lng: this.lng!,
        meterPhotoUrl: meterUrl,
        facadePhotoUrl: facadeUrl
      });

      await loading.dismiss();
      this.showToast('Lectura registrada correctamente', 'success');
      this.resetForm();
    } catch (err) {
      console.error(err);
      await loading.dismiss();
      this.showToast('Error al guardar la lectura');
    }
  }

  private resetForm() {
    this.meterValue = null;
    this.observations = '';
    this.lat = null;
    this.lng = null;
    this.meterPhotoPreview = null;
    this.facadePhotoPreview = null;
    this.meterPhotoFile = undefined;
    this.facadePhotoFile = undefined;
  }

  private async showToast(
    message: string,
    color: string = 'medium'
  ): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2200,
      color
    });
    toast.present();
  }
}
