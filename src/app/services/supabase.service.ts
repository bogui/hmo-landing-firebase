import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import type { Database } from '../types/supabase.types';

/**
 * Service for interacting with Supabase
 * Provides a singleton Supabase client instance
 */
@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private readonly platformId = inject(PLATFORM_ID);
  private _client: SupabaseClient<Database> | null = null;

  /**
   * Get or create the Supabase client instance
   * Only creates the client in browser context
   */
  get client(): SupabaseClient<Database> {
    if (!this._client && isPlatformBrowser(this.platformId)) {
      const { url, anonKey } = environment.supabase;

      if (!url || !anonKey) {
        throw new Error('Supabase URL and anon key must be provided in environment configuration');
      }

      this._client = createClient(url, anonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        },
      });
    }

    if (!this._client) {
      throw new Error('Supabase client is only available in browser context');
    }

    return this._client;
  }

  /**
   * Check if Supabase is available in the current context
   */
  get isAvailable(): boolean {
    return (
      isPlatformBrowser(this.platformId) &&
      !!environment.supabase.url &&
      !!environment.supabase.anonKey
    );
  }
}
