using Microsoft.OpenApi.Models;
using Microsoft.OpenApi.Readers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace Agora.Services
{
    public class DevXClient: BaseRequestBuilder
    {
        

        public DevXClient(HttpClient httpClient, string path = "https://graphexplorerapi.azurewebsites.net/") : base(httpClient, path) 
        {
        }

        public OpenAPIRequestBuilder OpenApi { get 
            {
                return new OpenAPIRequestBuilder(this.httpClient, Path + "openapi"); 
            }
        }

        public class OpenAPIRequestBuilder : BaseRequestBuilder
        {

            public OpenAPIRequestBuilder(HttpClient httpClient, string path) : base(httpClient, path)
            {
            }

            public TypedQueryBuilder ToRequest()
            {
                return ToRequest(q => { });
            }

            public TypedQueryBuilder ToRequest(Action<TypedQueryParameters> configure)
            {
                var qParams = new TypedQueryParameters();
                configure(qParams);
                QueryParameters = qParams;
                return new TypedQueryBuilder(this);
            }

            public class TypedQueryBuilder
            {
                private readonly BaseRequestBuilder builder;
                public TypedQueryBuilder(BaseRequestBuilder builder)
                {
                    this.builder = builder;
                }

                public async Task<OpenApiDocument> GetAsync()
                {
                    var response = await builder.SendAsync(builder.ToHttpRequestMessage());
                    return await ResponseMachine.HandleOpenApiDocumentResponseAsync(response);
                }

                public async Task<OpenApiDocument> PostAsync(string csdl = null)
                {
                    var request = builder.ToHttpRequestMessage();
                    request.Method = HttpMethod.Post;
                    if (csdl != null) {
                        request.Content = new StringContent(csdl);
                    }
                    var response = await builder.SendAsync(request);
                    return await ResponseMachine.HandleOpenApiDocumentResponseAsync(response);
                }
            }
            public class TypedQueryParameters : BaseQueryParameters
            {
                public string OperationIds
                {
                    get { return GetValue("operationids", ""); }
                    set { SetValue("operationids", value); }
                }

                public string GraphVersion { 
                    get { return GetValue("graphversion","v1.0"); }
                    set { SetValue("graphversion",value); } 
                }
                public string Style {
                    get { return GetValue("style", "PowerShell"); }
                    set { SetValue("style", value); }
                }
            }
        }
    }

    public static class ResponseMachine {

        public static async Task<OpenApiDocument> HandleOpenApiDocumentResponseAsync(HttpResponseMessage response)
        {
            // What should the failure modes of this method be?

            if (response.IsSuccessStatusCode)
            {
                var openApiStream = await response.Content.ReadAsStreamAsync();
                var reader = new OpenApiStreamReader();
                var doc = reader.Read(openApiStream, out var diag);
                // how do we handle diag errors
                // catch exceptions
                return doc;
            }
            else
            {
                throw new Exception("Request failed");
            }
        }    
    }

    public class BaseRequestBuilder
    {
        protected readonly HttpClient httpClient;

        public string Path { get; set; }
        public BaseQueryParameters QueryParameters { get; set; }
        
        public BaseRequestBuilder(HttpClient httpClient, string path)
        {
            this.httpClient = httpClient;
            Path = path;
        }
        public async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request)
        {
            var response = await this.httpClient.SendAsync(request);
            return response;
        }

        public HttpRequestMessage ToHttpRequestMessage()
        {
            var uriBuilder = new UriBuilder(Path)
            {
                Query = this.QueryParameters.ToQueryString()
            };
            return new HttpRequestMessage() {
                RequestUri = uriBuilder.Uri 
            };
        }
    }

    public class BaseQueryParameters
    {
        private  Dictionary<string, string> parameters = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        public string ToQueryString()
        {
            return string.Join('&', parameters.Select(p => p.Key + "=" + p.Value).ToArray()) ;
        }

        protected string GetValue(string key, string defaultValue)
        {
            return parameters.TryGetValue(key, out string graphVersion) ? graphVersion : defaultValue;
        }

        protected void SetValue(string key, string value)
        {
            parameters[key] = value;
        }

    }
}
