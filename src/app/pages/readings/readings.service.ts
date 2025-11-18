// readings.service.ts
import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ReadingsService {
  private supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
  private readonly bucketName = 'imagenes'; // 👈 nombre EXACTO del bucket en Supabase

  async uploadImage(
    userId: string,
    file: Blob,
    type: 'medidor' | 'fachada'
  ): Promise<string> {
    const fileName = `${type}_${Date.now()}.jpg`;
    const filePath = `${userId}/${fileName}`;

    const { data, error } = await this.supabase
      .storage
      .from(this.bucketName)
      .upload(filePath, file, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (error) {
      console.error('Error al subir imagen', error);
      throw error;
    }

    const {
      data: { publicUrl },
    } = this.supabase.storage.from(this.bucketName).getPublicUrl(filePath);

    return publicUrl;
  }
}
