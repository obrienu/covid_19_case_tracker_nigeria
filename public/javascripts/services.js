/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
// eslint-disable-next-line max-classes-per-file
class DataFetcher {
  constructor(url) {
    this.url = url;
    this.fetcher = this.fetcher.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  async fetcher(url) {
    const res = await fetch(url);
    return res.json();
  }

  getPresentData() {
    const url = `${this.url}present`;
    return this.fetcher(url);
  }
}

class Interface {
  constructor() {
    this.natCases = $('.nat-value');
    this.stateContainer = $('#home-state');
    this.generateStateHtml = this.generateStateHtml.bind(this);
  }

  populateNatStat(data) {
    const { cases, discharged, deaths } = data;
    this.natCases[0].innerText = cases;
    this.natCases[1].innerText = discharged;
    this.natCases[2].innerText = deaths;
  }

  populateStateStat(states) {
    let html = '';
    states.forEach((state) => {
      html += this.generateStateHtml(state);
    });
    this.stateContainer.html(html);
  }

  generateStateHtml({ state, cases }) {
    return `<div class="box-content state-cases">
    <span>${state}:</span> ${cases}<span></span>
  </div>`;
  }
}
