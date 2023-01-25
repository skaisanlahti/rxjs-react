// helper for bundling event handlers that return their clean up function
export function createGroupStarter(startFuncs: Function[]) {
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
