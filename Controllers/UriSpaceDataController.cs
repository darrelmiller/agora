
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using System.Collections.Generic;
using System.Linq;
using Microsoft.OData.Edm;
using Microsoft.OpenApi.Models;
using System.IO;
using System.Net.Http;
using System.Net;
using Microsoft.OData.Edm.Csdl;
using System.Xml.Linq;
using Microsoft.OpenApi.OData;
using Microsoft.OData.Edm.Vocabularies;
using Agora.Services;
using Microsoft.Net.Http.Headers;

namespace Agora
{
    [ApiController]
    [Route("[controller]")]
    public class UriSpaceDataController : ControllerBase
    {

        private readonly ILogger<UmlDiagramController> _logger;
        private readonly VocabService vocabService;

        public UriSpaceDataController(ILogger<UmlDiagramController> logger, VocabService vocabService)
        {
            _logger = logger;
            this.vocabService = vocabService;
        }


        [HttpGet]
        public IActionResult Get(string name)
        {
            // Get OpenAPI.
            // Walk the PathItems.
            // Walk the path Segments
            // Add to a tree.  
            // Return the tree
            var assembly = this.GetType().Assembly;
            Stream resource = assembly.GetManifestResourceStream("Agora.Controllers.UriSpaceSample.json");
            return new FileStreamResult(resource, new MediaTypeHeaderValue("application/json"));
        }


    }


}
