---
stoplight-id: gpbnpp7csjuma
---

Explain adapter overview

List adapters:
**Proposals**:
  `ProposalsAdapter` interface specifies methods that must be implemented by a protocol adapter to support querying proposals, events, and votes.
The methods include:
-   `getFramework():` Retrieves the framework metadata.
-   `getProposals(pagination?: PaginationOptions):` Fetches a paginated list of proposals.
-   `getProposalEvents(pagination?: PaginationOptions):` Retrieves a paginated list of proposal events.
-   `getVotes(pagination?: PaginationOptions):` Fetches a paginated list of votes cast for a proposal.
-   `getExternalLink():` Returns an external link associated with the proposal.
-   `getChainId():` Retrieves the chain ID of the protocol.

Ex: *getProposals*

CreateOnChainProposal
CreateProposal
Delegation
Icon
MolochVoteAdapter
Token
Treasury
VotePower
Vote

Ex: *castVote*

List Governanace Frameworks:
Aave
Compound
Council
Moloch
Maker
NounsBuilder
Nouns
Openzepplin
snapshot
TornadoCash

How to use Frameworks and Adapters to create a protocol registration function

```
import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CoinGeckoAdapter, CovalentAdapter, SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerAbachi: ProtocolRegistrationFunction = (register, transports, snapshotApiKey) => {
  const cname = 'abachi';
  register({
    cname: cname,
    name: 'Abachi',
    category: ['Product'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({ spaceName: 'abachi.eth', transports, cname, snapshotApiKey, boardroomAPIKey });
      const coingecko = new CoinGeckoAdapter('abachi', transports);
      const treasury = new CovalentAdapter('0x6FcE4c6CDd8C4e6C7486553D09BdD9aEE61cF095', 1, transports);
      adapters.implement('proposals', snapshot, 'snapshot');
      adapters.implement('createProposal', snapshot, 'snapshot');
      adapters.implement('vote', snapshot, 'snapshot');
      adapters.implement('votePower', snapshot, 'snapshot');
      adapters.implement('token', coingecko);
      adapters.implement('treasury', treasury);
      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/abachi_QMqu2wkfu.png',
              },
            ],
          };
        },
      });
    },
  });
};

```

How to use protocol registration for registering a   


