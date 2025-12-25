import { supabase } from './supabase';

export const authService = {
  mapUser(user) {
    return {
      id: user.id,
      email: user.email,
      username: user.user_metadata?.username || user.user_metadata?.full_name || user.email.split('@')[0],
    };
  },

  async sendOtp(email) {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    if (error) throw error;
  },

  async verifyOtpAndSetPassword(email, token, password, username) {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });
    if (error) throw error;

    const { data: updateData, error: updateError } = await supabase.auth.updateUser({
      password,
      data: { username },
    });
    if (updateError) throw updateError;
    
    return updateData.user;
  },

  async signInWithPassword(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data.user;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
};
