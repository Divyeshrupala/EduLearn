import React from 'react';
import { Course } from '@/types/course';
import { Button } from '@/components/ui/button';
import { Clock, BarChart3, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CourseCardProps {
  course: Course;
  onAddToCart?: (courseId: string) => void;
  isEnrolled?: boolean;
  isInCart?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  onAddToCart,
  isEnrolled = false,
  isInCart = false 
}) => {
  const navigate = useNavigate();

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-700';
      case 'intermediate':
        return 'bg-blue-100 text-blue-700';
      case 'advanced':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        {course.thumbnail_url ? (
          <img 
            src={course.thumbnail_url} 
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center gradient-primary">
            <span className="text-white text-4xl font-bold">
              {course.title.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(course.level)}`}>
            {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-3">
          <span className="text-xs font-semibold text-primary uppercase tracking-wide">
            {course.category}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>

        <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <BarChart3 className="w-4 h-4" />
            <span>{course.level}</span>
          </div>
        </div>

        <div className="text-sm text-gray-600 mb-4">
          By <span className="font-semibold text-gray-900">{course.instructor}</span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="text-2xl font-bold text-gray-900">${course.price}</span>
          </div>
          
          {isEnrolled ? (
            <Button 
              onClick={() => navigate(`/course/${course.id}`)}
              className="gradient-primary text-white"
            >
              Continue Learning
            </Button>
          ) : (
            <Button
              onClick={() => {
                if (onAddToCart) onAddToCart(course.id);
              }}
              disabled={isInCart}
              variant={isInCart ? 'outline' : 'default'}
              className={isInCart ? '' : 'gradient-primary text-white'}
            >
              {isInCart ? (
                'In Cart'
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
