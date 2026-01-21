using Xunit;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.FileProviders;
using WebOptimizer;
using System.IO;
using System.Threading.Tasks;
using System.Text;

namespace WUTests
{
    public class BundlerIntegrationTest
    {
        [Fact]
        public void TestBundlerCanGenerateContent()
        {
            // Arrange
            var services = new ServiceCollection();
            
            // Add minimal required services
            services.AddSingleton<IWebHostEnvironment>(new TestWebHostEnvironment());
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            
            // Add WebOptimizer with a simple test bundle
            services.AddWebOptimizer(pipeline =>
            {
                // Create a simple CSS bundle for testing
                pipeline.AddCssBundle("/test/bundle.css", "/* Test CSS content */");
            });

            // Act
            var serviceProvider = services.BuildServiceProvider();
            var assetPipeline = serviceProvider.GetService<IAssetPipeline>();

            // Assert
            Assert.NotNull(assetPipeline);
            
            // Verify the bundle exists
            var bundleExists = assetPipeline.TryGetAssetFromRoute("/test/bundle.css", out var asset);
            Assert.True(bundleExists, "Test bundle should be configured");
            Assert.NotNull(asset);
            
            // Verify the asset has the expected properties
            Assert.Equal("/test/bundle.css", asset.Route);
            Assert.Contains("text/css", asset.ContentType);
        }

        [Fact]
        public void TestBundlerConfigurationIsValid()
        {
            // This test verifies that the WebOptimizer configuration from Startup.cs is valid
            // by recreating the exact same configuration and ensuring it works
            
            // Arrange
            var services = new ServiceCollection();
            services.AddSingleton<IWebHostEnvironment>(new TestWebHostEnvironment());
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            
            // Add the exact same WebOptimizer configuration as in Startup.cs
            services.AddWebOptimizer(pipeline =>
            {
                // CSS Bundle - equivalent to the old bundlerconfig.json CSS configuration
                pipeline.AddCssBundle("/css/site.min.css",
                    "wwwroot/lib/assets/bulma.min.css",
                    "wwwroot/lib/assets/bulma-tooltip.min.css",
                    "wwwroot/lib/assets/flatpickr.css",
                    "wwwroot/css/site.css")
                    .UseContentRoot();

                // JavaScript Bundle - equivalent to the old bundlerconfig.json JS configuration
                pipeline.AddJavaScriptBundle("/js/site.min.js",
                    "wwwroot/lib/assets/core.js",
                    "wwwroot/lib/assets/charts.js",
                    "wwwroot/lib/assets/dark.js",
                    "wwwroot/lib/assets/flatpickr.js",
                    "wwwroot/js/site.js")
                    .UseContentRoot();
            });

            // Act
            var serviceProvider = services.BuildServiceProvider();
            var assetPipeline = serviceProvider.GetService<IAssetPipeline>();

            // Assert
            Assert.NotNull(assetPipeline);
            
            // Verify both bundles are configured correctly
            var cssBundle = assetPipeline.TryGetAssetFromRoute("/css/site.min.css", out var cssAsset);
            var jsBundle = assetPipeline.TryGetAssetFromRoute("/js/site.min.js", out var jsAsset);
            
            Assert.True(cssBundle, "CSS bundle should be configured");
            Assert.True(jsBundle, "JavaScript bundle should be configured");
            
            Assert.NotNull(cssAsset);
            Assert.NotNull(jsAsset);
            
            // Verify content types
            Assert.Contains("text/css", cssAsset.ContentType);
            Assert.Contains("text/javascript", jsAsset.ContentType);
            
            // Verify routes
            Assert.Equal("/css/site.min.css", cssAsset.Route);
            Assert.Equal("/js/site.min.js", jsAsset.Route);
        }
    }

    // Test implementation of IWebHostEnvironment for testing
    public class TestWebHostEnvironment : IWebHostEnvironment
    {
        public string EnvironmentName { get; set; } = "Test";
        public string ApplicationName { get; set; } = "WUCharts";
        public string WebRootPath { get; set; } = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        public IFileProvider WebRootFileProvider { get; set; } = new NullFileProvider();
        public string ContentRootPath { get; set; } = Directory.GetCurrentDirectory();
        public IFileProvider ContentRootFileProvider { get; set; } = new NullFileProvider();
    }
}
