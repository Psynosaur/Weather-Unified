using System.Net.Http;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using WURequest.Models;
using WURequest.Services;
using WURequest.Hubs;

namespace WURequest
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<ObservationDatabaseSettings>(
                Configuration.GetSection(nameof(ObservationDatabaseSettings)));
            services.Configure<ForecastDatabaseSettings>(
                Configuration.GetSection(nameof(ForecastDatabaseSettings)));
            services.Configure<WeatherUndergroundApiSettings>(
                Configuration.GetSection(nameof(WeatherUndergroundApiSettings)));
            
            services.AddSingleton<IForecastDatabaseSettings>(sp =>
                sp.GetRequiredService<IOptions<ForecastDatabaseSettings>>().Value);
            services.AddSingleton<IObservationDatabaseSettings>(sp =>
                sp.GetRequiredService<IOptions<ObservationDatabaseSettings>>().Value);
            services.AddSingleton<IWeatherUndergroundApiSettings>(sp =>
                sp.GetRequiredService<IOptions<WeatherUndergroundApiSettings>>().Value);
            
            services.AddSingleton<IForecastService, ForecastService>();
            services.AddSingleton<IObservationsService, ObservationsService>();
            
            // Register HttpClient for external API calls with gzip decompression
            services.AddHttpClient<IForecastApiService, ForecastApiService>()
                .ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler
                {
                    AutomaticDecompression = System.Net.DecompressionMethods.GZip
                });
            
            services.AddRazorPages();
            services.AddHostedService<ForecastBackgroundService>();
            
            // Add SignalR for real-time updates
            services.AddSignalR();
            
            // CORS configuration for SignalR and API access
            // Note: SignalR requires specific origins with AllowCredentials()
            services.AddCors(c =>
            {
                c.AddPolicy("AllowOrigin", options => options.AllowAnyOrigin());
                // c.AddPolicy("AllowOrigin", options => 
                //     options.WithOrigins(
                //             "https://yourdomain.com", 
                //         )
                //         .AllowCredentials());  // Required for SignalR WebSocket connections
            });
            services.AddMemoryCache();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/error");
                app.UseHsts();
            }
            app.UseCors(options => options.AllowAnyOrigin());
            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapRazorPages();
                endpoints.MapControllerRoute("default", "{controller=Home}/{action=Index}/{id?}");
                endpoints.MapHub<WeatherHub>("/weatherhub");
            });
        }
    }
}
