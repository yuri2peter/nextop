export function sleep(time: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

/**
 * 等待，直到checker返回true
 * @param checker 检查函数
 * @param interval 检查间隔
 * @param timeout 超时则报错，默认0表示不启用
 * @returns
 */
export async function waitUntil(
  checker: (() => boolean) | (() => Promise<boolean>),
  interval = 100,
  timeout = 0,
): Promise<void> {
  return new Promise((resolve, reject) => {
    let passed = false;
    const itv = setInterval(async () => {
      const checked = await checker();
      if (checked) {
        clearInterval(itv);
        passed = true;
        resolve();
      }
    }, interval);
    if (timeout) {
      setTimeout(() => {
        if (!passed) {
          clearInterval(itv);
          reject(new Error("Wait timeout."));
        }
      }, timeout);
    }
  });
}

export function retry<TArgs extends unknown[], TRes>(
  task: (...args: TArgs) => Promise<TRes>,
  options: { retryTimes?: number; interval?: number } = {},
) {
  const { retryTimes = 3, interval = 3000 } = options;
  return async (...args: TArgs) => {
    let times = retryTimes;
    while (times > 0) {
      try {
        return await task(...args);
      } catch (error) {
        console.warn("Error occurred, retrying.", error);
        times--;
        if (retryTimes <= 0) {
          throw new Error("Task ran out of retries");
        }
      }
      await sleep(interval);
    }
    throw new Error("Task ran out of retries");
  };
}
