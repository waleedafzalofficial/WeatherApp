import "./App.css";
import { useState } from "react";
import Login from './Login';

const api = {
  key: "86bebfcfab4e8a14d4b70959a75710a0",
  base: "https://api.openweathermap.org/data/2.5/",
};

function App() {
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [rainyCity, setRainyCity] = useState(null);

  const fetchWeather = async (query) => {
    const response = await fetch(
      `${api.base}weather?q=${query}&units=metric&APPID=${api.key}`
    );
    if (!response.ok) {
      throw new Error("City not found");
    }
    return response.json();
  };

  const searchPressed = () => {
    setLoading(true);
    setError(null);

    fetchWeather(search)
      .then((result) => {
        setWeather(result);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  const getWeatherEmoji = (weather) => {
    if (weather.main.temp > 40) {
      return "🥵"; // Hot emoji
    } else if (weather.weather[0].main.toLowerCase().includes("rain")) {
      return "🌧️"; // Rainy emoji
    }
    return ""; // Default: no emoji
  };

  const findRainyCity = async () => {
    setLoading(true);
    setError(null);
    setRainyCity(null);

    const cities = ["New York", "London", "Tokyo", "Sydney", "Paris", "Mumbai", "Rio de Janeiro"];
    for (let city of cities) {
      try {
        const weatherData = await fetchWeather(city);
        if (weatherData.weather[0].main.toLowerCase().includes("rain")) {
          setRainyCity(city);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error(err.message);
      }
    }
    setLoading(false);
    setRainyCity("No cities found with rain at the moment.");
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Weather App</h1>
        {isLoggedIn ? (
          <div>
            <p>Welcome, {user.username}</p>
            <button onClick={handleLogout}>Logout</button>
            <div>
              <input
                type="text"
                placeholder="Enter city/town..."
                onChange={(e) => setSearch(e.target.value)}
              />
              <button onClick={searchPressed}>Search</button>
            </div>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {typeof weather.main !== "undefined" && !loading && !error && (
              <div className="weather-container">
                <h2>Current Weather {getWeatherEmoji(weather)}</h2>
                <p>{weather.name}</p>
                <p>{weather.main.temp}°C</p>
                <p>{weather.weather[0].main}</p>
                <p>({weather.weather[0].description})</p>
              </div>
            )}
            <button onClick={findRainyCity}>Find City with Rain</button>
            {rainyCity && !loading && (
              <div className="rainy-city-container">
                <h2>{typeof rainyCity === "string" ? rainyCity : `It's raining in ${rainyCity}! 🌧️`}</h2>
              </div>
            )}
          </div>
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </header>
      <footer className="App-footer">
        <p>Weather data provided by OpenWeatherMap</p>
      </footer>
    </div>
  );
}

export default App;

