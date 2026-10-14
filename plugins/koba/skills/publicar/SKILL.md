---
name: publicar
description: Publica na plataforma Educação Profissional as notas e feedbacks que o Koba deixou como rascunho, depois do ok do professor. Nunca sobrescreve nota já dada. Use em "ok", "pode publicar", "lança as notas na plataforma".
---

# Koba – publicar

Ache a pasta de trabalho (`KOBA.txt`) e leia `REGRAS.md`, `config.json` e `estado.json`.

1. Liste os itens com `status: "rascunho"`. Se o professor pediu mudanças ("o Fulano é 7"), altere no `estado.json` antes.
2. Nunca publique itens com nota "revisar".
3. Confirme que está logado na plataforma (navegador do app).
4. Monte `[{cmid, assignmentid, contextid, userid, nota, feedback}]` (assignmentid/contextid estão em `dados/<chave>.json` → `tarefas`).
5. Agrupe por disciplina. Se a disciplina tem `grupo`, ative o grupo antes (ver `REGRAS.md`) — o painel de nota vem vazio para aluno de outro grupo.
6. Use o trecho 3 de `ajudantes.js` (publicador) em lotes de até 10. Ele confere de novo se o professor já deu nota e, se deu, pula ("já tinha nota").
7. Se vier "Form validation failed" ou painel vazio, confira o grupo ativo e o filtro `assign_filter` (ver `REGRAS.md`) e tente de novo uma vez.
8. Marque `status: "publicado"` só nos que voltaram `ok: true`. Volte o grupo original.
9. Rode `python planilha.py` e diga ao professor quantas notas foram publicadas, quantas foram puladas e por quê.
