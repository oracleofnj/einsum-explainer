function parseShapeString(shapeString: string): number[] {
  const strippedShapeString = shapeString.replace(/[^\d,]/g, " ");
  const trailingCommaRemoved = strippedShapeString.replace(/,\s*$/, "");

  return trailingCommaRemoved.split(",").map(s => parseInt(s.trim(), 10));
}

export { parseShapeString };
