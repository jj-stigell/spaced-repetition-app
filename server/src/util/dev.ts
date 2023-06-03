// Temporary wait timer to check functionality of components
export async function waiter(time: number): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/typedef
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}