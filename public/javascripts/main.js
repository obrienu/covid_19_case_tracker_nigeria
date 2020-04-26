/* eslint-disable consistent-return */
/* eslint-disable no-undef */
$(document).ready(() => {
  const menuBtn = $('.menu-btn');
  const menu = $('#nav');
  let menuIsOpen = false;

  const handleMenu = () => {
    menuBtn.toggleClass('close');
    if (menuIsOpen) {
      menu.css('height', '3.5rem');
      menuIsOpen = false;
    } else {
      menu.css('height', '13.5rem');
      menuIsOpen = true;
    }
  };
  menuBtn.on('click', handleMenu);

  /* ******TOGGLE PAGES********* */
  const pageMenu = $('.stat-link');
  const nationalPage = $('#national-page');
  const regionalPage = $('#regional-page');
  const statePage = $('#state-page');
  const pages = $('.pages');

  function togglePage(id) {
    pages.fadeOut();
    switch (id) {
      case 'national':
        nationalPage.fadeIn();
        nationalPage.css('display', 'grid');
        break;
      case 'regional':
        regionalPage.fadeIn();
        regionalPage.css('display', 'grid');
        break;
      case 'state':
        statePage.fadeIn();
        statePage.css('display', 'grid');
        break;
      default:
        return null;
    }
  }

  /* STATE PAGE BASIC FUNCTIONS */

  function togglePageMenu() {
    pageMenu.removeClass('active-page');
    $(this).addClass('active-page');
    const element = $(this);
    togglePage(element[0].id);
  }

  function showDataType(type, date, range) {
    date.children('input').prop('required', false);
    range.children('div').children('input').prop('required', false);
    date.css('display', 'none');
    range.css('display', 'none');
    switch (type) {
      case 'date':
        date.fadeIn();
        date.children('input').prop('required', true);
        date.css('display', 'grid');
        break;
      case 'range':
        range.fadeIn();
        range.children('div').children('input').prop('required', true);
        break;
      default:
        return null;
    }
  }

  const natSearchType = $('#nat-search-type');
  const natDateDisplay = $('#nat-date');
  const natRangeDisplay = $('#nat-range');
  const natButton = $('#nat-btn');
  const natReport = $('#national-stat');
  const natChart = $('#nat-chart');

  const regSearchType = $('#reg-search-type');
  const regDateDisplay = $('#reg-date');
  const regRangeDisplay = $('#reg-range');
  const regButton = $('#reg-btn');
  const regSelector = $('#reg-name');
  const regHeader = $('#reg-header');
  const regReport = $('#regional-stat');
  const regChart = $('#reg-chart');

  const stateSearchType = $('#state-search-type');
  const stateDateDisplay = $('#state-date');
  const stateRangeDisplay = $('#state-range');
  const stateButton = $('#state-btn');
  const stateSelector = $('#state-name');
  const stateHeader = $('#state-header');
  const stateReport = $('#state-stat');
  const stateChart = $('#state-chart');

  function toggleNatSelector() {
    natSearchType.on('change', function () {
      natReport.fadeOut();
      natChart.html('');
      natButton.fadeIn();
      const type = $(this).val();
      showDataType(type, natDateDisplay, natRangeDisplay);
    });

    regSelector.on('change', function () {
      regHeader.text($(this).val());
      regReport.fadeOut();
      regChart.html('');
    });

    regSearchType.on('change', function () {
      regButton.fadeIn();
      regReport.fadeOut();
      regChart.html('');
      const type = $(this).val();
      showDataType(type, regDateDisplay, regRangeDisplay);
    });

    stateSelector.on('change', function () {
      stateReport.fadeOut();
      stateChart.html('');
      stateHeader.text($(this).val());
    });

    stateSearchType.on('change', function () {
      stateReport.fadeOut();
      stateChart.html('');
      stateButton.fadeIn();
      const type = $(this).val();
      showDataType(type, stateDateDisplay, stateRangeDisplay);
    });
  }

  toggleNatSelector();
  pageMenu.on('click', togglePageMenu);
});
