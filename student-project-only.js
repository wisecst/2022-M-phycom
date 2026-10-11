(()=>{'use strict';
const nav=window.phycomNavigation;
if(!nav)return;
const allowedId='rotation-dc-motor';
const allowed=nav.projects.find(item=>item.id===allowedId);
if(!allowed)return;
const project=Object.freeze({...allowed,enabled:true});
const projects=Object.freeze([project]);
const lessons=projects;
function choices(onSelect,items=lessons){
 const grid=document.createElement('div');grid.className='shortcut-groups';
 const rows=items.filter(item=>item.enabled&&item.id===allowedId);
 if(!rows.length)return grid;
 const section=document.createElement('section'),h=document.createElement('h3');h.textContent='Ⅲ 활용';section.append(h);
 const heading=document.createElement('h4');heading.textContent='과제';section.append(heading);
 const buttons=document.createElement('div');buttons.className='module-grid';
 for(const item of rows){const b=document.createElement('button');b.type='button';b.dataset.module=item.id;b.textContent=item.name;b.addEventListener('click',()=>onSelect(item.id));buttons.append(b)}
 section.append(buttons);grid.append(section);return grid;
}
function create({home,previous,next,select,fullscreen}){
 const el=document.createElement('nav');el.className='lesson-navigation';el.setAttribute('aria-label','수업 이동');
 const button=(label,action,key)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.action=key;b.addEventListener('click',action);el.append(b);return b};
 button('홈',home,'home');const prev=button('이전',previous,'previous');
 const position=document.createElement('span');position.className='lesson-position';position.setAttribute('aria-live','polite');el.append(position);
 const forward=button('다음',next,'next');
 const picker=button('바로가기',()=>setOpen(panel.hidden),'modules');picker.setAttribute('aria-expanded','false');
 const panel=document.createElement('section');panel.className='module-panel';panel.hidden=true;panel.setAttribute('aria-label','바로가기');
 const title=document.createElement('h2');title.textContent='바로가기';panel.append(title,choices(id=>{setOpen(false);select(id)},lessons));el.append(panel);
 const full=button('⛶',fullscreen,'fullscreen');full.setAttribute('aria-label','전체화면 / 프리젠터');
 function setOpen(on){panel.hidden=!on;picker.setAttribute('aria-expanded',String(on));if(on)(panel.querySelector('[aria-current]')||panel.querySelector('button:not(:disabled)'))?.focus()}
 document.addEventListener('click',e=>{if(!el.contains(e.target))setOpen(false)});
 el.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){e.preventDefault();e.stopPropagation();setOpen(false);picker.focus()}});
 function update(id,items=[]){const item=lessons.find(m=>m.id===id),index=items.findIndex(i=>i.active);position.textContent=item?`${item.name} · ${index<0?'–':index+1} / ${items.length||'–'}`:'';for(const b of panel.querySelectorAll('[data-module]')){if(b.dataset.module===id)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current')}prev.disabled=forward.disabled=!item}
 return {element:el,update,close:()=>setOpen(false)};
}
window.phycomNavigation=Object.freeze({modules:Object.freeze([]),projects,lessons,choices,create});
})();
