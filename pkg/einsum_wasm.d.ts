/* tslint:disable */
/**
* @param {string} input_string 
* @returns {string} 
*/
export function validateAsJson(input_string: string): string;
/**
* @param {string} input_string 
* @param {string} operand_shapes 
* @returns {string} 
*/
export function validateAndSizeFromShapesAsStringAsJson(input_string: string, operand_shapes: string): string;
/**
* @param {string} input_string 
* @param {string} flattened_operands_as_string 
* @returns {string} 
*/
export function einsumPathAsJson(input_string: string, flattened_operands_as_string: string): string;
/**
* @param {string} input_string 
* @param {string} flattened_operands_as_string 
* @returns {string} 
*/
export function slowEinsumAsJson(input_string: string, flattened_operands_as_string: string): string;

/**
* If `module_or_path` is {RequestInfo}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {RequestInfo | BufferSource | WebAssembly.Module} module_or_path
*
* @returns {Promise<any>}
*/
export default function init (module_or_path: RequestInfo | BufferSource | WebAssembly.Module): Promise<any>;
        