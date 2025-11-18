// src/app/pages/auth/forgot-password/forgot-password.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, NavController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class ForgotPasswordPage {
  email = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private toastCtrl: ToastController,
    private navCtrl: NavController
  ) {}

  async onSubmit() {
    if (!this.email) {
      this.showToast('Ingresa tu correo institucional');
      return;
    }

    this.loading = true;
    try {
      await this.auth.requestPasswordReset(this.email);
      await this.showToast(
        'Te enviamos un correo con el enlace para restablecer tu contraseña.'
      );
      this.navCtrl.navigateBack('/login');
    } catch (err: any) {
      console.error(err);
      this.showToast(err.message || 'Error al enviar el correo');
    } finally {
      this.loading = false;
    }
  }

  goToLogin() {
    this.navCtrl.navigateBack('/login');
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
