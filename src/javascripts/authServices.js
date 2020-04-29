/* eslint-disable no-undef */
import Auth from './AuthClass';

const userApi = 'https://nigeria-covid19-api.herokuapp.com/user/';
// const userApi = 'http://localhost:3000/user/';

function loginFormController() {
  $('.login-form').on('submit', async (e) => {
    e.preventDefault();
    const password = $('#login-password').val();
    const email = $('#login-email').val();
    let isLoggedIn;
    const user = new Auth(`${userApi}login`);
    user.loader();
    const isValid = user.validateLoginInputs(email, password);
    if (isValid) {
      isLoggedIn = await user.loginUser(email, password);
    }
    if (isLoggedIn) {
      $('#login-password').val('');
      $('#login-email').val('');
      user.stopSpinner();
      //     window.location = 'http://localhost:3000/updates';
      window.location = 'https://nigeria-covid19-api.herokuapp.com/updates';
    }
  });
}

function regFormController() {
  $('.register-form').on('submit', async (e) => {
    e.preventDefault();
    const password = $('#register-password').val();
    const email = $('#register-email').val();
    const name = $('#register-name').val();
    const cpassword = $('#register-cpassword').val();
    const adminCode = $('#register-admin').val();
    let isRegistered;
    const user = new Auth(`${userApi}register`);
    user.loader();
    const isValid = user.validateRegisterInputs(name, email, password, cpassword, adminCode);
    if (isValid) {
      isRegistered = await user.registerUser(name, email, password, cpassword, adminCode);
    }
    if (isRegistered) {
      $('#register-password').val('');
      $('#register-email').val('');
      $('#register-cpassword').val('');
      $('#register-admin').val('');
      $('#register-name').val('');
      user.stopSpinner();
      // window.location = 'http://localhost:3000/updates';
      window.location = 'https://nigeria-covid19-api.herokuapp.com/updates';
    }
  });
}

function auththenicateUser() {
  loginFormController();
  regFormController();
}

export default auththenicateUser;
