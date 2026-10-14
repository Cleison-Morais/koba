# 🦉 Koba — o agente que corrige as atividades da Educação Profissional

O Koba corrige as **atividades de registro** da plataforma **Educação Profissional (SEDUC-SP)**, dá nota e feedback do jeito que **você** corrigiria, publica as notas na plataforma só depois do seu **ok** e mantém uma **planilha de médias** sempre atualizada, com a lista de quem você precisa cobrar.

Ele roda dentro do **Claude** (app do computador), como um plugin.

> O nome é uma homenagem à E.E. Prof. Paulo **Koba**yashi (Suzano-SP), onde o Koba nasceu.

---

## O que o Koba faz

| Comando | Para que serve |
|---|---|
| `/koba:configurar` | Primeiro uso: escolhe disciplinas, turmas, pesos da média e **nível de rigor** conversando com você |
| `/koba:calibrar` | Corrige 10 entregas de exemplo; você ajusta as notas e o Koba aprende o seu jeito |
| `/koba:corrigir` | Busca o que os alunos entregaram, corrige e deixa as notas como rascunho |
| `/koba:publicar` | Publica as notas e os feedbacks na plataforma (só depois do seu ok) |
| `/koba:planilha` | Atualiza a planilha de médias (importa a Prova Paulista se você soltar o arquivo na pasta) |
| `/koba:resumo` | Quem entregou, quem não entregou e quem cobrar |

Você também pode só conversar: *"Koba, corrige Lógica e me diz quem não entregou"*.

## Nível de rigor

Escolha um perfil e, se quiser, mude só a linha que não combina com você.

| Situação | Acolhedor | Equilibrado | Rigoroso |
|---|:-:|:-:|:-:|
| Completa e correta | 10 | 10 | 10 |
| Erro pequeno | 9 | 8 | 7 |
| Parcial | 7 | 6 | 5 |
| Relato em texto, sem o produto | 7 | 7 | 4 |
| Só "feito em sala" | 6 | 5 | 2 |
| Só copiou o roteiro | 5 | 4 | 0 |
| IA colada, conteúdo certo | 8 | 6 | 3 |
| IA sem conteúdo real | 4 | 3 | 0 |
| Resposta certa na semana errada | 10 | 8 | 6 |
| Vazio ou sem relação | 0 | 0 | 0 |
| Entrega atrasada | — | — | −2 |
| Textos iguais entre alunos | avisa | avisa | avisa e −3 |

Também dá para configurar: rigor diferente por disciplina, feedback curto ou detalhado, tom formal ou informal, publicação automática a partir de certa nota, pesos da média, nota de corte e arredondamento.

## Proteções que não desligam

- 🔒 **Nunca digita senha.** Você faz o login; o Koba usa a sua sessão.
- ✋ **Nunca apaga nem muda nota que você já deu.**
- ✅ **Nunca publica sem a sua regra** (o padrão é pedir ok).
- ❓ Se não conseguir ler a entrega, marca **"revisar"** em vez de inventar nota.
- 🏠 **Os dados dos alunos ficam só no seu computador.** Nada de nome, nota ou texto de aluno vai para este repositório.
- 🚫 Não tenta burlar sistemas que pedem preenchimento manual (como a **Sala do Futuro**, que bloqueia lançamento automático — lá as notas continuam sendo digitadas por você; o Koba gera a lista pronta).

## Instalação

**Você precisa de:** plano pago do Claude (Pro ou superior), o **app do Claude para computador** e **Python 3** com `openpyxl` (o Koba instala se faltar).

### No Claude Code (terminal)
```
/plugin marketplace add Cleison-Morais/koba
/plugin install koba@koba
```

### No app do Claude
Abra o gerenciador de plugins, escolha **adicionar marketplace**, cole `Cleison-Morais/koba` e instale o **koba**.

Depois, rode `/koba:configurar`.

## Primeiro uso (10 minutos)
1. `/koba:configurar` — responda as perguntas; o Koba cria a pasta `Documentos/Koba`.
2. Entre na plataforma pelo **navegador do app do Claude** (o seu login fica salvo lá).
3. `/koba:calibrar` — corrija junto com ele 10 entregas.
4. `/koba:corrigir` — e pronto. Dá para pedir ao Claude para agendar uma execução diária.

## O que fica onde

```
Documentos/Koba/          ← só no seu computador
├── config.json           suas escolhas
├── calibracao.json       exemplos que você corrigiu
├── regras_alunos.json    regras especiais por aluno (opcional)
├── estado.json           notas dadas (rascunho/publicado)
├── dados/                o que veio da plataforma
├── entrada/              solte aqui a planilha da Prova Paulista
└── NOTAS KOBA.xlsx       sua planilha
```

## Avisos

- O Koba é um **assistente**. A nota é responsabilidade do professor: confira os rascunhos antes de dar ok, principalmente no começo.
- Projeto independente, feito por um professor; **não é ferramenta oficial da SEDUC-SP**. Use de acordo com as orientações da sua escola e da LGPD.
- Encontrou um problema ou tem ideia? Abra uma *issue* aqui no GitHub.

## Licença
MIT — use, adapte e compartilhe. Feito por **Cleison Morais**.
