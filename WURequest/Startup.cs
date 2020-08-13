using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using WURequest.Models;
using WURequest.Services;

namespace WURequest
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
            services.Configure<ObservationDatabaseSettings>(
                Configuration.GetSection(nameof(ObservationDatabaseSettings)));

            services.AddSingleton<IObservationDatabaseSettings>(sp =>
                sp.GetRequiredService<IOptions<ObservationDatabaseSettings>>().Value);
            services.AddSingleton<ObservationsService>();
            
            services.Configure<ForecastDatabaseSettings>(
                Configuration.GetSection(nameof(ForecastDatabaseSettings)));

            services.AddSingleton<IForecastDatabaseSettings>(sp =>
                sp.GetRequiredService<IOptions<ForecastDatabaseSettings>>().Value);
            services.AddSingleton<ForecastService>();
            
            services.Configure<ArduinoDatabaseSettings>(
                Configuration.GetSection(nameof(ArduinoDatabaseSettings)));

            services.AddSingleton<IArduinoDatabaseSettings>(sp =>
                sp.GetRequiredService<IOptions<ArduinoDatabaseSettings>>().Value);
            services.AddSingleton<ArduinoService>();
            
            services.Configure<WuApiSettings>(
                Configuration.GetSection(nameof(WuApiSettings)));

            services.AddSingleton<IWuApiSettings>(sp =>
                sp.GetRequiredService<IOptions<WuApiSettings>>().Value);

            services.AddRazorPages();
            services.AddHostedService<ForecastBackgroundService>();
            services.AddHostedService<ArduinoBackgroundService>();
            services.AddCors(c =>
            {
                c.AddPolicy("AllowOrigin", options => options.AllowAnyOrigin());
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
            });
        }
    }
}
