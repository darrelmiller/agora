using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.IO;
using Microsoft.OpenApi.Models;
using Microsoft.OData.Edm.Csdl;
using Microsoft.OpenApi.OData;
using System.Xml.Linq;
using Microsoft.OpenApi.Writers;
using System.Net.Http;
using System.Text;
using Agora.Services;

namespace Agora
{
    [ApiController]
    [Route("[controller]")]
    public class OpenApiController : ControllerBase
    {

        private readonly ILogger<CsdlImageController> _logger;
        private readonly ResourceStore _resourceStore;
        private readonly HttpClient _client;
        private OpenApiService _openApiService;

        public OpenApiController(ILogger<CsdlImageController> logger, ResourceStore resourceStore, IHttpClientFactory clientFactory)
        {
            _logger = logger;
            _resourceStore = resourceStore;
            _client = clientFactory.CreateClient("default");
            _openApiService = new OpenApiService(clientFactory);
        }

        
        [HttpPost]
        public async Task<IActionResult> Post()
        {
           
            var csdl = await new StreamReader(Request.Body).ReadToEndAsync();

            var request = new HttpRequestMessage()
            {
                RequestUri = new Uri("https://graphexplorerapi.azurewebsites.net/openapi?operationIds=*&style=PowerShell"),
                Method = HttpMethod.Post,
                Content = new StringContent(csdl)
            };

            Stream openApiStream;
            var response = await _client.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                openApiStream = await response.Content.ReadAsStreamAsync();
            }
            else
            {
                return BadRequest(await response.Content.ReadAsStringAsync());
            }

            var bytes = ReadAllBytes(openApiStream);

            var idx = Guid.NewGuid().ToString();
            _resourceStore.SetItem(idx, bytes);

            var url = this.Url.Action("Get","OpenApi", new {id = idx });
            Response.Headers.Add("Content-Location",url);

           return new ContentResult() {
               Content = UTF32Encoding.UTF8.GetString(bytes),
               ContentType = "text/plain",
               StatusCode = 200
           };
        }

         [HttpGet]
        public IActionResult Get(string id )
        {

            try {
                var bytes = _resourceStore.GetItem(id);
                return new FileContentResult(bytes, new Microsoft.Net.Http.Headers.MediaTypeHeaderValue("image/svg+xml"));

            } catch {
                return NotFound(id);
            }
        }

        private static OpenApiDocument ConvertCsdlToOpenApi(string csdl)
        {
            var edmModel = CsdlReader.Parse(XElement.Parse(csdl).CreateReader());

            var settings = new OpenApiConvertSettings()
            {
                EnableKeyAsSegment = true,
                EnableOperationId = false,
                PrefixEntityTypeNameBeforeKey = true,
                TagDepth = 2,
                EnablePagination = false,
                EnableDiscriminatorValue = false,
                EnableDerivedTypesReferencesForRequestBody = false,
                EnableDerivedTypesReferencesForResponses = false //,
//                ShowRootPath = true,
//                ShowLinks = true`
            };
            OpenApiDocument document = edmModel.ConvertToOpenApi(settings);

            return document;
        }

        public byte[] ReadAllBytes(Stream source)
        {
            long originalPosition = source.Position;
            source.Position = 0;

            try
            {
                byte[] readBuffer = new byte[4096];
                int totalBytesRead = 0;
                int bytesRead;
                while ((bytesRead = source.Read(readBuffer, totalBytesRead, readBuffer.Length - totalBytesRead)) > 0)
                {
                    totalBytesRead += bytesRead;
                    if (totalBytesRead == readBuffer.Length)
                    {
                        int nextByte = source.ReadByte();
                        if (nextByte != -1)
                        {
                            byte[] temp = new byte[readBuffer.Length * 2];
                            Buffer.BlockCopy(readBuffer, 0, temp, 0, readBuffer.Length);
                            Buffer.SetByte(temp, totalBytesRead, (byte)nextByte);
                            readBuffer = temp;
                            totalBytesRead++;
                        }
                    }
                }

                byte[] buffer = readBuffer;
                if (readBuffer.Length != totalBytesRead)
                {
                    buffer = new byte[totalBytesRead];
                    Buffer.BlockCopy(readBuffer, 0, buffer, 0, totalBytesRead);
                }
                return buffer;
            }
            finally
            {
                source.Position = originalPosition;
            }
        }

    }

    public class HttpContentResult : IActionResult
    {
        private HttpContent content;

        public HttpContentResult(HttpContent content)
        {
            this.content = content;
        }
        public async Task ExecuteResultAsync(ActionContext context)
        {
            var response = context.HttpContext.Response;
            foreach(var header in content.Headers) {
                response.Headers.Add(header.Key, new Microsoft.Extensions.Primitives.StringValues(header.Value.ToArray()));
            }
            await this.content.CopyToAsync(response.Body);
            await response.Body.FlushAsync();
        }
    }
}
