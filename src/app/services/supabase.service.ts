import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

// Función "no-op" para desactivar el uso de navigator.locks
const noLock = async <R>(
  _name: string,
  _acquireTimeout: number,
  fn: () => Promise<R>
): Promise<R> => {
  // simplemente ejecuta la función sin ningún locking
  return await fn();
};

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storageKey: 'lecturas-agua-auth',
          // 👇 esto reemplaza al multiTab y al lock: false
          lock: noLock,
        },
      }
    );
  }

  get client(): SupabaseClient {
    return this.supabase;
  }
}
