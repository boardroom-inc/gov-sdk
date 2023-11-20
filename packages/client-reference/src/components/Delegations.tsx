import { JsonRpcTransport, Protocol } from '@boardroom/gov-sdk';
import React, { FunctionComponent, useEffect, useState } from 'react';

interface Props {
  protocol: Protocol;
  instance?: string;
  delegationAddress?: string;
  rpc?: JsonRpcTransport;
}

export const Delegations: FunctionComponent<Props> = ({ protocol, instance, delegationAddress }) => {
  const account = delegationAddress;
  const [delegates, setDelegates] = useState<any[]>([]);
  
  const fetch = async () => {
    if (!account || !protocol.hasAdapter('delegation', instance)) {
      return;
    }
    const userDelegations = await protocol.adapter('delegation', instance).getDelegations([delegationAddress]);
    const userDelegates = userDelegations.map(a => a.addressDelegatedTo);
    if (userDelegates) {
      setDelegates(userDelegates);
    }
  };
  

  useEffect(() => {
    fetch();
  }, [account]);

  return (
    <>
        <div>
            delegates: 
        </div>
        {delegates && delegates.map((d)=><div>{d}</div>)}
        <br />
    </>
  );
};
