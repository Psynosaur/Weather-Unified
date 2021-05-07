using System;
using System.IO.Compression;
using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using WURequest.Models;
using WURequest.Services;


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
                // options.Providers.Add<BrotliCompressionProvider>();
                options.Providers.Add<GzipCompressionProvider>();
                options.MimeTypes = 
                    ResponseCompressionDefaults.MimeTypes.Concat(
                        new[]
                        {
                            "text/*",
                            "text/css",
                            "application/javascript",
                            "text/javascript",
                            "text/json",
                            "application/json"
                        });
            });
            // services.Configure<BrotliCompressionProviderOptions>(options =>
            //     {
            //         options.Level = CompressionLevel.Fastest;
            //     }
            // );
            services.Configure<GzipCompressionProviderOptions>(options =>
                {
                    options.Level = CompressionLevel.Optimal;
                }
            );
            services.Configure<AppSettings>
                (Configuration.GetSection("AppSettings"));
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
                app.UseExceptionHandler("/error");
                app.UseHsts();
            }
            app.Use(async (context,next) =>
            {
                var url = context.Request.Path.Value;
                
                // Does the url contain "home" or "Home"
                if (url.IndexOf("/home/",StringComparison.OrdinalIgnoreCase) >= 0)
                {
                    var suburl = url.Substring(url.IndexOf("/home/", StringComparison.OrdinalIgnoreCase) + 6);
                    // rewrite and continue processing
                    context.Request.Path = "/" + suburl;
                }

                await next();
                if (context.Response.StatusCode == 404 && !context.Response.HasStarted)
                {
                    string originalPath = context.Request.Path.Value;
                    context.Items["originalPath"] = originalPath;
                    context.Request.Path = "/error";
                    await next();
                }
            });
            app.UseRobotsTxt(builder =>
                builder
                    .AddSection(section => 
                        section
                            .AddComment("Allow All")
                            .AddUserAgent("*")
                            .Allow("/")
                    )
                    // .AddSection(section => 
                    //     section
                    //         .AddComment("Disallow the rest")
                    //         .AddUserAgent("*")
                    //         .AddCrawlDelay(TimeSpan.FromSeconds(10))
                    //         .Disallow("/")
                    // )
                    .AddSitemap("https://cptsats.co.za/sitemap.xml")
                    .AddSitemap("https://weatheru.co.za/sitemap.xml")
            );
            app.UseResponseCompression();
            app.UseCors(options => options.AllowAnyOrigin());
            app.UseHttpsRedirection();
            var cachePeriod = env.IsDevelopment() ? "600" : "604800";
            app.UseStaticFiles(new StaticFileOptions
            {
                OnPrepareResponse = ctx =>
                {
                    ctx.Context.Response.Headers.Append("Cache-Control", $"public, max-age={cachePeriod}");
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
