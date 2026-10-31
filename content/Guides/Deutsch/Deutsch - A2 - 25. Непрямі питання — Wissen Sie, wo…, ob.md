---
title: Непрямі питання — Wissen Sie, wo…, ob
id: de-a2-indirekte-fragen
level: A2
icon: px:chat
tags: [deutsch, a2, grammar, indirekte-fragen, nebensatz, ob]
prerequisites: ["[[Deutsch - A2 - 11. Підрядні речення з weil, dass, wenn — дієслово в кінці]]"]
estimatedMinutes: 35
---

# Непрямі питання — Wissen Sie, wo…, ob

> [!success] Після цієї теми ти зможеш
> - ввічливо спитати в незнайомця чи в установі: *Können Sie mir sagen, wo das Bürgeramt ist?*;
> - перетворити питання зі словом *wann, wo, wie, warum* на непряме й поставити дієслово в кінці;
> - перетворити питання «так / ні» на непряме за допомогою ***ob***: *Wissen Sie, ob der Zug pünktlich ist?*;
> - правильно поставити кому й питальний знак у складному реченні;
> - відрізняти ***ob*** («чи») від ***wenn*** («якщо, коли») і ***dass*** («що»).

## Передбач

> [!quiz] Ти питаєш перехожого: «Можете сказати, коли їде потяг?» Яке речення правильне?
> level: A2 · type: single · id: de-a2-indirekte-fragen-q01
> - [ ] Können Sie mir sagen, wann fährt der Zug?
> - [x] Können Sie mir sagen, wann der Zug fährt?
> - [ ] Können Sie mir sagen wann der Zug fährt?
> - [ ] Können Sie mir sagen, ob wann der Zug fährt?
>
> **Пояснення:** після коми починається підрядне речення. Дієслово *fährt* іде в кінець: ***wann der Zug fährt***. Кома між головним і підрядним реченням обовʼязкова.

## Пояснення

### Пряме й непряме питання

Пряме питання ти ставиш напряму: *Wann fährt der Zug?* Непряме питання ховається всередині іншого речення, найчастіше після слів *Können Sie mir sagen…*, *Wissen Sie…*, *Ich weiß nicht…*. Воно звучить ввічливіше, а тому в Behörde, на пошті чи в магазині його використовують постійно.

Непряме питання є **підрядним реченням** (див. [[Deutsch - A2 - 11. Підрядні речення з weil, dass, wenn — дієслово в кінці]]), тому:

1. Перед ним стоїть **кома**.
2. Воно починається питальним словом (***wann, wo, wie***…) або словом ***ob***.
3. Змінне дієслово (**finites Verb**) іде **в кінець**.

| Пряме питання | Непряме питання |
|---|---|
| Wann **fährt** der Zug? | Können Sie mir sagen, wann der Zug **fährt**? |
| Wo **ist** das Bürgeramt? | Wissen Sie, wo das Bürgeramt **ist**? |
| Wie viel **kostet** das? | Ich möchte wissen, wie viel das **kostet**. |
| Warum **kommt** er nicht? | Ich weiß nicht, warum er nicht **kommt**. |

### Питання «так / ні»: ob

Питання без питального слова (*Ist das Büro offen?*) у непрямому вигляді потребує слова ***ob*** («чи»). Воно стоїть на початку підрядного речення, а дієслово знову в кінці.

| Пряме питання | Непряме питання |
|---|---|
| **Ist** der Zug pünktlich? | Wissen Sie, **ob** der Zug pünktlich **ist**? |
| **Kommt** er morgen? | Ich weiß nicht, **ob** er morgen **kommt**. |
| **Hast** du Zeit? | Ich möchte wissen, **ob** du Zeit **hast**. |

> [!diagram] Як побудувати непряме питання
> ```yaml
> layout: flow
> nodes:
>   - { id: head, label: "1. Головне речення", text: "Können Sie mir sagen,", note: "кома після нього обовʼязкова", tone: gray }
>   - { id: q, label: "2. Питальне слово", text: "wann / wo / wie / ob", note: "ob — для питань так / ні", tone: gray }
>   - { id: subj, label: "3. Підмет", text: "der Zug", note: "одразу після питального слова", tone: mint }
>   - { id: rest, label: "4. Решта", text: "pünktlich", note: "обставини, додатки", tone: gray }
>   - { id: verb, label: "5. Дієслово", text: "ist", note: "змінне дієслово — в кінці", tone: orange }
> edges:
>   - { from: head, to: q, label: "," }
>   - { from: q, to: subj }
>   - { from: subj, to: rest }
>   - { from: rest, to: verb }
> steps:
>   - { focus: head, note: "Починаємо головним реченням. Воно може бути питанням (Können Sie mir sagen…?) або твердженням (Ich weiß nicht…)." }
>   - { focus: q, note: "Далі питальне слово: wann, wo, wie, warum, was… Для питання, на яке відповідають «так» чи «ні», ставимо ob." }
>   - { focus: subj, note: "Зазвичай одразу після нього йде підмет (виняток: питальне слово може само бути підметом, напр. wer, was). Порядок як у підрядному реченні, без інверсії." }
>   - { focus: verb, note: "Змінне дієслово завжди в кінці: ...ob der Zug pünktlich ist. Мітка поруч із кольором: підмет — мʼятний, дієслово — помаранчевий, решта — сірий." }
> ```

### Дієслово в кінці: що робити з модальними й Perfekt

У підрядному реченні змінна частина дієслова стоїть **останньою**.

| Тип | Приклад |
|---|---|
| Відокремлюване дієслово | Wissen Sie, wann der Zug **abfährt**? (*abfahren* знову зʼєднується) |
| Модальне дієслово | Ich weiß nicht, ob ich morgen kommen **kann**. (модальне — в самому кінці) |
| Perfekt | Wissen Sie, wann der Zug **abgefahren ist**? (Partizip II + *ist*) |

> [!diagram] Пряме питання проти непрямого
> ```yaml
> layout: compare
> columns: { d: "Пряме питання", i: "Непряме питання" }
> nodes:
>   - { id: d1, col: d, label: "W-питання", text: "Wann fährt der Zug?", note: "дієслово на 2-му місці", tone: gray }
>   - { id: i1, col: i, label: "W-питання", text: "…, wann der Zug fährt.", note: "дієслово в кінці", tone: gray }
>   - { id: d2, col: d, label: "Питання так / ні", text: "Ist der Zug pünktlich?", note: "дієслово на 1-му місці", tone: gray }
>   - { id: i2, col: i, label: "Питання так / ні", text: "…, ob der Zug pünktlich ist.", note: "ob + дієслово в кінці", tone: gray }
>   - { id: d3, col: d, label: "Відокремлюване", text: "Wann fährt der Zug ab?", note: "ab — у кінці речення", tone: gray }
>   - { id: i3, col: i, label: "Відокремлюване", text: "…, wann der Zug abfährt.", note: "ab- знову прилипає до дієслова", tone: gray }
> steps:
>   - { focus: [d1, i1], note: "W-питання: у прямому дієслово друге, у непрямому — останнє." }
>   - { focus: [d2, i2], note: "Питання «так / ні»: у прямому дієслово перше, у непрямому зʼявляється ob, а дієслово йде в кінець." }
>   - { focus: [d3, i3], note: "Відокремлюване дієслово в підрядному реченні пишеться разом: abfährt, а не fährt … ab." }
> ```
> Кольори тут нічого не кодують; різниця видна з тексту.

### Знаки: кома й питальний знак

Кома перед підрядним реченням обовʼязкова: *Wissen Sie, ob er kommt?* Питальний знак у кінці ставимо, коли **головне речення** є питанням:

- *Können Sie mir sagen, wo der Bahnhof ist**?*** (питаємо)
- *Ich weiß nicht, wo der Bahnhof ist**.*** (стверджуємо)

### Чемні початки

| Початок | Приклад |
|---|---|
| Können Sie mir sagen, … | Können Sie mir sagen, wie spät es ist? |
| Könnten Sie mir bitte sagen, … | Könnten Sie mir bitte sagen, wann das Amt öffnet? (ще ввічливіше) |
| Wissen Sie, … | Wissen Sie, ob hier ein Geldautomat ist? |
| Darf ich fragen, … | Darf ich fragen, wie Sie heißen? |
| Ich möchte wissen, … | Ich möchte wissen, wie viel das kostet. |
| Ich weiß nicht, … | Ich weiß nicht, wo er wohnt. |
| Ich habe gefragt, … | Ich habe gefragt, ob das Büro geöffnet ist. |

Формула *Können Sie mir sagen…* не питає про вміння: це просто ввічливий спосіб попросити. З друзями кажуть *Weißt du, …?* Для Behörde й незнайомих тримайся *Sie*.

Інколи в розмові чуєш *Weißt du, wo ist das?* з дієсловом на другому місці. У нормі й на іспиті A2 пиши й кажи з дієсловом **в кінці**.

### ob, wenn чи dass

Українське «чи» і «якщо» часто плутають, адже в німецькій це різні слова:

| Слово | Значення | Приклад |
|---|---|---|
| **ob** | чи (питання так / ні) | Ich weiß nicht, **ob** er kommt. — Не знаю, чи він прийде. |
| **wenn** | якщо; коли (повторювано) | **Wenn** er kommt, bin ich froh. — Якщо він прийде, я буду рада. |
| **dass** | що (факт) | Ich weiß, **dass** er kommt. — Я знаю, що він прийде. |

## Приклади

- *Können Sie mir sagen, **wo** der Bahnhof **ist**?* — Чи можете Ви сказати мені, де вокзал?
- *Wissen Sie, **ob** das Büro heute **geöffnet ist**?* — Ви не знаєте, чи офіс сьогодні відчинений?
- *Ich weiß nicht, **wann** der Bus **kommt**.* — Я не знаю, коли прийде автобус.
- *Ich möchte wissen, **wie viel** das **kostet**.* — Я хочу знати, скільки це коштує.
- *Weißt du, **warum** er nicht **anruft**?* — Ти не знаєш, чому він не телефонує?
- *Darf ich fragen, **woher** Sie **kommen**?* — Чи можна спитати, звідки Ви?
- *Ich habe sie gefragt, **ob** sie Zeit **hat**.* — Я спитав її, чи є в неї час.
- *Können Sie mir erklären, **wie** der Automat **funktioniert**?* — Чи можете Ви пояснити мені, як працює автомат?
- *Ich weiß nicht, **ob** ich morgen kommen **kann**.* — Я не знаю, чи зможу прийти завтра.
- *Wissen Sie, **wann** der Zug **abgefahren ist**?* — Ви не знаєте, коли відійшов потяг?

## Слова

> [!word] sich erkundigen nach (+ Dat)
> ipa: /ɛɐ̯ˈkʊndɪɡn̩/ · pos: verb · level: B1 · id: de-a2-indirekte-fragen-w01
> uk: розпитати; довідатися про
> forms: erkundigen → erkundigte sich → hat sich erkundigt
> example: Ich möchte mich **nach** dem Preis **erkundigen**. — Я хочу довідатися про ціну.
> note: зворотне дієслово; прийменник nach + Dativ. Невідокремлюване: er-.

> [!word] herausfinden
> ipa: /hɛˈʁaʊ̯sˌfɪndn̩/ · pos: verb · level: B1 · id: de-a2-indirekte-fragen-w02
> uk: зʼясувати; дізнатися
> forms: herausfinden → fand heraus → hat herausgefunden
> example: Ich muss **herausfinden**, wann das Amt öffnet. — Мені треба зʼясувати, коли відкривається установа.
> note: відокремлюване: Ich finde es heraus. Сильне дієслово.

> [!word] nachfragen
> ipa: /ˈnaːxˌfʁaːɡn̩/ · pos: verb · level: B1 · id: de-a2-indirekte-fragen-w03
> uk: перепитати; уточнити
> forms: nachfragen → fragte nach → hat nachgefragt
> example: Ich frage noch einmal **nach**. — Я ще раз перепитаю.
> note: відокремлюване. ch після a = [x]: «нахфраґен». Різниця з fragen: nach- означає повторне чи уточнювальне питання.

> [!word] verraten
> ipa: /fɛɐ̯ˈʁaːtn̩/ · pos: verb · level: B1 · id: de-a2-indirekte-fragen-w04
> uk: розкрити (таємницю); видати; сказати (по секрету)
> forms: verraten → verriet → hat verraten (er verrät)
> example: Verraten Sie mir, wie das funktioniert? — Розкажете мені, як це працює?
> note: також «зрадити» (einen Freund verraten). Сильне дієслово, невідокремлюване.

> [!word] mitteilen
> ipa: /ˈmɪtˌtaɪ̯lən/ · pos: verb · level: B1 · id: de-a2-indirekte-fragen-w05
> uk: повідомляти; сповіщати
> forms: mitteilen → teilte mit → hat mitgeteilt
> example: Bitte **teilen** Sie uns **mit**, ob Sie kommen. — Будь ласка, повідомте нам, чи Ви прийдете.
> note: відокремлюване; mit- наголошене. Формальне слово для листів і оголошень.

> [!word] keine Ahnung
> ipa: /ˈkaɪ̯nə ˈaːnʊŋ/ · pos: phrase · level: A2 · id: de-a2-indirekte-fragen-w06
> uk: гадки не маю; не знаю
> example: Keine **Ahnung**, wo er wohnt. — Гадки не маю, де він живе.
> note: розмовне, з друзями. З незнайомими краще: Das weiß ich leider nicht.

> [!word] Bescheid sagen
> ipa: /bəˈʃaɪ̯t ˈzaːɡn̩/ · pos: phrase · level: B1 · id: de-a2-indirekte-fragen-w07
> uk: повідомити; дати знати
> example: Sagen Sie mir bitte **Bescheid**, ob Sie kommen. — Дайте мені, будь ласка, знати, чи Ви прийдете.
> note: також Bescheid wissen — бути в курсі. sch = [ʃ].

> [!word] nachschauen
> ipa: /ˈnaːxˌʃaʊ̯ən/ · pos: verb · level: B1 · id: de-a2-indirekte-fragen-w08
> uk: подивитися; перевірити
> forms: nachschauen → schaute nach → hat nachgeschaut
> example: Ich **schaue** kurz **nach**, ob das Paket da ist. — Я зараз перевірю, чи посилка вже тут.
> note: відокремлюване. Синонім: nachsehen (сильне: sah nach). AT, CH, південь Німеччини частіше nachschauen.

## Слухаємо

> [!listen] Яке питання ти почув?
> level: A2 · type: choice · speed: slow · id: de-a2-indirekte-fragen-l01
> audio: Wissen Sie, ob das Büro heute geöffnet ist?
> - [ ] Wissen Sie, wo das Büro heute geöffnet ist?
> - [ ] Wissen Sie, wann das Büro heute geöffnet ist?
> - [x] Wissen Sie, ob das Büro heute geöffnet ist?
>
> **Пояснення:** *ob* — «чи», питання з відповіддю «так / ні». *Wo* і *wann* питали б про місце чи час.

> [!listen] Напиши або скажи, що почув
> level: A2 · type: dictation · speed: slow · id: de-a2-indirekte-fragen-l02
> audio: Ich weiß nicht, wann der Bus kommt.

> [!listen] Заповни табличку на вокзалі
> level: A2 · type: fill · speed: slow · id: de-a2-indirekte-fragen-l03
> audio: A: Entschuldigung, können Sie mir sagen, wann der nächste Zug nach Hamburg fährt?
> audio: B: Der nächste Zug fährt um vierzehn Uhr zwanzig.
> audio: A: Und wissen Sie, ob er pünktlich ist?
> audio: B: Ja, bis jetzt gibt es keine Verspätung. Er fährt von Gleis sieben.
>
> ```fill
> Abfahrt: [[14.20|14:20|vierzehn Uhr zwanzig]] Uhr
> Gleis: [[7|sieben]]
> Pünktlich: [[ja]]
> ```

> [!listen] Де купити квиток?
> level: A2 · type: answer · speed: slow · id: de-a2-indirekte-fragen-l04
> audio: A: Entschuldigung, wissen Sie, wo man hier Fahrkarten kaufen kann?
> audio: B: Dort hinten am Automaten. Wenn Sie Hilfe brauchen, fragen Sie am Schalter.
> - [x] біля автомата
> - [ ] лише біля віконця
> - [ ] у поїзді
> - [ ] у пункті довідки
>
> **Пояснення:** *Dort hinten am Automaten* — там позаду, біля автомата. Віконце (*Schalter*) названо лише як місце, де допоможуть.

## Вимова

Непряме питання читається однією інтонаційною дугою: після коми зроби маленьку паузу, але не підвищуй голос на питальному слові. Голос піднімається (↗) лише наприкінці, якщо головне речення було питанням, і опускається (↘) в твердженні.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-indirekte-fragen-s01
> text: Können Sie mir sagen, wo der Bahnhof ist?
> ipa: /ˈkœnən ziː miːɐ̯ ˈzaːɡn̩ voː deːɐ̯ ˈbaːnhoːf ɪst/
> tip: ö в können — коротке й округлене, не «йо»; sagen — довге [aː], g як «ґ»; Bahnhof — h видихом, не «г». У кінці голос ↗.
> uk: Чи можете Ви сказати мені, де вокзал?

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-indirekte-fragen-s02
> text: Wissen Sie, ob das Büro geöffnet ist?
> ipa: /ˈvɪsn̩ ziː ɔp das byˈʁoː ɡəˈœfnət ɪst/
> tip: wissen — w = [v], ss = [s]; ob — b у кінці = [p], «оп»; Büro — ü = [y], язик як для «і», губи округлені.
> uk: Ви не знаєте, чи офіс відчинений?

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-indirekte-fragen-s03
> text: Ich weiß nicht, wann der Zug kommt.
> ipa: /ɪç vaɪ̯s nɪçt van deːɐ̯ tsuːk kɔmt/
> tip: ich і nicht — [ç], тихе «хь»; weiß — [aɪ̯], «вайс»; Zug — z = [ts], g у кінці = [k]. Інтонація ↘ (це твердження).
> uk: Я не знаю, коли приїде потяг.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-indirekte-fragen-s04
> text: Ich möchte wissen, wie viel das kostet.
> ipa: /ɪç ˈmœçtə ˈvɪsn̩ viː fiːl das ˈkɔstət/
> tip: viel — v читаємо як [f], «філь», довге [iː]; kostet — st = [st] усередині слова, о коротке.
> uk: Я хочу знати, скільки це коштує.

## Типові помилки українців

> [!pitfall] Дієслово лишилось на другому місці
> ~~Können Sie mir sagen, wo ist das Bürgeramt?~~ → Können Sie mir sagen, wo das Bürgeramt **ist**? В українській порядок слів не змінюється: «Скажіть, де міськрада?» Німецьке підрядне вимагає змінного дієслова в кінці. У розмові інколи чути й інше, але в Behörde та на іспиті тримайся правила.

> [!pitfall] «Чи» ≠ wenn і dass
> ~~Ich weiß nicht, wenn er kommt~~ → Ich weiß nicht, **ob** er kommt. (*Ich weiß nicht, dass er kommt* граматично можливе, але означає інше: «не знаю того, що він прийде».) Українське «чи» дорівнює німецькому ***ob***; ***wenn*** — «якщо» або «коли» (повторювано), ***dass*** — «що».

> [!pitfall] ob разом із питальним словом
> ~~Ich weiß nicht, ob wann er kommt~~, ~~Wissen Sie, wann ob er kommt~~ → Ich weiß nicht, **wann** er kommt / **ob** er kommt. У підрядному реченні лише одне вступне слово: або питальне слово, або *ob*. Питання про час, місце, причину вже має питальне слово.

> [!pitfall] Забута кома й неправильний знак
> ~~Ich weiß nicht wo er wohnt~~ → Ich weiß nicht**,** wo er wohnt**.** ~~Ich weiß nicht, wo er wohnt?~~ — питальний знак стоїть тільки, коли питання є головним реченням: *Wissen Sie, wo er wohnt**?***

## Ситуація: телефонуємо в Bürgeramt

> [!listen] Ярина телефонує в Bürgeramt. Що їй потрібно для Anmeldung?
> level: A2 · type: answer · speed: slow · id: de-a2-indirekte-fragen-l05
> audio: A: Bürgeramt Mitte, guten Tag.
> audio: B: Guten Tag, hier spricht Ivanenko. Können Sie mir sagen, welche Unterlagen ich für die Anmeldung brauche?
> audio: A: Sie brauchen Ihren Ausweis und die Wohnungsgeberbestätigung.
> audio: B: Und muss ich vorher einen Termin machen?
> audio: A: Ja, bitte buchen Sie einen Termin im Internet.
> - [x] документ, підтвердження від орендодавця й попередній запис
> - [ ] лише документ
> - [ ] лише довідка з банку
> - [ ] приходити без запису
>
> **Пояснення:** потрібні *Ausweis*, *Wohnungsgeberbestätigung* (підтвердження від власника житла) і *Termin* онлайн. Переклад: — Bürgeramt Mitte, добрий день. — Добрий день, говорить Іваненко. Чи можете Ви сказати, які документи потрібні для реєстрації? — Вам потрібні документ і підтвердження від орендодавця. — І чи треба мені попередньо записатися? — Так, запишіться, будь ласка, в інтернеті.

> [!speak] Ситуація: спитай про документи
> level: A2 · speed: slow · id: de-a2-indirekte-fragen-s05
> text: Können Sie mir sagen, welche Unterlagen ich brauche?
> ipa: /ˈkœnən ziː miːɐ̯ ˈzaːɡn̩ ˈvɛlçə ˈʊntɐlaːɡn̩ ɪç ˈbʁaʊ̯xə/
> tip: welche — ch після l = [ç], «вельхе»; brauche — ch після au = [x], глибоко; Unterlagen — наголос на першому складі.
> uk: Чи можете Ви сказати мені, які документи мені потрібні?

> [!speak] Ситуація: спитай, котра година
> level: A2 · speed: slow · id: de-a2-indirekte-fragen-s06
> text: Entschuldigung, wissen Sie, wie spät es ist?
> ipa: /ɛntˈʃʊldɪɡʊŋ ˈvɪsn̩ ziː viː ʃpɛːt ɛs ɪst/
> tip: Entschuldigung — наголос на -schul-, -ung = [ʊŋ]; spät — sp = [ʃp], довге [ɛː] (у повсякденній мові часто [eː]; не «я»).
> uk: Перепрошую, Ви не знаєте, котра година?

## Практика

> [!quiz] «Де вокзал?» Заверши: «Können Sie mir sagen, ___?»
> level: A2 · type: single · id: de-a2-indirekte-fragen-q02
> - [ ] wo ist der Bahnhof
> - [x] wo der Bahnhof ist
> - [ ] ob wo der Bahnhof ist
> - [ ] wo der Bahnhof
>
> **Пояснення:** питальне слово *wo* + підмет + дієслово в кінці: ***wo der Bahnhof ist***. Варіант *wo ist der Bahnhof* залишає пряме питання. Дієслово не можна пропускати.

> [!quiz] «Я не знаю, чи запізнюється потяг.» Яке слово пропущено: «Ich weiß nicht, ___ der Zug Verspätung hat.»
> level: A2 · type: single · id: de-a2-indirekte-fragen-q03
> - [ ] wann
> - [x] ob
> - [ ] dass
> - [ ] wie
>
> **Пояснення:** питання «так / ні» («чи запізнюється?») вводиться словом ***ob***: *Ich weiß nicht, ob der Zug Verspätung hat.* *Wann* питає про час, *wie* — про спосіб, *dass* — «що».

> [!quiz] Які речення правильні? Обери всі.
> level: A2 · type: multi · id: de-a2-indirekte-fragen-q04
> - [x] Ich weiß nicht, wo er wohnt.
> - [x] Wissen Sie, ob das Büro heute geöffnet ist?
> - [ ] Ich weiß nicht, wo wohnt er.
> - [ ] Wissen Sie, ob ist das Büro heute geöffnet?
> - [x] Können Sie mir sagen, wie viel das kostet?
>
> **Пояснення:** у правильних реченнях змінне дієслово останнє (*wohnt, ist, kostet*). У помилкових воно стоїть на другому місці після питального слова чи *ob*.

> [!quiz] Заповни пропуски питальним словом
> level: A2 · type: fill · id: de-a2-indirekte-fragen-q05 · bank: dass, warum
>
> ```text fill
> Wissen Sie, [[wo]] die Toilette ist? (де)
> Ich frage, [[ob]] der Laden heute offen ist. (чи)
> Weißt du, [[wann]] die Party beginnt? (коли)
> ```
>
> **Пояснення:** *wo* — місце, *ob* — питання «так / ні», *wann* — час. *Dass* і *warum* у дужках не відповідають: українські позначки («де», «чи», «коли») підказують потрібне слово.

> [!quiz] Склади питання: «Чи можете Ви сказати, де вокзал?»
> level: A2 · type: order · id: de-a2-indirekte-fragen-q06
>
> ```text order
> Können Sie mir sagen,
> wo
> der Bahnhof
> ist?
> ist der Bahnhof ✗
> ```
>
> **Пояснення:** після коми змінне дієслово *ist* — останнє. Варіант *ist der Bahnhof* лишає порядок прямого питання.

> [!quiz] Склади речення: «Я не знаю, чи він сьогодні прийде.»
> level: A2 · type: order · id: de-a2-indirekte-fragen-q07
>
> ```text order
> Ich weiß nicht,
> ob
> er
> heute
> kommt.
> kommt er ✗
> ```
>
> **Пояснення:** *ob* починає підрядне речення, а *kommt* стоїть у кінці.

> [!quiz] Склади питання про потяг.
> level: A2 · type: order · id: de-a2-indirekte-fragen-q08
>
> ```text order
> Wissen Sie,
> wann
> der Zug
> abfährt?
> fährt ab ✗
> ```
>
> **Пояснення:** у підрядному реченні відокремлюване дієслово пишемо разом і ставимо останнім: *abfährt*. Форма *fährt ab* — для головного речення.

> [!quiz] «Я не знаю, чи зможу прийти завтра.» Яка форма правильна?
> level: A2 · type: single · id: de-a2-indirekte-fragen-q09
> - [x] Ich weiß nicht, ob ich morgen kommen kann.
> - [ ] Ich weiß nicht, ob ich morgen kann kommen.
> - [ ] Ich weiß nicht, ob kann ich morgen kommen.
> - [ ] Ich weiß nicht, ob ich morgen können kommen.
>
> **Пояснення:** у підрядному реченні змінна форма модального дієслова (*kann*) стоїть у самому кінці після інфінітива: ***kommen kann***.

> [!quiz] «Ви не знаєте, коли відійшов потяг?» Яка форма правильна?
> level: A2 · type: single · id: de-a2-indirekte-fragen-q10
> - [ ] Wissen Sie, wann der Zug ist abgefahren?
> - [x] Wissen Sie, wann der Zug abgefahren ist?
> - [ ] Wissen Sie, wann der Zug abgefahren hat?
> - [ ] Wissen Sie, wann der Zug fährt ab?
>
> **Пояснення:** у Perfekt допоміжне дієслово в підрядному реченні стоїть останнім: *abgefahren **ist***. Дієслово *abfahren* утворює Perfekt із *sein*, тому не *hat*.

> [!quiz] Яка пунктуація правильна?
> level: A2 · type: single · id: de-a2-indirekte-fragen-q11
> - [x] Ich weiß nicht, wo das Amt ist.
> - [ ] Ich weiß nicht, wo das Amt ist?
> - [ ] Ich weiß nicht wo das Amt ist.
> - [ ] Ich weiß nicht; wo das Amt ist.
>
> **Пояснення:** кома перед підрядним обовʼязкова. Головне речення тут є твердженням, тому в кінці крапка.

> [!quiz] Які прямі питання треба перетворити через ob? Обери всі.
> level: A2 · type: multi · id: de-a2-indirekte-fragen-q12
> - [x] Kommt er morgen?
> - [x] Ist das Büro offen?
> - [ ] Wann kommt er?
> - [ ] Wo wohnst du?
> - [x] Hast du Zeit?
>
> **Пояснення:** питання, на які відповідають «так» або «ні», без питального слова, потребують *ob*. Питання з *wann, wo* зберігають своє питальне слово.

> [!quiz] «Скільки це коштує?» Яке вступне слово?
> level: A2 · type: single · id: de-a2-indirekte-fragen-q13
> - [ ] ob
> - [x] wie viel
> - [ ] wie viele
> - [ ] wo
>
> **Пояснення:** для незлічуваної величини (ціна) — ***wie viel***: *Können Sie mir sagen, wie viel das kostet?* *Wie viele* — для злічуваних, у множині.

> [!quiz] Заповни пропуски
> level: A2 · type: fill · id: de-a2-indirekte-fragen-q14 · bank: dass, weil
>
> ```text fill
> Ich habe sie gefragt, [[ob]] sie Zeit hat. (чи)
> Sag mir, [[wann]] der Kurs beginnt. (о котрій годині)
> Ich weiß nicht, [[warum]] er nicht anruft. (чому)
> Kannst du mir erklären, [[wie]] der Automat funktioniert? (як)
> ```
>
> **Пояснення:** *ob* — «чи», *wann* — «коли», *warum* — «чому», *wie* — «як». *Dass* («що») і *weil* («тому що») не відповідають значенню в дужках.

> [!quiz] «Де Ви живете?» Перетвори: «Darf ich fragen, ___?»
> level: A2 · type: single · id: de-a2-indirekte-fragen-q15
> - [x] wo Sie wohnen
> - [ ] wo wohnen Sie
> - [ ] ob Sie wohnen
> - [ ] wohnen Sie wo
>
> **Пояснення:** питальне слово *wo* лишається, підмет *Sie*, дієслово *wohnen* — в кінці. *Ob* тут зайве: питання не «так / ні».

> [!quiz] Склади ввічливе питання: «Чи не могли б Ви сказати мені, коли установа відчиняється?»
> level: A2 · type: order · id: de-a2-indirekte-fragen-q16
>
> ```text order
> Könnten Sie mir bitte sagen,
> wann
> das Amt
> öffnet?
> öffnet das Amt ✗
> ```
>
> **Пояснення:** *könnten* + *bitte* робить прохання ще ввічливішим. Підрядне речення: *wann das Amt öffnet*, дієслово в кінці.

## Фішки

> [!reel] 🤝 Können Sie mir sagen…? — не про вміння
> Коли німець питає *Können Sie mir sagen, wie spät es ist?*, він не перевіряє, чи ти вмієш говорити. Це просто ввічливий спосіб попросити про інформацію. Пряме *Wie spät ist es?* теж не груба фраза, але з незнайомими й у Behörde непряма форма звучить мʼякше.

> [!reel] 🧩 Одне слово ob — і дієслово втікає
> Достатньо поставити *ob* або питальне слово після коми, і змінне дієслово біжить у кінець речення. Це та сама рамка, що й у *weil* і *dass*. Один порядок слів — три сполучники, тож вивчивши його раз, ти пишеш правильно скрізь.

> [!reel] 🙋 Як чемно сказати «не знаю»
> *Keine Ahnung* — для друзів. Незнайомцю краще: *Das weiß ich leider nicht.* Є ще вираз *Da bin ich überfragt* — «тут я не можу відповісти». Усі три знайомі кожному німцю, а довгі форми звучать приязніше.

## Джерела та що почитати

- [DWDS — ob](https://www.dwds.de/wb/ob): значення й вживання сполучника ob, приклади.
- [Goethe-Institut — Durchführungsbestimmungen A2 (PDF)](https://www.goethe.de/pro/relaunch/prf/de/Durchfuehrungsbestimmungen_A2.pdf): офіційний опис формату іспиту Goethe A2.
- [DW — Nicos Weg (українською)](https://learngerman.dw.com/uk/nicos-weg/c-36519789): відеокурс A1–B1 з діалогами в побуті.

> [!important] Підсумок
> - Непряме питання — **підрядне речення**: кома, питальне слово або **ob**, змінне дієслово **в кінці**.
> - Питання з *wann, wo, wie, warum, was…* зберігають своє питальне слово; питання «так / ні» отримують **ob** («чи»).
> - Відокремлюване дієслово в підрядному пишемо разом (*abfährt*), модальне й допоміжне стоять останніми (*kommen kann*, *abgefahren ist*).
> - Питальний знак ставимо, лише коли питанням є головне речення (*Wissen Sie, …?*); у *Ich weiß nicht, …* — крапка.
> - **ob** ≠ **wenn** ≠ **dass**: «чи» ≠ «якщо / коли» ≠ «що».
