const content = document.querySelector('.js-callendar');
// const popUpCar = document.querySelector('.form-event');
const submitEvent = document.querySelector('#btn-submit-event');
let dataCar = document.querySelectorAll('.imput-event');

function sendForm(data, url) {
  let params = new URLSearchParams();
  data.forEach((element, index) => {
    params.append(element.name, data[index].value);
  });
  fetch(`${url}`, {
    method: 'POST',
    body: params.toString()
  })
}

function generateCalendarHead(list) {
  const days = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat'
  ]
  for (let i = 0; i <= 6; i++) {
    const day = document.createElement('li');
    day.setAttribute('class', 'name-day');
    day.innerHTML = `${days[i]}`
    list.appendChild(day);
  }
}

function generateMonth() {
  let date = new Date();
  let month = date.getMonth();
  return month;
}

function generateYear() {
  let date = new Date();
  let year = date.getFullYear();
  return year;
}

function setFirstDay(year, month) {
  let date = new Date(year,month);
  const firstDay = date.getDay();
  return firstDay;
}

function generateCalendar(year, month) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
    ];
  if (!month) {month = generateMonth()};
  if (!year) {year = generateYear()};

  const title = document.createElement('h1');
  const list = document.createElement('ul');
  const firstDay = setFirstDay(year, month);
  let day = 1;

  list.setAttribute('class', 'calendar');
  title.setAttribute('class', 'tile');
  title.innerHTML = `${year}-${months[month]}`;
  
  generateCalendarHead(list);

  for (let i = 1; i < 36; i++) {
    const item = document.createElement('li');
    if(i >= firstDay) {
      const date = new Date(year,month,day);
      const thisMonth = date.getMonth();
      if (thisMonth == month) {
        const formatDate = date.toLocaleDateString('es-CR', { timeZone: 'UTC' });
        item.setAttribute('data-date', `${formatDate}`);
        item.innerHTML = `${day}`;
        day++; 
      } 
      item.setAttribute('class', 'item');
    } else {
      item.setAttribute('class', 'day-empty');
    }
    list.appendChild(item);
  }

  content.appendChild(title);
  content.appendChild(list);
}

function generateDate() {
  let date = new Date();
  date = date.toLocaleDateString('es-CR', { timeZone: 'UTC' });
  return date;
}

// function renderEvents(data) {
//   const list = document.createElement('ul');
//   list.setAttribute('class', 'events');
//   data.data.forEach((element, index) => {
//     const item = document.createElement('li');
//     const name = document.createElement('p');
//     const hour = document.createElement('p');
//     const btnDelete = document.createElement('button');
    
//     item.setAttribute('class', 'item');
//     item.setAttribute('id', `${index + 1}`);
//     name.setAttribute('class', 'item__name');
//     hour.setAttribute('class', 'item__hour');
//     btnDelete.setAttribute('class', 'delete-car');
    
//     name.innerHTML = `${element.name}`;
//     hour.innerHTML = `${element.hour}`;
//     btnDelete.innerHTML = 'Delete';

//     btnDelete.addEventListener('click' , () => {
//       fetch(`http://localhost:5000api/v1/events/:${index+1}`, {
//         method: 'DELETE'
//       })
//     });
    
//     item.appendChild(name);
//     item.appendChild(hour);
//     item.appendChild(btnDelete);
//     generateCalendarHead(list);
//     list.appendChild(item);
//   });
//   inventory.appendChild(list);
// }

function getJson(url, funct) {
  fetch(url)
    .then(data => {
      return data.json()
    })
    .then((data) => {
      if (typeof funct === 'function') {
        funct(data);
      } 
    });
}

submitEvent.addEventListener('click', (e)=> {
  e.preventDefault();
  sendForm(dataCar, 'http://localhost:5000api/v1/events');
});

window.onload = function() {
  generateCalendar();
  // getJson('http://localhost:5000/api/v1/events', renderEvents);
};
