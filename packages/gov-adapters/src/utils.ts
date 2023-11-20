import { ethers, utils, BigNumber } from 'ethers';
import { ProposalCreated } from './compound/contract-bravo';
import { Proposal } from '@boardroom/gov-lib';

interface ExecutablesParams {
  targets: string[];
  values?: BigNumber[];
  signatures?: string[];
  calldatas: string[];
}

export const getFunctionsSignatures = (abi: any, functionNames: string[]): string[] => {
  const functionSignatures = functionNames.map((functionName: string) => {
    const func = abi.find((item: any) => item.type === 'function' && item.name === functionName);
    let functionSignature = functionName + '(';
    func!.inputs.forEach((input: any) => {
      functionSignature += input.type;
      functionSignature += ',';
    });
    if (functionSignature.slice(-1) === ',') {
      functionSignature = functionSignature.slice(0, -1) + ')';
    }
    return functionSignature;
  });
  return functionSignatures;
};

export const getFunctionsSelectorsWithInputs = (abi: any, functionNames: string[]): Record<string, string[]> => {
  const selectorsAndInputs: Record<string, string[]> = {};
  for (const functionName of functionNames) {
    const func = abi.find((item: any) => item.type === 'function' && item.name === functionName);
    let functionSignature = functionName + '(';
    let functionInputs: string[] = [];
    func!.inputs.forEach((input: any) => {
      functionInputs.push(input.name);
      functionSignature += input.type;
      functionSignature += ',';
    });
    if (functionSignature.slice(-1) === ',') {
      functionSignature = functionSignature.slice(0, -1) + ')';
    }
    const selector = getSelectorFromFunctionSignature(functionSignature);
    selectorsAndInputs[selector] = functionInputs;
  };
  return selectorsAndInputs;
};

export const getSelectorFromFunctionSignature = (functionSignature: string): string => {
  const functionSignatureHash = utils.id(functionSignature);
  //get first 4 bytes
  return functionSignatureHash.slice(0, 10);
};

export const getSelectorsFromFunctionsSignatures = (functionsSignatures: string[]): string[] => {
  const selectors = functionsSignatures.map((functionSignature: string) => {
    return getSelectorFromFunctionSignature(functionSignature);
  });
  return selectors;
};

/* helper function to make executables for a proposal
  @param targets - array of contract addresses
  @param signatures - array of function signatures
  @param calldatas - array of calldata
  @param values - array of values
  @returns array of executables

  this function handles nested signature functions by splitting the signature by paranthesis
  and then decoding the calldata using the param types
*/

export const makeExecutablesForProposal = ({
  targets,
  signatures,
  calldatas,
  values,
}: ExecutablesParams): Proposal['executables'] => {
  const executables: Proposal['executables'] = targets.map((target, targetIndex) => {
    const signature = signatures ? signatures[targetIndex] : '';
    const calldata = calldatas[targetIndex];
    const value = values ? values[targetIndex]?.toNumber() : 0;
    let params = {};

    try {
      if (signature) {
        const firstFunctionParanthesis = signature.indexOf('(') + 1;
        const lastFunctionParanthesis = signature.lastIndexOf(')');
        const paramTypes = [];

        for (let index = firstFunctionParanthesis; index < lastFunctionParanthesis; index++) {
          let type = '';
          let nested = 0;

          while (index < lastFunctionParanthesis && (signature[index] !== ',' || nested > 0)) {
            type += signature[index];
            if (signature[index] === '(') {
              nested++;
            } else if (signature[index] === ')') {
              nested--;
            }
            index++;
          }

          paramTypes.push(type.trim());
        }

        const decodedParams = ethers.utils.defaultAbiCoder.decode(paramTypes, calldata);
        params = paramTypes.reduce((acc, type, i) => {
          const value = decodedParams[i];
          return {
            ...acc,
            [type]: value.toString(),
          };
        }, {});
      }
    } catch (e) {
      console.log('error decoding params', e);
    }
    return {
      target,
      signature,
      calldata,
      value,
      params,
    };
  });

  return executables;
};
