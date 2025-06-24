const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your API key
const cityInput = document.getElementById('city');
const searchButton = document.getElementById('search');
const weatherDataDiv = document.getElementById('weather-data');

searchButton.addEventListener('click', fetchWeatherData);

function fetchWeatherData() {
    const city = cityInput.value.trim();
    if (city) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        fetch(url)
            .then(response => response.json())
            .then(data => displayWeatherData(data))
            .catch(error => console.error('Error fetching weather data:', error));
    } else {
        alert('Please enter a city name');
    }
}

function displayWeatherData(data) {
    const { main, weather } = data;
    const temperature = main.temp;
    const humidity = main.humidity;
    const forecast = weather[0].description;

    const html = `
        <h2>${data.name}</h2>
        <p>Temperature: ${temperature}°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Forecast: ${forecast}</p>
    `;
    weatherDataDiv.innerHTML = html;
}