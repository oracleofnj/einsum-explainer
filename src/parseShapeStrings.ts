function parseShapeString(shapeString: string): number[] {
  const strippedShapeString = shapeString.replace(/[^\d,]/g, " ");

  return strippedShapeString.split(",").map(s => parseInt(s.trim(), 10));
}

export { parseShapeString };
