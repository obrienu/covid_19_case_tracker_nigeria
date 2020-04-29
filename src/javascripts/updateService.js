/* eslint-disable no-undef */

const states = $('.states');
const date = $('#date');
const deaths = $('#deaths');
const discharged = $('#discharged');

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

function updateData() {
  $('#update-existing').on('click', (e) => {
    e.preventDefault();
    const data = getData();
    const update = new Update(api);
    update.updateData(data);
  });
}

function postData() {
  $('#new-update').on('click', (e) => {
    e.preventDefault();
    const data = getData();
    const update = new Update(api);
    update.postNewData(data);
  });
}

function updatePageController() {
  postData();
  updateData();
}

export default updatePageController;
