
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Agora
{
    [ApiController]
    [Route("[controller]")]
    public class UmlDiagramController : ControllerBase
    {

        private readonly ILogger<UmlDiagramController> _logger;
        private readonly ResourceStore _resourceStore;

        public UmlDiagramController(ILogger<UmlDiagramController> logger, ResourceStore resourceStore)
        {
            _logger = logger;
            _resourceStore = resourceStore;
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

    }
}
