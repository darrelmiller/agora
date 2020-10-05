using System;
using System.Collections.Generic;

namespace Agora {
    public class ResourceStore {

        // This class needs some way to limit memory consumption
        private Dictionary<string, byte[]> _Store = new Dictionary<string, byte[]>();

        public byte[] GetItem(string id) {
            if ( _Store.TryGetValue(id, out byte[] value)) {
            return _Store[id];
            } else {
                throw new ArgumentException($"{id} not found");
            }
        }

        public void SetItem(string id, byte[] value) {
            _Store[id] = value;
        }
    }
}