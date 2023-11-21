import { BigNumber } from 'ethers';
import { Proposal } from '@boardroom/gov-lib';
interface ExecutablesParams {
    targets: string[];
    values?: BigNumber[];
    signatures?: string[];
    calldatas: string[];
}
export declare const getFunctionsSignatures: (abi: any, functionNames: string[]) => string[];
export declare const getFunctionsSelectorsWithInputs: (abi: any, functionNames: string[]) => Record<string, string[]>;
export declare const getSelectorFromFunctionSignature: (functionSignature: string) => string;
export declare const getSelectorsFromFunctionsSignatures: (functionsSignatures: string[]) => string[];
export declare const makeExecutablesForProposal: ({ targets, signatures, calldatas, values, }: ExecutablesParams) => Proposal['executables'];
export {};
