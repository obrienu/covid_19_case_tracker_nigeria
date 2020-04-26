/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */
$(document).ready(() => {
  //  const url = 'https://nigeria-covid19-api.herokuapp.com/api/v1/nigeria/covid-19/';
  const url = 'http://localhost:3000/api/v1/nigeria/covid-19/';

  const dataService = new DataFetcher(url);
  const displayService = new Interface();

  const handleHomePageData = async () => {
    const { nationalCases, states } = await dataService.getData('present');
    displayService.populateNatStat(nationalCases);
    displayService.populateStateStat(states);
  };
  if (window.location.pathname === '/') {
    handleHomePageData();
  }

  const fetchPageData = async (page, type) => {
    let query;
    let groupQuery;
    let data;
    let region;
    switch (page) {
      case 'national':
        if (type === 'range') {
          const from = $('#nat-stat-from').val();
          const to = $('#nat-stat-to').val();
          query = `national?accumulate=true&from=${from}&to=${to}`;
          groupQuery = `national?accumulate=false&from=${from}&to=${to}`;
        } else if (type === 'date') {
          const date = $('#nat-stat-date').val();
          query = `national?accumulate=true&date=${date}`;
          groupQuery = `national?accumulate=false&from=2020-01-01&to=${date}`;
        }
        data = await dataService.getData(query);
        groupData = await dataService.getData(groupQuery);
        return { data, groupData };

      case 'regional':
        region = $('#reg-name').val();
        if (type === 'range') {
          const from = $('#reg-stat-from').val();
          const to = $('#reg-stat-to').val();
          query = `region/${region}?accumulate=true&from=${from}&to=${to}`;
          groupQuery = `region/${region}?accumulate=false&from=${from}&to=${to}`;
        } else if (type === 'date') {
          const date = $('#reg-stat-date').val();
          query = `region/${region}?accumulate=true&date=${date}`;
          groupQuery = `region/${region}?accumulate=false&from=2020-01-01&to=${date}`;
        }
        data = await dataService.getData(query);
        groupData = await dataService.getData(groupQuery);
        return { data, groupData };

      case 'state':
        region = $('#state-name').val();
        if (type === 'range') {
          const from = $('#state-stat-from').val();
          const to = $('#state-stat-to').val();
          query = `state/${region}?accumulate=true&from=${from}&to=${to}`;
          groupQuery = `state/${region}?accumulate=false&from=${from}&to=${to}`;
        } else if (type === 'date') {
          const date = $('#state-stat-date').val();
          query = `state/${region}?accumulate=true&date=${date}`;
          groupQuery = `state/${region}?accumulate=false&from=2020-01-01&to=${date}`;
        }
        data = await dataService.getData(query);
        groupData = await dataService.getData(groupQuery);
        return { data, groupData };
      default:
        return null;
    }
  };

  function hideOpenReport(page) {
    switch (page) {
      case 'national':
        $('#national-stat').fadeOut();
        $('#nat-chart').html('');
        break;
      case 'regional':
        $('#regional-stat').fadeOut();
        $('#reg-chart').html('');
        break;
      case 'state':
        $('#state-stat').fadeOut();
        $('#state-chart').html('');
        break;
      default:
    }
  }

  function handleDataDisplay(result, page) {
    const { data, groupData } = result;
    if (data.length > 0) {
      displayService.populateStat(data[0], page);
      const d3Data = dataService.d3FormatData(groupData);
      displayService.generateChart(d3Data, page);
    } else {
      hideOpenReport(page);
      displayService.handleErrorDisplay('No Data Found');
    }
  }

  /* NAT PAGE */
  const natForm = $('#national-form');
  natForm.on('submit', async function (e) {
    e.preventDefault();
    const dataType = $('#nat-search-type').val();
    const page = 'national';
    const result = await fetchPageData(page, dataType);
    handleDataDisplay(result, page);
  });

  const regionalForm = $('#regional-form');
  regionalForm.on('submit', async function (e) {
    e.preventDefault();
    const dataType = $('#reg-search-type').val();
    const page = 'regional';
    const result = await fetchPageData(page, dataType);
    handleDataDisplay(result, page);
  });

  const stateForm = $('#state-form');
  stateForm.on('submit', async function (e) {
    e.preventDefault();
    const dataType = $('#state-search-type').val();
    const page = 'state';
    const result = await fetchPageData(page, dataType);
    handleDataDisplay(result, page);
  });
});
