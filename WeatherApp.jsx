import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './weatherApp.css';

const API_KEY = '9d700c0c0c25726a887c42a0c667c9dd';

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        if (secondsElapsed < 3) {
          setSecondsElapsed(secondsElapsed + 1);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [loading, secondsElapsed]);

  const handleLocationSubmit = async () => {
    setLoading(true);
    setSecondsElapsed(0);
    setWeatherData(null); // Clear previous weather data
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
      );
      setWeatherData(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch weather data');
      setLoading(false); // Set loading to false in case of error
    }
    setTimeout(() => {
      setLoading(false);
    }, 3000); // Loading for 3 seconds
  };

  const loadingText = 'Loading' + '.'.repeat(secondsElapsed);

  return (
    <div className="container">
      <h1 className="title">Weather App</h1>
      <div className="inputContainer">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          className="input"
        />
        <button className="button" onClick={handleLocationSubmit}>Search</button>
      </div>
      {loading && <p className="loading">{loadingText}</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && weatherData && (
        <div className="weatherContainer">
          <h2 className="subtitle">{weatherData.name}, {weatherData.sys.country}</h2>
          <p className="temperature">Temperature: {(weatherData.main.temp - 273.15).toFixed(2)}&#176;C</p>
          <p className="weather">Weather: {weatherData.weather[0].main}</p>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
