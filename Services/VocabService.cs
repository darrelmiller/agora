using Microsoft.OData.Edm;
using Microsoft.OData.Edm.Csdl;
using Microsoft.OpenApi.Models;
using Microsoft.OpenApi.OData;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Agora.Services
{
    public class VocabService
    {
        private IEnumerable<GraphIdentifier> v1vocab;
        private IEnumerable<GraphIdentifier> betavocab;

        public async Task WriteIdentifiers(IEnumerable<GraphIdentifier> matches, Stream response)
        {
            var writer = new Utf8JsonWriter(response, new JsonWriterOptions() { Indented = true });
            writer.WriteStartObject();
            writer.WritePropertyName("matches");
            writer.WriteStartArray();
            foreach (var match in matches)
            {
                writer.WriteStartObject();
                writer.WriteString("name", match.Name);
                writer.WriteString("kind", match.Kind);
                writer.WriteString("description", match.Description);
                writer.WriteString("namespace", match.Namespace);
                writer.WriteString("type", match.Type);
                writer.WriteString("version", match.Version.ToString());
                writer.WriteEndObject();
            }
            writer.WriteEndArray();
            writer.WriteEndObject();
            await writer.FlushAsync();
        }

        public async Task<IEnumerable<GraphIdentifier>> SearchVocab(string name)
        {
            if (v1vocab == null)
            {
                v1vocab = await GetVocab(GraphVersion.V1);
            }
            if (betavocab == null)
            {
                betavocab = await GetVocab(GraphVersion.Beta);
            }

            return betavocab.Where(v => v.Name.Contains(name, StringComparison.OrdinalIgnoreCase))
                .Union(v1vocab.Where(v => v.Name.Contains(name, StringComparison.OrdinalIgnoreCase)))
                .OrderBy(i => i.Name + i.Version);
        }

        public async Task<IEnumerable<GraphIdentifier>> GetVocab(GraphVersion version = GraphVersion.V1)
        {
            Uri csdlurl = null;
            switch (version)
            {
                case GraphVersion.Beta:
                    csdlurl = new Uri("https://raw.githubusercontent.com/microsoftgraph/msgraph-metadata/master/clean_beta_metadata/cleanMetadataWithDescriptionsbeta.xml");
                    break;

                case GraphVersion.V1:
                default:
                    csdlurl = new Uri("https://raw.githubusercontent.com/microsoftgraph/msgraph-metadata/master/clean_v10_metadata/cleanMetadataWithDescriptionsv1.0.xml");
                    break;
            }
            var identifiers = new List<GraphIdentifier>();
            var model = await GetEdmModel(csdlurl);
            foreach (var element in model.SchemaElements)
            {
                

                if (element.SchemaElementKind == EdmSchemaElementKind.TypeDefinition)
                {
                    IEdmType edmType = (IEdmType)element;
                    switch (edmType.TypeKind)
                    {
                        case EdmTypeKind.Complex:
                            identifiers.Add(CreateGraphIdentifier(version, model, element));
                            break;
                        case EdmTypeKind.Entity:
                            identifiers.Add(CreateGraphIdentifier(version, model, element));
                            var edmStructuredType = edmType as IEdmStructuredType;
                            foreach (var property in edmStructuredType.DeclaredStructuralProperties())
                            {
                                identifiers.Add(CreateIdentifier(version, model, property));
                            }
                            break;
                        case EdmTypeKind.Enum: // enum type
                            identifiers.Add(CreateGraphIdentifier(version, model, element));
                            break;

                        //case EdmTypeKind.TypeDefinition: // type definition
                        //    return context.CreateSchemaTypeDefinitionSchema((IEdmTypeDefinition)edmType);

                        case EdmTypeKind.None:
                        default:
                            break;
                    }
                }

            }
            return identifiers;
        }

        private static GraphIdentifier CreateIdentifier(GraphVersion version, IEdmModel model, IEdmStructuralProperty property)
        {
            return new GraphIdentifier()
            {
                Version = version,
                Name = property.Name,
                Description = model.GetDescriptionAnnotation(property),
                Kind = $"Property ({property.Type.ShortQualifiedName()})",
                Type = property.DeclaringType.ToString()
            };
        }

        private static GraphIdentifier CreateGraphIdentifier(GraphVersion version, IEdmModel model, IEdmSchemaElement element)
        {
            return new GraphIdentifier
            {
                Version = version,
                Name = element.Name,
                Description = model.GetDescriptionAnnotation(element),
                Namespace = element.Namespace,
                Kind = ((IEdmType)element).TypeKind.ToString()
            };
        }

        private HttpClient CreateHttpClient()
        {
            //          ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            var httpClient = new HttpClient(new HttpClientHandler()
            {
                AutomaticDecompression = DecompressionMethods.GZip
            });
            httpClient.DefaultRequestHeaders.AcceptEncoding.Add(new System.Net.Http.Headers.StringWithQualityHeaderValue("gzip"));
            httpClient.DefaultRequestHeaders.UserAgent.Add(new System.Net.Http.Headers.ProductInfoHeaderValue("graphslice", "1.0"));
            return httpClient;
        }

        private async Task<IEdmModel> GetEdmModel(Uri csdlHref)
        {

            var httpClient = CreateHttpClient();

            Stream csdl = await httpClient.GetStreamAsync(csdlHref.OriginalString);
            var edmModel = CsdlReader.Parse(XElement.Load(csdl).CreateReader());
            return edmModel;
        }

        private async Task<OpenApiDocument> CreateOpenApiDocumentAsync(Uri csdlHref)
        {

            var edmModel = await GetEdmModel(csdlHref);

            OpenApiDocument document = ConvertCsdlToOpenApi(edmModel);

            return document;
        }

        public OpenApiDocument ConvertCsdlToOpenApi(IEdmModel edmModel)
        {

            var settings = new OpenApiConvertSettings()
            {
                EnableKeyAsSegment = true,
                EnableOperationId = true,
                PrefixEntityTypeNameBeforeKey = true,
                TagDepth = 2,
                EnablePagination = true,
                EnableDiscriminatorValue = true,
                EnableDerivedTypesReferencesForRequestBody = true,
                EnableDerivedTypesReferencesForResponses = true,
                ShowLinks = true
            };
            OpenApiDocument document = edmModel.ConvertToOpenApi(settings);

            return document;
        }
    }

    public enum GraphKind
    {

    }
    public enum GraphVersion
    {
        V1,
        Beta
    }
}
