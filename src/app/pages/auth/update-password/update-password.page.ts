// src/app/pages/auth/update-password/update-password.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, NavController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-update-password',
  templateUrl: './update-password.page.html',
  styleUrls: ['./update-password.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class UpdatePasswordPage {
  password = '';
  confirmPassword = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private toastCtrl: ToastController,
    private navCtrl: NavController
  ) {}

  async onSubmit() {
    if (!this.password || !this.confirmPassword) {
      this.showToast('Completa ambos campos');
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.showToast('Las contraseñas no coinciden');
      return;
    }

    this.loading = true;
    try {
      await this.auth.updatePassword(this.password);
      await this.showToast('Contraseña actualizada correctamente.');
      this.navCtrl.navigateRoot('/login');
    } catch (err: any) {
      console.error(err);
      this.showToast(err.message || 'Error al actualizar contraseña');
    } finally {
      this.loading = false;
    }
  }

  private async showToast(message: string) {
    const t = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'bottom',
    });
    await t.present();
  }
}
