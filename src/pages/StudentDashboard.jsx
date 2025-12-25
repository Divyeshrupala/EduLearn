import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { enrollmentsApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  TrendingUp, 
  Award, 
  Clock,
  PlayCircle,
  CheckCircle2
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export function StudentDashboard() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadEnrollments();
  }, [user]);

  const loadEnrollments = async () => {
    if (!user) return;
    
    try {
      const data = await enrollmentsApi.getUserEnrollments(user.id);
      setEnrollments(data);
    } catch (error) {
      console.error('Error loading enrollments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your courses',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const avgProgress = enrollments.length > 0
    ? enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length
    : 0;

  const completedCourses = enrollments.filter(e => e.completed).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-xl text-gray-600">Loading your courses...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Learning</h1>
          <p className="text-gray-600">Track your progress and continue learning</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{enrollments.length}</div>
                <div className="text-sm text-gray-600">Enrolled Courses</div>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{avgProgress.toFixed(0)}%</div>
                <div className="text-sm text-gray-600">Avg. Progress</div>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{completedCourses}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{enrollments.length - completedCourses}</div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
            </div>
          </div>
        </div>

        {enrollments.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center">
            <BookOpen className="w-20 h-20 mx-auto mb-6 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No courses enrolled yet</h2>
            <p className="text-gray-600 mb-8">Start your learning journey by enrolling in a course</p>
            <Button 
              onClick={() => navigate('/')}
              className="gradient-primary text-white"
            >
              Browse Courses
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Courses</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {enrollments.map(enrollment => (
                <div key={enrollment.id} className="glass rounded-2xl overflow-hidden hover:shadow-xl transition-all">
                  <div className="flex">
                    <div className="w-48 h-48 flex-shrink-0 bg-gray-200">
                      {enrollment.course?.thumbnail_url ? (
                        <img 
                          src={enrollment.course.thumbnail_url} 
                          alt={enrollment.course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center gradient-primary">
                          <span className="text-white text-4xl font-bold">
                            {enrollment.course?.title.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">
                            {enrollment.course?.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            By {enrollment.course?.instructor}
                          </p>
                        </div>
                        {enrollment.completed && (
                          <div className="flex-shrink-0 ml-2">
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                          </div>
                        )}
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-semibold text-gray-900">
                            {enrollment.progress}%
                          </span>
                        </div>
                        <Progress value={enrollment.progress} className="h-2" />
                      </div>

                      <Button
                        className="w-full gradient-primary text-white group"
                      >
                        <PlayCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                        {enrollment.completed ? 'Review Course' : 'Continue Learning'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
