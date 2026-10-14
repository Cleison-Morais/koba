---
name: corrigir
description: Coleta as atividades de registro e os quizzes da plataforma Educação Profissional (Moodle), corrige as entregas pendentes conforme o rigor do professor e deixa as notas como rascunho. Use em "corrigir", "verificar a plataforma", "tem atividade nova?", ou na execução diária agendada.
---

# Koba – corrigir

Ache a pasta de trabalho (`KOBA.txt`), leia `REGRAS.md`, `config.json`, `perfis/<rigor>.json`, `calibracao.json` e `regras_alunos.json` (se existirem) e `estado.json`.

## 1. Login
Abra `<plataforma>/my/courses.php` no navegador do app. Se cair na tela de login, PARE e peça: "Entre na plataforma pelo navegador do app e me responda 'pronto'." Nunca digite senha.

## 2. Carregar o coletor
Leia `coletor.js` e cole inteiro no `javascript_tool`. Cole também a função `window.__compactar` (trecho 0 de `ajudantes.js`) e:
```js
window.__fila = async (itens) => { window.__res = {}; for (const it of itens) { try {
  if (it.grupo) await fetch(`/mod/assign/view.php?id=${it.cmid}&action=grading&group=${it.grupo}`);
  const r = await window.__coletar(it.curso); window.__res[it.chave] = { r, comp: window.__compactar(), pend: window.__pend };
} catch (e) { window.__res[it.chave] = { erro: String(e && e.stack || e) }; } } window.__filaFim = true; };
```

## 3. Coletar
Monte a lista a partir de `disciplinas` (chave = id do curso, ou id+letra se houver duas turmas no mesmo curso). Rode `window.__filaFim=false; window.__fila([...]); 'ok'` e consulte `window.__filaFim` a cada ~30 s. Se houver grupos, no fim volte ao grupo original.
Grave `window.__res[chave].comp` em `dados/<chave>.json`.

## 4. Corrigir
Para cada item de `window.__res[chave].pend` (leia em lotes de ~8) cuja chave `cmid:userid` não está no `estado.json`:
- dê a nota seguindo **"Como dar a nota"** do `REGRAS.md`;
- se for imagem, use o trecho 2 de `ajudantes.js` para ver; se não der, nota "revisar";
- acrescente no `estado.json`: `{ curso, tarefa, nome, nota, situacao, feedback, alerta, status: "rascunho", data }`.
Comece pelas semanas mais antigas. Respeite `limite_por_execucao` (padrão 80) e diga quantas ficaram para depois.

## 5. Planilha e resumo
Rode `python planilha.py` na pasta de trabalho (se der "planilha aberta", peça para fechar o Excel sem salvar). Depois faça o resumo do `/koba:resumo` incluindo a tabela das notas novas: aluno | atividade | nota | motivo | alerta.

## 6. Publicação
- `publicacao = "sempre_pedir_ok"`: pergunte "Posso publicar? Responda **ok** ou diga o que mudar." e espere.
- `publicacao = {"automatico_a_partir_de": X}`: publique sozinho (via `/koba:publicar`) as notas ≥ X sem alerta; peça ok para o resto.
Se ninguém responder, deixe como rascunho; a próxima execução mostra de novo.
