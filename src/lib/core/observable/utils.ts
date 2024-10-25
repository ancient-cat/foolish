export const mount_all = (...t: any[]) => {
  let list: CallableFunction[] = [];

  list.push(...t);

  const unsub_all = () => {
    for (const cb of list) {
      if (typeof cb === "function") {
        cb();
      }
    }
    list = [];
  };

  return unsub_all;
};
