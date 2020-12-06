﻿
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
using Microsoft.OpenApi.Readers;
using System.Collections.Immutable;

namespace Agora
{
    [ApiController]
    [Route("[controller]")]
    public class UriSpaceDataController : ControllerBase
    {

        private readonly ILogger<UmlDiagramController> _logger;
        private readonly VocabService vocabService;
        private readonly IHttpClientFactory clientFactory;

        public UriSpaceDataController(ILogger<UmlDiagramController> logger, VocabService vocabService, IHttpClientFactory clientFactory)
        {
            _logger = logger;
            this.vocabService = vocabService;
            this.clientFactory = clientFactory;
        }


        [HttpPost]
        public async Task Post()
        {
            var csdl = await new StreamReader(Request.Body).ReadToEndAsync();

            var openApiService = new OpenApiService(clientFactory);
            
            var v1Doc = await openApiService.GetOpenApiDocumentAsync("v1.0");
            var urlspace = OpenApiUrlSpaceNode.Create(v1Doc,"v1");

            var betaDoc = await openApiService.GetOpenApiDocumentAsync("beta");
            urlspace.Attach(betaDoc, "beta");

            // Get OpenAPI for current CSDL.
            try
            {
                var currentReview = await openApiService.ConvertCsdlUntilOpenApiDocumentAsync(csdl);
                urlspace.Attach(currentReview, "current");
            }
            catch
            {
                // Show the tree anyway
            }

            //Response.ContentType = "application/json";
            //Response.StatusCode = 200;
            RenderJSON(urlspace, Response.Body);
        }


        private static void RenderJSON(OpenApiUrlSpaceNode urlspace, Stream outfile)
        {
            var writer = new Utf8JsonWriter(outfile);
            RenderJSON(writer, urlspace);
            writer.FlushAsync();
            
        }

        static void RenderJSON(Utf8JsonWriter writer, OpenApiUrlSpaceNode node)
        {
            writer.WriteStartObject();
            writer.WriteString("segment", node.Segment);
            writer.WriteString("layer", node.Layer);

            if (node.Children.Count() > 0)
            {
                writer.WriteStartArray("children");
                foreach (var child in node.Children.ToImmutableSortedDictionary().Values)
                {
                    RenderJSON(writer, child);
                }
                writer.WriteEndArray();
            }
            writer.WriteEndObject();
        }


    }


}
