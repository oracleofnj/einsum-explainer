export default function range(start: number, stop?: number, step: number = 1) {
  if (step === 0) {
    throw new Error("range: step must not be zero");
  }
  if (stop === undefined) {
    stop = start;
    start = 0;
  }
  const result: number[] = [];
  let val = start;
  while (val < stop) {
    result.push(val);
    val += step;
  }
  return result;
}
