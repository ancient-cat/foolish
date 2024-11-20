export const wait = (duration: number) => {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, duration);
  });
};

export const create_cooldown = (timeout: number) => {
  let timer = timeout;

  return {
    update: (delta: number) => {
      timer = Math.max(timer - delta, 0);
    },
    ready: () => {
      return timer <= 0;
    },
    restart: () => {
      timer = timeout;
    },
  };
};
