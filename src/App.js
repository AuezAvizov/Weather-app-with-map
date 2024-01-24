import React, { useState } from 'react';
import { YMaps, Map } from 'react-yandex-maps';
import axios from 'axios';

function App() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  const handleMapClick = (e) => {
    const clientX = e.clientX;
    const clientY = e.clientY;
    const map = e.get('target');
    const mapCoords = map.converter.fromClientPixels([clientX, clientY], map.getZoom());
    const lat = mapCoords[0];
    const lng = mapCoords[1];

    setLatitude(lat);
    setLongitude(lng);

    const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY';
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`;

    axios.get(weatherApiUrl)
      .then(response => {
        setWeatherData(response.data);
      })
      .catch(error => {
        console.error(error);
        setWeatherData(null);
      });
  };

  return (
    <div className="App">
      <YMaps>
        <Map
          defaultState={{ center: [55.751244, 37.618423], zoom: 9 }}
          width="100%"
          height="500px"
          onClick={handleMapClick}
        />
      </YMaps>

      <div>
        {latitude && longitude ? (
          <div>
            <h2>Координаты клика:</h2>
            <p>Широта: {latitude}</p>
            <p>Долгота: {longitude}</p>
            {weatherData ? (
              <div>
                <h2>Погода в выбранной локации:</h2>
                <p>Температура: {weatherData.main.temp}°C</p>
                <p>Описание: {weatherData.weather[0].description}</p>
              </div>
            ) : (
              <p>Загрузка данных о погоде...</p>
            )}
          </div>
        ) : (
          <p>Кликните на карту, чтобы узнать координаты</p>
        )}
      </div>
    </div>
  );
}

export default App;
