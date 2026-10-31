---
title: Ситуації — Bürgeramt, Anmeldung, огляд квартири, аптека
id: de-a2-situationen
level: A2
icon: px:building
tags: [deutsch, a2, skills, situationen, behoerde, wohnung, apotheke, bank]
prerequisites: ["[[Deutsch - A2 - 25. Непрямі питання — Wissen Sie, wo…, ob]]", "[[Deutsch - A2 - 24. Гроші, банк, пошта й послуги]]"]
estimatedMinutes: 45
---

# Ситуації — Bürgeramt, Anmeldung, огляд квартири, аптека

> [!success] Після цієї теми ти зможеш
> - прийти на прийом у **Bürgeramt**, зареєструвати нову адресу (*Anmeldung*) і назвати потрібні документи;
> - оглянути квартиру й спитати про *Kaltmiete*, *Nebenkosten*, *Kaution*, *Haustier*;
> - купити в *Apotheke* ліки без рецепта й зрозуміти, як їх приймати;
> - відкрити рахунок: *Ich möchte ein Konto eröffnen*;
> - ввічливо перепитати, перенести запис і скористатися формулами ввічливості.

## Передбач

> [!quiz] У Bürgeramt ти не зрозумів службовця. Що ввічливо сказати?
> level: A2 · type: single · id: de-a2-situationen-q01
> - [ ] Was? Ich habe nicht verstanden.
> - [x] Könnten Sie das bitte wiederholen?
> - [ ] Wiederholen Sie das!
> - [ ] Ich verstehe Sie nicht, sprechen Sie anders.
>
> **Пояснення:** ввічливе прохання — ***Könnten Sie das bitte wiederholen?*** Сухе *Was?* звучить грубо, а наказова форма *Wiederholen Sie das!* без *bitte* виглядає як наказ.

## Пояснення

### Ввічливість: формули на всі випадки

В установах, аптеці й банку до тебе звертаються на **Sie**, і ти теж. Кілька готових фраз роблять розмову спокійною.

| Ситуація | Фраза |
|---|---|
| Привітатися | Guten Morgen. · Guten Tag. · Guten Abend. |
| Почати прохання | Ich möchte … · Ich hätte gern … · Ich brauche … |
| Ввічливіше про можливість | Könnten Sie mir bitte helfen? · Wäre es möglich, …? |
| Не зрозумів | Wie bitte? · Könnten Sie das bitte wiederholen? · Könnten Sie bitte langsamer sprechen? |
| Спитати, як пишеться | Wie schreibt man das? · Könnten Sie das bitte buchstabieren? |
| Уточнити | Habe ich das richtig verstanden? Ich muss …, oder? |
| Подякувати | Vielen Dank! · Danke schön. · Danke für Ihre Hilfe. |
| Попрощатися | Auf Wiedersehen. · Einen schönen Tag noch! |

Не кажи ~~Ich will~~ або ~~Gib mir~~: це звучить вимогливо. Переважно на A2 вистачає ***Ich möchte …*** і ***Ich hätte gern …***. Непрямі питання з попередньої теми теж підходять: *Können Sie mir sagen, wo …?*, *Wissen Sie, ob …?*

### Ситуація 1: Bürgeramt і Anmeldung

Хто в Німеччині переїжджає в нову квартиру, мусить зареєструвати адресу (***die Anmeldung***). Це обовʼязок: за законом про реєстр населення (§ 17 Bundesmeldegesetz) зареєструватися потрібно протягом двох тижнів після заселення. Здебільшого запис на прийом (*Termin*) роблять онлайн на сайті міста або району.

> [!diagram] Як пройти Anmeldung
> ```yaml
> layout: flow
> nodes:
>   - { id: termin, label: "1. Termin", text: "запис онлайн", note: "на сайті міста, інколи по телефону", tone: yellow }
>   - { id: docs, label: "2. Unterlagen", text: "документи", note: "Ausweis / Reisepass, Wohnungsgeberbestätigung, форма", tone: pink }
>   - { id: nummer, label: "3. Wartenummer", text: "номер у черзі", note: "чекаєш, поки назвуть", tone: gray }
>   - { id: gespraech, label: "4. Gespräch", text: "розмова зі службовцем", note: "перевірка й підпис", tone: yellow }
>   - { id: bescheinigung, label: "5. Meldebescheinigung", text: "довідка про реєстрацію", note: "збережи: знадобиться банку й роботодавцю", tone: pink }
> edges:
>   - { from: termin, to: docs }
>   - { from: docs, to: nummer }
>   - { from: nummer, to: gespraech }
>   - { from: gespraech, to: bescheinigung }
> steps:
>   - { focus: termin, note: "Спочатку запис. Без Termin у деяких містах приймають лише в окремі години або не приймають, тому дивись сайт свого Bürgeramt." }
>   - { focus: docs, note: "Потрібні документ з фото (Personalausweis або Reisepass), Wohnungsgeberbestätigung від власника житла та заповнений формуляр. Точний перелік дивись у повідомленні про запис." }
>   - { focus: nummer, note: "У багатьох відомствах береш Wartenummer або чекаєш виклику: Die Nummer 47 bitte (aufrufen)." }
>   - { focus: gespraech, note: "Службовець (der Mitarbeiter / die Mitarbeiterin) перевіряє документи. Ти підтверджуєш дані та підписуєш." }
>   - { focus: bescheinigung, note: "Отримуєш Meldebescheinigung. Вона потрібна для банку, роботодавця, інших установ." }
> ```
> Кольори тільки чергують кроки; назву кожного кроку видно в підписі.

Корисні фрази:

| Що сказати | Значення |
|---|---|
| Ich habe um zehn Uhr einen Termin. | У мене запис на десяту. |
| Ich möchte meine Wohnung anmelden. | Я хочу зареєструвати своє житло. |
| Hier sind mein Ausweis und die Wohnungsgeberbestätigung. | Ось мій документ і підтвердження від власника житла. |
| Brauche ich noch weitere Unterlagen? | Мені потрібні ще якісь документи? |
| Wo muss ich unterschreiben? | Де мені підписати? |
| Kann ich den Termin verschieben? | Чи можна перенести запис? |

### Ситуація 2: огляд квартири

На огляді (***die Wohnungsbesichtigung***) ставлять конкретні питання про гроші, терміни й правила.

| Тема | Питання |
|---|---|
| Ціна | Wie hoch ist die Kaltmiete? · Wie hoch sind die Nebenkosten? |
| Загальна сума | Was ist die Warmmiete? |
| Застава | Wie hoch ist die Kaution? |
| Термін | Ist der Mietvertrag unbefristet? Ab wann ist die Wohnung frei? |
| Меблі | Ist die Einbauküche dabei? |
| Правила | Darf ich ein Haustier haben? Gibt es eine Hausordnung? |
| Заселення | Wann ist die Übergabe? |

Розрахунок простий: **Kaltmiete + Nebenkosten = Warmmiete** (зазвичай, залежно від того, як оголошення рахує опалення). Орендодавець не може вимагати Kaution більше ніж три місячні Kaltmieten (§ 551 BGB).

> [!diagram] Огляд, банк, аптека: що сказати і взяти
> ```yaml
> layout: compare
> columns: { w: "Wohnung", a: "Apotheke", b: "Bank" }
> nodes:
>   - { id: w1, col: w, label: "Що сказати", text: "Ist der Mietvertrag unbefristet?", note: "питання про договір", tone: gray }
>   - { id: w2, col: w, label: "Що мати", text: "документи, часто Schufa-Auskunft", note: "її часто просять", tone: gray }
>   - { id: a1, col: a, label: "Що сказати", text: "Haben Sie etwas gegen Kopfschmerzen?", note: "gegen + Akkusativ", tone: gray }
>   - { id: a2, col: a, label: "Що мати", text: "рецепт, якщо він потрібен", note: "ліки без рецепта — rezeptfrei", tone: gray }
>   - { id: b1, col: b, label: "Що сказати", text: "Ich möchte ein Konto eröffnen.", note: "готова фраза", tone: gray }
>   - { id: b2, col: b, label: "Що мати", text: "Ausweis, Meldebescheinigung", note: "банк повідомить, що ще потрібно", tone: gray }
> steps:
>   - { focus: [w1, w2], note: "Для квартири питай про термін договору, гроші й правила. Орендодавці часто просять підтвердження доходу та Schufa-Auskunft." }
>   - { focus: [a1, a2], note: "В аптеці скажи, що болить або чого шукаєш; фармацевт запитає про алергію й ліки, що вже приймаєш." }
>   - { focus: [b1, b2], note: "У банку скажи про рахунок і покажи документ та підтвердження адреси; перелік уточни в банку." }
> ```

### Ситуація 3: аптека

В ***Apotheke*** продають рецептурні ліки та ті, що відпускаються лише в аптеці (на відміну від *Drogerie*), і консультує фармацевт (***die Beratung***). Скажи, що болить, і спитай, чи є щось без рецепта (***rezeptfrei***). Перед прийомом прочитай ***Packungsbeilage***: там дозування й ***Nebenwirkungen***.

| Що сказати | Значення |
|---|---|
| Haben Sie etwas gegen Kopfschmerzen? | Чи є у Вас щось від головного болю? |
| Ist das rezeptfrei? | Це без рецепта? |
| Wie oft soll ich die Tabletten nehmen? | Як часто мені приймати таблетки? |
| Gibt es Nebenwirkungen? | Чи є побічні дії? |
| Ich habe ein Rezept. | У мене є рецепт. |
| Ich bin allergisch gegen Penicillin. | У мене алергія на пеніцилін. |

### Ситуація 4: банк

Щоб відкрити рахунок (***ein Konto eröffnen***), потрібні документ з фото й, як правило, підтвердження адреси; точний перелік залежить від банку. Розмова проста: ти говориш, що хочеш, службовець задає питання, ти підписуєш (***unterschreiben***). Картки й постійні доручення (*Dauerauftrag*) ти вже знаєш із теми про гроші.

## Приклади

- *Guten Tag, ich habe um zehn Uhr einen Termin.* — Добрий день, у мене запис на десяту.
- *Ich möchte meine neue Wohnung anmelden.* — Я хочу зареєструвати нову квартиру.
- *Hier ist meine Wohnungsgeberbestätigung.* — Ось моє підтвердження від власника житла.
- *Könnten Sie mir bitte sagen, wo ich unterschreiben muss?* — Чи не могли б Ви сказати, де мені підписати?
- *Wie hoch ist die Kaltmiete und wie hoch sind die Nebenkosten?* — Яка Kaltmiete і яка сума Nebenkosten?
- *Ist der Mietvertrag unbefristet?* — Договір оренди безстроковий?
- *Darf ich ein Haustier haben?* — Чи можу я мати домашню тварину?
- *Haben Sie etwas gegen Husten? Ich habe kein Rezept.* — Чи є у Вас щось від кашлю? У мене немає рецепта.
- *Ich möchte ein Konto eröffnen. Was brauche ich dafür?* — Я хочу відкрити рахунок. Що мені для цього потрібно?

## Слова

> [!word] das Bürgeramt
> ipa: /ˈbʏʁɡɐˌʔamt/ · pos: noun · level: A2 · id: de-a2-situationen-w01
> uk: бюро для громадян (міська адміністрація, куди йдуть з документами)
> forms: die Bürgerämter
> example: Das **Bürgeramt** ist von acht bis sechzehn Uhr geöffnet. — Bürgeramt відчинене з восьмої до шістнадцятої.
> note: називають по-різному: Bürgerbüro, Einwohnermeldeamt, Kundenzentrum. AT: Gemeindeamt / Magistrat, CH: Einwohnerkontrolle / Gemeinde.

> [!word] die Anmeldung
> ipa: /ˈanmɛldʊŋ/ · pos: noun · level: A2 · id: de-a2-situationen-w02
> uk: реєстрація; запис (на курс)
> forms: die Anmeldungen
> example: Die **Anmeldung** ist Pflicht. — Реєстрація обовʼязкова.
> note: -ung → die. Окремі значення: реєстрація адреси, запис на курс. AT: Meldezettel.

> [!word] abmelden
> ipa: /ˈapmɛldn̩/ · pos: verb · level: A2 · id: de-a2-situationen-w03
> uk: зняти з реєстрації; скасувати запис
> forms: abmelden → meldete ab → hat abgemeldet
> example: Ich möchte mich vom Kurs **abmelden**. — Я хочу відписатися від курсу.
> note: відокремлюване. Для адреси потрібне, зокрема, коли виїжджаєш з Німеччини; при переїзді в межах країни достатньо Anmeldung на новому місці.

> [!word] die Meldebescheinigung
> ipa: /ˈmɛldəbəˌʃaɪ̯nɪɡʊŋ/ · pos: noun · level: A2 · id: de-a2-situationen-w04
> uk: довідка про реєстрацію за місцем проживання
> forms: die Meldebescheinigungen
> example: Die Bank braucht eine **Meldebescheinigung**. — Банку потрібна довідка про реєстрацію.
> note: складне слово: melden + Bescheinigung. Довге слово читай по частинах: Melde-be-schei-ni-gung. Інколи її називають Anmeldebestätigung.

> [!word] die Behörde
> ipa: /bəˈhøːɐ̯də/ · pos: noun · level: A2 · id: de-a2-situationen-w05
> uk: державна установа, відомство
> forms: die Behörden
> example: Viele **Behörden** haben Online-Termine. — Багато установ мають онлайн-запис.
> note: ö довге [øː]; h тут — легкий видих [h], не «г». Загальне слово для Amt, Bürgeramt, Ausländerbehörde.

> [!word] das Amt
> ipa: /amt/ · pos: noun · level: A2 · id: de-a2-situationen-w06
> uk: відомство; установа; посада
> forms: die Ämter
> example: Ich muss zum **Amt**. — Мені треба в установу.
> note: у складних словах: Arbeitsamt, Standesamt, Finanzamt. Множина з умлаутом.

> [!word] der Personalausweis
> ipa: /pɛʁzoˈnaːlˌʔaʊ̯svaɪ̯s/ · pos: noun · level: A2 · id: de-a2-situationen-w07
> uk: посвідчення особи (внутрішній документ)
> forms: die Personalausweise
> example: Bitte legen Sie Ihren **Personalausweis** vor. — Будь ласка, подайте Ваше посвідчення особи.
> note: скорочено: der Ausweis. CH: die Identitätskarte (ID). Іноземці мають Reisepass або Aufenthaltstitel.

> [!word] die Wohnungsgeberbestätigung
> ipa: /ˈvoːnʊŋsɡeːbɐbəˌʃtɛːtɪɡʊŋ/ · pos: noun · level: B1 · id: de-a2-situationen-w08
> uk: підтвердження від власника / орендодавця житла (для Anmeldung)
> forms: die Wohnungsgeberbestätigungen
> example: Meine Vermieterin schreibt mir die **Wohnungsgeberbestätigung**. — Орендодавиця пише мені підтвердження для реєстрації.
> note: за законом його має видати власник або особа, яка здає житло. Якщо власник відмовляється, одразу повідом про це Bürgeramt (§ 19 BMG).

> [!word] die Wartenummer
> ipa: /ˈvaʁtn̩ˌnʊmɐ/ · pos: noun · level: A2 · id: de-a2-situationen-w09
> uk: номер у черзі
> forms: die Wartenummern
> example: Ziehen Sie bitte eine **Wartenummer**. — Візьміть, будь ласка, номерок у черзі.
> note: warten + Nummer. Warten- читаємо [ˈvaʁtn̩]: -en слабке, майже без голосного.

> [!word] aufrufen
> ipa: /ˈaʊ̯fˌʁuːfn̩/ · pos: verb · level: A2 · id: de-a2-situationen-w10
> uk: викликати (за номером чи прізвищем)
> forms: aufrufen → rief auf → hat aufgerufen
> example: Ihre Nummer wird gleich **aufgerufen**. — Ваш номер зараз викличуть.
> note: відокремлюване, сильне. Часто в пасиві: wird aufgerufen.

> [!word] beantragen
> ipa: /bəˈantʁaːɡn̩/ · pos: verb · level: B1 · id: de-a2-situationen-w11
> uk: подавати заяву; клопотати про що
> forms: beantragen → beantragte → hat beantragt
> example: Ich möchte einen Ausweis **beantragen**. — Я хочу подати заяву на документ.
> note: невідокремлюване (be-). Іменник: der Antrag. Без ge- у Partizip II.

> [!word] der Antrag
> ipa: /ˈantʁaːk/ · pos: noun · level: B1 · id: de-a2-situationen-w12
> uk: заява; клопотання
> forms: die Anträge
> example: Füllen Sie bitte den **Antrag** aus. — Заповніть, будь ласка, заяву.
> note: einen Antrag stellen — подати заяву. g на кінці = [k]; множина з умлаутом.

> [!word] vorlegen
> ipa: /ˈfoːɐ̯leːɡn̩/ · pos: verb · level: B1 · id: de-a2-situationen-w13
> uk: предʼявити; подати (документ)
> forms: vorlegen → legte vor → hat vorgelegt
> example: Bitte **legen** Sie den Mietvertrag **vor**. — Будь ласка, подайте договір оренди.
> note: відокремлюване. Формальне слово для установ. v на початку = [f].

> [!word] die Unterlagen
> ipa: /ˈʊntɐlaːɡn̩/ · pos: noun · level: B1 · id: de-a2-situationen-w14
> uk: документи; папери
> forms: — (лише множина: die Unterlagen)
> example: Haben Sie alle **Unterlagen** dabei? — У Вас є всі документи?
> note: майже завжди множина. Відрізняється від das Dokument (окремий документ) і die Papiere. Наголос на першому складі.

> [!word] die Wohnungsbesichtigung
> ipa: /ˈvoːnʊŋsbəˌzɪçtɪɡʊŋ/ · pos: noun · level: B1 · id: de-a2-situationen-w15
> uk: огляд квартири
> forms: die Wohnungsbesichtigungen
> example: Die **Wohnungsbesichtigung** ist am Samstag um elf Uhr. — Огляд квартири в суботу об одинадцятій.
> note: складне слово: Wohnung + Besichtigung. Розмовно: der Besichtigungstermin. ch після і = [ç].

> [!word] besichtigen
> ipa: /bəˈzɪçtɪɡn̩/ · pos: verb · level: B1 · id: de-a2-situationen-w16
> uk: оглядати (приміщення, памʼятку)
> forms: besichtigen → besichtigte → hat besichtigt
> example: Wir **besichtigen** morgen eine Wohnung. — Завтра ми оглядатимемо квартиру.
> note: невідокремлюване. s перед i = [z]. Також: Sehenswürdigkeiten besichtigen — оглядати визначні місця.

> [!word] die Warmmiete
> ipa: /ˈvaʁmˌmiːtə/ · pos: noun · level: B1 · id: de-a2-situationen-w17
> uk: оренда з комунальними витратами
> forms: die Warmmieten
> example: Die **Warmmiete** beträgt 800 Euro im Monat. — Оренда з комуналкою становить 800 євро на місяць.
> note: Kaltmiete + Nebenkosten (часто разом з опаленням); у конкретному оголошенні уточни, що саме входить.

> [!word] der Mietvertrag
> ipa: /ˈmiːtfɛɐ̯ˌtʁaːk/ · pos: noun · level: A2 · id: de-a2-situationen-w18
> uk: договір оренди
> forms: die Mietverträge
> example: Ich lese den **Mietvertrag** noch einmal genau. — Я ще раз уважно читаю договір оренди.
> note: Miete + Vertrag (der Vertrag → der Mietvertrag). Не підписуй, поки не зрозумів умови.

> [!word] die Hausverwaltung
> ipa: /ˈhaʊ̯sfɛɐ̯ˌvaltʊŋ/ · pos: noun · level: B1 · id: de-a2-situationen-w19
> uk: керуюча компанія будинку
> forms: die Hausverwaltungen
> example: Die **Hausverwaltung** schickt die Abrechnung. — Керуюча компанія надсилає розрахунок.
> note: це може бути і власник, і окрема фірма. Контакт зазвичай на табличці у підʼїзді.

> [!word] unbefristet
> ipa: /ˈʊnbəfʁɪstət/ · pos: adj · level: B1 · id: de-a2-situationen-w20
> uk: безстроковий
> example: Der Vertrag ist **unbefristet**. — Договір безстроковий.
> note: протилежне — befristet («строковий»). Від die Frist («строк»). Наголос на першому складі.

> [!word] die Einbauküche
> ipa: /ˈaɪ̯nbaʊ̯ˌkʏçə/ · pos: noun · level: B1 · id: de-a2-situationen-w21
> uk: вбудована кухня
> forms: die Einbauküchen
> example: Die Wohnung hat eine **Einbauküche**. — У квартирі є вбудована кухня.
> note: у здаваних квартирах кухні часто немає взагалі, тому в оголошенні це важливий пункт. ü = [ʏ], ch = [ç].

> [!word] das Haustier
> ipa: /ˈhaʊ̯stiːɐ̯/ · pos: noun · level: A2 · id: de-a2-situationen-w22
> uk: домашня тварина
> forms: die Haustiere
> example: Sind **Haustiere** erlaubt? — Чи дозволені домашні тварини?
> note: умови про тварин часто прописані в договорі або Hausordnung. h — видих; ie = довге [iː].

> [!word] der Hausmeister
> ipa: /ˈhaʊ̯sˌmaɪ̯stɐ/ · pos: noun · level: A2 · id: de-a2-situationen-w23
> uk: завгосп, технічний доглядач будинку
> forms: die Hausmeister
> example: Der **Hausmeister** repariert die Heizung. — Hausmeister лагодить опалення.
> note: Hausmeisterin — жінка. Слід звертатися, коли зламалося щось у будинку.

> [!word] die Übergabe
> ipa: /ˈyːbɐɡaːbə/ · pos: noun · level: B1 · id: de-a2-situationen-w24
> uk: передача (ключів, квартири)
> forms: die Übergaben
> example: Die **Übergabe** der Wohnung ist am Ersten. — Передача квартири першого числа.
> note: при Übergabe складають протокол (Übergabeprotokoll): запиши стан квартири й покази лічильників.

> [!word] unterschreiben
> ipa: /ʊntɐˈʃʁaɪ̯bn̩/ · pos: verb · level: A2 · id: de-a2-situationen-w25
> uk: підписувати
> forms: unterschreiben → unterschrieb → hat unterschrieben
> example: Bitte **unterschreiben** Sie hier. — Підпишіть, будь ласка, тут.
> note: невідокремлюване, наголос на -schrei-. Іменник: die Unterschrift. ei = «ай».

> [!word] rezeptfrei
> ipa: /ʁeˈtsɛptfʁaɪ̯/ · pos: adj · level: B1 · id: de-a2-situationen-w26
> uk: без рецепта; безрецептурний
> example: Diese Tabletten sind **rezeptfrei**. — Ці таблетки без рецепта.
> note: протилежне — rezeptpflichtig. Не «безкоштовний»: безкоштовно — kostenlos.

> [!word] die Packungsbeilage
> ipa: /ˈpakʊŋsˌbaɪ̯laːɡə/ · pos: noun · level: B1 · id: de-a2-situationen-w27
> uk: інструкція в упаковці ліків
> forms: die Packungsbeilagen
> example: Bitte lesen Sie die **Packungsbeilage**. — Будь ласка, прочитайте інструкцію в упаковці.
> note: там дозування, протипоказання, побічні дії. Скорочено: Beipackzettel (розмовно).

> [!word] die Beratung
> ipa: /bəˈʁaːtʊŋ/ · pos: noun · level: A2 · id: de-a2-situationen-w28
> uk: консультація; порада
> forms: die Beratungen
> example: In der Apotheke bekommt man eine gute **Beratung**. — В аптеці можна отримати хорошу консультацію.
> note: від beraten («радити»). Також: Rechtsberatung, Schuldnerberatung.

> [!word] das Schmerzmittel
> ipa: /ˈʃmɛʁtsˌmɪtl̩/ · pos: noun · level: B1 · id: de-a2-situationen-w29
> uk: знеболювальне
> forms: die Schmerzmittel
> example: Ich nehme ein **Schmerzmittel**. — Я приймаю знеболювальне.
> note: Schmerz + Mittel (das Mittel). Множина без змін. sch = [ʃ], z = [ts].

> [!word] die Nebenwirkung
> ipa: /ˈneːbn̩ˌvɪʁkʊŋ/ · pos: noun · level: B1 · id: de-a2-situationen-w30
> uk: побічна дія
> forms: die Nebenwirkungen
> example: Gibt es **Nebenwirkungen**? — Чи є побічні дії?
> note: neben + Wirkung. w = [v]; Neben- читаємо [ˈneːbn̩], друге -e слабке.

> [!word] das Hustenmittel
> ipa: /ˈhuːstn̩ˌmɪtl̩/ · pos: noun · level: B1 · id: de-a2-situationen-w31
> uk: ліки від кашлю
> forms: die Hustenmittel
> example: Ich brauche ein **Hustenmittel**. — Мені потрібні ліки від кашлю.
> note: Husten + Mittel. Така будова слів зручна: Schmerzmittel, Hustenmittel, Waschmittel.

> [!word] eröffnen
> ipa: /ɛɐ̯ˈœfnən/ · pos: verb · level: B1 · id: de-a2-situationen-w32
> uk: відкривати (рахунок, заклад)
> forms: eröffnen → eröffnete → hat eröffnet
> example: Ich möchte ein Konto **eröffnen**. — Я хочу відкрити рахунок.
> note: невідокремлюване (er-). Для рахунку — саме eröffnen, не ~~öffnen~~ (öffnen — відчиняти двері).

> [!word] die Kündigung
> ipa: /ˈkʏndɪɡʊŋ/ · pos: noun · level: B1 · id: de-a2-situationen-w33
> uk: розірвання договору; звільнення
> forms: die Kündigungen
> example: Die **Kündigung** muss schriftlich sein. — Розірвання договору має бути письмовим.
> note: від kündigen. Для оренди, роботи, підписки. ü = [ʏ].

> [!word] die Etage
> ipa: /eˈtaːʒə/ · pos: noun · level: A2 · id: de-a2-situationen-w34
> uk: поверх
> forms: die Etagen
> example: Die Wohnung ist in der dritten **Etage**. — Квартира на третій Etage (за нашим рахунком це четвертий поверх).
> note: Те саме кажуть der Stock (скрізь). Нумерація: Erdgeschoss, 1. Etage (= 2-й поверх за нашим рахунком), 2. Etage. g = [ʒ].

> [!word] die Sprechzeit
> ipa: /ˈʃpʁɛçˌtsaɪ̯t/ · pos: noun · level: A2 · id: de-a2-situationen-w35
> uk: години прийому
> forms: die Sprechzeiten
> example: Die **Sprechzeiten** stehen an der Tür. — Години прийому вказані на дверях.
> note: у відомствах і лікарів. Відрізняється від Öffnungszeiten (години роботи магазину).

> [!word] der Mitarbeiter
> ipa: /ˈmɪtˌʔaʁbaɪ̯tɐ/ · pos: noun · level: A2 · id: de-a2-situationen-w36
> uk: співробітник
> forms: die Mitarbeiter
> example: Ein **Mitarbeiter** hilft Ihnen gleich. — Співробітник зараз Вам допоможе.
> note: Mitarbeiterin — жінка. Ввічливо в установі: der Sachbearbeiter, die Sachbearbeiterin.

> [!word] Wie kann ich Ihnen helfen?
> ipa: /viː kan ɪç ˈiːnən ˈhɛlfn̩/ · pos: phrase · level: A2 · id: de-a2-situationen-w37
> uk: Чим я можу Вам допомогти?
> example: Guten Tag, **wie kann ich Ihnen helfen**? — Добрий день, чим я можу Вам допомогти?
> note: стандартний початок розмови в установі, банку, аптеці.

> [!word] Ich möchte ein Konto eröffnen.
> ipa: /ɪç ˈmœçtə aɪ̯n ˈkɔnto ɛɐ̯ˈœfnən/ · pos: phrase · level: A2 · id: de-a2-situationen-w38
> uk: Я хочу відкрити рахунок.
> example: Guten Tag, **ich möchte ein Konto eröffnen**. — Добрий день, я хочу відкрити рахунок.
> note: фраза для банку. Додаткове: ein Girokonto (поточний), ein Sparkonto (накопичувальний).

## Слухаємо

> [!listen] Що ти почув?
> level: A2 · type: choice · speed: slow · id: de-a2-situationen-l01
> audio: Könnten Sie das bitte wiederholen?
> - [ ] Könnten Sie das bitte buchstabieren?
> - [x] Könnten Sie das bitte wiederholen?
> - [ ] Könnten Sie das bitte erklären?
>
> **Пояснення:** *wiederholen* — повторити, *buchstabieren* — продиктувати по літерах, *erklären* — пояснити. Усі три — корисні прохання, але почули саме *wiederholen*.

> [!listen] Напиши або скажи, що почув
> level: A2 · type: dictation · speed: slow · id: de-a2-situationen-l02
> audio: Ich habe um zehn Uhr einen Termin.

## Ситуація 1: Bürgeramt

> [!listen] Олена в Bürgeramt. Що їй треба зробити далі?
> level: A2 · type: answer · speed: slow · id: de-a2-situationen-l03
> audio: A: Guten Morgen. Wie kann ich Ihnen helfen?
> audio: B: Guten Morgen. Ich habe um zehn Uhr einen Termin. Ich möchte meine neue Wohnung anmelden.
> audio: A: Haben Sie Ihren Ausweis und die Wohnungsgeberbestätigung dabei?
> audio: B: Ja, hier bitte.
> audio: A: Danke. Bitte warten Sie draußen im Flur. Ihre Nummer wird aufgerufen.
> - [x] чекати в коридорі, поки назвуть її номер
> - [ ] піти додому й повернутися завтра
> - [ ] заплатити кредитною карткою
> - [ ] заповнити ще один Antrag
>
> **Пояснення:** службовиця каже: *Warten Sie draußen im Flur. Ihre Nummer wird aufgerufen* — зачекайте за дверима, у коридорі; Ваш номер викличуть. Переклад: — Доброго ранку. Чим можу допомогти? — Доброго ранку. У мене запис на десяту. Хочу зареєструвати нову квартиру. — У Вас є документ і підтвердження від орендодавця? — Так, ось. — Дякую. Будь ласка, зачекайте за дверима, у коридорі. Ваш номер викличуть.

> [!speak] Скажи службовцю: запис
> level: A2 · speed: slow · id: de-a2-situationen-s01
> text: Ich habe um zehn Uhr einen Termin.
> ipa: /ɪç ˈhaːbə ʊm tseːn uːɐ̯ ˈaɪ̯nən tɛʁˈmiːn/
> tip: ich — [ç], тихе «хь»; zehn — z = [ts], довге [eː]; Termin — наголос на останньому складі: тер-МІН.
> uk: У мене запис на десяту.

> [!speak] Скажи службовцю: реєстрація
> level: A2 · speed: slow · id: de-a2-situationen-s02
> text: Ich möchte meine Wohnung anmelden.
> ipa: /ɪç ˈmœçtə ˈmaɪ̯nə ˈvoːnʊŋ ˈanmɛldn̩/
> tip: möchte — ö коротке округлене, ch = [ç]; Wohnung — w = [v], довге [oː]; anmelden — наголос на an-.
> uk: Я хочу зареєструвати своє житло.

> [!listen] Заповни анкету за розмовою
> level: A2 · type: fill · speed: slow · id: de-a2-situationen-l04
> audio: A: Wie ist Ihr Nachname?
> audio: B: Bondar. B-O-N-D-A-R.
> audio: A: Und Ihre neue Adresse?
> audio: B: Lindenstraße vierzehn in Köln.
> audio: A: Wann sind Sie eingezogen?
> audio: B: Am ersten Dezember.
>
> ```fill
> Nachname: [[Bondar]]
> Straße: Lindenstraße [[14|vierzehn]]
> Stadt: [[Köln]]
> Einzug: [[1.12.|1.12|1. Dezember|erster Dezember|ersten Dezember|am ersten Dezember]]
> ```

> [!listen] Перенести запис. Коли новий запис?
> level: A2 · type: answer · speed: slow · id: de-a2-situationen-l05
> audio: A: Bürgeramt Mitte, guten Tag.
> audio: B: Guten Tag. Ich habe morgen um neun Uhr einen Termin, aber ich bin krank. Kann ich den Termin verschieben?
> audio: A: Ja, gern. Wie wäre es mit Donnerstag um elf Uhr?
> audio: B: Ja, das passt. Vielen Dank.
> - [ ] завтра о девʼятій
> - [x] у четвер об одинадцятій
> - [ ] у середу об одинадцятій
> - [ ] у четвер о девʼятій
>
> **Пояснення:** нова дата — *Donnerstag um elf Uhr*. Переклад: — Bürgeramt Mitte, добрий день. — Добрий день. Завтра о девʼятій у мене запис, але я хворію. Чи можна його перенести? — Так, звичайно. Як щодо четверга об одинадцятій? — Так, це підходить. Щиро дякую.

> [!speak] Скажи по телефону: перенеси запис
> level: A2 · speed: slow · id: de-a2-situationen-s03
> text: Kann ich den Termin verschieben?
> ipa: /kan ɪç deːn tɛʁˈmiːn fɛɐ̯ˈʃiːbn̩/
> tip: verschieben — v на початку fer-: [f]; sch = [ʃ]; наголос на -schie-, довге [iː].
> uk: Чи можна перенести запис?

> [!speak] Попроси повторити
> level: A2 · speed: slow · id: de-a2-situationen-s04
> text: Könnten Sie das bitte wiederholen?
> ipa: /ˈkœntn̩ ziː das ˈbɪtə viːdɐˈhoːlən/
> tip: Könnten — ö коротке округлене (не «йо»); wiederholen — наголос на -hol-, w = [v]; ie = довге [iː].
> uk: Чи не могли б Ви це повторити?

## Ситуація 2: огляд квартири

> [!listen] Огляд квартири. Скільки це коштує щомісяця?
> level: A2 · type: answer · speed: slow · id: de-a2-situationen-l06
> audio: A: Die Wohnung hat zwei Zimmer und eine Einbauküche.
> audio: B: Wie hoch ist die Kaltmiete?
> audio: A: Sechshundertfünfzig Euro.
> audio: B: Und die Nebenkosten?
> audio: A: Hundertfünfzig Euro im Monat. Der Vertrag ist unbefristet.
> - [ ] 650 Euro
> - [x] 800 Euro
> - [ ] 150 Euro
> - [ ] 500 Euro
>
> **Пояснення:** Kaltmiete 650 € + Nebenkosten 150 € = 800 € на місяць. Це приблизна *Warmmiete*. *Unbefristet* — безстроковий договір.

> [!speak] Спитай про договір
> level: A2 · speed: slow · id: de-a2-situationen-s05
> text: Ist der Mietvertrag unbefristet?
> ipa: /ɪst deːɐ̯ ˈmiːtfɛɐ̯ˌtʁaːk ˈʊnbəfʁɪstət/
> tip: Miet- — довге [iː]; Vertrag — fer-: v = [f]; g у кінці = [k]; unbefristet — наголос на un-.
> uk: Договір оренди безстроковий?

> [!speak] Спитай про комунальні витрати
> level: A2 · speed: slow · id: de-a2-situationen-s06
> text: Wie hoch sind die Nebenkosten?
> ipa: /viː hoːx zɪnt diː ˈneːbn̩ˌkɔstn̩/
> tip: hoch — o довге, ch після o = [x], глибоке «х»; Nebenkosten — наголос на Ne-, b читається [b], -en слабке.
> uk: Яка сума комунальних витрат?

> [!listen] Чи можна мати тварину?
> level: A2 · type: answer · speed: slow · id: de-a2-situationen-l07
> audio: A: Darf ich ein Haustier haben?
> audio: B: Eine Katze ist kein Problem, aber keinen Hund, bitte.
> audio: A: Und wann ist die Übergabe?
> audio: B: Am ersten Januar.
> - [x] кіт дозволений, пес ні; заселення першого січня
> - [ ] пес дозволений, кіт ні
> - [ ] жодних тварин; заселення першого грудня
> - [ ] усі тварини дозволені
>
> **Пояснення:** *Eine Katze ist kein Problem, aber keinen Hund* — кіт без проблем, пса не можна. *Übergabe am ersten Januar* — передача першого січня. *Keinen* стоїть перед *Hund* (чоловічий рід, Akkusativ).

> [!speak] Спитай про тварину
> level: A2 · speed: slow · id: de-a2-situationen-s07
> text: Darf ich ein Haustier haben?
> ipa: /daʁf ɪç aɪ̯n ˈhaʊ̯stiːɐ̯ ˈhaːbn̩/
> tip: darf — коротке [a], f у кінці; Haustier — au = [aʊ̯], ie довге [iː], r у кінці майже не чути; haben — h видихом, не «г».
> uk: Чи можна мені мати домашню тварину?

> [!speak] Спитай про огляд
> level: A2 · speed: slow · id: de-a2-situationen-s08
> text: Wann kann ich die Wohnung besichtigen?
> ipa: /van kan ɪç diː ˈvoːnʊŋ bəˈzɪçtɪɡn̩/
> tip: wann — w = [v]; besichtigen — s перед i = [z], ch = [ç], наголос на -sich-.
> uk: Коли я можу оглянути квартиру?

## Ситуація 3: аптека

> [!listen] В аптеці. Як приймати таблетки?
> level: A2 · type: answer · speed: slow · id: de-a2-situationen-l08
> audio: A: Guten Tag. Ich habe Kopfschmerzen. Haben Sie etwas dagegen?
> audio: B: Haben Sie Allergien?
> audio: A: Nein.
> audio: B: Dann nehmen Sie diese Tabletten. Sie sind rezeptfrei. Eine Tablette, höchstens dreimal am Tag. Genaue Angaben stehen in der Packungsbeilage.
> audio: A: Danke schön.
> - [x] одну таблетку, не більше трьох разів на день; докладніше в інструкції
> - [ ] три таблетки відразу
> - [ ] лише за рецептом
> - [ ] не читати інструкцію
>
> **Пояснення:** *Eine Tablette, höchstens dreimal am Tag* — одну таблетку, щонайбільше тричі на день. Докладніше — *in der Packungsbeilage*. Фармацевт спершу питає про алергію. Лікарські рекомендації завжди перевіряй за інструкцією та в лікаря чи фармацевта.

> [!speak] Попроси ліки від головного болю
> level: A2 · speed: slow · id: de-a2-situationen-s09
> text: Haben Sie etwas gegen Kopfschmerzen?
> ipa: /ˈhaːbn̩ ziː ˈɛtvas ˈɡeːɡn̩ ˈkɔpfʃmɛʁtsn̩/
> tip: etwas — коротке [ɛ], w = [v]; gegen — ge- з «ґ», g у середині слова; Kopfschmerzen — pf вимовляємо разом, [ʃm] (sch-m), z = [ts].
> uk: Чи є у Вас щось від головного болю?

> [!speak] Спитай про дозування
> level: A2 · speed: slow · id: de-a2-situationen-s10
> text: Wie oft soll ich die Tabletten nehmen?
> ipa: /viː ɔft zɔl ɪç diː taˈblɛtn̩ ˈneːmən/
> tip: oft — коротке [ɔ]; Tabletten — наголос на -blet-, tt = коротке [ɛ] перед подвоєною літерою; nehmen — довге [eː], h не читається.
> uk: Як часто мені приймати таблетки?

## Ситуація 4: банк

> [!listen] У банку. Що потрібно, щоб відкрити рахунок?
> level: A2 · type: answer · speed: slow · id: de-a2-situationen-l09
> audio: A: Guten Tag, ich möchte ein Konto eröffnen.
> audio: B: Gern. Haben Sie Ihren Ausweis und die Meldebescheinigung dabei?
> audio: A: Ja, hier.
> audio: B: Möchten Sie auch eine Karte?
> audio: A: Ja, bitte.
> audio: B: Bitte unterschreiben Sie hier.
> - [x] документ з фото й довідка про реєстрацію; потім підпис
> - [ ] лише гроші готівкою
> - [ ] лише рецепт
> - [ ] лише Wartenummer
>
> **Пояснення:** службовець просить *Ausweis* і *Meldebescheinigung*, пропонує картку й просить підписатися. Вимоги різних банків можуть відрізнятися, тому уточни при записі. Переклад: — Добрий день, я хочу відкрити рахунок. — Звичайно. Ви маєте документ і довідку про реєстрацію? — Так, ось. — Бажаєте також картку? — Так, будь ласка. — Підпишіть тут, будь ласка.

> [!speak] Скажи в банку
> level: A2 · speed: slow · id: de-a2-situationen-s11
> text: Ich möchte ein Konto eröffnen.
> ipa: /ɪç ˈmœçtə aɪ̯n ˈkɔnto ɛɐ̯ˈœfnən/
> tip: Konto — наголос на першому складі, кінцеве o ненаголошене; eröffnen — er- + ö: [ɛɐ̯ˈœfnən], ö коротке округлене.
> uk: Я хочу відкрити рахунок.

> [!speak] Спитай, де підписати
> level: A2 · speed: slow · id: de-a2-situationen-s12
> text: Wo muss ich unterschreiben?
> ipa: /voː mʊs ɪç ʊntɐˈʃʁaɪ̯bn̩/
> tip: wo — w = [v]; muss — коротке [ʊ], ss = [s]; unterschreiben — наголос на -schrei-, sch = [ʃ].
> uk: Де мені підписати?

> [!listen] Напиши або скажи, що почув
> level: A2 · type: dictation · speed: slow · id: de-a2-situationen-l10
> audio: Ich möchte ein Konto eröffnen.

## Типові помилки українців

> [!pitfall] Ich will, gib mir — занадто різко
> ~~Ich will einen Termin~~, ~~Gib mir das Formular~~ → **Ich möchte** einen Termin. / **Ich hätte gern** das Formular. В українській «хочу» і «дайте» звучать нейтрально, а німецьке *wollen* у такій ситуації звучить як вимога. До службовця — на *Sie*, з *bitte*: *Könnten Sie mir bitte das Formular geben?*

> [!pitfall] Termin ≠ термін
> ~~Mein Termin für die Anmeldung endet am Freitag~~ (мається на увазі кінцевий строк) → **die Frist**: *Die Frist endet am Freitag.* ***Der Termin*** — це час, на який ти записаний (до лікаря, у Bürgeramt) або домовлена зустріч: *Ich habe einen Termin um zehn Uhr.*

> [!pitfall] mieten ≠ vermieten
> ~~Ich vermiete eine Wohnung in Köln~~ (хотіла сказати «орендую») → Ich **miete** eine Wohnung. Українське «орендувати» охоплює обидва боки. *Mieten* — брати в оренду (орендар, *der Mieter*), *vermieten* — здавати в оренду (орендодавець, *der Vermieter*).

> [!pitfall] Anmeldung і Abmeldung
> Українське «прописка» не збігається з німецьким. ***Anmeldung*** — реєстрація на новій адресі (*sich anmelden*), яку треба зробити протягом двох тижнів. Окрема ***Abmeldung*** потрібна, зокрема, коли ти виїжджаєш з Німеччини; при переїзді в межах країни достатньо зареєструватися на новому місці. Не плутай із записом на курс: *Anmeldung zum Kurs*.

## Landeskunde: die Anmeldung

> [!example] Anmeldung beim Bürgeramt
> Wer in Deutschland umzieht, muss sich beim Bürgeramt anmelden. Das muss man innerhalb von zwei Wochen nach dem Einzug machen. Man braucht den Ausweis oder Reisepass, ein Anmeldeformular und die Wohnungsgeberbestätigung vom Vermieter. In vielen Städten bekommt man einen Termin im Internet. Beim Termin zieht man eine Wartenummer oder wird aufgerufen. Die Anmeldung ist Pflicht, deshalb sollte man alle Dokumente vorher bereithalten. Die Mitarbeiterin prüft die Unterlagen und stellt eine Meldebescheinigung aus. Die Bescheinigung braucht man später oft, zum Beispiel für ein Bankkonto oder beim Arbeitgeber.

> [!quiz] Nach dem Text: Wie lange hat man Zeit für die Anmeldung?
> level: A2 · type: single · id: de-a2-situationen-q02
> - [ ] einen Monat
> - [x] zwei Wochen
> - [ ] ein Jahr
> - [ ] drei Tage
>
> **Пояснення:** у тексті: *innerhalb von zwei Wochen nach dem Einzug*. Це випливає з § 17 Bundesmeldegesetz.

> [!quiz] Nach dem Text: Was bekommt man am Ende beim Bürgeramt?
> level: A2 · type: single · id: de-a2-situationen-q03
> - [ ] einen Mietvertrag
> - [ ] eine Wohnungsgeberbestätigung
> - [x] eine Meldebescheinigung
> - [ ] ein Rezept
>
> **Пояснення:** *Die Mitarbeiterin … stellt eine Meldebescheinigung aus.* Wohnungsgeberbestätigung дає орендодавець, Mietvertrag підписують з ним, а Rezept — від лікаря.

## Практика

> [!quiz] Що означає «rezeptfrei» в аптеці?
> level: A2 · type: single · id: de-a2-situationen-q04
> - [ ] безкоштовно
> - [x] без рецепта
> - [ ] без побічних дій
> - [ ] без інструкції
>
> **Пояснення:** ***rezeptfrei*** — ліки можна купити без рецепта (*das Rezept*). Це не означає «безкоштовно» (*kostenlos*) чи «безпечно».

> [!quiz] Які фрази ввічливі для звернення до службовця? Обери всі.
> level: A2 · type: multi · id: de-a2-situationen-q05
> - [x] Könnten Sie mir bitte helfen?
> - [x] Ich hätte gern einen Termin.
> - [ ] Ich will einen Termin.
> - [ ] Gib mir das Formular.
>
> **Пояснення:** *Könnten Sie … bitte?* і *Ich hätte gern …* ввічливі. *Ich will* звучить як вимога, а *Gib mir* — це форма на «ти», яка невідповідна для установи.

> [!quiz] Kaltmiete 650 €, Nebenkosten 150 €. Яка приблизна Warmmiete?
> level: A2 · type: single · id: de-a2-situationen-q06
> - [ ] 500 €
> - [ ] 650 €
> - [x] 800 €
> - [ ] 150 €
>
> **Пояснення:** *Warmmiete = Kaltmiete + Nebenkosten*: 650 + 150 = 800 €. Варіант 500 — помилкове віднімання.

> [!quiz] Заповни пропуски
> level: A2 · type: fill · id: de-a2-situationen-q07 · bank: abmelden, beantragen
>
> ```text fill
> Ich möchte meine neue Wohnung [[anmelden]]. (зареєструвати)
> Bitte [[unterschreiben]] Sie hier. (підпишіть)
> Ich habe um zehn Uhr einen [[Termin]]. (запис на прийом)
> ```
>
> **Пояснення:** *anmelden* — зареєструвати, *abmelden* — зняти з реєстрації. *Unterschreiben* — підписати. *Der Termin* — запис; *beantragen* — подати заяву, воно не підходить.

> [!quiz] Заповни питання на огляді квартири
> level: A2 · type: fill · id: de-a2-situationen-q08 · bank: Warmmiete, Kündigung
>
> ```text fill
> Wie hoch ist die [[Kaltmiete]]? (оренда без комуналки)
> Wie hoch sind die [[Nebenkosten]]? (комунальні витрати)
> Ist der Vertrag [[unbefristet]]? (безстроковий)
> ```
>
> **Пояснення:** *Kaltmiete* — оренда без комунальних витрат, *Nebenkosten* — комуналка, *unbefristet* — безстроковий. *Warmmiete* включає обидві частини, а *Kündigung* — це розірвання договору.

> [!quiz] Склади прохання в банку: «Я хочу відкрити рахунок.»
> level: A2 · type: order · id: de-a2-situationen-q09
>
> ```text order
> Ich möchte
> ein Konto
> eröffnen.
> eröffnen ein Konto ✗
> ```
>
> **Пояснення:** модальне *möchte* стоїть на другому місці, а смисловий інфінітив *eröffnen* — у кінці: *Ich möchte ein Konto eröffnen.*

> [!quiz] Склади питання: «Чи можна мені мати домашню тварину?»
> level: A2 · type: order · id: de-a2-situationen-q10
>
> ```text order
> Darf ich
> ein Haustier
> haben?
> Ich darf ✗
> ```
>
> **Пояснення:** питання з модальним дієсловом починається з нього: *Darf ich … haben?* Форма *Ich darf …* була б твердженням.

> [!quiz] Де продають ліки за рецептом?
> level: A2 · type: single · id: de-a2-situationen-q11
> - [x] in der Apotheke
> - [ ] in der Drogerie
> - [ ] beim Bürgeramt
> - [ ] in der Arztpraxis
>
> **Пояснення:** рецептурні ліки видають в *Apotheke*. *Drogerie* продає косметику й товари для догляду, лікар у *Arztpraxis* виписує рецепт, але ліки не видає.

> [!quiz] Ти хворий і мусиш перенести запис. Що сказати?
> level: A2 · type: single · id: de-a2-situationen-q12
> - [ ] Kann ich den Termin wechseln?
> - [x] Kann ich den Termin verschieben?
> - [ ] Ich ändere Ihren Termin.
> - [ ] Ich verschiebe Sie den Termin.
>
> **Пояснення:** перенести запис — ***verschieben***. Форма *wechseln* калька з української «змінити». *Ich ändere Ihren Termin* змінює роль: службовець вирішує, а не ти.

## Фішки

> [!reel] 📅 Два тижні на Anmeldung
> Закон вимагає зареєструватися за новою адресою протягом двох тижнів після заселення (§ 17 Bundesmeldegesetz). Без довідки (*Meldebescheinigung*) важко відкрити рахунок, оформити роботу чи договір на інтернет. Тож Anmeldung — перший крок у новому місті.

> [!reel] 🏠 Kaution: не більше трьох
> Орендодавець не може вимагати заставу більше ніж трьох місячних Kaltmieten (§ 551 BGB). Її вносять на окремий рахунок, а після виїзду повертають, якщо немає претензій. Запитай про Kaution на огляді: це нормальне питання.

> [!reel] 💊 Червона літера A
> Німецькі аптеки позначені червоною літерою *A* на вивісці. Якщо аптека зачинена, на дверях висить оголошення про чергову аптеку поблизу (*Notdienst*). Така система діє, щоб ліки можна було купити й уночі та у вихідні.

## Джерела та що почитати

- [Gesetze im Internet — § 17 Bundesmeldegesetz (BMG)](https://www.gesetze-im-internet.de/bmg/__17.html): обовʼязок Anmeldung протягом двох тижнів.
- [Gesetze im Internet — § 19 BMG](https://www.gesetze-im-internet.de/bmg/__19.html): Wohnungsgeberbestätigung і обовʼязки власника.
- [Gesetze im Internet — § 551 BGB](https://www.gesetze-im-internet.de/bgb/__551.html): розмір Kaution.
- [DWDS — Bürgeramt](https://www.dwds.de/wb/Bürgeramt): значення слова.
- [DWDS — Meldebescheinigung](https://www.dwds.de/wb/Meldebescheinigung): значення слова.
- [Service Berlin — Bürgerservice](https://www.service.berlin.de): запис на прийом у Berlin (приклад онлайн-запису).

> [!important] Підсумок
> - Ввічливо: **Ich möchte …**, **Ich hätte gern …**, **Könnten Sie …?**; перепитати: **Könnten Sie das bitte wiederholen?**
> - **Anmeldung** протягом двох тижнів; потрібні документ з фото, **Wohnungsgeberbestätigung** і запис; результат — **Meldebescheinigung**.
> - Огляд: **Kaltmiete + Nebenkosten = Warmmiete**; питай про **Kaution**, **unbefristet**, **Haustier**, **Übergabe**.
> - Аптека: **rezeptfrei**, **Packungsbeilage**; рецепт — у лікаря.
> - Банк: **ein Konto eröffnen**, **unterschreiben**; уточни, які документи потрібні.
