
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

namespace Agora
{
    [ApiController]
    [Route("[controller]")]
    public class GraphIdentifiersController : ControllerBase
    {

        private readonly ILogger<UmlDiagramController> _logger;
        private readonly VocabService vocabService;

        public GraphIdentifiersController(ILogger<UmlDiagramController> logger, VocabService vocabService)
        {
            _logger = logger;
            this.vocabService = vocabService;
        }


        [HttpGet]
        public async Task Get(string name)
        {
            var identifiers = await vocabService.SearchVocab(name);
            await vocabService.WriteIdentifiers(identifiers, this.Response.Body);
        }


    }


}
