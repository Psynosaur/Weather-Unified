using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using Moq;
using Moq.Protected;
using WURequest.Models;
using WURequest.Services;
using Xunit;

namespace WUTests
{
    public class ForecastApiServiceTests
    {
        private readonly Mock<ILogger<ForecastApiService>> _loggerMock;
        private readonly Mock<IWeatherUndergroundApiSettings> _settingsMock;
        private readonly Mock<HttpMessageHandler> _httpMessageHandlerMock;
        private readonly HttpClient _httpClient;
        private readonly ForecastApiService _service;

        public ForecastApiServiceTests()
        {
            _loggerMock = new Mock<ILogger<ForecastApiService>>();
            _settingsMock = new Mock<IWeatherUndergroundApiSettings>();
            _httpMessageHandlerMock = new Mock<HttpMessageHandler>();
            _httpClient = new HttpClient(_httpMessageHandlerMock.Object);

            // Setup mock settings
            _settingsMock.Setup(x => x.Lat).Returns("-33");
            _settingsMock.Setup(x => x.Lon).Returns("18");
            _settingsMock.Setup(x => x.Format).Returns("json");
            _settingsMock.Setup(x => x.Units).Returns('m');
            _settingsMock.Setup(x => x.Language).Returns("en-GB");
            _settingsMock.Setup(x => x.Pat).Returns("test-api-key");

            _service = new ForecastApiService(_httpClient, _loggerMock.Object, _settingsMock.Object);
        }

        [Fact]
        public void ForecastApiService_CanBeInstantiated()
        {
            // Act & Assert
            Assert.NotNull(_service);
        }

        [Fact]
        public void ForecastApiService_ConfiguresHttpClientHeaders()
        {
            // Act & Assert
            Assert.Contains(_httpClient.DefaultRequestHeaders.Accept, 
                h => h.MediaType == "application/json");
        }

        [Fact]
        public async Task GetForecastAsync_ReturnsEmptyForecast_WhenHttpClientFails()
        {
            // Arrange
            _httpMessageHandlerMock
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .ThrowsAsync(new HttpRequestException("Network error"));

            // Act
            var result = await _service.GetForecastAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(ObjectId.Empty, result.ObjectId);
        }

        [Fact]
        public async Task GetForecastAsync_ReturnsDeserializedForecast_WhenApiCallSucceeds()
        {
            // Arrange
            var forecastJson = @"{
                ""calendarDayTemperatureMax"": [25, 27, 24],
                ""calendarDayTemperatureMin"": [15, 17, 14],
                ""dayOfWeek"": [""Monday"", ""Tuesday"", ""Wednesday""],
                ""temperatureMax"": [25, 27, 24],
                ""temperatureMin"": [15, 17, 14]
            }";

            var httpResponse = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(forecastJson, Encoding.UTF8, "application/json")
            };

            _httpMessageHandlerMock
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(httpResponse);

            // Act
            var result = await _service.GetForecastAsync();

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(result.DayOfWeek);
            Assert.Equal(3, result.DayOfWeek.Count);
            Assert.Contains("Monday", result.DayOfWeek);
        }

        [Fact]
        public async Task GetForecastAsync_UsesCorrectUrl()
        {
            // Arrange
            HttpRequestMessage? capturedRequest = null;
            var httpResponse = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent("{}", Encoding.UTF8, "application/json")
            };

            _httpMessageHandlerMock
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .Callback<HttpRequestMessage, CancellationToken>((request, token) => capturedRequest = request)
                .ReturnsAsync(httpResponse);

            // Act
            await _service.GetForecastAsync();

            // Assert
            Assert.NotNull(capturedRequest);
            var expectedUrl = "https://api.weather.com/v3/wx/forecast/daily/5day?geocode=-33,18&format=json&units=m&language=en-GB&apiKey=test-api-key";
            Assert.Equal(expectedUrl, capturedRequest!.RequestUri!.ToString());
        }

        [Fact]
        public async Task GetForecastAsync_LogsError_WhenExceptionOccurs()
        {
            // Arrange
            _httpMessageHandlerMock
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .ThrowsAsync(new HttpRequestException("Network error"));

            // Act
            await _service.GetForecastAsync();

            // Assert
            _loggerMock.Verify(
                x => x.Log(
                    LogLevel.Error,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Error fetching weather forecast from API")),
                    It.IsAny<Exception>(),
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }
    }
}
