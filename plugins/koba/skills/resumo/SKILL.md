---
name: resumo
description: Resumo das entregas para o professor cobrar os alunos — quem entregou e quem não entregou a última atividade, lista PARA COBRAR por aluno e alertas (cópia, IA). Use em "quem não entregou?", "me dá o resumo", "quem eu cobro?".
---

# Koba – resumo

1. Ache a pasta de trabalho (`KOBA.txt`). Rode `python planilha.py` (ele devolve `resumo` e `cobrar` em JSON). Se os dados forem de mais de 1 dia, sugira rodar `/koba:corrigir` antes.
2. Escreva em português simples, sem jargão:
   - **Por disciplina**, a atividade mais recente: quantos entregaram e a lista de quem NÃO entregou.
   - **PARA COBRAR**: cada aluno com as atividades que faltam, agrupado por turma.
   - **Alertas** do `estado.json` ainda não vistos: textos iguais, cara de IA, notas "revisar".
   - **Rascunhos esperando publicação**, se houver, com a pergunta "Posso publicar?".
3. Se o professor pedir, transforme o resumo em mensagem pronta para mandar à turma (sem expor nota de ninguém).
