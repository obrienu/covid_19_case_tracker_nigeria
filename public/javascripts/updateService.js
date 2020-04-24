/* eslint-disable no-undef */
$(document).ready(() => {
  const states = $('.states');
  const date = $('#date');
  const deaths = $('#deaths');
  const discharged = $('#discharged');
  //  const url = 'https://nigeria-covid19-api.herokuapp.com/api/v1/nigeria/covid-19/';
  const url = 'http://localhost:3000/api/v1/nigeria/covid-19/';

  const getData = () => {
    const obj = {};
    $.each(states, (_index, value) => {
      if (value.id === 'Cross') {
        obj['Cross River'] = Number.parseInt(value.value, 10);
      } else if (value.id === 'Akwa') {
        obj['Akwa Ibom'] = Number.parseInt(value.value, 10);
      } else {
        obj[value.id] = Number.parseInt(value.value, 10);
      }
    });
    obj.date = date.val();
    obj.discharged = discharged.val();
    obj.deaths = deaths.val();
    return obj;
  };

  $('#new-update').on('click', (e) => {
    e.preventDefault();
    const data = getData();
    const update = new Update(url);
    update.postNewData(data);
  });

  $('#update-existing').on('click', (e) => {
    e.preventDefault();
    const data = getData();
    const update = new Update(url);
    update.updateData(data);
  });
});
