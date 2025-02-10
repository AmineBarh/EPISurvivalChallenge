import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Truck, ShoppingBag, CheckCircle } from 'lucide-react';
import type { CheckoutStep, ShippingDetails, PaymentDetails } from '../types';
import { useCartStore } from '../store/cartStore';

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
}

const steps: CheckoutStep[] = ['review', 'shipping', 'payment', 'confirmation'];

export const Checkout: React.FC<CheckoutProps> = ({ isOpen, onClose, total }) => {
  const [currentStep, setCurrentStep] = React.useState<CheckoutStep>('review');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const { items, clearCart } = useCartStore();
  const [shippingDetails, setShippingDetails] = React.useState<ShippingDetails>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [paymentDetails, setPaymentDetails] = React.useState<PaymentDetails>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setCurrentStep('confirmation');
    clearCart();
  };

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim();
  };

  const formatExpiryDate = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .slice(0, 5);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="fixed inset-x-0 bottom-0 h-[90vh] bg-white rounded-t-xl shadow-xl"
          >
            <div className="max-w-2xl mx-auto h-full p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Checkout</h2>
                <button onClick={onClose} className="text-gray-500">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex justify-between mb-8">
                {steps.map((step, index) => (
                  <div
                    key={step}
                    className={`flex items-center ${
                      index < steps.indexOf(currentStep)
                        ? 'text-green-700 font-semibold'
                        : index === steps.indexOf(currentStep)
                        ? 'text-pink-600'
                        : 'text-gray-400'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index <= steps.indexOf(currentStep)
                          ? 'bg-pink-600 text-white'
                          : 'bg-gray-200'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div
                      className={`hidden sm:block ml-2 capitalize ${
                        index === steps.indexOf(currentStep)
                          ? 'font-semibold'
                          : ''
                      }`}
                    >
                      {step}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-12 h-0.5 mx-2 ${
                          index < steps.indexOf(currentStep)
                            ? 'bg-pink-600'
                            : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto">
                {currentStep === 'review' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold mb-4">Order Review</h3>
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 border-b pb-4"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="w-16 h-16 object-contain bg-white p-2"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.product.title}</h4>
                          <p className="text-gray-600">
                            ${item.product.price.toFixed(2)} x {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setCurrentStep('shipping')}
                      className="w-full bg-pink-600 text-white py-3 rounded-lg mt-6 hover:bg-pink-700 transition-colors"
                    >
                      Continue to Shipping
                    </button>
                  </div>
                )}

                {currentStep === 'shipping' && (
                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                    <h3 className="text-lg font-semibold mb-4">
                      Shipping Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          First Name
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingDetails.firstName}
                          onChange={(e) =>
                            setShippingDetails({
                              ...shippingDetails,
                              firstName: e.target.value,
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Last Name
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingDetails.lastName}
                          onChange={(e) =>
                            setShippingDetails({
                              ...shippingDetails,
                              lastName: e.target.value,
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={shippingDetails.email}
                        onChange={(e) =>
                          setShippingDetails({
                            ...shippingDetails,
                            email: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingDetails.address}
                        onChange={(e) =>
                          setShippingDetails({
                            ...shippingDetails,
                            address: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingDetails.city}
                          onChange={(e) =>
                            setShippingDetails({
                              ...shippingDetails,
                              city: e.target.value,
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          State
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingDetails.state}
                          onChange={(e) =>
                            setShippingDetails({
                              ...shippingDetails,
                              state: e.target.value,
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingDetails.zipCode}
                          onChange={(e) =>
                            setShippingDetails({
                              ...shippingDetails,
                              zipCode: e.target.value,
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Country
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingDetails.country}
                          onChange={(e) =>
                            setShippingDetails({
                              ...shippingDetails,
                              country: e.target.value,
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-pink-600 text-white py-3 rounded-lg mt-6 hover:bg-pink-700 transition-colors"
                    >
                      Continue to Payment
                    </button>
                  </form>
                )}

                {currentStep === 'payment' && (
                  <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <h3 className="text-lg font-semibold mb-4">
                      Payment Details
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Card Number
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={19}
                        value={paymentDetails.cardNumber}
                        onChange={(e) =>
                          setPaymentDetails({
                            ...paymentDetails,
                            cardNumber: formatCardNumber(e.target.value),
                          })
                        }
                        placeholder="1234 5678 9012 3456"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Card Holder Name
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentDetails.cardHolder}
                        onChange={(e) =>
                          setPaymentDetails({
                            ...paymentDetails,
                            cardHolder: e.target.value,
                          })
                        }
                        placeholder="John Doe"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={5}
                          value={paymentDetails.expiryDate}
                          onChange={(e) =>
                            setPaymentDetails({
                              ...paymentDetails,
                              expiryDate: formatExpiryDate(e.target.value),
                            })
                          }
                          placeholder="MM/YY"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          CVV
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={3}
                          value={paymentDetails.cvv}
                          onChange={(e) =>
                            setPaymentDetails({
                              ...paymentDetails,
                              cvv: e.target.value.replace(/\D/g, ''),
                            })
                          }
                          placeholder="123"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full bg-pink-600 text-white py-3 rounded-lg mt-6 hover:bg-pink-700 transition-colors disabled:bg-pink-400"
                    >
                      {isProcessing ? 'Processing...' : 'Complete Purchase'}
                    </button>
                  </form>
                )}

                {currentStep === 'confirmation' && (
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4">
                      <CheckCircle className="w-full h-full text-green-700 font-semibold" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">
                      Order Confirmed!
                    </h3>
                    <p className="text-gray-600 mb-8">
                      Thank you for your purchase. We'll send you an email with your order details.
                    </p>
                    <button
                      onClick={onClose}
                      className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};