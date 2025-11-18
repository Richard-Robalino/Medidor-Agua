import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SupabaseService } from './supabase.service';

export type UserRole = 'admin' | 'medidor';

export interface AppUser {
  id: string;
  email: string;
  role: UserRole;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AppUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  // Para compatibilidad con el código que usa "profile$"
  profile$ = this.currentUser$;

  constructor(private supabase: SupabaseService) {
    this.restoreSession();
  }

  // ─────────────────────────────
  // Restaurar sesión al abrir la app
  // ─────────────────────────────
  private async restoreSession() {
    const { data } = await this.supabase.client.auth.getSession();
    if (data.session) {
      await this.fetchProfile();
    } else {
      this.currentUserSubject.next(null);
    }
  }

  // ─────────────────────────────
  // LOGIN (bloquea si NO está verificado)
  // ─────────────────────────────
  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const msg = (error.message || '').toLowerCase();

      if (msg.includes('email not confirmed') || msg.includes('confirm')) {
        throw new Error(
          'Tu cuenta aún no ha sido verificada. Revisa tu correo institucional y confirma la cuenta antes de iniciar sesión.'
        );
      }

      throw error;
    }

    const user = data.user ?? data.session?.user ?? null;
    if (user && !user.email_confirmed_at) {
      await this.supabase.client.auth.signOut();
      throw new Error(
        'Tu cuenta aún no ha sido verificada. Por favor confirma tu correo institucional antes de ingresar.'
      );
    }

    await this.fetchProfile();
  }

  // ─────────────────────────────
  // REGISTRO (rol MEDIDOR + correo de verificación)
  // ─────────────────────────────
  async signUpMedidor(email: string, password: string) {
    const { data, error } = await this.supabase.client.auth.signUp({
      email,
      password,
      options: {
        // ⚠️ Cambia esta URL por la de tu app en producción
        emailRedirectTo: 'http://localhost:8100/login',
        data: {
          role: 'medidor',
        },
      },
    });

    if (error) {
      throw error;
    }

    const user = data.user;

    // Crear perfil en tabla profiles
    if (user) {
      const { error: profileError } = await this.supabase.client
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          role: 'medidor',
        });

      // 23505 = clave duplicada → ignoramos
      if (profileError && profileError.code !== '23505') {
        console.error('Error al crear perfil', profileError);
        throw profileError;
      }
    }

    return data;
  }

  // ─────────────────────────────
  // RESET PASSWORD – NUEVO
  // ─────────────────────────────
  async sendResetPasswordEmail(email: string) {
    const { error } =
      await this.supabase.client.auth.resetPasswordForEmail(email, {
        // ⚠️ Ruta a donde Supabase redirige para cambiar contraseña
        redirectTo: 'http://localhost:8100/update-password',
      });

    if (error) {
      throw error;
    }
  }

  // Alias para compatibilidad con forgot-password.page.ts
  async requestPasswordReset(email: string) {
    return this.sendResetPasswordEmail(email);
  }

  // ─────────────────────────────
  // Actualizar contraseña (usado en UpdatePasswordPage)
  // ─────────────────────────────
  async updatePassword(newPassword: string) {
    const { data, error } = await this.supabase.client.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw error;
    }

    return data;
  }

  // ─────────────────────────────
  // Cargar perfil desde tabla profiles
  // ─────────────────────────────
  async fetchProfile() {
    const { data: userData, error: userError } =
      await this.supabase.client.auth.getUser();

    if (userError) {
      console.error('Error al obtener usuario', userError);
      this.currentUserSubject.next(null);
      return;
    }

    const user = userData.user;
    if (!user) {
      this.currentUserSubject.next(null);
      return;
    }

    const { data, error } = await this.supabase.client
      .from('profiles')
      .select('id, email, role')
      .eq('id', user.id)
      .maybeSingle(); // evita PGRST116 cuando no hay filas

    if (error) {
      console.error('Error al obtener perfil', error);
      this.currentUserSubject.next(null);
      return;
    }

    if (!data) {
      this.currentUserSubject.next(null);
      return;
    }

    this.currentUserSubject.next(data as AppUser);
  }

  // ─────────────────────────────
  // LOGOUT
  // ─────────────────────────────
  async logout() {
    await this.supabase.client.auth.signOut();
    this.currentUserSubject.next(null);
  }

  // Alias para compatibilidad con código viejo
  async signOut() {
    return this.logout();
  }

  // ─────────────────────────────
  // Helpers para guards
  // ─────────────────────────────
  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }

  get currentUser(): AppUser | null {
    return this.currentUserSubject.value;
  }
}
