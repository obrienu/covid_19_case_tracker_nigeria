/* eslint-disable no-undef */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
class Update {
  constructor(url) {
    this.url = url;
    this.handleSuccessDisplay = this.handleSuccessDisplay.bind(this);
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

  hideErrorDisplay(msg) {
    $('.error').text(msg);
    $('.error').fadeIn();
    setTimeout(() => {
      $('.error').fadeOut();
    }, 5000);
  }

  handleSuccessDisplay(msg) {
    $('.success').text(msg);
    $('.success').fadeIn();
    setTimeout(() => {
      $('.success').fadeOut();
    }, 5000);
  }

  async postNewData(data) {
    const { headers } = this.getHeaderConfig();
    try {
      const res = await fetch(this.url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers,
      });
      const result = await res.json();
      if (result.err) {
        this.hideErrorDisplay(result.err);
        this.stopSpinner();
        return false;
      }
      this.handleSuccessDisplay(result);
      return true;
    } catch (err) {
      return this.hideErrorDisplay(err);
    }
  }

  async updateData(data) {
    const { headers } = this.getHeaderConfig();
    try {
      const res = await fetch(this.url, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers,
      });
      const result = await res.json();
      if (result.err) {
        this.hideErrorDisplay(result.err);
        this.stopSpinner();
        return false;
      }
      this.handleSuccessDisplay(result);
      return true;
    } catch (err) {
      return this.hideErrorDisplay(err);
    }
  }

  loader() {
    $('.spinner').fadeIn();
  }

  stopSpinner() {
    $('.spinner').fadeOut();
  }
}
