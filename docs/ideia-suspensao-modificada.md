# Suspensão modificada (pós-venda)

**Estado:** ideia guardada, não iniciada.
**Decisão:** avançar só depois do lançamento iOS.
**Origem:** comentário de um utilizador com BMW R1200GS Adventure LC e amortecedor
Touratech compatível com ESA, com anéis de HS, LS e precarga. Perguntou se a app
servia para ele. Hoje não serve.

---

## O problema

Os valores da app são bases de fábrica lidas do manual do proprietário. Quem monta
um amortecedor Touratech, Öhlins ou Wilbers passa a ter outro valving, outra mola e
outro número total de cliques — os números de origem deixam de descrever o hardware
que a moto tem. Dar-lhe os valores originais seria pior do que não dar nada.

Quem gasta várias centenas de euros numa suspensão é exatamente quem mais se importa
com o setup, e neste momento não temos nada para lhe oferecer.

## A ideia

O utilizador **não escolhe um amortecedor de um catálogo nosso**. Ele declara o que
tem, e a app passa a ser uma calculadora sobre a base dele em vez de fingir que
conhece o hardware.

Por afinador, três perguntas: existe, quantos cliques tem ao todo, e qual é a base
recomendada para o peso dele. Essa informação vem da folha que o fabricante do
amortecedor lhe entregou — a Touratech, a Öhlins e a Wilbers publicam valores por
peso de piloto.

A partir daí aplica-se a mesma lógica de carga que a app já usa.

## Porque é mais pequeno do que parece

Grande parte já existe:

- O `MfzProfile` já representa HS e LS em separado (`hsComp`, `lsComp`) — usa-o nas rally.
- O `pos`, o `na`, a interpolação por `weightPoints`, o diário e os setups guardados
  funcionam na mesma.
- A célula do ecrã já sabe mostrar número, curso, AJUSTA e N/A.

Estamos a acrescentar uma **origem de dados**, não um motor novo.

## O que é mesmo preciso mexer

1. **Nível de confiança novo** — `owner_baseline`, "Base tua". Inegociável: não pode
   aparecer "Manual OEM" por cima de números que vieram do utilizador. Ver
   `ConfidenceLevel` em `src/utils/suspensionReal.ts`.
2. **Guardar a configuração por moto** — hoje só guardamos o id da moto escolhida.
3. **Ecrã de introdução** dos afinadores.
4. **Traduções** nos seis idiomas.

## O que lançar primeiro

Só o essencial: interruptor original/modificada, e por afinador as três perguntas.
Sem marcas, sem catálogo de amortecedores. Funciona no dia um para qualquer hardware
do mundo, incluindo unidades que ninguém documentou, e não exige investigação nenhuma
da nossa parte.

Os perfis prontos por marca — escolher "Touratech Extreme" e vir tudo preenchido —
são a versão dois. Só vale a pena depois de vermos que marcas os utilizadores
realmente têm, e a app pode dizer-nos isso.

## Cuidado com a ESA

Numa unidade compatível com ESA, a eletrónica manda no amortecimento por modo e os
anéis HS/LS são a base mecânica por baixo. A app tem de dizer isto de forma explícita:
define a base pelo sag e pelos anéis, depois usa os modos ESA por cima. Sem esse aviso,
alguém vai assumir que os cliques substituem os modos.

## Notas de produto

- Candidata natural a **premium**. Quem tem suspensão de pós-venda já provou que paga
  por setup.
- O sag continua a ser a validação correta e já funciona para estes utilizadores hoje,
  seja qual for o amortecedor. Vale a pena dizer-lho enquanto a funcionalidade não existe.
