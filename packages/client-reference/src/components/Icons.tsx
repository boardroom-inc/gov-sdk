import React, { FunctionComponent, useEffect, useState } from 'react';
import { IconInfo, Protocol } from '@boardroom/gov-sdk';

interface Props {
  protocol: Protocol;
  instance?: string;
}

export const Icon: FunctionComponent<Props> = ({ protocol, instance = 'default' }) => {
  const [icon, setIcon] = useState<IconInfo | undefined>(undefined);

  const fetchIcon = async () => {
    if (!protocol.hasAdapter('icons', instance)) {
      return;
    }
    const resp = await protocol.adapter('icons', instance).getIcons();
    setIcon(resp);
  };

  useEffect(() => {
    fetchIcon();
  }, []);

  return (
    <>
      {icon && <img src={icon.icons[0].url} />}
    </>
  );
};
