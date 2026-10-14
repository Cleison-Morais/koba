---
name: planilha
description: Atualiza a planilha de notas do Koba (médias com os pesos do professor, cores pela nota de corte, aba Resumo com quem cobrar). Importa a Prova Paulista se o professor soltar a planilha na pasta entrada. Use em "atualiza a planilha", "importei a prova paulista", "mudei os pesos".
---

# Koba – planilha

1. Ache a pasta de trabalho (`KOBA.txt`) e confira se `dados/` tem os arquivos coletados (se não, sugira `/koba:corrigir`).
2. Rode `python planilha.py` nessa pasta (instale `openpyxl` com pip se faltar).
3. Se responder que a planilha está aberta, peça para fechar o Excel **sem salvar** e rode de novo.
4. O motor:
   - mantém o que o professor digitou nas colunas de Prova Paulista e da outra nota;
   - importa a Prova Paulista de qualquer .xlsx/.csv em `entrada/` (precisa de uma coluna "Nome" e uma "Nota");
   - guarda cópia de segurança da Prova Paulista em `dados/`;
   - substitui Registro + Quiz pela recuperação se existir `dados/recuperacao.json` (`{ "aba": { "Nome do aluno": nota } }`) e ela for maior; a célula fica amarela.
5. Mostre os avisos que o script devolveu e onde a planilha está.

Se o professor quiser mudar pesos, nota de corte ou nome da coluna, altere o `config.json` (ou use `/koba:configurar`) e rode de novo.
