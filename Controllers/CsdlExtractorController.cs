using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Agora.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CSDLExtractorController : ControllerBase
    {
        [HttpPost]
        public async Task Post(string filename = "input.csdl")
        {
            await StripCsdlFromMarkdown2(Request.Body, Response.Body);
            
            
        }

        private async Task StripCsdlFromMarkdown2(Stream input, Stream output)
        {
            var streamWriter = new StreamWriter(output);
            var streamReader = new StreamReader(input);

            await streamWriter.WriteAsync(@"<edmx:Edmx xmlns:edmx='http://docs.oasis-open.org/odata/ns/edmx' Version='4.0'>
                <edmx:DataServices>
                <Schema Namespace='microsoft.graph' alias='graph'
                    xmlns='http://docs.oasis-open.org/odata/ns/edm'
                    xmlns:ags='http://aggregator.microsoft.com/internal'
                    xmlns:odata='http://schemas.microsoft.com/oDataCapabilities'>");


            bool copying = false;
            string line;

            do
            {
                line = await streamReader.ReadLineAsync();

                if (line == null)  // End of stream
                {
                    break;
                }

                if (line.StartsWith("```xml"))
                {
                    copying = true;
                }
                else if (line.StartsWith("```"))
                {
                    copying = false;
                }
                else if (copying == true)
                {
                    await streamWriter.WriteLineAsync(line);
                }
            } while (line != null);

            await streamWriter.WriteLineAsync("</Schema");
            await streamWriter.WriteLineAsync("</edmx:DataServices>");
            await streamWriter.WriteLineAsync("</edmx:Edmx>");

            await streamWriter.FlushAsync();
        }
    }
}
