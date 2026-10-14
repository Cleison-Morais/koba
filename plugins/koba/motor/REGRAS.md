# Regras do Koba (valem para todos os comandos)

## Pasta de trabalho
Cada professor tem uma pasta de trabalho do Koba (padrão: `Documentos/Koba`). Ela tem o arquivo `KOBA.txt` e guarda:
- `config.json`: escolhas do professor (criado pelo `/koba:configurar`)
- `planilha.py`, `coletor.js`, `ajudantes.js`: cópia do motor
- `perfis/`: perfis de rigor
- `calibracao.json`: exemplos que o professor corrigiu no `/koba:calibrar`
- `estado.json`: notas que o Koba deu (rascunho / publicado)
- `dados/`: o que foi coletado da plataforma
- `entrada/`: onde o professor solta a planilha da Prova Paulista
- a planilha de notas

Para achar a pasta, procure `KOBA.txt` nas pastas conectadas ao Claude. Se não achar, peça ao professor para conectar a pasta ou rode o `/koba:configurar`.
**Os dados dos alunos nunca saem dessa pasta.** Nunca copie nomes, notas ou textos de alunos para o repositório do Koba, para o GitHub ou para outro lugar.

## Proteções (nenhuma configuração desliga)
1. Nunca digite senha nem clique em "Sair". Se o login expirou, peça ao professor para entrar pelo navegador do app e responder "pronto".
2. Nunca sobrescreva nota que o professor já deu na plataforma. A nota da plataforma sempre vale.
3. Nunca publique fora da regra de `publicacao` do config. O padrão é pedir "ok".
4. Se não der para ler a entrega (imagem ilegível, arquivo que não abre), não invente nota: marque "revisar" e avise.
5. Não mexa em disciplinas que não estão no config.
6. Se um site mostrar aviso de "interação automatizada" ou pedir preenchimento manual, PARE, não tente contornar e avise o professor. A Sala do Futuro, por exemplo, não aceita lançamento automático de notas.

## Como dar a nota de um registro
1. Leia o enunciado da tarefa (`p.enunciado`) e a entrega do aluno (`p.conteudo`).
2. Classifique a entrega em UMA situação:

| Situação | Quando usar |
|---|---|
| `completa` | Fez tudo o que o roteiro pedia, correto |
| `erro_pequeno` | Completa, com um erro pequeno |
| `parcial` | Tem a ver com a atividade, mas falta parte ou tem erro que impede de funcionar |
| `relato_generico` | Texto contando o que fez, coerente com a atividade, sem o produto (código, quadro, tabela) |
| `so_feito_em_sala` | Só escreveu "feito em sala", "fiz conforme pedido" ou parecido |
| `so_repetiu_roteiro` | Só copiou os passos do roteiro, sem mostrar o que fez |
| `ia_conteudo_certo` | Texto colado de IA (marcas como "Claro, vou…", "[Seu nome]", exemplos genéricos), mas com a resposta certa |
| `ia_sem_conteudo` | Texto de IA ou modelo sem a resposta de verdade |
| `semana_errada` | Resposta certa, mas de outra semana/atividade |
| `vazio_ou_sem_relacao` | Vazio, ".", sem relação, ou recusa de IA colada ("não posso ajudar") |

3. Pegue a nota da situação no perfil de rigor (`perfis/<rigor>.json`). Se `ajustes` no config tiver a mesma chave, ela vale no lugar do perfil. Se a disciplina tiver `rigor` próprio, use o perfil dela.
4. Aplique, nesta ordem:
   - atraso (se o perfil tiver desconto e a entrega tiver data depois do prazo; se a coleta não trouxer a data, ignore)
   - textos iguais entre alunos (perfil decide se só avisa ou também desconta)
   - regras por aluno de `regras_alunos.json`, se existir (ex.: nota mínima). Esse arquivo é só do professor.
   - nunca menos que 0 nem mais que 10.
5. Se existir `calibracao.json`, compare com os exemplos que o professor corrigiu. Quando a entrega se parecer com um exemplo, siga a nota que o professor deu nele.
6. Escreva o feedback para o aluno conforme `feedback` (curto = 1 frase; detalhado = 2–3 frases; com `dica_de_melhoria` diga o que faltou).
7. Registre sempre em "alerta": texto com cara de IA, textos idênticos entre alunos, reclamação do aluno, nota "revisar".

## Detalhes da plataforma (Moodle da Educação Profissional)
- Se a disciplina tem `grupo` no config, antes de coletar e antes de publicar, ative o grupo: `await fetch('/mod/assign/view.php?id=<cmid de uma tarefa>&action=grading&group=<grupo>')`. No fim, volte ao grupo que estava antes.
- Se a tabela de avaliação vier só com quem não enviou, o filtro do professor está em "não enviados". Zere com `core_user_update_user_preferences` (`type: 'assign_filter', value: ''`).
- Reenvio de entrega que já tinha nota aparece sem nota na tabela: não corrija de novo. O publicador avisa "já tinha nota".
- O `javascript_tool` corta em ~45 s: rode a coleta em segundo plano e consulte a cada 30 s.
