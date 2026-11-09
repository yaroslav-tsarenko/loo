---
title: Емфатична інтонація й контрастивний наголос
id: de-c1-intonation
level: C1
icon: px:mic
tags: [deutsch, c1, pronunciation, intonation, fokus, kontrastakzent, ironie, partikeln]
prerequisites: ["[[Deutsch - A2 - 18. Мелодія речення — інтонація]]", "[[Deutsch - B2 - 12. Регіональна вимова — Північ, Південь, Схід]]", "[[Deutsch - C1 - 04. Модальні частки II — eben, halt, wohl, schon, ruhig, bloß]]"]
estimatedMinutes: 45
---

# Емфатична інтонація й контрастивний наголос

> [!success] Після цієї теми ти зможеш
> - переносити головний наголос речення на слово, яке протиставляєш: *Ich habe das nicht GESAGT (sondern geschrieben)*;
> - підтверджувати чи заперечувати сам факт наголосом на дієслові: *Doch, ich HABE angerufen*;
> - чути й вимовляти різницю між ненаголошеними й наголошеними частками: *Komm doch mit!* і *Er ist DOCH gekommen*, *Komm JA nicht zu spät!*;
> - розпізнавати іронію й перепитування з подивом (*Na toll. · Du hast WAS gemacht?*) і реагувати до місця;
> - помʼякшувати прохання мелодією й словами, щоб не звучати наказом.

## Передбач

> [!quiz] Колега каже: «ICH habe das nicht gesagt» — з сильним наголосом на *ich*. Що він має на увазі?
> level: C1 · type: single · id: de-c1-intonation-q01
> - [x] Це сказав хтось інший, не він.
> - [ ] Він це не сказав, а написав.
> - [ ] Він сказав щось інше.
> - [ ] Він узагалі нічого не казав за весь день.
>
> **Пояснення:** наголос показує, **що протиставляється**. *ICH* — протиставлення іншій людині: «не я, а хтось інший». «Не сказав, а написав» — це *nicht GESAGT*; «сказав щось інше» — *DAS habe ich nicht gesagt*. Слова ті самі, змінюється лише місце наголосу.

## Нейтральний наголос і фокус

У кожному німецькому реченні є **головний наголос** (*Satzakzent*, *Hauptakzent*). У нейтральному реченні він падає на **останню змістову частину перед дієсловом у кінці** — зазвичай на додаток чи обставину, а не на дієприкметник:

| Речення | Де головний наголос | Чому |
|---|---|---|
| *Gestern hat Anna einen ROMAN gelesen.* | **Roman** | останній член перед *gelesen* |
| *Wir fahren morgen nach BERLIN.* | **Berlin** | нова інформація в кінці |
| *Sie hat ANgerufen.* | **an-** у *angerufen* | додатка перед дієсловом немає; наголос — на префіксі |
| *Ich muss heute noch EINkaufen.* | **ein-** | відокремлюваний префікс несе наголос слова |

Це правило «за замовчуванням», а не закон: мовець може перенести наголос на **будь-яке** слово, якщо хоче щось протиставити чи виділити. Тоді говорять про **фокус** (*Fokus*): наголошене слово — нове або протиставлене, решта речення — відоме.

> [!diagram] Одне речення — чотири значення
> ```yaml
> layout: flow
> nodes:
>   - { id: s, label: "підмет", text: "Ich", tone: mint }
>   - { id: v, label: "дієслово", text: "habe", tone: orange }
>   - { id: o, label: "що?", text: "das", tone: gray }
>   - { id: n, label: "заперечення", text: "nicht", tone: gray }
>   - { id: p, label: "дієслово (кінець)", text: "gesagt", tone: orange }
> steps:
>   - { focus: p, note: "Нейтрально наголос — на gesagt: «Я цього не казав». Просте заперечення без підтексту." }
>   - { set: { s: "ICH" }, focus: s, note: "ICH habe das nicht gesagt — «не я, а хтось інший». Протиставлення людині." }
>   - { set: { s: "Ich", o: "DAS" }, focus: o, note: "Ich habe DAS nicht gesagt — «я казав, але не це». Протиставлення змісту." }
>   - { set: { o: "das", p: "GESAGT" }, focus: p, note: "Ich habe das nicht GESAGT — «не сказав, а, наприклад, написав». Протиставлення дії." }
>   - { set: { p: "gesagt", v: "HABE" }, focus: v, note: "Ich HABE das nicht gesagt? — з подивом: наполягання на запереченні: «Та я ж цього не казав!» Наголос на допоміжному дієслові підтверджує сам факт." }
> ```
> Великі літери тут лише позначають наголос; на письмі німці так не пишуть (хіба що в чатах).

### Контрастивний наголос: виправлення

Найчастіше контрастивний наголос чути у виправленнях: мовець наголошує **і хибне, і правильне**.

- *Nicht am DIENStag, am DONnerstag.* — Не у вівторок, а в четвер.
- *Ich meinte nicht DICH, sondern deinen BRUder.* — Я мав на увазі не тебе, а твого брата.
- *Das ist keine EINfahrt, das ist eine AUSfahrt.* — Це не вʼїзд, а виїзд.
- *Ich bin nicht ENTlastet, ich bin BElastet.* — Мене не звільнили від навантаження, а навантажили.

Останній приклад показує важливе: контраст може переносити наголос навіть на префікс, який зазвичай **ненаголошений** (*be-, ent-, ver-*). У нейтральному мовленні *belastet* звучить [bəˈlastət], у протиставленні — «БЕ-ластет».

### Verum-Fokus: наголос на факті

Коли сперечаються не про деталь, а про те, **чи це взагалі сталося**, наголос стає на особову форму дієслова чи на *doch*:

- *Du hast mich nicht angerufen! — Doch, ich HABE dich angerufen.* — «Ні, я таки дзвонив!»
- *Kommt sie mit? — Sie KOMMT mit, aber später.* — Вона прийде, це точно, але пізніше.
- *Ich WEISS, dass das schwierig ist.* — Я ж знаю (не треба мені пояснювати), що це складно.

Лінгвісти називають це *Verum-Fokus* (лат. *verum* — «правда»): наголошено правдивість висловлення, а не окреме слово.

> [!tip] Українською ми часто міняємо порядок слів
> Українська передає фокус і порядком слів, і наголосом: «Це Я сказав», «Сказав це не я». Німецька теж може винести слово на перше місце (*DAS habe ich nicht gesagt*), але дієслово тримає друге місце, тож частіше фокус несе **сам наголос** при звичайному порядку слів. Не переставляй слова на український лад — переставляй наголос.

## Частки: ненаголошені й наголошені

Модальні частки (тема [[Deutsch - C1 - 04. Модальні частки II — eben, halt, wohl, schon, ruhig, bloß]]) **зазвичай ненаголошені** й звучать коротко. Але кілька з них можуть бути й наголошеними — і тоді значення змінюється.

| Частка | Ненаголошена | Наголошена |
|---|---|---|
| **doch** | *Komm doch mit!* — заохочення: «та ходімо!» | *Er ist DOCH gekommen.* — «усе-таки прийшов» (всупереч очікуванням) |
| **ja** | *Das ist ja bekannt.* — «адже це відомо» | *Komm JA nicht zu spät!* — «тільки спробуй запізнитися!» (застереження) |
| **schon** | *Das wird schon.* — «усе буде добре» | *Gefällt es dir? — Ja, SCHON.* — «загалом так, але…» (обмеження) |
| **bloß / nur** | *Was machst du bloß?* — «що ж ти робиш?» | *Mach das BLOSS nicht!* — «тільки не роби цього!» |

DWDS так і позначає: *doch* у значенні «попри все» — «stets betont», а *ja* в проханнях і наказах, що посилює вимогу, — «betont»: *nimm dich ja in Acht*.

> [!diagram] doch, ja, schon — без наголосу і з наголосом
> ```yaml
> layout: compare
> columns: { a: "doch", b: "ja", c: "schon" }
> nodes:
>   - { id: a1, col: a, label: "ненаголошене", text: "Komm doch mit!", note: "мʼяке заохочення", tone: yellow }
>   - { id: a2, col: a, label: "наголошене", text: "Er kam DOCH.", note: "усе-таки, всупереч очікуванню", tone: pink }
>   - { id: b1, col: b, label: "ненаголошене", text: "Das ist ja klar.", note: "відоме обом", tone: yellow }
>   - { id: b2, col: b, label: "наголошене", text: "Komm JA nicht zu spät!", note: "застереження, погроза", tone: pink }
>   - { id: c1, col: c, label: "ненаголошене", text: "Das wird schon.", note: "заспокоєння", tone: yellow }
>   - { id: c2, col: c, label: "наголошене", text: "Ja, SCHON …", note: "обмежена згода: «так, але…»", tone: pink }
> steps:
>   - { focus: [a1, b1, c1], note: "Без наголосу частки короткі й тихі: [dɔx], [ja], [ʃɔn] майже зливаються з сусідніми словами. Вони додають відтінок, а не новий зміст." }
>   - { focus: a2, note: "Наголошене DOCH суперечить очікуванню чи попередній репліці: Ich dachte, er kommt nicht. — Er kam DOCH." }
>   - { focus: b2, note: "Наголошене JA в наказі чи проханні — сильне застереження. Лише в спонукальних реченнях." }
>   - { focus: c2, note: "Наголошене SCHON у відповіді обмежує згоду: далі часто йде aber." }
> ```
> Жовтий — ненаголошене вживання, рожевий — наголошене; підписи поруч дублюють колір.

## Іронія, подив, ввічливість

### Іронія

Іронію в німецькій видають не слова, а **невідповідність** слів і ситуації, підкріплена мелодією: перебільшено радісний чи навпаки «плаский» тон, розтягнутий наголошений склад, частки *ja, na, wirklich*.

- *Na TOLL. Schon wieder Stau.* — Ну чудово. Знову затор.
- *Das hast du ja SUper hingekriegt.* — Ну ти й «молодець» (після невдачі).
- *Sehr witzig.* — Дуже смішно (тобто: зовсім ні).

### Перепитування з подивом (Echo-Frage)

Коли не віриш почутому, повторюєш репліку й ставиш питальне слово **на місце** невідомого, з сильним наголосом і висхідною мелодією:

- *Ich habe gekündigt. — Du hast WAS?* — Я звільнився. — Ти ЩО зробив?
- *Wir ziehen nach Island. — Ihr zieht WOHIN?*

Порядок слів тут — як у розповідному реченні, а не як у звичайному питанні (*Was hast du gemacht?*). Це не помилка, а окремий тип питання.

### Ввічливість і мелодія

Те саме прохання може звучати наказом або проханням. Помʼякшують його разом слова й мелодія:

| Звучить різко | Звучить ввічливо |
|---|---|
| *Geben Sie mir das Formular.* ↘ | *Könnten Sie mir vielleicht kurz das Formular geben?* ↗ |
| *Warten Sie.* ↘ | *Moment, warten Sie bitte einen Augenblick.* |
| *Das ist falsch.* | *Da bin ich mir nicht ganz sicher.* |

> [!note] Про аудіо в цій темі
> Аудіо в курсі синтезоване: емфатичний наголос, іронічна мелодія чи розтягнутий склад у записі можуть бути не чутні. Тому завдання в «Слухаємо» перевіряють, **чи ти знаходиш фокус за контекстом** (питання, виправлення, частки, ситуація) — так носій і «передбачає», куди впаде наголос. Справжню емфатичну інтонацію слухай у живих розмовах: ток-шоу й подкасти в [ARD Audiothek](https://www.ardaudiothek.de) і [Deutschlandfunk](https://www.deutschlandfunk.de/podcasts), відео [DW Learn German](https://learngerman.dw.com/de/overview).

## Приклади

- Nicht ich habe angerufen, sondern meine Frau. — Дзвонив не я, а моя дружина.
- Ich habe das nicht gesagt, ich habe es geschrieben. — Я цього не казав, я це написав.
- Doch, ich habe die Rechnung bezahlt. — Та ні ж, я оплатив рахунок.
- Er ist doch gekommen, obwohl er krank war. — Він усе-таки прийшов, хоч і був хворий.
- Komm ja nicht wieder so spät nach Hause! — Тільки спробуй знову прийти так пізно!
- Gefällt dir die Wohnung? — Ja, schon, aber sie ist zu teuer. — Тобі подобається квартира? — Загалом так, але вона задорога.
- Du hast was gekauft? Ein Pferd? — Ти що купив? Коня?
- Na toll, jetzt regnet es auch noch. — Ну чудово, тепер ще й дощ.
- Könnten Sie das vielleicht noch einmal erklären? — Чи не могли б Ви, може, пояснити це ще раз?
- Das ist keine Einfahrt, das ist eine Ausfahrt. — Це не вʼїзд, а виїзд.

## Слова

> [!word] der Nachdruck
> ipa: /ˈnaːxdʁʊk/ · pos: noun · level: C1 · id: de-c1-intonation-w01
> uk: наголос, натиск, особлива вага (сказаного)
> forms: — (без множини в цьому значенні)
> example: Sie sagte es mit **Nachdruck**: „Ich komme nicht." — Вона сказала це з натиском: «Я не прийду».
> note: mit Nachdruck sagen / auf etwas Nachdruck legen. Інше значення — передрук (книги), тоді множина die Nachdrucke.

> [!word] nachdrücklich
> ipa: /ˈnaːxdʁʏklɪç/ · pos: adj · level: C1 · id: de-c1-intonation-w02
> uk: наполегливий, рішучий; з натиском
> example: Der Arzt hat ihm **nachdrücklich** geraten, weniger zu arbeiten. — Лікар наполегливо порадив йому менше працювати.
> note: часто як прислівник: nachdrücklich betonen, fordern, warnen.

> [!word] der Unterton
> ipa: /ˈʊntɐtoːn/ · pos: noun · level: C1 · id: de-c1-intonation-w03
> uk: підтекст (у голосі), прихований відтінок
> forms: die Untertöne
> example: In seiner Antwort lag ein ironischer **Unterton**. — У його відповіді відчувався іронічний підтекст.
> note: mit einem Unterton von Spott / Vorwurf — з відтінком глузування / докору.

> [!word] sarkastisch
> ipa: /zaʁˈkastɪʃ/ · pos: adj · level: C1 · id: de-c1-intonation-w04
> uk: саркастичний, уїдливий
> example: „Sehr witzig", sagte sie **sarkastisch**. — «Дуже смішно», — саркастично сказала вона.
> note: сильніше й злостивіше, ніж ironisch. Іменник — der Sarkasmus. s перед голосним — дзвінке [z].

> [!word] abschwächen
> ipa: /ˈapʃvɛçn̩/ · pos: verb · level: C1 · id: de-c1-intonation-w05
> uk: помʼякшувати, послаблювати
> forms: abschwächen → schwächte ab → hat abgeschwächt
> example: Mit „vielleicht" und „kurz" **schwächst** du die Bitte **ab**. — Словами «vielleicht» і «kurz» ти помʼякшуєш прохання.
> note: eine Aussage, Kritik abschwächen. Протилежне — verstärken. Відокремлюване: ich schwäche ab.

> [!word] die Tonhöhe
> ipa: /ˈtoːnhøːə/ · pos: noun · level: C1 · id: de-c1-intonation-w06
> uk: висота тону (голосу)
> forms: die Tonhöhen
> example: Bei einer Echo-Frage steigt die **Tonhöhe** am Ende stark an. — У питанні-перепитуванні висота тону наприкінці різко зростає.
> note: мелодія речення — це зміна Tonhöhe; наголос — це ще й гучність і довгота.

> [!word] vorwurfsvoll
> ipa: /ˈfoːɐ̯vʊʁfsfɔl/ · pos: adj · level: C1 · id: de-c1-intonation-w07
> uk: докірливий, з докором
> example: „Du hast ja schon wieder vergessen", sagte er **vorwurfsvoll**. — «Ти ж знову забув», — докірливо сказав він.
> note: від der Vorwurf (докір). Протилежне за тоном — verständnisvoll.

> [!word] die Übertreibung
> ipa: /yːbɐˈtʁaɪ̯bʊŋ/ · pos: noun · level: B2 · id: de-c1-intonation-w08
> uk: перебільшення
> forms: die Übertreibungen
> example: Ironie arbeitet oft mit **Übertreibung**: „Das war ja die beste Idee des Jahres." — Іронія часто працює через перебільшення: «Це ж була найкраща ідея року».
> note: від übertreiben (невідокремлюване, наголос на -trei-). Протилежне — die Untertreibung.

## Слухаємо

> [!listen] На якому слові у відповіді B має бути головний наголос?
> level: C1 · type: answer · id: de-c1-intonation-l01
> audio: A: Hast du das Buch gekauft?
> audio: B: Nein, ich habe es mir geliehen.
> - [ ] ich
> - [ ] Buch / es
> - [x] geliehen
>
> **Пояснення:** протиставлено дію: не *gekauft*, а *geliehen*. Тому наголос — на *geLIEhen*. Книжка (*es*) уже відома, а *ich* ніхто не оспорює.

> [!listen] На якому слові у відповіді B має бути головний наголос?
> level: C1 · type: answer · id: de-c1-intonation-l02
> audio: A: Hat Jonas das Protokoll geschrieben?
> audio: B: Nein, Mira hat es geschrieben.
> - [x] Mira
> - [ ] Protokoll / es
> - [ ] geschrieben
>
> **Пояснення:** протиставлено людину: не Jonas, а **Mira**. *geschrieben* і *Protokoll* — уже відома інформація, їх вимовляють без наголосу.

> [!listen] Заповни, що виправив B
> level: C1 · type: fill · id: de-c1-intonation-l03
> audio: A: Also, das Treffen ist am Montag um neun in Raum zwölf?
> audio: B: Am Montag, ja. Aber um zehn, nicht um neun. Und in Raum zwanzig.
>
> ```fill
> Tag: [[Montag]]
> Uhrzeit: [[10|zehn|10 Uhr|zehn Uhr]]
> Raum: [[20|zwanzig]]
> ```
>
> **Пояснення:** контрастивний наголос у B — на виправленому: *um ZEHN, nicht um NEUN*, *Raum ZWANzig*. *Montag* B лише підтверджує (*ja*), тому там наголосу контрасту немає.

> [!listen] Чому B каже «Doch, ich habe …»? На якому слові наголос?
> level: C1 · type: answer · id: de-c1-intonation-l04
> audio: A: Du hast mich gestern nicht angerufen!
> audio: B: Doch, ich habe dich angerufen. Sogar zweimal!
> - [x] на *habe* (і *doch*): B стверджує сам факт
> - [ ] на *dich*: B дзвонив саме A, а не комусь іншому
> - [ ] на *angerufen*: B не написав, а подзвонив
>
> **Пояснення:** A заперечує факт, B його підтверджує — це *Verum-Fokus*: *Doch, ich HABE dich angerufen.* Нейтрально наголос був би на *ANgerufen*, але тут ніхто не порівнює дзвінок і лист.

> [!listen] Що відчуває B?
> level: C1 · type: answer · id: de-c1-intonation-l05
> audio: A: Der Zug hat schon wieder vierzig Minuten Verspätung.
> audio: B: Na toll. Genau das habe ich heute noch gebraucht.
> - [ ] щиру радість: буде час на каву
> - [x] роздратування: «саме цього мені й бракувало»
> - [ ] байдужість: байдуже
>
> **Пояснення:** *Na toll* і *genau das habe ich gebraucht* після поганої новини — іронія: слова позитивні, ситуація негативна. Сигнали — частка *na* і невідповідність словам ситуації.

> [!listen] Що означає «Du hast was?»
> level: C1 · type: answer · id: de-c1-intonation-l06
> audio: A: Ich habe heute meinen Job gekündigt.
> audio: B: Du hast was? Und was sagt deine Familie dazu?
> - [ ] B не розчув через шум і просить повторити
> - [x] B вражений і не вірить почутому
> - [ ] B не розуміє слова «gekündigt»
>
> **Пояснення:** це питання-перепитування з подивом (*Echo-Frage*). Що B усе почув і зрозумів, видно з наступного питання про родину. *was* стоїть на місці *meinen Job gekündigt*.

> [!listen] Що означає «ja» в цій репліці?
> level: C1 · type: answer · id: de-c1-intonation-l07
> audio: Und komm ja nicht wieder so spät nach Hause, verstanden?
> - [ ] «так» — мовець погоджується
> - [ ] «адже, як відомо» — нагадування
> - [x] сильне застереження: «тільки спробуй»
>
> **Пояснення:** у наказі *ja* наголошене й посилює вимогу: *Komm JA nicht zu spät!* DWDS: «betont, verstärkt eine Aufforderung». *verstanden?* у кінці підтверджує строгий тон.

> [!listen] Що означає «doch» у відповіді B?
> level: C1 · type: answer · id: de-c1-intonation-l08
> audio: A: Ich dachte, das Konzert fällt aus.
> audio: B: Nein, es findet doch statt. Die Sängerin ist wieder gesund.
> - [x] усе-таки, всупереч очікуванням
> - [ ] мʼяке заохочення: «та ходімо»
> - [ ] «адже ти знаєш»
>
> **Пояснення:** A очікував скасування, B повідомляє протилежне: *es findet DOCH statt* — наголошене *doch* = «усе-таки». Заохочення було б у наказі: *Komm doch mit!*

> [!listen] Як звучить прохання A?
> level: C1 · type: answer · id: de-c1-intonation-l09
> audio: A: Entschuldigung, könnten Sie mir vielleicht kurz helfen? Ich finde den Eingang nicht.
> audio: B: Ja, gern. Der Eingang ist gleich hier um die Ecke.
> - [x] ввічливо й мʼяко
> - [ ] як наказ
> - [ ] як докір
>
> **Пояснення:** *Entschuldigung*, *könnten Sie* (Konjunktiv II), *vielleicht*, *kurz* — чотири помʼякшувачі. Наказом було б *Helfen Sie mir!*

> [!listen] Яке слово B протиставляє?
> level: C1 · type: answer · id: de-c1-intonation-l10
> audio: A: Hier ist doch die Einfahrt zum Parkhaus, oder?
> audio: B: Nein, das ist keine Einfahrt, das ist die Ausfahrt. Die Einfahrt ist hinten.
> - [ ] Parkhaus
> - [x] Einfahrt — Ausfahrt (префікси ein- / aus-)
> - [ ] hinten
>
> **Пояснення:** протиставлені префікси: *keine EINfahrt, die AUSfahrt*. Корінь *-fahrt* однаковий, тому наголос падає саме на те, що відрізняє слова.

> [!listen] Напиши або скажи, що почув
> level: C1 · type: dictation · id: de-c1-intonation-l11
> audio: Das habe ich so nicht gesagt.
> explain: фокус на *so*: «я казав, але не так». Порядок: *Das* на першому місці, дієслово *habe* — друге.

> [!listen] Напиши або скажи, що почув
> level: C1 · type: dictation · id: de-c1-intonation-l12
> audio: Mach das bloß nicht noch einmal!
> explain: наголошене *bloß* у наказі — застереження: «тільки не роби цього знову». *noch einmal* — «ще раз».

## Вимова

### Мінімальні пари: частки, які легко переплутати

Ненаголошені частки короткі й тихі, тож на слух їх легко сплутати зі схожими словами. Пари нижче тренують саме це. Остання — про наголос: *Kaffee* (у Німеччині наголос на першому складі) і *Café* (на другому).

> [!pair] schon /ʃoːn/ — schön /ʃøːn/
> level: C1 · id: de-c1-intonation-p01
> say: schon
> tip: *schon* — губи заокруглені, язик назад ([oː]); *schön* — губи так само, але язик уперед, як для [eː]. У швидкому мовленні частка *schon* ще й коротшає: [ʃɔn].

> [!pair] wohl /voːl/ — voll /fɔl/
> level: C1 · id: de-c1-intonation-p02
> say: wohl
> tip: *wohl* — дзвінкий [v] і довгий [oː]; *voll* — глухий [f] і короткий [ɔ]. Частка *wohl* (припущення: *Er ist wohl krank*) зазвичай ненаголошена.

> [!pair] doch /dɔx/ — noch /nɔx/
> level: C1 · id: de-c1-intonation-p03
> say: doch
> tip: різниця лише в першому звуці: [d] — кінчик язика за зубами з вибухом, [n] — через ніс. У ненаголошеному *doch* [d] короткий, але все одно чутний.

> [!pair] denn /dɛn/ — den /deːn/
> level: C1 · id: de-c1-intonation-p04
> say: denn
> tip: *denn* — короткий відкритий [ɛ]; *den* — довгий закритий [eː]. Частка в питанні (*Was ist denn los?*) звучить ще коротше: [dn̩].

> [!pair] halt /halt/ — hält /hɛlt/
> level: C1 · id: de-c1-intonation-p05
> say: halt
> tip: *halt* (частка: *Das ist halt so*) — [a]; *hält* (від halten) — [ɛ]. [h] — легкий видих, не українське «г».

> [!pair] Kaffee /ˈkafe/ — Café /kaˈfeː/
> level: C1 · id: de-c1-intonation-p06
> say: Café
> tip: *Kaffee* (напій) у Німеччині переважно наголошують на першому складі (Duden подає й [kaˈfeː]); *Café* (кавʼярня) — на другому, з довгим [eː]. В Австрії й напій звучить [kaˈfeː] (Duden: «österreichisch nur»).

### Скажи з потрібним наголосом

> [!speak] «Це сказав не я» — наголос на ich
> level: C1 · id: de-c1-intonation-s01
> text: Ich habe das nicht gesagt.
> ipa: /ˈɪç haːbə das nɪçt ɡəˈzaːkt/
> tip: ICH — гучніше, довше й вище; решта речення після нього — рівно й тихіше, без другого наголосу.
> uk: Це не я сказав.

> [!speak] «Я казав інше» — наголос на das
> level: C1 · id: de-c1-intonation-s02
> text: Das habe ich nicht gesagt.
> ipa: /ˈdas haːbə ɪç nɪçt ɡəˈzaːkt/
> tip: DAS на першому місці й з наголосом: протиставляєш зміст. *gesagt* наприкінці — без наголосу.
> uk: Я сказав не це.

> [!speak] Протиставлення дій
> level: C1 · id: de-c1-intonation-s03
> text: Ich habe es nicht gesagt, ich habe es geschrieben.
> ipa: /ɪç ˈhaːbə ɛs nɪçt ɡəˈzaːkt ɪç ˈhaːbə ɛs ɡəˈʃʁiːbn̩/
> tip: два наголоси: geSAGT і geSCHRIEben. Між частинами — коротка пауза, мелодія на першій частині лишається піднятою.
> uk: Я це не сказав, а написав.

> [!speak] Виправлення дня
> level: C1 · id: de-c1-intonation-s04
> text: Nicht am Dienstag, am Donnerstag.
> ipa: /nɪçt am ˈdiːnstaːk am ˈdɔnɐstaːk/
> tip: DIENStag і DONnerstag — обидва наголошені, другий сильніше й з падінням ↘. *-tag* у кінці — [taːk].
> uk: Не у вівторок, а в четвер.

> [!speak] Verum-Fokus: «я таки дзвонив»
> level: C1 · id: de-c1-intonation-s05
> text: Doch, ich habe dich angerufen.
> ipa: /dɔx ɪç ˈhaːbə dɪç ˈanɡəʁuːfn̩/
> tip: DOCH і HAbe — наголошені; *angerufen* — тихо, без звичного наголосу на an-. Так звучить заперечення чужого заперечення.
> uk: Та ні ж, я тобі дзвонив.

> [!speak] Перепитування з подивом
> level: C1 · id: de-c1-intonation-s06
> text: Du hast was gemacht?
> ipa: /duː hast vas ɡəˈmaxt/
> tip: WAS — найвища й найгучніша точка; мелодія наприкінці йде вгору ↗. Порядок слів — як у розповідному реченні.
> uk: Ти що зробив?

> [!speak] Іронія
> level: C1 · id: de-c1-intonation-s07
> text: Na toll, schon wieder Stau.
> ipa: /naː tɔl ʃoːn ˈviːdɐ ʃtaʊ̯/
> tip: *Na* — протяжно, *toll* — рівно або перебільшено радісно. Іронію видає саме розрив між словом *toll* і тоном.
> uk: Ну чудово, знову затор.

> [!speak] Застереження з наголошеним ja
> level: C1 · id: de-c1-intonation-s08
> text: Komm ja nicht zu spät!
> ipa: /kɔm jaː nɪçt tsuː ʃpɛːt/
> tip: JA — довге [jaː] і наголошене; у звичайному «адже» *ja* було б коротким і тихим. Мелодія падає ↘ на *spät*.
> uk: Тільки не запізнюйся!

> [!speak] Помʼякшене прохання
> level: C1 · id: de-c1-intonation-s09
> text: Könnten Sie mir vielleicht kurz helfen?
> ipa: /ˈkœntn̩ ziː miːɐ̯ fiˈlaɪ̯çt kʊʁts ˈhɛlfn̩/
> tip: мелодія спокійна, наприкінці легко вгору ↗. *vielleicht* — наголос на -leicht. Не тисни голосом: мʼякість тут від тону, не лише від слів.
> uk: Чи не могли б Ви мені, може, трохи допомогти?

> [!speak] Обмежена згода з наголошеним schon
> level: C1 · id: de-c1-intonation-s10
> text: Das ist schon richtig, aber nicht ganz vollständig.
> ipa: /das ɪst ʃoːn ˈʁɪçtɪç ˈaːbɐ nɪçt ɡants ˈfɔlʃtɛndɪç/
> tip: SCHON — з наголосом і довгим [oː]: «загалом так». Далі *aber* і нова думка; наголос — на VOLLständig.
> uk: Це загалом правильно, але не зовсім повно.

> [!speak] Контраст префіксів
> level: C1 · id: de-c1-intonation-s11
> text: Nicht Einfahrt, sondern Ausfahrt.
> ipa: /nɪçt ˈaɪ̯nfaːɐ̯t ˈzɔndɐn ˈaʊ̯sfaːɐ̯t/
> tip: EIN- і AUS- — сильні наголоси; *-fahrt* обидва рази тихо. *sondern* — без наголосу.
> uk: Не вʼїзд, а виїзд.

> [!speak] Емоційне підсилення
> level: C1 · id: de-c1-intonation-s12
> text: Das war wirklich unglaublich!
> ipa: /das vaːɐ̯ ˈvɪʁklɪç ʊnˈɡlaʊ̯plɪç/
> tip: нейтрально наголос на -GLAUB-; в емоції він часто переходить на UN- з чітким твердим приступом і подовженням: «УН-глаублих». Duden подає обидва варіанти.
> uk: Це було справді неймовірно!

> [!speak] «Не тебе, а твого брата»
> level: C1 · id: de-c1-intonation-s13
> text: Ich meinte nicht dich, sondern deinen Bruder.
> ipa: /ɪç ˈmaɪ̯ntə nɪçt dɪç ˈzɔndɐn ˈdaɪ̯nən ˈbʁuːdɐ/
> tip: DICH і BRUder — два контрастні наголоси. *meinte* — без наголосу: ніхто не сперечається, що ти «мав на увазі».
> uk: Я мав на увазі не тебе, а твого брата.

> [!speak] Ввічливо взяти слово
> level: C1 · id: de-c1-intonation-s14
> text: Darf ich dazu kurz etwas ergänzen?
> ipa: /daʁf ɪç daˈtsuː kʊʁts ˈɛtvas ɛɐ̯ˈɡɛntsn̩/
> tip: рівна мелодія з легким підйомом ↗ наприкінці; наголос на erGÄNzen. *dazu* — наголос на -zu.
> uk: Можна мені коротко щось до цього додати?

## Типові помилки українців

> [!pitfall] Наголос на кожному слові — і фокус зникає
> Коли хвилюєшся, хочеться вимовити все однаково чітко й гучно. Але в німецькій головний наголос у реченні **один** (у контрасті — два), решта звучить тихіше. *ICH HABE DAS NICHT GESAGT* без ієрархії слухач не зрозуміє: що саме ти заперечуєш? Обери одне слово — і «приглуши» решту.

> [!pitfall] Переставляєш слова замість наголосу
> Українське «Сказав це не я» хочеться перекласти порядком слів. Німецька теж уміє виносити слово вперед (*DAS habe ich nicht gesagt*), але дієслово завжди на другому місці, а найприродніший спосіб — звичайний порядок і наголос: *Nicht ICH habe das gesagt* або *ICH habe das nicht gesagt*. *Gesagt habe das nicht ich* граматично правильно, але звучить штучно.

> [!pitfall] Наголошуєш частку, яка має бути тихою
> *Komm doch mit!* із сильним DOCH уже звучить як «та прийди ж нарешті, скільки можна!», а *Das ist JA bekannt* — дивно. Ненаголошені частки короткі: [dɔx], [ja], [ʃɔn]. Наголошуй їх лише тоді, коли хочеш значення «всупереч» (*doch*), застереження (*ja* у наказі) чи обмеження (*schon*).

> [!pitfall] Прохання з падаючою мелодією звучить як наказ
> *Geben Sie mir das Formular* ↘ — граматично ввічливо (*Sie*), але звучить різко. Українська інтонація прохання тут не допомагає. Додай Konjunktiv II і помʼякшувачі (*Könnten Sie … vielleicht … kurz …?*) і легкий підйом голосу наприкінці.

## Практика

> [!quiz] Де нейтральний головний наголос у реченні «Gestern hat Anna einen Roman gelesen»?
> level: C1 · type: single · id: de-c1-intonation-q02
> - [ ] Gestern
> - [ ] Anna
> - [x] Roman
> - [ ] gelesen
>
> **Пояснення:** нейтрально наголос падає на останній член **перед** дієсловом у кінці дужки — тут *roMAN*. Наголос на *geLEsen* — типова помилка: дієприкметник у кінці зазвичай ненаголошений. *GEStern* чи *ANna* наголошують лише в контрасті.

> [!quiz] Яка відповідь природна на питання «Wer hat das Fenster offen gelassen?»
> level: C1 · type: single · id: de-c1-intonation-q03
> - [x] Der HAUSmeister hat es offen gelassen.
> - [ ] Der Hausmeister hat es OFfen gelassen.
> - [ ] Der Hausmeister HAT es offen gelassen.
> - [ ] Der Hausmeister hat ES offen gelassen.
>
> **Пояснення:** питання *wer?* — нове лише те, **хто**. Тому наголос — на *HAUSmeister*. *offen gelassen* і *es* (вікно) уже відомі з питання. Наголос на *HAT* означав би «таки залишив» — це відповідь на інше питання.

> [!quiz] Які сигнали допомагають розпізнати іронію?
> level: C1 · type: multi · id: de-c1-intonation-q04
> - [x] позитивні слова в явно поганій ситуації
> - [x] частки *na, ja, wirklich* і перебільшення (*die beste Idee des Jahres*)
> - [x] незвична мелодія: розтягнутий наголошений склад або «плаский» тон
> - [ ] будь-яке речення з Konjunktiv II
> - [ ] слово *bitte* в кінці речення
>
> **Пояснення:** іронію видає невідповідність слів і ситуації, підкріплена частками й тоном. Konjunktiv II і *bitte* — ознаки ввічливості, а не іронії.

> [!quiz] Що означає «Komm JA nicht zu spät!» з наголошеним *ja*?
> level: C1 · type: single · id: de-c1-intonation-q05
> - [ ] «Так, приходь не пізно» — згода
> - [x] «Тільки не запізнюйся!» — застереження
> - [ ] «Ти ж знаєш, що не можна запізнюватися» — нагадування про відоме
> - [ ] «Можеш не поспішати»
>
> **Пояснення:** у наказі наголошене *ja* посилює вимогу (DWDS: «betont, verstärkt eine Aufforderung»). Значення «адже, як відомо» має ненаголошене *ja* у розповідному реченні: *Das weißt du ja.*

> [!quiz] «Ich dachte, er kommt nicht. — Er ist DOCH gekommen.» Що означає *doch*?
> level: C1 · type: single · id: de-c1-intonation-q06
> - [ ] «адже» — нагадування
> - [x] «усе-таки» — всупереч очікуванню
> - [ ] «нарешті» — після довгого чекання
> - [ ] «теж» — разом з іншими
>
> **Пояснення:** наголошене *doch* (DWDS: «trotzdem, dennoch — stets betont») суперечить очікуванню з першої репліки. «Нарешті» було б *endlich*, «теж» — *auch*.

> [!quiz] Заповни частками: застереження й обурення
> level: C1 · type: fill · bank: denn, mal · id: de-c1-intonation-q07
>
> ```text fill
> Komm [[ja|bloß]] nicht wieder zu spät!
> Das ist [[doch]] nicht dein Ernst! (= «ти ж це не серйозно!»)
> Mach das [[bloß|ja]] nicht noch einmal!
> ```
>
> **Пояснення:** у застереженнях — наголошені *ja* або *bloß* (обидва варіанти правильні в першому й третьому реченні). *Das ist doch nicht dein Ernst!* — обурене *doch*. *denn* буває лише в питаннях, а *mal* помʼякшує прохання і в застереження не пасує.

> [!quiz] Склади речення: «Я сказав це не так, а зовсім інакше»
> level: C1 · type: order · id: de-c1-intonation-q08
>
> ```text order
> Das habe ich
> so nicht gesagt,
> sondern ganz anders.
> aber ganz anders. ✗
> ```
>
> **Пояснення:** після заперечення *nicht* правильне протиставлення вводить **sondern**, а не *aber*. Фокус — на *so*: «не так», а далі — як саме.

> [!quiz] Склади відповідь: «Та ні ж, я тобі дзвонив!»
> level: C1 · type: order · id: de-c1-intonation-q09
>
> ```text order
> Doch,
> ich habe
> dich
> angerufen!
> hast ✗
> ```
>
> **Пояснення:** *Doch* відповідає на заперечення (*Du hast nicht angerufen!*). Далі звичайний порядок: підмет *ich*, дієслово *habe*, додаток, дієприкметник. Наголос — на *HAbe* (Verum-Fokus).

> [!quiz] Колега каже: «Ich ziehe nach Island.» Ти відповідаєш: «Du ziehst WOHIN?» Що це за питання?
> level: C1 · type: single · id: de-c1-intonation-q10
> - [x] перепитування з подивом (Echo-Frage): ти почув, але не віриш
> - [ ] помилка порядку слів: треба *Wohin ziehst du?*
> - [ ] прохання назвати точну адресу
> - [ ] ввічливе питання з Konjunktiv
>
> **Пояснення:** у перепитуванні питальне слово стоїть **на місці** незрозумілого чи неймовірного, з сильним наголосом і підйомом мелодії. *Wohin ziehst du?* — звичайне питання, коли відповіді ще не чув.

> [!quiz] Що помʼякшує прохання в німецькій?
> level: C1 · type: multi · id: de-c1-intonation-q11
> - [x] Konjunktiv II: *Könnten Sie …?*
> - [x] слова *vielleicht, kurz, mal*
> - [x] спокійна мелодія з легким підйомом наприкінці
> - [ ] повторити наказ голосніше
> - [ ] додати *sofort* («негайно»)
>
> **Пояснення:** ввічливість — це і граматика, і слова, і мелодія. Гучність і *sofort* роблять прохання вимогою.

> [!quiz] Заповни протиставлення за підказками
> level: C1 · type: fill · bank: Abfahrt, angesagt · id: de-c1-intonation-q12
>
> ```text fill
> Das ist keine Einfahrt, das ist eine [[Ausfahrt]]. (виїзд)
> Ich habe nicht zugesagt, ich habe [[abgesagt]]. (відмовився)
> Die Preise sind nicht gestiegen, sie sind [[gesunken]]. (знизилися)
> ```
>
> **Пояснення:** у протиставленні наголос падає на те, що відрізняє слова: *EIN-* / *AUS-*, *ZU-* / *AB-*, *geSTIEgen* / *geSUNken*. *Abfahrt* — відправлення, а *angesagt* — оголошено; за підказками вони не підходять.

## Фішки

> [!reel] 🎯 Одне речення — пʼять значень
> *Ich habe das nicht gesagt* — улюблена вправа викладачів вимови. Наголос на *ich* — «не я», на *das* — «не це», на *gesagt* — «не сказав, а написав», на *habe* — наполягання на запереченні («та я ж цього не казав!»), на *nicht* — рішуче заперечення. Слова ті самі, змісти різні — і все це робить один наголос.

> [!reel] ⚠️ «Ja» як погроза
> У німецькій «так» може звучати загрозливо. *Lass dich ja nicht erwischen!* — «тільки не попадися!». Наголошене *ja* в наказі робить вимогу сильнішою, а не «згодою». Тож мамине *Komm ja pünktlich nach Hause!* — не «так», а «я попередила».

> [!reel] 🔁 «Du hast WAS?» — питання без перестановки
> Звичайне питання починається з питального слова: *Was hast du gemacht?* Але коли не віриш почутому, німці повторюють чужу фразу й лише міняють одне слово на *was, wer, wohin*: *Du hast WAS gekauft?* Так само в українській: «Ти ЩО купив?» — тут мови збігаються.

## Джерела та що почитати

- [DWDS — doch](https://www.dwds.de/wb/doch): значення «trotzdem, dennoch» (наголошене) і ненаголошене *doch* як частка, вимова [dɔx].
- [DWDS — ja](https://www.dwds.de/wb/ja): наголошене *ja* в наказах («verstärkt eine Aufforderung»), ненаголошене *ja* для відомого.
- [DWDS — schon](https://www.dwds.de/wb/schon): обмежувальне «Ja, schon» («meist betont») і заспокійливе *Das wird schon*.
- [DWDS — bloß](https://www.dwds.de/wb/blo%C3%9F): *bloß* у застереженнях і питаннях.
- [Duden — Akzent](https://www.duden.de/rechtschreibung/Akzent): значення «наголос» і «вимова з акцентом».
- [Duden — Ironie](https://www.duden.de/rechtschreibung/Ironie): визначення іронії.
- [Duden — Kaffee](https://www.duden.de/rechtschreibung/Kaffee) і [Duden — Café](https://www.duden.de/rechtschreibung/Cafe): наголос, австрійський варіант [kaˈfeː].
- [ARD Audiothek](https://www.ardaudiothek.de) і [Deutschlandfunk — Podcasts](https://www.deutschlandfunk.de/podcasts): живі розмови, ток-шоу, інтервʼю — справжня емфатична інтонація.
- [DW Learn German](https://learngerman.dw.com/de/overview): безкоштовні відео й аудіо з природним мовленням.

> [!important] Підсумок
> - Нейтральний наголос — на останньому члені перед дієсловом у кінці: *Anna hat einen roMAN gelesen.*
> - Фокус переносить наголос на протиставлене слово: *ICH / DAS / geSAGT*; у виправленнях наголошено і хибне, і правильне: *nicht am DIENStag, am DONnerstag*.
> - Verum-Fokus — наголос на дієслові чи *doch*, коли сперечаються про сам факт: *Doch, ich HAbe angerufen.*
> - Частки зазвичай тихі; наголошені *doch* (усе-таки), *ja* у наказі (застереження), *schon* (обмежена згода), *bloß* (застереження) мають інше значення.
> - Іронія — розрив між словами й ситуацією; перепитування з подивом — *Du hast WAS?*; ввічливість — Konjunktiv II, *vielleicht, kurz* і мʼяка мелодія.
