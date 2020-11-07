using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using CsdlToPlant;
using System.IO;
using PlantUml.Net;
using System.Net.Http;
using System.Text.Unicode;
using System.Text;
using System.Net.Http.Headers;

namespace Agora
{
    [ApiController]
    [Route("[controller]")]
    public class CsdlValidationController : ControllerBase
    {
        private readonly ILogger<CsdlImageController> _logger;
        private readonly ResourceStore _resourceStore;
        private readonly HttpClient _client;

        public CsdlValidationController(ILogger<CsdlImageController> logger, ResourceStore resourceStore, IHttpClientFactory clientFactory)
        {
            _logger = logger;
            _resourceStore = resourceStore;
            _client = clientFactory.CreateClient("default");
        }

        [HttpPost]
        public async Task<IActionResult> Post(string filename = "input.csdl" )
        {
            var csdl = await new StreamReader(Request.Body).ReadToEndAsync();

            var form = new MultipartFormDataContent();
            var csdlContent = new StringContent(csdl,UTF8Encoding.UTF8,"text/plain");
            //csdlContent.Headers.Add("Content-Disposition","form-data; name=CurrentSchema; filename=test.csdl; filename*=utf-8''test.csdl");
            form.Add(csdlContent,"CurrentSchema","test.csdl");
            form.Add(new StringContent("false"),"TextResponse");
            form.Add(new StringContent("false"),"SchemaValidationOnly");
            form.Add(new StringContent("beta"),"Version");
            form.Add(new StringContent("prd"),"TargetEndpoint");
            var request = new HttpRequestMessage() {
                RequestUri = new Uri("https://gmm.ags.msidentity.com/v1/validate"), //https://gmmservice.azurewebsites.net/v1/validate
                Method = HttpMethod.Post,
                Content = form
            };

            var response = await _client.SendAsync(request);
            if (response.IsSuccessStatusCode) {
                var jsonResponse = await response.Content.ReadAsStringAsync();
                return new ContentResult() {
                    Content = jsonResponse,
                    ContentType = "application/json"
                };
            } else {
                return BadRequest();
            }
        }
    }
}
