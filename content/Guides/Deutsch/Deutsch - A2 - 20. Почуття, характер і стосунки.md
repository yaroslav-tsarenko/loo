---
title: Почуття, характер і стосунки
id: de-a2-gefuehle
level: A2
icon: px:heart
tags: [deutsch, a2, vocabulary, gefuehle, charakter, beziehung]
prerequisites: ["[[Deutsch - A2 - 14. Зворотні дієслова — sich freuen, sich waschen]]"]
estimatedMinutes: 40
---

# Почуття, характер і стосунки

> [!success] Після цієї теми ти зможеш
> - сказати, що ти відчуваєш: *Ich bin froh / traurig / wütend / aufgeregt. Mir ist langweilig.*;
> - запитати про настрій: *Wie fühlst du dich? Was ist los?*;
> - описати характер людини: *Er ist schüchtern, sie ist großzügig und zuverlässig.*;
> - розповісти про стосунки: *Wir haben uns gestritten und uns wieder vertragen. Sie hat sich in ihn verliebt.*

## Передбач

> [!quiz] Як сказати «Мені нудно»?
> level: A2 · type: single · id: de-a2-gefuehle-q01
> - [ ] Ich bin langweilig.
> - [x] Mir ist langweilig.
> - [ ] Ich habe langweilig.
> - [ ] Mich ist langweilig.
>
> **Пояснення:** *Mir ist langweilig* — стан, у якому ти перебуваєш (як *Mir ist kalt*). *Ich bin langweilig* означає «я нудна людина» — так характеризують людину, а не відчуття.

## Пояснення

### Як сказати про почуття: чотири моделі

| Модель | Приклад | Коли |
|---|---|---|
| **Ich bin** + прикметник | Ich bin froh. Ich bin traurig. | емоція: радий, сумний |
| **Mir ist** + прикметник | Mir ist langweilig. Mir ist kalt. | стан, самопочуття (Dativ) |
| **Ich fühle mich** + прикметник | Ich fühle mich einsam. | «почуваюся» (зворотне дієслово) |
| **Ich habe** + іменник | Ich habe Angst. Ich habe Sorgen. | страх, турботи |

Для запитання підходять *Wie fühlst du dich?*, *Wie geht es dir?* і *Was ist los?* («Що сталося?»). Кажемо: *Ich fühle **mich** gut* — зворотний займенник обовʼязковий (докладно — [[Deutsch - A2 - 14. Зворотні дієслова — sich freuen, sich waschen]]).

### Почуття з прийменниками

Багато прикметників мають постійний прийменник. Цей прийменник вчимо разом зі словом.

| Почуття | Прийменник і відмінок | Приклад |
|---|---|---|
| stolz | **auf** + Akk | Ich bin stolz **auf** meine Tochter. |
| eifersüchtig | **auf** + Akk | Er ist eifersüchtig **auf** seinen Bruder. |
| zufrieden | **mit** + Dat | Sie ist zufrieden **mit** ihrer Arbeit. |
| enttäuscht | **von** + Dat | Ich bin **von** dir enttäuscht. |
| verliebt | **in** + Akk | Sie ist **in** ihn verliebt. |

> [!diagram] Прикметник + прийменник: який відмінок?
> ```yaml
> layout: compare
> columns: { akk: "+ Akkusativ", dat: "+ Dativ" }
> nodes:
>   - { id: a1, col: akk, label: "гордий", text: "stolz auf", note: "Ich bin stolz auf dich.", tone: pink }
>   - { id: a2, col: akk, label: "ревнивий", text: "eifersüchtig auf", note: "eifersüchtig auf ihn", tone: pink }
>   - { id: a3, col: akk, label: "закоханий", text: "verliebt in", note: "in sie verliebt", tone: pink }
>   - { id: d1, col: dat, label: "задоволений", text: "zufrieden mit", note: "zufrieden mit dem Ergebnis", tone: yellow }
>   - { id: d2, col: dat, label: "розчарований", text: "enttäuscht von", note: "von dir enttäuscht", tone: yellow }
>   - { id: d3, col: dat, label: "посваритися", text: "sich streiten mit", note: "mit ihm gestritten", tone: yellow }
> steps:
>   - { focus: [a1, a2, a3], note: "Після auf і in у цих значеннях — знахідний відмінок: auf mich, in ihn." }
>   - { focus: [d1, d2, d3], note: "Після mit і von завжди давальний: mit dir, von ihm." }
> ```
> Рожеві блоки — Akkusativ, жовті — Dativ; відмінок підписаний у заголовку колонки.

### Характер: Ich bin… і Er ist…

Характер описуємо через *sein* + прикметник: *Er ist ehrlich. Sie ist sehr fleißig.* Українська каже «він чесний», німецька так само — але прикметник не змінюється: *Er ist ehrlich*, *Sie ist ehrlich*, *Sie sind ehrlich*.

> [!tip] sympathisch — це не «симпатичний»
> *Sie ist sympathisch* означає, що вона приємна в спілкуванні, викликає симпатію. Про зовнішність кажуть *hübsch* або *attraktiv*. Те саме з *nervös*: це «нервує, хвилюється», а не «нервова людина за характером».

### Стосунки: від знайомства до розставання

> [!diagram] Історія стосунків
> ```yaml
> layout: flow
> nodes:
>   - { id: a, label: "1. Знайомство", text: "sich kennenlernen", note: "Wir haben uns auf einer Party kennengelernt.", tone: yellow }
>   - { id: b, label: "2. Закохуватись", text: "sich verlieben", note: "Sie hat sich in ihn verliebt.", tone: pink }
>   - { id: c, label: "3. Разом", text: "zusammen sein", note: "Sie sind seit zwei Jahren zusammen.", tone: yellow }
>   - { id: d, label: "4. Сварка", text: "sich streiten", note: "Sie haben sich gestritten.", tone: pink }
>   - { id: e, label: "5. Мирова", text: "sich vertragen", note: "Sie haben sich wieder vertragen.", tone: gray }
>   - { id: f, label: "або розставання", text: "sich trennen", note: "Sie haben sich getrennt.", tone: gray }
> edges:
>   - { from: a, to: b, label: "потім" }
>   - { from: b, to: c, label: "потім" }
>   - { from: c, to: d, label: "іноді" }
>   - { from: d, to: e, label: "або" }
>   - { from: d, to: f, label: "або" }
> steps:
>   - { focus: a, note: "Знайомство: sich kennenlernen — Wir haben uns kennengelernt; Ich lerne ihn kennen." }
>   - { focus: b, note: "Закохуватись: sich verlieben in + Akk." }
>   - { focus: c, note: "Бути разом: zusammen sein." }
>   - { focus: d, note: "Сваритися: sich streiten mit + Dat." }
>   - { focus: [e, f], note: "Помиритися (sich vertragen) або розійтися (sich trennen)." }
> ```

Більшість цих дієслів зворотні: підмет і *sich* — одна особа (*Sie hat sich verliebt*). Дієслова *lächeln, weinen, vertrauen* зворотного займенника не мають.

## Приклади

- Ich bin heute sehr aufgeregt. Morgen ist mein Vorstellungsgespräch. — Я сьогодні дуже хвилююсь. Завтра моя співбесіда.
- Sie ist traurig, weil ihre Freundin umzieht. — Вона сумна, бо її подруга переїздить.
- Warum bist du so wütend? — Чому ти така злюща?
- Wie fühlst du dich heute? — Ich fühle mich viel besser. — Як ти себе почуваєш? — Набагато краще.
- Mein Bruder ist schüchtern, aber sehr zuverlässig. — Мій брат соромʼязливий, але дуже надійний.
- Meine Oma ist großzügig. Sie schenkt allen etwas. — Моя бабуся щедра. Вона всім щось дарує.
- Wir haben uns gestritten, aber jetzt haben wir uns wieder vertragen. — Ми посварились, але тепер помирились.
- Er hat sich bei ihr entschuldigt. — Він перепросив у неї.
- Ich vertraue dir. — Я тобі довіряю.
- Sie lächelt, aber ihre Augen sind traurig. — Вона посміхається, але очі в неї сумні.

## Слова

### Почуття

> [!word] das Gefühl
> ipa: /ɡəˈfyːl/ · pos: noun · level: A2 · id: de-a2-gefuehle-w01
> uk: почуття; відчуття
> forms: die Gefühle
> example: Ich habe ein gutes **Gefühl** bei diesem Job. — У мене гарне відчуття щодо цієї роботи.
> note: ü — губи трубочкою, язик як для «і»; довге [yː].

> [!word] froh
> ipa: /fʁoː/ · pos: adj · level: A2 · id: de-a2-gefuehle-w02
> uk: радий; задоволений
> example: Ich bin **froh**, dass du da bist. — Я радий, що ти тут.
> note: froh — радість від того, що все добре. Frohe Weihnachten! — Веселого Різдва!

> [!word] glücklich
> ipa: /ˈɡlʏklɪç/ · pos: adj · level: A2 · id: de-a2-gefuehle-w03
> uk: щасливий
> example: Sie ist **glücklich** verheiratet. — Вона щасливо одружена.
> note: das Glück — і «щастя», і «удача». -ig / -lich у кінці = [ɪç].

> [!word] traurig
> ipa: /ˈtʁaʊ̯ʁɪç/ · pos: adj · level: A2 · id: de-a2-gefuehle-w04
> uk: сумний
> example: Warum bist du **traurig**? — Чому ти сумний?
> note: au = [aʊ̯]; -ig у кінці = [ɪç].

> [!word] wütend
> ipa: /ˈvyːtn̩t/ · pos: adj · level: A2 · id: de-a2-gefuehle-w05
> uk: розлючений
> example: Er ist **wütend**, weil der Zug Verspätung hat. — Він розлючений, бо потяг запізнюється.
> note: «сердитися на» — wütend auf + Akk; сильніше за böse. w = «в».

> [!word] aufgeregt
> ipa: /ˈaʊ̯fɡəʁeːkt/ · pos: adj · level: A2 · id: de-a2-gefuehle-w06
> uk: схвильований; збуджений
> example: Die Kinder sind vor dem Urlaub sehr **aufgeregt**. — Діти перед відпусткою дуже збуджені.
> note: може бути і радісне хвилювання, і тривога; контекст підкаже.

> [!word] zufrieden
> ipa: /tsuˈfʁiːdn̩/ · pos: adj · level: A2 · id: de-a2-gefuehle-w07
> uk: задоволений
> example: Ich bin **zufrieden** mit dem Ergebnis. — Я задоволений результатом.
> note: zufrieden mit + Dat. z = [ts], ie = довге [iː].

> [!word] nervös
> ipa: /nɛʁˈvøːs/ · pos: adj · level: A2 · id: de-a2-gefuehle-w08
> uk: знервований; той, що хвилюється
> example: Vor der Prüfung bin ich immer **nervös**. — Перед іспитом я завжди нервую.
> note: наголос на кінці; ö — довгий [øː].

> [!word] enttäuscht
> ipa: /ɛntˈtɔʏ̯ʃt/ · pos: adj · level: B1 · id: de-a2-gefuehle-w09
> uk: розчарований
> example: Ich bin von dir **enttäuscht**. — Я розчарований тобою.
> note: enttäuscht von + Dat. äu = [ɔʏ̯], не «ей».

> [!word] überrascht
> ipa: /yːbɐˈʁaʃt/ · pos: adj · level: B1 · id: de-a2-gefuehle-w10
> uk: здивований; приємно вражений
> example: Ich bin total **überrascht**! Danke für die Einladung. — Я дуже здивований! Дякую за запрошення.
> note: überrascht über + Akk; наголос на -rascht, префікс über- безнаголосний.

> [!word] stolz
> ipa: /ʃtɔlts/ · pos: adj · level: A2 · id: de-a2-gefuehle-w11
> uk: гордий
> example: Wir sind **stolz** auf unseren Sohn. — Ми пишаємось нашим сином.
> note: stolz auf + Akk. st- на початку = «шт»; кінцеве -lz = [lts].

> [!word] einsam
> ipa: /ˈaɪ̯nzaːm/ · pos: adj · level: A2 · id: de-a2-gefuehle-w12
> uk: самотній
> example: In der neuen Stadt fühle ich mich manchmal **einsam**. — У новому місті я іноді почуваюся самотнім.
> note: s перед голосним у -sam: дзвінке [z]. ein- — [aɪ̯n].

> [!word] eifersüchtig
> ipa: /ˈaɪ̯fɐzʏçtɪç/ · pos: adj · level: B1 · id: de-a2-gefuehle-w13
> uk: ревнивий
> example: Er ist **eifersüchtig** auf ihre Kollegen. — Він ревнує до її колег.
> note: eifersüchtig auf + Akk: «ревнувати до», а не ~~zu~~.

### Характер

> [!word] der Charakter
> ipa: /kaˈʁaktɐ/ · pos: noun · level: A2 · id: de-a2-gefuehle-w14
> uk: характер
> forms: die Charaktere
> example: Er hat einen guten **Charakter**. — У нього добрий характер.
> note: ch перед a = [k]. Множина die Charaktere звучить [kaʁakˈteːʁə] — наголос зсувається.

> [!word] schüchtern
> ipa: /ˈʃʏçtɐn/ · pos: adj · level: A2 · id: de-a2-gefuehle-w15
> uk: соромʼязливий
> example: Mein Sohn ist ein bisschen **schüchtern**. — Мій син трохи соромʼязливий.
> note: sch = «ш»; ü — губи трубочкою, язик як для «і»; ch після ü = [ç].

> [!word] großzügig
> ipa: /ˈɡʁoːstsyːɡɪç/ · pos: adj · level: A2 · id: de-a2-gefuehle-w16
> uk: щедрий
> example: Er ist sehr **großzügig** mit Trinkgeld. — Він дуже щедрий на чайові.
> note: z = [ts]; -ig у кінці = [ɪç]. Не плутай: groß — великий, großzügig — щедрий.

> [!word] ehrlich
> ipa: /ˈeːɐ̯lɪç/ · pos: adj · level: A2 · id: de-a2-gefuehle-w17
> uk: чесний
> example: Sei bitte **ehrlich**: Gefällt dir das Kleid? — Будь ласка, будь чесна: тобі подобається ця сукня?
> note: h після голосного не вимовляється; -lich у кінці = [lɪç].

> [!word] bescheiden
> ipa: /bəˈʃaɪ̯dn̩/ · pos: adj · level: B1 · id: de-a2-gefuehle-w18
> uk: скромний
> example: Sie ist sehr **bescheiden** und redet nie über ihren Erfolg. — Вона дуже скромна й ніколи не говорить про свій успіх.
> note: наголос на другому складі.

> [!word] geduldig
> ipa: /ɡəˈdʊldɪç/ · pos: adj · level: A2 · id: de-a2-gefuehle-w19
> uk: терплячий
> example: Der Lehrer ist sehr **geduldig**. — Учитель дуже терплячий.
> note: протилежне — ungeduldig. die Geduld — терпіння.

> [!word] ungeduldig
> ipa: /ˈʊnɡədʊldɪç/ · pos: adj · level: B1 · id: de-a2-gefuehle-w20
> uk: нетерплячий
> example: Sei nicht so **ungeduldig**! Der Bus kommt gleich. — Не будь таким нетерплячим! Автобус зараз прийде.
> note: un- — префікс заперечення, наголошений: UN-geduldig.

> [!word] faul
> ipa: /faʊ̯l/ · pos: adj · level: A2 · id: de-a2-gefuehle-w21
> uk: ледачий
> example: Am Sonntag bin ich gern **faul**. — У неділю я люблю полінуватися.
> note: faul може означати й «зіпсований»: faule Eier. Дієслово — faulenzen.

> [!word] mutig
> ipa: /ˈmuːtɪç/ · pos: adj · level: A2 · id: de-a2-gefuehle-w22
> uk: відважний
> example: Das war sehr **mutig** von dir. — Це було дуже відважно з твого боку.
> note: від der Mut (відвага). -ig у кінці = [ɪç].

> [!word] der Mut
> ipa: /muːt/ · pos: noun · level: B1 · id: de-a2-gefuehle-w23
> uk: відвага; сміливість
> forms: — (без множини)
> example: Du hast viel **Mut**! — У тебе багато відваги!
> note: Mut machen — підбадьорювати; mutig — відважний.

> [!word] neugierig
> ipa: /ˈnɔʏ̯ɡiːʁɪç/ · pos: adj · level: A2 · id: de-a2-gefuehle-w24
> uk: цікавий; допитливий
> example: Kinder sind oft sehr **neugierig**. — Діти часто дуже допитливі.
> note: українське «цікавий» про тему — interessant, а neugierig — про людину, яка хоче все знати.

> [!word] zuverlässig
> ipa: /ˈtsuːfɛɐ̯lɛsɪç/ · pos: adj · level: A2 · id: de-a2-gefuehle-w25
> uk: надійний
> example: Mein Chef ist streng, aber **zuverlässig**. — Мій начальник суворий, але надійний.
> note: про людину, яка не підведе; про річ — die Maschine ist zuverlässig. Наголос на першому складі.

### Стосунки

> [!word] die Liebe
> ipa: /ˈliːbə/ · pos: noun · level: A2 · id: de-a2-gefuehle-w26
> uk: любов
> forms: — (без множини)
> example: Die **Liebe** ist wichtig im Leben. — Любов важлива в житті.
> note: Ich liebe dich — дуже сильно; про друзів і рідню частіше Ich hab dich lieb.

> [!word] der Streit
> ipa: /ʃtʁaɪ̯t/ · pos: noun · level: A2 · id: de-a2-gefuehle-w27
> uk: сварка
> forms: — (без множини; про конкретні сварки — die Streitigkeiten)
> example: Sie hatten **Streit** wegen des Geldes. — Вони посварилися через гроші.
> note: Streit haben / bekommen. Кінцеве -t чітко, ei = [aɪ̯].

> [!word] die Beziehung
> ipa: /bəˈtsiːʊŋ/ · pos: noun · level: A2 · id: de-a2-gefuehle-w28
> uk: стосунки; звʼязок
> forms: die Beziehungen
> example: Sie haben eine gute **Beziehung**. — У них добрі стосунки.
> note: -ung — жіночий рід. z = [ts], наголос на -zieh-.

> [!word] verliebt
> ipa: /fɛɐ̯ˈliːpt/ · pos: adj · level: A2 · id: de-a2-gefuehle-w29
> uk: закоханий
> example: Er ist **verliebt** in seine Kollegin. — Він закоханий у свою колегу.
> note: verliebt in + Akk. Кінцеве -bt = [pt].

> [!word] sich streiten (mit + Dat)
> ipa: /zɪç ˈʃtʁaɪ̯tn̩/ · pos: verb · level: A2 · id: de-a2-gefuehle-w30
> uk: сваритися
> forms: streitet sich → stritt sich → hat sich gestritten
> example: Wir **streiten** uns selten. — Ми рідко сваримося.
> note: «через що» — streiten über + Akk або um + Akk; «з ким» — mit + Dat.

> [!word] sich vertragen
> ipa: /zɪç fɛɐ̯ˈtʁaːɡn̩/ · pos: verb · level: A2 · id: de-a2-gefuehle-w31
> uk: ладнати; миритися
> forms: verträgt sich → vertrug sich → hat sich vertragen
> example: Die Geschwister **vertragen** sich gut. — Брат і сестра добре ладнають.
> note: «помиритися» і «ладнати» — те саме дієслово.

> [!word] sich entschuldigen (bei + Dat)
> ipa: /zɪç ɛntˈʃʊldɪɡn̩/ · pos: verb · level: A2 · id: de-a2-gefuehle-w32
> uk: перепрошувати
> forms: entschuldigt sich → entschuldigte sich → hat sich entschuldigt
> example: Er **entschuldigt** sich bei ihr für die Verspätung. — Він перепрошує в неї за запізнення.
> note: «перед ким» — bei + Dat; «за що» — für + Akk. Entschuldigen Sie! — звернення до незнайомого.

> [!word] vertrauen
> ipa: /fɛɐ̯ˈtʁaʊ̯ən/ · pos: verb · level: A2 · id: de-a2-gefuehle-w33
> uk: довіряти
> forms: vertraut → vertraute → hat vertraut
> example: Ich **vertraue** dir. — Я тобі довіряю.
> note: довіряти комусь — Dativ: dir, ihm. Іменник — das Vertrauen.

> [!word] der Partner
> ipa: /ˈpaʁtnɐ/ · pos: noun · level: A2 · id: de-a2-gefuehle-w34
> uk: партнер (у стосунках, у бізнесі)
> forms: die Partner
> example: Mein **Partner** kocht gern. — Мій партнер любить готувати.
> note: жінка — die Partnerin. Нейтральне слово для чоловіка / дружини / подруги чи друга у стосунках.

> [!word] sich trennen (von + Dat)
> ipa: /zɪç ˈtʁɛnən/ · pos: verb · level: A2 · id: de-a2-gefuehle-w35
> uk: розлучатися; розходитися
> forms: trennt sich → trennte sich → hat sich getrennt
> example: Sie hat **sich** von ihm **getrennt**. — Вона розійшлася з ним.
> note: «розійтися з кимось» — sich trennen von + Dat; Mülltrennung — те саме дієслово, інший контекст.

> [!word] die Sorge
> ipa: /ˈzɔʁɡə/ · pos: noun · level: A2 · id: de-a2-gefuehle-w36
> uk: турбота; хвилювання
> forms: die Sorgen
> example: Ich mache mir **Sorgen** um dich. — Я хвилююся за тебе.
> note: sich Sorgen machen um + Akk. s перед голосним — дзвінке [z].

> [!word] lächeln
> ipa: /ˈlɛçl̩n/ · pos: verb · level: A2 · id: de-a2-gefuehle-w37
> uk: усміхатися
> forms: lächelt → lächelte → hat gelächelt
> example: Sie **lächelt** immer, wenn sie ihn sieht. — Вона завжди усміхається, коли бачить його.
> note: lächeln — тихо усміхатися, lachen — сміятися голосно. ä = [ɛ], ch після ä = [ç].

> [!word] weinen
> ipa: /ˈvaɪ̯nən/ · pos: verb · level: A2 · id: de-a2-gefuehle-w38
> uk: плакати
> forms: weint → weinte → hat geweint
> example: Das Baby **weint**. — Малюк плаче.
> note: w = «в»; ei = [aɪ̯].

## Слухаємо

> [!listen] Що ти почув?
> level: A2 · type: choice · speed: slow · id: de-a2-gefuehle-l01
> audio: Ich bin heute sehr aufgeregt.
> - [ ] Ich bin heute sehr traurig.
> - [x] Ich bin heute sehr aufgeregt.
> - [ ] Ich bin heute sehr zufrieden.
>
> **Пояснення:** *aufgeregt* починається з відокремлюваного *auf-* і закінчується на [t]. *traurig* і *zufrieden* звучать зовсім інакше.

> [!listen] Що ти почув?
> level: A2 · type: choice · speed: slow · id: de-a2-gefuehle-l02
> audio: Wie fühlst du dich?
> - [x] Wie fühlst du dich?
> - [ ] Wie heißt du?
> - [ ] Wie alt bist du?
>
> **Пояснення:** *fühlst* — довге [yː]; *dich* — [ç], тут закінчується питання про самопочуття.

> [!listen] Напиши або скажи, що почув
> level: A2 · type: dictation · speed: slow · id: de-a2-gefuehle-l03
> audio: Sie ist in ihn verliebt.
> explain: *verliebt in + Akk*: *ihn*, а не ~~ihm~~. Кінець слова *verliebt* — [pt].

> [!listen] Напиши або скажи, що почув
> level: A2 · type: dictation · speed: slow · id: de-a2-gefuehle-l04
> audio: Wir haben uns wieder vertragen.
> explain: *sich vertragen* — зворотне дієслово; Perfekt з *haben*: *haben uns vertragen*.

> [!listen] Послухай. Як почувається Лена?
> level: A2 · type: answer · speed: slow · id: de-a2-gefuehle-l05
> audio: A: Hallo, Lena. Du siehst traurig aus. Was ist los?
> audio: B: Ich habe mich mit meiner Schwester gestritten. Ich bin richtig wütend, aber auch ein bisschen traurig.
> audio: A: Ruf sie doch an. Vielleicht entschuldigt sie sich.
> - [ ] Лена щаслива й задоволена.
> - [x] Лена сердита й трохи сумна.
> - [ ] Лена нервує перед іспитом.
>
> **Пояснення:** *wütend* — розлючена, *traurig* — сумна. *Was ist los?* — «Що сталося?».

> [!listen] Послухай діалог у кавʼярні. Що порадила Анна?
> level: A2 · type: answer · speed: slow · id: de-a2-gefuehle-l06
> audio: A: Du siehst müde aus, Tim. Ist alles in Ordnung?
> audio: B: Ich mache mir Sorgen. Mein Chef ist unzufrieden mit mir.
> audio: A: Sprich doch ehrlich mit ihm. Du bist ein fleißiger Kollege, und er vertraut dir.
> audio: B: Danke, Anna. Das hilft mir.
> - [ ] Звільнитися з роботи.
> - [x] Чесно поговорити з начальником.
> - [ ] Піти у відпустку.
>
> **Пояснення:** *Sprich doch ehrlich mit ihm* — «поговори з ним чесно». *vertraut dir* — довіряє тобі (Dativ).

## Вимова

Слова про почуття й характер добре тренують **[ç] після переднього голосного** (*ich, glücklich, ehrlich, lächeln, schüchtern*) і **наголос у складних словах** (*großzügig*, *zuverlässig*, *eifersüchtig*).

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-gefuehle-s01
> text: Ich bin glücklich und zufrieden.
> ipa: /ɪç bɪn ˈɡlʏklɪç ʊnt tsuˈfʁiːdn̩/
> tip: glücklich — коротке [ʏ] і [ç] у кінці; zufrieden — z = [ts], наголос на -frie-.
> uk: Я щасливий і задоволений.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-gefuehle-s02
> text: Wie fühlst du dich heute?
> ipa: /viː fyːlst duː dɪç ˈhɔʏ̯tə/
> tip: fühlst — довге [yː]. dich — [ç]. heute — [ɔʏ̯].
> uk: Як ти почуваєшся сьогодні?

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-gefuehle-s03
> text: Er ist schüchtern, aber sehr zuverlässig.
> ipa: /eːɐ̯ ɪst ˈʃʏçtɐn ˈaːbɐ zeːɐ̯ ˈtsuːfɛɐ̯lɛsɪç/
> tip: schüchtern — [ʃ] + [ʏ] + [ç]. zuverlässig: наголос на zu-.
> uk: Він соромʼязливий, але дуже надійний.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-gefuehle-s04
> text: Wir haben uns gestritten und uns wieder vertragen.
> ipa: /viːɐ̯ ˈhaːbn̩ ʊns ɡəˈʃtʁɪtn̩ ʊnt ʊns ˈviːdɐ fɛɐ̯ˈtʁaːɡn̩/
> tip: gestritten — gesch- на початку «ґеш-», -tt- коротке. wieder — довге [iː].
> uk: Ми посварилися і знову помирилися.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-gefuehle-s05
> text: Sie hat sich in ihn verliebt.
> ipa: /ziː hat zɪç ɪn iːn fɛɐ̯ˈliːpt/
> tip: ihn — довге [iː]; verliebt закінчується на [pt].
> uk: Вона закохалася в нього.

## Типові помилки українців

> [!pitfall] «Ich bin langweilig» — нудна людина
> Українське «мені нудно» → *Mir ist langweilig* (або *Ich langweile mich*). Якщо сказати *Ich bin langweilig*, виходить «я нудна людина». Про предмет: *Der Film ist langweilig* — «фільм нудний». Для відчуття: *Mir ist langweilig*, *Mir ist kalt*, *Mir ist schlecht*.

> [!pitfall] Неправильні прийменники: «stolz für», «eifersüchtig zu»
> Українські «пишатися *за*», «ревнувати *до*» німецька передає через *auf*: *stolz **auf** + Akk*, *eifersüchtig **auf** + Akk*. А «закоханий у кого» — *verliebt **in** + Akk*, «задоволений чим» — *zufrieden **mit** + Dat*. Прийменник вчи разом зі словом.

> [!pitfall] sympathisch ≠ «симпатичний»
> *Er ist sympathisch* — він приємний, викликає симпатію характером. Про зовнішність скажуть *hübsch, attraktiv* або *gut aussehend*. Українське «симпатична дівчина» німецькою — *ein hübsches Mädchen*, а не ~~ein sympathisches Mädchen~~ (це про характер).

> [!pitfall] «Ich fühle schlecht» — без sich
> *fühlen* у значенні «почуватися» зворотне: *Ich fühle **mich** schlecht*, *Wie fühlst du **dich**?*, а не ~~Ich fühle schlecht~~. Без *sich* дієслово означає «відчувати, мацати»: *Ich fühle den Wind*.

## Ситуація: розмова з подругою

> [!listen] Послухай діалог. Чому Марта засмучена?
> level: A2 · type: answer · speed: slow · id: de-a2-gefuehle-l07
> audio: A: Hallo, Marta! Wie geht es dir? Du siehst traurig aus.
> audio: B: Ach, ich habe mich mit Jonas gestritten. Er war nicht ehrlich zu mir.
> audio: A: Das tut mir leid. Seid ihr noch zusammen?
> audio: B: Ja, wir haben uns wieder vertragen. Aber ich bin immer noch ein bisschen enttäuscht.
> - [ ] Вона розійшлася з Йонасом.
> - [x] Вона посварилася з Йонасом, але вони помирилися; вона розчарована.
> - [ ] Вона втратила роботу.
>
> **Пояснення:** *Er war nicht ehrlich* — він не був чесним; *wir haben uns wieder vertragen* — ми знову помирилися; *enttäuscht* — розчарована.

Відповідай подрузі вголос.

> [!speak] «Я посварилася з братом, і мені сумно.»
> level: A2 · speed: slow · id: de-a2-gefuehle-s06
> text: Ich habe mich mit meinem Bruder gestritten, und ich bin traurig.
> ipa: /ɪç ˈhaːbə mɪç mɪt ˈmaɪ̯nəm ˈbʁuːdɐ ɡəˈʃtʁɪtn̩ ʊnt ɪç bɪn ˈtʁaʊ̯ʁɪç/
> tip: mich і ich — обидва [ç]. Bruder — [uː] довге.
> uk: Я посварилася з братом, і мені сумно.

> [!speak] «Не хвилюйся! Я тобі довіряю.»
> level: A2 · speed: slow · id: de-a2-gefuehle-s07
> text: Mach dir keine Sorgen! Ich vertraue dir.
> ipa: /max diːɐ̯ ˈkaɪ̯nə ˈzɔʁɡn̩ ɪç fɛɐ̯ˈtʁaʊ̯ə diːɐ̯/
> tip: mach — [x] «х» глибоко. vertraue — наголос на -trau-.
> uk: Не хвилюйся! Я тобі довіряю.

## Landeskunde: Freunde und Bekannte

> [!example] Freunde und Bekannte
> Im Deutschen unterscheidet man oft zwischen Freunden und Bekannten. Einen Bekannten trifft man vielleicht auf einer Party oder im Verein und spricht mit ihm über die Arbeit oder das Wetter. Einem Freund vertraut man, und mit ihm spricht man auch über Probleme. Aber Vorsicht: „Mein Freund“ und „meine Freundin“ können auch „Partner“ bedeuten. Wenn man das vermeiden will, sagt man „ein Freund von mir“ oder „eine gute Freundin“. „Ich liebe dich“ sagt man oft nur zum Partner oder zur Familie. Unter Freunden sagt man eher „Du bist mir wichtig“.
>
> **Переклад:** У німецькій мові часто розрізняють друзів і знайомих. Зі знайомим можна зустрітися на вечірці чи в клубі за інтересами й поговорити про роботу чи погоду. Другові довіряють, і з ним говорять також про проблеми. Але обережно: «mein Freund» і «meine Freundin» можуть означати й «партнер». Щоб цього уникнути, кажуть «ein Freund von mir» (один із моїх друзів) або «eine gute Freundin». «Ich liebe dich» часто кажуть лише партнерові чи родині. Між друзями радше кажуть «Du bist mir wichtig» (ти для мене важливий).

> [!quiz] Що може означати «meine Freundin» у німецькій мові?
> level: A2 · type: single · id: de-a2-gefuehle-q02
> - [ ] Тільки «подруга».
> - [x] «Подруга» або «дівчина (партнерка)».
> - [ ] Тільки «колега».
> - [ ] Тільки «сестра».
>
> **Пояснення:** текст: *Mein Freund und meine Freundin können auch Partner bedeuten.* Щоб підкреслити дружбу, кажуть *eine gute Freundin* або *eine Freundin von mir*.

> [!quiz] Як відрізняють Bekannte від Freunde?
> level: A2 · type: single · id: de-a2-gefuehle-q03
> - [ ] Bekannte живуть далеко, Freunde — близько.
> - [x] Із Bekannte говорять про роботу чи погоду, Freunde довіряють і говорять про проблеми.
> - [ ] Bekannte старші за Freunde.
> - [ ] Різниці немає.
>
> **Пояснення:** *Einem Freund vertraut man* — друзі довіряють один одному; зі знайомими розмова поверхневіша.

> [!quiz] Що кажуть друзям замість «Ich liebe dich» (за текстом)?
> level: A2 · type: single · id: de-a2-gefuehle-q04
> - [ ] Ich hasse dich.
> - [x] Du bist mir wichtig.
> - [ ] Ich bin stolz auf dich.
> - [ ] Guten Tag.
>
> **Пояснення:** текст: *Unter Freunden sagt man eher „Du bist mir wichtig“.*

## Практика

> [!quiz] Постав правильний прийменник
> level: A2 · type: fill · bank: an, für · id: de-a2-gefuehle-q05
>
> ```text fill
> Ich bin stolz [[auf]] meine Tochter.
> Sie hat sich [[in]] einen Kollegen verliebt.
> Er streitet sich oft [[mit]] seinem Bruder.
> Ich entschuldige mich [[bei]] dir.
> ```
>
> **Пояснення:** *stolz auf + Akk*, *sich verlieben in + Akk*, *sich streiten mit + Dat*, *sich entschuldigen bei + Dat*. Прийменники *an* і *für* у цих конструкціях не вживаються.

> [!quiz] Допиши прикметник за значенням
> level: A2 · type: fill · id: de-a2-gefuehle-q06
>
> ```text fill
> Sie sagt immer die Wahrheit. Sie ist (чесна) [[ehrlich]].
> Er gibt gern Geld und Geschenke. Er ist (щедрий) [[großzügig]].
> Mein Sohn spricht nicht gern mit Fremden. Er ist (соромʼязливий) [[schüchtern]].
> Auf ihn kann man sich verlassen. Er ist (надійний) [[zuverlässig]].
> ```
>
> **Пояснення:** *ehrlich* — чесний, *großzügig* — щедрий, *schüchtern* — соромʼязливий, *zuverlässig* — надійний.

> [!quiz] Допиши зворотний займенник
> level: A2 · type: fill · bank: mir, euch · id: de-a2-gefuehle-q07
>
> ```text fill
> Wie fühlst du [[dich]] heute?
> Wir verstehen [[uns]] sehr gut.
> Ich freue [[mich]] auf das Wochenende.
> Er hat [[sich]] in sie verliebt.
> ```
>
> **Пояснення:** зворотний займенник відповідає підмету: *du → dich*, *wir → uns*, *ich → mich*, *er → sich*. *mir* і *euch* не підходять до жодного з підметів.

> [!quiz] Яке слово означає «приємний у спілкуванні», а не «симпатичний на вигляд»?
> level: A2 · type: single · id: de-a2-gefuehle-q08
> - [ ] hübsch
> - [x] sympathisch
> - [ ] attraktiv
> - [ ] schön
>
> **Пояснення:** *sympathisch* — про характер. Про вигляд: *hübsch, attraktiv, schön*.

> [!quiz] Як правильно: «Я пишаюся тобою»?
> level: A2 · type: single · id: de-a2-gefuehle-q09
> - [ ] Ich bin stolz für dich.
> - [x] Ich bin stolz auf dich.
> - [ ] Ich bin stolz mit dir.
> - [ ] Ich bin stolz von dir.
>
> **Пояснення:** *stolz auf + Akk*: *auf dich*.

> [!quiz] Обери всі позитивні почуття
> level: A2 · type: multi · id: de-a2-gefuehle-q10
> - [x] froh
> - [x] glücklich
> - [ ] wütend
> - [x] zufrieden
> - [ ] enttäuscht
>
> **Пояснення:** *froh, glücklich, zufrieden* — позитивні; *wütend* — розлючений, *enttäuscht* — розчарований.

> [!quiz] Обери всі правильні речення
> level: A2 · type: multi · id: de-a2-gefuehle-q11
> - [x] Ich fühle mich müde.
> - [ ] Ich fühle müde.
> - [x] Wir haben uns gestritten.
> - [x] Er hat sich in sie verliebt.
> - [ ] Sie ist stolz an ihn.
>
> **Пояснення:** *sich fühlen* потребує *sich* (*mich*). *stolz auf*, а не *an*. Інші речення правильні.

> [!quiz] Склади питання (почни зі слова Wie): «Як ти себе почуваєш сьогодні?»
> level: A2 · type: order · id: de-a2-gefuehle-q12
>
> ```text order
> Wie
> fühlst
> du
> dich
> heute?
> mich ✗
> ```
>
> **Пояснення:** дієслово на другому місці, після підмета *du* — зворотний займенник *dich*. Форма *mich* — для *ich*.

> [!quiz] Склади речення (почни зі слова Sie): «Вона закохалася в нього»
> level: A2 · type: order · id: de-a2-gefuehle-q13
>
> ```text order
> Sie
> hat
> sich
> in
> ihn
> verliebt.
> ihm ✗
> ```
>
> **Пояснення:** *sich verlieben in + Akk*: *in ihn*. Perfekt з *haben*: *hat … verliebt* у кінці.

> [!quiz] Склади речення (почни зі слова Wir): «Ми ніколи не сваримося»
> level: A2 · type: order · id: de-a2-gefuehle-q14
>
> ```text order
> Wir
> streiten
> uns
> nie.
> mich ✗
> ```
>
> **Пояснення:** *wir* → *uns*; *nie* стоїть наприкінці.

> [!quiz] Що означає «zuverlässig»?
> level: A2 · type: single · id: de-a2-gefuehle-q15
> - [ ] обережний
> - [x] надійний
> - [ ] ввічливий
> - [ ] швидкий
>
> **Пояснення:** *zuverlässig* — той, на кого можна покластися.

## Фішки

> [!reel] 🌍 Слова, яких немає в інших мовах
> У німецькій є слова для відчуттів, які інші мови описують цілим реченням. *Fernweh* — тяга до далеких країн (протилежність *Heimweh*), *Schadenfreude* — радість від чужої невдачі, *Weltschmerz* — смуток від недосконалості світу. Частину з цих слів запозичила англійська.

> [!reel] 🦋 Метелики в животі
> Німці кажуть *Schmetterlinge im Bauch haben* — «мати метеликів у животі», коли закохані. Українська має точно такий самий образ. А ще: *einen Kloß im Hals haben* — «ком у горлі», коли хочеться плакати, і *Daumen drücken* — «тиснути великий палець» (наш відповідник — «тримати кулаки»).

> [!reel] 🗣️ Ich liebe dich — не для всіх
> Німці зазвичай не кажуть «Ich liebe dich» знайомим чи друзям: цю фразу залишають для партнера й близьких. Друзям радше скажуть *Ich mag dich* або *Du bist mir wichtig*. Тому не дивуйся, якщо колега не відповів «так само».

## Джерела та що почитати

- [DWDS — Gefühl](https://www.dwds.de/wb/Gef%C3%BChl): значення, походження й вимова слова.
- [DWDS — sympathisch](https://www.dwds.de/wb/sympathisch): значення й вживання слова.
- [DWDS — zuverlässig](https://www.dwds.de/wb/zuverl%C3%A4ssig): значення й складники слова.
- [DWDS — verlieben](https://www.dwds.de/wb/verlieben): значення, керування, приклади.
- [DWDS — Fernweh](https://www.dwds.de/wb/Fernweh): значення й приклади слова.
- [DWDS — Schadenfreude](https://www.dwds.de/wb/Schadenfreude): значення й походження слова.
- [DWDS — Weltschmerz](https://www.dwds.de/wb/Weltschmerz): значення й походження слова.
- [DW — Nicos Weg (A2)](https://learngerman.dw.com/uk/nicos-weg/c-36519789): безкоштовний відеокурс Deutsche Welle з діалогами про почуття.

> [!important] Підсумок
> - Почуття: **Ich bin froh / traurig / wütend**, **Mir ist langweilig / kalt**, **Ich fühle mich einsam**, **Ich habe Angst / Sorgen**.
> - Прикметники з прийменниками: *stolz auf + Akk*, *eifersüchtig auf + Akk*, *verliebt in + Akk*, *zufrieden mit + Dat*, *enttäuscht von + Dat*.
> - Характер: *ehrlich, großzügig, schüchtern, zuverlässig, geduldig, mutig*.
> - Стосунки: *sich verlieben, sich streiten, sich vertragen, sich entschuldigen, sich trennen* — усі зворотні.
> - *sympathisch* — про характер, *hübsch* — про вигляд. *Mir ist langweilig*, а не ~~Ich bin langweilig~~.
