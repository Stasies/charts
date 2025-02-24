export function roundToNiceNumber(num: number) {
  const magnitude = Math.pow(10, Math.floor(Math.log10(num)));
  const normalized = num / magnitude;
  let rounded = Math.ceil(normalized)

  return rounded * magnitude;
}