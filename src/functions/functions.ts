export async function sleep (ms: number): Promise<unknown> {
  return await new Promise(resolve => setTimeout(resolve, ms))
}
