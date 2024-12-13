import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private baseUrl = 'https://api.open-meteo.com/v1/forecast';

  constructor() {}

  
  async getWeather(city: string): Promise<any> {
      try {
        // Step 1: Geocoding - Convert city name to coordinates
        // Using the open-meteo geocoding API to get latitude and longitude
        // The count=1 parameter limits the results to the most relevant city match
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();
  
        // Check if the city exists in the geocoding results
        // The optional chaining (?.) ensures we don't get an error if results is undefined
        if (!geoData.results?.[0]) {
          throw new Error('City not found');
        }
  
        // Extract latitude and longitude from the first result
        const { latitude, longitude } = geoData.results[0];
  
        // Step 2: Fetch Weather Data
        // Using the coordinates to get weather information
        // daily parameters request specific weather metrics:
        // - temperature_2m_max: Maximum daily temperature at 2 meters above ground
        // - temperature_2m_min: Minimum daily temperature at 2 meters above ground
        // - precipitation_sum: Total daily precipitation
        // - weathercode: Code representing weather conditions (sunny, rainy, etc.)
        const weatherUrl = `${this.baseUrl}?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=auto`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();
        console.log('Weather Data:', weatherData);
        // Return combined weather data with city information
        return {
          ...weatherData,        // Spreads all weather data properties (includes: daily temperatures, precipitation, etc.)
          cityName: geoData.results[0].name,    // Adds the official city name from the geocoding result
          country: geoData.results[0].country    // Adds the country name from the geocoding result
        };
      } catch (error) {
        throw new Error('Failed to fetch weather data');
      }
  }
}
