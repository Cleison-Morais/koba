// Coletor de notas - Plataforma Educação Profissional (Moodle)
// Uso: cole este arquivo inteiro no javascript_tool (uma vez) e depois chame: await window.__coletar(ID_DO_CURSO)
// Devolve JSON com alunos, registros (status, nota, texto) e quizzes (Pause e Responda).
window.__coletar = async (CURSO, LER = true) => {
const get = async u => new DOMParser().parseFromString(await fetch(u).then(r => r.text()), 'text/html');
const txt = e => (e ? e.innerText : '').replace(/\u00a0/g, ' ').trim();
const num = s => { const m = (s || '').match(/(\d+(?:,\d+)?)/); return m ? parseFloat(m[1].replace(',', '.')) : null; };
const semana = s => { const m = (s || '').match(/\((S\d+A\d+[a-z]?)\)/i); return m ? m[1] : s; };

async function docxText(url) {
  // lê o texto de um .docx no próprio navegador (zip + deflate)
  const buf = new Uint8Array(await fetch(url).then(r => r.arrayBuffer()));
  const dv = new DataView(buf.buffer);
  let i = 0;
  while (i < buf.length - 30) {
    if (dv.getUint32(i, true) !== 0x04034b50) { i++; continue; }
    const method = dv.getUint16(i + 8, true), csize = dv.getUint32(i + 18, true);
    const nlen = dv.getUint16(i + 26, true), xlen = dv.getUint16(i + 28, true);
    const name = new TextDecoder().decode(buf.slice(i + 30, i + 30 + nlen));
    const start = i + 30 + nlen + xlen;
    if (name === 'word/document.xml') {
      let data = buf.slice(start, start + csize);
      if (method === 8) data = new Uint8Array(await new Response(new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer());
      const xml = new TextDecoder().decode(data);
      return xml.replace(/<\/w:p>/g, '\n').replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').trim();
    }
    i = start + csize;
  }
  return '[docx sem texto legível]';
}

async function lerEntrega(item) {
  const partes = [];
  if (item.textoUrl) {
    const d = await get(item.textoUrl);
    const box = d.querySelector('.submissionfull') || d.querySelector('#region-main');
    partes.push(txt(box));
    const imgs = box ? [...box.querySelectorAll('img')].map(i => i.src).filter(u => /pluginfile/.test(u)) : [];
    for (const u of imgs) partes.push(`[imagem no texto - precisa ver o arquivo: ${u}]`);
  }
  for (const f of item.arquivos) {
    const nome = decodeURIComponent(f.split('/').pop().split('?')[0]);
    if (/\.docx$/i.test(nome)) partes.push(`[arquivo ${nome}]\n` + await docxText(f));
    else if (/\.(txt|py|js|html|css|md|csv)$/i.test(nome)) partes.push(`[arquivo ${nome}]\n` + await fetch(f).then(r => r.text()));
    else partes.push(`[arquivo ${nome} - precisa ver o arquivo: ${f}]`);
  }
  return partes.join('\n\n').slice(0, 6000);
}

async function coletarTarefa(cmid, nome) {
  const itens = []; let ctx = null;
  for (let page = 0; page < 10; page++) {
    const d = await get(`/mod/assign/view.php?id=${cmid}&action=grading&page=${page}`);
    const heads = [...d.querySelectorAll('table thead th')].map(txt);
    const col = k => heads.findIndex(h => h.startsWith(k));
    const cStatus = col('Status'), cNota = col('Avaliação final'), cTexto = col('Texto online'), cArq = col('Envios de arquivo');
    const rows = [...d.querySelectorAll('table tbody tr')].filter(r => r.querySelector('a[href*="user/view.php"]'));
    if (!rows.length) break;
    for (const r of rows) {
      const tds = r.querySelectorAll('td');
      const ua = r.querySelector('a[href*="user/view.php"]');
      const userid = +ua.href.match(/id=(\d+)/)[1];
      const ctxm = r.innerHTML.match(/comment_context=(\d+)/); if (ctxm) ctx = +ctxm[1];
      const st = txt(tds[cStatus]);
      const nota = num(txt(tds[cNota]).split('/')[0]);
      const tl = tds[cTexto] && tds[cTexto].querySelector('a[href*="viewpluginassignsubmission"]');
      const arquivos = cArq >= 0 ? [...tds[cArq].querySelectorAll('a[href*="pluginfile.php"]')].map(a => a.href) : [];
      itens.push({ userid, nome: (() => { const c = ua.cloneNode(true); c.querySelectorAll('.userinitials, img, span').forEach(x => x.remove()); return txt(c) || txt(ua); })(), enviado: !/Nenhum envio/i.test(st), nota, textoUrl: tl ? tl.href : null, arquivos });
    }
    if (!d.querySelector(`.pagination a[href*="page=${page + 1}"]`)) break;
  }
  const gr = await fetch(`/mod/assign/view.php?id=${cmid}&action=grader`).then(r => r.text());
  const vw = await get(`/mod/assign/view.php?id=${cmid}`);
  const enunciado = txt(vw.querySelector('.activity-description, #intro, .box.generalbox')).slice(0, 1500);
  const am = gr.match(/data-assignmentid="(\d+)"/);
  return { tarefa: semana(nome), cmid, assignmentid: am ? +am[1] : null, contextid: ctx, enunciado, itens };
}

async function coletarQuizzes() {
  const alunos = {}; let colunas = null;
  for (let page = 0; page < 10; page++) {
    const d = await get(`/grade/report/grader/index.php?id=${CURSO}&page=${page}`);
    const tb = d.querySelector('table#user-grades') || d.querySelector('table');
    if (!tb) break;
    const heads = [...tb.querySelectorAll('tr')].find(tr => /Pause e Responda|Registro/i.test(tr.innerText));
    colunas = [...heads.querySelectorAll('th,td')].map(c => txt(c));
    const rows = [...tb.querySelectorAll('tr')].filter(tr => tr.querySelector('a[href*="user/view.php"]'));
    for (const r of rows) {
      const cells = [...r.querySelectorAll('th,td')];
      const userid = +r.querySelector('a[href*="user/view.php"]').href.match(/id=(\d+)/)[1];
      const q = {};
      colunas.forEach((c, i) => { if (/Pause e Responda/i.test(c)) q[semana(c)] = num(txt(cells[i]).split(' ')[0]); });
      alunos[userid] = q;
    }
    if (!d.querySelector(`.pagination a[href*="page=${page + 1}"]`)) break;
  }
  return alunos;
}

const curso = await get(`/course/view.php?id=${CURSO}`);
const tarefas = [...curso.querySelectorAll('a[href*="/mod/assign/view.php"]')]
  .map(a => ({ cmid: +a.href.match(/id=(\d+)/)[1], nome: txt(a).replace(/\s*Tarefa$/, '') }))
  .filter((v, i, s) => s.findIndex(x => x.cmid === v.cmid) === i);
const registros = [];
for (const t of tarefas) registros.push(await coletarTarefa(t.cmid, t.nome));

// Lê o conteúdo completo só das entregas que ainda não têm nota
if (LER) for (const t of registros) for (const it of t.itens)
  if (it.enviado && it.nota === null) it.conteudo = await lerEntrega(it);

window.__coleta = ({ curso: CURSO, disciplina: txt(curso.querySelector('h1')) || curso.title, coletadoEm: new Date().toISOString(), registros, quizzes: await coletarQuizzes() });
window.__pend = [];
for (const t of window.__coleta.registros) for (const it of t.itens) if (it.conteudo !== undefined) window.__pend.push({ tarefa: t.tarefa, enunciado: t.enunciado, cmid: t.cmid, assignmentid: t.assignmentid, contextid: t.contextid, userid: it.userid, nome: it.nome, conteudo: it.conteudo });
const C = window.__coleta; const al = {};
for (const t of C.registros) for (const it of t.itens) { al[it.userid] = al[it.userid] || { nome: it.nome, reg: {}, quiz: C.quizzes[it.userid] || {} }; al[it.userid].reg[t.tarefa] = [it.enviado ? 1 : 0, it.nota]; }
window.__resumo = JSON.stringify({ curso: C.curso, disciplina: C.disciplina, coletadoEm: C.coletadoEm, tarefas: C.registros.map(t => ({ tarefa: t.tarefa, cmid: t.cmid, assignmentid: t.assignmentid, contextid: t.contextid })), alunos: al });
return { disciplina: window.__coleta.disciplina, tamanhoResumo: window.__resumo.length, tarefas: window.__coleta.registros.map(t => ({ tarefa: t.tarefa, alunos: t.itens.length, enviados: t.itens.filter(i => i.enviado).length, semNota: t.itens.filter(i => i.enviado && i.nota === null).length })), pendentes: window.__pend.length };
};
'coletor carregado';
