---
stoplight-id: pqf8ldgp8jj1a
---

# Frameworks

#### Details on pre-built governance frameworks and services.

Most protocol integrations will not need to implement adapters completely from scratch. For instance, several protocols make use of off-chain signalling for proposals via Snapshot, while others may use a copy of Compound's Governor contracts.

The Governance SDK ships with framework implementations that can be used as adapters by instantiating a framework instance with a minimal set of configuration, keeping protocol integrations very simple.

As the crypto ecosystem evolves and new approaches and frameworks for governance are developed, we can ensure we keep protocol integrations straightforward by staying up to date with our own standardized set of adapters.

> **Use the pre-built adapters whenever possible in protocol integrations**. This minimizes the chance that you will have to modify your protocol integration in the future, and allows you to leverage the tested and proven existing functionality already in the SDK.

