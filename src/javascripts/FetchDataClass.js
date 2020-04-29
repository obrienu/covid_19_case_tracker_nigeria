/* eslint-disable no-undef */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
class DataFetcher {
  constructor(api) {
    this.url = api;
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

export default DataFetcher;
