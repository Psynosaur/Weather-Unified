using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Threading.Tasks;
using WUCharts.Controllers;
using WUCharts.Services;
using WURequest.Models;

namespace WUTests
{
    public class HomeControllerTests
    {
        private readonly Mock<IWeatherApiService> _weatherApiServiceMock;
        private readonly Mock<IOptions<AppSettings>> _appSettingsMock;
        private readonly AppSettings _appSettings;

        public HomeControllerTests()
        {
            _weatherApiServiceMock = new Mock<IWeatherApiService>();
            _appSettingsMock = new Mock<IOptions<AppSettings>>();
            _appSettings = new AppSettings
            {
                StationName = "Test Station",
                Country = "Test Country",
                WeatherStation = "Test Weather Station",
                WURequestApiUrl = "http://localhost:5000",
                WURequestApiPort = 5000
            };
            _appSettingsMock.Setup(x => x.Value).Returns(_appSettings);
        }

        [Fact]
        public async Task Day_ReturnsViewWithObservations()
        {
            // Arrange
            var expectedObservations = new List<Observations>
            {
                new Observations { Id = "507f1f77bcf86cd799439011", TempOutCur = 25.5 }
            };
            
            _weatherApiServiceMock.Setup(x => x.GetDailyObservationsAsync())
                .ReturnsAsync(expectedObservations);

            var controller = new HomeController(_weatherApiServiceMock.Object, _appSettingsMock.Object);

            // Act
            var result = await controller.Day();

            // Assert
            var viewResult = Assert.IsType<ViewResult>(result);
            var model = Assert.IsAssignableFrom<List<Observations>>(viewResult.Model);
            Assert.Single(model);
            Assert.Equal("507f1f77bcf86cd799439011", model[0].Id);
            
            _weatherApiServiceMock.Verify(x => x.GetDailyObservationsAsync(), Times.Once);
        }

        [Fact]
        public async Task Hour_ReturnsViewWithObservations()
        {
            // Arrange
            var expectedObservations = new List<Observations>
            {
                new Observations { Id = "507f1f77bcf86cd799439011", TempOutCur = 25.5 }
            };
            
            _weatherApiServiceMock.Setup(x => x.GetHourlyObservationsAsync(12))
                .ReturnsAsync(expectedObservations);

            var controller = new HomeController(_weatherApiServiceMock.Object, _appSettingsMock.Object);

            // Act
            var result = await controller.Hour(12);

            // Assert
            var viewResult = Assert.IsType<ViewResult>(result);
            var model = Assert.IsAssignableFrom<List<Observations>>(viewResult.Model);
            Assert.Single(model);
            Assert.Equal("507f1f77bcf86cd799439011", model[0].Id);
            
            _weatherApiServiceMock.Verify(x => x.GetHourlyObservationsAsync(12), Times.Once);
        }

        [Fact]
        public async Task Week_ReturnsViewWithObservations()
        {
            // Arrange
            var expectedObservations = new List<Observations>
            {
                new Observations { Id = "507f1f77bcf86cd799439011", TempOutCur = 25.5 }
            };
            
            _weatherApiServiceMock.Setup(x => x.GetWeeklyObservationsAsync())
                .ReturnsAsync(expectedObservations);

            var controller = new HomeController(_weatherApiServiceMock.Object, _appSettingsMock.Object);

            // Act
            var result = await controller.Week();

            // Assert
            var viewResult = Assert.IsType<ViewResult>(result);
            var model = Assert.IsAssignableFrom<List<Observations>>(viewResult.Model);
            Assert.Single(model);
            Assert.Equal("507f1f77bcf86cd799439011", model[0].Id);
            
            _weatherApiServiceMock.Verify(x => x.GetWeeklyObservationsAsync(), Times.Once);
        }

        [Fact]
        public async Task Month_ReturnsViewWithObservations()
        {
            // Arrange
            var expectedObservations = new List<Observations>
            {
                new Observations { Id = "507f1f77bcf86cd799439011", TempOutCur = 25.5 }
            };
            
            _weatherApiServiceMock.Setup(x => x.GetMonthlyObservationsAsync())
                .ReturnsAsync(expectedObservations);

            var controller = new HomeController(_weatherApiServiceMock.Object, _appSettingsMock.Object);

            // Act
            var result = await controller.Month();

            // Assert
            var viewResult = Assert.IsType<ViewResult>(result);
            var model = Assert.IsAssignableFrom<List<Observations>>(viewResult.Model);
            Assert.Single(model);
            Assert.Equal("507f1f77bcf86cd799439011", model[0].Id);
            
            _weatherApiServiceMock.Verify(x => x.GetMonthlyObservationsAsync(), Times.Once);
        }

        [Fact]
        public async Task Date_WithValidDate_ReturnsViewWithObservations()
        {
            // Arrange
            var expectedObservations = new List<Observations>
            {
                new Observations { Id = "507f1f77bcf86cd799439011", TempOutCur = 25.5 }
            };
            
            _weatherApiServiceMock.Setup(x => x.GetObservationsByDateAsync("2023-01-01"))
                .ReturnsAsync(expectedObservations);

            var controller = new HomeController(_weatherApiServiceMock.Object, _appSettingsMock.Object);

            // Act
            var result = await controller.Date("2023-01-01");

            // Assert
            var viewResult = Assert.IsType<ViewResult>(result);
            var model = Assert.IsAssignableFrom<List<Observations>>(viewResult.Model);
            Assert.Single(model);
            Assert.Equal("507f1f77bcf86cd799439011", model[0].Id);
            
            _weatherApiServiceMock.Verify(x => x.GetObservationsByDateAsync("2023-01-01"), Times.Once);
        }

        [Fact]
        public async Task Date_WithInvalidDate_RedirectsToError()
        {
            // Arrange
            var controller = new HomeController(_weatherApiServiceMock.Object, _appSettingsMock.Object);

            // Act
            var result = await controller.Date("invalid-date");

            // Assert
            var redirectResult = Assert.IsType<RedirectToActionResult>(result);
            Assert.Equal("Error", redirectResult.ActionName);
        }

        [Fact]
        public async Task Rain_ReturnsViewWithRainData()
        {
            // Arrange
            var expectedRainData = new List<List<RainObs>>
            {
                new List<RainObs> { new RainObs() }
            };
            
            _weatherApiServiceMock.Setup(x => x.GetRainDataAsync("2023-01-01", "2023-01-02"))
                .ReturnsAsync(expectedRainData);

            var controller = new HomeController(_weatherApiServiceMock.Object, _appSettingsMock.Object);

            // Act
            var result = await controller.Rain("2023-01-01", "2023-01-02");

            // Assert
            var viewResult = Assert.IsType<ViewResult>(result);
            var model = Assert.IsAssignableFrom<List<List<RainObs>>>(viewResult.Model);
            Assert.Single(model);
            
            _weatherApiServiceMock.Verify(x => x.GetRainDataAsync("2023-01-01", "2023-01-02"), Times.Once);
        }

        [Fact]
        public void Index_RedirectsToDay()
        {
            // Arrange
            var controller = new HomeController(_weatherApiServiceMock.Object, _appSettingsMock.Object);

            // Act
            var result = controller.Index();

            // Assert
            var redirectResult = Assert.IsType<RedirectToActionResult>(result);
            Assert.Equal("Day", redirectResult.ActionName);
        }

        [Fact]
        public async Task Forecast_ReturnsViewWithForecastData()
        {
            // Arrange
            var expectedForecast = new Forecasts();
            
            _weatherApiServiceMock.Setup(x => x.GetLatestForecastAsync())
                .ReturnsAsync(expectedForecast);

            var controller = new HomeController(_weatherApiServiceMock.Object, _appSettingsMock.Object);

            // Act
            var result = await controller.Forecast();

            // Assert
            var viewResult = Assert.IsType<ViewResult>(result);
            Assert.NotNull(viewResult.Model);
            Assert.IsType<Forecasts>(viewResult.Model);
            
            _weatherApiServiceMock.Verify(x => x.GetLatestForecastAsync(), Times.Once);
        }

        [Fact]
        public void About_ReturnsView()
        {
            // Arrange
            var controller = new HomeController(_weatherApiServiceMock.Object, _appSettingsMock.Object);

            // Act
            var result = controller.About();

            // Assert
            Assert.IsType<ViewResult>(result);
        }
    }
}
