/* eslint-disable no-undef */
$(document).ready(() => {
  $('.login-form').on('submit', async (e) => {
    e.preventDefault();
    const password = $('#login-password').val();
    const email = $('#login-email').val();
    let isLoggedIn;
    const user = new Auth('http://localhost:3000/user/login');
    // const user = new Auth('https://nigeria-covid19-api.herokuapp.com/user/login');
    user.loader();
    const isValid = user.validateLoginInputs(email, password);
    if (isValid) {
      isLoggedIn = await user.loginUser(email, password);
    }
    if (isLoggedIn) {
      $('#login-password').val('');
      $('#login-email').val('');
      user.stopSpinner();
      window.location = 'http://localhost:3000/updates';
    //  window.location = 'https://nigeria-covid19-api.herokuapp.com/updates';
    }
  });

  $('.register-form').on('submit', async (e) => {
    e.preventDefault();
    const password = $('#register-password').val();
    const email = $('#register-email').val();
    const name = $('#register-name').val();
    const cpassword = $('#register-cpassword').val();
    const adminCode = $('#register-admin').val();
    let isRegistered;
    const user = new Auth('http://localhost:3000/user/register');
    //  const user = new Auth('https://nigeria-covid19-api.herokuapp.com/user/register');
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
      window.location = 'http://localhost:3000/updates';
    //      window.location = 'https://nigeria-covid19-api.herokuapp.com/updates';
    }
  });
});
