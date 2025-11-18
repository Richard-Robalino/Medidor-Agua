import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';

export interface Reading {
  id: number;
  created_at: string;
  user_id: string;
  meter_value: number;
  observations: string | null;
  meter_photo_url: string;
  facade_photo_url: string;
  lat: number;
  lng: number;
}

export interface ReadingWithProfile extends Reading {
  profiles?: {
    email: string;
    role: string; // 'admin', 'medidor', etc.
  } | null;
}

@Injectable({
  providedIn: 'root'
})
export class ReadingsService {
  private supabase = inject(SupabaseService).client;
  private auth = inject(AuthService);

  private get userId(): string {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');
    return user.id;
  }

  // ================== IMÁGENES ==================
  async uploadImage(file: Blob, prefix: 'medidor' | 'fachada'): Promise<string> {
    const userId = this.userId;
    const fileName = `${prefix}_${Date.now()}.jpg`;
    const filePath = `${userId}/${fileName}`;

    const { data, error } = await this.supabase.storage
      .from('mediciones')
      .upload(filePath, file, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.error('Error al subir imagen', error);
      throw error;
    }

    const { data: publicData } = this.supabase.storage
      .from('mediciones')
      .getPublicUrl(data.path);

    return publicData.publicUrl;
  }

  // ================== CREAR LECTURA ==================
  async createReading(params: {
    meterValue: number;
    observations: string;
    lat: number;
    lng: number;
    meterPhotoUrl: string;
    facadePhotoUrl: string;
  }): Promise<void> {
    const userId = this.userId;

    const { error } = await this.supabase.from('readings').insert({
      user_id: userId,
      meter_value: params.meterValue,
      observations: params.observations,
      lat: params.lat,
      lng: params.lng,
      meter_photo_url: params.meterPhotoUrl,
      facade_photo_url: params.facadePhotoUrl
    });

    if (error) {
      console.error('Error al guardar lectura', error);
      throw error;
    }
  }

  // ================== MIS LECTURAS ==================
  async getMyReadings(): Promise<Reading[]> {
    const userId = this.userId;

    const { data, error } = await this.supabase
      .from('readings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al obtener mis lecturas', error);
      throw error;
    }

    return (data || []) as Reading[];
  }

  // ================== LECTURAS GLOBALES ==================
  /**
   * Si el usuario es ADMIN => devuelve TODAS las lecturas.
   * Si NO es admin        => devuelve solo las lecturas de ese usuario.
   */
 async getAllReadings(): Promise<ReadingWithProfile[]> {
  // Pedimos TODAS las lecturas con el perfil del usuario que la registró
  const { data, error } = await this.supabase
    .from('readings')
    .select(`
      id,
      created_at,
      user_id,
      meter_value,
      observations,
      meter_photo_url,
      facade_photo_url,
      lat,
      lng,
      profiles ( email, role )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al obtener todas las lecturas', error);
    throw error;
  }

  const rows = (data || []) as any[];

  // Mapeamos el resultado para que coincida con ReadingWithProfile
  const mapped: ReadingWithProfile[] = rows.map((row) => {
    let profileObj: { email: string; role: string } | null = null;

    if (Array.isArray(row.profiles) && row.profiles.length > 0) {
      const first = row.profiles[0];
      profileObj = {
        email: String(first.email),
        role: String(first.role),
      };
    } else if (row.profiles) {
      profileObj = {
        email: String(row.profiles.email),
        role: String(row.profiles.role),
      };
    }

    return {
      id: row.id,
      created_at: row.created_at,
      user_id: row.user_id,
      meter_value: row.meter_value,
      observations: row.observations,
      meter_photo_url: row.meter_photo_url,
      facade_photo_url: row.facade_photo_url,
      lat: row.lat,
      lng: row.lng,
      profiles: profileObj,
    };
  });

  return mapped;
}


  // ================== GOOGLE MAPS ==================
  getGoogleMapsLink(reading: Reading): string {
    return `https://www.google.com/maps?q=${reading.lat},${reading.lng}`;
  }
}
