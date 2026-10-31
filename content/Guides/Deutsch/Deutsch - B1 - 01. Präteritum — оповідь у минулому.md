---
title: Präteritum — оповідь у минулому
id: de-b1-praeteritum
level: B1
icon: px:scroll
tags: [deutsch, b1, grammar, praeteritum]
prerequisites: ["[[Deutsch - A2 - 01. Perfekt — haben чи sein і Partizip II]]", "[[Deutsch - A2 - 02. Präteritum sein, haben і модальних — war, hatte, konnte]]"]
estimatedMinutes: 60
---

# Präteritum — оповідь у минулому

> [!success] Після цієї теми ти зможеш
> - утворити Präteritum правильних, неправильних і змішаних дієслів: *machte, arbeitete, ging, sah, dachte*;
> - правильно поставити відокремлюваний префікс у реченні з Präteritum: *Sie stand früh auf*;
> - прочитати й написати коротку оповідь у минулому (казку, новину, звіт про подорож);
> - пояснити, коли в Німеччині говорять Perfekt, а коли пишуть Präteritum, і чому на півдні Präteritum у розмові майже не чути.

## Передбач

> [!quiz] Яке з цих речень — традиційний початок німецької казки?
> level: B1 · type: single · id: de-b1-praeteritum-q01
> - [ ] Es ist einmal ein König gewesen.
> - [ ] Es hat einmal ein König gegeben.
> - [x] Es war einmal ein König.
> - [ ] Es wird einmal ein König sein.
>
> **Пояснення:** казку розповідають у **Präteritum**: *Es war einmal …* — це застигла формула, як українське «Жили-були …». Форма з Perfekt у казці не вживається. Нижче розберемо, чому оповідь у минулому майже завжди пишуть у Präteritum, а розмову ведуть у Perfekt.

## Навіщо потрібне Präteritum, якщо є Perfekt

У темах A2-01 і A2-02 ти вже мав справу з двома способами говорити про минуле. **Perfekt** (*Ich habe gearbeitet*) — це мова розмови: за столом, у телефонній розмові, у листівці другові. **Präteritum** (*Ich arbeitete*) — це мова **письмової оповіді**: романи, казки, новини, газетні звіти, біографії, офіційні тексти. Смислової різниці немає: обидва часи кажуть, що подія була в минулому. Різниця в жанрі.

Дієслова *sein, haben* і модальні (*war, hatte, konnte, musste*) уживають у Präteritum **скрізь**, і в розмові теж — це ти вже знаєш з A2-02. Тепер ми додамо до них решту дієслів, щоб ти міг **читати** казки та новини і **писати** власні оповіді.

> [!diagram] Perfekt чи Präteritum: куди тягне жанр
> ```yaml
> layout: compare
> columns: { a: "Perfekt · розмова", b: "Präteritum · текст" }
> nodes:
>   - { id: a1, col: a, label: "усна розмова", text: "Gestern habe ich Oma besucht.", note: "кава, обід, телефон", tone: yellow }
>   - { id: a2, col: a, label: "повідомлення другові", text: "Ich bin gerade angekommen.", note: "SMS, чат, коротка електронна пошта", tone: yellow }
>   - { id: b1, col: b, label: "казка й роман", text: "Eines Tages ging das Mädchen in den Wald.", note: "художня проза", tone: pink }
>   - { id: b2, col: b, label: "новини й звіти", text: "Die Polizei fand den Dieb am Abend.", note: "газета, радіо, офіційний звіт", tone: pink }
> steps:
>   - { focus: [a1, a2], note: "У розмові німці зазвичай обирають Perfekt. Виняток — war, hatte, konnte, musste, wollte, sollte, а також es gab, wusste, dachte." }
>   - { focus: [b1, b2], note: "У письмовій оповіді, де кілька речень поспіль розповідають про події в минулому, звучить Präteritum. Так пишуть казки, новини, біографії." }
>   - { focus: [a1, b1], note: "Одна й та сама подія може мати обидві форми. Ich habe Oma besucht — розмова. Ich besuchte Oma — коротка оповідь у щоденнику чи в романі." }
> ```
> Це тенденція, а не закон: у твоїй електронній пошті колезі цілком природно змішати обидва часи.

### Північ і південь

На півночі й у центрі Німеччини Präteritum у розмові чути трохи частіше, ніж на півдні. У Баварії, Австрії та німецькомовній Швейцарії усні розповіді про минуле майже завжди ведуть у Perfekt, а Präteritum лишається для книжок і газет. Лінгвісти називають це *oberdeutscher Präteritumschwund* — «зникнення Präteritum у верхньонімецьких говірках». Якщо в Мюнхені чи Відні тобі скажуть *Ich ging gestern ins Kino*, це прозвучить книжково. Тому **розуміти** Präteritum потрібно всім, а **говорити** ним у розмові — не обовʼязково.

## Правильні дієслова: корінь + te

Слабкі (правильні) дієслова утворюють Präteritum за формулою **корінь + -te + закінчення**. Приставки *ge-* немає, Ablaut-а немає: корінь не змінюється.

| Особа | machen | arbeiten | Закінчення |
|---|---|---|---|
| ich | mach**te** | arbeit**ete** | -te |
| du | mach**test** | arbeit**etest** | -test |
| er / sie / es | mach**te** | arbeit**ete** | -te |
| wir | mach**ten** | arbeit**eten** | -ten |
| ihr | mach**tet** | arbeit**etet** | -tet |
| sie / Sie | mach**ten** | arbeit**eten** | -ten |

> [!diagram] Слабке дієслово: інфінітив → корінь → -te → особа
> ```yaml
> layout: flow
> nodes:
>   - { id: inf, label: "інфінітив", text: "machen · arbeiten · öffnen", tone: gray }
>   - { id: stem, label: "корінь", text: "mach- · arbeit- · öffn-", tone: yellow }
>   - { id: te, label: "-te (або -ete)", text: "machte · arbeitete · öffnete", tone: pink }
>   - { id: end, label: "особа", text: "du machtest · wir arbeiteten", tone: gray }
> edges:
>   - { from: inf, to: stem, label: "прибираємо -en" }
>   - { from: stem, to: te, label: "додаємо" }
>   - { from: te, to: end, label: "закінчення" }
> steps:
>   - { focus: inf, note: "Беремо інфінітив і прибираємо -en: mach-, arbeit-, öffn-." }
>   - { focus: stem, note: "Корінь у слабких дієсловах не змінюється, умлаута чи нової голосної немає." }
>   - { focus: te, note: "Додаємо -te. Якщо корінь закінчується на -t, -d або на приголосну + -n / -m (arbeit-, bad-, öffn-, atm-, regn-), вставляємо -e-, щоб слово можна було вимовити: arbeitete, badete, öffnete, atmete, regnete." }
>   - { focus: end, note: "Закінчення такі самі, як у hatte: ich / er — без закінчення, du -st, wir / sie -n, ihr -t." }
> ```
> Без вставного -e- обходяться корені на -l, -r, -n після голосної та інші: *lernte, wohnte, spielte, kaufte*. Вставка потрібна після -t, -d та після -m / -n, що стоять за іншою приголосною.

Слабкі дієслова вживаються так: *Sie **wohnte** damals in Hamburg. Wir **kauften** das Brot beim Bäcker. Der Wolf **klopfte** an die Tür.* Невідокремлювані префікси (*be-, ver-, er-, ent-, zer-*) на Präteritum не впливають: *besuchte, verzauberte, entdeckte.*

## Неправильні дієслова: нова голосна

Сильні дієслова змінюють голосну кореня (Ablaut) і мають **нульове закінчення в 1-й і 3-й особі однини**: *ich ging, er ging*. Інші особи: *du gingst, wir gingen, ihr gingt, sie gingen*. Після кореня на -d або -t додається -e-: *du fandest, du hieltest.*

| Особа | gehen | sehen | finden |
|---|---|---|---|
| ich | ging | sah | fand |
| du | gingst | sahst | fandest |
| er / sie / es | ging | sah | fand |
| wir | gingen | sahen | fanden |
| ihr | gingt | saht | fandet |
| sie / Sie | gingen | sahen | fanden |

Форми Präteritum не вгадати, їх **вчать**. Ось найчастіші з них; **(ist)** означає, що Perfekt утворюється з *sein*.

| Група | Інфінітив — Präteritum |
|---|---|
| ei – ie | bleiben – blieb (ist) · schreiben – schrieb · steigen – stieg (ist) · heißen – hieß |
| ei – i | schneiden – schnitt · reiten – ritt (ist) · streiten – stritt |
| ie – o | fliegen – flog (ist) · ziehen – zog · verlieren – verlor · schließen – schloss |
| i – a | finden – fand · trinken – trank · singen – sang · springen – sprang (ist) · gewinnen – gewann · beginnen – begann |
| e – a | geben – gab · essen – aß · lesen – las · sehen – sah · sprechen – sprach · nehmen – nahm · treffen – traf · helfen – half |
| a – u | fahren – fuhr (ist) · tragen – trug · wachsen – wuchs (ist) · schlagen – schlug |
| a / au / u – ie | schlafen – schlief · laufen – lief (ist) · fallen – fiel (ist) · halten – hielt · lassen – ließ · rufen – rief |
| інші | gehen – ging (ist) · kommen – kam (ist) · stehen – stand · liegen – lag · sitzen – saß · tun – tat · werden – wurde (ist) · bitten – bat |

### Змішані дієслова

Невелика група змінює голосну **і** додає -te, як слабкі: *denken – dachte, kennen – kannte, nennen – nannte, bringen – brachte, wissen – wusste, rennen – rannte (ist), brennen – brannte.* Закінчення особи ті самі: *du dachtest, wir brachten, ihr wusstet.*

> [!tip] Як відрізнити слабке від сильного
> Якщо Präteritum закінчується на **-te** — це слабке або змішане дієслово (*machte, dachte*). Якщо корінь змінив голосну і закінчення в 1-й особі немає — сильне (*ging, sah*). Щоб не помилитися, дивися на три форми в словнику: *gehen – ging – gegangen*.

## Відокремлювані дієслова в Präteritum

Структура речення така, як у Präsens: **дієслово на другому місці, префікс — у кінці**. А в підрядному реченні префікс і дієслово зливаються на кінці.

| Тип речення | Приклад |
|---|---|
| головне | Die Prinzessin **stand** früh **auf**. — Принцеса рано встала. |
| головне з обставиною | Plötzlich **verschwand** die Hexe. — Раптом відьма зникла. |
| підрядне | Er blieb im Bett, weil er nicht **aufstand**. — Він лишався в ліжку, бо не вставав. |

Зверни увагу: у підрядному реченні *weil er nicht **aufstand*** префікс прикріплюється до дієслова, як в інфінітиві. Про такі речення — тема A2-11.

## Один текст — один час

У одній оповіді стежимо за часом: якщо почав у Präteritum, то й продовжуй. Perfekt у такому тексті зазвичай з’являється в двох випадках: коли йдеться про подію **раніше** за основну лінію оповіді (для цього є Plusquamperfekt, тема B1-02) або коли оповідач звертається до читача (*Ich habe es selbst gesehen*). У прямій мові персонажів — свій час: *„Ich habe Hunger!", rief der Wolf.*

## Приклади

- Es war einmal eine Prinzessin, die wohnte in einem großen Schloss. — Жила-була принцеса, яка мешкала у великому замку.
- Eines Tages ging sie in den Wald und verirrte sich. — Одного дня вона пішла в ліс і заблукала.
- Plötzlich kam ein Wolf und fragte: „Wohin gehst du?" — Раптом з’явився вовк і спитав: «Куди ти йдеш?»
- Der Jäger hörte einen Schrei und rannte zum Haus. — Мисливець почув крик і побіг до хати.
- Die Hexe verzauberte den Prinzen, aber das Mädchen rettete ihn. — Відьма зачарувала принца, але дівчина його врятувала.
- Gestern las ich einen Artikel über die Brüder Grimm. — Вчора я прочитав статтю про братів Грімм.
- Die Polizei fand den Dieb am Bahnhof. — Поліція знайшла злодія на вокзалі.
- Wir fuhren im Sommer nach Italien und blieben zwei Wochen. — Влітку ми поїхали до Італії і пробули там два тижні.
- Er dachte lange nach, dann schrieb er die Antwort. — Він довго думав, потім написав відповідь.
- Die Königin befahl, den Zauberer zu suchen. — Королева наказала шукати чарівника.

## Слова

> [!word] das Präteritum
> ipa: /pʁɛˈteːʁitʊm/ · pos: noun · level: B1 · id: de-b1-praeteritum-w01
> uk: претерит; проста форма минулого часу
> forms: die Präterita
> example: In Romanen steht das **Präteritum**. — У романах стоїть претерит.
> note: також das Imperfekt. Походить від лат. praeteritum — «минулий».

> [!word] die Erzählung
> ipa: /ɛɐ̯ˈtsɛːlʊŋ/ · pos: noun · level: B1 · id: de-b1-praeteritum-w02
> uk: оповідь; розповідь; оповідання
> forms: die Erzählungen
> example: Die **Erzählung** beginnt mit einem Traum. — Оповідання починається зі сну.
> note: від erzählen. -ung → die, без винятків.

> [!word] der Erzähler
> ipa: /ɛɐ̯ˈtsɛːlɐ/ · pos: noun · level: B1 · id: de-b1-praeteritum-w03
> uk: оповідач; розповідач
> forms: die Erzähler
> example: Der **Erzähler** kennt die Gedanken der Hexe. — Оповідач знає думки відьми.
> note: жінка — die Erzählerin, die Erzählerinnen.

> [!word] die Vergangenheit
> ipa: /fɛɐ̯ˈɡaŋənhaɪ̯t/ · pos: noun · level: B1 · id: de-b1-praeteritum-w04
> uk: минуле; минулий час
> forms: — (без множини)
> example: Das **Präteritum** ist eine Zeit der **Vergangenheit**. — Претерит — це час минулого.
> note: -heit → die. У граматиці: die Vergangenheit = Perfekt, Präteritum, Plusquamperfekt.

> [!word] es war einmal
> ipa: /ɛs vaːɐ̯ ˈaɪ̯nmaːl/ · pos: phrase · level: B1 · id: de-b1-praeteritum-w05
> uk: жив-був; колись давно
> example: **Es war einmal** ein armer Müller. — Жив-був бідний мірошник.
> note: традиційний початок казки. Закінчення казок: «Und wenn sie nicht gestorben sind, dann leben sie noch heute».

> [!word] eines Tages
> ipa: /ˈaɪ̯nəs ˈtaːɡəs/ · pos: phrase · level: B1 · id: de-b1-praeteritum-w06
> uk: одного дня
> example: **Eines Tages** stand ein Fremder vor der Tür. — Одного дня біля дверей стояв незнайомець.
> note: Genitiv: eines Tages (див. B1-03). Теж: eines Morgens, eines Abends.

> [!word] plötzlich
> ipa: /ˈplœtslɪç/ · pos: adv · level: A2 · id: de-b1-praeteritum-w07
> uk: раптом; несподівано
> example: **Plötzlich** klopfte es an der Tür. — Раптом хтось постукав у двері.
> note: ö → [œ] коротке, tz = [ts]. Обставина часу: Plötzlich kam ein Wolf = дієслово на 2-му місці.

> [!word] endlich
> ipa: /ˈɛntlɪç/ · pos: adv · level: A2 · id: de-b1-praeteritum-w08
> uk: нарешті
> example: Nach zwei Stunden kam **endlich** der Bus. — Через дві години нарешті приїхав автобус.
> note: endlich = після довгого чекання. schließlich — «зрештою» як результат.

> [!word] sofort
> ipa: /zoˈfɔʁt/ · pos: adv · level: A2 · id: de-b1-praeteritum-w09
> uk: негайно; одразу
> example: Der König befahl, **sofort** zu gehen. — Король наказав негайно вирушати.
> note: наголос на -fort; s на початку — дзвінке [z].

> [!word] inzwischen
> ipa: /ɪnˈtsvɪʃn̩/ · pos: adv · level: B1 · id: de-b1-praeteritum-w10
> uk: тим часом; вже; за цей час
> example: Die Hexe schlief. **Inzwischen** schlich sich das Mädchen aus dem Haus. — Відьма спала. Тим часом дівчина викралася з дому.
> note: схоже: mittlerweile (теж «тим часом / вже»).

> [!word] am Ende
> ipa: /am ˈɛndə/ · pos: phrase · level: A2 · id: de-b1-praeteritum-w11
> uk: наприкінці; зрештою
> example: **Am Ende** heiratete die Prinzessin den Prinzen. — Зрештою принцеса вийшла заміж за принца.
> note: das Ende, die Enden. Усталено: zum Schluss; am Ende des Tages = «зрештою, за великим рахунком».

> [!word] arm
> ipa: /aʁm/ · pos: adj · level: A2 · id: de-b1-praeteritum-w12
> uk: бідний
> forms: ärmer · am ärmsten
> example: Der **arme** Müller hatte drei Söhne. — У бідного мірошника було три сини.
> note: не плутай з der Arm — «рука»; різниця лише в контексті й артиклі.

> [!word] reich
> ipa: /ʁaɪ̯ç/ · pos: adj · level: A2 · id: de-b1-praeteritum-w13
> uk: багатий
> forms: reicher · am reichsten
> example: Der **reiche** König gab ein großes Fest. — Багатий король влаштував велике свято.
> note: reich + an (+ Dat): reich an Ideen — багатий на ідеї. ch після ei = [ç].

> [!word] schlau
> ipa: /ʃlaʊ̯/ · pos: adj · level: B1 · id: de-b1-praeteritum-w14
> uk: хитрий; кмітливий
> forms: schlauer · am schlausten
> example: Der **schlaue** Fuchs fand einen Ausweg. — Хитрий лис знайшов вихід.
> note: може звучати і схвально («кмітливий»), і з відтінком «хитрий». sch- = «ш».

> [!word] neidisch
> ipa: /ˈnaɪ̯dɪʃ/ · pos: adj · level: B1 · id: de-b1-praeteritum-w15
> uk: заздрісний
> example: Die Stiefschwestern waren **neidisch** auf Aschenputtel. — Зведені сестри заздрили Попелюшці.
> note: neidisch sein auf (+ Akk). Іменник: der Neid — заздрість (без множини).

> [!word] tapfer
> ipa: /ˈtapfɐ/ · pos: adj · level: B2 · id: de-b1-praeteritum-w16
> uk: хоробрий; відважний
> forms: tapferer · am tapfersten
> example: Der **tapfere** Schneider besiegte sieben auf einen Streich. — Хоробрий кравчик здолав сімох одним ударом.
> note: pf = [pf], вимовляємо разом, як один звук. Синонім: mutig.

> [!word] der König
> ipa: /ˈkøːnɪç/ · pos: noun · level: A2 · id: de-b1-praeteritum-w17
> uk: король
> forms: die Könige
> example: Der **König** hatte drei Töchter. — У короля було три доньки.
> note: жінка — die Königin /ˈkøːnɪɡɪn/, die Königinnen. -ig на кінці = [ɪç], але перед -in — [ɪɡ].

> [!word] der Prinz
> ipa: /pʁɪnts/ · pos: noun · level: B1 · id: de-b1-praeteritum-w18
> uk: принц
> forms: die Prinzen
> example: Der **Prinz** suchte die schönste Frau im Land. — Принц шукав найгарнішу жінку в країні.
> note: слабка відміна: den Prinzen (Akk), dem Prinzen (Dat). z = [ts].

> [!word] die Prinzessin
> ipa: /pʁɪnˈtsɛsɪn/ · pos: noun · level: B1 · id: de-b1-praeteritum-w19
> uk: принцеса
> forms: die Prinzessinnen
> example: Die **Prinzessin** wohnte in einem Turm. — Принцеса жила у вежі.
> note: наголос на -zess-. Не утворюється від Prinz звичайним -in (Prinz-ess-in).

> [!word] die Hexe
> ipa: /ˈhɛksə/ · pos: noun · level: B1 · id: de-b1-praeteritum-w20
> uk: відьма
> forms: die Hexen
> example: Die **Hexe** lebte tief im Wald. — Відьма жила глибоко в лісі.
> note: x = [ks]. Чоловік: der Hexer — рідко.

> [!word] der Wolf
> ipa: /vɔlf/ · pos: noun · level: A2 · id: de-b1-praeteritum-w21
> uk: вовк
> forms: die Wölfe
> example: Der **Wolf** lief zum Haus der Großmutter. — Вовк побіг до хати бабусі.
> note: w = «в»; Plural з умлаутом: Wölfe.

> [!word] der Jäger
> ipa: /ˈjɛːɡɐ/ · pos: noun · level: B1 · id: de-b1-praeteritum-w22
> uk: мисливець
> forms: die Jäger
> example: Der **Jäger** hörte das laute Schnarchen. — Мисливець почув гучне хропіння.
> note: жінка — die Jägerin. j = [j] як українське «й»; ä довге: «є̄» як у «день», розтягнуто.

> [!word] die Großmutter
> ipa: /ˈɡʁoːsˌmʊtɐ/ · pos: noun · level: A2 · id: de-b1-praeteritum-w23
> uk: бабуся
> forms: die Großmütter
> example: Die **Großmutter** war krank und lag im Bett. — Бабуся була хвора й лежала в ліжку.
> note: розм. Oma; AT, CH: Großmutter / Grosi (CH). Мʼяка форма: Großmütterchen.

> [!word] der Zwerg
> ipa: /tsvɛʁk/ · pos: noun · level: B1 · id: de-b1-praeteritum-w24
> uk: гном; карлик
> forms: die Zwerge
> example: Sieben **Zwerge** wohnten hinter den sieben Bergen. — Сім гномів жили за сімома горами.
> note: zw- = [tsv]; g у кінці = [k].

> [!word] der Riese
> ipa: /ˈʁiːzə/ · pos: noun · level: B1 · id: de-b1-praeteritum-w25
> uk: велетень
> forms: die Riesen
> example: Der **Riese** warf einen Stein ins Tal. — Велетень кинув камінь у долину.
> note: слабка відміна: den Riesen. Жінка — die Riesin. Також прикметник riesig — «величезний».

> [!word] der Zauber
> ipa: /ˈtsaʊ̯bɐ/ · pos: noun · level: B2 · id: de-b1-praeteritum-w26
> uk: чари; магія; чарівність
> forms: — (без множини)
> example: Der **Zauber** wirkte nicht mehr. — Чари більше не діяли.
> note: der Zauberer — «чарівник», die Zauberin. z = [ts].

> [!word] der Brunnen
> ipa: /ˈbʁʊnən/ · pos: noun · level: B1 · id: de-b1-praeteritum-w27
> uk: криниця; фонтан
> forms: die Brunnen
> example: Das Mädchen warf den goldenen Ball in den **Brunnen**. — Дівчинка кинула золотий м’яч у криницю.
> note: тут -nn- → коротке u. Фонтан у місті — також Brunnen.

> [!word] die Stiefmutter
> ipa: /ˈʃtiːfˌmʊtɐ/ · pos: noun · level: B2 · id: de-b1-praeteritum-w28
> uk: мачуха
> forms: die Stiefmütter
> example: Die **Stiefmutter** war böse zu Aschenputtel. — Мачуха була зла до Попелюшки.
> note: der Stiefvater, die Stiefkinder; в казках Stiefmutter — майже завжди зла героїня.

> [!word] verzaubern
> ipa: /fɛɐ̯ˈtsaʊ̯bɐn/ · pos: verb · level: B2 · id: de-b1-praeteritum-w29
> uk: зачаровувати; перетворювати за допомогою чарів
> forms: verzaubern → verzauberte → hat verzaubert
> example: Die Hexe **verzauberte** den Prinzen in einen Frosch. — Відьма зачарувала принца в жабу.
> note: ver- ненаголошений. Син.: verhexen.

> [!word] verwandeln
> ipa: /fɛɐ̯ˈvandl̩n/ · pos: verb · level: B2 · id: de-b1-praeteritum-w30
> uk: перетворювати
> forms: verwandeln → verwandelte → hat verwandelt
> example: Der Zauberer **verwandelte** den Stein in Gold. — Чарівник перетворив камінь на золото.
> note: verwandeln in (+ Akk); sich verwandeln — перетворитися.

> [!word] fressen
> ipa: /ˈfʁɛsn̩/ · pos: verb · level: B1 · id: de-b1-praeteritum-w31
> uk: жерти; їсти (про тварин)
> forms: fressen → fraß → hat gefressen
> example: Der Wolf **fraß** die Großmutter. — Вовк зʼїв бабусю.
> note: er frisst. Про людей — essen; fressen про людину — грубо.

> [!word] retten
> ipa: /ˈʁɛtn̩/ · pos: verb · level: B1 · id: de-b1-praeteritum-w32
> uk: рятувати
> forms: retten → rettete → hat gerettet
> example: Der Jäger **rettete** das Mädchen. — Мисливець урятував дівчинку.
> note: retten vor (+ Dat): vor dem Wolf retten. Вставне -e-: rettete.

> [!word] befehlen
> ipa: /bəˈfeːlən/ · pos: verb · level: B1 · id: de-b1-praeteritum-w33
> uk: наказувати
> forms: befehlen → befahl → hat befohlen
> example: Der König **befahl**, das Tor zu schließen. — Король наказав зачинити браму.
> note: er befiehlt (e → ie). befehlen + Dat: Er befahl dem Diener. der Befehl — «наказ».

> [!word] schlagen
> ipa: /ˈʃlaːɡn̩/ · pos: verb · level: B1 · id: de-b1-praeteritum-w34
> uk: бити; ударяти
> forms: schlagen → schlug → hat geschlagen
> example: Er **schlug** an die Tür. — Він ударив у двері.
> note: er schlägt. Усталено: Der Blitz schlug in den Baum ein.

> [!word] werfen
> ipa: /ˈvɛʁfn̩/ · pos: verb · level: B1 · id: de-b1-praeteritum-w35
> uk: кидати
> forms: werfen → warf → hat geworfen
> example: Sie **warf** den Ring in den Fluss. — Вона кинула перстень у річку.
> note: er wirft. Не плутай із werden (став) — wurde.

> [!word] sich verstecken
> ipa: /zɪç fɛɐ̯ˈʃtɛkn̩/ · pos: verb · level: B1 · id: de-b1-praeteritum-w36
> uk: ховатися
> forms: sich verstecken → versteckte sich → hat sich versteckt
> example: Das Kind **versteckte sich** hinter dem Baum. — Дитина сховалася за деревом.
> note: sich verstecken vor (+ Dat). Перехідне: etwas verstecken — ховати щось.

> [!word] klopfen
> ipa: /ˈklɔpfn̩/ · pos: verb · level: B1 · id: de-b1-praeteritum-w37
> uk: стукати
> forms: klopfen → klopfte → hat geklopft
> example: Es **klopfte** an der Tür. — У двері постукали.
> note: Es klopft — безособове «хтось стукає». an die Tür klopfen — ставимо Akk; an der Tür — про місце (Dat).

> [!word] erschrecken
> ipa: /ɛɐ̯ˈʃʁɛkn̩/ · pos: verb · level: B2 · id: de-b1-praeteritum-w38
> uk: злякатися (непер.); налякати (пер.)
> forms: erschrecken → erschrak → ist erschrocken
> example: Das Mädchen **erschrak**, als es den Wolf sah. — Дівчинка злякалася, коли побачила вовка.
> note: er erschrickt. Перехідне «налякати» — слабке: erschreckte, hat erschreckt.

> [!word] entdecken
> ipa: /ɛntˈdɛkn̩/ · pos: verb · level: B1 · id: de-b1-praeteritum-w39
> uk: відкривати; помічати
> forms: entdecken → entdeckte → hat entdeckt
> example: Sie **entdeckte** eine kleine Hütte im Wald. — Вона помітила маленьку хатину в лісі.
> note: die Entdeckung — відкриття. Більш побутове: finden.

> [!word] verschwinden
> ipa: /fɛɐ̯ˈʃvɪndn̩/ · pos: verb · level: B1 · id: de-b1-praeteritum-w40
> uk: зникати
> forms: verschwinden → verschwand → ist verschwunden
> example: Plötzlich **verschwand** der Zauberer. — Раптом чарівник зник.
> note: Perfekt з sein (зміна стану). sch-: «ш».

> [!word] sich verirren
> ipa: /zɪç fɛɐ̯ˈʔɪʁən/ · pos: verb · level: B2 · id: de-b1-praeteritum-w41
> uk: заблукати
> forms: sich verirren → verirrte sich → hat sich verirrt
> example: Im Wald **verirrte** sich das Mädchen. — У лісі дівчинка заблукала.
> note: у розмові часто: Ich habe mich verlaufen / verfahren. Перед голосним I після префікса — легкий твердий приступ.

> [!word] reiten
> ipa: /ˈʁaɪ̯tn̩/ · pos: verb · level: B1 · id: de-b1-praeteritum-w42
> uk: їхати верхи
> forms: reiten → ritt → ist geritten
> example: Der Prinz **ritt** durch den Wald. — Принц їхав верхи лісом.
> note: haben, коли йдеться про заняття (Sie hat als Kind viel geritten); sein — з напрямком.

> [!word] schreien
> ipa: /ˈʃʁaɪ̯ən/ · pos: verb · level: B1 · id: de-b1-praeteritum-w43
> uk: кричати
> forms: schreien → schrie → hat geschrien
> example: Das Kind **schrie** laut um Hilfe. — Дитина голосно кричала, кличучи на допомогу.
> note: der Schrei — «крик». Різниця: rufen — просто гукати, schreien — вигукувати голосно.

> [!word] flüstern
> ipa: /ˈflʏstɐn/ · pos: verb · level: B2 · id: de-b1-praeteritum-w44
> uk: шепотіти
> forms: flüstern → flüsterte → hat geflüstert
> example: „Komm leise", **flüsterte** die Mutter. — «Ходи тихо», — прошепотіла мати.
> note: ü коротке, губи трубочкою. Протилежність: schreien.

> [!word] kämpfen
> ipa: /ˈkɛmpfn̩/ · pos: verb · level: B1 · id: de-b1-praeteritum-w45
> uk: боротися; воювати
> forms: kämpfen → kämpfte → hat gekämpft
> example: Der Ritter **kämpfte** gegen den Drachen. — Лицар боровся з драконом.
> note: kämpfen gegen (+ Akk) / für (+ Akk) / um (+ Akk). mpf — читаємо «мпф», разом.

## Слухаємо

> [!listen] Що ти почув?
> level: B1 · type: choice · id: de-b1-praeteritum-l01
> audio: Die Hexe verzauberte den Prinzen.
> - [ ] Die Hexe verzaubert den Prinzen.
> - [x] Die Hexe verzauberte den Prinzen.
> - [ ] Die Hexe hat den Prinzen verzaubert.

> [!listen] Що ти почув?
> level: B1 · type: choice · id: de-b1-praeteritum-l02
> audio: Wir fuhren im Sommer nach Italien.
> - [ ] Wir fahren im Sommer nach Italien.
> - [ ] Wir sind im Sommer nach Italien gefahren.
> - [x] Wir fuhren im Sommer nach Italien.

> [!listen] Напиши або скажи, що почув
> level: B1 · type: dictation · id: de-b1-praeteritum-l03
> audio: Plötzlich klopfte es an der Tür.
> explain: klopfte — слабке дієслово, Präteritum із закінченням -te. es — безособовий підмет.

> [!listen] Напиши або скажи, що почув
> level: B1 · type: dictation · id: de-b1-praeteritum-l04
> audio: Die Prinzessin stand früh auf und ging in den Wald.
> explain: stand … auf — відокремлюваний префікс у кінці речення; ging — сильне дієслово без закінчення в 3-й особі.

> [!listen] Послухай уривок казки. Куди пішла дівчинка?
> level: B1 · type: answer · id: de-b1-praeteritum-l05
> audio: Es war einmal ein kleines Mädchen. Eines Tages schickte die Mutter es zur Großmutter. Im Wald begegnete das Mädchen einem Wolf. Der Wolf fragte freundlich: Wohin gehst du denn?
> - [x] до бабусі
> - [ ] до мисливця
> - [ ] до школи
>
> **Пояснення:** *schickte die Mutter es zur Großmutter* — мати відправила дівчинку до бабусі. *Zur Großmutter* = *zu der Großmutter*.

> [!listen] Послухай розмову. Що розповідає Ліна?
> level: B1 · type: answer · id: de-b1-praeteritum-l06
> audio: A: Na, Lina, wie war dein Urlaub?
> audio: B: Super! Wir sind nach Hamburg gefahren und haben viel gesehen. Aber am ersten Tag regnete es den ganzen Tag.
> audio: A: Oh nein! Und dann?
> audio: B: Dann schien endlich die Sonne, und wir machten eine Hafenrundfahrt.
> - [ ] Вони залишилися вдома.
> - [x] Вони поїхали до Гамбурга; перший день був дощовий, потім з’явилося сонце.
> - [ ] Вони поїхали на гори й пережили сильний шторм.
>
> **Пояснення:** Лина говорить у розмові, тому спочатку Perfekt (*sind gefahren, haben gesehen*), але *regnete, schien, machten* вони чують у Präteritum, бо це розповідь про погоду й подію. У живій мові обидва часи змішуються.

## Вимова

У Präteritum наголос — на корені, а закінчення -te, -ten, -test вимовляємо коротко й нечітко: [tə], [tn̩], [təst]. Слабкі дієслова: *machte* [ˈmaxtə], *arbeitete* [ˈaʁbaɪ̯tətə]. Сильні: голосна змінюється, довгота важлива: *sah* [zaː], *saß* [zaːs], *ging* [ɡɪŋ].

> [!speak] Скажи вголос
> level: B1 · id: de-b1-praeteritum-s01
> text: Es war einmal ein König, der hatte drei Töchter.
> ipa: /ɛs vaːɐ̯ ˈaɪ̯nmaːl aɪ̯n ˈkøːnɪç deːɐ̯ ˈhatə dʁaɪ̯ ˈtœçtɐ/
> tip: König — g у кінці слова після і звучить як [ç]. Töchter — ö коротке, ch після ö = [ç].
> uk: Жив-був король, у якого було три доньки.

> [!speak] Скажи вголос
> level: B1 · id: de-b1-praeteritum-s02
> text: Eines Tages ging sie in den Wald und verirrte sich.
> ipa: /ˈaɪ̯nəs ˈtaːɡəs ɡɪŋ ziː ɪn deːn valt ʊnt fɛɐ̯ˈʔɪʁtə zɪç/
> tip: ging — [ŋ] як в «банк», без [ɡ] окремо. Wald — d в кінці = [t]. verirrte — легкий твердий приступ перед «і».
> uk: Одного дня вона пішла в ліс і заблукала.

> [!speak] Скажи вголос
> level: B1 · id: de-b1-praeteritum-s03
> text: Plötzlich klopfte es an der Tür.
> ipa: /ˈplœtslɪç ˈklɔpftə ɛs an deːɐ̯ tyːɐ̯/
> tip: pf в klopfte вимовляємо як один звук [pf]. Tür — ü довге: губи для «у», язик для «і».
> uk: Раптом постукали у двері.

> [!speak] Скажи вголос
> level: B1 · id: de-b1-praeteritum-s04
> text: Der Wolf fraß die Großmutter und legte sich ins Bett.
> ipa: /deːɐ̯ vɔlf fʁaːs diː ˈɡʁoːsˌmʊtɐ ʊnt ˈleːktə zɪç ɪns bɛt/
> tip: fraß — довге [aː], ß = [s]. legte — g перед t звучить як [k]: [ˈleːktə].
> uk: Вовк зʼїв бабусю й ліг у її ліжко.

> [!speak] Скажи вголос
> level: B1 · id: de-b1-praeteritum-s05
> text: Der Jäger rettete beide.
> ipa: /deːɐ̯ ˈjɛːɡɐ ˈʁɛtətə ˈbaɪ̯də/
> tip: Jäger — j = [j] («й»), ä довге. rettete — два «т» і вставне -e-: [ˈʁɛtətə].
> uk: Мисливець урятував обох.

> [!speak] «Вчора я читав статтю про братів Грімм.»
> level: B1 · id: de-b1-praeteritum-s06
> text: Gestern las ich einen Artikel über die Brüder Grimm.
> ipa: /ˈɡɛstɐn laːs ɪç ˈaɪ̯nən aʁˈtiːkl̩ ˈyːbɐ diː ˈbʁyːdɐ ɡʁɪm/
> tip: las — довге [aː]. ü у Brüder довге. Grimm — [ɡʁɪm], коротке і, мм = один звук.
> uk: Вчора я читав статтю про братів Грімм.

## Типові помилки українців

> [!pitfall] Слабке закінчення сильним дієсловам: «ich gehte», «er kommte», «sie sehte»
> Хочеться скрізь додати до кореня -te, як у слабких дієслів. Але більшість часто вживаних дієслів — сильні: *ging, kam, sah, aß, fand*. Правильно: *ich **ging**, er **kam**, sie **sah**.* Закінчення -te мають лише слабкі дієслова (*machte, wohnte*) і змішані (*dachte, brachte*). Три форми кожного дієслова вчи разом.

> [!pitfall] Забуте вставне -e-: «er arbeitte», «es regnte» там, де потрібно «arbeitete», «regnete»
> Корінь на -t, -d або на приголосну + -n / -m не зʼєднується з -te без голосного. Тому: *arbeiten → arbeitete, warten → wartete, baden → badete, öffnen → öffnete, atmen → atmete, regnen → regnete*. Коротку форму *regnte* вимовити важко, тож правило працює на користь вимови.

> [!pitfall] Префікс на неправильному місці: «Er aufstand früh»
> У головному реченні Präteritum відокремлюваний префікс іде **в кінець**: *Er stand früh **auf**.* Ставимо префікс біля дієслова лише в підрядному реченні: *…, weil er früh **aufstand**.* Українською префікс завжди стоїть при дієслові (встав), тому звичка тягне до помилки.

> [!pitfall] Präteritum скрізь, навіть у чаті: «Gestern ging ich ins Kino und aß Pizza» у розмові з колегою
> Граматично це правильно, але в усній розмові (особливо на півдні) звучить як уривок з книжки. У розмові, SMS і чаті про минуле кажи **Perfekt**: *Gestern bin ich ins Kino gegangen und habe Pizza gegessen.* Präteritum залиш для письмової оповіді, а *war, hatte, konnte, musste* уживай у розмові скрізь.

## Ситуація: казка на ніч

> [!listen] Послухай, як мама читає казку. Хто врятував героїню?
> level: B1 · type: answer · id: de-b1-praeteritum-l07
> audio: A: Mama, erzähl bitte noch einmal das Märchen von Rotkäppchen!
> audio: B: Gut. Es war einmal ein kleines Mädchen. Der Wolf fraß die Großmutter und auch das Mädchen. Aber ein Jäger kam vorbei, hörte das laute Schnarchen und rettete beide.
> audio: A: Und der Wolf?
> audio: B: Der bekam seine Strafe.
> - [ ] Бабуся сама
> - [x] Мисливець
> - [ ] Мама дівчинки
>
> **Пояснення:** *Aber ein Jäger kam vorbei … und rettete beide* — мисливець. Після *erzähl bitte* мама читає казку, тому весь текст — у Präteritum.

> [!speak] «Розкажи ще раз казку про Червону Шапочку!»
> level: B1 · id: de-b1-praeteritum-s07
> text: Erzähl bitte noch einmal das Märchen von Rotkäppchen!
> ipa: /ɛɐ̯ˈtsɛːl ˈbɪtə nɔx ˈaɪ̯nmaːl das ˈmɛːɐ̯çən fɔn ˈʁoːtˌkɛpçən/
> tip: Märchen — ä довге, потім [ç] у -chen. Rotkäppchen — ä коротке (пп), потім [ç]. -chen завжди [çən], ніколи [xən].
> uk: Розкажи, будь ласка, ще раз казку про Червону Шапочку!

## Landeskunde: die Brüder Grimm und Rotkäppchen

Брати **Якоб (1785–1863)** і **Вільгельм Грімм (1786–1859)** — філологи, які зібрали німецькі казки. Перший том їхнього збірника *Kinder- und Hausmärchen* вийшов 1812 року, другий — 1815-го. До 1857 року вийшло сім видань. Ось адаптований уривок казки, як її пишуть у Präteritum.

> [!example] Rotkäppchen (адаптований текст)
> Es war einmal ein kleines Mädchen. Alle liebten es, besonders seine Großmutter. Sie schenkte ihm eine rote Kappe, und deshalb nannte man das Mädchen Rotkäppchen. Eines Tages sagte die Mutter: „Bring der Großmutter Kuchen und Wein. Sie ist krank. Aber geh nicht vom Weg ab!" Im Wald begegnete Rotkäppchen dem Wolf. Er fragte freundlich, wohin es ging, und das Mädchen erzählte ihm alles. Der Wolf lief schnell zum Haus der Großmutter, klopfte an und fraß die alte Frau. Dann legte er sich in ihr Bett. Als Rotkäppchen ankam, wunderte es sich über die großen Ohren und den großen Mund. Zum Schluss kam ein Jäger vorbei, hörte das Schnarchen und rettete beide.

> [!quiz] Nach dem Text: Warum nannte man das Mädchen Rotkäppchen?
> level: B1 · type: single · id: de-b1-praeteritum-q02
> - [ ] Weil es immer rote Kleider trug.
> - [x] Weil die Großmutter ihm eine rote Kappe schenkte.
> - [ ] Weil die Mutter es so nannte, als es klein war.
> - [ ] Weil es im Wald rote Pilze fand.
>
> **Пояснення:** у тексті: *Sie schenkte ihm eine rote Kappe, und deshalb nannte man das Mädchen Rotkäppchen.* Про одяг, грибів і матір у тексті нічого немає.

> [!quiz] Was machte der Wolf zuerst im Haus der Großmutter?
> level: B1 · type: single · id: de-b1-praeteritum-q03
> - [ ] Er legte sich ins Bett und schlief.
> - [x] Er klopfte an und fraß die Großmutter.
> - [ ] Er fraß zuerst Rotkäppchen.
> - [ ] Er rief den Jäger.
>
> **Пояснення:** послідовність у тексті: *lief schnell zum Haus, klopfte an und fraß die alte Frau. Dann legte er sich in ihr Bett.* Спочатку він зʼїв бабусю, потім ліг у ліжко.

> [!quiz] Nach dem Text: Wer rettete Rotkäppchen und die Großmutter?
> level: B1 · type: single · id: de-b1-praeteritum-q04
> - [ ] die Mutter
> - [ ] der Wolf selbst
> - [x] ein Jäger
> - [ ] ein Nachbar
>
> **Пояснення:** *Zum Schluss kam ein Jäger vorbei, hörte das Schnarchen und rettete beide.*

*Для допитливих.* Казка про Червону Шапочку має французького попередника: Шарль Перро записав її 1697 року. У Грімм вона стоїть під номером 26 (*KHM 26*) першого тому 1812 року. А 2005 року ЮНЕСКО внесло в Реєстр «Памʼять світу» (*Weltdokumentenerbe*) їхні робочі екземпляри збірника з рукописними нотатками.

## Практика

> [!quiz] Яка форма Präteritum від *gehen* для *ich*?
> level: B1 · type: single · id: de-b1-praeteritum-q05
> - [ ] gehte
> - [x] ging
> - [ ] gegangen
> - [ ] gang
>
> **Пояснення:** *gehen* — сильне дієслово: *ging*. *Gehte* — типова помилка (слабке закінчення), *gegangen* — Partizip II (для Perfekt), *gang* такої форми немає.

> [!quiz] Du ___ gestern bis spät in die Nacht. (machen → Präteritum, du)
> level: B1 · type: single · id: de-b1-praeteritum-q06
> - [ ] machtst
> - [x] machtest
> - [ ] machten
> - [ ] gemacht
>
> **Пояснення:** закінчення 2-ї особи однини — **-test**: *du machtest*. *Machtst* — випадає -e-, *machten* — форма *wir / sie*, *gemacht* — Partizip II.

> [!quiz] Er ___ den ganzen Tag im Garten. (arbeiten, Präteritum)
> level: B1 · type: single · id: de-b1-praeteritum-q07
> - [ ] arbeitte
> - [x] arbeitete
> - [ ] arbeitet
> - [ ] gearbeitet
>
> **Пояснення:** корінь *arbeit-* закінчується на -t, тому між коренем і -te потрібне -e-: *arbeitete*. *Arbeitet* — Präsens, *gearbeitet* — Partizip II.

> [!quiz] Ich ___ lange an dich. (denken, Präteritum)
> level: B1 · type: single · id: de-b1-praeteritum-q08
> - [ ] denkte
> - [x] dachte
> - [ ] gedacht
> - [ ] dachtete
>
> **Пояснення:** *denken* — змішане дієслово: нова голосна (**a**) і закінчення **-te**: *dachte*. *Denkte* — слабка помилка, *dachtete* — подвійне -te.

> [!quiz] Ihr ___ den Wolf im Wald. (sehen, Präteritum)
> level: B1 · type: single · id: de-b1-praeteritum-q09
> - [ ] sahen
> - [x] saht
> - [ ] sahst
> - [ ] seht
>
> **Пояснення:** для *ihr* — закінчення **-t**: *ihr saht*. *Sahen* — *wir / sie*, *sahst* — *du*, *seht* — Präsens.

> [!quiz] У яких текстах зазвичай стоїть Präteritum? Обери всі.
> level: B1 · type: multi · id: de-b1-praeteritum-q10
> - [x] у казці братів Грімм
> - [x] у газетному звіті про подію
> - [ ] у коротких SMS другові про вихідні
> - [ ] у розмові двох друзів за кавою
>
> **Пояснення:** Präteritum — мова письмової оповіді: казки, романи, новини. SMS і розмова за кавою — територія Perfekt (виняток — *war, hatte, konnte*).

> [!quiz] Які форми утворені правильно? Обери всі.
> level: B1 · type: multi · id: de-b1-praeteritum-q11
> - [x] ich schrieb
> - [x] wir sahen
> - [x] er brachte
> - [ ] er fandte
> - [ ] ich lasste
>
> **Пояснення:** *schreiben – schrieb, sehen – sah, bringen – brachte* (змішане). Помилки: *finden – fand* (не *fandte*), *lesen – las* (не *lasste*).

> [!quiz] Заповни пропуски формами Präteritum
> level: B1 · type: fill · id: de-b1-praeteritum-q12
>
> ```text fill
> Es [[war]] einmal ein König. Er [[hatte]] drei Töchter.
> Eines Tages [[ging]] die jüngste in den Wald und [[fand]] einen Brunnen.
> ```
>
> **Пояснення:** *sein → war*, *haben → hatte*, *gehen → ging*, *finden → fand*. Ці чотири дієслова найчастіше трапляються на початку казки.

> [!quiz] Заповни пропуски: слабкі дієслова
> level: B1 · type: fill · id: de-b1-praeteritum-q13
>
> ```text fill
> Die Hexe [[verzauberte]] den Prinzen. Das Mädchen [[rettete]] ihn.
> Der Wolf [[klopfte]] an die Tür, und die Großmutter [[öffnete]].
> ```
>
> **Пояснення:** слабкі дієслова: корінь + *-te*. Для *klopfen* і *verzaubern* — просто *-te*; для *retten* і *öffnen* (корінь на -t / приголосна + n) потрібне вставне -e-: *rettete, öffnete*.

> [!quiz] Заповни пропуски: відокремлювані дієслова
> level: B1 · type: fill · id: de-b1-praeteritum-q14
>
> ```text fill
> Die Prinzessin [[stand]] früh [[auf]].
> Sie blieb im Bett, weil sie nicht [[aufstand]].
> ```
>
> **Пояснення:** у головному реченні дієслово на 2-му місці, префікс у кінці: *stand … auf*. У підрядному (*weil …*) вони зливаються: *aufstand*.

> [!quiz] Склади речення: «Раптом зник чарівник»
> level: B1 · type: order · id: de-b1-praeteritum-q15
>
> ```text order
> Plötzlich
> verschwand
> der
> Zauberer.
> verschwunden ✗
> ```
>
> **Пояснення:** обставина → дієслово на 2-му місці → підмет. *Verschwunden* — Partizip II, потрібне лише в Perfekt з *ist*.

> [!quiz] Склади речення: «Принцеса рано встала»
> level: B1 · type: order · id: de-b1-praeteritum-q16
>
> ```text order
> Die
> Prinzessin
> stand
> früh
> auf.
> aufstand ✗
> ```
>
> **Пояснення:** у головному реченні відокремлюваний префікс іде в кінець: *stand … auf*. Форма *aufstand* можлива лише в підрядному реченні.

> [!quiz] Склади речення: «Мисливець урятував бабусю й дівчинку»
> level: B1 · type: order · id: de-b1-praeteritum-q17
>
> ```text order
> Der
> Jäger
> rettete
> die
> Großmutter
> und
> das
> Mädchen.
> hat ✗
> ```
>
> **Пояснення:** у Präteritum допоміжного дієслова немає: *rettete* стоїть на 2-му місці. *Hat … gerettet* — інша конструкція (Perfekt), і вона не поєднується з *rettete*.

## Фішки

> [!reel] 📜 Чому Märchen — це «маленька новина»
> Слово походить від давньоверхньонімецького *māri* — «новина, звістка». З нього утворилося зменшувальне *mærelīn*, «маленька історія», а потім — сучасне *Märchen*. Тобто казка — це буквально «звісточка». За словником DWDS, у значенні «казка» слово закріпилося здебільшого завдяки збірнику братів Грімм (1812).

> [!reel] 📚 Грімми писали не лише казки
> Брати Грімм розпочали 1838 року *Deutsches Wörterbuch* — найбільший словник німецької. Перший випуск вийшов 1 травня 1852 року, а завершили його лише 1961-го, через 123 роки після початку роботи: 16 томів, а з частинами — 32 томи. Казки були для Гріммів побічною справою філологів.

> [!reel] 🧭 Чому в Мюнхені «ging» звучить як з книжки
> На півдні Німеччини, в Австрії та Швейцарії Präteritum в усній мові майже зникло: німці кажуть *ich bin gegangen*. Відтак *Ich ging* там звучить літературно. А на півночі Präteritum у розмові використовують трохи частіше. Тому не дивуйся, якщо сусід з Гамбурга вживає його частіше за мюнхенського колегу.

## Джерела та що почитати

- [DWDS — Präteritum](https://www.dwds.de/wb/Pr%C3%A4teritum) — визначення й походження терміна.
- [DWDS — Märchen](https://www.dwds.de/wb/M%C3%A4rchen) — етимологія слова й роль збірника Гріммів.
- [Wikipedia — Kinder- und Hausmärchen](https://de.wikipedia.org/wiki/Kinder-_und_Hausm%C3%A4rchen) — видання 1812–1857 та нагороди збірника.
- [Wikipedia — Rotkäppchen](https://de.wikipedia.org/wiki/Rotk%C3%A4ppchen) — історія казки: Перро 1697, KHM 26.
- [Wikipedia — Deutsches Wörterbuch](https://de.wikipedia.org/wiki/Deutsches_W%C3%B6rterbuch) — словник братів Грімм, 1838–1961.
- [GRIMMWELT Kassel](https://www.grimmwelt.de/de/) — музей братів Грімм.
- [Duden — Präteritum](https://www.duden.de/rechtschreibung/Praeteritum) — граматичний довідник.

> [!important] Підсумок
> - Präteritum — час **письмової оповіді** (казка, новини, роман); у розмові зазвичай Perfekt, а *war, hatte, konnte, musste* — скрізь.
> - Слабкі: корінь + **-te** (*machte*, з вставним -e-: *arbeitete*); сильні: нова голосна, у 1-й і 3-й особі без закінчення (*ging, sah, fand*); змішані: нова голосна **і** -te (*dachte, brachte, wusste*).
> - Відокремлюваний префікс: у головному реченні в кінці (*stand … auf*), у підрядному разом (*aufstand*).
> - Три форми дієслова вчимо разом: *gehen – ging – ist gegangen*.
