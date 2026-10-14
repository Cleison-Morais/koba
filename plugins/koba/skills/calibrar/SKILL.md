---
name: calibrar
description: Ensina o Koba a corrigir do jeito do professor. Corrige 10 entregas reais de exemplo, o professor ajusta as notas e o Koba guarda os exemplos e ajusta o perfil de rigor. Use em "calibrar o Koba", "o Koba está dando nota alta/baixa demais", "corrige do meu jeito".
---

# Koba – calibrar

Leia `REGRAS.md` na pasta de trabalho (ache a pasta pelo `KOBA.txt`).

1. Peça ao professor para entrar na plataforma pelo navegador do app.
2. Rode a coleta de UMA disciplina (como em `/koba:corrigir`, passos 2–3) e escolha **10 entregas variadas**: algumas completas, algumas fracas, alguma com cara de IA, algum "feito em sala". Prefira entregas que já têm nota dada pelo professor na plataforma: elas servem de gabarito sem ele precisar fazer nada.
3. Para cada entrega, mostre ao professor: atividade, um trecho curto da entrega, a situação que você escolheu, a nota pelo perfil e o feedback. Se já houver nota do professor, mostre lado a lado.
4. Pergunte (AskUserQuestion, em lotes) se a nota está certa ou qual seria.
5. Grave em `calibracao.json` cada exemplo assim: `{ "tarefa", "situacao", "resumo_da_entrega" (1 frase, SEM nome do aluno), "nota_koba", "nota_professor", "motivo" }`.
6. Se o professor mudou a nota de uma mesma situação 2 vezes ou mais na mesma direção, proponha mudar `ajustes` no config (ex.: "`ia_conteudo_certo`: 6 → 7?") e grave só se ele concordar.
7. Termine com: quantas notas bateram, o que foi ajustado e a sugestão de rodar `/koba:corrigir`.

Nada aqui é publicado na plataforma.
