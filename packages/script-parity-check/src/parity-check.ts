import { GovernanceSDK } from '@boardroom/gov-sdk';
import protocolInfoData from '@boardroom/protocol-info';

const main = () => {
  const infos = new Map(protocolInfoData.map((i) => [i.cname, i]));
  const protocols = new Map(new GovernanceSDK().getAllProtocols().map((p) => [p.cname, p]));

  console.log('checking for SDK->protocol-info parity...');
  for (const [cname, protocol] of protocols) {
    if (!infos.has(cname)) {
      console.log(`  missing in protocol-info: ${cname}`);
    }
  }

  console.log('checking for protocol-info-SDK parity...');
  for (const [cname, info] of infos) {
    const protocol = protocols.get(cname);
    if (protocol === undefined) {
      console.log(`  missing in SDK: ${cname}`);
      console.log(`    name: ${info.name}`);
      console.log(`    description: ${info.description}`);
      if (info.snapshotSpaceName) {
        console.log(`    snapshot: ${info.snapshotSpaceName}`);
      }
      if (info.coinGeckoPriceString) {
        console.log(`    coingecko: ${info.coinGeckoPriceString}`);
      } else if (info.tokenContractAddress) {
        console.log(`    token address: ${info.tokenContractAddress}`);
      }
    } else {
      if (info.name !== protocol.name) {
        console.log(`NAME MISMATCH: ${info.cname}: protocol-info: ${info.name} sdk: ${protocol.name}`);
      }
    }
  }
};

main();
