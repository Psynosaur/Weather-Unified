using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Moq;
using Moq.Protected;
using WURequest.Services;
using Xunit;

namespace WUTests
{
    public class BaseHttpServiceTests
    {
        private readonly Mock<ILogger> _loggerMock;
        private readonly Mock<HttpMessageHandler> _httpMessageHandlerMock;
        private readonly HttpClient _httpClient;
        private readonly TestHttpService _testService;

        public BaseHttpServiceTests()
        {
            _loggerMock = new Mock<ILogger>();
            _httpMessageHandlerMock = new Mock<HttpMessageHandler>();
            _httpClient = new HttpClient(_httpMessageHandlerMock.Object);
            _testService = new TestHttpService(_httpClient, _loggerMock.Object);
        }

        [Fact]
        public async Task GetAsync_ReturnsDeserializedObject_WhenApiCallSucceeds()
        {
            // Arrange
            var testData = new TestModel { Id = 1, Name = "Test" };
            var jsonResponse = JsonSerializer.Serialize(testData);
            var httpResponse = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(jsonResponse, Encoding.UTF8, "application/json")
            };

            _httpMessageHandlerMock
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(httpResponse);

            // Act
            var result = await _testService.TestGetAsync<TestModel>("http://test.com", "test operation");

            // Assert
            Assert.NotNull(result);
            Assert.Equal(1, result.Id);
            Assert.Equal("Test", result.Name);
        }

        [Fact]
        public async Task GetAsync_ReturnsNewInstance_WhenApiCallFails()
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
            var result = await _testService.TestGetAsync<TestModel>("http://test.com", "test operation");

            // Assert
            Assert.NotNull(result);
            Assert.Equal(0, result.Id);
            Assert.Null(result.Name);
        }

        [Fact]
        public async Task GetAsync_LogsError_WhenExceptionOccurs()
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
            await _testService.TestGetAsync<TestModel>("http://test.com", "test operation");

            // Assert
            _loggerMock.Verify(
                x => x.Log(
                    LogLevel.Error,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Error test operation from API")),
                    It.IsAny<Exception>(),
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }

        [Fact]
        public async Task GetPrimitiveAsync_ReturnsValue_WhenApiCallSucceeds()
        {
            // Arrange
            var expectedValue = 42L;
            var jsonResponse = JsonSerializer.Serialize(expectedValue);
            var httpResponse = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(jsonResponse, Encoding.UTF8, "application/json")
            };

            _httpMessageHandlerMock
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(httpResponse);

            // Act
            var result = await _testService.TestGetPrimitiveAsync<long>("http://test.com", "test operation", 0L);

            // Assert
            Assert.Equal(expectedValue, result);
        }

        [Fact]
        public async Task GetPrimitiveAsync_ReturnsDefaultValue_WhenApiCallFails()
        {
            // Arrange
            var defaultValue = 999L;
            _httpMessageHandlerMock
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .ThrowsAsync(new HttpRequestException("Network error"));

            // Act
            var result = await _testService.TestGetPrimitiveAsync<long>("http://test.com", "test operation", defaultValue);

            // Assert
            Assert.Equal(defaultValue, result);
        }

        public class TestModel
        {
            public int Id { get; set; }
            public string? Name { get; set; }
        }

        public class TestHttpService : BaseHttpService
        {
            public TestHttpService(HttpClient httpClient, ILogger logger) : base(httpClient, logger)
            {
            }

            public async Task<T> TestGetAsync<T>(string url, string operationName) where T : new()
            {
                return await GetAsync<T>(url, operationName);
            }

            public async Task<T> TestGetPrimitiveAsync<T>(string url, string operationName, T defaultValue = default(T))
            {
                return await GetPrimitiveAsync<T>(url, operationName, defaultValue);
            }
        }
    }
}
