using Agora.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace Agora
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
            services.AddControllersWithViews();

            var clientApp = ConfidentialClientApplicationBuilder.Create(Configuration["Agora:clientId"])
                                .WithClientSecret(Configuration["Agora:clientSecret"])
                                .WithTenantId(Configuration["Agora:tenantId"])
                                .Build();
                                
            services.AddSingleton<ResourceStore>();
            services.AddSingleton<VocabService>();
            services.AddSingleton<OpenApiService>();

            services.AddHttpClient("default", (client) =>
            {

            }).AddHttpMessageHandler(sp => { return new AuthHandler(clientApp); });
            //.AddHttpMessageHandler(sp => {
            //    var store = new LoggingInMemoryStore(sp.GetService<ILogger>());
            //    return new Tavis.HttpCache.HttpCacheHandler(new HttpClientHandler(), new HttpCache(store)); 
            //});


            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });
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
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.Options.StartupTimeout = TimeSpan.FromSeconds(120);
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }

    //public class LoggingInMemoryStore : IContentStore {
    //    private readonly ILogger logger;
    //    private InMemoryContentStore _store;
    //    public LoggingInMemoryStore(ILogger logger)
    //    {
    //        _store = new InMemoryContentStore();
    //        this.logger = logger;
    //    }

    //    public Task AddEntryAsync(CacheEntry entry, HttpResponseMessage response)
    //    {
    //        this.logger.LogInformation("Adding " + entry.Key);
    //        return _store.AddEntryAsync(entry, response);
    //    }

    //    public async Task<IEnumerable<CacheEntry>> GetEntriesAsync(CacheKey cacheKey)
    //    {
    //        this.logger.LogInformation("Trying to retrieve " + cacheKey.ToString());
    //        var result = await _store.GetEntriesAsync(cacheKey);
    //        this.logger.LogInformation("Retrieved " + result.Count() + " entries for " + cacheKey.ToString());
    //        return result;
    //    }

    //    public Task<HttpResponseMessage> GetResponseAsync(Guid variantId)
    //    {
    //        this.logger.LogInformation("Getting representation " + variantId);
    //        return _store.GetResponseAsync(variantId);
    //    }

    //    public Task UpdateEntryAsync(CacheEntry entry, HttpResponseMessage response)
    //    {
    //        this.logger.LogInformation("Updating entry " + entry.Key);
    //        return _store.UpdateEntryAsync(entry, response);
    //    }
    //}
}
