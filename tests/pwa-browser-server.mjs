// Run after npm run build; open http://localhost:4179/__pwa-check in a browser.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';

const port = Number(process.argv[2] || 4179);
let stage = 'legacy';
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
const legacyWorker = `self.addEventListener('install',e=>e.waitUntil(self.skipWaiting()));
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{if(e.request.mode==='navigate'&&!new URL(e.request.url).pathname.startsWith('/__'))e.respondWith(Promise.resolve(new Response('<h1>Legacy route 404</h1>',{headers:{'Content-Type':'text/html'}})));});`;
const harness = `<!doctype html><meta charset="utf-8"><title>PicThin PWA regression</title>
<h1>PicThin PWA regression</h1><button id="run">Run migration and offline checks</button><pre id="result">Ready</pre><iframe id="page" style="width:390px;height:500px"></iframe>
<script type="module">
const output=document.querySelector('#result'),frame=document.querySelector('#page');
const check=(ok,message)=>{if(!ok)throw new Error(message); output.textContent+='\\nPASS '+message;};
const waitController=()=>new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Controller timeout')),20000);navigator.serviceWorker.addEventListener('controllerchange',()=>{clearTimeout(timer);resolve();},{once:true});});
const visit=(path)=>new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Navigation timeout')),20000);frame.onload=()=>{clearTimeout(timer);resolve(frame.contentDocument);};frame.src=path;});
const setStage=(value)=>fetch('/__stage/'+value,{method:'POST'});
const until=async(fn)=>{const end=Date.now()+10000;while(!fn()){if(Date.now()>end)throw new Error('Update notice timeout');await new Promise(resolve=>setTimeout(resolve,50));}};
document.querySelector('#run').onclick=async()=>{try{
 output.textContent='Running'; document.querySelector('#run').disabled=true;
 await setStage('legacy');
 const legacyControl=waitController();
 const registration=await navigator.serviceWorker.register('/sw.js',{updateViaCache:'none'});
 await legacyControl;
 let doc=await visit('/compress-image-to-size');
 check(doc.querySelector('h1')?.textContent==='Legacy route 404','Old worker reproduces new-route 404');
 await setStage('current');
 const newControl=waitController(); await registration.update(); await newControl;
 doc=await visit('/compress-image-to-size');
 check(doc.querySelector('h1')?.textContent.includes('图片压缩到指定大小'),'Updated worker loads the correct deep link');
 check(doc.querySelector('meta[name="qa-version"]')?.content==='current','Navigation receives current server HTML');
 doc.querySelector('#target-size').value='123';
 await setStage('next');
 const activeUpdate=waitController(); await registration.update(); await activeUpdate;
 await until(()=>doc.body.textContent.includes('有新版本可用'));
 check(frame.contentDocument===doc && doc.querySelector('#target-size').value==='123','Worker update shows notice without reloading or losing input');
 doc=await visit('/compress-image-to-size');
 check(doc.querySelector('meta[name="qa-version"]')?.content==='next','Cached navigation picks newer server HTML');
 await setStage('offline');
 doc=await visit('/compress-image-to-size');
 check(doc.querySelector('meta[name="qa-version"]')?.content==='next','Network failure falls back to the same cached page');
 await setStage('next');
 doc=await visit('/not-a-real-tool');
 check(doc.querySelector('h1')?.textContent==='Not found','Unknown URL does not receive a cached home-page shell');
 output.textContent+='\\nALL CHECKS PASSED';
}catch(error){output.textContent+='\\nFAIL '+error.message;}finally{await setStage('next');}};
</script>`;

createServer(async (req, res) => {
  const path = new URL(req.url, 'http://localhost:4179').pathname;
  res.setHeader('Cache-Control', 'no-store');
  if (path === '/__pwa-check') { res.setHeader('Content-Type', 'text/html'); res.end(harness); return; }
  if (path.startsWith('/__stage/') && req.method === 'POST') {
    stage = path.split('/').at(-1); res.end('ok'); return;
  }
  if (path === '/sw.js' && stage === 'legacy') { res.setHeader('Content-Type', 'text/javascript'); res.end(legacyWorker); return; }
  if (stage === 'offline' && path === '/compress-image-to-size') { req.socket.destroy(); return; }
  let relative = path === '/' ? 'index.html' : path.slice(1);
  if (!extname(relative)) relative += '.html';
  const file = resolve('dist', relative);
  if (!file.startsWith(resolve('dist') + '/')) { res.writeHead(400).end(); return; }
  try {
    let body = await readFile(file);
    if (path === '/sw.js') body = Buffer.from(body.toString() + '\n// QA worker revision: ' + stage);
    if (extname(file) === '.html') body = Buffer.from(body.toString().replace('</head>', '<meta name="qa-version" content="'+stage+'"></head>'));
    res.setHeader('Content-Type', types[extname(file)] || 'application/octet-stream');
    res.end(body);
  } catch { res.writeHead(404, { 'Content-Type': 'text/html' }); res.end('<h1>Not found</h1>'); }
}).listen(port, '127.0.0.1', () => console.log(`PWA regression: http://localhost:${port}/__pwa-check`));
