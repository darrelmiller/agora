namespace Agora.Services
{
    public class GraphIdentifier
    {
        public GraphVersion Version { get; set; }
        public string Type { get; set; }
        public string Namespace { get; set; }
        public string Name { get; set; }
        public string Kind { get; set; }
        public string Description { get; set; }
        public bool Required { get; set; }
    }
}
