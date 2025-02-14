import React, { useState, useEffect } from "react";
import weatherTips from "../data/weatherTips.json";

const WeatherTip = () => {
  const [tip, setTip] = useState("Loading weather tips...");

  // Helper to get tip text from the JSON data based on a key
  const getTipFromKey = (key) => {
    const match = weatherTips.conditions.find((item) => item.condition === key);
    return match
      ? match.tip
      : weatherTips.conditions.find((item) => item.condition === "default").tip;
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
          fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
          )
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
              }
              return response.json();
            })
            .then((data) => {
              // Extract various weather parameters
              const temp = data.main?.temp;
              const humidity = data.main?.humidity;
              const weatherCondition =
                data.weather && data.weather[0]
                  ? data.weather[0].main.toLowerCase()
                  : "";
              const rainVolume = data.rain ? data.rain["1h"] || 0 : 0;
              const snowVolume = data.snow ? data.snow["1h"] || 0 : 0;
              const windSpeed = data.wind?.speed || 0; // wind speed in m/s

              let key = "default";
              if (weatherCondition === "thunderstorm") {
                key = "thunderstorm";
              } else if (
                weatherCondition === "drizzle" ||
                weatherCondition === "rain"
              ) {
                key = rainVolume > 5 ? "rain_heavy" : "rain_light";
              } else if (weatherCondition === "snow" || snowVolume > 0) {
                key = "snow";
              } else if (weatherCondition === "clear") {
                if (temp > 40) {
                  key = "extreme_hot";
                } else if (temp > 30) {
                  key = "clear_hot";
                } else if (temp < -5) {
                  key = "extreme_cold";
                } else if (temp < 5) {
                  key = "clear_cold";
                } else {
                  key = "clear";
                }
              } else if (weatherCondition === "clouds") {
                key = temp < 10 ? "clouds_chilly" : "clouds";
              } else if (["mist", "fog", "haze"].includes(weatherCondition)) {
                key = "fog";
              } else if (
                weatherCondition === "smoke" ||
                weatherCondition === "dust" ||
                weatherCondition === "sand"
              ) {
                key = "smog";
              }

              // Extended conditions based on other parameters
              if (windSpeed > 10) {
                // threshold for windy (m/s)
                key = "windy";
              }

              setTip(getTipFromKey(key));
            })
            .catch((error) => {
              console.error("Fetch error:", error);
              setTip("Unable to fetch weather tips.");
            });
        },
        (error) => {
          console.error("Geolocation error:", error);
          setTip("Unable to get your location.");
        }
      );
    } else {
      setTip("Geolocation is not supported by your browser.");
    }
  }, []);

  return <p>{tip}</p>;
};

export default WeatherTip;
