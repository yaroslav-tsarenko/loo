---
title: Підрядні речення з weil, dass, wenn — дієслово в кінці
id: de-a2-nebensaetze
level: A2
icon: px:link
tags: [deutsch, a2, grammar, nebensatz, weil, dass, wenn]
prerequisites: ["[[Deutsch - A1 - 09. Питання й місце дієслова — V2 і W-Fragen]]", "[[Deutsch - A1 - 19. Модальні дієслова — können, müssen, wollen, dürfen, möchten]]", "[[Deutsch - A2 - 01. Perfekt — haben чи sein і Partizip II]]"]
estimatedMinutes: 45
---

# Підрядні речення з weil, dass, wenn — дієслово в кінці

> [!success] Після цієї теми ти зможеш
> - побудувати підрядне речення з **weil** («тому що»), **dass** («що») і **wenn** («якщо, коли»): *Ich bleibe zu Hause, weil ich krank bin*;
> - поставити змінювану форму дієслова **в кінець** підрядного, навіть із модальним, Perfekt і відокремлюваним дієсловом;
> - поставити кому і правильно побудувати речення, якщо підрядне стоїть першим: *Wenn ich Zeit habe, komme ich*;
> - відрізнити **weil** від **denn** і **dass** від **das**.

## Передбач

> [!quiz] Як сказати: «Я залишаюся вдома, бо я хворий»?
> level: A2 · type: single · id: de-a2-nebensaetze-q01
> - [ ] Ich bleibe zu Hause, weil ich bin krank.
> - [x] Ich bleibe zu Hause, weil ich krank bin.
> - [ ] Ich bleibe zu Hause, weil bin ich krank.
> - [ ] Ich bleibe zu Hause, weil krank ich bin.
>
> **Пояснення:** після *weil* змінювана форма дієслова (**bin**) іде **в кінець** речення. Українською порядок слів вільний («бо я хворий» / «бо хворий я»), у німецькому підрядному він жорсткий. У живій мові інколи чути *weil ich bin krank*, але в тексті й на іспиті пиши дієслово в кінці.

## Головне й підрядне речення

**Головне речення** (Hauptsatz) може стояти самостійно, змінюване дієслово — на другому місці (V2, див. [[Deutsch - A1 - 09. Питання й місце дієслова — V2 і W-Fragen]]):

*Ich bleibe zu Hause.* — дієслово *bleibe* на 2-му місці.

**Підрядне речення** (Nebensatz) починається сполучником і не може стояти само. Змінювана форма дієслова йде **в кінець**:

*Ich bleibe zu Hause, **weil** ich krank **bin**.*

Три сполучники цієї теми:

| Сполучник | Значення | Приклад |
|---|---|---|
| **weil** | тому що (причина) | Ich lerne Deutsch, **weil** ich in Berlin arbeite. |
| **dass** | що (після думок і слів) | Ich glaube, **dass** er heute kommt. |
| **wenn** | якщо; щоразу коли | **Wenn** es regnet, bleibe ich zu Hause. |

Перед кожним із них — **кома**. На відміну від українського «що» / «бо», де кома теж є, у німецькому вона обовʼязкова завжди.

> [!diagram] Головне + підрядне: куди йде дієслово
> ```yaml
> layout: flow
> nodes:
>   - { id: s1, label: "підмет", text: "Ich", tone: mint }
>   - { id: v1, label: "дієслово · 2-ге місце", text: "bleibe", tone: orange }
>   - { id: r1, label: "решта", text: "zu Hause,", tone: gray }
>   - { id: c, label: "сполучник", text: "weil", tone: gray }
>   - { id: s2, label: "підмет", text: "ich", tone: mint }
>   - { id: r2, label: "решта", text: "krank", tone: gray }
>   - { id: v2, label: "дієслово · в кінець", text: "bin.", tone: orange }
> steps:
>   - { focus: [s1, v1, r1], note: "Головне речення: підмет, дієслово на 2-му місці, решта. Ich bleibe zu Hause." }
>   - { focus: c, note: "Додаємо сполучник weil. Після нього починається підрядне, а перед ним — кома." }
>   - { focus: [s2, r2], note: "Далі — підмет і решта речення: ich krank." }
>   - { focus: v2, note: "Змінюване дієслово йде в кінець: … weil ich krank bin. Не ~~weil ich bin krank~~." }
> ```
> Сполучник → підмет → решта → дієслово.

## Дієслово в кінці: різні типи

| Тип дієслова | Головне речення | Підрядне речення |
|---|---|---|
| Просте | Er **kommt** heute. | …, dass er heute **kommt**. |
| Модальне + інфінітив | Ich **muss** arbeiten. | …, weil ich arbeiten **muss**. |
| Perfekt | Er **hat** gegessen. | …, dass er gegessen **hat**. |
| Відокремлюване | Ich **stehe** früh **auf**. | …, weil ich früh **aufstehe**. |

Що треба запамʼятати:

- у підрядному речення з модальним змінюване дієслово (*muss*) стає **останнім**, інфінітив — перед ним: *arbeiten muss*;
- у Perfekt допоміжне дієслово (*hat, ist*) — останнє: *gegessen **hat***;
- відокремлюване дієслово в підрядному **не відокремлюється**: *weil ich früh **aufstehe***, *wenn ich zu Hause **ankomme***.

## Підрядне речення першим

Підрядне може стояти перед головним. Тоді воно займає **перше місце** в цілому реченні, і головне починається зі змінюваного дієслова (на 2-му місці речення!):

- Ich komme, **wenn** ich Zeit habe.
- **Wenn** ich Zeit habe, **komme** ich.

Помилка: ~~Wenn ich Zeit habe, ich komme~~.

> [!diagram] Підрядне першим: V1 у головному
> ```yaml
> layout: flow
> nodes:
>   - { id: nb, label: "1-ше місце · підрядне", text: "Wenn ich Zeit habe,", tone: gray }
>   - { id: v, label: "2-ге місце · дієслово", text: "komme", tone: orange }
>   - { id: s, label: "підмет", text: "ich", tone: mint }
> steps:
>   - { focus: nb, note: "Підрядне речення — це ціле «перше місце». Воно може бути довгим, але це лише одне місце." }
>   - { focus: v, note: "Одразу після нього — змінюване дієслово головного: komme." }
>   - { focus: s, note: "І лише потім підмет: komme ich. Тому в кінці виходить пара «дієслово + підмет» через кому." }
> ```

## weil чи denn?

Обидва означають «тому що» / «бо», але за порядком слів різні:

| | weil | denn |
|---|---|---|
| Порядок слів | дієслово в кінці | **звичайний** (V2) |
| Відповідь на Warum? | так: *Weil ich krank bin.* | ні: ~~Denn ich bin krank.~~ |
| Підрядне перед головним | можна: *Weil ich krank bin, bleibe ich.* | ні |

- Ich bleibe zu Hause, **weil** ich krank **bin**.
- Ich bleibe zu Hause, **denn** ich **bin** krank.

*denn* не змінює порядок слів (це сполучник «нульової позиції»; докладно — в темі [[Deutsch - A2 - 23. Сполучники — und, aber, denn, sondern і deshalb, trotzdem]]).

## dass: після думок, слів, почуттів

*dass* вводить зміст: що хтось знає, думає, каже, надіється, або оцінка:

- Ich weiß, **dass** er Arzt ist. — Я знаю, що він лікар.
- Ich hoffe, **dass** du kommst. — Сподіваюся, що ти прийдеш.
- Es ist schade, **dass** du nicht kommst. — Шкода, що ти не прийдеш.

Після дієслів думки й мовлення *dass* часто опускають, тоді речення — звичайне, з V2: *Ich glaube, er kommt morgen.* Обидві форми правильні.

> [!warning] dass ≠ das
> *das* — артикль або вказівний займенник (*das Buch, das ist gut*); *dass* — сполучник перед підрядним реченням. Вимова однакова — [das]. Перевірка: якщо можна замінити на *dieses* або *welches*, це *das*; якщо після слова починається підрядне речення з дієсловом у кінці — *dass*. У Швейцарії букви ß немає, але *dass* пишуть однаково скрізь.

## wenn: якщо й коли

*wenn* означає і умову («якщо»), і повторювану дію («щоразу коли»):

- **Wenn** du willst, kannst du mitkommen. — Якщо хочеш, можеш піти з нами.
- **Wenn** es regnet, bleibe ich zu Hause. — Коли (якщо) йде дощ, я лишаюся вдома.

Не плутай з **wann** — це питальне слово «коли?»: *Wann kommst du?* (Про *wenn / als* докладніше — на рівні B1; про *ob* — у темі [[Deutsch - A2 - 25. Непрямі питання — Wissen Sie, wo…, ob]].)

## Приклади

- Ich bleibe zu Hause, weil ich krank bin. — Я лишаюся вдома, бо я хворий.
- Ich komme nicht, weil ich arbeiten muss. — Я не прийду, бо мушу працювати.
- Ich glaube, dass er heute nicht kommt. — Я думаю, що він сьогодні не прийде.
- Ich weiß, dass du gestern gearbeitet hast. — Я знаю, що ти вчора працював.
- Wenn es regnet, bleiben wir zu Hause. — Якщо піде дощ, ми залишимося вдома.
- Ich rufe dich an, wenn ich zu Hause ankomme. — Я зателефоную, коли доберуся додому.
- Wenn ich Zeit habe, komme ich gern. — Якщо матиму час, охоче прийду.
- Er kommt nicht, denn er ist krank. — Він не прийде, бо він хворий.
- Es ist schade, dass du nicht kommst. — Шкода, що ти не прийдеш.
- Ich hoffe, dass der Zug pünktlich ist. — Сподіваюся, що потяг прибуде вчасно.

## Слова

> [!word] weil
> ipa: /vaɪ̯l/ · pos: conj · level: A2 · id: de-a2-nebensaetze-w01
> uk: тому що, бо
> example: Ich lerne Deutsch, **weil** ich in Berlin arbeite. — Я вчу німецьку, бо працюю в Берліні.
> note: після weil — дієслово в кінці. У розмові інколи V2 (weil ich habe keine Zeit), на письмі й на екзамені — ні. w = «в».

> [!word] dass
> ipa: /das/ · pos: conj · level: A2 · id: de-a2-nebensaetze-w02
> uk: що (сполучник)
> example: Ich glaube, **dass** er recht hat. — Я думаю, що він має рацію.
> note: вимова збігається з das (артикль). Пишемо dass лише як сполучник. До реформи 1996 р. писали daß.

> [!word] wenn
> ipa: /vɛn/ · pos: conj · level: A2 · id: de-a2-nebensaetze-w03
> uk: якщо; коли (щоразу)
> example: **Wenn** du Zeit hast, ruf mich an. — Якщо маєш час, зателефонуй мені.
> note: не плутай з wann (коли? — питання). Ще: wenn ich nicht irre — якщо не помиляюся.

> [!word] denn
> ipa: /dɛn/ · pos: conj · level: A2 · id: de-a2-nebensaetze-w04
> uk: бо, адже
> example: Er kommt nicht, **denn** er ist krank. — Він не прийде, бо він хворий.
> note: не змінює порядок слів (V2 після denn). Не вживається на початку відповіді на Warum? — там weil. У питаннях «denn» — частка: Was ist denn los? (Що ж сталося?).

> [!word] der Grund
> ipa: /ɡʁʊnt/ · pos: noun · level: A2 · id: de-a2-nebensaetze-w05
> uk: причина; підстава
> forms: die Gründe
> example: Was ist der **Grund**? — Яка причина?
> note: кінцеве d = [t]: «грунт». Ще: der Grund = ґрунт, земля (im Grunde — в основі).

> [!word] hoffen
> ipa: /ˈhɔfn̩/ · pos: verb · level: A2 · id: de-a2-nebensaetze-w06
> uk: сподіватися
> forms: hoffen → hoffte → hat gehofft
> example: Ich **hoffe**, dass es morgen nicht regnet. — Сподіваюся, що завтра не буде дощу.
> note: hoffen auf + Akk: Ich hoffe auf gutes Wetter.

> [!word] meinen
> ipa: /ˈmaɪ̯nən/ · pos: verb · level: A2 · id: de-a2-nebensaetze-w07
> uk: вважати; мати на увазі
> forms: meinen → meinte → hat gemeint
> example: Ich **meine**, dass das zu teuer ist. — Я вважаю, що це задорого.
> note: Was meinst du? — Що ти думаєш?

> [!word] schade
> ipa: /ˈʃaːdə/ · pos: adj · level: A2 · id: de-a2-nebensaetze-w08
> uk: шкода
> example: Es ist **schade**, dass du nicht kommst. — Шкода, що ти не прийдеш.
> note: Wie schade! — Яка шкода! Не змінюється за родами й відмінками.

> [!word] der Nebensatz
> ipa: /ˈneːbn̩ˌzats/ · pos: noun · level: A2 · id: de-a2-nebensaetze-w09
> uk: підрядне речення
> forms: die Nebensätze
> example: Im **Nebensatz** steht das Verb am Ende. — У підрядному реченні дієслово стоїть в кінці.
> note: Hauptsatz — головне речення. Складне слово: neben + Satz.

> [!word] das Komma
> ipa: /ˈkɔma/ · pos: noun · level: A2 · id: de-a2-nebensaetze-w10
> uk: кома
> forms: die Kommas
> example: Vor „weil“ steht immer ein **Komma**. — Перед «weil» завжди стоїть кома.
> note: множина також die Kommata (книжн.). Німецькі лапки — „так“.

## Слухаємо

> [!listen] Що ти почув?
> level: A2 · type: choice · speed: slow · id: de-a2-nebensaetze-l01
> audio: Ich bleibe zu Hause, weil ich krank bin.
> - [x] Ich bleibe zu Hause, weil ich krank bin.
> - [ ] Ich bleibe zu Hause, denn ich bin krank.
> - [ ] Ich bin krank, weil ich zu Hause bleibe.
>
> **Пояснення:** *weil ich krank bin* — дієслово в кінці. У другому реченні *denn ich bin krank* — V2. Третє змінює причину і наслідок.

> [!listen] Що ти почув?
> level: A2 · type: choice · speed: slow · id: de-a2-nebensaetze-l02
> audio: Wenn es regnet, bleiben wir zu Hause.
> - [x] Wenn es regnet, bleiben wir zu Hause.
> - [ ] Wir bleiben zu Hause, wenn es regnet.
> - [ ] Wenn wir zu Hause bleiben, regnet es.
>
> **Пояснення:** друге речення має той самий зміст, але інший порядок; третє змінює причину й наслідок.

> [!listen] Напиши або скажи, що почув
> level: A2 · type: dictation · speed: slow · id: de-a2-nebensaetze-l03
> audio: Ich glaube, dass er heute nicht kommt.
> explain: після *dass* — підмет *er*, а змінюване дієслово *kommt* — в кінці.

> [!listen] Напиши або скажи, що почув
> level: A2 · type: dictation · speed: slow · id: de-a2-nebensaetze-l04
> audio: Wenn ich Zeit habe, rufe ich dich an.
> explain: підрядне *Wenn ich Zeit habe* — перше місце, тому одразу *rufe*, а потім *ich*.

> [!listen] Послухай діалог. Що каже Том?
> level: A2 · type: answer · speed: slow · id: de-a2-nebensaetze-l05
> audio: A: Warum kommt Tom nicht zur Party?
> audio: B: Er sagt, dass er arbeiten muss.
> audio: A: Aber ich glaube, er ist einfach müde.
> audio: B: Vielleicht. Wenn er Zeit hat, ruft er sicher an.
> - [x] що мусить працювати
> - [ ] що хворий
> - [ ] що не любить вечірки
>
> **Пояснення:** *Er sagt, dass er arbeiten muss* — «мусить працювати». Те, що він, можливо, просто втомився, — припущення співрозмовника (*ich glaube*).

## Вимова

Підрядне речення має свою мелодію: перед комою голос злегка піднімається або лишається рівним, а в кінці — спадає ↘. Сполучники (*weil, dass, wenn*) слабкі, без наголосу; наголос падає на змістові слова й на дієслово в кінці підрядного.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-nebensaetze-s01
> text: Ich bleibe zu Hause, weil ich krank bin.
> ipa: /ɪç ˈblaɪ̯bə tsuː ˈhaʊ̯zə vaɪ̯l ɪç kʁaŋk bɪn/
> tip: пауза на комі. weil — [vaɪ̯l], w = «в». ei = [aɪ̯]. Дієслово bin у кінці — слабке, коротке.
> uk: Я лишаюся вдома, бо я хворий.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-nebensaetze-s02
> text: Ich glaube, dass er heute nicht kommt.
> ipa: /ɪç ˈɡlaʊ̯bə das eːɐ̯ ˈhɔʏ̯tə nɪçt kɔmt/
> tip: dass — коротке слабке [das]. eu = [ɔʏ̯]. nicht — [nɪçt], ch після [ɪ] — легке [ç].
> uk: Я думаю, що він сьогодні не прийде.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-nebensaetze-s03
> text: Wenn es regnet, bleiben wir zu Hause.
> ipa: /vɛn ɛs ˈʁeːɡnət ˈblaɪ̯bn̩ viːɐ̯ tsuː ˈhaʊ̯zə/
> tip: regnet — довге [eː], далі [ɡn]. Після коми одразу bleiben. Hause: h — легкий видих.
> uk: Якщо піде дощ, ми залишимося вдома.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-nebensaetze-s04
> text: Er kommt nicht, denn er ist krank.
> ipa: /eːɐ̯ kɔmt nɪçt dɛn eːɐ̯ ɪst kʁaŋk/
> tip: після denn — звичайний порядок: er ist. denn слабке, без наголосу. krank: ng — один звук [ŋ].
> uk: Він не прийде, бо він хворий.

## Типові помилки українців

> [!pitfall] Дієслово не в кінці: «weil ich habe keine Zeit»
> ~~Ich komme nicht, weil ich habe keine Zeit~~ → Ich komme nicht, weil ich keine Zeit **habe**. В українській підрядному можна «бо в мене немає часу» — порядок слів вільний. У німецькій після *weil, dass, wenn* змінюване дієслово завжди (на письмі) останнє. У розмові інколи можна почути V2 після *weil*; на екзамені Goethe та в листах це вважається помилкою.

> [!pitfall] Підрядне першим: «Wenn ich Zeit habe, ich komme»
> ~~Wenn ich Zeit habe, ich komme~~ → Wenn ich Zeit habe, **komme ich**. Підрядне речення займає перше місце, тому далі йде дієслово головного (V2), а лише потім підмет. Це частий випадок: *Weil es regnet, bleibe ich zu Hause.*

> [!pitfall] denn з дієсловом у кінці та weil з V2 в одному реченні
> ~~Ich bleibe, denn ich krank bin~~ → Ich bleibe, **denn** ich **bin** krank / Ich bleibe, **weil** ich krank **bin**. Не змішуй: *denn* — звичайний порядок слів, *weil* — дієслово в кінці. Також ~~Denn ich bin krank, bleibe ich zu Hause~~ не існує: *denn* не стоїть перед головним.

> [!pitfall] wenn чи wann, dass чи das
> ~~Wenn kommt der Zug?~~ → **Wann** kommt der Zug? *wann* — лише питання, *wenn* — умова чи «щоразу коли». ~~Ich glaube, das er kommt~~ → Ich glaube, **dass** er kommt. Після коми й слів думки (*glauben, wissen, hoffen*) — *dass*, не *das*.

## Ситуація: пояснюємо, чому запізнюємося

> [!listen] Колега телефонує на роботу. Чому він запізнюється?
> level: A2 · type: answer · speed: slow · id: de-a2-nebensaetze-l06
> audio: A: Guten Morgen, Frau Weber. Ich komme heute später, weil mein Zug Verspätung hat.
> audio: B: Kein Problem. Aber rufen Sie bitte an, wenn Sie im Büro sind.
> audio: A: Natürlich. Ich hoffe, dass ich um neun Uhr da bin.
> - [x] його потяг запізнюється
> - [ ] він захворів
> - [ ] він іде до лікаря
>
> **Пояснення:** причина названа після *weil*: *weil mein Zug Verspätung hat*. Умову дзвінка — після *wenn*: *wenn Sie im Büro sind*.

Скажи те саме вголос.

> [!speak] «Я прийду пізніше, бо мій потяг запізнюється»
> level: A2 · speed: slow · id: de-a2-nebensaetze-s05
> text: Ich komme später, weil mein Zug Verspätung hat.
> ipa: /ɪç ˈkɔmə ˈʃpɛːtɐ vaɪ̯l maɪ̯n tsuːk fɛɐ̯ˈʃpɛːtʊŋ hat/
> tip: Zug — g у кінці звучить як [k]: «цук». Verspätung — наголос на -spä-, ä довге [ɛː]. Дієслово hat — в кінці.
> uk: Я прийду пізніше, бо мій потяг запізнюється.

> [!speak] «Я зателефоную, коли буду в офісі»
> level: A2 · speed: slow · id: de-a2-nebensaetze-s06
> text: Ich rufe an, wenn ich im Büro bin.
> ipa: /ɪç ˈʁuːfə an vɛn ɪç ɪm byˈʁoː bɪn/
> tip: rufe an — відокремлюване дієслово в головному реченні розірване; у підрядному (… wenn ich im Büro bin) дієслово bin — в кінці.
> uk: Я зателефоную, коли буду в офісі.

## Практика

> [!quiz] Яке речення правильне?
> level: A2 · type: single · id: de-a2-nebensaetze-q02
> - [x] Wenn es regnet, bleiben wir zu Hause.
> - [ ] Wenn es regnet, wir bleiben zu Hause.
> - [ ] Wenn es regnet, wir zu Hause bleiben.
> - [ ] Wenn es regnet bleiben, wir zu Hause.
>
> **Пояснення:** підрядне — перше місце, далі дієслово головного: *bleiben wir*. Підмет перед дієсловом (*wir bleiben*) — це помилка «українського» порядку слів.

> [!quiz] Яке слово пропущено: «Ich glaube, ___ er heute nicht kommt.»?
> level: A2 · type: single · id: de-a2-nebensaetze-q03
> - [x] dass
> - [ ] das
> - [ ] was
> - [ ] ob
>
> **Пояснення:** після *glauben* підрядне речення вводить **dass**. *das* — артикль, *was* — «що?» (питання), *ob* — «чи» у непрямому питанні.

> [!quiz] Яке слово пропущено: «Ich komme nicht, weil ich morgen früh aufstehen ___.»?
> level: A2 · type: single · id: de-a2-nebensaetze-q04
> - [x] muss
> - [ ] müssen
> - [ ] mussen
> - [ ] gemusst
>
> **Пояснення:** підмет *ich* → *muss*; воно стоїть **останнім**, після інфінітива *aufstehen*. *müssen* — для *wir / sie*, *mussen* — неіснуюча форма.

> [!quiz] Як правильно: «Ich rufe dich an, wenn ich zu Hause ___.»?
> level: A2 · type: single · id: de-a2-nebensaetze-q05
> - [x] ankomme
> - [ ] komme an
> - [ ] angekommen
> - [ ] ankommen
>
> **Пояснення:** у підрядному відокремлюване дієслово **не розділяється** і стоїть в кінці: *ankomme*. *komme an* — це порядок головного речення.

> [!quiz] Як правильно: «Ich glaube, dass er schon ___.»?
> level: A2 · type: single · id: de-a2-nebensaetze-q06
> - [x] gegessen hat
> - [ ] hat gegessen
> - [ ] gehabt gegessen
> - [ ] essen hat
>
> **Пояснення:** у підрядному Perfekt допоміжне дієслово (*hat*) стоїть останнім: *gegessen **hat***. *hat gegessen* — порядок головного речення.

> [!quiz] Яке слово пропущено: «Ich lerne Deutsch, ___ ich in Berlin arbeite.»?
> level: A2 · type: single · id: de-a2-nebensaetze-q07
> - [x] weil
> - [ ] denn
> - [ ] und
> - [ ] aber
>
> **Пояснення:** дієслово *arbeite* в кінці → підрядне речення → **weil**. *denn, und, aber* не змінюють порядок слів, тому з ними було б *ich arbeite in Berlin*.

> [!quiz] Яке слово пропущено: «Ich lerne Deutsch, ___ ich arbeite in Berlin.»?
> level: A2 · type: single · id: de-a2-nebensaetze-q08
> - [x] denn
> - [ ] dass
> - [ ] wenn
> - [ ] ob
>
> **Пояснення:** дієслово *arbeite* на 2-му місці (V2) → **denn** (причина без зміни порядку слів). *dass / wenn / ob* вимагають дієслова в кінці.

> [!quiz] Які речення правильні?
> level: A2 · type: multi · id: de-a2-nebensaetze-q09
> - [x] Ich weiß, dass er Arzt ist.
> - [x] Wenn du willst, kannst du mitkommen.
> - [ ] Ich glaube, dass er kommt nicht.
> - [x] Er kommt nicht, denn er ist krank.
> - [ ] Weil ich habe Hunger, esse ich.
>
> **Пояснення:** *dass er Arzt ist* і *Wenn du willst, kannst du …* — дієслово в кінці / V1 у головному. *dass er kommt nicht* і *Weil ich habe Hunger* — дієслово не в кінці підрядного. *denn er ist krank* — звичайний порядок слів.

> [!quiz] У яких реченнях кому поставлено правильно?
> level: A2 · type: multi · id: de-a2-nebensaetze-q10
> - [x] Ich hoffe, dass du kommst.
> - [ ] Ich hoffe dass du kommst.
> - [x] Wenn es kalt ist, trage ich eine Jacke.
> - [ ] Wenn es kalt ist trage ich eine Jacke.
> - [ ] Ich bleibe zu Hause weil ich müde bin.
>
> **Пояснення:** кома ставиться **перед** сполучником підрядного (*, dass*) і **після** підрядного, якщо воно перше (*…ist, trage*). Пропуск коми — помилка, навіть якщо українською ти вагаєшся.

> [!quiz] Заповни пропуски сполучниками і дієсловами
> level: A2 · type: fill · bank: denn, ist · id: de-a2-nebensaetze-q11
>
> ```text fill
> Ich bleibe zu Hause, [[weil]] ich krank [[bin]].
> Ich glaube, [[dass]] du recht [[hast]].
> [[Wenn]] es regnet, [[bleibe]] ich zu Hause.
> ```
>
> **Пояснення:** причина з дієсловом в кінці — *weil … bin*; змістове речення — *dass … hast*; умова — *Wenn … , bleibe ich*. *denn* не змінює порядок слів, а *ist* не підходить до *ich*.

> [!quiz] Заповни пропуски дієсловами
> level: A2 · type: fill · bank: müssen, kommt · id: de-a2-nebensaetze-q12
>
> ```text fill
> Ich komme nicht, weil ich arbeiten [[muss]].
> Er sagt, dass er morgen nicht [[kommen]] [[kann]].
> ```
>
> **Пояснення:** у підрядному останнім стоїть змінюване дієслово: *arbeiten **muss***, *kommen **kann***. Інфінітив — безпосередньо перед ним. *müssen* не узгоджується з *ich*, *kommt* не стоїть перед *kann*.

> [!quiz] Склади речення: «Я залишаюся вдома, бо я хворий.»
> level: A2 · type: order · id: de-a2-nebensaetze-q13
>
> ```text order
> Ich
> bleibe
> zu
> Hause,
> weil
> ich
> krank
> bin.
> denn ✗
> ```
>
> **Пояснення:** з *weil* змінюване дієслово *bin* — в кінці. З *denn* порядок був би *denn ich bin krank*.

> [!quiz] Склади речення: «Якщо маю час, прийду.»
> level: A2 · type: order · id: de-a2-nebensaetze-q14
>
> ```text order
> Wenn
> ich
> Zeit
> habe,
> komme
> ich.
> weil ✗
> ```
>
> **Пояснення:** підрядне *Wenn ich Zeit habe* — на першому місці, далі дієслово *komme*, і лише потім підмет *ich*.

> [!quiz] Склади речення: «Я знаю, що він завтра зможе прийти.»
> level: A2 · type: order · id: de-a2-nebensaetze-q15
>
> ```text order
> Ich
> weiß,
> dass
> er
> morgen
> kommen
> kann.
> denn ✗
> ```
>
> **Пояснення:** після *dass* — підмет *er*, обставина, інфінітив *kommen*, а модальне *kann* — останнім.

> [!quiz] Яке слово пропущено: «___ kommt der Zug?»
> level: A2 · type: single · id: de-a2-nebensaetze-q16
> - [x] Wann
> - [ ] Wenn
> - [ ] Weil
> - [ ] Dass
>
> **Пояснення:** питання «коли?» — **wann**. *wenn* — сполучник підрядного речення («якщо, коли»).

> [!quiz] Яке слово пропущено: «___ du willst, kannst du mitkommen.»
> level: A2 · type: single · id: de-a2-nebensaetze-q17
> - [x] Wenn
> - [ ] Wann
> - [ ] Dass
> - [ ] Denn
>
> **Пояснення:** українське «якщо» — **wenn**. *wann* — питальне слово, *dass* — «що», *denn* — «бо» (і не стоїть на початку).

> [!quiz] Відповідь на питання: «Warum lernst du Deutsch?»
> level: A2 · type: single · id: de-a2-nebensaetze-q18
> - [x] Weil ich in Deutschland arbeiten möchte.
> - [ ] Denn ich in Deutschland arbeiten möchte.
> - [ ] Dass ich in Deutschland arbeiten möchte.
> - [ ] Wenn ich in Deutschland arbeiten möchte.
>
> **Пояснення:** відповідь на *Warum?* починається з **weil** (з дієсловом у кінці). *denn* не відкриває відповіді і не вимагає дієслова в кінці, *dass* і *wenn* мають інше значення.

## Фішки

> [!reel] 📚 Дієслово напрочуд пізно
> Марк Твен у есеї «The Awful German Language» (1880) скаржився, що німецьке дієслово іноді зʼявляється лише в самому кінці довгого речення, тож читач чекає на головне. Для нас це знайоме з підрядних: *… weil ich morgen früh aufstehen **muss***. Розвʼязок один — слухати до кінця.

> [!reel] 🗣 weil + V2: розмовна звичка
> Німці в розмові часто кажуть *weil ich habe keine Zeit*, ніби *weil* — це *denn*. Лінгвісти бачать у цьому окрему інтонацію та паузу: слово *weil* стає схожим на «бо, мовляв». Але правило на письмі й на іспиті однозначне: після *weil* — дієслово в кінці.

> [!reel] ß → ss: чому dass
> До реформи правопису 1996 р. сполучник писали **daß**. Тепер правило просте: після короткого голосного — *ss* (*dass, muss*), після довгого — *ß* (*Straße*). Артикль *das* лишився, тож у письмі два слова з однаковою вимовою стали різними.

## Джерела та що почитати

- [DWDS — weil](https://www.dwds.de/wb/weil): значення, вживання, розмовний порядок слів.
- [DWDS — dass](https://www.dwds.de/wb/dass) і [Duden — dass](https://www.duden.de/rechtschreibung/dass): правопис і правило das / dass.
- [DWDS — wenn](https://www.dwds.de/wb/wenn): значення «якщо» і «коли».
- [DWDS — denn](https://www.dwds.de/wb/denn): сполучник і частка.
- [Wikipedia — Mark Twain](https://de.wikipedia.org/wiki/Mark_Twain): автор «The Awful German Language».

> [!important] Підсумок
> - Підрядне речення починається сполучником (*weil, dass, wenn*); перед ним — **кома**, а змінюване дієслово — **в кінці**.
> - Модальне: *… weil ich arbeiten **muss***; Perfekt: *… dass er gegessen **hat***; відокремлюване: *… wenn ich **ankomme***.
> - Підрядне першим → у головному **дієслово перед підметом**: *Wenn ich Zeit habe, **komme ich***.
> - *weil* — дієслово в кінці, *denn* — звичайний порядок слів.
> - *dass* (сполучник) ≠ *das* (артикль); *wenn* («якщо») ≠ *wann* («коли?»).
