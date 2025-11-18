export const environment = {
  production: false,
  supabaseUrl: 'https://hfytimjeyxbhwvkjxdut.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmeXRpbWpleXhiaHd2a2p4ZHV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3OTg4NDcsImV4cCI6MjA3ODM3NDg0N30.MfzSxtSlN4fLiulSas23YrNwCC2bR7dKVDLsNA3vfnU',
  redirectUrls: {
    emailConfirm: 'http://localhost:8100/login',          // después de confirmar correo
    resetPassword: 'http://localhost:8100/update-password' // después de link "reset password"
  }
};
