export function startAll(startFuncs: Function[]) {
  return function start() {
    const stopFuncs: Function[] = [];
    for (const startFunc of startFuncs) {
      stopFuncs.push(startFunc());
    }

    return function stop() {
      for (const stopFunc of stopFuncs) {
        stopFunc();
      }
    };
  };
}
