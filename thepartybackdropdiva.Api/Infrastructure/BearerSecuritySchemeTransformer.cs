using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi;

namespace thepartybackdropdiva.Api.Infrastructure;

public class BearerSecuritySchemeTransformer : IOpenApiDocumentTransformer
{
    public Task TransformAsync(OpenApiDocument document, OpenApiDocumentTransformerContext context, CancellationToken cancellationToken)
    {
        try
        {
            if (document == null) return Task.CompletedTask;

            var schemeName = JwtBearerDefaults.AuthenticationScheme;

            // 1. Define the Bearer security scheme
            var bearerScheme = new OpenApiSecurityScheme
            {
                Type = SecuritySchemeType.Http,
                Scheme = "bearer",
                BearerFormat = "JWT",
                In = ParameterLocation.Header,
                Name = "Authorization",
                Description = "Enter your JWT token: Bearer {token}"
            };

            // 2. Ensure components are initialized
            document.Components ??= new OpenApiComponents();
            
            if (document.Components.SecuritySchemes == null)
            {
                try { document.Components.SecuritySchemes = new Dictionary<string, IOpenApiSecurityScheme>(); }
                catch { /* Ignore if read-only, but usually it's not */ }
            }
            
            if (document.Components.SecuritySchemes != null && !document.Components.SecuritySchemes.ContainsKey(schemeName))
            {
                document.Components.SecuritySchemes.Add(schemeName, bearerScheme);
            }

            // 3. Create a security requirement referencing the scheme
            var securityReference = new OpenApiSecuritySchemeReference(schemeName, document);
            var securityRequirement = new OpenApiSecurityRequirement
            {
                [securityReference] = new List<string>()
            };

            // 4. Apply the requirement to ALL operations
            if (document.Security == null)
            {
                try { document.Security = new List<OpenApiSecurityRequirement>(); }
                catch { }
            }
            
            if (document.Security != null)
            {
                bool alreadyApplied = false;
                foreach (var req in document.Security)
                {
                    if (req != null && req.Keys.Any(k => k is OpenApiSecuritySchemeReference r && r.Reference?.Id == schemeName))
                    {
                        alreadyApplied = true;
                        break;
                    }
                }

                if (!alreadyApplied)
                {
                    document.Security.Add(securityRequirement);
                }
            }
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"FATAL ERROR in BearerSecuritySchemeTransformer: {ex.GetType().Name} - {ex.Message}");
            Console.Error.WriteLine(ex.StackTrace);
            throw;
        }

        return Task.CompletedTask;
    }
}
