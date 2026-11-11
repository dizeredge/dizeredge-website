'use strict';
const toast = message => { const el=document.querySelector('.toast'); el.textContent=message; el.classList.add('visible'); clearTimeout(el.timer); el.timer=setTimeout(()=>el.classList.remove('visible'),3500); };
document.querySelectorAll('[data-copy]').forEach(button=>button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(button.dataset.copy);toast('Checksum copied.');}catch{toast('Copy unavailable. Select the checksum text to copy it.');}}));
const search=document.querySelector('#doc-search');
search?.addEventListener('input',()=>{const query=search.value.toLocaleLowerCase().trim();let count=0;document.querySelectorAll('[data-search]').forEach(card=>{card.hidden=!card.dataset.search.toLocaleLowerCase().includes(query);if(!card.hidden)count++;});document.querySelector('.search-status').textContent=`${count} ${count===1?'guide':'guides'} found`;document.querySelector('.no-results').hidden=count!==0;});
const digest=async bytes=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');
document.querySelector('.download-trigger')?.addEventListener('click',async event=>{
  const button=event.currentTarget,status=document.querySelector('.download-status'),panel=document.querySelector('.download-progress'),progress=document.querySelector('#package-progress');
  const original=button.textContent;button.disabled=true;panel.hidden=false;progress.value=0;
  let objectUrl;
  try{
    if(!globalThis.crypto?.subtle)throw new Error('Secure download verification needs HTTPS or a localhost preview.');
    const response=await fetch(button.dataset.manifest,{cache:'no-store'});if(!response.ok)throw new Error('Download information is unavailable. Please retry.');
    const manifest=await response.json();
    if(!Number.isSafeInteger(manifest.bytes)||manifest.bytes<=0||manifest.bytes>256*1024*1024||!Array.isArray(manifest.chunks)||manifest.chunks.length>32||!/^[a-f0-9]{64}$/.test(manifest.sha256)||!/^DizerEdge-[\w.-]+\.(exe|apk)$/.test(manifest.filename))throw new Error('Invalid download information.');
    const bytes=new Uint8Array(manifest.bytes);let offset=0;
    for(const part of manifest.chunks){const url=new URL(part.url,location.href);if(url.origin!==location.origin||!url.pathname.includes('/packages/'))throw new Error('Invalid package location.');status.textContent=`Preparing download… ${Math.floor(offset/manifest.bytes*100)}%`;const r=await fetch(url);if(!r.ok)throw new Error('A download segment is unavailable. Check your connection and retry.');const data=new Uint8Array(await r.arrayBuffer());if(data.length!==part.bytes||offset+data.length>bytes.length||await digest(data)!==part.sha256)throw new Error('Download integrity check failed. Please retry.');bytes.set(data,offset);offset+=data.length;progress.value=Math.floor(offset/manifest.bytes*100);}
    status.textContent='Verifying package…';if(offset!==bytes.length||await digest(bytes)!==manifest.sha256)throw new Error('Package checksum mismatch. The file was not saved.');
    const blob=new Blob([bytes],{type:manifest.filename.endsWith('.apk')?'application/vnd.android.package-archive':'application/octet-stream'});objectUrl=URL.createObjectURL(blob);const link=document.createElement('a');link.href=objectUrl;link.download=manifest.filename;document.body.append(link);link.click();link.remove();status.textContent='Verified. Your browser download has started. Check your Downloads folder, then follow the installation guide.';toast('Package verified. Download started.');
  }catch(error){status.textContent=error instanceof Error?error.message:'Download failed. Please retry.';toast('Download could not complete. See the message below the button.');}
  finally{button.disabled=false;button.textContent=original;panel.hidden=true;if(objectUrl)setTimeout(()=>URL.revokeObjectURL(objectUrl),60000);}
});
