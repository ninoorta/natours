import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51JpqpJGiICqKg8GEPXeYyptV7TH6x4Lrg0Ml0jg3KvJK7wQcQp9vUFFPOEgHl2ctJuExJYjiZG28uy1NSuVgItQU00b2LL0rE1'
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    // http://127.0.0.1:3000/api/v1/users/login
    // {{URL}}api/v1/bookings/checkout-session/5c88fa8cf4afda39709c2951
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err);
  }
};
