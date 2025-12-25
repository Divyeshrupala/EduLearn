import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { CourseCard } from '@/components/courses/CourseCard';
import { Course, CartItem } from '@/types/course';
import { coursesApi, cartApi, enrollmentsApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, BookOpen, Users, Award, TrendingUp } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { user } = useAuth();
  const { toast } = useToast();

  const categories = ['all', 'Web Development', 'Programming', 'Design', 'Data Science', 'Mobile Development', 'Marketing', 'Cloud Computing'];

  useEffect(() => {
    loadData();
  }, [user]);

  useEffect(() => {
    filterCourses();
  }, [courses, searchQuery, selectedCategory]);

  const loadData = async () => {
    try {
      const coursesData = await coursesApi.getAllCourses();
      setCourses(coursesData);

      if (user) {
        const [cartData, enrollmentsData] = await Promise.all([
          cartApi.getCartItems(user.id),
          enrollmentsApi.getUserEnrollments(user.id)
        ]);
        setCartItems(cartData);
        setEnrolledCourseIds(new Set(enrollmentsData.map(e => e.course_id)));
      }
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load courses',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
  };

  const handleAddToCart = async (courseId: string) => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to add courses to cart',
        variant: 'destructive',
      });
      return;
    }

    try {
      await cartApi.addToCart(user.id, courseId);
      const updatedCart = await cartApi.getCartItems(user.id);
      setCartItems(updatedCart);
      toast({
        title: 'Added to Cart',
        description: 'Course has been added to your cart',
      });
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add course to cart',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-xl text-gray-600">Loading courses...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navbar />

      {/* Hero Section */}
      <div className="gradient-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Learn Without Limits
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Discover world-class courses from expert instructors. Start your learning journey today.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <BookOpen className="w-8 h-8 mx-auto mb-2" />
                <div className="text-3xl font-bold">{courses.length}+</div>
                <div className="text-purple-100">Courses</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <Users className="w-8 h-8 mx-auto mb-2" />
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-purple-100">Students</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <Award className="w-8 h-8 mx-auto mb-2" />
                <div className="text-3xl font-bold">100+</div>
                <div className="text-purple-100">Instructors</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                <div className="text-3xl font-bold">95%</div>
                <div className="text-purple-100">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="glass rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <div className="flex items-center space-x-2 overflow-x-auto">
              <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? 'gradient-primary text-white' : ''}
                >
                  {category === 'all' ? 'All' : category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                onAddToCart={handleAddToCart}
                isEnrolled={enrolledCourseIds.has(course.id)}
                isInCart={cartItems.some(item => item.course_id === course.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
