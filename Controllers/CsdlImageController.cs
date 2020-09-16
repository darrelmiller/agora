using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using CsdlToPlant;
using System.IO;
using PlantUml.Net;

namespace Agora
{
    [ApiController]
    [Route("[controller]")]
    public class CsdlImageController : ControllerBase
    {

        private readonly ILogger<CsdlImageController> _logger;

        public CsdlImageController(ILogger<CsdlImageController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> Post(string filename = "input.csdl" )
        {
            var csdl = await new StreamReader(Request.Body).ReadToEndAsync();

            var generator = new PlantConverter();
            var plant = generator.EmitPlantDiagram(csdl, filename);

            var factory = new RendererFactory();

            var renderer = factory.CreateRenderer(new PlantUmlSettings() );

            var bytes = await renderer.RenderAsync(plant, OutputFormat.Svg);

            return new FileContentResult(bytes, new Microsoft.Net.Http.Headers.MediaTypeHeaderValue("image/svg+xml"));
        }
    }
}
