import React, { useState, useEffect, useRef } from "react";
import weatherTips from "../data/weatherTips.json";

const WeatherTip = () => {
  const [tip, setTip] = useState("Loading weather tips...");
  // To ensure we only refresh once per scheduled minute.
  const lastRefreshRef = useRef("");

  // Helper to get tip text from the JSON data based on a key
  const getTipFromKey = (key) => {
    const match = weatherTips.conditions.find((item) => item.condition === key);
    return match
      ? match.tip
      : weatherTips.conditions.find((item) => item.condition === "default").tip;
  };

  const fetchWeather = () => {
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
              } else if (["smoke", "dust", "sand"].includes(weatherCondition)) {
                key = "smog";
              }
              // Extended condition: if wind is high, override with windy tip.
              if (windSpeed > 10) {
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
  };

  useEffect(() => {
    // Initial fetch on mount
    fetchWeather();

    // Check every minute for refresh condition.
    const intervalId = setInterval(() => {
      const now = new Date();
      const day = now.getDay(); // 0: Sunday, 6: Saturday
      const hour = now.getHours();
      const minute = now.getMinutes();

      // Format current minute to keep track (e.g., "2023-10-11-08:00")
      const currTimeKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${hour}:${minute}`;

      if (lastRefreshRef.current === currTimeKey) {
        return; // already refreshed this minute
      }
      // Define refresh times:
      // Working days (Mon-Fri): 8:00 and 17:00
      // Weekends (Sat,Sun): 8:00, 12:00 and 17:00
      const isWeekend = day === 0 || day === 6;
      const validRefreshHours = isWeekend ? [8, 12, 17] : [8, 17];

      if (minute === 0 && validRefreshHours.includes(hour)) {
        fetchWeather();
        lastRefreshRef.current = currTimeKey;
      }
    }, 60000); // check every minute

    return () => clearInterval(intervalId);
  }, []);

  return <p>{tip}</p>;
};

export default WeatherTip;
