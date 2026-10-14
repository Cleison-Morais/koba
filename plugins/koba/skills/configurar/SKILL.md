---
name: configurar
description: Primeiro uso do Koba ou mudança de configuração. Pergunta ao professor escola, disciplinas, turmas, pesos da média, nível de rigor e forma de feedback, e monta a pasta de trabalho. Use quando o professor disser "configurar o Koba", "mudar o rigor", "mudar os pesos", "adicionar disciplina".
---

# Koba – configurar

Você vai montar (ou atualizar) a pasta de trabalho do Koba conversando com o professor. Fale em português simples; ele não precisa saber o que é JSON.
Leia antes `../../motor/REGRAS.md` (caminho relativo a esta skill).

## 1. Pasta de trabalho
- Procure `KOBA.txt` nas pastas conectadas. Se existir, leia o `config.json` e pergunte só o que o professor quer mudar (pule para o passo 3).
- Se não existir, sugira criar `Documentos/Koba` (peça acesso à pasta se precisar) e copie para lá: `../../motor/planilha.py`, `coletor.js`, `ajudantes.js`, `REGRAS.md` e a pasta `perfis/`. Crie `KOBA.txt` com a frase "Pasta de trabalho do Koba – não apague", e as pastas `dados/` e `entrada/`.

## 2. Perguntas (use AskUserQuestion, no máximo 4 por vez)
1. **Nome** do professor e **escola**.
2. **Disciplinas**: abra a plataforma no navegador do app (o professor faz o login) e liste os cursos em "Minhas disciplinas". Pergunte quais o Koba vai corrigir e que nome curto cada aba da planilha terá. Guarde o `id` do curso. Se a mesma disciplina tiver turmas diferentes no mesmo curso, pergunte o grupo de cada uma e guarde o id do grupo.
3. **Rigor**: mostre a tabela dos três perfis (`perfis/*.json`) e pergunte qual usar. Explique: "Dá para mudar só uma linha depois, ou ter rigor diferente por disciplina."
4. **Feedback ao aluno**: curto ou detalhado; formal ou informal; com dica de melhoria ou não.
5. **Publicação**: "sempre pedir meu ok" (padrão) ou "publicar sozinho notas a partir de X e pedir ok no resto".
6. **Média**: pesos de registro, quiz, prova (ex.: Prova Paulista) e outra nota (ex.: Classroom), nome dessa outra nota, nota de corte (5 ou 6) e arredondamento (normal / para cima).
7. **Semanas que contam** no bimestre atual (semana inicial e final).
8. **Regras por aluno** (opcional): ex. nota mínima para um aluno com dificuldade. Salve em `regras_alunos.json` na pasta de trabalho, nunca no plugin.

## 3. Gravar
Monte `config.json` seguindo `../../motor/config.exemplo.json`:
- `abas`: mapa `"id do curso": "nome da aba"` (o motor da planilha usa isso).
- `disciplinas`: lista com `curso`, `aba`, `grupo` (ou null) e `rigor` (ou null para usar o geral).
- `ajustes`: só as linhas que o professor mudou em relação ao perfil.
- `pesos` em fração (20% = 0.2). Confira se somam 1.

Mostre um resumo em tabela do que ficou configurado e sugira o próximo passo: `/koba:calibrar` (recomendado) ou `/koba:corrigir`.
