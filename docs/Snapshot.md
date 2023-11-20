---
stoplight-id: 8lsbppbbk3o1w
---

# Snapshot

Snapshot is an off-chain signalling platform that uses signed payloads to create and vote on proposals. It provides a public API that can be used to query for proposal information.

> Check out Snapshot's "Hub API" here: https://docs.snapshot.org/hub-api

### Using the Adapter:
A new protocol which uses **Snapshot** can be added to sdk by registering it as follows 

```js
import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { SnapshotProposalsAdapter } from '@boardroom/gov-adapters';

export const register: ProtocolRegistrationFunction = (register, transports) => {
  const cname = 'aavegotchi';

  register({
    cname,
    name: 'Aavegotchi',
    adapters: (adapters) => {
      const snapshot = new SnapshotProposalsAdapter(
        'aavegotchi.eth', //snapshot space name
        transports,
        cname
      );

      // ... other adapters
      adapters.implement('proposals', snapshot);
    },
  });
};
```