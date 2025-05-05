// Function to fetch weather data using XMLHttpRequest
function fetchWeather(city, callback) {
    const xhr = new XMLHttpRequest();
    
    xhr.open('GET', 'weather.json', true);
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            const weatherData = JSON.parse(xhr.responseText);
            const cityLower = city.toLowerCase();
            const data = weatherData[cityLower];
            
            if (data) {
                callback({ success: true, data: data });
            } else {
                callback({ success: false, message: "City not found in local repository." });
            }
        } else {
            callback({ success: false, message: "Error fetching weather data from local repository." });
        }
    };
    
    xhr.onerror = function() {
        callback({ success: false, message: "Error fetching weather data from local repository." });
    };
    
    xhr.send();
}

document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('cityInput');
    const getWeatherBtn = document.getElementById('getWeatherBtn');
    const weatherResult = document.getElementById('weatherResult');

    getWeatherBtn.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (!city) {
            weatherResult.innerHTML = '<p class="weather-error">Please enter a city name.</p>';
            return;
        }

        weatherResult.innerHTML = '<p>Loading...</p>';

        fetchWeather(city, (response) => {
            if (response.success) {
                const { temperature, humidity, condition } = response.data;
                weatherResult.innerHTML = `
                    <div class="weather-success">
                        <h3>Weather in ${city.charAt(0).toUpperCase() + city.slice(1)}</h3>
                        <p><strong>Temperature:</strong> ${temperature}</p>
                        <p><strong>Humidity:</strong> ${humidity}</p>
                        <p><strong>Conditions:</strong> ${condition}</p>
                    </div>
                `;
            } else {
                weatherResult.innerHTML = `<p class="weather-error">${response.message}</p>`;
            }
        });
    });

    // Allow pressing Enter to fetch weather
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            getWeatherBtn.click();
        }
    });
});