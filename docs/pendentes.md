# Pendentes

Estado em 27/07/2026. O catálogo está em 114 motos e 65 perfis, com o Supabase
sincronizado com o código. A **1.1.5 (versionCode 22)** está em teste interno na
Play Store.

---

## Resolvido na 1.1.5

**Cache de dados OEM.** O `initOemData` aplicava o cache e fazia `return` se ele
tivesse menos de 7 dias, portanto nunca revalidava — uma moto nova levava até uma
semana a chegar a quem já tinha a app, e não havia forma de forçar. Agora aplica o
cache de imediato e revalida sempre em segundo plano, com um intervalo de 1 hora só
para não repetir o pedido em aberturas seguidas. A `refreshOemData`, que era código
morto, está ligada ao botão "Atualizar dados" nas definições.

**`expo-updates` instalado e configurado**, com `runtimeVersion` em `appVersion`.
A partir da 1.1.5 é possível corrigir JavaScript por OTA sem passar pela loja.
Atenção: como a política é `appVersion`, é preciso subir a versão no `app.json`
sempre que o nativo mude, senão pode empurrar-se um OTA incompativel.

**Canal OTA testado e a funcionar** (27/07/2026). Publicado com
`npx eas-cli update --channel production` a partir de `frontend/`, chegou ao
telemóvel ao fim de duas reaberturas completas — a primeira descarrega, a segunda
arranca já com o novo bundle.

Como confirmar qual o bundle em uso: a linha da versão nas Definições mostra
`v1.1.5 · OTA dd/mm` quando está a correr um update, e só `v1.1.5` quando está a
correr o que veio da Play Store. Serve para diagnóstico quando alguém reportar um
bug — diz que bundle é que o telemóvel dele tem.

**Armadilha do `appVersion`:** o update só chega a quem tem a versão nativa igual
à do `app.json` no momento da publicação. Se se subir a versão sem fazer build
nova, o OTA fica sem destinatários e não há erro nenhum a avisar.

Notas de ambiente, para não voltar a perder tempo:

- O projeto **não corre no Expo Go** (tem `react-native-purchases` e
  `@sentry/react-native`). É preciso development build.
- Os builds locais precisam de mais memória que a predefinição. Está em
  `~/.gradle/gradle.properties`: `org.gradle.jvmargs=-Xmx6g -XX:MaxMetaspaceSize=2g`.
  Sem isto, o `lintVitalAnalyzeRelease` rebenta com OutOfMemoryError: Metaspace.
- `eas build --local` não gasta a cota de builds da nuvem do plano gratuito.

---

## Catálogo

**5 motos ocultas**, à espera de manual do proprietário: CFMoto 1000 SR-R,
QJ SRT 600 SX, Voge 650 DSX, Voge 525 R, Voge R625.

**BMW R1200GS LC (2013-2018) não existe no catálogo.** Só temos R1250 e R1300. É
provavelmente a maior lacuna BMW, há muitas na estrada.

**Modelos QJ vendidos em Portugal que faltam:** SRT 700 ON, SRT 900 S, SRK 700,
SRV 550. Ver `qjmotor.pt`.

**Yamaha XT1200ZE** — a versão de suspensão eletrónica da XT1200Z. Seria perfil com
tudo `na`, como a BMW com ESA.

Vale a pena, a certa altura, comparar o catálogo com as gamas atuais dos importadores
portugueses em vez de ir moto a moto.

---

## Código

**`BikeAdjusters` não sabe representar afinadores combinados** — um parafuso que mexe
na compressão e na extensão ao mesmo tempo. Aparece em forquilhas baratas; ainda não
houve caso confirmado. Marcar `fComp` e `fReb` a true faria a app pedir dois números
para um só parafuso.

---

## Comunicação

**~~O material de divulgação promete "os valores exatos".~~ Corrigido.** Era verdade
para as 54 motos com perfil; para as outras é heurística por categoria. Passou a
"ponto de partida concreto ... a partir das regulações de fábrica do manual", nas
três línguas do `divulgacao-redes-v1.1.0.md`. Foi este tipo de promessa que levou um
utilizador a perguntar qual era a fonte das curvas de amortecimento.

Resposta a essa pergunta, para reutilizar: não usamos curvas de amortecimento e não o
afirmamos. Isso são dados força/velocidade do fabricante da suspensão, não publicados.
Usamos as regulações de fábrica do manual do proprietário, e tabelas de carga onde o
fabricante as publica.

---

## Ideias guardadas

- [Suspensão modificada (pós-venda)](./ideia-suspensao-modificada.md) — decidido
  avançar só depois do lançamento iOS.

---

## Website em telemovel — o que aprendemos

Quatro correcoes, todas a mesma causa: **um elemento em tamanho de desktop
que nao encolhe num ecra estreito**. Se aparecer outra pagina torta, e o
primeiro sitio a olhar.

- Cabecalho da /setups: menu sempre visivel, sem `hidden md:flex`
- Cartoes da /setups: `minmax(340px, 1fr)` nao cabe em 360px
- Tabela da pagina de moto: colunas `1fr` tem minimo em min-content
- Cabecalho da pagina principal: logotipo e botao em tamanho de desktop

Duas armadilhas que custaram tempo:

**Estilos inline ganham sempre ao Tailwind.** Um `style={{ display: "flex" }}`
anula um `className="hidden md:flex"`. Ao esconder algo, o `display` tem de
sair do inline.

**Elementos `position: fixed` nao aumentam o `scrollWidth` do documento.**
Cortam a vista mas nao deixam rasto mensuravel — uma analise automatica de
overflow nao os apanha. Foi por isso que dei a pagina principal como boa
quando estava cortada. Para cabecalhos fixos, ver com os olhos.

**Como medir sem telemovel:** forcar os tamanhos da versao mobile por
JavaScript e somar as larguras dos filhos do cabecalho. O alvo e caber em
360px, que e o telemovel Android mais estreito ainda comum.

---

## Pressões de pneus — o rótulo foi despromovido, falta verificar

**O que aconteceu.** Ao acrescentar a XT1200ZE reparei que o Supabase e o
codigo discordavam nas pressoes. A investigacao revelou pior: **101 das 107
motos no Supabase partilhavam apenas 6 combinacoes de valores, todas marcadas
`oem_manual`**. Um manual real nao produz isso.

Pior ainda, os dois lados discordam entre si e ambos discordam do manual:

| Africa Twin | frente solo | tras solo | tras carga |
|---|---|---|---|
| Manual Honda | 2,50 | 2,90 | 2,90 |
| Codigo | **2,00** | 2,50 | 2,90 |
| Supabase | 2,50 | 2,90 | **3,20** |

Verificado por pesquisa (mas ainda sem citacao de documento):
- **Yamaha Tenere 700**: 220/250 kPa. Tinhamos 2,3 a frente. Errado.
- **BMW R 1250 GS**: 2,5/2,9 **independentemente da carga**. Tinhamos 3,4 em
  carga. Inventado.
- **Honda Africa Twin**: 2,5/2,9. O nosso valor a solo esta certo no Supabase.
- **Ducati Multistrada V4**: fontes em conflito, nao verificavel.

**Padrao:** a coluna "em carga" e onde vive a invencao. Varios fabricantes dao
um so par de pressoes, sem distincao de carga. A tabela inventava sempre um
valor mais alto (3,2 / 3,4 / 2,8).

**O que foi feito.** So continua a afirmar `oem_manual` o que tem **citacao
concreta do documento** — o mesmo criterio que usamos na suspensao. Passaram de
106 para 3: Macbor Montana XR5 (manual PT, pag. 94) e as duas XT1200Z/ZE.
As restantes 104 estao `estimated_spec`, com a fonte marcada "— por confirmar".

**Os valores nao foram alterados**, so o rotulo. Continuam a ser o melhor
palpite; deixaram e' de ser apresentados como verdade verificada.

### O que a investigação de manuais já revelou (27/07)

**A BMW não publica as pressões no manual.** Confirmado no manual oficial da
R 1250 GS Adventure (`manuals.bmw-motorrad.com`, R_0M11_RM_0321_01.pdf): a lista
"debaixo do assento" inclui, no ponto 3, uma *Tyre pressures table* — um autocolante.
O texto do manual não contém um único valor em bar. Procurei por "bar", "kPa",
"2.5" e "2.9": zero ocorrências.

Consequência: **nenhuma BMW pode chegar a `oem_manual` por via do manual.** A única
fonte legítima é a foto do rótulo debaixo do assento. Isto também invalida a linha
que eu tinha escrito acima a dar a R 1250 GS como "verificada por pesquisa" — o que
encontrei foram sites de terceiros a repetir-se uns aos outros.

**Africa Twin: os dois lados estavam errados, e eu também.** O manual distingue
gerações, coisa que nenhum dos nossos conjuntos fazia:

| | frente | trás solo | trás 2 pessoas |
|---|---|---|---|
| CRF1000L (2016-2019) | 2,00 | 2,50 | 2,80 |
| CRF1100L (2020+) | 2,25 | 2,50 | 2,80 |
| *tínhamos no código* | 2,00 | 2,50 | 2,90 |
| *tínhamos no Supabase* | 2,50 | 2,90 | 3,20 |

O código tinha os valores da geração **anterior**; o Supabase não tinha os de
nenhuma. E a frente não muda com a carga — muda com o ano do modelo. Corrigido nos
dois lados para o CRF1100L (as nossas são 1084cc), incluindo a DCT, que não tinha
linha nenhuma. Fica em `estimated_spec` até eu conseguir citar a página: os PDF
oficiais da Honda são grandes demais para a ferramenta de leitura e a secção de
especificações fica sempre cortada.

**Lição de método:** um resumo de pesquisa não distingue gerações nem mercados. Foi
exatamente assim que a tabela original ganhou valores inventados. Só o documento
serve.

### Método que funciona (usar este)

O que falhou: procurar o PDF oficial. Os manuais têm 300-380 páginas e a
ferramenta de leitura corta a meio, sempre antes das especificações.

O que funciona: **`manualslib.com/manual/<id>/<Moto>.html?page=N`** devolve o texto
daquela página, com a tabela de pressões legível e o número de página para citar.
Procurar primeiro `manualslib <marca> <modelo> owner's manual tire pressure kPa`
para descobrir o N, depois ir buscar a página.

Verificadas assim (27/07), agora `oem_manual`:

| Moto | frente | trás solo | trás 2 pessoas | fonte |
|---|---|---|---|---|
| Ténéré 700 (2019-2024) | 2,20 | 2,50 | 2,50 | Manual de serviço 2020, pág. 82 |
| Tracer 9 | 2,50 | 2,90 | 2,90 | Manual MTT890D, pág. 85 |
| V-Strom 650 | 2,25 | 2,50 | **2,80** | Manual DL650A, pág. 92 |
| Tiger 900 / 900 GT | 2,50 | 2,90 | 2,90 | Manual Tiger 900 Series, pág. 189 |
| Tiger 900 Rally | **2,35** | 2,90 | 2,90 | Manual Tiger 900 Series, pág. 195 |
| V-Strom 800DE | 2,25 | 2,80 | 2,80 | Manual DL800DE, pág. 1-29 |
| Transalp XL750 | 2,25 | 2,50 | **2,80** | Etiqueta oficial Honda (webom) |
| Africa Twin (todas) | 2,25 | 2,50 | **2,80** | Etiqueta oficial Honda, MLN250 |

Correções que isto trouxe: a Ténéré tinha **2,25/2,50/2,90** — a frente errada e um
valor de carga inventado; o manual dá 220/250 iguais a solo e a dois, e **200/200
fora de estrada**, que não tínhamos. A V-Strom tinha a frente a variar com a carga,
quando não varia.

A T7 2025 e a World Raid ficaram com os valores corrigidos mas em
`estimated_spec` — são manuais diferentes e não li nenhum dos dois.

**Onde cada marca esconde os valores** (poupa uma leitura por moto):

- **Yamaha** — na secção "Tires" da manutenção, tabela «Cold tire air pressure»
  com 1 pessoa / 2 pessoas / off-road. A melhor documentada de todas.
- **Suzuki** — secção "Tire Pressure and Loading", tabela SOLO / DUAL RIDING.
- **Honda** — **usar `webom.hondamotopub.com`**. É o manual oficial em HTML,
  página a página, com a tabela da etiqueta «Tyre information & drive chain» em
  texto limpo. Resolve o problema dos PDF de 380 páginas que ficam sempre
  cortados. O caminho é `/webom/HMEE/<código>/html/index.html`; a etiqueta está
  em Vehicle Safety → Image Labels. Atenção que a Honda distingue geração.

  **Como encontrar o código do modelo:** procurar `hondamotopub.com/model/HMEE/<moto>`
  numa pesquisa. HMEE é a Europa. O código sai no URL (Transalp 2025 = MLC250,
  Africa Twin 2025 = MLN250). Depois é `webom.hondamotopub.com/webom/HMEE/<código>/html/`
  e a etiqueta está em `GMS005006` ou `GMS005007` — o número varia com o número de
  etiquetas do modelo, por isso convém abrir a primeira e seguir o índice.
- **Triumph** — a página "Tire Inflation Pressures" da manutenção **não tem
  valores**, só remete para a secção Specifications. Confirmado: no manual da
  Tiger 900 Series os valores estão na **pág. 189**, com as medidas dos pneus ao
  lado. Ir direto para lá; custou-me três leituras a descobrir.
  A Rally vem noutra página: o manual repete a secção Specifications por
  variante — pág. 189 para a 900/GT, pág. 195 para a Rally.
- **BMW** — não publica. Só o autocolante debaixo do assento.

**Como retomar.** Para cada moto: encontrar o manual do proprietario, ler a
tabela de pressoes, corrigir os valores se preciso, e so entao repor
`oem_manual` **com a citacao concreta** (documento, edicao, pagina). Comecar
pelas mais usadas. Nunca subir o rotulo com base num resumo de pesquisa — foi
assim que se chegou aqui.
