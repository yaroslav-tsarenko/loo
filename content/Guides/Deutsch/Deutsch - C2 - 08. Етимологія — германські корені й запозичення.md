---
title: Етимологія — германські корені й запозичення
id: de-c2-etymologie
level: C2
icon: px:history
tags: [deutsch, c2, vocabulary, etymologie, lehnwoerter, wortgeschichte]
prerequisites: ["[[Deutsch - C1 - 24. Словотвір III — фахові складні слова, be-, ent-, er-, -ismus]]"]
estimatedMinutes: 50
---

# Етимологія — германські корені й запозичення

> [!success] Після цієї теми ти зможеш
> - бачити, які німецькі слова — «рідня» українських через спільний індоєвропейський корінь (*Mutter — мати, Bruder — брат, Nacht — ніч, neu — новий, Gast — гість*);
> - розрізняти **Erbwort** (успадковане), **Lehnwort** (запозичене й засвоєне), **Fremdwort** (запозичене, але «чуже» на вигляд) і **Lehnübersetzung** (калька: *Wolkenkratzer* ← *skyscraper*);
> - пояснювати, чому латинське *porta* стало *Pforte*, а *tegula* — *Ziegel* (друге пересування приголосних);
> - упізнавати запозичення з латини, грецької, французької, італійської, їдишу, угорської й словʼянських мов (*Grenze, Quark, Gurke, Peitsche, Kutsche, Roboter*);
> - розуміти «народну етимологію» (*Maulwurf, Sintflut, Hängematte*) і перевіряти походження слова в етимологічному словнику Пфайфера (DWDS).

## Передбач

> [!quiz] Яке з цих німецьких слів, за етимологічним словником Пфайфера, прийшло з **польської**?
> level: C2 · type: single · id: de-c2-etymologie-q01
> - [ ] der Bruder
> - [x] die Grenze
> - [ ] die Nacht
> - [ ] der Gast
>
> **Пояснення:** *Grenze* походить від давньопольського *granica* (пор. укр. «границя») і поширилося в німецькій у XIII–XV століттях; у Біблії Лютера вже вживається лише воно. *Bruder, Nacht, Gast* теж схожі на «брат, ніч, гість», але це не запозичення: ці слова **споріднені** з українськими через спільний індоєвропейський корінь. Схожість буває двох видів — і саме їх ця тема вчить розрізняти.

## Пояснення

### Рідні, позичені й «чужі» слова

| Тип | Що це | Приклад | Як упізнати |
|---|---|---|---|
| **Erbwort** (успадковане) | слово, що є в мові від найдавніших часів | *Mutter, Nacht, drei, Herz* | спільне з англійською, нідерландською, скандинавськими мовами |
| **Lehnwort** (засвоєне запозичення) | позичене так давно, що вже «німецьке» | *Fenster* (лат. *fenestra*), *Ziegel* (лат. *tegula*), *Grenze* (польськ. *granica*) | наголос, рід, правопис — як у німецьких словах |
| **Fremdwort** (чуже слово) | позичене, але зберігає чужий вигляд | *Etage, Niveau, Blamage, Roboter* | незвичний наголос (*Blaˈmage*), незвичні звуки ([ʒ]) |
| **Lehnübersetzung** (калька) | чуже слово, перекладене німецькими частинами | *Wolkenkratzer* ← англ. *skyscraper*; *Mitleid* ← лат. *compassio*; *Gewissen* ← лат. *conscientia* | усі частини німецькі, а модель — чужа |

Межа між *Lehnwort* і *Fremdwort* — плавна. Важливо інше: **етимологія не визначає, чи слово «правильне»**. *Fenster* і *Etage* однаково нормальні; різниця лише в тому, наскільки помітне їхнє походження.

### Спільний корінь: індоєвропейська родина

Німецька й українська — далекі родички: обидві належать до **індоєвропейської** родини (*indogermanisch*), але до різних гілок — германської й словʼянської. Тому найдавніші, найбазовіші слова часто схожі. Пфайфер (DWDS) для слів *Mutter, Bruder, Nacht, neu, Gast* прямо наводить словʼянських родичів.

> [!diagram] Германська й словʼянська гілки: спільний корінь
> ```yaml
> layout: compare
> columns: { ie: "індоєвропейський корінь", de: "німецька (германська)", uk: "українська (словʼянська)" }
> nodes:
>   - { id: i1, col: ie, label: "мати", text: "*māter-", tone: gray }
>   - { id: d1, col: de, label: "Erbwort", text: "die Mutter", note: "англ. mother", tone: red }
>   - { id: u1, col: uk, label: "споріднене", text: "мати", note: "лат. māter", tone: yellow }
>   - { id: i2, col: ie, label: "ніч", text: "*nokt-", tone: gray }
>   - { id: d2, col: de, label: "Erbwort", text: "die Nacht", note: "англ. night", tone: red }
>   - { id: u2, col: uk, label: "споріднене", text: "ніч", note: "лат. nox, noctis", tone: yellow }
>   - { id: i3, col: ie, label: "новий", text: "*neu̯os", tone: gray }
>   - { id: d3, col: de, label: "Erbwort", text: "neu", note: "англ. new", tone: gray }
>   - { id: u3, col: uk, label: "споріднене", text: "новий", note: "лат. novus", tone: yellow }
> steps:
>   - { focus: [i1, d1, u1], note: "Пфайфер зводить Mutter, лат. māter і словʼянське «мати» до одного індоєвропейського кореня. Це не запозичення: слова розвивалися паралельно тисячоліттями." }
>   - { focus: [i2, d2, u2], note: "Nacht — ніч — nox: той самий корінь *nokt-. У германських мовах k перед t перейшло в [x]: Nacht, а в англійській навіть зникло з вимови: night." }
>   - { focus: [i3, d3, u3], note: "neu — новий — novus: у словʼянських і латині корінь має ще -v-. Збіг не випадковий, але й не «позичений»." }
> ```
> Сірий — реконструйований корінь і слова без роду; червоний — німецькі іменники жіночого роду (die); жовтий — українські відповідники. Кожен вузол підписаний. Зірочка (*) — форма, якої немає в текстах, її відтворили лінгвісти.

Ще кілька пар, які Пфайфер прямо називає спорідненими: *Bruder — брат* (лат. *frater*), *Gast — гість* (лат. *hostis* «чужинець»), *drei — три*, *Herz — серце*. А от *Grenze — границя* чи *Gurke — огірок* — уже **запозичення** зі словʼянських мов, про них — у Landeskunde.

### Друге пересування приголосних: чому *Pforte*, а не *Porte*

Близько VI–VIII століття в південних германських говірках, з яких виросла верхньонімецька, змінилися приголосні: **p → pf / f**, **t → z [ts] / s**, **k → ch** (*zweite Lautverschiebung*). Англійська й нідерландська цих змін не мають — тому *Pfund / pound*, *Zeit / tide*, *machen / make*.

Для етимології тут ключове: слова, які германці **позичили з латини до цього зсуву**, пройшли його разом із рідними словами. За Пфайфером, *Kampf* — рання позика з лат. *campus* «поле (битви)» ще до давньоверхньонімецького пересування приголосних.

> [!diagram] Латинське слово до й після пересування приголосних
> ```yaml
> layout: flow
> nodes:
>   - { id: a, label: "латина", text: "porta · tegula · campus", note: "брама · черепиця · поле", tone: gray }
>   - { id: b, label: "рання позика", text: "porta · tegula · kamp", note: "до VI ст., ще без змін", tone: yellow }
>   - { id: c, label: "пересування приголосних", text: "p → pf · t → z", note: "VI–VIII ст.", tone: pink }
>   - { id: d, label: "сучасна німецька", text: "Pforte · Ziegel · Kampf", note: "а в англ.: port · tile · camp", tone: yellow }
> edges:
>   - { from: a, to: b }
>   - { from: b, to: c }
>   - { from: c, to: d }
> steps:
>   - { focus: a, note: "Римляни принесли до германців ремесла, будівництво й військову справу, а з ними — слова: porta, tegula (від tegere «вкривати»), campus." }
>   - { focus: b, note: "Германці позичили ці слова дуже рано, поки ще не було верхньонімецького пересування приголосних." }
>   - { focus: c, note: "Коли p і t у верхньонімецьких говірках перейшли в pf і z [ts], змінилися й ці позички — так само, як рідні слова." }
>   - { focus: d, note: "Звідси Pforte, Ziegel, Kampf. Англійська зсуву не мала, тому зберегла port, tile, camp ближчими до латини." }
> ```
> Сірий — латина, жовтий — етапи слова, рожевий — звукова зміна. Кожен вузол підписаний.

### Хвилі запозичень

| Епоха | Джерело | Сфера | Приклади |
|---|---|---|---|
| римська доба (I–V ст.) | латина | будівництво, сад, торгівля | *Ziegel, Pforte, Speicher, Pfirsich, Kirsche, Essig, Kampf* |
| християнізація (з VI ст.) | грецька через латину | церква | *Engel, Bischof*; *Kirche* — прямо з грецької (IV ст.) |
| середньовіччя | давньофранцузька | лицарство, двір | *Abenteuer* (*aventure*, XII ст.) |
| XV–XVII ст. | італійська | банк, торгівля, пошта | *Bilanz, Konto, Porto* |
| XVII–XIX ст. | французька | побут, мода, етикет | *Etage, Niveau, Blamage* |
| з XVI ст. | їдиш (часто через ротвельш) | розмовна мова | *meschugge, Schlamassel, Ganove, Tacheles, malochen* |
| від середньовіччя | словʼянські, угорська | побут, їжа, торгівля, зброя | *Grenze, Quark, Gurke, Peitsche, Kutsche, Säbel* |
| XX–XXI ст. | англійська | техніка, медіа | *Computer, Meeting* ([[Deutsch - B2 - 11. Іншомовні слова й англіцизми — вимова й рід]]) |

### Народна етимологія

Коли форма слова стає незрозумілою, мовці «підганяють» її під знайомі слова. Це *Volksetymologie*:

- *Maulwurf* — спершу «той, хто кидає купки» (*mū-* «купа» + *werfen*), потім «той, хто кидає землю» (*molta*), а зрештою «той, хто кидає ротом» (*Maul*) — тварина ротом не копає;
- *Sintflut* — від давнього *sin-* «великий, всеосяжний»; з XVI століття поширилося *Sündflut*, бо потоп — кара за гріхи (*Sünde*);
- *Hängematte* — від слова народу таїно на Гаїті, через іспанське *hamaca*; німецька й нідерландська переосмислили його як «матрац, що висить»;
- *Friedhof* — не «двір миру» (*Frieden*), а «огороджене місце» (від давнього *frīten* «оберігати»).

## Приклади

- *Das Wort „Grenze“ **geht auf** das altpolnische „granica“ **zurück**.* — Слово «Grenze» походить від давньопольського «granica».
- *„Fenster“ ist ein altes **Lehnwort** aus dem Lateinischen.* — «Fenster» — давнє запозичення з латини.
- *„Mutter“ und „мати“ sind **urverwandt**.* — «Mutter» і «мати» — споріднені слова.
- *„Wolkenkratzer“ ist eine **Lehnübersetzung** von „skyscraper“.* — «Wolkenkratzer» — калька з «skyscraper».
- *Die Germanen haben „tegula“ **entlehnt**, daraus wurde „**Ziegel**“.* — Германці запозичили «tegula», з нього вийшло «Ziegel».
- *Zum Frühstück gibt es Brötchen mit **Quark**.* — На сніданок — булочки з сиром (кисломолочним).
- *„**Roboter**“ geht auf das tschechische „robota“ zurück.* — «Roboter» сходить до чеського «robota».
- *Mach doch kein **Schlamassel** draus!* — Не роби з цього халепи!
- *Am Bahnhof wartete früher eine **Kutsche**.* — Колись на вокзалі чекала карета.
- *Die Verhandlung war eine einzige **Blamage**.* — Переговори були суцільною ганьбою.
- *Der **Maulwurf** hat den ganzen Rasen umgegraben.* — Кріт перекопав увесь газон.
- *Wir müssen endlich **Tacheles reden**.* — Нам нарешті треба поговорити відверто.

## Слова

### Терміни

> [!word] die Etymologie
> ipa: /etymoloˈɡiː/ · pos: noun · level: C1 · id: de-c2-etymologie-w01
> uk: етимологія; походження слова
> forms: die Etymologien
> example: Die **Etymologie** von „Quark“ führt ins Westslawische. — Етимологія слова «Quark» веде до західнословʼянських мов.
> note: наголос на останньому -gie [ɡiː]. Прикметник etymologisch: ein etymologisches Wörterbuch (Pfeifer, Kluge). y = [y].

> [!word] das Erbwort
> ipa: /ˈɛʁpvɔʁt/ · pos: noun · level: C2 · id: de-c2-etymologie-w02
> uk: успадковане (питоме) слово
> forms: die Erbwörter
> example: „Nacht“ ist ein germanisches **Erbwort**. — «Nacht» — успадковане германське слово.
> note: протилежне — das Lehnwort, das Fremdwort. DWDS допускає й множину Erbworte, частіше Erbwörter. rb = [ʁp] перед w.

> [!word] die Entlehnung
> ipa: /ɛntˈleːnʊŋ/ · pos: noun · level: C2 · id: de-c2-etymologie-w03
> uk: запозичення (процес і слово)
> forms: die Entlehnungen
> example: „Gurke“ ist eine **Entlehnung** aus dem Polnischen. — «Gurke» — запозичення з польської.
> note: -ung → die. Сполучення: Entlehnung aus + Dat. У Пфайфера часто: «ist entlehnt aus …».

> [!word] entlehnen
> ipa: /ɛntˈleːnən/ · pos: verb · level: C2 · id: de-c2-etymologie-w04
> uk: запозичувати (слово з іншої мови)
> forms: entlehnen → entlehnte → hat entlehnt
> example: Das Deutsche hat viele Wörter aus dem Französischen **entlehnt**. — Німецька запозичила багато слів із французької.
> note: невідокремлюване ent-. entlehnen aus + Dat. Звичайне «позичати (гроші, книжку)» — leihen / ausleihen.

> [!word] die Lehnübersetzung
> ipa: /ˈleːnʔyːbɐˌzɛtsʊŋ/ · pos: noun · level: C2 · id: de-c2-etymologie-w05
> uk: калька, перекладне запозичення
> forms: die Lehnübersetzungen
> example: „Mitleid“ ist eine alte **Lehnübersetzung** von lateinisch „compassio“. — «Mitleid» — давня калька з латинського «compassio».
> note: кожна частина чужого слова перекладена німецькою: mit + Leid ← com + passio. Порівняй: das Lehnwort (саме слово позичене).

> [!word] die Volksetymologie
> ipa: /ˈfɔlksʔetymoloˌɡiː/ · pos: noun · level: C2 · id: de-c2-etymologie-w06
> uk: народна етимологія
> forms: die Volksetymologien
> example: „Sündflut“ statt „Sintflut“ ist eine typische **Volksetymologie**. — «Sündflut» замість «Sintflut» — типова народна етимологія.
> note: ʔ на межі Volks|etymologie. Головний наголос — на Volks-. Прикметник volksetymologisch.

> [!word] die Lautverschiebung
> ipa: /ˈlaʊ̯tfɛɐ̯ˌʃiːbʊŋ/ · pos: noun · level: C2 · id: de-c2-etymologie-w07
> uk: пересування приголосних (історична звукова зміна)
> forms: die Lautverschiebungen
> example: Durch die zweite **Lautverschiebung** wurde aus „porta“ „Pforte“. — Через друге пересування приголосних «porta» стало «Pforte».
> note: розрізняють erste (germanische) і zweite (hochdeutsche) Lautverschiebung. Від verschieben — зсувати.

> [!word] urverwandt
> ipa: /ˈuːɐ̯fɛɐ̯vant/ · pos: adj · level: C2 · id: de-c2-etymologie-w08
> uk: споріднений через спільний давній корінь (не запозичений)
> forms: — (не має ступенів порівняння)
> example: „Gast“ und „гість“ sind **urverwandt**. — «Gast» і «гість» — споріднені слова.
> note: ur- — праначало (der Urgroßvater, uralt). Протилежне — entlehnt. Ключове слово в етимологічних словниках.

> [!word] die Wurzel
> ipa: /ˈvʊʁtsl̩/ · pos: noun · level: B2 · id: de-c2-etymologie-w09
> uk: корінь (рослини, слова, проблеми)
> forms: die Wurzeln
> example: „Mutter“, „mater“ und „мати“ haben dieselbe indogermanische **Wurzel**. — «Mutter», «mater» і «мати» мають той самий індоєвропейський корінь.
> note: у лінгвістиці — корінь слова; переносно: die Wurzel des Übels — корінь зла. Дієслово wurzeln (in + Dat). z = [ts].

> [!word] der Gallizismus
> ipa: /ɡaliˈtsɪsmʊs/ · pos: noun · level: C2 · id: de-c2-etymologie-w10
> uk: галіцизм, запозичення з французької
> forms: die Gallizismen
> example: „Etage“ und „Niveau“ sind **Gallizismen**. — «Etage» і «Niveau» — галіцизми.
> note: за зразком der Anglizismus (B2), der Latinismus, der Slawismus. -ismus → der, множина -ismen.

> [!word] indogermanisch
> ipa: /ɪndoɡɛʁˈmaːnɪʃ/ · pos: adj · level: C2 · id: de-c2-etymologie-w11
> uk: індоєвропейський
> forms: — (не має ступенів порівняння)
> example: Deutsch und Ukrainisch gehören zur **indogermanischen** Sprachfamilie. — Німецька й українська належать до індоєвропейської мовної родини.
> note: у німецькій традиції — indogermanisch (скорочено ie., idg.); міжнародно також indoeuropäisch. Наголос на -ma-.

> [!word] zurückgehen auf (+ Akk)
> ipa: /tsuˈʁʏkɡeːən aʊ̯f/ · pos: verb · level: C1 · id: de-c2-etymologie-w12
> uk: походити від, сягати корінням (джерела, слова)
> forms: zurückgehen → ging zurück → ist zurückgegangen
> example: Das Wort „Kutsche“ **geht auf** den Namen eines ungarischen Dorfes **zurück**. — Слово «Kutsche» походить від назви угорського села.
> note: Perfekt із sein. Синоніми: stammen aus + Dat, abstammen von + Dat. Без auf zurückgehen означає «зменшуватися» або «повертатися».

> [!word] das Mittelhochdeutsch
> ipa: /ˈmɪtl̩ˌhoːxdɔʏ̯tʃ/ · pos: noun · level: C2 · id: de-c2-etymologie-w13
> uk: середньоверхньонімецька мова (приблизно 1050–1350)
> forms: — (без множини)
> example: Im **Mittelhochdeutschen** hieß das Wort noch „āventiure“. — Середньоверхньонімецькою це слово ще звучало «āventiure».
> note: скорочено mhd.; до неї — Althochdeutsch (ahd.), після — Frühneuhochdeutsch. Субстантивований варіант: das Mittelhochdeutsche. Межі епох у різних посібниках трохи різняться.

### Латина й грецька: Рим і Церква

> [!word] der Ziegel
> ipa: /ˈtsiːɡl̩/ · pos: noun · level: B2 · id: de-c2-etymologie-w14
> uk: цегла; черепиця
> forms: die Ziegel
> example: Das alte Dach ist mit roten **Ziegeln** gedeckt. — Старий дах вкритий червоною черепицею.
> note: за Pfeifer — з лат. tegula «(дахова) черепиця», від tegere «вкривати»; англ. tile — з того самого джерела. Порівняй: der Ziegelstein, das Ziegeldach.

> [!word] der Pfirsich
> ipa: /ˈpfɪʁzɪç/ · pos: noun · level: B1 · id: de-c2-etymologie-w15
> uk: персик
> forms: die Pfirsiche
> example: Im Sommer essen wir jeden Tag **Pfirsiche**. — Улітку ми щодня їмо персики.
> note: за Pfeifer — з вульгарнолат. persicus «перський (плід)», хоча батьківщина персика — Китай. pf на початку — наслідок пересування приголосних. Кінцеве -ich = [ɪç].

> [!word] die Kirsche
> ipa: /ˈkɪʁʃə/ · pos: noun · level: A2 · id: de-c2-etymologie-w16
> uk: вишня; черешня
> forms: die Kirschen
> example: Die **Kirschen** im Garten sind schon reif. — Черешні в саду вже стиглі.
> note: за Pfeifer — разом із садівництвом від римлян: вульгарнолат. ceresia, а воно з грецької. Німецька розрізняє Süßkirsche (черешня) і Sauerkirsche (вишня).

> [!word] der Essig
> ipa: /ˈɛsɪç/ · pos: noun · level: B1 · id: de-c2-etymologie-w17
> uk: оцет
> forms: die Essige
> example: Für den Salat brauche ich Öl und **Essig**. — Для салату мені потрібні олія й оцет.
> note: за Pfeifer — з лат. acētum «кисле вино, оцет». Множина — лише про сорти. Стійко: Damit ist es Essig (ugs.) — з цього нічого не вийде.

> [!word] der Speicher
> ipa: /ˈʃpaɪ̯çɐ/ · pos: noun · level: B2 · id: de-c2-etymologie-w18
> uk: комора, склад; горище (регіон.); памʼять (компʼютера)
> forms: die Speicher
> example: Der **Speicher** meines Handys ist voll. — Памʼять мого телефона заповнена.
> note: за Pfeifer — з пізньолат. spīcārium «комора для зерна» (spīca — колос). Від «зерносховища» до «памʼяті компʼютера». Дієслово speichern.

> [!word] die Pforte
> ipa: /ˈpfɔʁtə/ · pos: noun · level: C1 · id: de-c2-etymologie-w19
> uk: хвіртка, брама, (вхідні) ворота
> forms: die Pforten
> example: Die Klinik hat ihre **Pforte** nachts geschlossen. — Ночами вхід до клініки зачинений.
> note: за Pfeifer — рання позика з лат. porta. Книжне або офіційне; у лікарні й монастирі die Pforte — пост вахтера (der Pförtner). Англ. port — з тієї ж латини.

> [!word] die Tinte
> ipa: /ˈtɪntə/ · pos: noun · level: B1 · id: de-c2-etymologie-w20
> uk: чорнило
> forms: die Tinten
> example: Den Vertrag hat er mit blauer **Tinte** unterschrieben. — Договір він підписав синім чорнилом.
> note: за Pfeifer — із середньолат. tincta «барвна рідина», від tingere «фарбувати». Стійко: in der Tinte sitzen (ugs.) — бути в халепі.

> [!word] der Kampf
> ipa: /kampf/ · pos: noun · level: B1 · id: de-c2-etymologie-w21
> uk: боротьба, бій
> forms: die Kämpfe
> example: Der **Kampf** gegen den Klimawandel braucht Zeit. — Боротьба зі зміною клімату потребує часу.
> note: за Pfeifer — дуже рання позика з лат. campus «поле (битви)», ще до пересування приголосних: тому -mpf. Англ. camp — з того самого джерела. Дієслово kämpfen.

> [!word] der Engel
> ipa: /ˈɛŋl̩/ · pos: noun · level: B1 · id: de-c2-etymologie-w22
> uk: ангел
> forms: die Engel
> example: Du bist ein **Engel**, danke für deine Hilfe! — Ти просто ангел, дякую за допомогу!
> note: за Pfeifer — через лат. angelus із грецьк. ángelos «вісник». ng — один носовий [ŋ], без [ɡ]. Однаково в усіх германських мовах: engl. angel.

> [!word] der Bischof
> ipa: /ˈbɪʃɔf/ · pos: noun · level: B2 · id: de-c2-etymologie-w23
> uk: єпископ
> forms: die Bischöfe
> example: Der **Bischof** hat die Kirche neu geweiht. — Єпископ знову освятив церкву.
> note: за Pfeifer — із грецьк. epískopos «наглядач» через церковну латину. Від epi- лишилося лише b-, від -skopos — -schof. Прикметник bischöflich.

### Романські мови: Франція й Італія

> [!word] das Abenteuer
> ipa: /ˈaːbn̩tɔʏ̯ɐ/ · pos: noun · level: B1 · id: de-c2-etymologie-w24
> uk: пригода
> forms: die Abenteuer
> example: Die Reise mit dem Zug durch Kanada war ein echtes **Abenteuer**. — Подорож потягом через Канаду була справжньою пригодою.
> note: за Pfeifer — наприкінці XII ст. з давньофр. aventure (мхд. āventiure); із «Abend» не повʼязане, хоч так і здається. Наголос на A-.

> [!word] die Blamage
> ipa: /blaˈmaːʒə/ · pos: noun · level: C1 · id: de-c2-etymologie-w25
> uk: ганьба, конфуз, сором
> forms: die Blamagen
> example: Das 0:5 war eine **Blamage** für die ganze Mannschaft. — 0:5 — ганьба для всієї команди.
> note: за Pfeifer — «французоподібне» утворення німецької студентської мови XVIII ст. від blamieren; у французькій такого слова немає. g = [ʒ], як ж. Дієслово sich blamieren — осоромитися.

> [!word] die Bilanz
> ipa: /biˈlants/ · pos: noun · level: C1 · id: de-c2-etymologie-w26
> uk: баланс (бухгалтерський); підсумок
> forms: die Bilanzen
> example: Nach einem Jahr zieht die Regierung **Bilanz**. — Через рік уряд підбиває підсумки.
> note: за Pfeifer — з італ. bilancio (від пізньолат. bilanx «терези з двома шальками»), у німецькій з XVI ст. Bilanz ziehen — підбити підсумки (C1). z = [ts].

> [!word] das Porto
> ipa: /ˈpɔʁto/ · pos: noun · level: B2 · id: de-c2-etymologie-w27
> uk: поштовий збір, вартість пересилання
> forms: die Portos / die Porti
> example: Das **Porto** für einen Brief ins Ausland ist gestiegen. — Вартість пересилання листа за кордон зросла.
> note: за Pfeifer — у XVII ст. з італ. porto «перенесення», від portare «нести». Тому portofrei — без оплати пересилання.

### Їдиш і гебрайська

> [!word] meschugge
> ipa: /meˈʃʊɡə/ · pos: adj · level: C2 · id: de-c2-etymologie-w28
> uk: (розм.) божевільний, схиблений
> forms: — (зазвичай лише предикативно)
> example: Bei dem Lärm wird man ja **meschugge**! — Від такого шуму можна збожеволіти!
> note: ugs. За Pfeifer — у XIX ст. з їдишу meschuggo, гебр. mešugga‘. Наголос на -schug-. Синоніми: verrückt, irre (ugs.).

> [!word] der Schlamassel
> ipa: /ʃlaˈmasl̩/ · pos: noun · level: C2 · id: de-c2-etymologie-w29
> uk: (розм.) халепа, біда, безлад
> forms: — (без множини)
> example: Jetzt haben wir den **Schlamassel**! — Ось тепер ми в халепі!
> note: ugs.; рід — der, рідше das. За Pfeifer, ймовірно, з їдишу schlimasl «те, що не є щастям» (masol — щаслива зірка); або перша частина від schlimm. Звідси й vermasseln — зіпсувати.

> [!word] der Ganove
> ipa: /ɡaˈnoːvə/ · pos: noun · level: C2 · id: de-c2-etymologie-w30
> uk: шахрай, злодюжка, аферист
> forms: die Ganoven
> example: Die **Ganoven** haben falsche Handwerker gespielt. — Шахраї видавали себе за майстрів.
> note: ugs., n-відміна: den Ganoven. За Pfeifer — гебр. gannāv «злодій», множина в їдиші ganoven; з неї «відтворили» однину Ganove, ніби це німецька множина на -n.

> [!word] Tacheles reden
> ipa: /ˈtaxələs ˈʁeːdn̩/ · pos: phrase · level: C2 · id: de-c2-etymologie-w31
> uk: говорити відверто, без манівців
> example: Mit dem Vermieter muss ich jetzt **Tacheles reden**. — З орендодавцем мені тепер треба поговорити відверто.
> note: ugs. За Pfeifer — з їдишу tachles «мета, суть» (гебр. tak̠līt̠); у пресу вираз потрапив близько 1970 р. Tacheles без роду: вживається лише в цьому звороті.

> [!word] malochen
> ipa: /maˈloːxn̩/ · pos: verb · level: C2 · id: de-c2-etymologie-w32
> uk: (розм.) тяжко працювати, гарувати
> forms: malochen → malochte → hat malocht
> example: Mein Opa hat vierzig Jahre im Bergwerk **malocht**. — Мій дідусь сорок років гарував у шахті.
> note: salopp, особливо в Рурі. За Pfeifer — через ротвельш з їдишу melōche «праця». Іменник die Maloche. Наголос на -lo-, ch = [x].

> [!word] koscher
> ipa: /ˈkoːʃɐ/ · pos: adj · level: C1 · id: de-c2-etymologie-w33
> uk: кошерний; (розм.) чесний, без підступу
> forms: — (не має ступенів порівняння)
> example: Das Angebot ist mir nicht ganz **koscher**. — Ця пропозиція здається мені якоюсь підозрілою.
> note: за Pfeifer — з їдишу, гебр. kāšēr «чистий»; переносне значення «чесний» поширила студентська мова. Переносне — переважно із запереченням: nicht (ganz) koscher.

### Словʼянські мови, угорська, турецька

> [!word] der Quark
> ipa: /kvaʁk/ · pos: noun · level: A2 · id: de-c2-etymologie-w34
> uk: кисломолочний сир; (розм.) дурниця
> forms: — (зазвичай без множини)
> example: Red keinen **Quark**! — Не мели дурниць!
> note: за Pfeifer — із західнословʼянських мов (пор. польськ. twaróg, чеськ. tvaroh), з переходом tw- у qu-. Значення «дурниця» — з XVI ст. AT: der Topfen.

> [!word] die Peitsche
> ipa: /ˈpaɪ̯tʃə/ · pos: noun · level: C1 · id: de-c2-etymologie-w35
> uk: батіг, нагай
> forms: die Peitschen
> example: Zuckerbrot und **Peitsche** — so führt er sein Team. — Пряник і батіг — так він керує командою.
> note: за Pfeifer — з давньолужицької або давньочеської (bič), від словʼянського «бити». Zuckerbrot und Peitsche — «метод батога й пряника».

> [!word] das Petschaft
> ipa: /ˈpɛtʃaft/ · pos: noun · level: C2 · id: de-c2-etymologie-w36
> uk: печатка (ручний штамп для сургучу)
> forms: die Petschafte
> example: Der Brief war mit einem alten **Petschaft** versiegelt. — Лист був запечатаний старовинною печаткою.
> note: за Pfeifer, ймовірно, із давньословенської або давньочеської pečat «печатка»; -schaft лише нагадує німецький суфікс (народна етимологія). Слово рідкісне, музейне.

> [!word] die Jauche
> ipa: /ˈjaʊ̯xə/ · pos: noun · level: C2 · id: de-c2-etymologie-w37
> uk: гноївка; (розм.) помиї, бурда
> forms: die Jauchen
> example: Auf dem Land riecht es im Frühling nach **Jauche**. — У селі навесні пахне гноївкою.
> note: за Pfeifer — з давньолужицької чи давньополабської *jucha, від праслов. *jucha «густа юшка, бульйон». Від «бульйону» до «гноївки» — показове зниження значення.

> [!word] der Dolmetscher
> ipa: /ˈdɔlmɛtʃɐ/ · pos: noun · level: B2 · id: de-c2-etymologie-w38
> uk: усний перекладач
> forms: die Dolmetscher
> example: Beim Arzt hat ein **Dolmetscher** für uns übersetzt. — У лікаря нам перекладав перекладач.
> note: за Pfeifer — з тюркського dilmaç «посередник» через словʼянські мови (пор. укр. застар. «товмач»). Жіноча форма: die Dolmetscherin. Письмовий перекладач — der Übersetzer.

> [!word] der Zobel
> ipa: /ˈtsoːbl̩/ · pos: noun · level: C2 · id: de-c2-etymologie-w39
> uk: соболь; соболине хутро
> forms: die Zobel
> example: Im Museum hängt ein Mantel aus **Zobel**. — У музеї висить шуба із соболя.
> note: за Pfeifer — через хутряну торгівлю з давньоруської (рос. соболь); s- передано як z- [ts]. Хутряна торгівля — з каролінзьких часів; слово засвідчене з XI ст.

> [!word] der Kren
> ipa: /kʁeːn/ · pos: noun · level: C2 · id: de-c2-etymologie-w40
> uk: хрін
> forms: — (без множини)
> example: Zum Tafelspitz gehört frisch geriebener **Kren**. — До тафельшпіцу подають свіжотертий хрін.
> note: AT, Баварія; у Німеччині загалом — der Meerrettich. За Pfeifer — із західно- чи південнословʼянського *chrěnъ (польськ. chrzan, чеськ. křen) — родич укр. «хрін». Довге [eː].

> [!word] die Graupe
> ipa: /ˈɡʁaʊ̯pə/ · pos: noun · level: C2 · id: de-c2-etymologie-w41
> uk: перлова крупа (зерно)
> forms: die Graupen
> example: Oma kocht im Winter Suppe mit **Graupen**. — Бабуся взимку варить суп із перловкою.
> note: за Pfeifer, ймовірно, з лужицької чи польської krupa — родич укр. «крупа». Зазвичай у множині. Die Graupel — дрібний град.

> [!word] die Steppe
> ipa: /ˈʃtɛpə/ · pos: noun · level: B2 · id: de-c2-etymologie-w42
> uk: степ
> forms: die Steppen
> example: Die ukrainische **Steppe** ist im Juni voller Blumen. — Український степ у червні повен квітів.
> note: за Pfeifer — у середині XVIII ст. з рос. степь; спершу лише про степи Східної Європи, потім про будь-які. Рід — die, на відміну від укр. «степ» (ч. р.).

> [!word] die Pistole
> ipa: /pɪsˈtoːlə/ · pos: noun · level: B2 · id: de-c2-etymologie-w43
> uk: пістолет
> forms: die Pistolen
> example: Die Polizei fand eine **Pistole** im Auto. — Поліція знайшла в машині пістолет.
> note: за Pfeifer — під час гуситських війн (поч. XV ст.) з давньочеської píšťala «сопілка, трубка», через звук пострілу; сучасна форма повернулася в німецьку з французької наприкінці XVI ст. jemandem die Pistole auf die Brust setzen — приставити ніж до горла.

> [!word] der Roboter
> ipa: /ˈʁɔbɔtɐ/ · pos: noun · level: B1 · id: de-c2-etymologie-w44
> uk: робот
> forms: die Roboter
> example: In der Fabrik arbeiten heute mehr **Roboter** als Menschen. — На фабриці сьогодні працює більше роботів, ніж людей.
> note: за Pfeifer — від чеського robot у пʼєсі Карела Чапека «R. U. R.» (1920), утвореного від robota «тяжка праця, панщина»; німецьку форму з -er дав перекладач О. Пік (1922). Duden допускає й наголос на -bo-.

> [!word] die Kutsche
> ipa: /ˈkʊtʃə/ · pos: noun · level: B2 · id: de-c2-etymologie-w45
> uk: карета, екіпаж
> forms: die Kutschen
> example: Das Brautpaar fuhr mit einer **Kutsche** zur Kirche. — Молодята їхали до церкви в кареті.
> note: за Pfeifer — з угорського kocsi (szekér) «віз із Коча»: село Kocs між Віднем і Будою було станцією зміни коней. Дієслово kutschieren (ugs.: возити).

> [!word] der Säbel
> ipa: /ˈzɛːbl̩/ · pos: noun · level: C1 · id: de-c2-etymologie-w46
> uk: шабля
> forms: die Säbel
> example: Im Museum sind alte **Säbel** ausgestellt. — У музеї виставлено старі шаблі.
> note: за Pfeifer, мабуть, через польськ. szabla з угорського szablya. Стійко: mit dem Säbel rasseln — брязкати зброєю (погрожувати війною).

### Народна етимологія

> [!word] die Hängematte
> ipa: /ˈhɛŋəˌmatə/ · pos: noun · level: B2 · id: de-c2-etymologie-w47
> uk: гамак
> forms: die Hängematten
> example: Im Urlaub liege ich am liebsten in der **Hängematte**. — У відпустці я найбільше люблю лежати в гамаку.
> note: за Pfeifer — від слова народу таїно (Гаїті) через ісп. hamaca; у XVII ст. переосмислено як «hängen + Matte» (1627: Hengmatten). Нідерландське hangmat — та сама історія.

> [!word] der Maulwurf
> ipa: /ˈmaʊ̯lvʊʁf/ · pos: noun · level: B2 · id: de-c2-etymologie-w48
> uk: кріт
> forms: die Maulwürfe
> example: Im Garten sind überall Hügel vom **Maulwurf**. — У саду всюди кротовини.
> note: за Pfeifer — спершу «той, хто кидає купки», потім «землекидач», а зрештою переосмислено через Maul «рот». Переносно — шпигун усередині організації.

> [!word] der Friedhof
> ipa: /ˈfʁiːthoːf/ · pos: noun · level: A2 · id: de-c2-etymologie-w49
> uk: цвинтар, кладовище
> forms: die Friedhöfe
> example: Sonntags gehen wir auf den **Friedhof** zu den Großeltern. — У неділю ми ходимо на цвинтар до дідуся й бабусі.
> note: за Pfeifer — ahd. frīthof «огороджене, захищене місце» (від frīten «оберігати»), а не від Frieden «мир»; спершу — подвірʼя довкола церкви. Сьогодні звʼязок із «Frieden» відчувають майже всі — це теж народна етимологія.

> [!word] die Sintflut
> ipa: /ˈzɪntfluːt/ · pos: noun · level: C1 · id: de-c2-etymologie-w50
> uk: усесвітній потоп
> forms: — (без множини)
> example: Nach mir die **Sintflut**! — Після мене хоч потоп!
> note: за Pfeifer — давнє sin- «всеосяжний, великий»; з XVI ст. поширилося Sündflut (від Sünde, гріх), і лише в XIX ст. мовознавці повернули Sintflut. Прикметник vorsintflutlich — допотопний.

## Слухаємо

> [!listen] Що ти почув?
> level: C2 · type: choice · id: de-c2-etymologie-l01
> audio: Das Wort geht auf das Lateinische zurück.
> - [x] Das Wort geht auf das Lateinische zurück.
> - [ ] Das Wort geht auf das Lateinische vorbei.
> - [ ] Das Wort geht aus dem Lateinischen zurück.
>
> **Пояснення:** сталий зворот — *zurückgehen **auf** + Akk*: *auf das Lateinische*. *Vorbeigehen* — проходити повз. Із *aus* + Dat уживають інше дієслово: *stammt aus dem Lateinischen*.

> [!listen] Що пояснює лекторка?
> level: C2 · type: answer · id: de-c2-etymologie-l02
> audio: Der Name „Kutsche“ kommt aus dem Ungarischen. Das Dorf Kocs lag an der Strecke zwischen Wien und Buda, dort wechselte man die Pferde.
> - [x] Слово «Kutsche» походить від угорського села, де міняли коней.
> - [ ] Карету винайшли у Відні.
> - [ ] Слово «Kutsche» прийшло з латини.
> - [ ] У селі Коч виготовляли коней для Відня.
>
> **Пояснення:** *aus dem Ungarischen* — з угорської; село *Kocs* було станцією зміни коней (*dort wechselte man die Pferde*). Про винахід у Відні чи «виготовлення коней» мова не йде.

> [!listen] Напиши, що почув
> level: C2 · type: dictation · id: de-c2-etymologie-l03
> audio: Die Wörter Mutter und Nacht sind germanische Erbwörter.

## Вимова

> [!speak] Скажи вголос
> level: C2 · id: de-c2-etymologie-s01
> text: Die Etymologie dieses Wortes ist umstritten.
> ipa: /diː etymoloˈɡiː ˈdiːzəs ˈvɔʁtəs ɪst ʊmˈʃtʁɪtn̩/
> tip: Etymologie — наголос лише на останньому -gie, y = [y]; umstritten — наголос на -strit-, у кінці складотворче [n̩].
> uk: Етимологія цього слова спірна.

> [!speak] Скажи вголос
> level: C2 · id: de-c2-etymologie-s02
> text: Aus „porta“ wurde „Pforte“, aus „tegula“ wurde „Ziegel“.
> ipa: /aʊ̯s ˈpɔʁta ˈvʊʁdə ˈpfɔʁtə aʊ̯s ˈteːɡula ˈvʊʁdə ˈtsiːɡl̩/
> tip: Pforte — pf одним звуком, губи разом і відразу f; Ziegel — z = [ts], довге [iː]. Почуй різницю: p → pf, t → ts.
> uk: З «porta» вийшло «Pforte», з «tegula» — «Ziegel».

> [!speak] Скажи вголос
> level: C2 · id: de-c2-etymologie-s03
> text: Wir müssen endlich Tacheles reden.
> ipa: /viːɐ̯ ˈmʏsn̩ ˈɛntlɪç ˈtaxələs ˈʁeːdn̩/
> tip: Tacheles — ch після a — глибоке [x], наголос на Ta-; endlich — ch після i — мʼяке [ç]; reden — довге [eː].
> uk: Нам нарешті треба поговорити відверто.

## Типові помилки українців

> [!pitfall] Схожість — ще не запозичення
> *Mutter — мати, Nacht — ніч, Gast — гість* схожі не тому, що німці «позичили» ці слова в словʼян, а через спільний індоєвропейський корінь (*urverwandt*). Навпаки, *Grenze — границя, Gurke — огірок, Quark — польськ. twaróg* — справжні **запозичення** зі словʼянських мов. ~~„Mutter“ ist aus dem Slawischen entlehnt~~ → *„Mutter“ und „мати“ sind urverwandt.* Перевіряй у Пфайфера, що саме написано: *verwandt mit* чи *entlehnt aus*.

> [!pitfall] Народна етимологія як «факт»
> ~~Der Friedhof heißt so, weil die Toten dort Frieden finden~~ — красиво, але неправильно: Пфайфер виводить слово від *frīten* «оберігати» (огороджене місце). ~~Das Abenteuer hat mit dem Abend zu tun~~ — ні, з давньофр. *aventure*. ~~Der Maulwurf gräbt mit dem Maul~~ — ні. Вигадані пояснення популярні в інтернеті; на C2 перевіряй етимологію лише в словнику (DWDS — Pfeifer, Kluge).

> [!pitfall] «Французьке» слово, якого немає у Франції
> *Die Blamage* звучить по-французьки, але, за Пфайфером, це утворення німецької студентської мови XVIII століття; французькою «ганьба» — *la honte*. Так само *das Handy* — не англійське слово ([[Deutsch - C2 - 18. Хибні друзі й кальки — пастки для українців]]). Не перекладай «назад» у мову, з якої слово нібито прийшло.

> [!pitfall] Рід — не з українського відповідника
> Рід не переходить автоматично ні з української, ні з мови-джерела. Не міркуй за українським словом: *die Steppe* (укр. «степ» — ч. р.), *die Grenze* (укр. «кордон» — ч. р.), *der Quark* (укр. «сир» — ч. р.). Не завжди збігається й рід у мові-джерелі: *die Etage* (фр. *l'étage* — ч. р.), *das Niveau* (фр. *le niveau* — ч. р.), *das Porto* (італ. *il porto* — ч. р.). Етимологія допомагає запамʼятати значення, але **рід вчи разом зі словом**.

## Landeskunde: Grenze, Gurke, Quark — slawische Wörter im Deutschen

> [!example] Wie slawische Wörter ins Deutsche kamen
> Wer an Lehnwörter im Deutschen denkt, denkt meist an Latein, Französisch oder Englisch. Weniger bekannt ist, dass auch die slawischen Sprachen ihre Spuren hinterlassen haben. Das liegt an der Geschichte: Über viele Jahrhunderte lebten Deutsche und Slawen als Nachbarn, an der Elbe, in Böhmen, in Schlesien und an der Ostsee. Man handelte miteinander, heiratete und siedelte in denselben Dörfern.
>
> Das bekannteste Beispiel ist das Wort „Grenze“. Nach dem etymologischen Wörterbuch von Wolfgang Pfeifer stammt es aus dem Altpolnischen „granica“, also aus demselben Wortstamm wie das ukrainische „границя“. Im 12. und 13. Jahrhundert erscheint es zuerst in lateinischen Urkunden aus dem deutsch-polnischen Grenzgebiet. Martin Luther benutzte in seiner Bibel bereits ausschließlich „Grenze“, und um 1700 war das Wort im ganzen Sprachgebiet verbreitet. Ältere deutsche Wörter wie „Mark“ oder „Gemerk“ wurden verdrängt oder bekamen eine andere Bedeutung.
>
> Viele slawische Lehnwörter kommen aus dem Alltag auf dem Land und aus der Küche. „Quark“ geht auf ein westslawisches Wort zurück, das im Polnischen „twaróg“ heißt. „Gurke“ ist zuerst um 1500 belegt und stammt sicher aus dem altpolnischen „ogurek“; auch „Graupe“ und „Jauche“ kamen aus dem Sorbischen oder einer benachbarten slawischen Sprache. In Österreich und Bayern sagt man zum Meerrettich bis heute „Kren“, ein Wort, das mit dem ukrainischen „хрін“ verwandt ist. Für Ukrainer ist das eine kleine Überraschung beim Einkaufen auf einem Wiener Markt.
>
> Auch Handel und Krieg brachten Wörter. Der „Zobel“, ein wertvoller Pelz, kam über den Pelzhandel mit den Ostslawen ins Deutsche. Die „Pistole“ stammt nach Pfeifer aus den Hussitenkriegen im frühen 15. Jahrhundert: Das tschechische „píšťala“ bedeutete ursprünglich „Pfeife“, wohl wegen des hellen Knalls. Über das Französische wanderte das Wort dann in viele europäische Sprachen und kam am Ende des 16. Jahrhunderts als „pistole“ auch ins Deutsche zurück. Die „Steppe“ kam erst Mitte des 18. Jahrhunderts aus dem Russischen und meinte zuerst nur die weiten Ebenen Osteuropas.
>
> Ein besonders junges Beispiel ist der „Roboter“. Der tschechische Schriftsteller Karel Čapek nannte 1920 in seinem Drama „R. U. R.“ künstliche Menschen „roboti“. Das Wort ist eine Bildung zu „robota“, harte Arbeit oder Frondienst, und ist nach Pfeifer sogar mit dem deutschen Wort „Arbeit“ verwandt. Der Übersetzer Otto Pick machte daraus 1922 im Deutschen den „Roboter“.
>
> Manche dieser Wörter haben im Deutschen eine eigene Geschichte erlebt. „Quark“ bedeutet seit dem 16. Jahrhundert umgangssprachlich auch „Unsinn“: Wer „Red keinen Quark!“ sagt, denkt nicht an Milchprodukte. Die „Peitsche“ kommt nach Pfeifer aus dem Sorbischen oder Tschechischen und gehört zu einem slawischen Verb für „schlagen“; heute kennt man sie vor allem aus der Redewendung „Zuckerbrot und Peitsche“. Und die „Jauche“ bezeichnete ursprünglich eine Fleischbrühe, bevor das Wort im Deutschen die Bedeutung „flüssiger Dünger“ annahm. Solche Bedeutungswege zeigen, dass ein Lehnwort, sobald es angekommen ist, ganz den Regeln und Launen seiner neuen Sprache folgt.
>
> Nicht immer kamen die Wörter direkt. Die „Kutsche“ ist nach einem ungarischen Dorf benannt, und der „Dolmetscher“ geht auf ein türkisches Wort zurück, das über slawische Sprachen ins Deutsche gelangte. Solche Wege zeigen: Die Wörter einer Sprache erzählen die Geschichte ihrer Nachbarschaften.

> [!quiz] Nach dem Text: Warum gibt es slawische Lehnwörter im Deutschen?
> level: C2 · type: single · id: de-c2-etymologie-q02
> - [ ] Weil Luther sie bewusst aus dem Polnischen übernommen hat.
> - [x] Weil Deutsche und Slawen über Jahrhunderte als Nachbarn lebten, handelten und siedelten.
> - [ ] Weil sie erst im 20. Jahrhundert durch das Fernsehen kamen.
> - [ ] Weil alle slawischen Wörter aus dem Lateinischen stammen.
>
> **Пояснення:** у тексті: *Über viele Jahrhunderte lebten Deutsche und Slawen als Nachbarn … Man handelte miteinander, heiratete und siedelte*. Лютер лише вже вживав *Grenze*, а не «позичив» його. Більшість прикладів — середньовічні, а не з XX століття.

> [!quiz] Was stimmt laut Text? Wähle alle richtigen Aussagen.
> level: C2 · type: multi · id: de-c2-etymologie-q03
> - [x] „Kren“ ist mit dem ukrainischen „хрін“ verwandt.
> - [x] „Pistole“ bedeutete im Tschechischen ursprünglich „Pfeife“.
> - [ ] „Steppe“ kam schon im Mittelalter aus dem Polnischen.
> - [ ] „Roboter“ ist ein altes deutsches Erbwort.
>
> **Пояснення:** про *Kren* і *Pistole* сказано прямо. *Steppe* прийшло *erst Mitte des 18. Jahrhunderts aus dem Russischen*. *Roboter* — від чеського *robota* через Чапека (1920) і перекладача Піка (1922), тобто молоде запозичення.

> [!quiz] Nach dem Text: Was passierte mit älteren Wörtern wie „Mark“, als „Grenze“ sich durchsetzte?
> level: C2 · type: single · id: de-c2-etymologie-q04
> - [ ] Sie wurden zu slawischen Wörtern.
> - [x] Sie wurden verdrängt oder bekamen eine andere Bedeutung.
> - [ ] Sie bedeuten heute dasselbe wie „Grenze“.
> - [ ] Sie wurden in die Lutherbibel aufgenommen.
>
> **Пояснення:** *Ältere deutsche Wörter wie „Mark“ oder „Gemerk“ wurden verdrängt oder bekamen eine andere Bedeutung* — *Mark* сьогодні живе переважно в назвах колишніх прикордонних земель (*Mark Brandenburg*). У Біблії Лютера вже було *Grenze*.

## Практика

> [!quiz] Яка пара — **споріднені** слова (urverwandt), а не запозичення?
> level: C2 · type: single · id: de-c2-etymologie-q05
> - [x] die Nacht — ніч
> - [ ] die Gurke — огірок
> - [ ] die Grenze — границя
> - [ ] der Quark — польськ. twaróg
>
> **Пояснення:** *Nacht* і «ніч» сходять до спільного індоєвропейського *nokt-* (Пфайфер наводить і лат. *nox*). *Gurke, Grenze, Quark* німецька запозичила зі словʼянських мов у середньовіччі.

> [!quiz] Яке слово — **Lehnübersetzung** (калька), а не Lehnwort?
> level: C2 · type: single · id: de-c2-etymologie-q06
> - [ ] das Fenster
> - [x] der Wolkenkratzer
> - [ ] die Etage
> - [ ] die Tinte
>
> **Пояснення:** *Wolkenkratzer* — переклад частинами англ. *skyscraper* (Wolke + kratzen). *Fenster* і *Tinte* — позичені з латини цілими словами, *Etage* — з французької. Калька складається з питомих німецьких частин.

> [!quiz] Які слова прийшли з їдишу (часто через ротвельш)? Обери всі.
> level: C2 · type: multi · id: de-c2-etymologie-q07
> - [x] meschugge
> - [x] der Ganove
> - [ ] der Säbel
> - [x] malochen
> - [ ] das Porto
>
> **Пояснення:** *meschugge, Ganove, malochen* за Пфайфером мають гебрайське коріння через їдиш. *Säbel* — угорське слово через польську, *Porto* — італійське.

> [!quiz] Заповни: звідки слово?
> level: C2 · type: fill · id: de-c2-etymologie-q08 · bank: Englischen, Russischen, Französischen
>
> ```text fill
> „Kutsche“ kommt aus dem [[Ungarischen]].
> „Roboter“ geht auf das [[Tschechische]] zurück.
> „Bilanz“ kam im 16. Jahrhundert aus dem [[Italienischen]].
> ```
>
> **Пояснення:** *Kutsche* — від угорського *kocsi*; *Roboter* — від чеського *robota* (Чапек); *Bilanz* — від італ. *bilancio*. Дистрактори правдоподібні: *Bilanz* має латинське коріння (*bilanx*), але в німецьку прийшло саме з італійської, не з англійської чи французької; «робот» багато хто вважає англійським чи російським словом.

> [!quiz] Заповни прийменник
> level: C2 · type: fill · id: de-c2-etymologie-q09 · bank: von, nach, über
>
> ```text fill
> Das Wort geht [[auf]] das Lateinische zurück.
> „Gurke“ ist eine Entlehnung [[aus]] dem Polnischen.
> „Gast“ ist verwandt [[mit]] „гість“.
> ```
>
> **Пояснення:** *zurückgehen **auf** + Akk*, *Entlehnung **aus** + Dat*, *verwandt **mit** + Dat*. *Von* і *über* — часті кальки з українського «походить від», «прийшло через»: *über* можливе лише про проміжну мову (*über das Polnische*), а не про джерело.

> [!quiz] Склади речення: «Слово "Grenze" походить від польського "granica".»
> level: C2 · type: order · id: de-c2-etymologie-q10
>
> ```text order
> Das Wort „Grenze“
> geht
> auf das polnische „granica“
> zurück.
> von ✗
> ```
>
> **Пояснення:** *zurückgehen auf + Akk*: відокремлюваний префікс *zurück* іде в кінець, прийменник — *auf*. ~~von dem polnischen „granica“ zurück~~ — калька з «походить від». Порядок з початком *Auf das polnische „granica“ geht …* теж можливий (виділення), але тут тренуємо нейтральний.

> [!quiz] Склади речення: «Німецька запозичила слово з латини.»
> level: C2 · type: order · id: de-c2-etymologie-q11
>
> ```text order
> Das Deutsche
> hat
> das Wort aus dem Lateinischen
> entlehnt.
> geentlehnt ✗
> ```
>
> **Пояснення:** *entlehnen* має невідокремлюваний префікс *ent-*, тому Partizip II без *ge-*: *hat entlehnt*. ~~geentlehnt~~ — типова помилка, як ~~geverstanden~~.

> [!quiz] Чому німецька має *Pforte* і *Ziegel*, а англійська — *port* і *tile*?
> level: C2 · type: single · id: de-c2-etymologie-q12
> - [x] Слова позичили з латини дуже рано, і вони пройшли друге пересування приголосних, якого не було в англійській.
> - [ ] Німці навмисне змінили латинські слова, щоб вони звучали по-німецьки.
> - [ ] Англійська позичила ці слова з німецької й спростила.
> - [ ] Це випадковий збіг.
>
> **Пояснення:** у верхньонімецьких говірках *p* перейшло в *pf*, а *t* — у *z* [ts]. Ранні латинські позички змінилися разом із рідними словами (Пфайфер: *Kampf* — позика «до давньоверхньонімецького пересування приголосних»). Англійська цієї зміни не знала, тому її форми ближчі до латини.

> [!quiz] Яке пояснення — **народна етимологія**?
> level: C2 · type: single · id: de-c2-etymologie-q13
> - [x] „Sündflut“ — weil die Flut eine Strafe für die Sünden war.
> - [ ] „Ziegel“ — aus lateinisch „tegula“.
> - [ ] „Roboter“ — aus tschechisch „robota“.
> - [ ] „Kampf“ — aus lateinisch „campus“.
>
> **Пояснення:** *Sintflut* походить від давнього *sin-* «всеосяжний»; повʼязання з *Sünde* — пізніше переосмислення, тобто народна етимологія (з XVI ст. *Sündflut*). Решта — наукові етимології за Пфайфером.

> [!quiz] Знайди пару «слово — справжнє джерело»
> level: C2 · type: single · id: de-c2-etymologie-q14
> - [x] der Friedhof — frīten «оберігати»
> - [ ] das Abenteuer — der Abend
> - [ ] der Maulwurf — das Maul (від початку)
> - [ ] die Blamage — франц. «blamage»
>
> **Пояснення:** *Friedhof* — від *frīten*, «огороджене місце». *Abenteuer* — з давньофр. *aventure*, не від *Abend*. У *Maulwurf* «Maul» — пізнє переосмислення. *Blamage* — німецьке «французоподібне» утворення: у французькій такого слова немає.

## Фішки

> [!reel] Шахрай із «зайвою» однини
> *Der Ganove* виник через непорозуміння. Гебрайське *gannāv* «злодій» мало в їдиші множину *ganoven*. Німецькі мовці почули в ній звичну множину на *-n* і «відновили» однину *Ganove*. За Пфайфером, так слово й увійшло в загальну мову в XIX столітті.

> [!reel] Робот і робота
> *Roboter* — від чеського *robota* «тяжка праця, панщина». Слово придумав Карел Чапек для пʼєси «R. U. R.» (1920), а німецьке закінчення *-er* дав перекладач Отто Пік (1922). Пфайфер додає: *robota* споріднене з німецьким *Arbeit*. Тож український «робот» і німецька «Arbeit» — далекі родичі.

> [!reel] Село, що дало назву каретам
> *Kutsche* — від угорського *kocsi szekér* «віз із Коча». Село Kocs лежало посередині шляху між Віднем і Будою, тут міняли коней на регулярному маршруті вже в XV столітті. Слово дійшло до німецької в XVI столітті й спершу мало пояснювальну форму *Gutschenwagen*.

## Джерела та що почитати

- [DWDS — Grenze](https://www.dwds.de/wb/Grenze): етимологія (Pfeifer), шлях слова з давньопольської.
- [DWDS — Quark](https://www.dwds.de/wb/Quark): західнословʼянське джерело, перехід tw- → qu-.
- [DWDS — Gurke](https://www.dwds.de/wb/Gurke): давньопольське *ogurek*.
- [DWDS — Kren](https://www.dwds.de/wb/Kren): словʼянське *chrěnъ*.
- [DWDS — Pistole](https://www.dwds.de/wb/Pistole): давньочеське *píšťala*, гуситські війни.
- [DWDS — Roboter](https://www.dwds.de/wb/Roboter): Чапек, «R. U. R.», переклад О. Піка.
- [DWDS — Kutsche](https://www.dwds.de/wb/Kutsche): угорське село Kocs.
- [DWDS — Mutter](https://www.dwds.de/wb/Mutter): індоєвропейський корінь *māter-* і словʼянські родичі.
- [DWDS — Kampf](https://www.dwds.de/wb/Kampf): рання позика з лат. *campus* до пересування приголосних.
- [DWDS — Maulwurf](https://www.dwds.de/wb/Maulwurf): народна етимологія.
- [DWDS — Sintflut](https://www.dwds.de/wb/Sintflut): *sin-* і *Sündflut*.
- [DWDS — Ganove](https://www.dwds.de/wb/Ganove): гебрайське *gannāv*, зворотне утворення однини.

> [!important] Підсумок
> - **Erbwort** — успадковане (*Mutter, Nacht*), **Lehnwort** — засвоєна позика (*Ziegel, Grenze*), **Fremdwort** — позика з чужим виглядом (*Blamage, Etage*), **Lehnübersetzung** — калька (*Wolkenkratzer, Mitleid*).
> - Схожість із українським словом — це або спільний корінь (*urverwandt*: *Mutter — мати*), або запозичення (*entlehnt*: *Grenze — границя*). Різницю показує словник.
> - Друге пересування приголосних пояснює *Pforte, Ziegel, Kampf* проти англ. *port, tile, camp*.
> - Хвилі позик: латина (Рим), грецька (Церква), французька й італійська, їдиш (*meschugge, Ganove*), словʼянські й угорська (*Quark, Peitsche, Kutsche, Säbel*).
> - Народна етимологія (*Maulwurf, Sintflut, Hängematte, Friedhof*) — цікава, але не наукова; перевіряй у Пфайфера (DWDS).
