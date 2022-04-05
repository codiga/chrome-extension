export const mutationsCallback =
  (callback: Function) => (mutationsList: { type: string }[]) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        callback();
      }
    }
  };