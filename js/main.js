const currentWeatherEl = document.getElementById("current-weather");
const hourlyWeatherEl = document.getElementById("hourly-weather");
const dailyWeatherEl = document.getElementById("daily-weather");

const DEFAULT_LAT = 38.3964;
const DEFAULT_LON = -0.5255;

navigator.geolocation.getCurrentPosition(
  position => {
    fetchWeather(position.coords.latitude, position.coords.longitude);
  },
  () => {
    fetchWeather(DEFAULT_LAT, DEFAULT_LON);
  }
);


async function fetchWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;

  const response = await fetch(url);
  const data = await response.json();

  renderCurrent(data.current_weather);
  renderHourly(data.hourly);
  renderDaily(data.daily);
}

function getWeatherIcon(weatherCode) {
  if (weatherCode === 0 || weatherCode === 1) return { emoji: '☀️', desc: 'Despejado' };
  if (weatherCode === 2) return { emoji: '⛅', desc: 'Parcialmente nuboso' };
  if (weatherCode === 3) return { emoji: '☁️', desc: 'Nuboso' };
  if (weatherCode === 45 || weatherCode === 48) return { emoji: '🌫️', desc: 'Neblina' };
  if (weatherCode === 51 || weatherCode === 53 || weatherCode === 55) return { emoji: '🌦️', desc: 'Llovizna' };
  if (weatherCode === 61 || weatherCode === 63 || weatherCode === 65) return { emoji: '🌧️', desc: 'Lluvia' };
  if (weatherCode === 71 || weatherCode === 73 || weatherCode === 75) return { emoji: '❄️', desc: 'Nieve' };
  if (weatherCode === 77) return { emoji: '❄️', desc: 'Nieve' };
  if (weatherCode === 80 || weatherCode === 81 || weatherCode === 82) return { emoji: '🌧️', desc: 'Lluvia fuerte' };
  if (weatherCode === 85 || weatherCode === 86) return { emoji: '🌨️', desc: 'Nieve fuerte' };
  if (weatherCode === 95 || weatherCode === 96 || weatherCode === 99) return { emoji: '⛈️', desc: 'Tormenta' };
  return { emoji: '🌤️', desc: 'Hoy' };
}

function renderCurrent(weather) {
  const { emoji, desc } = getWeatherIcon(weather.weather_code);
  currentWeatherEl.innerHTML = `
    <div class="current-weather-content">
      <div class="weather-icon-big">${emoji}</div>
      <div class="weather-info">
        <h2>Tiempo actual</h2>
        <p class="weather-description">${desc}</p>
        <p>🌡️ ${weather.temperature}°C</p>
        <p>💨 ${weather.windspeed} km/h</p>
      </div>
    </div>
  `;
}

function renderHourly(hourly) {
  const hours = hourly.time.slice(0, 12);
  const temps = hourly.temperature_2m.slice(0, 12);

  hourlyWeatherEl.innerHTML = `
    <h2>Próximas horas</h2>
    <div class="hourly-list">
      ${hours.map((h, i) => `
        <div class="hour">
          <p>${h.split("T")[1]}</p>
          <strong>${temps[i]}°</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function renderDaily(daily) {
  dailyWeatherEl.innerHTML = `
    <h2>Próximos días</h2>
    <div class="daily-list">
      ${daily.time.map((day, i) => `
        <div class="day">
          <p>${day}</p>
          <strong>${daily.temperature_2m_max[i]}°</strong>
          <small>${daily.temperature_2m_min[i]}°</small>
        </div>
      `).join("")}
    </div>
  `;
}
