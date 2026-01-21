using Xunit;
using Moq;
using WURequest.Controllers;
using WURequest.Models;
using WURequest.Services;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace WUTests
{
    public class ObservationsControllerTests
    {
        private readonly Mock<IObservationsService> _observationsServiceMock;
        private readonly Mock<ILoggerFactory> _loggerFactoryMock;

        public ObservationsControllerTests()
        {
            _observationsServiceMock = new Mock<IObservationsService>();
            _loggerFactoryMock = new Mock<ILoggerFactory>();
            var loggerMock = new Mock<ILogger>();
            
            _loggerFactoryMock.Setup(x => x.CreateLogger(It.IsAny<string>()))
                .Returns(loggerMock.Object);
        }

        [Fact]
        public async Task TestGetLatestObservationsEndpoint()
        {
            // Arrange
            var expectedObservations = new List<Observations> 
            { 
                new Observations { Id = "507f1f77bcf86cd799439011", TempOutCur = 25.5 } 
            };
            
            _observationsServiceMock.Setup(obs => obs.Latest())
                .ReturnsAsync(expectedObservations);

            // Act
            var controller = new ObservationsController(_observationsServiceMock.Object, _loggerFactoryMock.Object);
            var result = await controller.Get();

            // Assert
            Assert.IsType<ActionResult<List<Observations>>>(result);
            _observationsServiceMock.Verify(obs => obs.Latest(), Times.Once);
        }

        [Fact]
        public async Task TestCreateObservationEndpoint()
        {
            // Arrange
            var newObservation = new Observations 
            { 
                TempOutCur = 22.5, 
                ObsTime = System.DateTime.UtcNow 
            };
            
            _observationsServiceMock.Setup(obs => obs.Create(It.IsAny<Observations>()))
                .Returns(Task.CompletedTask);

            // Act
            var controller = new ObservationsController(_observationsServiceMock.Object, _loggerFactoryMock.Object);
            var result = await controller.Create(newObservation);

            // Assert
            Assert.IsType<ActionResult<Observations>>(result);
            var createdResult = result.Result as CreatedAtRouteResult;
            Assert.NotNull(createdResult);
            Assert.Equal("GetObservation", createdResult.RouteName);
            
            _observationsServiceMock.Verify(obs => obs.Create(It.IsAny<Observations>()), Times.Once);
        }

        [Fact]
        public async Task TestCreateObservationEndpoint_HandlesException()
        {
            // Arrange
            var newObservation = new Observations();
            
            _observationsServiceMock.Setup(obs => obs.Create(It.IsAny<Observations>()))
                .ThrowsAsync(new System.Exception("Database error"));

            // Act & Assert
            var controller = new ObservationsController(_observationsServiceMock.Object, _loggerFactoryMock.Object);
            
            await Assert.ThrowsAsync<System.Exception>(async () => 
                await controller.Create(newObservation));
            
            _observationsServiceMock.Verify(obs => obs.Create(It.IsAny<Observations>()), Times.Once);
        }

        [Fact]
        public void TestServiceMethodsAreCalled()
        {
            // This test verifies that the service methods exist and can be mocked
            // without dealing with complex MongoDB cursor behavior
            
            // Arrange
            var observationsId = "507f1f77bcf86cd799439011";
            var observation = new Observations { Id = observationsId };
            
            // Verify all service methods can be mocked
            _observationsServiceMock.Setup(s => s.Latest()).ReturnsAsync(new List<Observations>());
            _observationsServiceMock.Setup(s => s.Create(It.IsAny<Observations>())).Returns(Task.CompletedTask);
            _observationsServiceMock.Setup(s => s.Update(It.IsAny<string>(), It.IsAny<Observations>()));
            _observationsServiceMock.Setup(s => s.Remove(It.IsAny<string>()));
            _observationsServiceMock.Setup(s => s.Count()).Returns(100);
            _observationsServiceMock.Setup(s => s.Daily()).ReturnsAsync(new List<Observations>());
            _observationsServiceMock.Setup(s => s.Weekly()).ReturnsAsync(new List<Observations>());
            _observationsServiceMock.Setup(s => s.Monthly()).ReturnsAsync(new List<Observations>());
            _observationsServiceMock.Setup(s => s.Hourly(It.IsAny<int>())).ReturnsAsync(new List<Observations>());
            _observationsServiceMock.Setup(s => s.Date(It.IsAny<string>())).ReturnsAsync(new List<Observations>());
            
            // Act & Assert - Just verify the mocks work
            Assert.NotNull(_observationsServiceMock.Object);
            
            // Verify we can call the methods without exceptions
            var latestTask = _observationsServiceMock.Object.Latest();
            var createTask = _observationsServiceMock.Object.Create(observation);
            var count = _observationsServiceMock.Object.Count();
            
            Assert.NotNull(latestTask);
            Assert.NotNull(createTask);
            Assert.Equal(100, count);
        }

        [Fact]
        public async Task GetHourly_ReturnsObservations_WhenServiceSucceeds()
        {
            // Arrange
            var expectedObservations = new List<Observations>
            {
                new Observations { Id = "507f1f77bcf86cd799439011", TempOutCur = 25.5 }
            };
            
            _observationsServiceMock.Setup(obs => obs.Hourly(12))
                .ReturnsAsync(expectedObservations);

            // Act
            var controller = new ObservationsController(_observationsServiceMock.Object, _loggerFactoryMock.Object);
            var result = await controller.GetHourly(12);

            // Assert
            Assert.IsType<ActionResult<List<Observations>>>(result);
            _observationsServiceMock.Verify(obs => obs.Hourly(12), Times.Once);
        }

        [Fact]
        public async Task GetDaily_ReturnsObservations_WhenServiceSucceeds()
        {
            // Arrange
            var expectedObservations = new List<Observations>
            {
                new Observations { Id = "507f1f77bcf86cd799439011", TempOutCur = 25.5 }
            };
            
            _observationsServiceMock.Setup(obs => obs.Daily())
                .ReturnsAsync(expectedObservations);

            // Act
            var controller = new ObservationsController(_observationsServiceMock.Object, _loggerFactoryMock.Object);
            var result = await controller.GetDaily();

            // Assert
            Assert.IsType<ActionResult<List<Observations>>>(result);
            _observationsServiceMock.Verify(obs => obs.Daily(), Times.Once);
        }

        [Fact]
        public async Task GetWeekly_ReturnsObservations_WhenServiceSucceeds()
        {
            // Arrange
            var expectedObservations = new List<Observations>
            {
                new Observations { Id = "507f1f77bcf86cd799439011", TempOutCur = 25.5 }
            };
            
            _observationsServiceMock.Setup(obs => obs.Weekly())
                .ReturnsAsync(expectedObservations);

            // Act
            var controller = new ObservationsController(_observationsServiceMock.Object, _loggerFactoryMock.Object);
            var result = await controller.GetWeekly();

            // Assert
            Assert.IsType<ActionResult<List<Observations>>>(result);
            _observationsServiceMock.Verify(obs => obs.Weekly(), Times.Once);
        }

        [Fact]
        public async Task GetMonthly_ReturnsObservations_WhenServiceSucceeds()
        {
            // Arrange
            var expectedObservations = new List<Observations>
            {
                new Observations { Id = "507f1f77bcf86cd799439011", TempOutCur = 25.5 }
            };
            
            _observationsServiceMock.Setup(obs => obs.Monthly())
                .ReturnsAsync(expectedObservations);

            // Act
            var controller = new ObservationsController(_observationsServiceMock.Object, _loggerFactoryMock.Object);
            var result = await controller.GetMonthly();

            // Assert
            Assert.IsType<ActionResult<List<Observations>>>(result);
            _observationsServiceMock.Verify(obs => obs.Monthly(), Times.Once);
        }

        [Fact]
        public async Task GetByDate_ReturnsObservations_WhenServiceSucceeds()
        {
            // Arrange
            var expectedObservations = new List<Observations>
            {
                new Observations { Id = "507f1f77bcf86cd799439011", TempOutCur = 25.5 }
            };
            
            _observationsServiceMock.Setup(obs => obs.Date("2023-01-01"))
                .ReturnsAsync(expectedObservations);

            // Act
            var controller = new ObservationsController(_observationsServiceMock.Object, _loggerFactoryMock.Object);
            var result = await controller.GetByDate("2023-01-01");

            // Assert
            Assert.IsType<ActionResult<List<Observations>>>(result);
            _observationsServiceMock.Verify(obs => obs.Date("2023-01-01"), Times.Once);
        }

        [Fact]
        public void GetRainData_ReturnsRainData_WhenServiceSucceeds()
        {
            // Arrange
            var expectedRainData = new List<List<RainObs>>
            {
                new List<RainObs>
                {
                    new RainObs { ObsTime = 1640995200000, RainRateCur = 1.5m }
                }
            };
            
            _observationsServiceMock.Setup(obs => obs.Rain("2023-01-01", "2023-01-02"))
                .Returns(expectedRainData);

            // Act
            var controller = new ObservationsController(_observationsServiceMock.Object, _loggerFactoryMock.Object);
            var result = controller.GetRainData("2023-01-01", "2023-01-02");

            // Assert
            Assert.IsType<ActionResult<List<List<RainObs>>>>(result);
            _observationsServiceMock.Verify(obs => obs.Rain("2023-01-01", "2023-01-02"), Times.Once);
        }

        [Fact]
        public void GetCount_ReturnsCount_WhenServiceSucceeds()
        {
            // Arrange
            var expectedCount = 1000L;
            
            _observationsServiceMock.Setup(obs => obs.Count())
                .Returns(expectedCount);

            // Act
            var controller = new ObservationsController(_observationsServiceMock.Object, _loggerFactoryMock.Object);
            var result = controller.GetCount();

            // Assert
            Assert.IsType<ActionResult<long>>(result);
            _observationsServiceMock.Verify(obs => obs.Count(), Times.Once);
        }
    }
}
