const key = 'eseJ0OR902adRqqo27AMVPh8Es40a1AA';

// grt weather information
const getWeather = async (id) => {
  const base = 'http://dataservice.accuweather.com/currentconditions/v1/';
  const query = `${id}?apikey=${key}`;
  const res = await fetch(base + query);
  const data = await res.json();
  return data[0];
};

// get city information
const getCity = async (city) => {
  const base = 'http://dataservice.accuweather.com/locations/v1/cities/search';
  const query = `?apikey=${key}&q=${city}`;
  const res = await fetch(base + query);
  const data = await res.json();
  return data[0];
};

// dom manupulation
const card = document.querySelector('.card');
const details = document.querySelector('.details');
const cityForm = document.querySelector('form');
const image = document.querySelector('.card img');
const icon = document.querySelector('.icon img');

const getCityData = async (city) => {
  const cityData = await getCity(city);
  const weatherData = await getWeather(cityData.Key);

  return {
    cityData,
    weatherData,
  };
};

const updateUI = (data) => {
  console.log(data);

  const { cityData, weatherData } = data;

  // update details template
  details.innerHTML = `
     <h5 class="my-3">${cityData.EnglishName}</h5>
      <div class="my-3">${weatherData.WeatherText}</div>
      <div class="display-4 my-4">
        <span>${weatherData.Temperature.Metric.Value}</span>
        <span>&deg;C</span>
      </div>
  `;
  if (card.classList.contains('d-none')) {
    card.classList.remove('d-none');
  }
  weatherData.IsDayTime
    ? image.setAttribute('src', './img/day.svg')
    : image.setAttribute('src', './img/night.svg');

  icon.setAttribute('src', `./img/icons/${weatherData.WeatherIcon}.svg`);
};
cityForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newCity = cityForm.city.value.trim();

  getCityData(newCity)
    .then((data) => updateUI(data))
    .catch((err) => console.log(err));
});
