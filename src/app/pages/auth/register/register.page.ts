import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonicModule,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.showToast('Completa los datos correctamente');
      return;
    }

    const { email, password, confirmPassword } = this.form.value;

    if (password !== confirmPassword) {
      this.showToast('Las contraseñas no coinciden');
      return;
    }

    this.loading = true;
    const loadingOverlay = await this.loadingCtrl.create({
      message: 'Creando cuenta...',
    });
    await loadingOverlay.present();

    try {
      await this.auth.signUpMedidor(email, password);

      await loadingOverlay.dismiss();
      this.loading = false;

      this.showToast(
        'Cuenta creada. Revisa tu correo institucional para verificar la cuenta.'
      );
      this.router.navigate(['/login']);
    } catch (err: any) {
      await loadingOverlay.dismiss();
      this.loading = false;

      this.showToast(err?.message || 'Error al crear la cuenta');
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      position: 'bottom',
    });
    await toast.present();
  }
}
