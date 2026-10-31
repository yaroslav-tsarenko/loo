---
title: Розпорядок дня й відокремлювані дієслова
id: de-a1-trennbar
level: A1
icon: px:hourglass
tags: [deutsch, a1, grammar, trennbare-verben, tagesablauf]
prerequisites: ["[[Deutsch - A1 - 14. Дієслова з чергуванням — fahren, essen, lesen, nehmen]]"]
estimatedMinutes: 40
---

# Розпорядок дня й відокремлювані дієслова

> [!success] Після цієї теми ти зможеш
> - розповісти про свій день: *Ich stehe um sieben Uhr auf. Dann dusche ich und frühstücke.*;
> - поставити префікс відокремлюваного дієслова наприкінці речення: *Ich rufe dich an. Wir kaufen ein.*;
> - відрізнити відокремлювані дієслова від невідокремлюваних (*aufstehen* і *verstehen*);
> - сказати, як часто ти щось робиш: *immer, oft, manchmal, nie*.

## Передбач

> [!quiz] Як сказати «Я встаю о сьомій»?
> level: A1 · type: single · id: de-a1-trennbar-q01
> - [ ] Ich aufstehe um sieben Uhr.
> - [x] Ich stehe um sieben Uhr auf.
> - [ ] Ich stehe auf um sieben Uhr.
> - [ ] Ich auf stehe um sieben Uhr.
>
> **Пояснення:** у дієслові *aufstehen* префікс **auf-** відділяється й іде в **кінець** речення, а відмінювана частина (*stehe*) стоїть на другому місці. Форми *Ich aufstehe* та *Ich auf stehe* неправильні, а *stehe auf um sieben Uhr* розриває речення не там.

## Дужка речення

У німецькій багато дієслів складаються з **префікса** й **основи**: *auf* + *stehen* → *aufstehen* («вставати»). В інфінітиві вони стоять разом, а в реченні розділяються: відмінювана частина іде на друге місце, префікс — у кінець. Виходить «дужка» (*Satzklammer*), всередині якої все інше:

> [!diagram] Дужка речення: Ich stehe um 7 Uhr auf
> ```yaml
> layout: flow
> nodes:
>   - { id: subj, label: "1-ше місце", text: "Ich", tone: mint }
>   - { id: verb, label: "2-ге місце · основа", text: "stehe", tone: orange }
>   - { id: mid, label: "всередині", text: "um 7 Uhr", tone: gray }
>   - { id: pref, label: "кінець · префікс", text: "auf", tone: orange }
> steps:
>   - { show: [subj], focus: subj, note: "Починаємо з інфінітива aufstehen. Спочатку підмет: Ich." }
>   - { show: [verb], focus: verb, note: "Основа stehen відмінюється й стає на друге місце: Ich stehe. Як в усіх реченнях (V2)." }
>   - { show: [mid], focus: mid, note: "Усе інше — час, місце, обʼєкт — іде всередину." }
>   - { show: [pref], focus: pref, note: "Префікс auf залишається в самому кінці. Дужка закрита: Ich stehe … auf." }
> ```
> Помаранчевий — обидві частини дієслова: основа на 2-му місці й префікс у кінці.

| Інфінітив | Речення | Переклад |
|---|---|---|
| aufstehen | Ich **stehe** um 7 Uhr **auf**. | Я встаю о сьомій. |
| anrufen | Er **ruft** seine Mutter **an**. | Він телефонує мамі. |
| einkaufen | Wir **kaufen** am Samstag **ein**. | Ми робимо покупки в суботу. |
| fernsehen | Sie **sieht** abends **fern**. | Вона дивиться телевізор увечері. |
| anfangen | Der Kurs **fängt** um 9 Uhr **an**. | Курс починається о 9. |

## Питання і дужка

У питанні «так / ні» основа стоїть на першому місці, префікс — як і раніше в кінці: *Stehst du um 7 Uhr **auf**?* У W-питанні — питальне слово, потім основа: *Wann **fängt** der Kurs **an**?* Префікс завжди лишається наприкінці.

А ось у **інфінітиві** (після модальних дієслів, тема [[Deutsch - A1 - 19. Модальні дієслова — können, müssen, wollen, dürfen, möchten]]) префікс знову зростається з основою: *Ich muss früh **aufstehen**.* Дужка розкривається лише там, де дієслово відмінюється.

## Як відрізнити відокремлюваний префікс

Відокремлювані префікси — це самостійні слова: *auf, an, ein, aus, mit, ab, zu, fern, zurück* та ін. На них падає **наголос**: *AUFstehen, ANrufen, EINkaufen*. Невідокремлювані префікси ненаголошені: *be-, ver-, er-, ent-, ge-, zer-* — вони з основою не розходяться.

> [!diagram] Відокремлюваний чи ні
> ```yaml
> layout: compare
> columns: { a: "відокремлюваний (наголос на префіксі)", b: "невідокремлюваний (префікс без наголосу)" }
> nodes:
>   - { id: a1, col: a, label: "aufstehen", text: "Ich stehe früh auf.", tone: yellow }
>   - { id: a2, col: a, label: "anrufen", text: "Ich rufe dich an.", tone: yellow }
>   - { id: b1, col: b, label: "verstehen", text: "Ich verstehe dich.", tone: pink }
>   - { id: b2, col: b, label: "besuchen", text: "Ich besuche dich.", tone: pink }
> steps:
>   - { focus: [a1, a2], note: "AUFstehen, ANrufen: наголос на префіксі, і він іде в кінець речення." }
>   - { focus: [b1, b2], note: "verSTEhen, beSUchen: префікс ver-, be- ненаголошений і лишається на дієслові." }
> ```
> Жовтий — відокремлюваний, рожевий — невідокремлюваний.

> [!tip] Як перевірити
> Прислухайся до наголосу. Якщо перший склад наголошений (*AUFstehen*) — префікс відокремлюється. Якщо наголос на основі (*verSTEhen, beSUchen*) — ні. Префікси *be-, ver-, er-, ent-, ge-, zer-* не відокремлюються. Саме закінчення *-ieren* ще не робить дієслово невідокремлюваним: *anprobieren — probiere … an*. Виняток із правила наголосу: *frühstücken* (наголос на першому складі, але дієслово не відокремлюється: *Ich frühstücke*).

## Розпорядок дня

Розповідь про день складається з послідовності кроків. Допомагають слова *zuerst, dann, danach*. Дієслово завжди залишається на другому місці, тому після *dann* підмет іде **після** дієслова:

| Українською | Німецькою |
|---|---|
| Спочатку я встаю. | **Zuerst** stehe ich auf. |
| Потім я приймаю душ. | **Dann** dusche ich. |
| Після цього я снідаю. | **Danach** frühstücke ich. |

Не ~~Dann ich dusche~~: після *dann* — дієслово, потім підмет (V2, тема [[Deutsch - A1 - 09. Питання й місце дієслова — V2 і W-Fragen]]).

## Як часто? immer, oft, manchmal, nie

Слова частоти показують, як часто щось відбувається. Зазвичай ставимо їх **після дієслова** (у дужці — всередині); для акценту слово може стояти й на першому місці: *Manchmal räume ich auf.*

> [!diagram] Шкала частоти
> ```yaml
> layout: flow
> nodes:
>   - { id: n, label: "0 %", text: "nie", tone: gray }
>   - { id: s, label: "≈ 10–20 %", text: "selten", tone: yellow }
>   - { id: m, label: "≈ 50 %", text: "manchmal", tone: yellow }
>   - { id: o, label: "≈ 70–80 %", text: "oft", tone: pink }
>   - { id: me, label: "≈ 90 %", text: "meistens", tone: pink }
>   - { id: i, label: "100 %", text: "immer", tone: pink }
> steps:
>   - { focus: [n], note: "nie — «ніколи». Само по собі вже заперечення: Ich stehe nie früh auf. Додатковий nicht не потрібен." }
>   - { focus: [s, m], note: "selten — «рідко», manchmal — «іноді»." }
>   - { focus: [o, me, i], note: "oft — «часто», meistens — «здебільшого», immer — «завжди»." }
> ```
> Відсотки — приблизні орієнтири, а не точні межі.

Приклади: *Ich stehe **immer** um sieben Uhr auf. Er sieht **oft** fern. Wir kaufen **manchmal** am Samstag ein. Sie ruft **nie** an.*

## Приклади

- Ich wache um sechs Uhr auf, aber ich stehe erst um halb sieben auf. — Я прокидаюся о шостій, але встаю лише о пів на сьому.
- Dann dusche ich und frühstücke. — Потім я приймаю душ і снідаю.
- Mein Mann nimmt immer ein Buch mit. — Мій чоловік завжди бере з собою книжку.
- Um acht Uhr komme ich im Büro an. — О восьмій я приходжу в офіс.
- Rufst du mich heute Abend an? — Ти зателефонуєш мені сьогодні ввечері?
- Am Samstag kaufen wir auf dem Markt ein. — У суботу ми робимо покупки на ринку.
- Ich lade dich zum Geburtstag ein. — Запрошую тебе на день народження.
- Hol mich bitte vom Bahnhof ab! — Забери мене, будь ласка, з вокзалу!
- Manchmal räume ich am Wochenende die Wohnung auf. — Інколи на вихідних я прибираю квартиру.
- Um fünf Uhr hat sie Feierabend. — О пʼятій у неї кінець робочого дня.
- Die Pause fängt um zwölf Uhr an. — Перерва починається о дванадцятій.

## Слова

### Відокремлювані дієслова: ранок і вечір

> [!word] aufstehen
> ipa: /ˈaʊ̯fˌʃteːən/ · pos: verb · level: A1 · id: de-a1-trennbar-w01
> uk: вставати
> forms: er steht auf · stand auf · ist aufgestanden
> example: Ich **stehe** jeden Tag um sieben Uhr **auf**. — Щодня я встаю о сьомій.
> note: aufstehen — вилізти з ліжка. «Стояти» — stehen (без auf).

> [!word] aufwachen
> ipa: /ˈaʊ̯fˌvaxn̩/ · pos: verb · level: A1 · id: de-a1-trennbar-w02
> uk: прокидатися
> forms: er wacht auf · wachte auf · ist aufgewacht
> example: Das Baby **wacht** nachts oft **auf**. — Дитина часто прокидається вночі.
> note: aufwachen — прокинутися (момент), aufstehen — встати з ліжка.

> [!word] ausschlafen
> ipa: /ˈaʊ̯sˌʃlaːfn̩/ · pos: verb · level: A1 · id: de-a1-trennbar-w03
> uk: виспатися
> forms: er schläft aus · schlief aus · hat ausgeschlafen
> example: Am Wochenende **schlafe** ich immer lange **aus**. — На вихідних я завжди довго сплю.
> note: чергування a → ä залишається: du schläfst aus, er schläft aus.

> [!word] einschlafen
> ipa: /ˈaɪ̯nˌʃlaːfn̩/ · pos: verb · level: A1 · id: de-a1-trennbar-w04
> uk: засинати
> forms: er schläft ein · schlief ein · ist eingeschlafen
> example: Ich **schlafe** meistens schnell **ein**. — Я зазвичай швидко засинаю.
> note: einschlafen — перехід у сон; schlafen — просто спати.

> [!word] duschen
> ipa: /ˈduːʃn̩/ · pos: verb · level: A1 · id: de-a1-trennbar-w05
> uk: приймати душ
> forms: er duscht · duschte · hat geduscht
> example: Ich **dusche** jeden Morgen. — Я приймаю душ щоранку.
> note: не відокремлюване. Іменник: die Dusche.

> [!word] frühstücken
> ipa: /ˈfʁyːˌʃtʏkn̩/ · pos: verb · level: A1 · id: de-a1-trennbar-w06
> uk: снідати
> forms: er frühstückt · frühstückte · hat gefrühstückt
> example: Wir **frühstücken** um halb acht. — Ми снідаємо о пів на восьму.
> note: від früh + Stück. Не відокремлюване. Іменник — das Frühstück (тема 18).

> [!word] aufräumen
> ipa: /ˈaʊ̯fˌʁɔʏ̯mən/ · pos: verb · level: A1 · id: de-a1-trennbar-w07
> uk: прибирати (наводити лад)
> forms: er räumt auf · räumte auf · hat aufgeräumt
> example: Ich **räume** am Samstag die Wohnung **auf**. — У суботу я прибираю квартиру.
> note: aufräumen = навести лад, прибрати речі на місця. Мити підлогу — den Boden wischen.

> [!word] fernsehen
> ipa: /ˈfɛʁnˌzeːən/ · pos: verb · level: A1 · id: de-a1-trennbar-w08
> uk: дивитися телевізор
> forms: er sieht fern · sah fern · hat ferngesehen
> example: Am Abend **sehen** wir ein bisschen **fern**. — Увечері ми трохи дивимося телевізор.
> note: чергування e → ie залишається: du siehst fern. Фільм у кіно — einen Film sehen.

### Відокремлювані дієслова: контакти й справи

> [!word] anrufen
> ipa: /ˈanˌʁuːfn̩/ · pos: verb · level: A1 · id: de-a1-trennbar-w09
> uk: телефонувати (комусь)
> forms: er ruft an · rief an · hat angerufen
> example: Ich **rufe** dich morgen **an**. — Я зателефоную тобі завтра.
> note: після anrufen — знахідний: Ich rufe dich an. Телефонувати взагалі — telefonieren.

> [!word] einkaufen
> ipa: /ˈaɪ̯nˌkaʊ̯fn̩/ · pos: verb · level: A1 · id: de-a1-trennbar-w10
> uk: купувати (продукти, покупки)
> forms: er kauft ein · kaufte ein · hat eingekauft
> example: Wir **kaufen** im Supermarkt **ein**. — Ми робимо покупки в супермаркеті.
> note: einkaufen — «ходити по магазинах за покупками». kaufen — купити конкретну річ.

> [!word] einladen
> ipa: /ˈaɪ̯nˌlaːdn̩/ · pos: verb · level: A1 · id: de-a1-trennbar-w11
> uk: запрошувати
> forms: er lädt ein · lud ein · hat eingeladen
> example: Ich **lade** dich zum Essen **ein**. — Запрошую тебе на обід.
> note: a → ä: du lädst ein, er lädt ein. Знахідний: jemanden einladen. Einladung — запрошення.

> [!word] abholen
> ipa: /ˈapˌhoːlən/ · pos: verb · level: A1 · id: de-a1-trennbar-w12
> uk: забирати (з місця); зустрічати
> forms: er holt ab · holte ab · hat abgeholt
> example: Ich **hole** dich um acht vom Bahnhof **ab**. — Я заберу тебе з вокзалу о восьмій.
> note: abholen — зустріти людину й забрати: ein Paket abholen, ein Kind aus der Schule abholen.

> [!word] mitkommen
> ipa: /ˈmɪtˌkɔmən/ · pos: verb · level: A1 · id: de-a1-trennbar-w13
> uk: іти разом; піти з кимось
> forms: er kommt mit · kam mit · ist mitgekommen
> example: **Kommst** du mit ins Kino? — Ти підеш з нами в кіно?
> note: Kommst du mit? — типове запрошення. Відповідь: Ja, gern. / Nein, leider nicht.

> [!word] mitbringen
> ipa: /ˈmɪtˌbʁɪŋən/ · pos: verb · level: A1 · id: de-a1-trennbar-w14
> uk: приносити з собою
> forms: er bringt mit · brachte mit · hat mitgebracht
> example: Ich **bringe** Kuchen **mit**. — Я принесу пиріг.
> note: Bringst du etwas mit? — Ти щось принесеш? Гості приходять із Mitbringsel.

> [!word] mitnehmen
> ipa: /ˈmɪtˌneːmən/ · pos: verb · level: A1 · id: de-a1-trennbar-w15
> uk: брати з собою
> forms: er nimmt mit · nahm mit · hat mitgenommen
> example: Ich **nehme** einen Regenschirm **mit**. — Я беру з собою парасольку.
> note: e → i залишається: du nimmst mit. mitbringen — принести до місця, mitnehmen — узяти з собою в дорогу.

> [!word] ankommen
> ipa: /ˈanˌkɔmən/ · pos: verb · level: A1 · id: de-a1-trennbar-w16
> uk: прибувати; приїжджати
> forms: er kommt an · kam an · ist angekommen
> example: Der Zug **kommt** um 10 Uhr **an**. — Потяг прибуває о 10.
> note: «Ми приїхали» — Wir sind angekommen. Ankunft — прибуття (антонім Abfahrt).

> [!word] anfangen
> ipa: /ˈanˌfaŋən/ · pos: verb · level: A1 · id: de-a1-trennbar-w17
> uk: починати; починатися
> forms: er fängt an · fing an · hat angefangen
> example: Der Film **fängt** um 20 Uhr **an**. — Фільм починається о 20:00.
> note: a → ä: du fängst an, er fängt an. Синонім — beginnen (стиль нейтральніший).

> [!word] aufhören
> ipa: /ˈaʊ̯fˌhøːʁən/ · pos: verb · level: A1 · id: de-a1-trennbar-w18
> uk: припиняти; закінчуватися
> forms: er hört auf · hörte auf · hat aufgehört
> example: Der Kurs **hört** um 12 Uhr **auf**. — Курс закінчується о 12.
> note: aufhören + zu + інфінітив — «перестати робити». Hör auf! — Припини!

> [!word] aufmachen
> ipa: /ˈaʊ̯fˌmaxn̩/ · pos: verb · level: A1 · id: de-a1-trennbar-w19
> uk: відчиняти
> forms: er macht auf · machte auf · hat aufgemacht
> example: **Mach** bitte die Tür **auf**! — Відчини, будь ласка, двері!
> note: розмовне; нейтральніше — öffnen. Протилежне: zumachen.

> [!word] zumachen
> ipa: /ˈtsuːˌmaxn̩/ · pos: verb · level: A1 · id: de-a1-trennbar-w20
> uk: зачиняти
> forms: er macht zu · machte zu · hat zugemacht
> example: **Mach** bitte das Fenster **zu**! — Зачини, будь ласка, вікно!
> note: нейтральніше — schließen. «Магазин зачинений» — Der Laden ist zu. «Відчинено» — auf.

### Слова частоти й послідовності

> [!word] immer
> ipa: /ˈɪmɐ/ · pos: adv · level: A1 · id: de-a1-trennbar-w21
> uk: завжди
> example: Er kommt **immer** pünktlich. — Він завжди приходить вчасно.
> note: -er = [ɐ].

> [!word] meistens
> ipa: /ˈmaɪ̯stn̩s/ · pos: adv · level: A1 · id: de-a1-trennbar-w22
> uk: здебільшого; зазвичай
> example: **Meistens** esse ich um eins zu Mittag. — Зазвичай я обідаю о першій.
> note: ei = [aɪ̯]. Синонім: normalerweise (трохи офіційніше).

> [!word] oft
> ipa: /ɔft/ · pos: adv · level: A1 · id: de-a1-trennbar-w23
> uk: часто
> example: Wir fahren **oft** nach Wien. — Ми часто їздимо до Відня.
> note: ft — обидва приголосних: [ɔft].

> [!word] manchmal
> ipa: /ˈmançmaːl/ · pos: adv · level: A1 · id: de-a1-trennbar-w24
> uk: іноді; подеколи
> example: **Manchmal** koche ich am Wochenende. — Іноді на вихідних я готую.
> note: -nch- = [nç]: «манхьмаль».

> [!word] selten
> ipa: /ˈzɛltn̩/ · pos: adv · level: A1 · id: de-a1-trennbar-w25
> uk: рідко
> example: Ich sehe **selten** fern. — Я рідко дивлюся телевізор.
> note: s перед голосним — дзвінке [z].

> [!word] nie
> ipa: /niː/ · pos: adv · level: A1 · id: de-a1-trennbar-w26
> uk: ніколи
> example: Er isst **nie** Fleisch. — Він ніколи не їсть мʼяса.
> note: nie вже є запереченням: ~~nie nicht~~. Синонім: niemals (сильніше).

> [!word] zuerst
> ipa: /tsuˈʔeːɐ̯st/ · pos: adv · level: A1 · id: de-a1-trennbar-w27
> uk: спочатку; спершу
> example: **Zuerst** dusche ich, dann frühstücke ich. — Спочатку я приймаю душ, потім снідаю.
> note: ʔ — короткий уступ перед e. Інший варіант: zuerst = als Erstes.

> [!word] dann
> ipa: /dan/ · pos: adv · level: A1 · id: de-a1-trennbar-w28
> uk: потім; тоді
> example: **Dann** gehe ich zur Arbeit. — Потім я йду на роботу.
> note: dann ≠ denn (бо). Після dann — дієслово: Dann gehe ich, а не ~~Dann ich gehe~~.

> [!word] danach
> ipa: /daˈnaːx/ · pos: adv · level: A1 · id: de-a1-trennbar-w29
> uk: після цього; потім
> example: **Danach** lese ich noch ein bisschen. — Після цього я ще трохи читаю.
> note: наголос на -nach: «данах». ch після a = [x].

### Тема «день»

> [!word] der Wecker
> ipa: /ˈvɛkɐ/ · pos: noun · level: A1 · id: de-a1-trennbar-w30
> uk: будильник
> forms: die Wecker
> example: Mein **Wecker** klingelt um sechs Uhr. — Мій будильник дзвонить о шостій.
> note: від wecken — «будити». CH і AT: Wecker так само.

> [!word] der Feierabend
> ipa: /ˈfaɪ̯ɐˌʔaːbn̩t/ · pos: noun · level: A1 · id: de-a1-trennbar-w31
> uk: кінець робочого дня; вільний вечір
> forms: die Feierabende (рідко)
> example: Um fünf Uhr habe ich **Feierabend**. — О пʼятій у мене кінець робочого дня.
> note: Schönen Feierabend! — побажання колегам. Feierabend machen — закінчити роботу.

> [!word] die Pause
> ipa: /ˈpaʊ̯zə/ · pos: noun · level: A1 · id: de-a1-trennbar-w32
> uk: перерва; пауза
> forms: die Pausen
> example: In der **Pause** trinke ich einen Kaffee. — На перерві я пʼю каву.
> note: Mittagspause — обідня перерва. Pause machen — зробити перерву.

> [!word] die Arbeit
> ipa: /ˈaʁbaɪ̯t/ · pos: noun · level: A1 · id: de-a1-trennbar-w33
> uk: робота; праця
> forms: die Arbeiten
> example: Meine **Arbeit** beginnt um acht Uhr. — Моя робота починається о восьмій.
> note: до роботи: zur Arbeit gehen, на роботі: bei der Arbeit / auf der Arbeit (розм.). Множина die Arbeiten — контрольні, роботи (письмові).

> [!word] der Alltag
> ipa: /ˈaltaːk/ · pos: noun · level: A1 · id: de-a1-trennbar-w34
> uk: будні; повсякденне життя
> forms: — (без множини)
> example: Im **Alltag** habe ich wenig Zeit. — У повсякденному житті в мене мало часу.
> note: alltags = у будні; Alltagssprache — розмовна мова. g на кінці — [k].

> [!word] die Hausaufgabe
> ipa: /ˈhaʊ̯sˌʔaʊ̯fɡaːbə/ · pos: noun · level: A1 · id: de-a1-trennbar-w35
> uk: домашнє завдання
> forms: die Hausaufgaben
> example: Nach der Schule macht er die **Hausaufgaben**. — Після школи він робить домашнє завдання.
> note: у розмові майже завжди множина: Hausaufgaben machen. Не ~~Hausarbeit~~ (це домашня робота: прибирання або реферат).

## Слухаємо

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: de-a1-trennbar-l01
> audio: Ich stehe um sieben Uhr auf.
> - [ ] Ich stehe um sieben Uhr nicht auf.
> - [x] Ich stehe um sieben Uhr auf.
> - [ ] Ich stehe um acht Uhr auf.

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: de-a1-trennbar-l02
> audio: Wir kaufen am Samstag ein.
> - [x] Wir kaufen am Samstag ein.
> - [ ] Wir kaufen am Sonntag ein.
> - [ ] Wir kaufen am Samstag ab.

> [!listen] Напиши або скажи, що почув
> level: A1 · type: dictation · speed: slow · id: de-a1-trennbar-l03
> audio: Er ruft seine Mutter an.

> [!listen] Напиши або скажи, що почув
> level: A1 · type: dictation · speed: slow · id: de-a1-trennbar-l04
> audio: Ich sehe abends oft fern.

> [!listen] Послухай. Що робить мовець після душу?
> level: A1 · type: answer · speed: slow · id: de-a1-trennbar-l05
> audio: Ich stehe um halb sieben auf. Zuerst dusche ich. Dann frühstücke ich. Danach gehe ich zur Arbeit.
> - [ ] телефонує мамі
> - [x] снідає
> - [ ] дивиться телевізор
>
> **Пояснення:** послідовність: *zuerst dusche ich* (душ), *dann frühstücke ich* (сніданок), *danach gehe ich zur Arbeit*. Після душу — сніданок.

> [!listen] Послухай діалог. О котрій починається курс?
> level: A1 · type: answer · speed: slow · id: de-a1-trennbar-l06
> audio: A: Wann fängt der Kurs an?
> audio: B: Er fängt um neun Uhr an und hört um zwölf Uhr auf.
> audio: A: Und wann ist die Pause?
> audio: B: Die Pause ist um zehn Uhr.
> - [ ] о 8, закінчується о 12
> - [x] о 9, закінчується о 12
> - [ ] о 10, закінчується о 12
>
> **Пояснення:** *fängt um neun Uhr an* — починається о девʼятій, *hört um zwölf Uhr auf* — закінчується о дванадцятій. О десятій — лише перерва.

## Вимова

Відокремлюваний префікс **наголошений**: *AUFstehen, ANrufen, EINkaufen, MITkommen*. У реченні префікс стоїть наприкінці й теж звучить виразно: *Ich stehe um sieben Uhr AUF.* Слухай, як голос трохи падає на префіксі. А невідокремлювані префікси ненаголошені: *verSTEhen, beSUchen*.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-trennbar-s01
> text: Ich stehe um sieben Uhr auf.
> ipa: /ɪç ˈʃteːə ʊm ˈziːbn̩ uːɐ̯ ˈaʊ̯f/
> tip: st- на початку = [ʃt]: «штеє». auf наприкінці — з наголосом, довгий звук [aʊ̯]. ich — [ç].
> uk: Я встаю о сьомій.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-trennbar-s02
> text: Er ruft seine Mutter an.
> ipa: /eːɐ̯ ʁuːft ˈzaɪ̯nə ˈmʊtɐ an/
> tip: ruft — довге [uː], r горловий [ʁ]. an наприкінці — короткий [a].
> uk: Він телефонує своїй мамі.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-trennbar-s03
> text: Wir kaufen am Samstag ein.
> ipa: /viːɐ̯ ˈkaʊ̯fn̩ am ˈzamstaːk aɪ̯n/
> tip: kaufen — au = [aʊ̯], -en після f звучить як [n̩]. ein — [aɪ̯n].
> uk: У суботу ми робимо покупки.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-trennbar-s04
> text: Zuerst dusche ich, dann frühstücke ich.
> ipa: /tsuˈʔeːɐ̯st ˈduːʃə ɪç dan ˈfʁyːʃtʏkə ɪç/
> tip: zuerst — z = [ts], наголос на -erst. frühstücke — ü довге [yː] у früh-, коротке [ʏ] у -stü-.
> uk: Спочатку я приймаю душ, потім снідаю.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-trennbar-s05
> text: Ich sehe nie fern.
> ipa: /ɪç ˈzeːə niː fɛʁn/
> tip: nie — довге [iː]. fern — r після голосного перед n = [ʁ] або [ɐ̯].
> uk: Я ніколи не дивлюся телевізор.

## Типові помилки українців

> [!pitfall] Префікс лишився на дієслові: «Ich aufstehe um sieben»
> В інфінітиві префікс разом із дієсловом, а в реченні — розділяється: *Ich **stehe** um sieben Uhr **auf***. Помилки ~~Ich aufstehe um sieben Uhr~~, ~~Ich stehe auf um sieben Uhr~~ часті, бо в українській «встаю» — одне слово.

> [!pitfall] «Ich rufe an dich» — префікс не стоїть між дієсловом і обʼєктом
> Обʼєкт іде **всередину** дужки: *Ich **rufe dich an***. Префікс іде після всього, що стоїть усередині дужки; помилка ~~Ich rufe an dich~~. Те саме: *Ich lade dich **ein***, *Wir holen dich **ab***.

> [!pitfall] «Dann ich stehe auf» — дієслово не на другому місці
> Після *dann, zuerst, danach, heute* дієслово стоїть **другим**, а підмет — після нього: *Dann **stehe** ich auf.* Префікс, як завжди, у кінці: *Dann stehe ich **auf**.* Помилка ~~Dann ich stehe auf~~ — найпоширеніша.

> [!pitfall] «Ich stehe nie nicht auf» — подвійне заперечення
> *Nie* («ніколи») уже містить заперечення. Українське «ніколи не» тут не копіюємо: *Ich stehe **nie** früh auf* (без *nicht*). Те саме з *kein / nichts*: ~~Ich habe nie keine Zeit~~ → *Ich habe nie Zeit.*

## Ситуація: що ти робиш у суботу?

> [!listen] Послухай діалог між колегами. Що робитимуть вони в суботу?
> level: A1 · type: answer · speed: slow · id: de-a1-trennbar-l07
> audio: A: Was machst du am Samstag, Jonas?
> audio: B: Zuerst schlafe ich lange aus. Dann kaufe ich ein. Und du?
> audio: A: Ich räume die Wohnung auf. Kommst du am Abend mit ins Kino?
> audio: B: Ja, gern! Wann fängt der Film an?
> audio: A: Um acht Uhr. Ich hole dich um halb acht ab.
> - [x] Йонас виспиться й піде по магазинах, потім ввечері вони йдуть у кіно.
> - [ ] Йонас прибиратиме, а колега піде по магазинах.
> - [ ] Вони не підуть у кіно.
>
> **Пояснення:** Йонас: *schlafe aus, kaufe ein*; колега: *räume auf*. Увечері — кіно: фільм починається о 20:00, колега заїде за ним о 19:30.

> [!speak] «Ти йдеш зі мною в кіно? — Так, залюбки»
> level: A1 · speed: slow · id: de-a1-trennbar-s06
> text: Kommst du mit ins Kino? Ja, gern!
> ipa: /kɔmst duː mɪt ɪns ˈkiːno jaː ɡɛʁn/
> tip: mit — наголос на префіксі, короткий [ɪ]. Питання «так / ні» — голос угору ↗. gern — g = [ɡ].
> uk: Ти йдеш зі мною в кіно? Так, залюбки!

## Практика

> [!quiz] Яке речення правильне?
> level: A1 · type: single · id: de-a1-trennbar-q02
> - [ ] Er anruft seine Mutter.
> - [ ] Er ruft an seine Mutter.
> - [x] Er ruft seine Mutter an.
> - [ ] Er ruft seine Mutter.
>
> **Пояснення:** префікс *an-* іде в кінець, обʼєкт стоїть між основою та префіксом. Без *an* лишається просто «кличе».

> [!quiz] Яке речення правильне: «Курс починається о 9»?
> level: A1 · type: single · id: de-a1-trennbar-q03
> - [ ] Der Kurs anfängt um 9 Uhr.
> - [ ] Der Kurs fängt an um 9 Uhr.
> - [x] Der Kurs fängt um 9 Uhr an.
> - [ ] Der Kurs fangt um 9 Uhr an.
>
> **Пояснення:** *fängt* (a → ä в 3-й особі) + час усередині + *an* у кінці. Форма *fangt* без умлаута — теж помилка.

> [!quiz] Що означає «Ich sehe nie fern»?
> level: A1 · type: single · id: de-a1-trennbar-q04
> - [ ] Я часто дивлюся телевізор.
> - [ ] Я іноді дивлюся телевізор.
> - [x] Я ніколи не дивлюся телевізор.
> - [ ] Я не бачу далеко.
>
> **Пояснення:** *nie* — «ніколи». Дужка *sehe … fern* — це дивитися телевізор, а не «бачити далеко». Додатковий *nicht* не потрібен.

> [!quiz] Які дієслова відокремлювані?
> level: A1 · type: multi · id: de-a1-trennbar-q05
> - [x] aufstehen
> - [ ] besuchen
> - [x] einkaufen
> - [ ] verstehen
> - [x] anrufen
>
> **Пояснення:** *auf-, ein-, an-* — наголошені, відокремлюються. *be-* та *ver-* — ненаголошені префікси, вони з основою не розходяться: *Ich besuche dich. Ich verstehe dich.*

> [!quiz] Які речення правильні?
> level: A1 · type: multi · id: de-a1-trennbar-q06
> - [x] Wir holen dich um acht ab.
> - [ ] Ich nehme mit einen Regenschirm.
> - [x] Kommst du mit ins Kino?
> - [ ] Sie wacht auf um sechs Uhr.
> - [x] Dann stehe ich auf.
>
> **Пояснення:** префікс завжди в кінці: *nehme einen Regenschirm mit*, *wacht um sechs Uhr auf*. Після *dann* дієслово — друге.

> [!quiz] Яка частина відсутня: «Er fängt um 8 Uhr ___»?
> level: A1 · type: single · id: de-a1-trennbar-q07
> - [ ] aus
> - [ ] auf
> - [x] an
> - [ ] ein
>
> **Пояснення:** *anfangen* → *er fängt … an*. *Aufhören* («закінчувати») мало б *auf*: *Er hört um 12 Uhr auf.*

> [!quiz] Як сказати «Я маю рано вставати»?
> level: A1 · type: single · id: de-a1-trennbar-q08
> - [x] Ich muss früh aufstehen.
> - [ ] Ich muss früh auf stehen.
> - [ ] Ich muss früh stehen auf.
> - [ ] Ich aufstehen muss früh.
>
> **Пояснення:** після модального дієслова інфінітив стоїть у кінці й **зростається**: *aufstehen*. Дужка розкривається лише у відмінюваній формі.

> [!quiz] Заповни пропуски: відокремлювані дієслова
> level: A1 · type: fill · bank: aus, mit · id: de-a1-trennbar-q09
>
> ```text fill
> Ich [[stehe]] um 7 Uhr [[auf]].
> Mein Bruder [[ruft]] seine Freundin [[an]].
> Wir [[kaufen]] am Samstag [[ein]].
> ```
>
> **Пояснення:** *aufstehen, anrufen, einkaufen*: основа на другому місці, префікс — у кінці.

> [!quiz] Заповни пропуски: частота
> level: A1 · type: fill · bank: nicht, kein · id: de-a1-trennbar-q10
>
> ```text fill
> 100 % — Ich stehe [[immer]] um 7 Uhr auf.
> 90 % — Ich frühstücke [[meistens]] zu Hause.
> 50 % — Wir gehen [[manchmal]] ins Kino.
> 0 % — Er sieht [[nie]] fern.
> ```
>
> **Пояснення:** *immer, meistens, manchmal, nie* — від 100 % до 0 %. Для «ніколи» не потрібні ані *nicht*, ані *kein*.

> [!quiz] Заповни пропуски: послідовність
> level: A1 · type: fill · bank: Weil, Dass · id: de-a1-trennbar-q11
>
> ```text fill
> [[Zuerst]] stehe ich auf. [[Dann]] dusche ich.
> [[Danach]] frühstücke ich.
> ```
>
> **Пояснення:** *zuerst, dann, danach* — «спочатку, потім, після цього». Після кожного дієслово стоїть другим.

> [!quiz] Склади речення: «Я встаю о сьомій»
> level: A1 · type: order · id: de-a1-trennbar-q12
>
> ```text order
> Ich
> stehe
> um
> sieben
> Uhr
> auf.
> aufstehe ✗
> ```
>
> **Пояснення:** основа *stehe* — на другому місці, префікс *auf* — у кінці. Форма *aufstehe* неможлива в простому реченні.

> [!quiz] Склади речення: «Потім я телефоную мамі»
> level: A1 · type: order · id: de-a1-trennbar-q13
>
> ```text order
> Dann
> rufe
> ich
> meine
> Mutter
> an.
> anrufe ✗
> ```
>
> **Пояснення:** після *dann* — дієслово (*rufe*), потім підмет (*ich*), обʼєкт (*meine Mutter*) і префікс (*an*) наприкінці.

> [!quiz] Склади питання: «Ти йдеш з нами?»
> level: A1 · type: order · id: de-a1-trennbar-q14
>
> ```text order
> Kommst
> du
> mit?
> mitkommst ✗
> ```
>
> **Пояснення:** у питанні «так / ні» основа *kommst* — перша, потім підмет, у кінці префікс *mit*.

## Фішки

> [!reel] 😤 Марк Твен проти відокремлюваних дієслів
> Американський письменник Марк Твен у книжці *A Tramp Abroad* (1880) в додатку «The Awful German Language» жартував: німці розділяють дієслово на частини й ховають префікс аж у кінці довгого речення, тож слухач змушений чекати. Попри жарт, правило послідовне: префікс стоїть наприкінці.

> [!reel] 🍺 Feierabend — вечір перед святом
> Слово *Feierabend* походить від *Feier* («святкування, відпочинок») і *Abend*. Спочатку це був вечір напередодні свята. Нині так називають кінець робочого дня: *Schönen Feierabend!* — традиційне побажання колегам, коли вони йдуть додому.

> [!reel] 🌅 Morgenstund hat Gold im Mund
> Німецька приказка *Morgenstund hat Gold im Mund* — «ранкова година має золото в роті» — те саме, що українське «Хто рано встає, тому Бог дає». Приказку часто згадують, коли йдеться про те, щоб рано вставати (*früh aufstehen*).

## Джерела та що почитати

- [DWDS — aufstehen](https://www.dwds.de/wb/aufstehen) — значення, форми, приклади й вимова.
- [Duden — aufstehen](https://www.duden.de/rechtschreibung/aufstehen) — правопис і відмінювання відокремлюваного дієслова.
- [DWDS — Feierabend](https://www.dwds.de/wb/Feierabend) — вимова й походження слова.
- [DW Learn German — Nicos Weg (A1)](https://learngerman.dw.com/en/beginners/c-36519789) — безкоштовний відеокурс Deutsche Welle з граматикою до кожного уроку.
- Goethe-Institut — сторінка іспиту *Goethe-Zertifikat A1: Start Deutsch 1* на goethe.de: зразки завдань і список слів A1.

> [!important] Підсумок
> - Відокремлюваний префікс іде в **кінець** речення, основа — на **друге** місце: *Ich stehe um sieben Uhr auf.*
> - Префікс наголошений (*AUFstehen*); *be-, ver-, er-, ent-, ge-, zer-* не відокремлюються (*verstehen*).
> - Після модальних дієслів інфінітив зростається: *Ich muss früh aufstehen.*
> - Частота: *immer, meistens, oft, manchmal, selten, nie*; *nie* — вже заперечення.
> - Послідовність: *zuerst, dann, danach* + дієслово на 2-му місці: *Dann dusche ich.*
