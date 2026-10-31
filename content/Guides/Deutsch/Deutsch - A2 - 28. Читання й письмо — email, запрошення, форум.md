---
title: Читання й письмо — email, запрошення, форум
id: de-a2-lesen-schreiben
level: A2
icon: px:mail
tags: [deutsch, a2, skills, lesen, schreiben, email, goethe]
prerequisites: ["[[Deutsch - A1 - 29. Читання й письмо — формуляр, оголошення, коротке повідомлення]]", "[[Deutsch - A2 - 11. Підрядні речення з weil, dass, wenn — дієслово в кінці]]"]
estimatedMinutes: 40
---

# Читання й письмо — email, запрошення, форум

> [!success] Після цієї теми ти зможеш
> - прочитати короткий лист, запрошення, допис на форумі й оголошення та знайти головну думку (*gist*) і потрібні подробиці (*detail*);
> - написати неформальний і напівформальний *email*: *Liebe Anna, … Viele Grüße*, *Sehr geehrte Frau Becker, … Mit freundlichen Grüßen*;
> - запросити друзів, прийняти запрошення (*zusagen*) або ввічливо відмовитися (*absagen*);
> - написати короткий допис на форумі й відповісти на *Kleinanzeige*;
> - виконати письмову частину Goethe A2: SMS ≈ 20–30 слів і email ≈ 30–40 слів, обидва за трьома пунктами.

## Передбач

> [!quiz] Ти пишеш другові Томові неформальний email. Як його закінчити?
> level: A2 · type: single · id: de-a2-lesen-schreiben-q01
> - [ ] Mit freundlichen Grüßen
> - [x] Viele Grüße
> - [ ] Hochachtungsvoll
> - [ ] Sehr geehrter Tom
>
> **Пояснення:** другові пишемо **Viele Grüße** (або *Liebe Grüße, Bis bald*). *Mit freundlichen Grüßen* — для офіційних і напівофіційних листів на «Ви», *Hochachtungsvoll* — застарілий дуже офіційний вираз, а *Sehr geehrter Tom* — це початок листа, а не кінець.

## Пояснення

### Читання: головне чи подробиці

Перед читанням подивись на завдання. Від нього залежить, як читати.

| Що питають | Як читати | Приклад |
|---|---|---|
| Про що текст? Хто пише? Навіщо? | **Gist**: заголовок, перше й останнє речення, тема, адресат | «Лист-запрошення» |
| Коли? Де? Скільки? Хто? | **Detail**: шукай ключове слово, число, час, місце | «о 19 годині у Ліндена-штрассе» |
| Правильно / неправильно | Порівнюй речення завдання з текстом слово до слова | «Der Kurs fällt aus.» |

Тексти A2 короткі: SMS, оголошення, лист, допис на форумі. Не потрібно розуміти кожне слово: достатньо знайти відповідь на питання. Нове слово спробуй вгадати з контексту або з частини складного слова (*Kleinanzeige* = *klein* + *Anzeige*).

### Структура листа

> [!diagram] Як побудований email
> ```yaml
> layout: flow
> nodes:
>   - { id: bet, label: "1. Betreff", text: "Einladung zu meiner Party", note: "тема листа, коротко", tone: yellow }
>   - { id: an, label: "2. Anrede", text: "Liebe Anna,", note: "після коми — мала літера", tone: pink }
>   - { id: ein, label: "3. Einleitung", text: "ich hoffe, es geht dir gut.", note: "одне речення, не обовʼязково", tone: gray }
>   - { id: haupt, label: "4. Hauptteil", text: "три пункти завдання", note: "по реченню на кожен пункт", tone: yellow }
>   - { id: ende, label: "5. Schluss + Gruß", text: "Viele Grüße, Olena", note: "побажання, прощання, імʼя", tone: pink }
> edges:
>   - { from: bet, to: an }
>   - { from: an, to: ein }
>   - { from: ein, to: haupt }
>   - { from: haupt, to: ende }
> steps:
>   - { focus: bet, note: "Betreff — рядок теми в електронному листі. В іспиті A2 його часто не потрібно, але в реальному листі він є." }
>   - { focus: an, note: "Anrede: Liebe Anna, / Lieber Tom, / Hallo Anna, / Sehr geehrte Frau Becker, Після коми наступний рядок пишемо з малої літери (якщо це не іменник)." }
>   - { focus: ein, note: "Короткий вступ: Danke für deine Nachricht. Він ввічливий, але не обовʼязковий." }
>   - { focus: haupt, note: "Головна частина: по реченню на кожен з трьох пунктів. Так ти не забудеш жодного." }
>   - { focus: ende, note: "Закінчення: Viele Grüße / Liebe Grüße (друг) або Mit freundlichen Grüßen (Ви). Потім імʼя." }
> ```
> Кольори тільки чергують кроки; назву кожного кроку видно в підписі.

### Звертання й прощання: du чи Sie

| Тип листа | Звертання | Прощання |
|---|---|---|
| Друг, родина | **Liebe Anna,** · **Lieber Tom,** · **Hallo Anna,** | **Viele Grüße** · **Liebe Grüße** · **Bis bald!** |
| Колега, сусід (ввічливо) | **Hallo Frau Becker,** (мейл після особистого знайомства) | **Viele Grüße** · **Freundliche Grüße** |
| Викладач, Behörde, орендодавець | **Sehr geehrte Frau Becker,** · **Sehr geehrter Herr Müller,** | **Mit freundlichen Grüßen** |
| Невідомий адресат | **Sehr geehrte Damen und Herren,** | **Mit freundlichen Grüßen** |

Займенники ввічливого звертання (***Sie, Ihnen, Ihr***) пишемо з великої літери завжди. Займенник «ти» (***du, dir, dein***) у листі зазвичай пишуть з малої, велика також допускається. Головне, щоб у листі було одне звертання: або *du*, або *Sie*.

> [!diagram] Неформальний і напівформальний лист
> ```yaml
> layout: compare
> columns: { inf: "Неформальний (du)", sem: "Напівформальний (Sie)" }
> nodes:
>   - { id: a1, col: inf, label: "Початок", text: "Liebe Anna, / Hallo Tom,", note: "імʼя адресата", tone: gray }
>   - { id: a2, col: sem, label: "Початок", text: "Sehr geehrte Frau Becker,", note: "прізвище, Frau / Herr", tone: gray }
>   - { id: b1, col: inf, label: "Мова", text: "Danke für deine Nachricht!", note: "дозволені розмовні слова", tone: gray }
>   - { id: b2, col: sem, label: "Мова", text: "Vielen Dank für Ihre Nachricht.", note: "ввічливі форми Sie, Ihre", tone: gray }
>   - { id: c1, col: inf, label: "Прохання", text: "Kannst du mir bitte helfen?", note: "проста форма", tone: gray }
>   - { id: c2, col: sem, label: "Прохання", text: "Könnten Sie mir bitte helfen?", note: "ввічливіше, Konjunktiv", tone: gray }
>   - { id: d1, col: inf, label: "Кінець", text: "Viele Grüße", note: "або Liebe Grüße", tone: gray }
>   - { id: d2, col: sem, label: "Кінець", text: "Mit freundlichen Grüßen", note: "імʼя нижче", tone: gray }
> steps:
>   - { focus: [a1, a2], note: "Початок: з другом по імені, з викладачем чи установою — Sehr geehrte / Sehr geehrter + прізвище." }
>   - { focus: [b1, b2], note: "Мова: у неформальному листі du, deine; в напівформальному — Sie, Ihre (з великої)." }
>   - { focus: [c1, c2], note: "Прохання: Kannst du …? з другом, Könnten Sie …? з Ви." }
>   - { focus: [d1, d2], note: "Кінець: Viele Grüße для друзів, Mit freundlichen Grüßen для Ви." }
> ```

### Запрошення й відповідь

| Дія | Німецькою |
|---|---|
| Запросити | Ich lade dich zu meiner Party ein. · Ich möchte dich zu meinem Geburtstag einladen. |
| Дати подробиці | Die Party ist am Samstag um 19 Uhr bei mir. |
| Попросити відповісти | Schreib mir bitte kurz, ob du kommst. |
| Прийняти | Vielen Dank für die Einladung! Ich komme gern. |
| Відмовитися | Danke für die Einladung, aber leider kann ich nicht kommen, weil ich arbeiten muss. |
| Запропонувати інше | Wie wäre es mit nächstem Sonntag? · Ich schlage vor, wir treffen uns am Freitag. |

Причину вводь через ***weil*** (дієслово в кінці) або ***denn*** (звичайний порядок): *…, weil ich arbeiten muss.* / *…, denn ich muss arbeiten.*

### Допис на форумі

Допис на форумі (***der Beitrag***) пишуть коротко: привітання, питання або пропозиція, подяка.

- Початок: *Hallo zusammen,* · *Hallo liebe Community,*
- Питання: *Ich suche …* · *Hat jemand einen Tipp?* · *Kennt jemand …?*
- Власна думка: *Ich finde, dass …* · *Meiner Meinung nach …*
- Подяка: *Vielen Dank im Voraus!* · *Danke für eure Hilfe!*

### Письмо на Goethe A2

Письмова частина Goethe A2 триває **30 хвилин** і складається з двох завдань. Кожне завдання має **три пункти (Leitpunkte)**, і про кожен треба написати:

| Завдання | Адресат | Обсяг | Стиль |
|---|---|---|---|
| **Teil 1: SMS** | друг, знайомий | ≈ 20–30 слів | неформальний (*du*) |
| **Teil 2: E-Mail** | викладач, знайомий, установа | ≈ 30–40 слів | напівформальний (залежить від завдання) |

Порядок дій: прочитай три пункти, познач їх, напиши по реченню на кожен, додай привітання й підпис, перерахуй слова. Перевір, чи правильно *du* чи *Sie*.

**Приклад Teil 1.** Ваш друг Тім запросив вас на вечерю. Напишіть: подякуйте; скажіть, що прийдете пізніше, і чому; спитайте, що принести.

> *Hallo Tim, danke für die Einladung! Ich komme leider erst um acht Uhr, weil ich noch arbeiten muss. Soll ich etwas mitbringen? Bis später, Anna*

Тут 25 слів разом із привітанням і підписом. Три пункти виконано кожен одним реченням.

**Приклад Teil 2.** Ви не можете прийти на курс у середу. Напишіть пані Беккер (викладачці): чому; коли прийдете знову; попросіть надіслати домашнє завдання.

> *Sehr geehrte Frau Becker,*
> *am Mittwoch kann ich leider nicht zum Kurs kommen, weil ich beim Arzt einen Termin habe. Am Freitag bin ich wieder da. Können Sie mir bitte die Hausaufgaben schicken? Vielen Dank!*
> *Mit freundlichen Grüßen*
> *Olena Bondar*

Основний текст тут налічує 31 слово, а разом із привітанням і підписом — 40. Тобто текст вкладається в межі завдання навіть без урахування рамки.

## Приклади

- *Liebe Anna, danke für deine Einladung! Ich komme gern.* — Люба Анно, дякую за запрошення! Я охоче прийду.
- *Leider kann ich am Samstag nicht kommen, denn ich muss arbeiten.* — На жаль, я не можу прийти в суботу, бо мушу працювати.
- *Wie wäre es mit Sonntag? Da habe ich Zeit.* — Як щодо неділі? Тоді в мене є час.
- *Ich schlage vor, wir treffen uns um 18 Uhr am Bahnhof.* — Пропоную зустрітися о 18:00 на вокзалі.
- *Sehr geehrte Frau Becker, ich möchte mich für die Verspätung entschuldigen.* — Шановна пані Беккер, я хочу вибачитися за запізнення.
- *Schreib mir bitte kurz, ob du kommst.* — Напиши мені коротко, чи прийдеш.
- *Hallo zusammen, kennt jemand ein gutes Café in der Nähe vom Bahnhof?* — Привіт усім, хтось знає гарне кафе поблизу вокзалу?
- *Ich finde, dass der Kurs sehr hilfreich ist.* — Я вважаю, що курс дуже корисний.
- *Vielen Dank im Voraus für Ihre Antwort.* — Заздалегідь дякую за Вашу відповідь.
- *Bis bald! Liebe Grüße, Olena* — До скорого! Щирі вітання, Олена

## Слова

### Лист і повідомлення

> [!word] der Absender
> ipa: /ˈapˌzɛndɐ/ · pos: noun · level: A2 · id: de-a2-lesen-schreiben-w01
> uk: відправник
> forms: die Absender
> example: Der **Absender** der E-Mail ist unbekannt. — Відправник листа невідомий.
> note: Absenderin — жінка. Протилежне: der Empfänger. s перед e = [z]; -er = [ɐ].

> [!word] der Empfänger
> ipa: /ɛmˈpfɛŋɐ/ · pos: noun · level: A2 · id: de-a2-lesen-schreiben-w02
> uk: одержувач, адресат
> forms: die Empfänger
> example: Der **Empfänger** bekommt eine Nachricht. — Одержувач отримує повідомлення.
> note: Empfängerin — жінка. Від empfangen («отримувати»). Початок «ем-пф»: pf читаємо разом.

> [!word] der Betreff
> ipa: /bəˈtʁɛf/ · pos: noun · level: A2 · id: de-a2-lesen-schreiben-w03
> uk: тема листа
> forms: die Betreffe
> example: Im **Betreff** steht „Einladung“. — У темі листа стоїть «Запрошення».
> note: множина вживається рідко. f у кінці = [f]. У листах у рядку «Betreff:» пишуть тему.

> [!word] die Anrede
> ipa: /ˈanʁeːdə/ · pos: noun · level: A2 · id: de-a2-lesen-schreiben-w04
> uk: звертання (у листі)
> forms: die Anreden
> example: Die **Anrede** im Brief ist „Sehr geehrte Frau Becker“. — Звертання в листі: «Sehr geehrte Frau Becker».
> note: Anrede + Komma, далі мала літера. Також Anrede = «Herr / Frau» у формулярі.

> [!word] die Grußformel
> ipa: /ˈɡʁuːsˌfɔʁml̩/ · pos: noun · level: B1 · id: de-a2-lesen-schreiben-w05
> uk: формула прощання
> forms: die Grußformeln
> example: Die **Grußformel** am Ende ist „Mit freundlichen Grüßen“. — Формула прощання в кінці: «Mit freundlichen Grüßen».
> note: Gruß + Formel. ß після довгого [uː] = [s]. -formel: [ml̩] склад без голосного.

> [!word] der Anhang
> ipa: /ˈanhaŋ/ · pos: noun · level: A2 · id: de-a2-lesen-schreiben-w06
> uk: вкладення; додаток
> forms: die Anhänge
> example: Im **Anhang** finden Sie meinen Lebenslauf. — У вкладенні Ви знайдете моє резюме.
> note: im Anhang — «у вкладенні». Множина з умлаутом. -ng = [ŋ], без «г».

> [!word] der Beitrag
> ipa: /ˈbaɪ̯tʁaːk/ · pos: noun · level: A2 · id: de-a2-lesen-schreiben-w07
> uk: допис (на форумі); внесок; членський внесок
> forms: die Beiträge
> example: Ich schreibe einen **Beitrag** im Forum. — Я пишу допис на форумі.
> note: різні значення залежно від контексту: Forumsbeitrag, Mitgliedsbeitrag. g на кінці = [k].

> [!word] die SMS
> ipa: /ɛsɛmˈɛs/ · pos: noun · level: A2 · id: de-a2-lesen-schreiben-w08
> uk: SMS, коротке повідомлення
> forms: die SMS
> example: Ich schicke dir eine **SMS**. — Я надішлю тобі SMS.
> note: читаємо за літерами: «ес-ем-ес». Множина не змінюється: zwei SMS. Сьогодні частіше кажуть Nachricht (у WhatsApp).

> [!word] die Antwort
> ipa: /ˈantvɔʁt/ · pos: noun · level: A2 · id: de-a2-lesen-schreiben-w09
> uk: відповідь
> forms: die Antworten
> example: Vielen Dank für Ihre **Antwort**. — Щиро дякую за Вашу відповідь.
> note: від antworten. Часто: Antwort auf eine Frage. w = [v]: «антворт».

> [!word] die Rückmeldung
> ipa: /ˈʁʏkˌmɛldʊŋ/ · pos: noun · level: B1 · id: de-a2-lesen-schreiben-w10
> uk: зворотний звʼязок; відповідь
> forms: die Rückmeldungen
> example: Ich warte auf Ihre **Rückmeldung**. — Я чекаю на Вашу відповідь.
> note: від sich zurückmelden. ü = [ʏ]. -ung → die. У листах: Über eine Rückmeldung würde ich mich freuen.

### Запрошення й пропозиції

> [!word] zusagen
> ipa: /ˈtsuːˌzaːɡn̩/ · pos: verb · level: A2 · id: de-a2-lesen-schreiben-w11
> uk: прийняти запрошення; погодитися
> forms: zusagen → sagte zu → hat zugesagt
> example: Ich **sage** gern **zu**. — Я охоче приймаю запрошення.
> note: відокремлюване. Протилежне — absagen. Іменник: die Zusage.

> [!word] die Absage
> ipa: /ˈapˌzaːɡə/ · pos: noun · level: A2 · id: de-a2-lesen-schreiben-w12
> uk: відмова
> forms: die Absagen
> example: Ich schicke dir leider eine **Absage**. — На жаль, я надсилаю тобі відмову.
> note: від absagen. Протилежне — die Zusage. Також відмова на заявку чи вакансію.

> [!word] der Vorschlag
> ipa: /ˈfoːɐ̯ʃlaːk/ · pos: noun · level: A2 · id: de-a2-lesen-schreiben-w13
> uk: пропозиція
> forms: die Vorschläge
> example: Ich habe einen **Vorschlag**: Wir treffen uns um sechs. — Маю пропозицію: зустрінемося о шостій.
> note: множина з умлаутом. v на початку = [f]. Не плутай з das Angebot.

> [!word] die Entschuldigung
> ipa: /ɛntˈʃʊldɪɡʊŋ/ · pos: noun · level: A2 · id: de-a2-lesen-schreiben-w14
> uk: вибачення; пояснювальна записка
> forms: die Entschuldigungen
> example: Ich bitte um **Entschuldigung** für die Verspätung. — Прошу вибачення за запізнення.
> note: Entschuldigung! — також «перепрошую» для привернення уваги. -ung → die.

> [!word] der Tipp
> ipa: /tɪp/ · pos: noun · level: A2 · id: de-a2-lesen-schreiben-w15
> uk: порада; підказка
> forms: die Tipps
> example: Hat jemand einen **Tipp**? — Чи має хтось пораду?
> note: Duden: Tipp / Tip (заст.). Множина Tipps. Також «ставка» в грі.

### Оголошення

> [!word] die Anzeige
> ipa: /ˈantsaɪ̯ɡə/ · pos: noun · level: A2 · id: de-a2-lesen-schreiben-w16
> uk: оголошення; (також) заява в поліцію
> forms: die Anzeigen
> example: Ich habe Ihre **Anzeige** im Internet gelesen. — Я прочитала Ваше оголошення в інтернеті.
> note: Anzeige erstatten — подати заяву в поліцію. Також шкала на приладі. z = [ts].

> [!word] die Kleinanzeige
> ipa: /ˈklaɪ̯nʔanˌtsaɪ̯ɡə/ · pos: noun · level: A2 · id: de-a2-lesen-schreiben-w17
> uk: коротке приватне оголошення
> forms: die Kleinanzeigen
> example: Ich suche ein Fahrrad in den **Kleinanzeigen**. — Я шукаю велосипед у приватних оголошеннях.
> note: у Німеччині велика платформа Kleinanzeigen; друкований варіант — в газетах. Складне слово: рід від Anzeige.

> [!word] gebraucht
> ipa: /ɡəˈbʁaʊ̯xt/ · pos: adj · level: A2 · id: de-a2-lesen-schreiben-w18
> uk: вживаний, секонд-хенд
> example: Ich kaufe das Fahrrad **gebraucht**. — Я купую велосипед вживаним.
> note: протилежне: neu, neuwertig. Від gebrauchen. ch після au = [x].

> [!word] der Zustand
> ipa: /ˈtsuːʃtant/ · pos: noun · level: A2 · id: de-a2-lesen-schreiben-w19
> uk: стан
> forms: die Zustände
> example: Das Fahrrad ist in gutem **Zustand**. — Велосипед у доброму стані.
> note: складне слово Zu + Stand: st на початку другої частини читаємо [ʃt], d на кінці = [t].

### Готові формули

> [!word] Viele Grüße!
> ipa: /ˈfiːlə ˈɡʁyːsə/ · pos: phrase · level: A2 · id: de-a2-lesen-schreiben-w20
> uk: З вітанням! (кінець листа)
> example: **Viele Grüße**, Olena — З вітанням, Олена
> note: нейтрально-дружня формула. Також Liebe Grüße (ближче), Herzliche Grüße (тепло), Beste Grüße (нейтрально).

> [!word] Mit freundlichen Grüßen
> ipa: /mɪt ˈfʁɔʏ̯ntlɪçn̩ ˈɡʁyːsn̩/ · pos: phrase · level: A2 · id: de-a2-lesen-schreiben-w21
> uk: З повагою (кінець офіційного листа)
> example: **Mit freundlichen Grüßen** Olena Bondar — З повагою, Олена Бондар
> note: скорочення MfG багато хто вважає занадто сухим, тому в листах краще писати повністю. Після формули коми зазвичай нема.

## Слухаємо

> [!listen] Напиши або скажи, що почув
> level: A2 · type: dictation · speed: slow · id: de-a2-lesen-schreiben-l01
> audio: Vielen Dank für die Einladung, ich komme gern.

> [!listen] Голосове повідомлення. Що хоче Йонас?
> level: A2 · type: answer · speed: slow · id: de-a2-lesen-schreiben-l02
> audio: Hallo Mia, hier ist Jonas. Ich habe am Freitag Geburtstag und mache eine kleine Party. Sie beginnt um sieben bei mir zu Hause. Kommst du? Schreib mir bitte kurz zurück.
> - [x] запросити Мію на вечірку й отримати коротку відповідь
> - [ ] скасувати вечірку
> - [ ] запитати, де живе Мія
> - [ ] попросити гроші
>
> **Пояснення:** Йонас запрошує (*Kommst du?*) і просить написати відповідь (*Schreib mir bitte kurz zurück*). Вечірка — у пʼятницю о сьомій.

> [!listen] Заповни запрошення
> level: A2 · type: fill · speed: slow · id: de-a2-lesen-schreiben-l03
> audio: A: Wann ist die Party?
> audio: B: Am Freitag um neunzehn Uhr.
> audio: A: Und wo?
> audio: B: Bei mir, in der Lindenstraße vierzehn.
>
> ```fill
> Tag: [[Freitag]]
> Uhrzeit: [[19|neunzehn]] Uhr
> Adresse: Lindenstraße [[14|vierzehn]]
> ```

## Вимова

Формули листів — це набір готових фраз, які варто вимовляти цілком і без пауз. Зверни увагу на ***ß*** після довгого голосного (*Grüße*) і на ***ch*** після ***ü*** і ***i*** (*freundlichen*, *ich*).

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-lesen-schreiben-s01
> text: Vielen Dank für die Einladung!
> ipa: /ˈfiːlən daŋk fyːɐ̯ diː ˈaɪ̯nlaːdʊŋ/
> tip: v у viel = [f], довге [iː]; für — ü довге, губи округлені; Einladung — ei = «ай», -ung — [ʊŋ] без «г».
> uk: Щиро дякую за запрошення!

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-lesen-schreiben-s02
> text: Ich habe eine Frage zu Ihrer Anzeige.
> ipa: /ɪç ˈhaːbə ˈaɪ̯nə ˈfʁaːɡə tsuː ˈiːʁɐ ˈantsaɪ̯ɡə/
> tip: habe — h видихом, не «г»; Frage — fr-, довге [aː], g як «ґ»; Anzeige — z = [ts], наголос на An-.
> uk: Маю запитання щодо Вашого оголошення.

## Типові помилки українців

> [!pitfall] Du і Sie в одному листі
> ~~Sehr geehrte Frau Becker, ich wollte dir schreiben…~~ → Sehr geehrte Frau Becker, ich wollte **Ihnen** schreiben… Якщо лист починається з *Sehr geehrte*, весь лист пишемо на *Sie*. Однаково погано: ~~Hallo Frau Becker, mit freundlichen Grüßen~~ (початок надто невимушений, кінець надто офіційний). Підбери один рівень на весь лист.

> [!pitfall] Велика літера після коми в звертанні
> ~~Liebe Anna, Ich hoffe…~~ → Liebe Anna, **ich** hoffe… Після коми в *Anrede* продовжуємо з малої літери (якщо це не іменник). Велику літеру ставимо лише після знака оклику: *Liebe Anna! Ich hoffe…* В українській ми зазвичай пишемо «Привіт, Анно!» з великої літери, а німецька норма інша.

> [!pitfall] Пропущений пункт завдання
> У письмовій частині Goethe A2 кожне з трьох *Leitpunkte* треба виконати. Якщо ти написав чудовий вступ, але забув про прохання (наприклад, надіслати домашнє завдання), оцінка падає. Читай три пункти й познач їх до того, як писати, а після написання пройдися по них ще раз.

> [!pitfall] interessiert ≠ «цікавий»
> ~~Ich interessiere das Fahrrad~~, ~~Ich bin interessiert auf das Fahrrad~~ → Ich interessiere **mich für** das Fahrrad. / Ich bin **an** dem Fahrrad **interessiert**. Українське «цікавитися чимось» німецькою — зворотне дієслово *sich interessieren für* + Akkusativ. З прикметником: *interessiert sein an* + Dativ. Сам *interessieren* означає «цікавити» (*Das Fahrrad interessiert mich*).

## Ситуація: відповідь на Kleinanzeige

> [!listen] Олена телефонує за оголошенням. Що вона хоче дізнатися?
> level: A2 · type: answer · speed: slow · id: de-a2-lesen-schreiben-l04
> audio: A: Guten Tag, hier ist Olena Bondar. Ich habe Ihre Anzeige gelesen. Ist das Fahrrad noch da?
> audio: B: Ja, es ist noch da.
> audio: A: In welchem Zustand ist es? Ist es gebraucht?
> audio: B: Ja, es ist gebraucht, aber in sehr gutem Zustand.
> audio: A: Kann ich es morgen um 17 Uhr ansehen?
> audio: B: Ja, gern. Ich schicke Ihnen die Adresse.
> - [x] чи ще є велосипед, у якому він стані й коли можна його подивитися
> - [ ] скільки коштує доставка
> - [ ] чи можна поїздити на велосипеді в парку
> - [ ] чи продавець працює вихідними
>
> **Пояснення:** Олена питає *Ist das Fahrrad noch da? In welchem Zustand ist es? Kann ich es morgen um 17 Uhr ansehen?* Переклад: — Добрий день, це Олена Бондар. Я прочитала Ваше оголошення. Велосипед ще є? — Так, ще є. — У якому він стані? Вживаний? — Так, вживаний, але в дуже доброму стані. — Чи можу я завтра о 17:00 його подивитися? — Так, залюбки. Я надішлю Вам адресу.

> [!speak] Ситуація: напиши продавцю
> level: A2 · speed: slow · id: de-a2-lesen-schreiben-s03
> text: Ist das Fahrrad noch da?
> ipa: /ɪst das ˈfaːɐ̯ʁaːt nɔx daː/
> tip: Fahrrad — перше [aː] довге, h не вимовляємо; d в кінці = [t]; noch — ch після o = [x], глибоко.
> uk: Велосипед ще є?

## Landeskunde: Kleinanzeigen

> [!example] Kleinanzeigen im Alltag
> Viele Menschen in Deutschland kaufen und verkaufen gebrauchte Sachen privat, zum Beispiel Möbel, Fahrräder oder Kleidung. Das geht im Internet auf Plattformen wie Kleinanzeigen. Die Anzeigen sind kurz und haben oft Abkürzungen: VB heißt Verhandlungsbasis, das bedeutet: Man kann über den Preis sprechen. „Zi.“ ist Zimmer, „NK“ sind Nebenkosten. „Nur Abholung“ heißt: Die Ware wird nicht geschickt. Bei einem Privatverkauf gibt es meistens keine Garantie. Wenn man Interesse hat, schreibt man eine kurze Nachricht und fragt zum Beispiel nach dem Zustand und einem Termin.

> [!quiz] Nach dem Text: Was bedeutet „VB“?
> level: A2 · type: single · id: de-a2-lesen-schreiben-q02
> - [ ] Vorsicht, Besichtigung
> - [x] Verhandlungsbasis, über den Preis kann man sprechen
> - [ ] verkauft, bezahlt
> - [ ] Versand bis Berlin
>
> **Пояснення:** у тексті: *VB heißt Verhandlungsbasis, das bedeutet: Man kann über den Preis sprechen.* Тобто ціна не остаточна.

> [!quiz] Nach dem Text: Was bedeutet „Nur Abholung“?
> level: A2 · type: single · id: de-a2-lesen-schreiben-q03
> - [ ] Die Ware kommt mit der Post.
> - [x] Man muss die Ware selbst abholen.
> - [ ] Man bezahlt nur mit Karte.
> - [ ] Die Ware ist kostenlos.
>
> **Пояснення:** *Nur Abholung* — товар не відправляють поштою, покупець забирає сам. У тексті: *Die Ware wird nicht geschickt.*

> [!example] Zwei Anzeigen
> **Anzeige 1:** Verkaufe Fahrrad, 26 Zoll, guter Zustand, 80 € VB. Nur Abholung in Dortmund. Privatverkauf, keine Garantie. Tel. ab 17 Uhr.
> **Anzeige 2:** 2-Zi.-Wohnung, 55 m², Kaltmiete 520 € + NK 130 €, ab 1.12., Nichtraucher.

> [!quiz] Nach Anzeige 1: Was ist richtig?
> level: A2 · type: single · id: de-a2-lesen-schreiben-q04
> - [ ] Das Fahrrad ist neu.
> - [ ] Man kann es per Post bestellen.
> - [x] Der Preis ist 80 Euro und man kann darüber sprechen.
> - [ ] Man ruft vor 17 Uhr an.
>
> **Пояснення:** *80 € VB* — ціна 80 євро з можливістю торгу. *Guter Zustand* ≠ нове. *Nur Abholung* — без пошти. *Tel. ab 17 Uhr* — телефонувати після 17:00.

> [!quiz] Nach Anzeige 2: Wie hoch ist die Warmmiete ungefähr?
> level: A2 · type: single · id: de-a2-lesen-schreiben-q05
> - [ ] 520 Euro
> - [x] 650 Euro (520 + 130)
> - [ ] 130 Euro
> - [ ] 55 Euro
>
> **Пояснення:** Kaltmiete 520 € + NK (Nebenkosten) 130 € = 650 €. Саме ця сума потрапляє на рахунок щомісяця.

## Практика

> [!quiz] Заповни початок і кінець листа до пані Беккер
> level: A2 · type: fill · id: de-a2-lesen-schreiben-q06 · bank: Hallo, Viele, Liebe
>
> ```text fill
> [[Sehr]] geehrte Frau Becker,
> Mit [[freundlichen]] Grüßen
> ```
>
> **Пояснення:** листа викладачці пишуть напівформально: *Sehr geehrte Frau Becker, …, Mit freundlichen Grüßen*. *Hallo, Viele* і *Liebe* — для друзів.

> [!quiz] Склади речення: «На жаль, я не можу прийти, бо мушу працювати.»
> level: A2 · type: order · id: de-a2-lesen-schreiben-q07
>
> ```text order
> Leider kann ich nicht kommen,
> weil
> ich
> arbeiten muss.
> muss arbeiten ✗
> ```
>
> **Пояснення:** після *weil* дієслово йде в кінець: *weil ich arbeiten **muss***. Інфінітив *arbeiten* стоїть перед модальним *muss*.

> [!quiz] Склади речення: «Дякую за запрошення!»
> level: A2 · type: order · id: de-a2-lesen-schreiben-q08
>
> ```text order
> Vielen Dank
> für
> die Einladung!
> zu ✗
> ```
>
> **Пояснення:** *danken* / *Dank* — з прийменником ***für***: *Dank für die Einladung*. Форма ~~Danke zu die Einladung~~ — помилка.

> [!quiz] Ти пишеш пані Беккер про відсутність. Яка форма звертання правильна?
> level: A2 · type: single · id: de-a2-lesen-schreiben-q09
> - [ ] Hallo Becker,
> - [ ] Liebe Frau Becker, ich schreibe dir…
> - [x] Sehr geehrte Frau Becker,
> - [ ] Hey Frau Becker!
>
> **Пояснення:** викладачка — це ввічлива ситуація, тож *Sehr geehrte Frau Becker,*. Варіанти з *dir* і *Hey* змішують регістри.

> [!quiz] Яка відповідь на запрошення є ввічливою відмовою?
> level: A2 · type: single · id: de-a2-lesen-schreiben-q10
> - [ ] Ich komme nicht.
> - [x] Danke für die Einladung, aber leider kann ich nicht kommen.
> - [ ] Ich sage gern ab, weil ich keine Lust habe.
> - [ ] Ich sage zu, aber ich komme nicht.
>
> **Пояснення:** ввічлива відмова: подякуй, вибачся (*leider*) і назви причину. *Ich komme nicht* надто різко, *zusagen* означає «прийняти».

> [!quiz] Які пункти ти маєш виконати у кожному завданні письма Goethe A2? Обери всі.
> level: A2 · type: multi · id: de-a2-lesen-schreiben-q11
> - [x] кожен із трьох Leitpunkte
> - [x] правильний стиль (du або Sie)
> - [x] привітання й прощання
> - [ ] лише перший пункт
> - [ ] будь-яка кількість слів
>
> **Пояснення:** на A2 перевіряють, чи виконано всі три пункти, чи відповідає стиль завданню та чи є привітання й підпис. Обсяг має бути приблизно як у завданні.

> [!quiz] Заповни пропуски
> level: A2 · type: fill · id: de-a2-lesen-schreiben-q12 · bank: mir, für
>
> ```text fill
> Ich interessiere [[mich]] für das Fahrrad.
> Ich bin [[an]] dem Fahrrad interessiert.
> ```
>
> **Пояснення:** *sich interessieren für* + Akkusativ: *ich interessiere **mich** für*; з прикметником — *interessiert **an*** + Dativ. *Mir* (Dativ) і *für* у цих реченнях не підходять.

> [!quiz] «Заздалегідь дякую за Вашу відповідь.» Яка форма правильна?
> level: A2 · type: single · id: de-a2-lesen-schreiben-q13
> - [ ] Vielen Dank im Voraus für deine Antwort.
> - [x] Vielen Dank im Voraus für Ihre Antwort.
> - [ ] Vielen Dank im Voraus für ihre Antwort.
> - [ ] Vielen Dank im Voraus Ihre Antwort.
>
> **Пояснення:** до людини на «Ви» — ***Ihre*** з великої літери. *Ihre* з малої означає «її / їхня», а без *für* звʼязок розривається.

> [!quiz] Яка частина листа зазвичай стоїть одразу після Anrede?
> level: A2 · type: single · id: de-a2-lesen-schreiben-q14
> - [ ] Grußformel
> - [x] Einleitung або перший пункт завдання
> - [ ] підпис
> - [ ] Betreff
>
> **Пояснення:** порядок: Betreff → Anrede → вступ / основна частина → Schlusssatz → Grußformel → підпис.

## Фішки

> [!reel] ✉️ Чому «MfG» не любять
> Скорочення *MfG* (Mit freundlichen Grüßen) у листах багато хто вважає занадто сухим і недбалим. Тому в робочих і офіційних листах краще писати формулу повністю. Для друзів краще підходять теплі *Liebe Grüße* або *Viele Grüße*.

> [!reel] 📱 SMS, якого вже ніхто не пише
> У письмовій частині Goethe A2 перше завдання досі називається «SMS», хоча в житті ми пишемо у месенджерах. Правила ті самі: 3 пункти, ≈ 20–30 слів, привітання, прощання. Тож тренуйся писати коротко: це корисно й для повсякденних повідомлень.

> [!reel] 🏷️ VB: торг у пʼяти літерах
> Скорочення *VB* у Kleinanzeigen розшифровується як *Verhandlungsbasis*: ціна не остаточна, і продавець готовий поторгуватися. Є й *FP* (*Festpreis*): ціна фіксована. Знання цих двох скорочень рятує від зайвих сварок із продавцем.

## Джерела та що почитати

- [Goethe-Institut — Durchführungsbestimmungen A2 (PDF)](https://www.goethe.de/pro/relaunch/prf/de/Durchfuehrungsbestimmungen_A2.pdf): офіційний опис формату іспиту: письмова частина, тривалість, завдання.
- [Goethe-Institut — Modellsatz Goethe-Zertifikat A2 (PDF)](https://www.goethe.de/pro/relaunch/prf/materialien/A2/A2_Modellsatz_Erwachsene.pdf): зразок завдань з письма.
- [DWDS — Kleinanzeige](https://www.dwds.de/wb/Kleinanzeige): значення слова.
- [DWDS — Verhandlungsbasis](https://www.dwds.de/wb/Verhandlungsbasis): розшифровка VB.
- [DW — Nicos Weg (українською)](https://learngerman.dw.com/uk/nicos-weg/c-36519789): відеокурс з діалогами і листами.

> [!important] Підсумок
> - Лист: **Anrede** (з комою, далі мала літера) → основна частина → **Grußformel** → підпис; друг — *Liebe Anna, … Viele Grüße*, викладач / установа — *Sehr geehrte Frau Becker, … Mit freundlichen Grüßen*.
> - Не змішуй **du** і **Sie**; **Sie / Ihnen / Ihr** — завжди з великої.
> - Запрошення: *einladen*, відповідь *zusagen* / *absagen*; причина — *weil* (дієслово в кінці) або *denn*.
> - Goethe A2 Schreiben: **30 хв**, SMS ≈ **20–30** слів, email ≈ **30–40** слів, по **три пункти**, кожен виконати.
> - Kleinanzeigen: **VB** — торг, **NK** — Nebenkosten, **Zi.** — Zimmer, **Nur Abholung** — тільки самовивіз.
