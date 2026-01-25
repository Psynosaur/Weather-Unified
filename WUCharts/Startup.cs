using System;
using System.IO.Compression;
using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using WUCharts.Services;
using WURequest.Models;
using WebOptimizer;

namespace WUCharts
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddHealthChecks();
            services.AddResponseCompression(options =>
            {
                options.Providers.Add<BrotliCompressionProvider>();
                options.Providers.Add<GzipCompressionProvider>();
                options.MimeTypes =
                    ResponseCompressionDefaults.MimeTypes.Concat(
                        new[] { "image/svg+xml" });
            });

            // Add WebOptimizer for bundling and minification
            services.AddWebOptimizer(pipeline =>
            {
                // CSS Bundle - equivalent to the old bundlerconfig.json CSS configuration
                pipeline.AddCssBundle("/css/site.min.css",
                    "lib/assets/bulma.min.css",
                    "lib/assets/bulma-tooltip.min.css",
                    "lib/assets/flatpickr.css",
                    "css/site.css");

                // JavaScript Bundle - equivalent to the old bundlerconfig.json JS configuration
                pipeline.AddJavaScriptBundle("/js/site.min.js",
                    "lib/assets/amcharts5-index.js",
                    "lib/assets/amcharts5-xy.js",
                    "lib/assets/amcharts5-dark.js",
                    "lib/assets/amcharts5-radar.js",
                    "lib/assets/flatpickr.js",
                    "js/site.js");
            });

            services.Configure<GzipCompressionProviderOptions>(options =>
                {
                    options.Level = CompressionLevel.Optimal;
                }
            );

            // Configure settings
            services.Configure<AppSettings>
                (Configuration.GetSection("AppSettings"));

            // Register HttpClient for API calls to WURequest
            services.AddHttpClient<IWeatherApiService, WeatherApiService>();

            services
                .AddControllersWithViews()
                .AddRazorRuntimeCompilation();

            services.AddRazorPages().AddRazorPagesOptions(options =>
            {
                options.Conventions.AddPageRoute("/robotstxt", "/Robots.Txt");
            });
            services.AddMemoryCache();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios.
                app.UseHsts();
            }

            app.UseResponseCompression();

            app.UseCors(options => options.AllowAnyOrigin());
            app.UseHttpsRedirection();

            // Add WebOptimizer middleware BEFORE UseStaticFiles
            app.UseWebOptimizer();

            var cachePeriod = env.IsDevelopment() ? "600" : "604800";
            app.UseStaticFiles(new StaticFileOptions
            {
                OnPrepareResponse = ctx =>
                {
                    ctx.Context.Response.Headers.CacheControl = $"public, max-age={cachePeriod}";
                }
            });
            app.UseCookiePolicy();

            app.UseRouting();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHealthChecks("/healthcheck");
                endpoints.MapRazorPages();
                endpoints.MapControllerRoute("default", "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
