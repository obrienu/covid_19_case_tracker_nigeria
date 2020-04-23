/* eslint-disable no-undef */
$(document).ready(() => {
  const url = 'https://nigeria-covid19-api.herokuapp.com/api/v1/nigeria/covid-19/';

  const dataService = new DataFetcher(url);
  const displayService = new Interface();

  const handleHomePageData = async () => {
    const { nationalCases, states } = await dataService.getPresentData();
    displayService.populateNatStat(nationalCases);
    displayService.populateStateStat(states);
  };
  if (window.location.pathname === '/') {
    handleHomePageData();
  }
});
