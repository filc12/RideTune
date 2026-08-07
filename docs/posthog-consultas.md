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

**Objetivo, revisto em agosto de 2026:** o `category_estimate` já está a **zero** — ver
a secção 8. Deixou de ser a métrica a vigiar. O que interessa agora é ver o **`real_oem`
a subir à custa do `real_mfz`**, ou seja, dados de manual a substituir dados de
terceiros. Se o `category_estimate` alguma vez voltar a aparecer, é sinal de que entrou
gente com motos que o catálogo não cobre de todo, e a consulta 1 diz quais.

---

## 3. Que motos correm sobre dados fracos, no uso real

Precisa do `bike_id` no `setup_calculated`, acrescentado em agosto de 2026. **Só tem
dados a partir daí** — antes disso o evento não levava a moto.

A diferença face à consulta 1 é importante: a 1 conta **escolhas** no seletor, esta
conta **cálculos**. Alguém pode escolher uma moto por curiosidade e nunca mais lá
voltar; quem calcula setups repetidamente é quem está mesmo a usar a app.

```sql
select
  properties.bike_id                        as moto,
  properties.confidence                     as confianca,
  count()                                   as calculos,
  count(distinct person_id)                 as pessoas
from events
where event = 'setup_calculated'
  and properties.confidence in ('real_mfz', 'brand_formula')
  and timestamp > now() - interval 90 day
group by moto, confianca
order by calculos desc
```

**Porque é que não filtra por `category_estimate`:** filtrava, até agosto de 2026, e
devolvia **zero linhas**. Não era avaria — é que o `category_estimate` **nunca chega a
correr** (secção 8). Uma consulta que pergunta por uma coisa que não acontece devolve
vazio para sempre e não ensina nada.

O alvo passou a ser o `real_mfz`, que é dados de terceiros, e o `brand_formula`, que é a
fórmula da marca aplicada a motos sem perfil. Uma moto no topo desta lista com
`real_mfz` precisa de manual para o perfil que já tem; com `brand_formula`, precisa de
perfil de raiz.

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

### Quem corre sobre dados fracos usa a app três vezes mais

A primeira execução da consulta 3, no mesmo dia, acrescentou o que a 2 não mostra — a
contagem de **pessoas** por trás dos cálculos:

| Confiança | Cálculos | Pessoas | Cálculos por pessoa |
|---|---:|---:|---:|
| `real_mfz` | 351 | 48 | **7,3** |
| `brand_formula` | 150 | 60 | **2,5** |

**Menos gente, muito mais utilização.** O `real_mfz` não é só a maior fatia dos cálculos
— é a fatia dos utilizadores mais activos.

**Duas leituras, e os dados não as distinguem:** ou são simplesmente os mais dedicados,
ou estão a recalcular repetidamente porque a resposta não os satisfaz. A segunda
hipótese seria má notícia e vale a pena tê-la em mente — o `setup_calculated` dispara a
cada mudança de moto ou de carga, portanto sete cálculos por pessoa tanto pode ser
exploração como insatisfação.

**Ressalva:** uma pessoa pode contar nos dois grupos, se tiver motos diferentes ou
mudar de carga. Os 48 e os 60 não somam para um total limpo.

### A janela não interessa — os dados são todos recentes

A consulta 2 usa **30 dias** e a 3 usa **90**, e ambas devolvem os mesmos 351 e 150.
Ou seja, **não há um único evento com mais de 30 dias**. Ou é a retenção do plano
gratuito do PostHog a cortar, ou a utilização é toda recente.

Consequência prática, para não se tirarem conclusões erradas: **comparações «mês a mês»
não têm história atrás.** A leitura de agosto de 2026 registada acima é o primeiro marco
que existe, e o próximo só ganha significado depois de passar tempo suficiente. Se uma
consulta com janela de 90 ou 180 dias vier curta, é isto e não falta de utilizadores.

---

## 9. Que motos as pessoas procuram e NÃO existem

O ponto cego que faltava fechar. As consultas 1 e 3 só falam de motos **que estão no
catálogo** — quem procura uma que não existe nunca chega a escolher nada, e até agosto de
2026 saía da app sem deixar rasto. Foi por comentário de um utilizador que se percebeu que
faltava a BMW R1200GS LC, não por medição.

O evento `bike_search_empty` só começa a ter dados **depois do OTA de agosto de 2026**.

```sql
select
  properties.termo                          as procurou,
  count()                                   as vezes,
  count(distinct person_id)                 as pessoas
from events
where event = 'bike_search_empty'
  and timestamp > now() - interval 90 day
group by procurou
order by pessoas desc
limit 40
```

**Como ler.** Cada linha é uma moto que alguém quis e a app não tinha. Ordena-se por
`pessoas`: se cinco pessoas diferentes escreveram «r1200gs», é uma moto a acrescentar; se
foi uma pessoa quinze vezes, é uma pessoa insistente.

**O que o evento já filtra, para não teres de o fazer aqui:** só dispara com **três ou
mais caracteres**, só **1,2 segundos depois da última tecla** — quem escreve «bmw» passa
por «b» e «bm», que não são pesquisas falhadas — e **não repete o mesmo termo** enquanto o
seletor estiver aberto.

**Cuidado ao interpretar:** o termo vem normalizado, sem acentos e em minúsculas, e
truncado a 40 caracteres. E uma pesquisa falhada nem sempre é uma moto em falta — pode ser
alguém a escrever mal o nome, ou a procurar por cilindrada. Vale a pena olhar para os
termos antes de os tratar como pedidos.

## 10. A app é para consultar ou para registar?

A pergunta de produto que está por responder desde agosto de 2026, e a única em cima da
mesa que pode **tirar** trabalho em vez de acrescentar.

**O que se sabe:** pneus 38 % e sag 36 % de pessoas, contra diário 9 % e setups 6 %. Mas
isso são **aberturas de ecrã**. Abrir o diário uma vez por curiosidade e escrever nele todas
as semanas contam igual, e são coisas opostas.

**O que falta saber:** dos que abrem, quantos chegam a escrever alguma coisa.

```sql
select
  count(distinct if(event = 'screen_viewed' and properties.screen = 'diario', person_id, null)) as diario_abriram,
  count(distinct if(event = 'diary_entry_created',                            person_id, null)) as diario_escreveram,
  count(distinct if(event = 'screen_viewed' and properties.screen = 'setups',  person_id, null)) as setups_abriram,
  count(distinct if(event = 'setup_saved',                                     person_id, null)) as setups_guardaram,
  count(distinct if(event = 'setup_calculated',                                person_id, null)) as calcularam
from events
where timestamp > now() - interval 90 day
```

E a segunda metade, que separa quem experimentou de quem usa:

```sql
select
  event                                          as accao,
  count(distinct person_id)                      as pessoas,
  count()                                        as vezes,
  round(count() / count(distinct person_id), 1)  as por_pessoa
from events
where event in ('diary_entry_created', 'setup_saved')
  and timestamp > now() - interval 90 day
group by accao
```

### A leitura, escrita ANTES de ver os números

Isto é de propósito. Uma pergunta de produto respondida depois de se olhar para os dados
arranja-se sempre uma história que justifique o que já se queria fazer.

**Se a conversão for alta e o «por pessoa» também** — digamos, metade dos que abrem escrevem,
e escrevem várias vezes — então o diário **é** usado, só que por pouca gente. Nesse caso o
número baixo é de descoberta, não de valor: a funcionalidade está escondida, e o trabalho
certo é dar-lhe visibilidade, não mexer-lhe por dentro.

**Se a conversão for alta mas o «por pessoa» for perto de 1** — as pessoas experimentam,
gostam do que veem, e não voltam. É o pior dos casos, porque parece bom nas contagens. Quer
dizer que falta uma razão para voltar, e essa razão não se acrescenta com mais campos no
formulário.

**Se a conversão for baixa** — abrem e não escrevem — o problema é o ecrã, não o conceito.
Vale a pena um arranjo, mas pequeno e com prazo.

**Se os números forem baixos nas duas pontas**, a resposta honesta é que a app é de consulta,
e o diário e os setups devem ser **congelados** — não apagados, que partiria dados de quem os
usa, mas fora da lista do que recebe trabalho. Cada funcionalidade viva custa em traduções
(seis línguas), em testes e em atenção a cada alteração dos dados.

**Ressalva de tamanho.** Com 218 utilizadores no total, os 16 do diário e os 11 dos setups
são poucos para conclusões finas. Diferenças de dois ou três não querem dizer nada. Isto
serve para distinguir «quase ninguém» de «alguns, a sério», que é uma diferença grande o
suficiente para se ver com esta amostra — e não para afinar percentagens.

---

## 11. Alguém usa o sistema imperial?

Acrescentado em agosto de 2026 a pedido de **um** utilizador. Uma amostra de um não decide
nada — isto diz se havia mais gente calada.

```sql
select
  properties.units       as sistema,
  properties.automatico  as veio_do_telemovel,
  count(distinct person_id) as pessoas
from events
where event = 'units_changed'
  and timestamp > now() - interval 90 day
group by sistema, veio_do_telemovel
order by pessoas desc
```

**A distinção que interessa** está no `automatico`. A `false` são pessoas que foram às
Definições mudar de propósito — isso é vontade. A `true` seria quem abriu a app já em
libras por ter o telemóvel configurado nos EUA, e mede alcance, não vontade. Neste momento
só se regista o caso `false`, porque a escolha automática não dispara evento: seria contar
como interesse aquilo que é apenas geografia.

**Como ler:** se ao fim de um mês só o autor do pedido tiver mexido nisto, a funcionalidade
custou pouco e fica. Se aparecerem dez, vale a pena olhar para o resto — a pressão já mostra
PSI, mas o sag continua em milímetros, e foi decisão deliberada que se pode rever com dados.

---

## Notas

- **A retenção de eventos no plano gratuito do PostHog é limitada.** Se alguma destas
  janelas de 90 ou 180 dias vier vazia, é por isso e não por não haver utilizadores.
- **Aquele evento que fazia falta já existe:** é o `bike_search_empty`, consulta 9. A nota
  antiga dizia que faltava; foi acrescentado em agosto de 2026.