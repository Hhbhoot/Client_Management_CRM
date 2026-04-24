import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BASE_API_URL } from '../api';

const PaymentForm = ({ invoice, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      const token = localStorage.getItem('token');

      // 1. Create Payment Intent on backend
      const {
        data: { clientSecret },
      } = await axios.post(
        `${BASE_API_URL}/api/payments/create-intent`,
        { invoiceId: invoice._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2. Confirm payment on frontend
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: invoice.clientId?.name || 'Customer',
            email: invoice.clientId?.email || '',
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message);
        setIsProcessing(false);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          // 3. Confirm with backend to update status
          await axios.post(
            `${BASE_API_URL}/api/payments/confirm`,
            {
              invoiceId: invoice._id,
              paymentIntentId: result.paymentIntent.id,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          toast.success('Payment successful!');
          onSuccess();
        }
      }
    } catch (error) {
      console.error('Payment Error:', error);
      toast.error(error.response?.data?.message || 'Payment failed');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-6 bg-gray-950 border border-gray-800 rounded-2xl shadow-inner">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#f3f4f6',
                fontFamily: 'Inter, system-ui, sans-serif',
                '::placeholder': {
                  color: '#9ca3af',
                },
              },
              invalid: {
                color: '#ef4444',
              },
            },
          }}
        />
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1 px-6 py-4 rounded-2xl border border-gray-800 text-gray-400 font-bold hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-2 bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            `Pay $${invoice.totalAmount.toLocaleString()}`
          )}
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;
