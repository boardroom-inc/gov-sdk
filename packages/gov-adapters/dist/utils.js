"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeExecutablesForProposal = exports.getSelectorsFromFunctionsSignatures = exports.getSelectorFromFunctionSignature = exports.getFunctionsSelectorsWithInputs = exports.getFunctionsSignatures = void 0;
const ethers_1 = require("ethers");
const getFunctionsSignatures = (abi, functionNames) => {
    const functionSignatures = functionNames.map((functionName) => {
        const func = abi.find((item) => item.type === 'function' && item.name === functionName);
        let functionSignature = functionName + '(';
        func.inputs.forEach((input) => {
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
exports.getFunctionsSignatures = getFunctionsSignatures;
const getFunctionsSelectorsWithInputs = (abi, functionNames) => {
    const selectorsAndInputs = {};
    for (const functionName of functionNames) {
        const func = abi.find((item) => item.type === 'function' && item.name === functionName);
        let functionSignature = functionName + '(';
        let functionInputs = [];
        func.inputs.forEach((input) => {
            functionInputs.push(input.name);
            functionSignature += input.type;
            functionSignature += ',';
        });
        if (functionSignature.slice(-1) === ',') {
            functionSignature = functionSignature.slice(0, -1) + ')';
        }
        const selector = (0, exports.getSelectorFromFunctionSignature)(functionSignature);
        selectorsAndInputs[selector] = functionInputs;
    }
    ;
    return selectorsAndInputs;
};
exports.getFunctionsSelectorsWithInputs = getFunctionsSelectorsWithInputs;
const getSelectorFromFunctionSignature = (functionSignature) => {
    const functionSignatureHash = ethers_1.utils.id(functionSignature);
    //get first 4 bytes
    return functionSignatureHash.slice(0, 10);
};
exports.getSelectorFromFunctionSignature = getSelectorFromFunctionSignature;
const getSelectorsFromFunctionsSignatures = (functionsSignatures) => {
    const selectors = functionsSignatures.map((functionSignature) => {
        return (0, exports.getSelectorFromFunctionSignature)(functionSignature);
    });
    return selectors;
};
exports.getSelectorsFromFunctionsSignatures = getSelectorsFromFunctionsSignatures;
/* helper function to make executables for a proposal
  @param targets - array of contract addresses
  @param signatures - array of function signatures
  @param calldatas - array of calldata
  @param values - array of values
  @returns array of executables

  this function handles nested signature functions by splitting the signature by paranthesis
  and then decoding the calldata using the param types
*/
const makeExecutablesForProposal = ({ targets, signatures, calldatas, values, }) => {
    const executables = targets.map((target, targetIndex) => {
        var _a;
        const signature = signatures ? signatures[targetIndex] : '';
        const calldata = calldatas[targetIndex];
        const value = values ? (_a = values[targetIndex]) === null || _a === void 0 ? void 0 : _a.toNumber() : 0;
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
                        }
                        else if (signature[index] === ')') {
                            nested--;
                        }
                        index++;
                    }
                    paramTypes.push(type.trim());
                }
                const decodedParams = ethers_1.ethers.utils.defaultAbiCoder.decode(paramTypes, calldata);
                params = paramTypes.reduce((acc, type, i) => {
                    const value = decodedParams[i];
                    return {
                        ...acc,
                        [type]: value.toString(),
                    };
                }, {});
            }
        }
        catch (e) {
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
exports.makeExecutablesForProposal = makeExecutablesForProposal;
//# sourceMappingURL=utils.js.map