import axios from 'axios';
import { showAlert } from './alerts';
import { login } from './login';

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Signed up successfully');

      await login(email, password);
      location.assign('/');
      document.getElementById('btn-signup').disabled = false;
      document.getElementById('btn-signup').innerText = 'Sign up';
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
