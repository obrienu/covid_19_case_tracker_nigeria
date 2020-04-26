/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable no-restricted-globals */
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

  async getData(query) {
    const url = `${this.url + query}`;
    return this.fetcher(url);
  }

  d3FormatData(data) {
    const strictIsoParse = d3.utcParse('%Y-%m-%dT%H:%M:%S.%LZ');
    return data.map(({ cases, date }) => ({ value: cases, date: strictIsoParse(date) }));
  }
}

class Interface {
  constructor() {
    this.natCases = $('.nat-value');
    this.regionalCases = $('.reg-value');
    this.stateCases = $('.state-value');
    this.natReportSection = $('#national-stat');
    this.regReportSection = $('#regional-stat');
    this.stateReportSection = $('#state-stat');
    this.stateContainer = $('#home-state');
    this.errorDisplay = $('.error');
    this.generateStateHtml = this.generateStateHtml.bind(this);
    this.handleErrorDisplay = this.handleErrorDisplay.bind(this);
  }

  handleErrorDisplay(msg) {
    this.errorDisplay.text(msg);
    this.errorDisplay.fadeIn();
    setTimeout(() => {
      this.errorDisplay.fadeOut();
    }, 5000);
  }

  populateStat(data, page) {
    let stat;
    switch (page) {
      case 'national':
        this.natReportSection.fadeIn();
        stat = this.natCases;
        break;
      case 'regional':
        stat = this.regionalCases;
        this.regReportSection.fadeIn();
        break;
      case 'state':
        this.stateReportSection.fadeIn();
        stat = this.stateCases;
        break;
      default:
        return null;
    }
    const { cases, discharged, deaths } = data;
    stat[0].innerText = cases;
    if (page === 'national') {
      stat[1].innerText = discharged;
      stat[2].innerText = deaths;
    }
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

  generateChart(data, page) {
    const margin = ({
      top: 20, right: 30, bottom: 30, left: 40,
    });

    const height = 500;
    const width = 950;

    const x = d3.scaleUtc()
      .domain(d3.extent(data, (d) => d.date))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([d3.min(data, (d) => d.value), d3.max(data, (d) => d.value)]).nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3.line()
      .defined((d) => !isNaN(d.value))
      .x((d) => x(d.date))
      .y((d) => y(d.value));

    const xAxis = (g) => g
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

    const yAxis = (g) => g
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .call((g) => g.select('.domain').remove())
      .call((g) => g.select('.tick:last-of-type text').clone()
        .attr('x', 3)
        .attr('text-anchor', 'start')
        .attr('font-weight', 'bold')
        .text(data.y));

    let selector;
    switch (page) {
      case 'national':
        selector = '#nat-chart';
        break;
      case 'regional':
        selector = '#reg-chart';
        break;
      case 'state':
        selector = '#state-chart';
        break;
      default:
        return null;
    }
    document.querySelector(selector).innerHTML = '';
    const svg = d3.select(selector)
      .style('overflow-x', 'scroll')
      .style('-webkit-overflow-scrolling', 'touch')
      .append('svg')
      .attr('viewBox', [0, 0, width, height])
      .attr('class', 'svg');

    svg.append('g')
      .call(xAxis);

    svg.append('g')
      .call(yAxis);

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('d', line);
  }
}
