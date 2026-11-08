import { prerenderToNodeStream } from 'react-dom/static';
import App from './App.jsx';
import { renderToString } from 'react-dom/server';

export async function render(route, content) {
  const element = <App initialRoute={route} initialContent={content} />;
  const { prelude } = await prerenderToNodeStream(element);
  // Resolve lazy boundaries, then emit HTML without CSP-incompatible patch scripts.
  for await (const chunk of prelude) { if (!chunk) throw new Error('Empty prerender chunk'); }
  return renderToString(element);
}
