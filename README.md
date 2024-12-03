# Governance SDK

The Governance SDK is a portable protocol agnostic governance interoperability framework built for NodeJS and the browser. It makes it easier for developers to query and interact with protocol governance in a normalized way by leveraging community-authored protocol integrations.

Our goal is to ensure adding protocol integrations is as streamlined as possible and flexible enough to capture the functionalities of differing governance frameworks. To do this, we will focus on enabling the most common and frequently-used governance interactions in order to prioritize a horizontal-first approach to integrations.

For usage and guides on actually using the SDK, see the GitBook documentation:

* https://docs.boardroom.info/sdk/governance-sdk

The in-repo documentation will primarily focus on architecture and implementation details.

## Getting help

If you have questions, concerns, bug reports, etc, please file an issue in this repository's Issue Tracker.

You can also reach out to us in our discord at https://discord.com/invite/CEZ8WfuK8s

## Repo Structure

The project is structured as a monorepo managed by lerna.

### Package Topology

<p align="center"><img width="500" alt="Screen Shot 2021-09-21 at 2 52 34 PM" src="https://user-images.githubusercontent.com/644088/134240349-112b0eb6-a0f8-4794-9903-c62f217447a5.png"></p>

* [gov-lib](packages/gov-lib) - Core interopability models, adapter interfaces, and utility code. No protocol- or framework-specific code.
* [gov-adapters](packages/gov-adapters) - Adapter implementations for various frameworks (such as `SnapshotAdapter`, `CoinGeckoAdapter`)
* [gov-protocols](packages/gov-protocols) - Uses adapter implementations from `gov-adapters` to "wire up" protocol integrations
* [gov-sdk](packages/gov-sdk) - Combines all of the above with a simple `GovernanceSDK` facade. The main package SDK consumers will install.

### Scripts

* Packages should implement any cleanup of build artifacts, caches, etc in an optional `clean` npm script.

## Architecture

<img width="1136" alt="Screen Shot 2021-09-22 at 8 47 54 AM" src="https://user-images.githubusercontent.com/644088/134356125-5ba3f4e6-7749-47a5-8014-5c79227ab527.png">

The Client (SDK consumer) must instantiate the GovernanceSDK from the `gov-sdk` package, optionally providing a subset of various _transports_ that interact with external data sources.

The SDK manages the collection of _protocol integrations_, which are defined by imperative _protocol registration functions_ in `gov-protocols`. These functions register information about a protocol and instantiate _adapter instances_ that that implement the _adapter interfaces_ defined by the core `gov-lib` package.

Common _adapter implementations_ are shipped in the `gov-adapters` package for governance frameworks.

### Design Rationale

* The injected pattern with transports is to ensure that the SDK consumer can provide their own implementation for talking to external data sources. This allows all SDK code to depend on simple transport interfaces fullfilled by client- and environment-specific implementations. This also provides a good path for unit testing via mocked transports.
* The seperation of adpater interfaces (in `gov-lib`) and their implementation (in `gov-adapters`) is intentional. Adapter interfaces ideally can be fullfilled by _several different implementations_, as we want to abstract downstream differences behind our interopability model.
* Protocol registration functions are imperative to allow for more sophisticated or complex approaches to protocol integrations. This allows a single function to register several protocols at once (DAOHaus), or enable environment-specific logic (conditionally registering test protocols), or use registion abstractions/utilities in the future.
* Protocols are _composed-of_ adapter instances. This ensures that as we expand our interop model to accomodate more types of data and interaction, we have the design space to add more functionality without having to break backwards compatability. The library of adapter interfaces will continue to grow, while SDK client code can rely on old adapters working as they do today.

## Development

### Testing and Configuration for using the reference client

The reference client can be used to test each aspect of the sdk. 

A .env file will need to be created within /gov-sdk/packages/client-reference and API keys for various services will need to be added. To have every feature working within the reference client all keys will need to be added however most features will work with just the Alchemy key for the respective chain you are wishing to test on or the Snapshot API key if testing Snapshot protocols.

An example .env file without any keys:
```
ALCHEMY_MAINNET_KEY=""
ALCHEMY_OPTIMISM_KEY=""
ALCHEMY_ARBITRUM_KEY=""
ALCHEMY_GOERLI_KEY=""
BOARDROOM_API_KEY=""
ETHERSCAN_MAINNET_API_KEY=""
ETHERSCAN_OPTIMISM_API_KEY=""
SNAPSHOT_API_KEY=""
```

Within the ProtocolInfo.tsx file set the protocol cname to test as well as the adapter type and an address for vote power testing if applicable. 

```
  // Add the cnames of any protocols to test here
  const protocolsToTest = ['ens'];
  // Framework instance to test with. (default/snapshot/onchain)
  const instancesToTest = ['onchain'];
  // Add address that should have voting power here
  const votePowerAddress = '0x8d5237037A590A2dB531F3CfB8f42605cF306f34';
```

Features within the ProtocolInfo.tsx file can be commented out to turn them on or off when running the client.

Run the reference client in debug mode (reloads on changes):

```
$ npm run client:dev
```

### Requirements:

* NodeJS v16 (`nvm` recommended)

Install all dependencies in all packages and bootstrap the monorepo:

```
$ npm i
```

Lint and validate all TypeScript:

```
$ npm run lint
```

Run all TypeScript unit tests:

```
$ npm test
```

Build all packages (not required for normal local dev / testing):

```
$ npm run build
```

To assert no regressions in package exports:

```
$ npm run test:package-snapshots
```

Remove all build artifacts:

```
$ npm run clean
```

Remove all build artifacts and dependencies in all packages:

```
$ npm run nuke
```

## Publishing

Several packages from this monorepo are published to npm as transient dependencies of the main `@boardroom/gov-sdk` package.

To publish, make sure you have built all package artifacts:

```
$ npm run build
```

Then bump the packaged based on conventional commits (detects major vs minor vs patch). **This will push the tags and commit to the remote as well**

```
$ npm run version:bump
```

Finally, publish to npm:

```
$ npm run publish
```

If you are using VS Code, there is "🚀 Rebuild, tag, and publish a new version" task that executes all of the above.

## Additional Scripts

Run the reference client in debug mode (reloads on changes):

```
$ npm run client:dev
```

To compile the reference client (not using the `build` command because we don't need to the client to build alongside the actual library packages, this is mostly to assert client-side compilation works with the SDK):

```
$ npm run client:compile
```

Re-build the package outputs and re-run any snapshot tests:

```
$ npm run snapshots:update
```

Check the parity with the `protocol-Info` repo (ensure latest package version in `./packages/script-parity-check/package.json`):

```
$ npm run parity:check
```

### Additional Automation

* `.github/workflows` for GitHub action automation. This can be setup to gate PRs with certain build/test conditions or eventually automatically publish to NPM if desired
* `.vscode/tasks.json` for VS Code specific tasks. Because not everyone will use VS Code, this should strictly be convenient shortcuts for other scripts
* `package.json` for all npm scripts

## License

MIT
