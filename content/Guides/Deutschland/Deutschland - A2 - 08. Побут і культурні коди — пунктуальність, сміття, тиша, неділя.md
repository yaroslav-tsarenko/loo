---
title: Побут і культурні коди — пунктуальність, сміття, тиша, неділя
id: dl-a2-08
level: A2
icon: px:house
tags: [deutsch, landeskunde, skills, a2, land, alltag, muelltrennung, ruhezeiten]
prerequisites: ["[[Deutschland - A2 - 07. Їжа й напої — регіональна кухня]]"]
estimatedMinutes: 45
---

# Побут і культурні коди — пунктуальність, сміття, тиша, неділя

> [!success] Після цього розділу ти зможеш
> - пояснити, як у Німеччині розділяють сміття (**Mülltrennung**) і чому правила залежать від міста;
> - здати пляшку чи банку в **Pfandautomat** і знати різницю між **Einwegpfand** і **Mehrwegpfand**;
> - розповісти, що таке **Nachtruhe**, **Ruhezeiten** і **Sonntagsruhe**, чому сусід може постукати о 22:05 і від чого залежать межі тиші;
> - спокійно поводитися з неписаними правилами: пунктуальністю, Hausschuhe, **Lüften**, готівкою;
> - сказати німецькою: *Entschuldigung, ich mache die Musik leise* і *Soll ich die Schuhe ausziehen?*

## Передбач

> [!quiz] Новий сусід постукав у двері о 22:05: «У нас Nachtruhe!». Що найімовірніше сталося?
> level: A2 · type: single · id: dl-a2-08-q01
> - [ ] Він помилився: Nachtruhe в Німеччині починається опівночі.
> - [ ] Закон забороняє дзвонити по телефону після 21:00.
> - [x] Часто Nachtruhe починається о 22:00, і гучна музика чи шум у цей час порушують правила.
> - [ ] Це просто особиста вимога сусіда, закону про тишу не існує.
>
> **Пояснення:** ніч у німецьких правилах про шум найчастіше починається о 22:00 й триває до 6:00, наприклад у § 9 Landes-Immissionsschutzgesetz Nordrhein-Westfalen та в технічній інструкції TA Lärm. Але правила встановлюють землі й міста, а ще — Hausordnung у твоєму будинку: деталі можуть відрізнятися.

## Оповідь

### Pünktlichkeit: законом не записана, а очікується

Жоден закон не змушує приходити вчасно, проте **Pünktlichkeit** («пунктуальність») у Німеччині — звична очікувана риса: на співбесіду, до лікаря, на роботу й на приватну зустріч з домовленим часом приходять вчасно, а якщо запізнюєшся, попереджають повідомленням чи дзвінком. Німецький *pünktlich* означає саме «вчасно», і спізнення на кілька хвилин без попередження часто сприймають як неповагу до чужого часу. Це **звичай**, а не закон; у кожної родини й компанії він трохи різний.

### Mülltrennung: пʼять потоків сміття

Німці ретельно розділяють сміття — це називають **Mülltrennung**. Закон про економіку замкненого циклу (*Kreislaufwirtschaftsgesetz*, § 20) зобовʼязує комунальні служби збирати від домогосподарств окремо, зокрема, біовідходи. Як саме це організовано — вирішує місто чи громада, тому деталі різняться. Загальна схема така:

- **Restmüll** — усе, що не підходить нікуди більше (розбита порцеляна, підгузки, гігієнічні засоби);
- **Biotonne** — залишки овочів і фруктів, кавова гуща, яєчна шкаралупа, приготована їжа, хліб (у деяких містах біотонни немає);
- **Gelbe Tonne / Gelber Sack** — упаковка з пластику, жерсті й алюмінію; у частини міст замість неї **Wertstofftonne**;
- **Altpapier** — газети, картон, папір (сильно забруднений чи жирний папір іде в Restmüll);
- **Altglas** — у контейнери на вулиці, окремо біле, зелене й коричневе скло; розбите питне скло та лампочки туди не кидають.

> [!diagram] Що в який бак: пʼять потоків
> ```yaml
> layout: flow
> nodes:
>   - { id: pack, label: "упаковка", text: "Gelber Sack", note: "пластик, жесть, алюміній", tone: yellow }
>   - { id: pap, label: "папір", text: "Altpapier", note: "газети, картон", tone: pink }
>   - { id: bio, label: "біо", text: "Biotonne", note: "залишки їжі, кавова гуща", tone: gray }
>   - { id: glas, label: "скло", text: "Altglas", note: "білий, зелений, коричневий контейнер", tone: yellow }
>   - { id: rest, label: "решта", text: "Restmüll", note: "усе, що не підходить нікуди більше", tone: pink }
> steps:
>   - { show: [pack, pap], note: "Перші два потоки — упаковка та папір: жовтий мішок чи бак і (зазвичай блакитний) бак для паперу." }
>   - { show: [bio, glas], note: "Біовідходи в окремий бак (не у всіх містах), скло — у вуличні контейнери за кольором." }
>   - { show: rest, note: "У Restmüll — те, що не підходить до інших потоків. Правила в деталях залежать від твоєї комуни: шукай «Abfallkalender» свого міста." }
> ```

### Pfand: гроші за пляшку

**Das Pfand** — застава за пляшку чи банку. За **Einwegflaschen** (одноразові, зокрема пластикові PET) і банки діє єдина застава **25 Cent**. За **Mehrwegflaschen** (багаторазові, переважно скляні) застава зазвичай 8 або 15 центів; для неї немає єдиного закону. Не кожна пляшка з заставою — багаторазова: на полиці дивись на напис *EINWEG* чи *MEHRWEG*. Деякі напої, як-от вино чи міцний алкоголь у скляних пляшках, заставою не обкладаються.

Здаєш у **Pfandautomat** у супермаркеті: автомат друкує чек (*Pfandbon*), а на касі отримуєш гроші чи знижку. Магазини, що продають напої в одноразовій упаковці із заставою, зобовʼязані приймати її назад.

### Ruhezeiten: чому сусід стукає о 22:05

Тиша в Німеччині — предмет правил на кількох рівнях. **Nachtruhe** («нічна тиша») у більшості земель припадає на 22:00–6:00. Наприклад, у Північному Рейні-Вестфалії § 9 Landes-Immissionsschutzgesetz забороняє дії, що можуть порушити нічну тишу; за порушення можливий штраф до 5000 євро. Технічна інструкція TA Lärm теж ділить добу на день (6:00–22:00) і ніч (22:00–6:00). Окремі землі й міста мають власні межі, тож загальної точної цифри «для всієї країни» не називай.

Є ще федеральна постанова про шум приладів (*32. BImSchV*): у певних зонах (житлових, лікувальних) садова техніка з її додатку, наприклад газонокосарка, не повинна працювати **в неділю й свята весь день** і **в будні з 20:00 до 7:00**. Обідньої тиші (*Mittagsruhe*) за законом на всю країну немає, але вона може бути вписана в **Hausordnung** (правила будинку), договір оренди чи місцеві правила. Тож чому сусід стукає о 22:05? Бо музика, дриль чи гучна розмова після 22:00 для нього — порушення нічної тиші, яке забороняє Hausordnung, а за § 17 LImschG NRW можливий штраф.

> [!diagram] Тиша на добу: приклад для багатоквартирного будинку
> ```yaml
> layout: timeline
> nodes:
>   - { id: n1, at: "06:00", text: "Nachtruhe endet", note: "типово 22:00–6:00; межі залежать від землі й Hausordnung", tone: gray }
>   - { id: g1, at: "07:00", text: "Gartengeräte erlaubt", note: "будні 7:00–20:00 за 32. BImSchV у захищених зонах", tone: yellow }
>   - { id: m1, at: "13:00–15:00", text: "Mittagsruhe?", note: "лише якщо вписана в Hausordnung чи місцеві правила", tone: pink }
>   - { id: g2, at: "20:00", text: "Gartengeräte verboten", note: "будні: 20:00–7:00", tone: yellow }
>   - { id: n2, at: "22:00", text: "Nachtruhe beginnt", note: "музика, дриль, голосні гості — тихіше", tone: gray }
>   - { id: so, at: "Sonntag / Feiertag", text: "ganztägig Ruhe", note: "лише для певних приладів і дій", tone: pink }
> steps:
>   - { show: [n1, g1], note: "О 6:00 зазвичай закінчується нічна тиша, а садову техніку у вказаних зонах можна вмикати з 7:00." }
>   - { show: [m1, g2], note: "Обідня тиша не прописана законом по всій країні, а 20:00 — вечірня межа для приладів." }
>   - { show: [n2, so], note: "О 22:00 починається Nachtruhe; у неділю й свята садова техніка мовчить цілий день." }
> ```

### Sonntagsruhe: неділя — день спокою

У Grundgesetz (стаття 140) є посилання на статтю 139 Веймарської конституції: неділя та визнані державою свята залишаються «Tage der Arbeitsruhe und der seelischen Erhebung» — днями спокою від праці. На практиці це означає, що в неділю більшість крамниць зачинено. Час роботи крамниць (*Ladenschluss*) від 2006 року регулюють **землі**, а не федерація. Наприклад, у Баварії з 1 серпня 2025 року діє Bayerisches Ladenschlussgesetz: у будні крамниці працюють до 20:00, у неділю й свята зазвичай зачинені, з винятками (АЗС, аптеки, магазини на вокзалах, пекарні кілька годин). Кількість «торгових неділь» (*verkaufsoffene Sonntage*) мала й залежить від міста. У деяких землях у будні крамниці можуть працювати значно довше, тож правило «неділя вихідна» єдине, а решта — за місцем.

### Bargeld: готівка ще в ходу

Німці давно славляться любовʼю до готівки. За дослідженням Bundesbank «Zahlungsverhalten in Deutschland 2023» близько половини всіх платежів (51 %, у 2021 році — 58 %) здійснювали готівкою (**Bargeld**). Але за сумою (*Umsatz*) уперше лідирує дебетова картка (32 %), а готівка — 26 %. Тож для дрібних покупок, пекарні чи ярмарку тримай готівку, хоча картка приймається все частіше. Завжди дивись на написи на касі: *Nur Barzahlung* чи *Kartenzahlung möglich*.

### Lüften і Hausschuhe

**Lüften** — ще один «німецький» звичай. Рекомендація: кілька разів на день **Stoßlüften** — відчинити вікно навстіж на кілька хвилин (за даними міністерства Бранденбурга, взимку 5–10 хвилин, влітку довше), а не тримати його постійно привідчиненим. Так змінюється повітря, а вологість у кімнаті не повинна надовго перевищувати 60 %.

А ось **Hausschuhe** («домашні капці») — не закон, а звичай. У багатьох німецьких оселях взуття знімають на вході, особливо коли ти в гостях. Не впевнений — запитай: *Soll ich die Schuhe ausziehen?*

## Приклади

- *Ab 22 Uhr ist Nachtruhe.* — З 22:00 нічна тиша.
- *Entschuldigung, ich mache die Musik leise.* — Вибачте, я зроблю музику тихіше.
- *Wohin gehört das Papier? — In die blaue Tonne.* — Куди йде папір? — У блакитний бак.
- *Die Plastikflasche bringe ich zum Pfandautomaten.* — Пластикову пляшку я віднесу до автомата.
- *Wir trennen den Müll: Papier, Bio, Verpackungen und Restmüll.* — Ми розділяємо сміття: папір, біо, упаковка та залишкове.
- *Am Sonntag sind die meisten Geschäfte geschlossen.* — У неділю більшість магазинів зачинені.
- *Kann ich hier mit Karte bezahlen? — Nein, nur Bargeld.* — Тут можна картою? — Ні, лише готівкою.
- *Im Winter lüfte ich fünf Minuten lang.* — Узимку я провітрюю пʼять хвилин.
- *Soll ich die Schuhe ausziehen? — Ja, gern. Hier sind Hausschuhe.* — Мені зняти взуття? — Так, будь ласка. Ось капці.
- *Die Hausordnung hängt im Treppenhaus.* — Правила будинку висять на сходовій клітці.

## Слова

### Порядок і сміття

> [!word] die Pünktlichkeit
> ipa: /ˈpʏŋktlɪçkaɪ̯t/ · pos: noun · level: B1 · id: dl-a2-08-w01
> uk: пунктуальність
> forms: — (без множини)
> example: In Deutschland ist **Pünktlichkeit** wichtig. — У Німеччині пунктуальність важлива.
> note: суфікс -keit: рід жіночий, без винятків.

> [!word] die Mülltrennung
> ipa: /ˈmʏltˌtʁɛnʊŋ/ · pos: noun · level: A2 · id: dl-a2-08-w02
> uk: розділення сміття
> forms: — (без множини)
> example: Die **Mülltrennung** ist in Deutschland wichtig. — Розділення сміття в Німеччині важливе.

> [!word] der Müll
> ipa: /mʏl/ · pos: noun · level: A2 · id: dl-a2-08-w03
> uk: сміття
> forms: — (без множини)
> example: Wo ist der **Müll**? — Де сміття?
> note: AT/CH також *der Abfall*; CH часто *der Kehricht*.

> [!word] die Mülltonne
> ipa: /ˈmʏlˌtɔnə/ · pos: noun · level: A2 · id: dl-a2-08-w04
> uk: сміттєвий бак
> forms: die Mülltonnen
> example: Die **Mülltonne** steht vor dem Haus. — Бак стоїть перед будинком.

> [!word] die Biotonne
> ipa: /ˈbiːoˌtɔnə/ · pos: noun · level: A2 · id: dl-a2-08-w05
> uk: бак для біовідходів
> forms: die Biotonnen
> example: Obstreste kommen in die **Biotonne**. — Залишки фруктів кидають у біобак.

> [!word] der Restmüll
> ipa: /ˈʁɛstmʏl/ · pos: noun · level: A2 · id: dl-a2-08-w06
> uk: залишкове сміття
> forms: — (без множини)
> example: Windeln gehören in den **Restmüll**. — Підгузки йдуть у залишкове сміття.

> [!word] das Altglas
> ipa: /ˈaltɡlaːs/ · pos: noun · level: A2 · id: dl-a2-08-w07
> uk: використане скло (на переробку)
> forms: — (без множини)
> example: **Altglas** wirft man in den Container. — Використане скло кидають у контейнер.

> [!word] das Altpapier
> ipa: /ˈaltpaˌpiːɐ̯/ · pos: noun · level: A2 · id: dl-a2-08-w08
> uk: макулатура
> forms: — (без множини)
> example: Das **Altpapier** kommt in die blaue Tonne. — Макулатура йде в блакитний бак.

> [!word] der Gelbe Sack
> ipa: /ˈɡɛlbə zak/ · pos: noun · level: A2 · id: dl-a2-08-w09
> uk: жовтий мішок (для упаковки)
> forms: die Gelben Säcke
> example: Plastikverpackungen kommen in den **Gelben Sack**. — Пластикова упаковка йде в жовтий мішок.
> note: у частині міст замість нього *die Gelbe Tonne* або *die Wertstofftonne*.

### Pfand

> [!word] das Pfand
> ipa: /pfant/ · pos: noun · level: A2 · id: dl-a2-08-w10
> uk: застава (за пляшку, банку)
> forms: die Pfänder
> example: Auf der Flasche ist **Pfand**. — На пляшці є застава.
> note: Pfand за одноразову упаковку — 25 Cent; багаторазова — зазвичай 8 чи 15 Cent. CH: *das Depot* (за тару).

> [!word] der Pfandautomat
> ipa: /ˈpfantʔaʊ̯toˌmaːt/ · pos: noun · level: A2 · id: dl-a2-08-w11
> uk: автомат для здачі пляшок
> forms: die Pfandautomaten
> example: Wo ist der **Pfandautomat**? — Де автомат для пляшок?

### Тиша й правила будинку

> [!word] die Nachtruhe
> ipa: /ˈnaxtˌʁuːə/ · pos: noun · level: A2 · id: dl-a2-08-w12
> uk: нічна тиша
> forms: — (без множини)
> example: Ab 22 Uhr ist **Nachtruhe**. — З 22:00 нічна тиша.

> [!word] die Sonntagsruhe
> ipa: /ˈzɔntaːksˌʁuːə/ · pos: noun · level: B1 · id: dl-a2-08-w13
> uk: недільний спокій
> forms: — (без множини)
> example: Am Sonntag gilt die **Sonntagsruhe**. — У неділю діє недільний спокій.

> [!word] die Ruhestörung
> ipa: /ˈʁuːəˌʃtøːʁʊŋ/ · pos: noun · level: B1 · id: dl-a2-08-w14
> uk: порушення тиші
> forms: die Ruhestörungen
> example: Laute Musik nach 22 Uhr ist eine **Ruhestörung**. — Гучна музика після 22:00 — порушення тиші.

> [!word] das Treppenhaus
> ipa: /ˈtʁɛpn̩ˌhaʊ̯s/ · pos: noun · level: A2 · id: dl-a2-08-w15
> uk: сходова клітка
> forms: die Treppenhäuser
> example: Im **Treppenhaus** sind wir leise. — На сходах ми поводимося тихо.

> [!word] stören
> ipa: /ˈʃtøːʁən/ · pos: verb · level: A2 · id: dl-a2-08-w16
> uk: заважати, турбувати
> forms: stört · störte · hat gestört
> example: Die Musik **stört** die Nachbarn. — Музика заважає сусідам.

> [!word] leise
> ipa: /ˈlaɪ̯zə/ · pos: adj · level: A2 · id: dl-a2-08-w17
> uk: тихий, негучний; тихо
> forms: leiser · am leisesten
> example: Bitte sei **leise**! — Будь ласка, тихо!
> note: leise — про силу звуку; ruhig — про спокійний стан чи місце.

> [!word] der Lärm
> ipa: /lɛʁm/ · pos: noun · level: A2 · id: dl-a2-08-w18
> uk: шум
> forms: — (без множини)
> example: Der **Lärm** stört mich nachts. — Шум заважає мені вночі.

### Неділя, готівка, повітря

> [!word] der Feiertag
> ipa: /ˈfaɪ̯ɐˌtaːk/ · pos: noun · level: A2 · id: dl-a2-08-w19
> uk: святковий день
> forms: die Feiertage
> example: Am **Feiertag** sind die Geschäfte zu. — У святковий день магазини зачинені.

> [!word] der Ladenschluss
> ipa: /ˈlaːdn̩ˌʃlʊs/ · pos: noun · level: B1 · id: dl-a2-08-w20
> uk: час закриття магазинів
> forms: — (без множини)
> example: Um 20 Uhr ist **Ladenschluss**. — О 20:00 магазини зачиняються.

> [!word] das Bargeld
> ipa: /ˈbaːɐ̯ɡɛlt/ · pos: noun · level: A2 · id: dl-a2-08-w21
> uk: готівка
> forms: — (без множини)
> example: Hier zahlt man nur mit **Bargeld**. — Тут платять лише готівкою.

> [!word] lüften
> ipa: /ˈlʏftn̩/ · pos: verb · level: A2 · id: dl-a2-08-w22
> uk: провітрювати
> forms: lüftet · lüftete · hat gelüftet
> example: Ich **lüfte** das Zimmer fünf Minuten lang. — Я пʼять хвилин провітрюю кімнату.

> [!word] der Hausschuh
> ipa: /ˈhaʊ̯sʃuː/ · pos: noun · level: A2 · id: dl-a2-08-w23
> uk: домашній капець
> forms: die Hausschuhe
> example: Bei uns trägt man **Hausschuhe**. — У нас носять домашні капці.

## Слухаємо

> [!listen] Що сказано про тишу?
> level: A2 · type: choice · speed: slow · id: dl-a2-08-l01
> audio: Ab zweiundzwanzig Uhr ist Nachtruhe.
> - [x] Ab zweiundzwanzig Uhr ist Nachtruhe.
> - [ ] Ab zwölf Uhr ist Mittagsruhe.
> - [ ] Ab sechs Uhr ist Nachtruhe.
>
> **Пояснення:** *zweiundzwanzig Uhr* — 22:00. *Nachtruhe* — нічна тиша, а *Mittagsruhe* — обідня. 6:00 — це кінець нічної тиші, а не її початок.

> [!listen] Що робить співрозмовник B?
> level: A2 · type: answer · speed: slow · id: dl-a2-08-l02
> audio: A: Entschuldigung, es ist schon fünf nach zehn.
> audio: B: Oh, tut mir leid! Ich mache die Musik leise.
> - [ ] Він вимикає світло.
> - [x] Він робить музику тихіше.
> - [ ] Він іде до сусіда.
> - [ ] Він викликає поліцію.
>
> **Пояснення:** *leise machen* — зробити тихіше. *Es ist schon fünf nach zehn* — «уже пʼять по десятій» (22:05). *Tut mir leid* — «мені шкода».

> [!listen] Напиши або скажи, що почув
> level: A2 · type: dictation · speed: slow · id: dl-a2-08-l03
> audio: Sonntags sind die meisten Geschäfte geschlossen.
>
> **Пояснення:** *sonntags* — по неділях (прислівник, з маленької літери); *geschlossen* — зачинені. *Die meisten* — «більшість».

> [!listen] Скільки застави за пляшку?
> level: A2 · type: answer · speed: slow · id: dl-a2-08-l04
> audio: A: Wie viel Pfand gibt es für eine Einwegflasche?
> audio: B: Fünfundzwanzig Cent. Für Mehrwegflaschen meistens acht oder fünfzehn Cent.
> - [ ] 8 центів
> - [ ] 15 центів
> - [x] 25 центів
> - [ ] 1 євро
>
> **Пояснення:** *die Einwegflasche* — одноразова пляшка: 25 Cent. Для багаторазових (*Mehrwegflaschen*) застава зазвичай 8 чи 15 Cent. *Fünfundzwanzig* — «двадцять пʼять».

> [!listen] Правила будинку. Заповни нотатки.
> level: A2 · type: fill · speed: slow · id: dl-a2-08-l05
> audio: Bei uns im Haus ist die Nachtruhe von zweiundzwanzig bis sechs Uhr. Am Sonntag ist den ganzen Tag Ruhe. Bitte keine laute Musik und keine Bohrmaschine.
>
> ```fill
> Nachtruhe von [[22|zweiundzwanzig]] bis [[6|sechs]] Uhr
> Den ganzen Tag Ruhe: am [[Sonntag]]
> Nicht erlaubt: laute [[Musik]] und [[Bohrmaschine]]
> ```
>
> **Пояснення:** *den ganzen Tag* — «увесь день» (Akkusativ часу). *Die Bohrmaschine* — дриль; *laut* — гучний. Усі межі — приклад: у твоєму будинку вони можуть бути інші.

## Вимова

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: dl-a2-08-s01
> text: Entschuldigung, ich mache die Musik leise.
> ipa: /ɛntˈʃʊldɪɡʊŋ ɪç ˈmaxə diː muˈziːk ˈlaɪ̯zə/
> tip: ch у ich — [ç], мʼякий подих як у «хіть»; у mache — [x], як українське «х». Musik — наголос на кінці: «му-ЗІК».
> uk: Вибачте, я зроблю музику тихіше.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: dl-a2-08-s02
> text: Wo ist der Pfandautomat?
> ipa: /voː ɪst deːɐ̯ ˈpfantʔaʊ̯toˌmaːt/
> tip: Pf на початку слова — єдиний звук: [pf], губи «п» і одразу «ф»; au — [aʊ̯], як «ау».
> uk: Де автомат для пляшок?

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: dl-a2-08-s03
> text: Soll ich die Schuhe ausziehen?
> ipa: /zɔl ɪç diː ˈʃuːə ˈaʊ̯sˌtsiːən/
> tip: Schuhe — [ʃuːə], довге [uː] і слабке [ə] на кінці; ausziehen — відокремлюване дієслово, наголос на aus-.
> uk: Мені зняти взуття?

## Типові помилки й пастки

> [!pitfall] Запізнитися «трохи» — не дрібниця
> Для багатьох українців «прийти на 10–15 хвилин пізніше» — звична ввічливість. У Німеччині на зустріч із конкретним часом (лікар, співбесіда, робота, приватна домовленість) очікують, що ти прийдеш **вчасно**; запізнюючись, **попереджай** (*Ich komme zehn Minuten später*). Це неписаний звичай, а не закон, і він трохи різний у різних колах.

> [!pitfall] Pfand є не на кожній пляшці
> Часта помилка: «на кожній пляшці є Pfand, і всюди однаково». Насправді **Einweg** — 25 Cent, **Mehrweg** — зазвичай 8 чи 15 Cent, а деякі напої (вино, міцний алкоголь у склі) заставою не обкладаються. Не всяка пляшка із заставою — багаторазова: шукай напис *EINWEG* чи *MEHRWEG*. Магазини, що продають одноразову упаковку із заставою, зобовʼязані її приймати.

> [!pitfall] «Тиша — це лише після 22:00»
> Ні: **Nachtruhe** — лише одна частина. Є ще неділя й свята (*Sonntagsruhe*), правила для садової техніки (*32. BImSchV*) і власна **Hausordnung** будинку, яка може додати *Mittagsruhe*. Межі різняться в землях і містах: питай у Vermieter чи читай Hausordnung. Правила забороняють шумні дії, а не звичайне життя в квартирі, тому гучну музику, дриль чи вечірку після 22:00 краще не влаштовувати.

> [!pitfall] «Sei ruhig!» — це не «тихо, будь ласка»
> Українське «тихо» перекладай за ситуацією. **leise** — про гучність: *Bitte seid leise!* («Будьте тихіше»). **ruhig** — про спокій: *ein ruhiges Zimmer* — «тиха кімната». А *Sei ruhig!* звучить як грубе «Замовкни!». У ввічливому проханні краще: *Könnten Sie bitte etwas leiser sein?*

## Landeskunde-Text

> [!example] Fünf nach zehn
> Maria wohnt seit einem Monat in Köln. Am Abend um fünf nach zehn klopft ihr Nachbar an die Tür. „Entschuldigung, es ist schon nach zehn. Die Nachtruhe beginnt meistens um 22 Uhr.“ Maria hat laut Musik gehört. Sie sagt „Tut mir leid“ und macht die Musik leise.
>
> In Deutschland gibt es im Alltag viele Regeln. Man trennt den Müll: Papier, Bio, Verpackungen und Restmüll. Flaschen und Dosen bringt man zum Pfandautomaten im Supermarkt und bekommt Geld zurück. Sonntags sind die meisten Geschäfte geschlossen, deshalb kauft man am Samstag ein. In der Wohnung zieht man oft die Schuhe aus und trägt Hausschuhe.
>
> Die genauen Regeln stehen in der Hausordnung. Sie sind nicht überall gleich.
>
> *Слова:* *klopfen* — стукати; *meistens* — здебільшого; *die Dose* — банка; *zurückbekommen* — отримати назад; *genau* — точний.

> [!quiz] Lies den Text. Warum klopft der Nachbar?
> level: A2 · type: single · id: dl-a2-08-q02
> - [ ] Maria hat die Tür offen gelassen.
> - [x] Maria hört nach zehn Uhr laut Musik.
> - [ ] Maria ist am Sonntag einkaufen gegangen.
> - [ ] Maria hat ihren Müll falsch getrennt.
>
> **Пояснення:** *Maria hat laut Musik gehört* — вона слухала гучну музику; а *die Nachtruhe beginnt meistens um 22 Uhr*. Про сміття й неділю в тексті сказано окремо, це не причина стуку.

> [!quiz] Lies den Text. Was macht man mit Flaschen und Dosen?
> level: A2 · type: single · id: dl-a2-08-q03
> - [ ] Man wirft sie in den Restmüll.
> - [ ] Man bringt sie am Sonntag zum Nachbarn.
> - [x] Man bringt sie zum Pfandautomaten und bekommt Geld zurück.
> - [ ] Man trennt sie nach Farben im Treppenhaus.
>
> **Пояснення:** *Flaschen und Dosen bringt man zum Pfandautomaten im Supermarkt und bekommt Geld zurück.* Це не Restmüll: за них є застава (*Pfand*).

> [!quiz] Lies den Text. Was stimmt?
> level: A2 · type: single · id: dl-a2-08-q04
> - [ ] Die Regeln sind in ganz Deutschland genau gleich.
> - [ ] Sonntags sind alle Geschäfte offen.
> - [x] Die genauen Regeln stehen in der Hausordnung und sind nicht überall gleich.
> - [ ] Man trägt in der Wohnung nie Hausschuhe.
>
> **Пояснення:** *Die genauen Regeln stehen in der Hausordnung. Sie sind nicht überall gleich.* А *sonntags sind die meisten Geschäfte geschlossen* — тобто більшість, не всі.

## Практика

> [!quiz] Що правильно про Nachtruhe в Німеччині?
> level: A2 · type: single · id: dl-a2-08-q05
> - [ ] Вона однакова в усій країні й закінчується опівночі.
> - [ ] Вона діє лише в будинках із Hausordnung.
> - [x] Зазвичай вона 22:00–6:00, але точні межі залежать від землі, міста й Hausordnung.
> - [ ] Вона діє лише у вихідні.
>
> **Пояснення:** Ночі в правилах про шум (наприклад, § 9 LImschG NRW, TA Lärm) — 22:00–6:00. Правила встановлюють землі, а Hausordnung може додати свої межі, тому загальної «єдиної» цифри краще не стверджувати.

> [!quiz] Що правильно про Pfand? Обери всі правильні відповіді.
> level: A2 · type: multi · id: dl-a2-08-q06
> - [x] Застава за Einwegflasche — 25 Cent.
> - [x] Застава за Mehrwegflasche зазвичай 8 або 15 Cent.
> - [x] Дивись на напис EINWEG чи MEHRWEG на полиці.
> - [ ] Застава є на кожній пляшці, і вино теж.
>
> **Пояснення:** єдина застава 25 Cent — для одноразових пляшок і банок; для багаторазових немає єдиного закону. Вино й міцний алкоголь у скляних пляшках зазвичай без застави.

> [!quiz] Заповни пропуски словами з банку
> level: A2 · type: fill · id: dl-a2-08-q07 · bank: Altglas, Wertstofftonne
>
> ```text fill
> Die Zeitung kommt ins [[Altpapier]].
> Die Windel kommt in den [[Restmüll]].
> Kaffeesatz kommt in die [[Biotonne]].
> Plastikverpackungen kommen in den [[Gelben Sack]].
> ```
>
> **Пояснення:** газети — *Altpapier*; підгузки — *Restmüll*; кавова гуща — *Biotonne*; упаковка — *Gelber Sack*. *Altglas* (скло) і *Wertstofftonne* (бак для упаковки в частині міст) тут зайві.

> [!quiz] Розстав кроки: як здати пляшку
> level: A2 · type: order · id: dl-a2-08-q08
>
> ```text order
> Du bringst die Flaschen zum Supermarkt.
> Du steckst die Flaschen in den Pfandautomaten.
> Der Automat druckt den Pfandbon.
> An der Kasse bekommst du dein Geld.
> ```
>
> **Пояснення:** пляшки → автомат → чек (*Pfandbon*) → гроші на касі (або знижка на покупки). *Der Bon* — чек.

> [!quiz] Що показало дослідження Bundesbank «Zahlungsverhalten in Deutschland 2023»?
> level: A2 · type: single · id: dl-a2-08-q09
> - [ ] Німці вже майже не платять готівкою.
> - [x] Готівкою ще платили близько половини разів (51 %), але за сумою перевагу має картка.
> - [ ] Готівкою платять близько 80 % разів.
> - [ ] Готівка перевищує картку і за кількістю, і за сумою.
>
> **Пояснення:** у 2023 році готівка складала 51 % платежів (у 2021 — 58 %). Але в сумі продажів картка (32 %) вперше випередила готівку (26 %).

> [!quiz] Склади речення: «Після 22:00 ми маємо поводитися тихо».
> level: A2 · type: order · id: dl-a2-08-q10
>
> ```text order
> Nach 22 Uhr
> müssen
> wir
> leise sein.
> sind ✗
> ```
>
> **Пояснення:** дієслово на другому місці (V2): *Nach 22 Uhr müssen wir …*. Модальне дієслово *müssen* вимагає інфінітива в кінці: *leise sein*. *Sind* тут зайве.

> [!quiz] Що казати, коли хочеш ввічливо попросити сусіда про тишу?
> level: A2 · type: single · id: dl-a2-08-q11
> - [ ] Sei ruhig!
> - [ ] Du bist ruhig.
> - [x] Könnten Sie bitte etwas leiser sein?
> - [ ] Machen Sie das Licht aus!
>
> **Пояснення:** *leise* — про гучність, *Könnten Sie bitte …?* — ввічливе прохання. *Sei ruhig!* — грубе «Замовкни!»; *Du bist ruhig* означає «ти спокійний».

> [!quiz] Заповни пропуски словами з банку
> level: A2 · type: fill · id: dl-a2-08-q12 · bank: Mittagsruhe, Mehrweg
>
> ```text fill
> In der Wohnung trägt man oft [[Hausschuhe]].
> Auf der Flasche ist [[Pfand]].
> In der Nacht ab 22 Uhr gilt die [[Nachtruhe]].
> Die Wohnung ist ruhig, es gibt keinen [[Lärm]].
> ```
>
> **Пояснення:** *Hausschuhe* — капці; *Pfand* — застава; *Nachtruhe* — нічна тиша; *Lärm* — шум. *Mittagsruhe* і *Mehrweg* — зайві слова: нічна тиша в реченні — саме *Nachtruhe*, а *Mehrweg* — про пляшки.

> [!quiz] Що з цього НЕ є правилом, а лише звичаєм?
> level: A2 · type: single · id: dl-a2-08-q13
> - [ ] Нічна тиша в § 9 LImschG NRW.
> - [ ] Недільний спокій у Grundgesetz (стаття 140).
> - [x] Зняти взуття й надягти Hausschuhe в гостях.
> - [ ] Застава 25 Cent на одноразову пляшку.
>
> **Пояснення:** взуття знімають за звичаєм — закону про Hausschuhe немає. А тиша, неділя й Pfand визначені законами й правилами.

## Фішки

> [!reel] 🕙 Чому саме 22:05
> У багатьох німецьких правилах ніч починається о 22:00: це зазначено в § 9 Landes-Immissionsschutzgesetz Nordrhein-Westfalen і в технічній інструкції TA Lärm, де «ніч» — 22:00–6:00. Тож гучна розмова о 22:05 — це вже ніч. Але в різних землях і будинках межі можуть відрізнятися.

> [!reel] 🍾 Pfand ≠ Mehrweg
> Не кожна пляшка з заставою багаторазова. Застава на одноразову упаковку — завжди 25 Cent, а багаторазова зазвичай 8 чи 15 Cent. Міністерство довкілля наголошує: дивитися на напис *EINWEG* чи *MEHRWEG* на полиці, а не лише на суму застави.

> [!reel] 💶 Cash is king? Наполовину
> За даними Bundesbank (2023) готівкою здійснюють близько половини платежів (51 %). Але за сумою картка вперше випередила готівку: 32 % проти 26 %. Тож малі суми частіше сплачують готівкою, а великі — карткою.

> [!reel] ⛪ Неділя в конституції 1919 року
> Недільний спокій закріплено ще у Веймарській конституції 1919 року (стаття 139), яку Grundgesetz увібрав у статті 140. Час роботи крамниць нині визначають землі. У Баварії новий закон діє з 1 серпня 2025 року: у будні до 20:00, у неділю зачинено з винятками.

> [!reel] 🪟 Лютий мороз — і вікно навстіж
> У Німеччині радять не тримати вікно привідчиненим, а кілька разів на день провітрювати навстіж. Міністерство охорони здоровʼя Бранденбурга пише: взимку 5–10 хвилин, влітку довше. Так швидко змінюється повітря в кімнаті.

## Джерела та що почитати

- Gesetze im Internet — [Grundgesetz, Art. 140](https://www.gesetze-im-internet.de/gg/art_140.html) і [Weimarer Reichsverfassung, Art. 139](https://www.gesetze-im-internet.de/wrv/art_139.html) (недільний спокій).
- Gesetze im Internet — [Kreislaufwirtschaftsgesetz § 20](https://www.gesetze-im-internet.de/krwg/__20.html) (роздільне збирання відходів); [32. BImSchV](https://www.gesetze-im-internet.de/bimschv_32/__7.html) (шум приладів, § 7).
- Verwaltungsvorschriften im Internet — [TA Lärm](https://www.verwaltungsvorschriften-im-internet.de/bsvwvbund_26081998_IG19980826.htm) (день 6:00–22:00, ніч 22:00–6:00); Landesrecht — [§ 9 LImschG NRW (Schutz der Nachtruhe)](https://lexmea.de/de/gesetz/limschg-nrw/9); [Stadt Essen — Lärmbeschwerden](https://www.essen.de/leben/sicherheit_und_ordnung/laermbeschwerden.de.html).
- Bayerisches Staatsministerium — [Ladenschlussrecht (BayLadSchlG, з 1.8.2025)](https://www.stmas.bayern.de/themen/arbeitsschutz/ladenschluss/); [IHK München — Ladenschluss](https://www.ihk-muenchen.de/ratgeber/recht/gewerberecht/ladenschluss/).
- BUND — [Müll trennen: was gehört in welche Tonne](https://www.bund.net/bund-tipps/detail-tipps/tip/muell-trennen-tonnen-recycling-einfach-erklaert/); BMUKN — [Einweg und Mehrweg: FAQ](https://www.bundesumweltministerium.de/faqs/einweg-und-mehrweg); [Verbraucherzentrale — Mehrweg oder Einweg: Pfand](https://www.verbraucherzentrale.de/wissen/umwelt-haushalt/abfall/mehrweg-oder-einweg-wichtige-unterschiede-beim-pfand-11504).
- Deutsche Bundesbank — [Zahlungsverhalten in Deutschland 2023](https://www.bundesbank.de/resource/blob/934826/cf30c0491030c0c6eab3d341d1990e12/mL/zahlungsverhalten-in-deutschland-2023-data.pdf) (PDF) і [огляд дослідження](https://www.bundesbank.de/de/aufgaben/unbarer-zahlungsverkehr/veroeffentlichungen/newsletter/studie-der-bundesbank-zum-zahlungsverhalten-941082).
- Land Brandenburg, MASGZ — [Richtig lüften und heizen](https://masgz.brandenburg.de/masgz/de/themen/gesundheit/umweltbezogener-gesundheitsschutz/richtig-lueften-und-heizen/).
- mietrecht.de — [Ruhezeiten: was gilt und wann ist was erlaubt](https://www.mietrecht.de/ruhezeiten/) (Hausordnung, Mittagsruhe).
- DWDS — [Pfand](https://www.dwds.de/wb/Pfand), [Ruhezeit](https://www.dwds.de/wb/Ruhezeit), [Sonntagsruhe](https://www.dwds.de/wb/Sonntagsruhe), [Mülltrennung](https://www.dwds.de/wb/M%C3%BClltrennung), [lüften](https://www.dwds.de/wb/l%C3%BCften), [Pünktlichkeit](https://www.dwds.de/wb/P%C3%BCnktlichkeit), [Hausschuh](https://www.dwds.de/wb/Hausschuh).

> [!important] Підсумок
> - **Звичай чи закон:** пунктуальність і Hausschuhe — звичаї; Nachtruhe, Sonntagsruhe, Pfand — визначені правилами, але деталі залежать від землі, міста й Hausordnung.
> - **Сміття:** *Restmüll*, *Biotonne*, *Gelber Sack*, *Altpapier*, *Altglas* — правила комуни різняться; дивись *Abfallkalender* свого міста.
> - **Pfand:** *Einweg* — 25 Cent, *Mehrweg* — зазвичай 8 чи 15 Cent; дивись напис EINWEG / MEHRWEG; здавай у *Pfandautomat*.
> - **Тиша:** *Nachtruhe* зазвичай 22:00–6:00; неділя й свята — окремо; *Mittagsruhe* лише за Hausordnung чи місцевими правилами.
> - **Неділя:** Art. 140 GG + Art. 139 WRV; час роботи крамниць визначають землі.
> - **Bargeld:** 51 % платежів у 2023, але картка випереджає за сумою.
> - **Мова:** *leise* ≠ *ruhig*; ввічливо: *Könnten Sie bitte etwas leiser sein?*
