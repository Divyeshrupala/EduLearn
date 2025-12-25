import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { cartApi, enrollmentsApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, ArrowRight } from 'lucide-react';

export function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadCart();
  }, [user]);

  const loadCart = async () => {
    if (!user) return;
    
    try {
      const items = await cartApi.getCartItems(user.id);
      setCartItems(items);
    } catch (error) {
      console.error('Error loading cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to load cart',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await cartApi.removeFromCart(itemId);
      setCartItems(cartItems.filter(item => item.id !== itemId));
      toast({
        title: 'Removed',
        description: 'Course removed from cart',
      });
    } catch (error) {
      console.error('Error removing item:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove course',
        variant: 'destructive',
      });
    }
  };

  const handleCheckout = async () => {
    if (!user || cartItems.length === 0) return;
    
    setProcessing(true);
    try {
      for (const item of cartItems) {
        await enrollmentsApi.enrollInCourse(user.id, item.course_id);
      }
      
      await cartApi.clearCart(user.id);
      
      toast({
        title: 'Success!',
        description: `You've enrolled in ${cartItems.length} course(s)`,
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during checkout:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete purchase',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + (item.course?.price || 0);
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-xl text-gray-600">Loading cart...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">{cartItems.length} course(s) in your cart</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center">
            <ShoppingCart className="w-20 h-20 mx-auto mb-6 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Start adding courses to your cart to begin learning</p>
            <Button 
              onClick={() => navigate('/')}
              className="gradient-primary text-white"
            >
              Browse Courses
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="glass rounded-2xl p-6 flex gap-6">
                  <div className="w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gray-200">
                    {item.course?.thumbnail_url ? (
                      <img 
                        src={item.course.thumbnail_url} 
                        alt={item.course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center gradient-primary">
                        <span className="text-white text-3xl font-bold">
                          {item.course?.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {item.course?.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          By {item.course?.instructor}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-semibold">
                          {item.course?.level}
                        </span>
                        <span>{item.course?.duration}</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        ${item.course?.price}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="glass rounded-2xl p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Discount</span>
                    <span className="text-green-600">-$0.00</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-3xl font-bold text-gray-900">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={processing}
                  className="w-full h-12 gradient-primary text-white text-lg font-semibold group"
                >
                  {processing ? (
                    'Processing...'
                  ) : (
                    <>
                      Checkout
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  30-day money-back guarantee
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
