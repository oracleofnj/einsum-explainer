use ndarray::prelude::*;
use ndarray::LinalgScalar;
use ndarray_einsum_beta::*;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use wasm_bindgen::prelude::*;

//////// Versions that accept strings for WASM interop below here ////
#[derive(Debug, Serialize, Deserialize)]
pub struct OperandSizes(Vec<Vec<usize>>);

#[derive(Debug, Serialize, Deserialize)]
pub struct FlattenedOperand<T> {
    pub shape: Vec<usize>,
    pub contents: Vec<T>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FlattenedOperandList<T>(pub Vec<FlattenedOperand<T>>);

fn unflatten_operand<A: LinalgScalar>(
    flattened_operand: &FlattenedOperand<A>,
) -> Result<ArrayD<A>, ndarray::ShapeError> {
    Array::from_shape_vec(
        flattened_operand.shape.clone(),
        flattened_operand.contents.clone(),
    )
}

fn flatten_operand<A: LinalgScalar>(unflattened_operand: &ArrayD<A>) -> FlattenedOperand<A> {
    FlattenedOperand {
        shape: Vec::from(unflattened_operand.shape()),
        contents: unflattened_operand.iter().map(|x| *x).collect::<Vec<A>>(),
    }
}

pub fn validate_and_size_from_shapes_as_string(
    input_string: &str,
    operand_shapes_as_str: &str,
) -> Result<SizedContraction, &'static str> {
    match serde_json::from_str::<OperandSizes>(&operand_shapes_as_str) {
        Err(_) => Err("Error parsing operand shapes into Vec<Vec<usize>>"),
        Ok(OperandSizes(operand_shapes)) => {
            SizedContraction::from_string_and_shapes(input_string, &operand_shapes)
        }
    }
}

pub fn einsum_path_with_flattened_operands<A: LinalgScalar>(
    input_string: &str,
    flattened_operands: &[&FlattenedOperand<A>],
) -> Result<EinsumPath<A>, &'static str> {
    let maybe_operands = flattened_operands
        .iter()
        .map(|x| unflatten_operand(*x))
        .collect::<Result<Vec<_>, _>>();
    match maybe_operands {
        Err(_) => Err("Could not unpack one or more flattened operands"),
        Ok(operands) => {
            let mut operand_refs: Vec<&dyn ArrayLike<A>> = Vec::new();
            for operand in operands.iter() {
                operand_refs.push(operand);
            }
            einsum_path(input_string, &operand_refs, OptimizationMethod::Naive)
        }
    }
}

pub fn einsum_with_flattened_operands<A: LinalgScalar>(
    input_string: &str,
    flattened_operands: &[&FlattenedOperand<A>],
) -> Result<ArrayD<A>, &'static str> {
    let maybe_operands = flattened_operands
        .iter()
        .map(|x| unflatten_operand(*x))
        .collect::<Result<Vec<_>, _>>();
    match maybe_operands {
        Err(_) => Err("Could not unpack one or more flattened operands"),
        Ok(operands) => {
            let mut operand_refs: Vec<&dyn ArrayLike<A>> = Vec::new();
            for operand in operands.iter() {
                operand_refs.push(operand);
            }
            einsum(input_string, &operand_refs)
        }
    }
}

pub fn einsum_path_with_flattened_operands_as_string_generic<A>(
    input_string: &str,
    flattened_operands_as_string: &str,
) -> Result<EinsumPath<A>, &'static str>
where
    A: LinalgScalar + serde::de::DeserializeOwned,
{
    let maybe_flattened_operands =
        serde_json::from_str::<FlattenedOperandList<A>>(flattened_operands_as_string);
    match maybe_flattened_operands {
        Err(_) => Err("Could not parse flattened operands"),
        Ok(FlattenedOperandList(owned_flattened_operands)) => {
            let flattened_operands: Vec<_> = owned_flattened_operands.iter().map(|x| x).collect();
            einsum_path_with_flattened_operands(input_string, &flattened_operands)
        }
    }
}

pub fn einsum_with_flattened_operands_as_string_generic<A>(
    input_string: &str,
    flattened_operands_as_string: &str,
) -> Result<ArrayD<A>, &'static str>
where
    A: LinalgScalar + serde::de::DeserializeOwned,
{
    let maybe_flattened_operands =
        serde_json::from_str::<FlattenedOperandList<A>>(flattened_operands_as_string);
    match maybe_flattened_operands {
        Err(_) => Err("Could not parse flattened operands"),
        Ok(FlattenedOperandList(owned_flattened_operands)) => {
            let flattened_operands: Vec<_> = owned_flattened_operands.iter().map(|x| x).collect();
            einsum_with_flattened_operands(input_string, &flattened_operands)
        }
    }
}

pub fn einsum_path_with_flattened_operands_as_flattened_json_string(
    input_string: &str,
    flattened_operands_as_string: &str,
) -> Result<String, &'static str> {
    let maybe_result = einsum_path_with_flattened_operands_as_string_generic::<f64>(
        input_string,
        flattened_operands_as_string,
    )?;
    Ok(format!("{:?}", maybe_result))
}

pub fn einsum_with_flattened_operands_as_flattened_json_string(
    input_string: &str,
    flattened_operands_as_string: &str,
) -> Result<FlattenedOperand<f64>, &'static str> {
    let maybe_result = einsum_with_flattened_operands_as_string_generic::<f64>(
        input_string,
        flattened_operands_as_string,
    )?;
    Ok(flatten_operand(&maybe_result))
}

////////////////////////// WASM stuff below here ///////////////////////
#[derive(Serialize)]
#[serde(remote = "Contraction")]
struct ContractionDef {
    pub operand_indices: Vec<Vec<char>>,
    pub output_indices: Vec<char>,
    pub summation_indices: Vec<char>,
}

#[derive(Debug, Serialize)]
pub struct ContractionWrapper(#[serde(with = "ContractionDef")] Contraction);

#[derive(Debug, Serialize)]
pub struct ContractionResult(Result<ContractionWrapper, &'static str>);

fn wrap_validate(input_string: &str) -> ContractionResult {
    match validate(input_string) {
        Ok(result) => ContractionResult(Ok(ContractionWrapper(result))),
        Err(e) => ContractionResult(Err(e)),
    }
}

#[wasm_bindgen(js_name = validateAsJson)]
pub fn validate_as_json(input_string: &str) -> String {
    match serde_json::to_string(&wrap_validate(input_string)) {
        Ok(s) => s,
        _ => String::from("{\"Err\": \"Serialization Error\"}"),
    }
}

#[derive(Serialize)]
#[serde(remote = "SizedContraction")]
struct SizedContractionDef {
    #[serde(with = "ContractionDef")]
    contraction: Contraction,
    output_size: HashMap<char, usize>,
}

#[derive(Debug, Serialize)]
pub struct SizedContractionWrapper(#[serde(with = "SizedContractionDef")] SizedContraction);

#[derive(Debug, Serialize)]
pub struct SizedContractionResult(Result<SizedContractionWrapper, &'static str>);

fn wrap_validate_and_size(input_string: &str, operand_shapes: &str) -> SizedContractionResult {
    match validate_and_size_from_shapes_as_string(input_string, operand_shapes) {
        Ok(result) => SizedContractionResult(Ok(SizedContractionWrapper(result))),
        Err(e) => SizedContractionResult(Err(e)),
    }
}

#[wasm_bindgen(js_name = validateAndSizeFromShapesAsStringAsJson)]
pub fn validate_and_size_from_shapes_as_string_as_json(
    input_string: &str,
    operand_shapes: &str,
) -> String {
    match serde_json::to_string(&wrap_validate_and_size(input_string, operand_shapes)) {
        Ok(s) => s,
        _ => String::from("{\"Err\": \"Serialization Error\"}"),
    }
}

#[derive(Debug, Serialize)]
pub struct EinsumPathResult(Result<String, &'static str>);

#[wasm_bindgen(js_name = einsumPathAsJson)]
pub fn einsum_path_with_flattened_operands_as_json_string_as_json(
    input_string: &str,
    flattened_operands_as_string: &str,
) -> String {
    match serde_json::to_string(&EinsumPathResult(
        einsum_path_with_flattened_operands_as_flattened_json_string(
            input_string,
            flattened_operands_as_string,
        ),
    )) {
        Ok(s) => s,
        _ => String::from("{\"Err\": \"Serialization Error\"}"),
    }
}

#[derive(Debug, Serialize)]
pub struct EinsumResult<T>(Result<FlattenedOperand<T>, &'static str>);

#[wasm_bindgen(js_name = slowEinsumAsJson)]
pub fn einsum_with_flattened_operands_as_json_string_as_json(
    input_string: &str,
    flattened_operands_as_string: &str,
) -> String {
    match serde_json::to_string(&EinsumResult(
        einsum_with_flattened_operands_as_flattened_json_string(
            input_string,
            flattened_operands_as_string,
        ),
    )) {
        Ok(s) => s,
        _ => String::from("{\"Err\": \"Serialization Error\"}"),
    }
}
