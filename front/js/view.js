const inventory = document.querySelector('.js-inventory');
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
  if (!month) {generateMonth()};
  if (!month) {generateYear()};

  const list = document.createElement('ul');
  list.setAttribute('class', 'calendar');
  for (let i = 1; i <= 36; i++) {
    let date = new Date(year,month,i);
    const thisMonth = date.getMonth();
    if (thisMonth == month) {
      const item = document.createElement('li');
      date = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
      console.log(date);
    }
  }
}

function generateDate() {
  let date = new Date();
  date = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
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
  generateCalendar(2019, 1);
  // getJson('http://localhost:5000/api/v1/events', renderEvents);
};
