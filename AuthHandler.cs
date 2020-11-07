using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Identity.Client;

namespace Agora
{
    public class AuthHandler : DelegatingHandler
    {
        private readonly IConfidentialClientApplication application;

        public AuthHandler(IConfidentialClientApplication application )
        {
            this.application = application;
        }
        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            if (request.RequestUri.Host == "gmmservice.azurewebsites.net")
            {
                var authRequest = application.AcquireTokenForClient(new string[] { "25d1b53f-d05d-4aef-a9e2-c8f83208ffa2/.default" });
                var authResult = await authRequest.ExecuteAsync();
                request.Headers.Add("Authorization", authResult.CreateAuthorizationHeader());
            }
            return await base.SendAsync(request, cancellationToken);
        }
    }
}