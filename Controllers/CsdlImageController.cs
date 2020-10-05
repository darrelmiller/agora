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
        private readonly ResourceStore _resourceStore;

        public CsdlImageController(ILogger<CsdlImageController> logger, ResourceStore resourceStore)
        {
            _logger = logger;
            _resourceStore = resourceStore;
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

            var idx = Guid.NewGuid().ToString();
            _resourceStore.SetItem(idx, bytes);

            var url = this.Url.Action("Get","UmlDiagram", new {id = idx });
            return Created(url, null);
        }
    }
}
