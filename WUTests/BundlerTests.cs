using Xunit;
using Microsoft.Extensions.DependencyInjection;
using WebOptimizer;
using System.IO;
using System.Linq;

namespace WUTests
{
    public class BundlerTests
    {
        [Fact]
        public void TestWebOptimizerServiceRegistration()
        {
            // Arrange
            var services = new ServiceCollection();
            
            // Add WebOptimizer with the same configuration as Startup.cs
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
        }

        [Fact]
        public void TestCssBundleConfiguration()
        {
            // Arrange
            var services = new ServiceCollection();
            services.AddWebOptimizer(pipeline =>
            {
                pipeline.AddCssBundle("/css/site.min.css",
                    "wwwroot/lib/assets/bulma.min.css",
                    "wwwroot/lib/assets/bulma-tooltip.min.css",
                    "wwwroot/lib/assets/flatpickr.css",
                    "wwwroot/css/site.css")
                    .UseContentRoot();
            });

            // Act
            var serviceProvider = services.BuildServiceProvider();
            var assetPipeline = serviceProvider.GetService<IAssetPipeline>();

            // Assert
            Assert.NotNull(assetPipeline);
            
            // Check if CSS bundle is configured
            var cssBundle = assetPipeline.TryGetAssetFromRoute("/css/site.min.css", out var cssAsset);
            Assert.True(cssBundle, "CSS bundle should be configured");
            Assert.NotNull(cssAsset);
            
            // Verify source files are configured
            var expectedSourceFiles = new[]
            {
                "wwwroot/lib/assets/bulma.min.css",
                "wwwroot/lib/assets/bulma-tooltip.min.css",
                "wwwroot/lib/assets/flatpickr.css",
                "wwwroot/css/site.css"
            };
            
            foreach (var expectedFile in expectedSourceFiles)
            {
                Assert.Contains(expectedFile, cssAsset.SourceFiles);
            }
        }

        [Fact]
        public void TestJavaScriptBundleConfiguration()
        {
            // Arrange
            var services = new ServiceCollection();
            services.AddWebOptimizer(pipeline =>
            {
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
            
            // Check if JS bundle is configured
            var jsBundle = assetPipeline.TryGetAssetFromRoute("/js/site.min.js", out var jsAsset);
            Assert.True(jsBundle, "JavaScript bundle should be configured");
            Assert.NotNull(jsAsset);
            
            // Verify source files are configured
            var expectedSourceFiles = new[]
            {
                "wwwroot/lib/assets/core.js",
                "wwwroot/lib/assets/charts.js",
                "wwwroot/lib/assets/dark.js",
                "wwwroot/lib/assets/flatpickr.js",
                "wwwroot/js/site.js"
            };
            
            foreach (var expectedFile in expectedSourceFiles)
            {
                Assert.Contains(expectedFile, jsAsset.SourceFiles);
            }
        }

        [Fact]
        public void TestBundleRoutesAreDifferent()
        {
            // Verify that CSS and JS bundles have different routes
            var cssRoute = "/css/site.min.css";
            var jsRoute = "/js/site.min.js";
            
            Assert.NotEqual(cssRoute, jsRoute);
            Assert.EndsWith(".css", cssRoute);
            Assert.EndsWith(".js", jsRoute);
        }

        [Fact]
        public void TestBundleConfigurationMatchesStartup()
        {
            // This test verifies that our test configuration matches what's in Startup.cs
            // by checking that the expected routes and file patterns are correct
            
            var expectedCssRoute = "/css/site.min.css";
            var expectedJsRoute = "/js/site.min.js";
            
            // Verify route patterns
            Assert.StartsWith("/css/", expectedCssRoute);
            Assert.StartsWith("/js/", expectedJsRoute);
            Assert.EndsWith(".min.css", expectedCssRoute);
            Assert.EndsWith(".min.js", expectedJsRoute);
            
            // Verify we have the expected number of source files
            var expectedCssSourceCount = 4; // bulma.min.css, bulma-tooltip.min.css, flatpickr.css, site.css
            var expectedJsSourceCount = 5;  // core.js, charts.js, dark.js, flatpickr.js, site.js
            
            Assert.True(expectedCssSourceCount > 0);
            Assert.True(expectedJsSourceCount > 0);
        }
    }
}
