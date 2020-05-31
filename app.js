class Forecast {
  constructor() {
    this.key = 'eseJ0OR902adRqqo27AMVPh8Es40a1AA';
    this.cityURI =
      'http://dataservice.accuweather.com/locations/v1/cities/search';
    this.weatherURI =
      'http://dataservice.accuweather.com/currentconditions/v1/';
  }
  async getCityData(city) {
    const cityData = await this.getCity(city);
    const weatherData = await this.getWeather(cityData.Key);
    return {
      cityData,
      weatherData,
    };
  }
  async getWeather(id) {
    const query = `${id}?apikey=${this.key}`;
    const res = await fetch(this.weatherURI + query);
    const data = await res.json();
    return data[0];
  }
  async getCity(city) {
    const query = `?apikey=${this.key}&q=${city}`;
    const res = await fetch(this.cityURI + query);
    const data = await res.json();
    return data[0];
  }
}

// dom manupulation
const card = document.querySelector('.card');
const details = document.querySelector('.details');
const cityForm = document.querySelector('form');
const image = document.querySelector('.card img');
const icon = document.querySelector('.icon img');
const forecast = new Forecast();

const updateUI = (data) => {
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
  cityForm.reset();

  forecast
    .getCityData(newCity)
    .then((data) => updateUI(data))
    .catch((err) => console.log(err));

  // set localStorage
  localStorage.setItem('city', newCity);
});

if (localStorage.getItem('city')) {
  forecast
    .getCityData(localStorage.getItem('city'))
    .then((data) => updateUI(data))
    .catch((err) => console.log(err));
}
