using Xunit;
using Moq;
using WURequest.Controllers;
using WURequest.Models;
using WURequest.Services;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;

namespace WUTests
{
    public class WeatherControllerTests
    {
        private readonly Mock<IWeatherUndergroundApiSettings> _weatherSettingsMock;
        private readonly Mock<IObservationsService> _observationsServiceMock;
        private readonly Mock<IWebHostEnvironment> _hostingEnvironmentMock;
        private readonly Mock<ILoggerFactory> _loggerFactoryMock;

        public WeatherControllerTests()
        {
            _weatherSettingsMock = new Mock<IWeatherUndergroundApiSettings>();
            _observationsServiceMock = new Mock<IObservationsService>();
            _hostingEnvironmentMock = new Mock<IWebHostEnvironment>();
            _loggerFactoryMock = new Mock<ILoggerFactory>();
            var loggerMock = new Mock<ILogger>();
            
            _loggerFactoryMock.Setup(x => x.CreateLogger(It.IsAny<string>()))
                .Returns(loggerMock.Object);
        }

        [Fact]
        public async Task TestMbEndpoint_ValidData_ReturnsDataOk()
        {
            // Arrange
            var validObservation = new Observations
            {
                ObsTime = System.DateTime.UtcNow,
                TempOutCur = 25.5 // Valid temperature to pass the validation
            };
            
            _observationsServiceMock.Setup(obs => obs.Create(It.IsAny<Observations>()))
                .Returns(Task.CompletedTask);

            // Act
            var controller = new WeatherController(
                _observationsServiceMock.Object,
                _hostingEnvironmentMock.Object,
                _weatherSettingsMock.Object,
                _loggerFactoryMock.Object);
            
            var result = await controller.Mb(validObservation);

            // Assert
            Assert.IsType<ActionResult<string>>(result);
            
            // Check if the result contains "DATA OK"
            var actionResult = result.Result;
            if (actionResult is OkObjectResult okResult)
            {
                Assert.Equal("DATA OK", okResult.Value);
            }
            else
            {
                // If it's a direct value result
                Assert.Equal("DATA OK", result.Value);
            }
            
            // Verify that the service was called
            _observationsServiceMock.Verify(obs => obs.Create(It.IsAny<Observations>()), Times.Once);
        }

        [Fact]
        public async Task TestMbEndpoint_InvalidData_ReturnsDataBad()
        {
            // Arrange
            var invalidObservation = new Observations
            {
                ObsTime = default, // Invalid date
                TempOutCur = double.NaN // Invalid temperature
            };

            // Act
            var controller = new WeatherController(
                _observationsServiceMock.Object,
                _hostingEnvironmentMock.Object,
                _weatherSettingsMock.Object,
                _loggerFactoryMock.Object);
            
            var result = await controller.Mb(invalidObservation);

            // Assert
            Assert.IsType<ActionResult<string>>(result);
            
            // Check if the result contains "DATA BAD"
            var actionResult = result.Result;
            if (actionResult is OkObjectResult okResult)
            {
                Assert.Equal("DATA BAD", okResult.Value);
            }
            else
            {
                // If it's a direct value result
                Assert.Equal("DATA BAD", result.Value);
            }
            
            // Verify that the service was NOT called for invalid data
            _observationsServiceMock.Verify(obs => obs.Create(It.IsAny<Observations>()), Times.Never);
        }

        [Fact]
        public async Task TestMbEndpoint_DefaultDateTime_ReturnsDataBad()
        {
            // Arrange
            var observationWithDefaultTime = new Observations
            {
                ObsTime = default(System.DateTime), // Default DateTime
                TempOutCur = 20.0 // Valid temperature
            };

            // Act
            var controller = new WeatherController(
                _observationsServiceMock.Object,
                _hostingEnvironmentMock.Object,
                _weatherSettingsMock.Object,
                _loggerFactoryMock.Object);
            
            var result = await controller.Mb(observationWithDefaultTime);

            // Assert
            Assert.IsType<ActionResult<string>>(result);
            
            // Should return "DATA BAD" because ObsTime is default
            var actionResult = result.Result;
            if (actionResult is OkObjectResult okResult)
            {
                Assert.Equal("DATA BAD", okResult.Value);
            }
            else
            {
                Assert.Equal("DATA BAD", result.Value);
            }
            
            _observationsServiceMock.Verify(obs => obs.Create(It.IsAny<Observations>()), Times.Never);
        }

        [Fact]
        public async Task TestMbEndpoint_NaNTemperature_ReturnsDataBad()
        {
            // Arrange
            var observationWithNaNTemp = new Observations
            {
                ObsTime = System.DateTime.UtcNow, // Valid time
                TempOutCur = double.NaN // Invalid temperature
            };

            // Act
            var controller = new WeatherController(
                _observationsServiceMock.Object,
                _hostingEnvironmentMock.Object,
                _weatherSettingsMock.Object,
                _loggerFactoryMock.Object);
            
            var result = await controller.Mb(observationWithNaNTemp);

            // Assert
            Assert.IsType<ActionResult<string>>(result);
            
            // Should return "DATA BAD" because temperature is NaN
            var actionResult = result.Result;
            if (actionResult is OkObjectResult okResult)
            {
                Assert.Equal("DATA BAD", okResult.Value);
            }
            else
            {
                Assert.Equal("DATA BAD", result.Value);
            }
            
            _observationsServiceMock.Verify(obs => obs.Create(It.IsAny<Observations>()), Times.Never);
        }

        [Fact]
        public async Task TestMbEndpoint_ServiceException_ThrowsException()
        {
            // Arrange
            var validObservation = new Observations
            {
                ObsTime = System.DateTime.UtcNow,
                TempOutCur = 25.5
            };
            
            _observationsServiceMock.Setup(obs => obs.Create(It.IsAny<Observations>()))
                .ThrowsAsync(new System.Exception("Database connection failed"));

            // Act & Assert
            var controller = new WeatherController(
                _observationsServiceMock.Object,
                _hostingEnvironmentMock.Object,
                _weatherSettingsMock.Object,
                _loggerFactoryMock.Object);
            
            await Assert.ThrowsAsync<System.Exception>(async () => 
                await controller.Mb(validObservation));
            
            _observationsServiceMock.Verify(obs => obs.Create(It.IsAny<Observations>()), Times.Once);
        }
    }
}
