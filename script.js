const cityInput = document.getElementById('city');
const searchButton = document.getElementById('search');
const weatherData = document.getElementById('weather-data');

// Replace with your OpenWeatherMap API key
const API_KEY = '0e05f3f05fafb7d435dcc9eca95943f0';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Add event listeners
searchButton.addEventListener('click', getWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeather();
    }
});

// Add input validation and suggestions
cityInput.addEventListener('input', (e) => {
    const value = e.target.value;
    if (value.length > 0) {
        searchButton.classList.add('active');
    } else {
        searchButton.classList.remove('active');
    }
});

async function getWeather() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('Please enter a city name');
        return;
    }

    try {
        showLoading();
        const response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found. Please check the spelling and try again.');
            } else if (response.status === 401) {
                throw new Error('API key is invalid. Please check your configuration.');
            } else {
                throw new Error('Unable to fetch weather data. Please try again later.');
            }
        }
        
        const data = await response.json();
        displayWeather(data);
        
        // Clear input after successful search
        cityInput.value = '';
        searchButton.classList.remove('active');
        
    } catch (error) {
        showError(error.message);
    }
}

function displayWeather(data) {
    const { name, main, weather, wind, sys, coord } = data;
    const weatherInfo = weather[0];
    const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const sunset = new Date(sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    weatherData.innerHTML = `
        <div class="weather-card">
            <div class="weather-header">
                <div class="location-info">
                    <h2 class="city-name">${name}, ${sys.country}</h2>
                    <p class="coordinates">📍 ${coord.lat.toFixed(2)}°, ${coord.lon.toFixed(2)}°</p>
                    <p class="date-time">${new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</p>
                </div>
                <div class="weather-icon-large">
                    <img src="https://openweathermap.org/img/wn/${weatherInfo.icon}@4x.png" 
                         alt="${weatherInfo.description}"
                         loading="lazy">
                </div>
            </div>
            
            <div class="weather-main">
                <div class="temperature-section">
                    <div class="main-temp">${Math.round(main.temp)}°C</div>
                    <div class="feels-like">Feels like ${Math.round(main.feels_like)}°C</div>
                    <div class="temp-range">
                        <span class="high">↑ ${Math.round(main.temp_max)}°</span>
                        <span class="low">↓ ${Math.round(main.temp_min)}°</span>
                    </div>
                </div>
                
                <div class="weather-description">
                    <h3 class="condition">${weatherInfo.main}</h3>
                    <p class="description">${weatherInfo.description}</p>
                </div>
            </div>
            
            <div class="weather-details">
                <div class="detail-grid">
                    <div class="detail-item">
                        <div class="detail-icon">💧</div>
                        <div class="detail-content">
                            <span class="label">Humidity</span>
                            <span class="value">${main.humidity}%</span>
                        </div>
                    </div>
                    
                    <div class="detail-item">
                        <div class="detail-icon">💨</div>
                        <div class="detail-content">
                            <span class="label">Wind Speed</span>
                            <span class="value">${wind.speed} m/s</span>
                        </div>
                    </div>
                    
                    <div class="detail-item">
                        <div class="detail-icon">🌡️</div>
                        <div class="detail-content">
                            <span class="label">Pressure</span>
                            <span class="value">${main.pressure} hPa</span>
                        </div>
                    </div>
                    
                    <div class="detail-item">
                        <div class="detail-icon">👁️</div>
                        <div class="detail-content">
                            <span class="label">Visibility</span>
                            <span class="value">${data.visibility ? (data.visibility / 1000).toFixed(1) + ' km' : 'N/A'}</span>
                        </div>
                    </div>
                    
                    <div class="detail-item">
                        <div class="detail-icon">🌅</div>
                        <div class="detail-content">
                            <span class="label">Sunrise</span>
                            <span class="value">${sunrise}</span>
                        </div>
                    </div>
                    
                    <div class="detail-item">
                        <div class="detail-icon">🌇</div>
                        <div class="detail-content">
                            <span class="label">Sunset</span>
                            <span class="value">${sunset}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="weather-footer">
                <button class="refresh-btn" onclick="getWeather()">
                    🔄 Refresh Data
                </button>
            </div>
        </div>
    `;
}

function showLoading() {
    weatherData.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner">
                <div class="spinner"></div>
            </div>
            <h3>Fetching Weather Data...</h3>
            <p>Please wait while we get the latest information</p>
        </div>
    `;
}

function showError(message) {
    weatherData.innerHTML = `
        <div class="error-container">
            <div class="error-icon">⚠️</div>
            <h3>Oops! Something went wrong</h3>
            <p class="error-message">${message}</p>
            <button class="retry-btn" onclick="getWeather()">
                Try Again
            </button>
        </div>
    `;
}

// Add some utility functions
function getWeatherEmoji(weatherMain) {
    const weatherEmojis = {
        'Clear': '☀️',
        'Clouds': '☁️',
        'Rain': '🌧️',
        'Drizzle': '🌦️',
        'Thunderstorm': '⛈️',
        'Snow': '❄️',
        'Mist': '🌫️',
        'Fog': '🌫️',
        'Haze': '🌫️'
    };
    return weatherEmojis[weatherMain] || '🌤️';
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    cityInput.focus();
});
