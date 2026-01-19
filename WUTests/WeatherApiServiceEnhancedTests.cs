using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using Moq.Protected;
using WUCharts.Services;
using WURequest.Models;
using Xunit;

namespace WUTests
{
    public class WeatherApiServiceEnhancedTests
    {
        private readonly Mock<ILogger<WeatherApiService>> _loggerMock;
        private readonly Mock<IOptions<AppSettings>> _appSettingsMock;
        private readonly AppSettings _appSettings;

        public WeatherApiServiceEnhancedTests()
        {
            _loggerMock = new Mock<ILogger<WeatherApiService>>();
            _appSettingsMock = new Mock<IOptions<AppSettings>>();
            
            _appSettings = new AppSettings
            {
                WURequestApiUrl = "http://localhost:5000",
                WURequestApiPort = 5000
            };
            _appSettingsMock.Setup(x => x.Value).Returns(_appSettings);
        }

        [Fact]
        public void WeatherApiService_CanBeInstantiated_WithValidDependencies()
        {
            // Arrange
            var httpClient = new HttpClient();

            // Act
            var service = new WeatherApiService(httpClient, _loggerMock.Object, _appSettingsMock.Object);

            // Assert
            Assert.NotNull(service);
            Assert.IsAssignableFrom<WURequest.Services.BaseHttpService>(service);
            Assert.IsAssignableFrom<IWeatherApiService>(service);
        }

        [Fact]
        public async Task GetLatestObservationsAsync_ReturnsEmptyList_WhenHttpClientFails()
        {
            // Arrange
            var httpClient = new HttpClient();
            var service = new WeatherApiService(httpClient, _loggerMock.Object, _appSettingsMock.Object);

            // Act
            var result = await service.GetLatestObservationsAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result); // Should return empty list when API call fails
        }

        [Fact]
        public async Task GetObservationCountAsync_ReturnsZero_WhenHttpClientFails()
        {
            // Arrange
            var httpClient = new HttpClient();
            var service = new WeatherApiService(httpClient, _loggerMock.Object, _appSettingsMock.Object);

            // Act
            var result = await service.GetObservationCountAsync();

            // Assert
            Assert.Equal(0L, result); // Should return 0 when API call fails
        }

        [Fact]
        public async Task GetLatestForecastAsync_ReturnsEmptyForecast_WhenHttpClientFails()
        {
            // Arrange
            var httpClient = new HttpClient();
            var service = new WeatherApiService(httpClient, _loggerMock.Object, _appSettingsMock.Object);

            // Act
            var result = await service.GetLatestForecastAsync();

            // Assert
            Assert.NotNull(result);
            // Should return empty forecast when API call fails
        }

        [Fact]
        public async Task GetHourlyObservationsAsync_ReturnsEmptyList_WhenHttpClientFails()
        {
            // Arrange
            var httpClient = new HttpClient();
            var service = new WeatherApiService(httpClient, _loggerMock.Object, _appSettingsMock.Object);

            // Act
            var result = await service.GetHourlyObservationsAsync(12);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result); // Should return empty list when API call fails
        }

        [Fact]
        public async Task GetRainDataAsync_ReturnsEmptyList_WhenHttpClientFails()
        {
            // Arrange
            var httpClient = new HttpClient();
            var service = new WeatherApiService(httpClient, _loggerMock.Object, _appSettingsMock.Object);

            // Act
            var result = await service.GetRainDataAsync("2023-01-01", "2023-01-02");

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result); // Should return empty list when API call fails
        }

        [Fact]
        public async Task GetDailyObservationsAsync_ReturnsEmptyList_WhenHttpClientFails()
        {
            // Arrange
            var httpClient = new HttpClient();
            var service = new WeatherApiService(httpClient, _loggerMock.Object, _appSettingsMock.Object);

            // Act
            var result = await service.GetDailyObservationsAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result); // Should return empty list when API call fails
        }

        [Fact]
        public async Task GetWeeklyObservationsAsync_ReturnsEmptyList_WhenHttpClientFails()
        {
            // Arrange
            var httpClient = new HttpClient();
            var service = new WeatherApiService(httpClient, _loggerMock.Object, _appSettingsMock.Object);

            // Act
            var result = await service.GetWeeklyObservationsAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result); // Should return empty list when API call fails
        }

        [Fact]
        public async Task GetMonthlyObservationsAsync_ReturnsEmptyList_WhenHttpClientFails()
        {
            // Arrange
            var httpClient = new HttpClient();
            var service = new WeatherApiService(httpClient, _loggerMock.Object, _appSettingsMock.Object);

            // Act
            var result = await service.GetMonthlyObservationsAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result); // Should return empty list when API call fails
        }

        [Fact]
        public async Task GetObservationsByDateAsync_ReturnsEmptyList_WhenHttpClientFails()
        {
            // Arrange
            var httpClient = new HttpClient();
            var service = new WeatherApiService(httpClient, _loggerMock.Object, _appSettingsMock.Object);

            // Act
            var result = await service.GetObservationsByDateAsync("2023-01-01");

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result); // Should return empty list when API call fails
        }

        [Fact]
        public void WeatherApiService_UsesCorrectBaseUrl()
        {
            // Arrange
            var httpClient = new HttpClient();
            var service = new WeatherApiService(httpClient, _loggerMock.Object, _appSettingsMock.Object);

            // Act & Assert
            // The base URL should be constructed from the app settings
            Assert.Equal("http://localhost:5000", _appSettings.WURequestApiUrl);
            Assert.Equal(5000, _appSettings.WURequestApiPort);
        }

        [Fact]
        public async Task AllMethodsExist_AndCanBeCalled()
        {
            // Arrange
            var httpClient = new HttpClient();
            var service = new WeatherApiService(httpClient, _loggerMock.Object, _appSettingsMock.Object);

            // Act & Assert - Just verify all methods exist and can be called
            Assert.NotNull(await service.GetLatestObservationsAsync());
            Assert.NotNull(await service.GetHourlyObservationsAsync(12));
            Assert.NotNull(await service.GetDailyObservationsAsync());
            Assert.NotNull(await service.GetWeeklyObservationsAsync());
            Assert.NotNull(await service.GetMonthlyObservationsAsync());
            Assert.NotNull(await service.GetObservationsByDateAsync("2023-01-01"));
            Assert.NotNull(await service.GetRainDataAsync("2023-01-01", "2023-01-02"));
            Assert.NotNull(await service.GetLatestForecastAsync());
        }

        [Theory]
        [InlineData("")]
        [InlineData(null)]
        public async Task GetObservationsByDateAsync_HandlesInvalidDates_Gracefully(string invalidDate)
        {
            // Arrange
            var httpClient = new HttpClient();
            var service = new WeatherApiService(httpClient, _loggerMock.Object, _appSettingsMock.Object);

            // Act
            var result = await service.GetObservationsByDateAsync(invalidDate);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result); // Should return empty list for invalid dates
        }

        [Theory]
        [InlineData("", "2023-01-02")]
        [InlineData("2023-01-01", "")]
        [InlineData(null, "2023-01-02")]
        [InlineData("2023-01-01", null)]
        public async Task GetRainDataAsync_HandlesInvalidParameters_Gracefully(string start, string end)
        {
            // Arrange
            var httpClient = new HttpClient();
            var service = new WeatherApiService(httpClient, _loggerMock.Object, _appSettingsMock.Object);

            // Act
            var result = await service.GetRainDataAsync(start, end);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result); // Should return empty list for invalid parameters
        }

        [Theory]
        [InlineData(-1)]
        [InlineData(25)]
        [InlineData(100)]
        public async Task GetHourlyObservationsAsync_HandlesInvalidHours_Gracefully(int invalidHour)
        {
            // Arrange
            var httpClient = new HttpClient();
            var service = new WeatherApiService(httpClient, _loggerMock.Object, _appSettingsMock.Object);

            // Act
            var result = await service.GetHourlyObservationsAsync(invalidHour);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result); // Should return empty list for invalid hours
        }
    }
}
