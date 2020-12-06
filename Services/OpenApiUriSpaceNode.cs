using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Agora
{
    public class OpenApiUrlSpaceNode
    {
        public IDictionary<string, OpenApiUrlSpaceNode> Children { get; set; } = new Dictionary<string, OpenApiUrlSpaceNode>();
        public string Segment;
        public string Layer;

        public OpenApiPathItem PathItem { get; set; }
        public OpenApiUrlSpaceNode(string segment)
        {
            Segment = segment;
        }
        
        public bool IsParameter()
        {
            return Segment.StartsWith("{");
        }

        public bool IsFunction()
        {
            return Segment.Contains("(");
        }

        public string Identitifer
        {
            get
            {
                string identifier;
                if (IsParameter())
                {
                    identifier = Segment.Substring(1, Segment.Length - 2).Replace("-","");
                    identifier = FirstUpperCase(identifier);
                }
                else
                {
                    identifier = FirstUpperCase(Segment).Replace("()", "").Replace("-", "");
                    var openParen = identifier.IndexOf("(");
                    if (openParen >= 0 )
                    {
                        identifier = identifier.Substring(0, openParen);
                    }
                }
                return identifier;
            }
        }
        private string FirstUpperCase(string input)
        {
            if (input.Length == 0) return input;
            return Char.ToUpper(input[0]) + input.Substring(1);
        }

        public static OpenApiUrlSpaceNode Create(OpenApiDocument doc, string layer)
        {
            OpenApiUrlSpaceNode root = null; 

            var paths = doc?.Paths;
            if (paths != null) {
                root = new OpenApiUrlSpaceNode("");

                foreach (var path in paths)
                {
                    root.Attach(path.Key, path.Value, layer);
                }
            }
            return root;
        }

        public void Attach(OpenApiDocument doc, string layer)
        {
            var paths = doc?.Paths;
            if (paths != null)
            {
                foreach (var path in paths)
                {
                    this.Attach(path.Key, path.Value, layer);
                }
            }
        }

        public OpenApiUrlSpaceNode Attach(string path, OpenApiPathItem pathItem, string layer)
        {
            if (path.StartsWith("/"))  // remove leading slash
            {
                path = path.Substring(1);
            }
            var segments = path.Split('/');
            return Attach(segments, pathItem, layer);
        }

        private OpenApiUrlSpaceNode Attach(IEnumerable<string> segments, OpenApiPathItem pathItem, string layer)
        {

            var segment = segments.FirstOrDefault();
            if (string.IsNullOrEmpty(segment))
            {
                if (PathItem == null)
                {
                    PathItem = pathItem;
                    Layer = layer;
                }
                return this;
            }

            // If the child segment has already been defined, then insert into it
            if (Children.ContainsKey(segment))
            {
                return Children[segment].Attach(segments.Skip(1), pathItem, layer);
            } 
            else
            {
                var node = new OpenApiUrlSpaceNode(segment);
                Children[segment] = node;
                return node.Attach(segments.Skip(1), pathItem, layer);
            }
        }
    }

}
