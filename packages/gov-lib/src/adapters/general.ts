import { Static, Type } from '@sinclair/typebox';
import { compileAdapterValidator } from '../adapter-validator';
import { ResponseValidator } from '../validation';
import { ChainId, Framework } from './common';
import { PaginationOptions } from '../pagination';

export type TransferEvent = Static<typeof TransferEvent>;
export const TransferEvent = Type.Object({
  from: Type.String(),
  to: Type.String(),
  value: Type.String(),
  txHash: Type.String(),
});

/**
 * A paginated list of delegation events
 */
export type TransferEventPage = Static<typeof TransferEventPage>;
export const TransferEventPage = Type.Object({
  items: Type.Array(TransferEvent),
  nextCursor: Type.Optional(Type.String()),
});

export interface GeneralAdapter {
  getTransferEvents: (pagination?: PaginationOptions) => Promise<TransferEventPage>;
}

export const generalAdapterValidators: ResponseValidator<GeneralAdapter> = {
  getTransferEvents: compileAdapterValidator(TransferEventPage),
};
