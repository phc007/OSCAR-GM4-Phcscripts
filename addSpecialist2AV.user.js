// ==UserScript==
// @name         CPSO Search AVAROS
// @description  Searches CPSO for specialists
// @version      0.1
// @match        */oscar/oscarEncounter/oscarConsultationRequest/config/AddSpecialist.jsp
// @updateURL 	    https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/addSpecialist2AV.user.js
// @downloadURL	   https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/addSpecialist2AV.user.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      register.cpso.on.ca
// @run-at       document-idle
// @noframes
// ==/UserScript==

const CONFIG = {
  cpso: {
    base: 'https://register.cpso.on.ca',
    bootstrapPath: '/Advanced-Search/',
    searchPath: '/Get-Search-Results/',
  },
  oscar: {
    hardIds: { firstName:'firstName', lastName:'lastName', address:'address', phone:'phone', fax:'fax' },
    labelMap: {
      firstName:'First Name', lastName:'Last Name', city:'City', province:'Province', postal:'Postal',
      address:'Address', phone:'Phone', fax:'Fax',
    },
  },
};

const SPECIALTIES = ["Addiction Medicine","Adolescent Medicine","Adult Hepatology","Adult Interventional Cardiology","Anatomical Pathology","Anesthesiology","Cardiac Surgery","Cardiology","Cardiothoracic Surgery","Cardiovascular and Thoracic Surgery","Child and Adolescent Psychiatry","Clinical Immunology","Clinical Immunology and Allergy","Clinical Pharmacology","Clinical Pharmacology and Toxicology","Clinician Educator","Clinician Investigator Program","Colorectal Surgery","Community Medicine","Critical Care Medicine","Dermatology","Developmental Pediatrics","Diagnostic and Clinical Pathology","Diagnostic and Molecular Pathology","Diagnostic and Therapeutic Radiology","Diagnostic Radiology","Emergency Medicine","Endocrinology and Metabolism","Family Medicine","Family Medicine (Emergency Medicine)","FCFP - Family Medicine","Forensic Pathology","Forensic Psychiatry","Gastroenterology","General Internal Medicine","General Pathology","General Surgery","General Surgical Oncology","Geriatric Medicine","Geriatric Psychiatry","Gynecologic Oncology","Gynecologic Reproductive Endocrinology/Infertility","Hematological Pathology","Hematology","Infectious Diseases","Internal Medicine","Interventional Radiology","Laboratory Medicine","Maternal Fetal Medicine","Medical Biochemistry","Medical Genetics and Genomics","Medical Microbiology","Medical Oncology","Neonatal Hemodynamics and Targeted Neonatal Echocardiography","Neonatal-Perinatal Medicine","Nephrology","Neurology","Neuropathology","Neuroradiology","Neurosurgery","Nuclear Medicine","Obstetrics and Gynecology","Occupational Medicine","Ophthalmology","Orthopedic Surgery","Otolaryngology - Head and Neck Surgery","Pain Medicine","Palliative Medicine","Pediatric Cardiology","Pediatric Critical Care Medicine","Pediatric Emergency Medicine","Pediatric Endocrinology and Metabolism","Pediatric Gastroenterology","Pediatric General Surgery","Pediatric Hematology/Oncology","Pediatric Infectious Diseases","Pediatric Nephrology","Pediatric Neurology","Pediatric Radiology","Pediatric Respirology","Pediatric Rheumatology","Pediatric Surgery","Pediatrics","Physical Medicine and Rehabilitation","Plastic Surgery","Prehospital and Transport Medicine","Psychiatry","Public Health","Public Health and Preventive Medicine","Radiation Oncology","Respirology","Rheumatology","Sleep Disorder Medicine","Sport and Exercise Medicine","Surgical Foundations","Thoracic Surgery","Transfusion Medicine","Urology","Vascular Surgery"];

const CITY_FALLBACK = ["Ajax","Amherstburg","Ancaster","Aurora","Barrie","Belle River","Belleville","Bowmanville","Bracebridge","Brampton","Brantford","Brockville","Burlington","Cambridge","Chatham","Cobourg","Collingwood","Cornwall","Dundas","Essex","Etobicoke","Fort Erie","Georgetown","Goderich","Guelph","Hamilton","Huntsville","Ingersoll","Kanata","Kingston","Kingsville","Kitchener","LaSalle","Leamington","Lindsay","London","Markham","Midland","Milton","Mississauga","Nepean","Newmarket","Niagara Falls","North Bay","North York","Oakville","Orangeville","Orillia","Oshawa","Ottawa","Owen Sound","Pembroke","Perth","Peterborough","Pickering","Sarnia","Sault Ste. Marie","Scarborough","Simcoe","St. Catharines","St. Thomas","Stratford","Strathroy","Sudbury","Tecumseh","Thunder Bay","Tillsonburg","Timmins","Toronto","Vaughan","Waterloo","Welland","Whitby","Windsor","Woodstock"];

const DEBUG = false;
const LOG = (...a) => console.log('%c[CPSO→OSCAR]', 'color:#0b5cab;font-weight:bold', ...a);
const norm = (s) => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();

function el(tag, props = {}, kids = []) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'style') n.setAttribute('style', v);
    else if (k in n) n[k] = v; else n.setAttribute(k, v);
  }
  for (const c of [].concat(kids)) n.append(c && c.nodeType ? c : document.createTextNode(c));
  return n;
}

GM_addStyle(`
  .cposc{position:fixed;z-index:2147483600;right:14px;bottom:14px;width:370px;font:13px/1.45 system-ui,Segoe UI,Roboto,sans-serif;color:#111;background:#fff;border:1px solid #c9ced6;border-radius:10px;box-shadow:0 8px 28px rgba(0,0,0,.2);overflow:hidden}
  .cposc h4{margin:0;padding:9px 12px;background:#0b5cab;color:#fff;font-size:13px;display:flex;justify-content:space-between;align-items:center}
  .cposc h4 .t{cursor:pointer;opacity:.85}
  .cposc .bd{padding:10px 12px;max-height:66vh;overflow:auto}
  .cposc .row{display:flex;gap:6px;margin:5px 0;align-items:center}
  .cposc .row label{flex:0 0 70px;color:#444;font-size:12px}
  .cposc input,.cposc select{flex:1;min-width:0;padding:4px 6px;border:1px solid #c9ced6;border-radius:6px;font:inherit}
  .cposc .btn{cursor:pointer;border:0;border-radius:7px;padding:7px 9px;font:600 12px system-ui}
  .cposc .btn.p{background:#0b5cab;color:#fff}
  .cposc .note{font-size:11px;color:#667085;margin:6px 0;white-space:pre-wrap}
  .cposc .res{border-top:1px solid #eee;margin-top:8px;padding-top:6px}
  .cposc .hit{padding:6px 8px;border:1px solid #e5e7eb;border-radius:7px;margin:5px 0;cursor:pointer}
  .cposc .hit:hover{background:#f3f8ff;border-color:#9cc2ea}.cposc .hit b{display:block}
  .cposc .hit small{color:#667085}
  .cposc-hl{outline:2px solid #16a34a !important;background:#ecfdf3 !important;transition:background .5s}
`);

function gmFetch(opts) {
  return new Promise((resolve, reject) => GM_xmlhttpRequest({
    method:'GET', timeout:25000, ...opts,
    onload:r=>resolve(r), onerror:()=>reject(new Error('network error (no internet to CPSO from this machine?)')), ontimeout:()=>reject(new Error('timeout')),
  }));
}
function allDocs() {
  const docs = [document];
  for (const fr of document.querySelectorAll('iframe,frame')) { try { if (fr.contentDocument) docs.push(fr.contentDocument); } catch (e) {} }
  return docs;
}
function inputForLabelIn(doc, labelText) {
  const want = norm(labelText);
  const clean = (s) => norm(s).replace(/[:*]+$/, '').trim();
  const isInput = (n) => n && /^(input|select|textarea)$/i.test(n.tagName) && n.type !== 'hidden';
  const nodes = [...doc.querySelectorAll('td,th,label,span,div,b,strong,p')];

  // Prefer an exact label match; fall back to a tight startsWith (guards
  // against matching big wrapper elements).
  let cands = nodes.filter(n => clean(n.textContent) === want);
  if (!cands.length) cands = nodes.filter(n => clean(n.textContent).startsWith(want) && clean(n.textContent).length < want.length + 4);

  // Pass 1: bind the label to the input in its OWN cell, then the adjacent
  // cell(s). This keeps Phone/Fax (and First/Last) on the same row separate.
  for (const c of cands) {
    let f = c.querySelector && c.querySelector('input:not([type=hidden]),select,textarea');
    if (f) return f;
    let sib = c.nextElementSibling, hops = 0;
    while (sib && hops < 4) {
      if (isInput(sib)) return sib;
      f = sib.querySelector && sib.querySelector('input:not([type=hidden]),select,textarea');
      if (f) return f;
      sib = sib.nextElementSibling; hops++;
    }
    if (c.tagName === 'LABEL' && c.getAttribute('for')) { const e = doc.getElementById(c.getAttribute('for')); if (e) return e; }
  }
  // Pass 2 (last resort): first input anywhere in the row.
  for (const c of cands) {
    const row = c.closest('tr');
    if (row) { const f = row.querySelector('input:not([type=hidden]),select,textarea'); if (f) return f; }
  }
  return null;
}

try { initOscar(); LOG('loaded on', location.href); }
catch (e) { console.error('[CPSO→OSCAR] init error', e); }

/* ====================================================================== */
function initOscar() {
  function field(key) {
    // 1) hardcoded id/name
    for (const d of allDocs()) {
      const id = CONFIG.oscar.hardIds[key];
      if (id) { const e = d.getElementById(id) || d.querySelector(`[name="${id}"]`); if (e) return e; }
    }
    // 2) label text → adjacent input (fallback if a hardId name isn't present)
    for (const d of allDocs()) {
      const label = CONFIG.oscar.labelMap[key];
      if (label) { const f = inputForLabelIn(d, label); if (f) return f; }
    }
    return null;
  }
  function setField(f, val) {
    if (!f || val == null || val === '') return false;
    if (f.tagName === 'SELECT') {
      const opt = [...f.options].find(o => norm(o.textContent) === norm(val) || norm(o.value) === norm(val));
      if (!opt) return false; f.value = opt.value;
    } else f.value = val;
    f.dispatchEvent(new Event('input',{bubbles:true})); f.dispatchEvent(new Event('change',{bubbles:true}));
    f.classList.add('cposc-hl'); setTimeout(()=>f.classList.remove('cposc-hl'),1700); return true;
  }
  function fillForm(p) {
    let n = 0; for (const key of Object.keys(CONFIG.oscar.labelMap)) if (setField(field(key), p[key])) n++;
    let msg = n ? 'Filled — review before saving.' : 'Found 0 fields — is the Add Specialist form open?';
    if (p._meta && p._meta.notInPractice) msg += '\n⚠ CPSO flags this address as possibly not a practice location.';
    setNote(msg);
  }
  const panel = el('div', { className:'cposc' });
  const body = el('div', { className:'bd' });
  const head = el('h4', {}, ['CPSO Search', el('span',{className:'t',textContent:'–'})]);
  head.lastChild.onclick = () => (body.hidden = !body.hidden);
  panel.append(head, body);

  const fLast=el('input',{placeholder:'optional'}), fFirst=el('input',{placeholder:'optional'});
  const fCity=el('input',{placeholder:'optional'}); fCity.setAttribute('list','cposc-cities'); fCity.setAttribute('autocomplete','off');
  const cityDL=el('datalist',{id:'cposc-cities'});
  const fCpso=el('input',{placeholder:'optional'});
  const fSpec=el('select'); fSpec.append(el('option',{value:'',textContent:'— Any specialty —'}));
  for (const s of SPECIALTIES) fSpec.append(el('option',{value:s,textContent:s}));
  const fType=el('select');
  for (const t of ['Any','Specialist','Family Doctor']) fType.append(el('option',{value:t,textContent:t}));

  const noteEl=el('div',{className:'note'}); const setNote=(t)=>noteEl.textContent=t;
  const resEl=el('div',{className:'res'});

  const bSearch=el('button',{className:'btn p',textContent:'Search CPSO'});
  bSearch.onclick=()=>doSearch({lastName:fLast.value.trim(),firstName:fFirst.value.trim(),city:fCity.value.trim(),cpsoNumber:fCpso.value.trim(),specialty:fSpec.value,doctorType:fType.value},setNote,resEl,fillForm);

  body.append(
    el('div',{className:'row'},[el('label',{},'Last name'),fLast]),
    el('div',{className:'row'},[el('label',{},'First'),fFirst]),
    el('div',{className:'row'},[el('label',{},'City'),fCity]),
    cityDL,
    el('div',{className:'row'},[el('label',{},'CPSO #'),fCpso]),
    el('div',{className:'row'},[el('label',{},'Specialty'),fSpec]),
    el('div',{className:'row'},[el('label',{},'Type'),fType]),
    el('div',{className:'row'},[bSearch]),
    noteEl,resEl);
  document.body.append(panel);

  setNote('Enter criteria and Search CPSO.');

  // City autocomplete: bundled list immediately, replaced by CPSO's live list.
  const fillCities = (arr) => { cityDL.innerHTML = ''; for (const c of arr) cityDL.append(el('option', { value: c })); };
  fillCities(CITY_FALLBACK);
  getBootstrap().then(({ cities }) => { if (cities && cities.length) fillCities(cities); }).catch(() => {});
}


/* ---- CPSO API ---- */
let _boot = null;
function getBootstrap() {
  if (_boot) return _boot;
  _boot = gmFetch({ url: CONFIG.cpso.base + CONFIG.cpso.bootstrapPath }).then(r => {
    const doc = new DOMParser().parseFromString(r.responseText, 'text/html');
    const m = r.responseText.match(/name="__RequestVerificationToken"[^>]*value="([^"]+)"/);
    const sel = [...doc.querySelectorAll('select')].find(s =>
      [...s.options].some(o => o.textContent.trim() === 'Toronto') &&
      [...s.options].some(o => o.textContent.trim() === 'Windsor'));
    const cities = sel
      ? [...sel.options].map(o => o.textContent.trim()).filter(c => c && c !== '-1' && !/city\/town|select/i.test(c))
      : [];
    return { token: m ? m[1] : null, cities };
  }).catch(() => ({ token: null, cities: [] }));
  return _boot;
}
async function getToken() { return (await getBootstrap()).token; }

async function apiSearch(params) {
  const token = await getToken();
  const body = new URLSearchParams();
  body.set('cbx-includeinactive', 'on');
  if (params.lastName)   body.set('lastName', params.lastName);
  if (params.firstName)  body.set('firstName', params.firstName);
  if (params.city)       body.set('city', params.city);
  if (params.cpsoNumber) body.set('cpsoNumber', params.cpsoNumber);
  if (params.specialty)  body.set('SpecialistType', params.specialty);
  if (params.doctorType && params.doctorType !== 'Any') body.set('doctorType', params.doctorType);

  const headers = { 'Content-Type':'application/x-www-form-urlencoded', 'X-Requested-With':'XMLHttpRequest' };
  if (token) headers['__RequestVerificationToken'] = token;

  if (DEBUG) LOG('search body', body.toString());
  const res = await gmFetch({ method:'POST', url: CONFIG.cpso.base + CONFIG.cpso.searchPath, headers, data: body.toString() });
  let json;
  try { json = JSON.parse(res.responseText); }
  catch (e) { throw new Error(`Response wasn't JSON (HTTP ${res.status}). Starts: ${res.responseText.replace(/\s+/g,' ').slice(0,140)}`); }
  return { total: json.totalcount, results: json.results || [] };
}

function fmtPhone(v) {
  const s = (v || '').trim();
  if (!s) return '';
  let d = s.replace(/\D/g, '');
  if (d.length === 11 && d[0] === '1') d = d.slice(1);
  if (d.length === 10) return `${d.slice(0,3)}-${d.slice(3,6)}-${d.slice(6)}`;
  return s; // non-standard (extension, partial) — leave as captured
}

function resultToPayload(r) {
  let name = (r.name || '').replace(/\s+/g, ' ').trim();
  let first = '', last = '';
  if (name.includes(',')) { const i = name.indexOf(','); last = name.slice(0, i).trim(); first = name.slice(i + 1).trim(); }
  else { const p = name.split(' '); first = p.shift() || ''; last = p.join(' '); }
  first = first.split(' ')[0]; // first given name only — drop middle name(s)
  const streets = [r.street1, r.street2, r.street3, r.street4].map(s => (s || '').trim()).filter(Boolean);
  const cityProv = [(r.city || '').trim(), (r.province || '').trim()].filter(Boolean).join(', ');
  const postal = (r.postalcode || '').replace(/\s+/g, ' ').trim();
  //const address = [streets.join(', '), cityProv, postal].filter(Boolean).join(', ');
  const province = (r.province || '').trim();
  const address = streets.join(', ');
  const city = (r.city || '').trim();
  return {
    firstName: first, lastName: last, city, postal, province,
    address, phone: fmtPhone(r.phonenumber), fax: fmtPhone(r.fax),
    _meta: { notInPractice: r.primaryaddressnotinpractice },
  };
}

async function doSearch(params, setNote, resEl, fillForm) {
  resEl.innerHTML = '';
  if (!params.lastName && !params.specialty && !params.city && !params.cpsoNumber) { setNote('Enter a last name, city, specialty, or CPSO #.'); return; }
  setNote('Searching CPSO…');
  try {
    const { total, results } = await apiSearch(params);
    results.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'en', { sensitivity: 'base' }));
    if (!results.length) { setNote(`No matches (total ${total ?? 0}). Try broadening the criteria.`); return; }
    const capped = total > results.length;
    setNote(`${results.length} result(s)${capped ? ` of ${total} — refine to see the rest` : ''}. Click one to fill.`);
    for (const r of results) {
      const city = (r.city || '').trim();
      const status = (r.registrationstatus || '').trim();
      const card = el('div',{className:'hit'}, [
        el('b',{},(r.name||'(name?)')),
        el('small',{},`${(r.specialties||'').replace(/\s*\|\s*/g,', ')}${city?' • '+city:''}${r.cpsonumber?' • #'+r.cpsonumber:''}${status?' • '+status:''}`),
      ]);
      card.onclick = () => fillForm(resultToPayload(r));
      resEl.append(card);
    }
  } catch (e) { setNote('Search error: ' + e.message); LOG('search error', e); }
}
