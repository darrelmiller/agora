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

namespace Agora
{
    [ApiController]
    [Route("[controller]")]
    public class OpenApiController : ControllerBase
    {

        private readonly ILogger<CsdlImageController> _logger;
        private readonly ResourceStore _resourceStore;

        public OpenApiController(ILogger<CsdlImageController> logger, ResourceStore resourceStore)
        {
            _logger = logger;
            _resourceStore = resourceStore;
        }

        [HttpPost]
        public async Task<IActionResult> Post()
        {
           
            var csdl = await new StreamReader(Request.Body).ReadToEndAsync();
            OpenApiDocument doc;
            
            try {
                doc = ConvertCsdlToOpenApi(csdl);
            } catch(Exception ex) {
                return BadRequest(ex.Message);
            }

            var stream = new MemoryStream();
            var sr = new StreamWriter(stream);
            var writer = new OpenApiYamlWriter(sr);
            doc.SerializeAsV3(writer);
            sr.Flush();

            var bytes = stream.ToArray();

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
