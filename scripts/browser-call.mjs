// CDP serializes arguments independently of the function's source code.
export async function callBrowserFunction(send, fn, args = []) {
  const context = await send('Runtime.evaluate', { expression: 'globalThis' });
  if (context.exceptionDetails || !context.result?.objectId) throw new Error('Browser execution context unavailable');
  const result = await send('Runtime.callFunctionOn', {
    objectId: context.result.objectId,
    functionDeclaration: fn.toString(),
    arguments: args.map(value => ({ value })),
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || 'Browser function failed');
  return result.result.value;
}
