export interface Count {
  id?: string;
  value: number;
}

export function increment(count: Count, input: number | void): Count {
  const newCount = { ...count };
  if (!input) newCount.value = newCount.value + 1;
  else newCount.value = newCount.value + input;
  return newCount;
}

export function decrement(count: Count, input: number | void): Count {
  const newCount = { ...count };
  if (!input) newCount.value = newCount.value - 1;
  else newCount.value = newCount.value - input;
  return newCount;
}

export function reset(count: Count): Count {
  const newCount = { ...count };
  newCount.value = 0;
  return newCount;
}
