// Ajudantes do robô de notas. Cole UM trecho por vez no javascript_tool (depois de rodar o coletor).

// 0) Compactar a coleta para gravar em dados/ID.json (cole uma vez junto com o coletor)
window.__compactar = () => { const C = window.__coleta; const sem = k => +(k.match(/S(\d+)/)||[0,0])[1];
const tar = C.registros.map(t => t.tarefa); const semanas = [...new Set(tar.map(sem))];
const al = {};
for (const t of C.registros) for (const it of t.itens) { al[it.userid] = al[it.userid] || { n: it.nome, r: [], q: [] }; al[it.userid].r.push(it.nota !== null ? it.nota : (it.enviado ? -2 : -1)); }
for (const [u, a] of Object.entries(al)) { const qz = C.quizzes[u] || {}; a.q = semanas.map(s => { const v = Object.entries(qz).filter(([k]) => sem(k) === s).map(([,x]) => x || 0); return v.length ? Math.round(100 * v.reduce((p, c) => p + c, 0) / v.length) / 10 : null; }); }
return JSON.stringify({ curso: C.curso, disciplina: C.disciplina, coletadoEm: C.coletadoEm.slice(0,16), tarefas: C.registros.map(t => [t.tarefa, t.cmid, t.assignmentid, t.contextid]), semanas, alunos: Object.entries(al).map(([u, a]) => [+u, a.n, a.r, a.q]) }); };

// 1) Pegar entregas pendentes em lotes (troque 0 e 8 pelo início e tamanho do lote)
window.__res[ID_DO_CURSO].pend.slice(0, 8).map(p => `### ${p.tarefa} | cmid ${p.cmid} | ${p.userid} | ${p.nome}\n${p.conteudo}`).join('\n\n');

// 2) Ver uma imagem enviada pelo aluno (devolve JPEG pequeno em base64)
await (async (url) => {
  const blob = await fetch(url).then(r => r.blob());
  const bmp = await createImageBitmap(blob);
  const k = Math.min(1, 1000 / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas'); c.width = bmp.width * k; c.height = bmp.height * k;
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', 0.7).split(',')[1];
})('URL_DA_IMAGEM');

// 3) Publicar nota na plataforma (só depois do "ok" do professor)
//    lista = [{cmid, contextid, userid, nota, feedback}]
await (async (lista) => {
  const call = async (m, args) => (await fetch('/lib/ajax/service.php?sesskey=' + M.cfg.sesskey + '&info=' + m, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify([{ index: 0, methodname: m, args }]) }).then(r => r.json()))[0];
  const res = [];
  for (const it of lista) {
    // confere de novo se o professor não deu nota nesse meio tempo
    const frag = await call('core_get_fragment', { component: 'mod_assign', callback: 'gradingpanel', contextid: it.contextid, args: [{ name: 'userid', value: String(it.userid) }, { name: 'attemptnumber', value: '-1' }, { name: 'jsonformdata', value: '""' }] });
    if (frag.error) { res.push({ userid: it.userid, ok: false, erro: frag.exception && frag.exception.message }); continue; }
    const form = new DOMParser().parseFromString(frag.data.html, 'text/html').querySelector('form') || new DOMParser().parseFromString('<form>' + frag.data.html + '</form>', 'text/html').querySelector('form');
    const g = form.querySelector('[name=grade]');
    if (g && g.value && g.value.trim() !== '') { res.push({ userid: it.userid, ok: false, erro: 'já tinha nota ' + g.value }); continue; }
    const fd = new URLSearchParams();
    for (const el of form.querySelectorAll('input,textarea,select')) {
      if (!el.name || ((el.type === 'checkbox' || el.type === 'radio') && !el.checked)) continue;
      fd.append(el.name, el.value);
    }
    fd.set('grade', String(it.nota).replace('.', ','));
    if (it.feedback) fd.set('assignfeedbackcomments_editor[text]', '<p>' + it.feedback + '</p>');
    const aid = frag.data.html.match(/data-assignmentid="(\d+)"/);
    const assignmentid = it.assignmentid || (aid ? +aid[1] : null);
    const r = await call('mod_assign_submit_grading_form', { assignmentid, userid: it.userid, jsonformdata: JSON.stringify(fd.toString()) });
    res.push({ userid: it.userid, ok: !r.error && (!r.data || r.data.length === 0), detalhe: JSON.stringify(r).slice(0, 200) });
  }
  return res;
})(LISTA_AQUI);
