import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, LoadingController } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router'; import { AuthService } from '../../../services/auth.service';
@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class LoginPage {
  form: FormGroup; showPassword = false;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController) { this.form = this.fb.group({ email: ['', [Validators.required, Validators.email]], password: ['', [Validators.required]], }); } togglePassword() { this.showPassword = !this.showPassword; } async onSubmit() {
    if (this.form.invalid) { this.showToast('Completa tu correo y contraseña'); return; }
    const loading = await this.loadingCtrl.create({ message: 'Ingresando...' });
    await loading.present(); const { email, password } = this.form.value; try { await this.auth.signIn(email, password); await loading.dismiss(); this.router.navigate(['/dashboard']); } catch (err: any) { await loading.dismiss(); this.showToast(err?.message || 'Error al iniciar sesión'); }
  }
  goToRegister() { this.router.navigate(['/register']); }
  goToForgot() { this.router.navigate(['/forgot-password']); } private async showToast(message: string) { const t = await this.toastCtrl.create({ message, duration: 2500, position: 'bottom', }); await t.present(); }
}