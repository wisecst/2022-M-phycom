(()=>{'use strict';
const shell=document.getElementById('buzzerShell'),frame=document.getElementById('buzzerFrame');
const shared=window.phycomNavigation;
const allowedId='rotation-dc-motor';
const allowed=shared.lessons.find(m=>m.id===allowedId);
const projects=Object.freeze(allowed?[Object.freeze({...allowed,enabled:true})]:[]);
const catalogue=Object.freeze({modules:Object.freeze([]),projects,lessons:projects,create:shared.create});
let current=null;
function focusLesson(){if(!shell.hidden)frame.contentWindow?.focus()}
function send(key){frame.contentWindow?.postMessage({type:'info-key',key},location.origin)}
function enforceStudentDashboard(){
 const dashboard=document.getElementById('dashboard');if(!dashboard)return;
 dashboard.querySelectorAll('[data-unit]').forEach(b=>{b.hidden=b.dataset.unit!=='projects';b.disabled=b.dataset.unit!=='projects';b.setAttribute('aria-hidden',String(b.dataset.unit!=='projects'))});
 dashboard.querySelectorAll('[data-open-module]').forEach(b=>{if(b.dataset.openModule!==allowedId){b.hidden=true;b.disabled=true;b.setAttribute('aria-hidden','true')}});
 window.studentDashboard?.activateTab('projects');
}
function open(id){if(id!==allowedId)return;if(id===current){navigation.close();focusLesson();return}
 const module=catalogue.lessons.find(m=>m.id===id&&m.enabled);if(!module)return;
 current=id;shell.hidden=false;document.body.style.overflow='hidden';navigation.close();navigation.update(id);
 frame.title=module.name+' 수업';frame.src='lessons/'+module.path+'?ui=20261009-final-ui3';
}
function close(){window.studentDashboard?.activateTab('projects');shell.hidden=true;current=null;navigation.close();frame.src='about:blank';document.body.style.overflow='';document.querySelector(`[data-open-module="${allowedId}"]`)?.focus()}
const fullscreen=()=>window.infoFullscreen.toggle();
const navigation=catalogue.create({home:close,previous:()=>send('ArrowLeft'),next:()=>send('ArrowRight'),select:open,fullscreen});
shell.append(navigation.element);
function credit(){const p=document.createElement('p');p.className='creator-credit';const c=window.INFO_UI_CREATOR||{};p.textContent=`© ${c.year||'2026'} ${c.name||'B.K.Son'}${c.rights?` · ${c.rights}`:''}`;return p}
shell.append(credit());document.querySelector('.lesson-screen').append(credit());
window.infoFullscreen.subscribe(on=>{frame.contentWindow?.postMessage({type:'info-fullscreen',on},location.origin);focusLesson()});
window.infoShell={fullscreen,focusLesson};
frame.addEventListener('load',()=>{focusLesson();window.infoFullscreen.sync()});
document.querySelectorAll('[data-open-module]').forEach(b=>b.addEventListener('click',()=>open(b.dataset.openModule)));
window.addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==frame.contentWindow)return;if(e.data==='phycom-home'){close();return}if(e.data?.type==='info-toc')navigation.update(current,e.data.items)});
document.addEventListener('keydown',e=>{if(shell.hidden||e.target.closest('input,textarea,select,[contenteditable]:not([contenteditable="false"])'))return;if(['ArrowLeft','ArrowRight','PageUp','PageDown'].includes(e.key)){e.preventDefault();send(e.key)}else if(e.key.toLowerCase()==='f'){e.preventDefault();fullscreen().catch(()=>{})}});
enforceStudentDashboard();
})();
