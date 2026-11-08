// Local Chrome DevTools client. No browser package or external service is needed.
export async function browserSession() {
  const target = await fetch('http://127.0.0.1:9222/json/new?about:blank', { method: 'PUT' }).then(r => r.json());
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let id = 0;
  const pending = new Map();
  const events = [];
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    if (message.id) {
      const entry = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) entry?.reject(new Error(JSON.stringify(message.error)));
      else entry?.resolve(message.result);
    } else events.push(message);
  };
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const requestId = ++id;
    pending.set(requestId, { resolve, reject });
    socket.send(JSON.stringify({ id: requestId, method, params }));
  });
  const evaluate = async expression => {
    const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text + ': ' + result.exceptionDetails.exception?.description);
    return result.result.value;
  };
  await send('Page.enable');
  await send('Page.bringToFront');
  await send('Runtime.enable');
  await send('Network.enable');
  // QA must never send a form or request an embedded external map.
  await send('Network.setBlockedURLs', { urls: ['*google.com*', '*googleapis.com*', '*gstatic.com*'] });
  return { send, evaluate, events, close: async () => { socket.close(); await fetch(`http://127.0.0.1:9222/json/close/${target.id}`); } };
}

export const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
