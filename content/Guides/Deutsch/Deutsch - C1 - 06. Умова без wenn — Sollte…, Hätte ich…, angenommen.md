---
title: Умова без wenn — Sollte…, Hätte ich…, angenommen
id: de-c1-konditional
level: C1
icon: px:star
tags: [deutsch, c1, grammar, konditional, verberst, konjunktiv2, nominalisierung]
prerequisites: ["[[Deutsch - B2 - 04. Konjunktiv II минулого — hätte gemacht, wäre gekommen]]", "[[Deutsch - C1 - 05. Непряма мова — Konjunktiv I і II, вводи]]"]
estimatedMinutes: 40
---

# Умова без wenn — Sollte…, Hätte ich…, angenommen

> [!success] Після цієї теми ти зможеш
> - будувати умову з дієсловом на першому місці: *Sollten Sie Fragen haben, …*, *Hätte ich das gewusst, …*, *Regnet es, …*;
> - вживати звороти *angenommen, vorausgesetzt, gesetzt den Fall, es sei denn* з правильним порядком слів;
> - стискати умову в іменник: *bei Regen, im Falle eines Brandes, bei Nichtbeachtung, ohne deine Hilfe*;
> - обирати форму за регістром — діловий лист, інструкція, розмова, прислівʼя.

## Передбач

> [!quiz] У листі від Hausverwaltung: «Sollten Sie Fragen haben, rufen Sie uns an.» Що це означає?
> level: C1 · type: single · id: de-c1-konditional-q01
> - [x] Якщо у вас виникнуть питання, зателефонуйте нам.
> - [ ] Ви повинні мати питання й зателефонувати нам.
> - [ ] Якби у вас були питання (але їх немає), ви б нам зателефонували.
> - [ ] Чи є у вас питання? Зателефонуйте нам.
>
> **Пояснення:** *Sollten Sie …* на початку речення — це **умова** без *wenn*, дослівно «якщо раптом». Обовʼязку («повинні») тут немає, і умова реальна, не уявна. Питанням це речення теж не є: після коми йде головна частина.

## Як зникає wenn

Умовне *wenn* (реальне чи нереальне) можна прибрати, перебудувавши речення (концесивне *wenn auch / selbst wenn* та ітеративне *immer wenn* так не перебудовуються): **прибираємо *wenn*, а дієслово ставимо на перше місце** (Verberststellung). Головна частина після такої умови, як і після будь-якого підрядного, починається з **дієслова** — або зі слів *dann* / *so*.

| З wenn | Без wenn |
|---|---|
| **Wenn** Sie Fragen **haben**, rufen Sie uns an. | **Haben** Sie Fragen, (dann) rufen Sie uns an. |
| **Wenn** ich das gewusst **hätte**, wäre ich gekommen. | **Hätte** ich das gewusst, wäre ich gekommen. |
| **Wenn** es morgen **regnet**, bleiben wir zu Hause. | **Regnet** es morgen, (so) bleiben wir zu Hause. |

> [!diagram] Від wenn до дієслова на початку
> ```yaml
> layout: compare
> columns: { a: "з wenn", b: "без wenn" }
> nodes:
>   - { id: a1, col: a, label: "початок", text: "Wenn", tone: gray }
>   - { id: a2, col: a, label: "решта умови", text: "ich das gewusst", tone: gray }
>   - { id: a3, col: a, label: "дієслово умови", text: "hätte,", tone: orange }
>   - { id: a4, col: a, label: "головна частина", text: "wäre ich gekommen.", tone: gray }
>   - { id: b1, col: b, label: "початок", text: "Hätte", tone: orange }
>   - { id: b2, col: b, label: "решта умови", text: "ich das gewusst,", tone: gray }
>   - { id: b3, col: b, label: "дієслово умови", text: "—", tone: gray }
>   - { id: b4, col: b, label: "головна частина", text: "wäre ich gekommen.", tone: gray }
> steps:
>   - { focus: [a1, a3], note: "Звичайне підрядне: Wenn … hätte — дієслово умови стоїть у кінці." }
>   - { focus: [b1, b3], note: "Прибираємо wenn, і дієслово hätte переходить на перше місце. У кінці умови його вже немає." }
>   - { focus: [b1, b2], note: "Hätte ich das gewusst, … — це досі умова, хоча починається як питання. Підказка — кома й друга частина." }
>   - { focus: [a4, b4], note: "Головна частина однакова в обох варіантах і починається з дієслова: wäre ich gekommen. Українське «то» — dann або нічого." }
> ```
> Умова з дієсловом на початку — книжніша й коротша за *wenn*.

### Sollte… — «якщо раптом»

*Sollte* + інфінітив на першому місці — **реальна, але не дуже ймовірна** умова. Це типовий рядок ділових листів, інструкцій і договорів:

- *Sollten Sie Fragen haben, stehen wir Ihnen gern zur Verfügung.* — Якщо у вас виникнуть питання, ми охоче допоможемо.
- *Sollte der Zug ausfallen, nehmen Sie bitte den Bus.* — Якщо раптом потяг скасують, сідайте на автобус.
- *Sollten Ihnen Unannehmlichkeiten entstanden sein, bitten wir um Entschuldigung.* — Якщо це завдало вам незручностей, просимо вибачення.

Головна частина — звичайна, у Präsens чи Imperativ, **без** Konjunktiv II. Те саме можна сказати з *falls / wenn* + *sollte* в кінці: *Falls Sie Fragen haben sollten, …* — ще ввічливіше й обережніше.

### Hätte… / Wäre… / Würde… — нереальна умова

З Konjunktiv II дієслово на початку дає **нереальну** умову — у теперішньому чи минулому ([[Deutsch - B2 - 04. Konjunktiv II минулого — hätte gemacht, wäre gekommen]]):

- *Hätte ich mehr Zeit, würde ich Spanisch lernen.* — Якби я мав більше часу, вчив би іспанську.
- *Wäre der Zug pünktlich gewesen, hätten wir den Anschluss erreicht.* — Якби потяг прийшов вчасно, ми встигли б на пересадку.
- *Könnte ich noch einmal wählen, würde ich Medizin studieren.* — Якби я міг вибрати ще раз, вивчав би медицину.

Нереальна умова може стояти й **після** головної частини: *Ich wäre gekommen, hätte ich davon gewusst.* — це книжний стиль. Реальну умову з дієсловом на початку ставлять зазвичай **перед** головною частиною.

### Präsens — у розмові й прислівʼях

Реальна умова в Präsens теж обходиться без *wenn*: *Hast du Zeit, komm vorbei!* У розмові так кажуть рідше, ніж із *wenn*, зате в прислівʼях це норма: *Kommt Zeit, kommt Rat.* — «Прийде час — прийде й порада».

## Слова замість wenn

| Зворот | Значення | Порядок слів | Приклад |
|---|---|---|---|
| **angenommen**, (dass) | припустімо | з *dass* — дієслово в кінці; без *dass* — V2 | *Angenommen, du verlierst den Job – was dann?* |
| **vorausgesetzt**, (dass) | за умови, що | так само | *Vorausgesetzt, das Wetter bleibt gut, grillen wir.* |
| **gesetzt den Fall**, (dass) | припустімо, що; на випадок, якщо | так само | *Gesetzt den Fall, der Server fällt aus, …* |
| **unter der Bedingung, dass** | за умови, що | дієслово в кінці | *…, unter der Bedingung, dass alle zustimmen.* |
| **es sei denn**, (dass) | хіба що | V2 або *dass* | *Wir kommen, es sei denn, es regnet.* |
| **falls / sofern** | якщо, у разі якщо | дієслово в кінці | *Falls es regnet, …* (B2) |

Після *angenommen, vorausgesetzt, gesetzt den Fall* стоїть **кома**; потім — або *dass* із дієсловом у кінці, або звичайне речення з дієсловом на другому місці. Змішувати не можна.

## Умова в іменнику

У письмовій мові, інструкціях і Amtsdeutsch умову часто стискають у **прийменник + іменник** (Nominalstil, див. [[Deutsch - C1 - 02. Nominalstil і Verbalstil — перетворення]]):

| Підрядне | Іменникова група | Стиль |
|---|---|---|
| Wenn es regnet, … | **Bei** Regen … | нейтральний |
| Wenn Sie Fragen haben, … | **Bei** Fragen … | діловий |
| Wenn Sie die Regeln nicht beachten, … | **Bei** Nichtbeachtung (der Regeln) … | офіційний |
| Wenn es brennt, … | **Im Falle** eines Brandes … / **Im** Brandfall … | інструкція |
| Wenn du mir nicht geholfen hättest, … | **Ohne** deine Hilfe hätte ich … | нереальна умова |
| Wenn wir etwas Glück haben, … | **Mit** etwas Glück … | розмова |

*im Falle* + Genitiv потребує артикля чи прикметника: *im Falle **eines** Unfalls*. Без артикля — *im Falle **von*** + Dativ (*im Falle von Schnee*) або складне слово: *im Notfall, im Zweifelsfall, im Ernstfall*.

Ще коротше — прислівники: *notfalls* (у крайньому разі), *gegebenenfalls* (за потреби, *ggf.*), *schlimmstenfalls* (у найгіршому разі), *andernfalls* (інакше), *widrigenfalls* (в іншому разі — в офіційних листах).

## Регістр: що де вживати

| Ситуація | Типова форма |
|---|---|
| розмова з другом | *Wenn du Zeit hast, …* / *Hast du Zeit, …* / *Falls du …* |
| діловий лист, e-mail клієнтові | *Sollten Sie Fragen haben, …* / *Bei Fragen …* |
| інструкція, правила будинку | *Im Brandfall …* / *Bei Störungen …* |
| Behörde, договір | *Bei Nichtbeachtung …* / *…, widrigenfalls …* |
| есе, аргумент | *Angenommen, …* / *Vorausgesetzt, dass …* / *Hätte man …, wäre …* |

## Приклади

- **Sollte** sich Ihre Adresse **ändern**, teilen Sie uns dies bitte mit. — Якщо ваша адреса зміниться, повідомте нам, будь ласка.
- **Hätten** wir früher **gebucht**, wäre es billiger gewesen. — Якби ми забронювали раніше, було б дешевше.
- **Wäre** ich an deiner Stelle, würde ich das Angebot annehmen. — На твоєму місці я прийняв би пропозицію.
- **Angenommen**, die Miete steigt um zehn Prozent – können wir uns das leisten? — Припустімо, оренда зросте на десять відсотків, — чи потягнемо ми?
- Wir unterschreiben, **vorausgesetzt**, dass die Kündigungsfrist drei Monate beträgt. — Ми підпишемо за умови, що строк розірвання — три місяці.
- **Gesetzt den Fall**, das Kind wird krank – wer bleibt dann zu Hause? — Припустімо, дитина захворіє, — хто тоді залишиться вдома?
- **Bei** Regen findet das Konzert in der Halle statt. — У разі дощу концерт відбудеться в залі.
- **Im Falle** eines Stromausfalls öffnen sich die Türen automatisch. — У разі знеструмлення двері відчиняються автоматично.
- **Ohne** deine Hilfe hätte ich die Prüfung nicht bestanden. — Без твоєї допомоги я не склав би іспит.
- **Im Zweifelsfall** fragen Sie lieber bei der Krankenkasse nach. — У разі сумніву краще перепитайте в лікарняній касі.
- Das Formular ist bis Freitag einzureichen, **widrigenfalls** wird der Antrag abgelehnt. — Формуляр треба подати до пʼятниці, інакше заяву відхилять.
- **Kommt** Zeit, kommt Rat. — Прийде час — прийде й порада.

## Слова

> [!word] vorausgesetzt
> ipa: /foˈʁaʊ̯sɡəzɛtst/ · pos: conj · level: C1 · id: de-c1-konditional-w01
> uk: за умови, що
> example: Wir fahren am Samstag, **vorausgesetzt**, das Auto ist repariert. — Поїдемо в суботу, за умови, що машину полагодять.
> note: vorausgesetzt, dass … (дієслово в кінці) або vorausgesetzt, + V2. Від voraussetzen — «передбачати, вимагати як умову».

> [!word] angenommen
> ipa: /ˈanɡənɔmən/ · pos: conj · level: C1 · id: de-c1-konditional-w02
> uk: припустімо (що)
> example: **Angenommen**, du bekommst das Stipendium – ziehst du dann nach Wien? — Припустімо, ти отримаєш стипендію, — переїдеш тоді до Відня?
> note: angenommen, dass … або angenommen, + V2. Водночас Partizip II від annehmen (прийняти): Das Angebot wurde angenommen.

> [!word] gesetzt den Fall
> ipa: /ɡəˈzɛtst deːn fal/ · pos: phrase · level: C1 · id: de-c1-konditional-w03
> uk: припустімо, що; на випадок, якщо
> example: **Gesetzt den Fall**, der Flug wird gestrichen – wer zahlt das Hotel? — Припустімо, рейс скасують, — хто заплатить за готель?
> note: книжне, часто в дискусії й праві. Далі — dass … або V2.

> [!word] im Falle (+ Gen)
> ipa: /ɪm ˈfalə/ · pos: prep · level: C1 · id: de-c1-konditional-w04
> uk: у разі, у випадку
> example: **Im Falle** eines Unfalls rufen Sie die 112. — У разі аварії телефонуйте 112.
> note: також im Fall + Gen. Без артикля — im Falle von + Dat. Сталі вирази: im Falle eines Falles — «на всяк випадок» (розм.-жарт.).

> [!word] unter Umständen
> ipa: /ˈʊntɐ ˈʊmʃtɛndn̩/ · pos: phrase · level: B2 · id: de-c1-konditional-w05
> uk: за певних обставин; можливо
> example: Die Bearbeitung kann **unter Umständen** sechs Wochen dauern. — Розгляд може за певних обставин тривати шість тижнів.
> note: скорочення u. U. — у листах і правилах. Від der Umstand, die Umstände.

> [!word] im Zweifelsfall
> ipa: /ɪm ˈtsvaɪ̯fl̩sfal/ · pos: phrase · level: C1 · id: de-c1-konditional-w06
> uk: у разі сумніву; якщо не впевнений
> example: **Im Zweifelsfall** entscheidet der Arzt. — У разі сумніву рішення ухвалює лікар.
> note: der Zweifelsfall, die Zweifelsfälle. Юридичне: im Zweifel für den Angeklagten — у разі сумніву — на користь обвинуваченого.

> [!word] im Ernstfall
> ipa: /ɪm ˈɛʁnstfal/ · pos: phrase · level: B2 · id: de-c1-konditional-w07
> uk: у разі реальної небезпеки; коли справді знадобиться
> example: **Im Ernstfall** muss jeder wissen, wo der Notausgang ist. — У разі небезпеки кожен має знати, де аварійний вихід.
> note: der Ernstfall, die Ernstfälle — «справжня ситуація» на противагу тренуванню (die Übung).

> [!word] notfalls
> ipa: /ˈnoːtfals/ · pos: adv · level: B2 · id: de-c1-konditional-w08
> uk: у крайньому разі; якщо доведеться
> example: **Notfalls** nehmen wir ein Taxi. — У крайньому разі візьмемо таксі.
> note: синонім — im Notfall. Офіційніше — nötigenfalls.

> [!word] schlimmstenfalls
> ipa: /ˈʃlɪmstn̩fals/ · pos: adv · level: C1 · id: de-c1-konditional-w09
> uk: у найгіршому разі
> example: **Schlimmstenfalls** verlieren wir einen Tag. — У найгіршому разі втратимо день.
> note: пара — bestenfalls «у найкращому разі»: Bestenfalls sind wir um acht da.

> [!word] die Unannehmlichkeit
> ipa: /ˈʊnʔanneːmlɪçkaɪ̯t/ · pos: noun · level: C1 · id: de-c1-konditional-w10
> uk: незручність; неприємність
> forms: die Unannehmlichkeiten
> example: Wir bitten, die **Unannehmlichkeiten** zu entschuldigen. — Просимо вибачити за незручності.
> note: стала формула вибачень у листах і на вокзалі. ʔ після un- перед голосним.

> [!word] eintreten
> ipa: /ˈaɪ̯ntʁeːtn̩/ · pos: verb · level: B2 · id: de-c1-konditional-w11
> uk: наставати, траплятися; входити
> forms: eintreten → trat ein → ist eingetreten (er tritt ein)
> example: Sollte dieser Fall **eintreten**, informieren wir Sie sofort. — Якщо такий випадок настане, ми одразу вас повідомимо.
> note: der Fall / die Situation tritt ein — книжне «трапляється». Пряме значення: in den Raum eintreten — увійти. Perfekt із sein.

> [!word] widrigenfalls
> ipa: /ˈviːdʁɪɡn̩fals/ · pos: adv · level: C1 · id: de-c1-konditional-w12
> uk: в іншому разі; інакше (офіц.)
> example: Zahlen Sie bis zum 15. März, **widrigenfalls** wird ein Mahnverfahren eingeleitet. — Сплатіть до 15 березня, в іншому разі буде розпочато процедуру стягнення.
> note: Amtsdeutsch, у листах-попередженнях і на табличках. У звичайній мові — sonst, andernfalls.

## Слухаємо

> [!listen] Що ти почув?
> level: C1 · type: choice · id: de-c1-konditional-l01
> audio: Hätte ich das gewusst, wäre ich früher gekommen.
> - [x] Hätte ich das gewusst, wäre ich früher gekommen.
> - [ ] Hatte ich das gewusst, war ich früher gekommen.
> - [ ] Hätte ich das gewusst, würde ich früher kommen.

> [!listen] Напиши або скажи, що почув
> level: C1 · type: dictation · id: de-c1-konditional-l02
> audio: Sollten Sie Fragen haben, stehen wir Ihnen gern zur Verfügung.
> explain: Sollten Sie … — умова без wenn. Головна частина починається з дієслова stehen.

> [!listen] Напиши або скажи, що почув
> level: C1 · type: dictation · id: de-c1-konditional-l03
> audio: Im Falle eines Brandes benutzen Sie bitte die Treppe.
> explain: im Falle + Genitiv: eines Brandes. Treppe — сходи, а не ліфт.

> [!listen] Послухай оголошення. Що треба зробити пасажирам?
> level: C1 · type: answer · id: de-c1-konditional-l04
> audio: Sehr geehrte Fahrgäste, sollte der Anschlusszug in Nürnberg nicht warten, nehmen Sie bitte den nächsten Regionalexpress. Ihre Fahrkarte bleibt gültig. Bei Fragen wenden Sie sich an unser Personal.
> - [ ] купити новий квиток на регіональний потяг
> - [x] якщо пересадка не дочекається, сісти на наступний Regionalexpress зі старим квитком
> - [ ] обовʼязково чекати в Нюрнберзі на персонал
>
> **Пояснення:** *sollte der Anschlusszug nicht warten* — «якщо раптом пересадковий потяг не дочекається». *Ihre Fahrkarte bleibt gültig* — квиток дійсний. *Bei Fragen* = якщо будуть питання.

## Вимова

Умова з дієсловом на початку на слух схожа на питання, тому важлива **інтонація**: у питанні голос іде вгору ↗ і речення закінчується, а в умові голос на коми **тримається рівно** або трохи піднімається — і одразу продовжується головна частина. Наголос — на змістовному слові умови: *Hätte ich das **ge**wusst, …*, *Sollten Sie **Fra**gen haben, …*

> [!speak] Скажи вголос
> level: C1 · id: de-c1-konditional-s01
> text: Sollten Sie Fragen haben, rufen Sie uns an.
> ipa: /ˈzɔltn̩ ziː ˈfʁaːɡn̩ ˈhaːbn̩ ˈʁuːfn̩ ziː ʊns an/
> tip: після haben — пауза з рівним тоном, не підйом питання. Sie — дзвінке [z].
> uk: Якщо у вас виникнуть питання, зателефонуйте нам.

> [!speak] Скажи вголос
> level: C1 · id: de-c1-konditional-s02
> text: Hätte ich das gewusst, wäre ich früher gekommen.
> ipa: /ˈhɛtə ɪç das ɡəˈvʊst ˈvɛːʁə ɪç ˈfʁyːɐ̯ ɡəˈkɔmən/
> tip: hätte — коротке [ɛ], wäre — довге [ɛː]. Наголос на -wusst і на früher.
> uk: Якби я це знав, прийшов би раніше.

> [!speak] Скажи вголос
> level: C1 · id: de-c1-konditional-s03
> text: Angenommen, du verlierst den Job – was dann?
> ipa: /ˈanɡənɔmən duː fɛɐ̯ˈliːɐ̯st deːn dʒɔp vas dan/
> tip: Angenommen — наголос на An-. Job — англіцизм, вимовляємо з [dʒ]. was dann — голос униз ↘.
> uk: Припустімо, ти втратиш роботу, — що тоді?

> [!speak] Скажи вголос
> level: C1 · id: de-c1-konditional-s04
> text: Im Zweifelsfall fragen Sie lieber nach.
> ipa: /ɪm ˈtsvaɪ̯fl̩sfal ˈfʁaːɡn̩ ziː ˈliːbɐ naːx/
> tip: Zweifelsfall — z = [ts], w = [v]: «цв». nach — [x] після a, «нах».
> uk: У разі сумніву краще перепитайте.

## Типові помилки українців

> [!pitfall] Sollten Sie … = «Ви повинні»
> *sollen* у голові українця — «бути повинним», тому *Sollten Sie Fragen haben* читають як «Ви повинні мати питання». Насправді це умова «якщо раптом»: *Sollten Sie Fragen haben, … = Falls Sie Fragen haben, …* Перевірка: після такої частини стоїть кома й друга частина з дієсловом на початку.

> [!pitfall] Українське «то» після умови
> ~~Hätte ich Zeit, ich würde mitkommen.~~ ~~Sollte es regnen, wir bleiben zu Hause.~~ Умова займає перше місце, тож головна частина починається з **дієслова**: *Hätte ich Zeit, **würde** ich mitkommen. Sollte es regnen, **bleiben** wir zu Hause.* Українське «то» — *dann* або *so*, і після них теж дієслово: *…, dann **bleiben** wir zu Hause.*

> [!pitfall] angenommen / vorausgesetzt: dass + V2
> ~~Vorausgesetzt, dass das Wetter bleibt gut, …~~ — змішано два варіанти. Або *dass* і дієслово в кінці: *Vorausgesetzt, dass das Wetter gut **bleibt**, …*, або без *dass* із V2: *Vorausgesetzt, das Wetter **bleibt** gut, …*

> [!pitfall] Sollte для нереального минулого
> *Sollte* — для **можливого** («якщо раптом станеться»). Про те, що вже не сталося, — *Hätte / Wäre*: ~~Sollte ich das gewusst haben, wäre ich gekommen~~ → *Hätte ich das gewusst, wäre ich gekommen.* І навпаки: у листі клієнтові ~~Hätten Sie Fragen, …~~ звучить як «якби у вас були питання (але їх немає)» — пиши *Sollten Sie Fragen haben, …*

## Ситуація: лист від Hausverwaltung

> [!listen] Послухай повідомлення на автовідповідачі. Що станеться, якщо орендар не відповість?
> level: C1 · type: answer · id: de-c1-konditional-l05
> audio: Guten Tag, hier ist die Hausverwaltung Berger. Am Dienstag wird die Heizung gewartet. Sollten Sie an diesem Tag nicht zu Hause sein, hinterlegen Sie bitte einen Schlüssel beim Hausmeister. Erhalten wir bis Montag keine Rückmeldung, vereinbaren wir einen neuen Termin.
> - [ ] обслуговування скасують назавжди
> - [ ] майстер відчинить квартиру без ключа
> - [x] домовляться про новий термін
>
> **Пояснення:** дві умови без *wenn*: *Sollten Sie … nicht zu Hause sein* — тоді залишити ключ у доглядача будинку (*Hausmeister*); *Erhalten wir bis Montag keine Rückmeldung* — тоді новий термін.

Відповідай управителю будинку.

> [!speak] «Якщо мене не буде вдома, я залишу ключ у сусідки.»
> level: C1 · id: de-c1-konditional-s05
> text: Sollte ich nicht zu Hause sein, lasse ich den Schlüssel bei meiner Nachbarin.
> ipa: /ˈzɔltə ɪç nɪçt tsuː ˈhaʊ̯zə zaɪ̯n ˈlasə ɪç deːn ˈʃlʏsl̩ baɪ̯ ˈmaɪ̯nɐ ˈnaxbaʁɪn/
> tip: після sein — рівний тон, далі одразу lasse. Schlüssel — ü коротке [ʏ], -ssel — [sl̩].
> uk: Якщо мене не буде вдома, я залишу ключ у сусідки.

## Практика

> [!quiz] Перебудуй без wenn: «___ ich das gewusst, wäre ich gekommen.»
> level: C1 · type: single · id: de-c1-konditional-q02
> - [x] Hätte
> - [ ] Hatte
> - [ ] Wäre
> - [ ] Wenn
>
> **Пояснення:** нереальна умова в минулому: *wenn ich das gewusst hätte* → ***Hätte** ich das gewusst*. *Hatte* — Indikativ Präteritum, *wissen* утворює Perfekt із *haben*, тому не *Wäre*, а *Wenn* потребує дієслова в кінці.

> [!quiz] Яке продовження правильне: «Sollten Sie Fragen haben, …»
> level: C1 · type: single · id: de-c1-konditional-q03
> - [x] wenden Sie sich bitte an Frau Kraus.
> - [ ] Sie wenden sich bitte an Frau Kraus.
> - [ ] bitte Sie wenden sich an Frau Kraus.
> - [ ] sich wenden Sie bitte an Frau Kraus.
>
> **Пояснення:** умова займає перше місце, тож головна частина починається з дієслова: *wenden Sie sich*. Займенник *sich* стоїть після *Sie*, а не перед дієсловом.

> [!quiz] Що означає «Sollte der Zug ausfallen, nehmen wir den Bus»?
> level: C1 · type: single · id: de-c1-konditional-q04
> - [x] Якщо раптом потяг скасують, поїдемо автобусом.
> - [ ] Потяг повинні скасувати, тому поїдемо автобусом.
> - [ ] Якби потяг скасували (але цього не буде), ми поїхали б автобусом.
> - [ ] Потяг мали скасувати, але ми поїхали автобусом.
>
> **Пояснення:** *Sollte …* на початку — реальна, хоч і малоймовірна умова. Головна частина в Präsens: *nehmen wir*. Обовʼязку чи нереальності тут немає.

> [!quiz] Якими реченнями можна замінити «Wenn es regnet, findet das Fest in der Halle statt»?
> level: C1 · type: multi · id: de-c1-konditional-q05
> - [x] Bei Regen findet das Fest in der Halle statt.
> - [x] Regnet es, findet das Fest in der Halle statt.
> - [x] Sollte es regnen, findet das Fest in der Halle statt.
> - [ ] Es regnet, findet das Fest in der Halle statt.
> - [ ] Im Falle Regen findet das Fest in der Halle statt.
>
> **Пояснення:** *bei* + іменник, дієслово на початку і *Sollte* — три способи без *wenn*. *Es regnet, …* — порядок твердження, а не умови. *im Falle* потребує Genitiv з артиклем або *von*: *im Falle von Regen*.

> [!quiz] Обери правильне продовження: «Vorausgesetzt, …, grillen wir am Samstag.»
> level: C1 · type: single · id: de-c1-konditional-q06
> - [x] das Wetter bleibt gut
> - [ ] dass das Wetter bleibt gut
> - [ ] das Wetter gut bleibt
> - [ ] bleibt das Wetter gut
>
> **Пояснення:** без *dass* — звичайний порядок V2: *das Wetter bleibt gut*. З *dass* дієслово йде в кінець (*dass das Wetter gut bleibt*); змішування — помилка.

> [!quiz] Табличка в підʼїзді: «Bei Nichtbeachtung wird ein Bußgeld erhoben.» Що це означає?
> level: C1 · type: single · id: de-c1-konditional-q07
> - [x] Якщо не дотримуватися правил, накладуть штраф.
> - [ ] Під час перевірки беруть плату.
> - [ ] Попри недотримання правил, штрафу не буде.
> - [ ] Без попередження беруть плату.
>
> **Пояснення:** *bei* + віддієслівний іменник = умова: *bei Nichtbeachtung = wenn man die Regeln nicht beachtet*. *ein Bußgeld erheben* — стягнути штраф.

> [!quiz] «___ eines Brandes benutzen Sie bitte die Treppe.»
> level: C1 · type: single · id: de-c1-konditional-q08
> - [x] Im Falle
> - [ ] Bei
> - [ ] Falls
> - [ ] Wenn
>
> **Пояснення:** Genitiv *eines Brandes* — після *im Falle*. *bei* керує Dativ (*bei einem Brand*), а *falls* і *wenn* — сполучники, після них потрібне підрядне з дієсловом.

> [!quiz] Які умови нереальні?
> level: C1 · type: multi · id: de-c1-konditional-q09
> - [x] Hätte ich mehr Geld, würde ich reisen.
> - [ ] Sollte ich mehr Geld haben, reise ich.
> - [x] Wäre er pünktlich gewesen, hätten wir den Zug erreicht.
> - [x] Ohne deine Hilfe hätte ich es nicht geschafft.
> - [ ] Bei gutem Wetter grillen wir.
>
> **Пояснення:** нереальність показує Konjunktiv II: *hätte, wäre, hätten*. *Ohne deine Hilfe* + *hätte* = «якби ти не допоміг». *Sollte …* і *Bei gutem Wetter* — реальні умови.

> [!quiz] Яке речення правильне?
> level: C1 · type: single · id: de-c1-konditional-q10
> - [x] Hätte ich Zeit, würde ich mitkommen.
> - [ ] Hätte ich Zeit, ich würde mitkommen.
> - [ ] Hätte ich Zeit, dann ich würde mitkommen.
> - [ ] Ich hätte Zeit, würde ich mitkommen.
>
> **Пояснення:** після умови головна частина починається з дієслова: *würde ich*. Українське «то» може бути *dann*, але після нього теж дієслово: *dann würde ich*. *Ich hätte Zeit* — твердження, не умова.

> [!quiz] Перебудуй умови без wenn
> level: C1 · type: fill · id: de-c1-konditional-q11
>
> ```text fill
> Wenn Sie Fragen haben → [[Sollten]] Sie Fragen haben, rufen Sie uns an.
> Wenn ich das gewusst hätte → [[Hätte]] ich das gewusst, [[wäre]] ich früher gekommen.
> Wenn das Wetter besser wäre → [[Wäre]] das Wetter besser, [[könnten]] wir grillen. (können)
> ```
>
> **Пояснення:** *Sollten* — ввічлива реальна умова. *Hätte … gewusst* — нереальне минуле; *kommen* утворює Perfekt із *sein*, тому *wäre ich gekommen*. *Wäre … besser* — нереальне теперішнє, *könnten* — K II від *können*.

> [!quiz] Заповни звороти умови
> level: C1 · type: fill · bank: Falls, Bei · id: de-c1-konditional-q12
>
> ```text fill
> [[Vorausgesetzt]], dass alle zustimmen, beginnen wir im Mai. (за умови, що)
> [[Angenommen]], du verlierst deinen Job – was dann? (припустімо)
> [[Gesetzt]] den Fall, der Server fällt aus – wer ist zuständig? (на випадок)
> [[Im]] Falle eines Stromausfalls bleiben die Türen offen. (у разі)
> ```
>
> **Пояснення:** *vorausgesetzt, dass* — умова-вимога; *angenommen* — припущення; *gesetzt den Fall* — сталий зворот; *im Falle* + Genitiv. *Falls* не поєднується з *dass* і з V2 у першому й другому рядку, а *Bei Falle* не існує.

> [!quiz] Стисни умову в іменник
> level: C1 · type: fill · id: de-c1-konditional-q13
>
> ```text fill
> Wenn es regnet → [[Bei]] Regen fällt das Training aus.
> Wenn du mir nicht geholfen hättest → [[Ohne]] deine Hilfe hätte ich es nicht geschafft.
> Wenn man die Regeln nicht beachtet → Bei [[Nichtbeachtung]] droht ein Bußgeld.
> Wenn wir etwas Glück haben → [[Mit]] etwas Glück sind wir um acht da.
> ```
>
> **Пояснення:** *bei* + іменник — реальна умова; *ohne* + K II — нереальна; *Nichtbeachtung* — офіційний іменник від *nicht beachten*; *mit etwas Glück* — «якщо пощастить».

> [!quiz] Склади речення: «Якби я це знав, прийшов би раніше»
> level: C1 · type: order · id: de-c1-konditional-q14
>
> ```text order
> Hätte ich das gewusst,
> wäre
> ich
> früher
> gekommen.
> würde ✗
> ```
>
> **Пояснення:** після умови — дієслово *wäre*, далі підмет. *kommen* — Perfekt із *sein*, тому K II минулого — *wäre … gekommen*, не *würde*.

> [!quiz] Склади рядок ділового листа: «Якщо у вас виникнуть питання, ми охоче допоможемо»
> level: C1 · type: order · id: de-c1-konditional-q15
>
> ```text order
> Sollten Sie Fragen haben,
> stehen
> wir
> Ihnen gern
> zur Verfügung.
> würden ✗
> ```
>
> **Пояснення:** *Sollten Sie …* — реальна умова, тому головна частина в Präsens: *stehen wir … zur Verfügung*. Konjunktiv II (*würden*) тут не потрібен.

> [!quiz] Яке речення доречне в листі клієнтові після збою доставки?
> level: C1 · type: single · id: de-c1-konditional-q16
> - [x] Sollten Ihnen dadurch Unannehmlichkeiten entstanden sein, bitten wir um Entschuldigung.
> - [ ] Wenn Sie Unannehmlichkeiten hatten, sorry.
> - [ ] Hätten Sie Unannehmlichkeiten gehabt, entschuldigen wir uns.
> - [ ] Hast du Probleme gehabt, entschuldigen wir uns.
>
> **Пояснення:** *Sollten … entstanden sein* — ввічлива можлива умова в минулому, стандарт ділового листа. *sorry* і *du* — розмовні. *Hätten Sie … gehabt* означає «якби у вас були незручності (але їх не було)».

## Фішки

> [!reel] ⏳ Kommt Zeit, kommt Rat
> Німецькі прислівʼя люблять умову без *wenn*: *Kommt Zeit, kommt Rat* — «прийде час, прийде й порада». Так само *Ist die Katze aus dem Haus, tanzen die Mäuse* — «кота немає — миші танцюють». Перше дієслово — це і є «якщо».

> [!reel] 🛍️ Bei Nichtgefallen Geld zurück
> Рекламне *Bei Nichtgefallen Geld zurück* — «не сподобається — повернемо гроші». Ціла умова (*wenn es Ihnen nicht gefällt*) стиснута в одне слово з *bei*. Так німецькі інструкції й таблички економлять місце.

> [!reel] 🧯 Im Falle eines Falles
> *Im Falle eines Falles* — жартівливе «на всяк випадок», дослівно «у разі якогось випадку». Звучить як канцелярит, тому й смішно: *Im Falle eines Falles hab ich immer einen Regenschirm dabei.*

## Джерела та що почитати

- [DWDS — vorausgesetzt](https://www.dwds.de/wb/vorausgesetzt) — сполучник *vorausgesetzt, dass* і приклади.
- [DWDS — angenommen](https://www.dwds.de/wb/angenommen) — *angenommen* як сполучник припущення.
- [DWDS — Fall](https://www.dwds.de/wb/Fall) — *im Falle*, *gesetzt den Fall*, *im Zweifelsfall* та інші сполуки.
- [DWDS — widrigenfalls](https://www.dwds.de/wb/widrigenfalls) — офіційне «в іншому разі».
- [Duden Sprachratgeber — Die drei Modi der deutschen Sprache](https://www.duden.de/sprachwissen/sprachratgeber/Die-drei-Modi-der-deutschen-Sprache) — Konjunktiv II в умовних реченнях.
- H. Dreyer, R. Schmitt — *Lehr- und Übungsbuch der deutschen Grammatik* (Hueber) — розділ «Konditionalsätze».

> [!important] Підсумок
> - Умова без *wenn*: **дієслово на перше місце**, після коми — головна частина теж з дієсловом: *Hätte ich Zeit, würde ich kommen.*
> - *Sollte…* — реальна, малоймовірна умова («якщо раптом»), типова для листів; головна частина — Präsens / Imperativ.
> - *Hätte / Wäre / Könnte…* — нереальна умова; може стояти й після головної частини.
> - *angenommen, vorausgesetzt, gesetzt den Fall* + кома + *dass* (дієслово в кінці) **або** V2 — не змішувати.
> - Іменниковий стиль: *bei Regen, bei Nichtbeachtung, im Falle eines Brandes, ohne deine Hilfe*.
