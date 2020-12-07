using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace Agora.Services
{
    public class OpenApiService
    {
        HttpClient _client;

        public OpenApiService(IHttpClientFactory clientFactory)
        {
            _client = clientFactory.CreateClient("default");
        }

        public async Task<OpenApiDocument> ConvertCsdlUntilOpenApiDocumentAsync(string csdl)
        {
            var devXClient = new DevXClient(_client);

            var doc = await devXClient.OpenApi.ToRequest(p => {
                p.Style = "PowerShell";
                p.OperationIds = "*";
            }).PostAsync(csdl);

            return doc;
        }

        private Dictionary<string, OpenApiDocument> _TemporaryCache = new Dictionary<string, OpenApiDocument>();
        public async Task<OpenApiDocument> GetOpenApiDocumentAsync(string version)
        {
            if (_TemporaryCache.ContainsKey(version))
            {
                return _TemporaryCache[version];
            }
            var devXClient = new DevXClient(_client);

            var doc = await devXClient.OpenApi.ToRequest(p => { 
                p.GraphVersion = version;
                p.OperationIds = "*"; 
            }).GetAsync();

            _TemporaryCache[version] = doc;
            return doc;
        }
    }
}
