import { Component } from '@angular/core';
import { WeatherService } from './weather.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid min-vh-100 main-background text-light py-4">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <!-- Search Box -->
          <div class="glass-card p-4 mb-4">
            <div class="input-group">
              <input 
                type="text" 
                class="form-control bg-dark text-light border-secondary" 
                placeholder="Enter city name..."
                [(ngModel)]="cityName"
                (keyup.enter)="searchCity()"
              >
              <button 
                class="btn btn-outline-light" 
                type="button"
                (click)="searchCity()"
              >
                Search
              </button>
            </div>
          </div>

          <!-- Weather Display -->
          @if (weather) {
            <div class="glass-card p-4">
              <div class="text-center mb-4">
                <h2>{{weather.cityName}}, {{weather.country}}</h2>
              </div>

              <!-- Current Weather -->
              <div class="row mb-4">
                <div class="col text-center">
                  <h3>{{weather.daily.temperature_2m_max[0]}}°C</h3>
                  <p>Max Temperature</p>
                </div>
                <div class="col text-center">
                  <h3>{{weather.daily.temperature_2m_min[0]}}°C</h3>
                  <p>Min Temperature</p>
                </div>
                <div class="col text-center">
                  <h3>{{weather.daily.precipitation_sum[0]}} mm</h3>
                  <p>Precipitation</p>
                </div>
              </div>

              <!-- Forecast -->
              <div class="mt-4">
                <h4 class="text-center">7-Day Forecast</h4>
                <div class="row">
                  @for (temp of weather.daily.temperature_2m_max; track $index) {
                    @if ($index > 0) {
                      <div class="col text-center">
                        <p class="mb-0">{{temp}}°C</p>
                        <small>Day {{$index + 1}}</small>
                      </div>
                    }
                  }
                </div>
              </div>
            </div>
          }

          <!-- Error Message -->
          @if (error) {
            <div class="alert alert-danger glass-card">
              {{error}}
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .main-background {
      background: radial-gradient(circle at center, #4a148c, #311b92, #1a237e);
      min-height: 100vh;
      position: relative;
    }

    .main-background::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at 50% 0%, rgba(255,255,255,0.1), transparent 70%);
      pointer-events: none;
    }

    .glass-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 15px;
      border: 1px solid rgba(255, 255, 255, 0.125);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    }

    .glass-card:hover {
      transform: translateY(-2px);
      transition: transform 0.3s ease;
    }

    input.form-control {
      background: rgba(255, 255, 255, 0.1) !important;
      border: 1px solid rgba(255, 255, 255, 0.2) !important;
      color: white !important;
    }

    input.form-control::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }

    .btn-outline-light {
      backdrop-filter: blur(5px);
    }
  `]
})
export class AppComponent {
  cityName = '';
  weather: any;
  error!: string;

  constructor(private weatherService: WeatherService) {}

  async searchCity() {
    if (!this.cityName.trim()) return;

    try {
      this.error = '';
      this.weather = await this.weatherService.getWeather(this.cityName);
      console.log(this.weather);
    } catch (error) {
      this.error = 'Failed to fetch weather data. Please try again.';
      this.weather = null;
    }
  }

}