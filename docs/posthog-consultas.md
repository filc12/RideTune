# Consultas PostHog — o que perguntar aos dados

**Para que serve este ficheiro:** decidir o que fazer a seguir com números em vez de
com intuição. Até aqui o catálogo cresceu por palpite informado — «estas são as motos
mais expostas», «esta marca deve ter muita gente». Não era mau palpite, mas é palpite.
A app já regista o que é preciso para o substituir.

Todas as consultas se correm em **PostHog → Product analytics → SQL** (HogQL).

---

## 1. Que manuais caçar a seguir

A pergunta que mais rende. Devolve as motos que as pessoas escolhem e para as quais
não temos perfil real — por ordem de quantas pessoas as escolheram.

```sql
select
  properties.bike_id                        as moto,
  properties.brand                          as marca,
  count(distinct person_id)                 as pessoas,
  count()                                   as escolhas
from events
where event = 'bike_selected'
  and properties.has_oem_data = false
  and timestamp > now() - interval 90 day
group by moto, marca
order by pessoas desc
```

**Como ler:** a primeira linha é o manual que vale mais a pena procurar. Ordena-se por
`pessoas`, não por `escolhas`, para uma pessoa que troca de moto vinte vezes não
enviesar a lista.

**Cuidado:** `has_oem_data` é `Boolean(b.mfzProfileId)`. Uma moto pode ter
`adjusters` preenchidos por manual e continuar a aparecer aqui — é o caso do
Versys 650. Não é erro: quer dizer que sabemos que afinadores tem mas não os valores.

---

## 2. Quanta da app corre sobre números inventados

A métrica de qualidade do produto inteiro. É a que vale a pena ver mês a mês.

```sql
select
  properties.confidence                     as confianca,
  count()                                   as calculos,
  round(100.0 * count() / sum(count()) over (), 1) as pct
from events
where event = 'setup_calculated'
  and timestamp > now() - interval 30 day
group by confianca
order by calculos desc
```

Os valores de `confidence` são `real_oem`, `real_mfz`, `brand_formula` e
`category_estimate`. Os dois primeiros são dados reais; o `brand_formula` é a fórmula
conhecida da marca aplicada a uma base real; o **`category_estimate` é a heurística
pura** — números que ninguém publicou.

**Objetivo:** ver o `category_estimate` a descer ao longo do tempo. Se subir, quer
dizer que estão a entrar utilizadores com motos que o catálogo não cobre, e a
consulta 1 diz quais.

---

## 3. Que motos geram números inventados no uso real

Precisa do `bike_id` no `setup_calculated`, acrescentado em agosto de 2026. **Só tem
dados a partir daí** — antes disso o evento não levava a moto.

A diferença face à consulta 1 é importante: a 1 conta **escolhas** no seletor, esta
conta **cálculos**. Alguém pode escolher uma moto por curiosidade e nunca mais lá
voltar; quem calcula setups repetidamente é quem está mesmo a usar a app.

```sql
select
  properties.bike_id                        as moto,
  count()                                   as calculos,
  count(distinct person_id)                 as pessoas
from events
where event = 'setup_calculated'
  and properties.confidence = 'category_estimate'
  and timestamp > now() - interval 90 day
group by moto
order by calculos desc
```

---

## 4. Onde é que as pessoas desistem

```sql
select
  properties.screen                         as ecra,
  count(distinct person_id)                 as pessoas
from events
where event = 'screen_viewed'
  and timestamp > now() - interval 30 day
group by ecra
order by pessoas desc
```

Comparar com `onboarding_completed` e `setup_calculated` do mesmo período. Se muita
gente vê ecrãs e poucos calculam alguma coisa, o problema não é de dados, é de
percurso.

---

## 5. Premium: quem vê e quem converte

```sql
select
  countIf(event = 'premium_modal_shown')    as viram,
  countIf(event = 'premium_converted')      as converteram,
  round(100.0 * countIf(event = 'premium_converted')
              / nullif(countIf(event = 'premium_modal_shown'), 0), 2) as pct
from events
where event in ('premium_modal_shown', 'premium_converted')
  and timestamp > now() - interval 90 day
```

Cruzar com o `confidence` do `setup_calculated` responde a uma pergunta de produto
que ainda não temos respondida: **quem converte tem dados reais na moto dele, ou
converte apesar de a app lhe estar a dar estimativas?** Se for o primeiro, cada manual
novo vale dinheiro e não só qualidade.

---

## 6. Que línguas se usam mesmo

```sql
select
  properties.language                       as lingua,
  count(distinct person_id)                 as pessoas
from events
where event = 'language_changed'
  and timestamp > now() - interval 180 day
group by lingua
order by pessoas desc
```

A app está traduzida em seis línguas. Vale a pena saber se todas se justificam antes
de as manter em cada funcionalidade nova — as traduções são custo fixo em tudo o que
se acrescenta, e estão na lista do que a suspensão modificada vai precisar.

---


---

## 7. Que motos correm sobre dados de terceiros

A consulta 2 divide os cálculos por confiança. Quando o `real_mfz` for grande, esta diz
**em que motos** — ou seja, que perfis vale a pena promover de `mfzstudio.com` a manual.

Enquanto o `setup_calculated` não tiver `bike_id` acumulado (só começa a ter a partir do
OTA de agosto de 2026), usa-se este substituto, que conta escolhas em vez de cálculos:

```sql
select
  properties.bike_id                        as moto,
  properties.brand                          as marca,
  count(distinct person_id)                 as pessoas
from events
where event = 'bike_selected'
  and properties.has_oem_data = true
  and timestamp > now() - interval 90 day
group by moto, marca
order by pessoas desc
limit 30
```

**Como usar:** cruzar a lista com os perfis que ainda não são `oem_manual`. Em agosto de
2026 eram 19, concentrados assim: **CFMoto 700MT** (o único da marca sem manual, mas a
CFMoto tem 81 utilizadores), **nove KTM** e **quatro Kove**. Uma moto muito escolhida cujo
perfil ainda seja `mfz` é a candidata óbvia ao próximo manual.

---

## 8. Leitura de agosto de 2026, para comparar depois

Primeira medição da consulta 2, para servir de marco:

| Confiança | Cálculos | % |
|---|---:|---:|
| `real_mfz` | 351 | 53,4% |
| `real_oem` | 156 | 23,7% |
| `brand_formula` | 150 | 22,8% |
| `category_estimate` | **0** | **0%** |

**O `category_estimate` a zero é o resultado mais importante deste documento.** A
heurística por categoria — a que inventa números quando não se sabe nada — **nunca chega
a correr**. O medo que moldou boa parte do desenho do catálogo já não se aplica.

O problema real é outro e mais fino: **mais de metade dos cálculos corre sobre dados do
`mfzstudio.com`**, que é um sítio de terceiros, não um manual. E 22,8% corre sobre a
fórmula da marca aplicada a motos que ainda não têm perfil nenhum.

A meta deixa de ser «baixar o `category_estimate`» — está feito — e passa a ser **subir o
`real_oem`** à custa do `real_mfz`.

## Notas

- **A retenção de eventos no plano gratuito do PostHog é limitada.** Se alguma destas
  janelas de 90 ou 180 dias vier vazia, é por isso e não por não haver utilizadores.
- **Falta um evento que daria jeito:** pesquisa no seletor sem resultados. Diria quais
  as motos que as pessoas procuram e **nem sequer existem** no catálogo — hoje só
  sabemos das que existem sem dados. Foi assim que se percebeu que faltava a
  R1200GS LC, mas por comentário de utilizador, não por medição.