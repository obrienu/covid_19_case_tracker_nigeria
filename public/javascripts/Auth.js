/* eslint-disable class-methods-use-this */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
class Auth {
  constructor(url) {
    this.url = url;
    this.fetcher = this.fetcher.bind(this);
    this.hideErrorDisplay = this.hideErrorDisplay.bind(this);
    this.getHeaderConfig = this.getHeaderConfig.bind(this);
    this.postData = this.postData.bind(this);
    this.setUser = this.setUser.bind(this);
    this.stopSpinner = this.stopSpinner.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  async fetcher(url) {
    const res = await fetch(url);
    return res.json();
  }

  getHeaderConfig() {
    // getToken from state
    const token = localStorage.getItem('token');
    // Header
    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };

    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  }

  setUser({ token, user }) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  }

  async postData(url, data) {
    const { headers } = this.getHeaderConfig();
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers,
    });
    const info = await res.json();
    if (!res.ok) throw new Error(info);
    return info;
  }

  hideErrorDisplay(msg) {
    $('.error').text(msg);
    $('.error').fadeIn();
    setTimeout(() => {
      $('.error').fadeOut();
    }, 5000);
  }

  validateLoginInputs(email, password) {
    if (typeof email !== 'string') {
      this.hideErrorDisplay('Invalid email');
      return false;
    }
    if (typeof password !== 'string') {
      this.hideErrorDisplay('Invalid password');
      return false;
    }
    return true;
  }

  loginUser(email, password) {
    const data = { email, password };
    const { headers } = this.getHeaderConfig();
    return fetch(this.url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers,
    }).then((res) => res.json())
      .then((user) => {
        if (user.err) {
          this.hideErrorDisplay(user.err);
          this.stopSpinner();
          return false;
        }
        this.setUser(user);
        return true;
      }).catch((err) => {
        this.hideErrorDisplay(err);
      });
  }


  validateRegisterInputs(name, email, password, cpassword, adminCode) {
    if (!email || !name || !adminCode || !password || !cpassword) {
      this.hideErrorDisplay('Input all fields');
      return false;
    }
    if (password !== cpassword) {
      this.hideErrorDisplay('Password and Cpassword must be the same');
      return false;
    }
    if (typeof email !== 'string') {
      this.hideErrorDisplay('Invalid email');
      return false;
    }
    if (typeof password !== 'string') {
      this.hideErrorDisplay('Invalid password');
      return false;
    }
    if (typeof name !== 'string') {
      this.hideErrorDisplay('Invalid name');
      return false;
    }
    return true;
  }

  registerUser(name, email, password, cpassword, adminCode) {
    const data = {
      name, email, password, cpassword, adminCode,
    };
    const { headers } = this.getHeaderConfig();
    return fetch(this.url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers,
    }).then((res) => res.json())
      .then((user) => {
        if (user.err) {
          this.hideErrorDisplay(user.err);
          return false;
        }
        this.setUser(user);
        return true;
      }).catch((err) => {
        this.hideErrorDisplay(err);
      });
  }


  async logOutUser() {
    localStorage.clear('user');
  }

  loader() {
    $('.spinner').fadeIn();
  }

  stopSpinner() {
    $('.spinner').fadeOut();
  }
}
