import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './PaymentForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripeContainer = ({ invoice, onSuccess, onCancel }) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm invoice={invoice} onSuccess={onSuccess} onCancel={onCancel} />
    </Elements>
  );
};

export default StripeContainer;
