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
    role: string; // o 'admin' | 'medidor' si quieres tiparlo más
  };
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

  async getAllReadings(): Promise<ReadingWithProfile[]> {
    const { data, error } = await this.supabase
      .from('readings')
      .select('*, profiles(email, role)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al obtener todas las lecturas', error);
      throw error;
    }

    return (data || []) as ReadingWithProfile[];
  }

  getGoogleMapsLink(reading: Reading): string {
    return `https://www.google.com/maps?q=${reading.lat},${reading.lng}`;
  }
}
