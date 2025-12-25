import { supabase } from './supabase';
import { Course, Enrollment, CartItem } from '@/types/course';

export const coursesApi = {
  async getAllCourses(): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getCourseById(id: string): Promise<Course | null> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getCoursesByCategory(category: string): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },
};

export const enrollmentsApi = {
  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        course:courses(*)
      `)
      .eq('user_id', userId)
      .order('enrolled_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async checkEnrollment(userId: string, courseId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();
    
    return !!data && !error;
  },

  async enrollInCourse(userId: string, courseId: string): Promise<Enrollment> {
    const { data, error } = await supabase
      .from('enrollments')
      .insert({ user_id: userId, course_id: courseId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProgress(enrollmentId: string, progress: number): Promise<void> {
    const { error } = await supabase
      .from('enrollments')
      .update({ progress, completed: progress >= 100 })
      .eq('id', enrollmentId);
    
    if (error) throw error;
  },
};

export const cartApi = {
  async getCartItems(userId: string): Promise<CartItem[]> {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        course:courses(*)
      `)
      .eq('user_id', userId)
      .order('added_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async addToCart(userId: string, courseId: string): Promise<CartItem> {
    const { data, error } = await supabase
      .from('cart_items')
      .insert({ user_id: userId, course_id: courseId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async removeFromCart(cartItemId: string): Promise<void> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);
    
    if (error) throw error;
  },

  async clearCart(userId: string): Promise<void> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);
    
    if (error) throw error;
  },
};
