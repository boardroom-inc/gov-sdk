---
stoplight-id: os4tn0rqs3sth
---

# Adapters

**Adapters** are what connect the messy world of external data sources for different protocols (blockchain, IPFS, web2 APIs, etc) into the normalized world of the Governance SDK.

**Adapter Interfaces** define standardized units of composable governance functionality. Each adapter interface handles a single, focused area of responsibility such as interacting with proposals or querying token information.

Adapter Interfaces can be implemented by **Adapter Implementations** that each protocol must announce during protocol registration. A protocol can implement several adapters, even multiple instances of the same type.

**Adapter responses** are validated at run-time to ensure the implementation is correctly adhering to the spec defined by the SDK. This mapping logic can be tested by writing unit tests with mocked transports.

While a protocol can always implement an adapter from scratch to handle any custom mapping logic, often times it can simply use one of the SDK's provided Governance Frameworks that implement adapters for most of the common use cases.

