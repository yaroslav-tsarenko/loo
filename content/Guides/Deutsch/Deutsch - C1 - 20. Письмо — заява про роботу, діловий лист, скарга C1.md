---
title: Письмо — заява про роботу, діловий лист, скарга C1
id: de-c1-korrespondenz
level: C1
icon: px:mail
tags: [deutsch, c1, skills, schreiben, bewerbung, anschreiben, mahnung, beschwerde, din-5008]
prerequisites: ["[[Deutsch - B2 - 15. Робота — наради, переговори, ділове листування]]", "[[Deutsch - C1 - 18. Регістр — du і Sie, Amtsdeutsch, розмовна й молодіжна мова]]"]
estimatedMinutes: 50
---

# Письмо — заява про роботу, діловий лист, скарга C1

> [!success] Після цієї теми ти зможеш
> - написати **Anschreiben** до заяви про роботу, яке не переказує резюме, а показує, чому саме ти підходиш на посаду;
> - оформити діловий лист за **DIN 5008**: Briefkopf, Anschrift, Bezugszeile, Betreff, Anrede, Grußformel, Anlagen;
> - написати **Zahlungserinnerung** і **Mahnung**, ввічливо **відмовити** кандидатові чи пропозиції;
> - скласти скаргу рівня C1: факти → правова підстава → вимога з **Nachfrist** → наслідок, без погроз і емоцій;
> - виконати Teil 2 Goethe C1 Schreiben: (напів)формальна e-mail ≈ 120 слів з чотирма мовними функціями.

## Передбач

> [!quiz] Яке перше речення Anschreiben звучить найсильніше на рівні C1?
> level: C1 · type: single · id: de-c1-korrespondenz-q01
> - [ ] Hiermit bewerbe ich mich um die Stelle als Projektmanagerin.
> - [x] Seit vier Jahren steuere ich internationale IT-Projekte – genau diese Erfahrung möchte ich als Projektmanagerin in Ihr Team einbringen.
> - [ ] Mein Name ist Iryna Bondar, ich bin 31 Jahre alt und komme aus der Ukraine.
> - [ ] Ich habe Ihre Anzeige gelesen und sie hat mir gut gefallen.
>
> **Пояснення:** сильний початок одразу показує **користь для фірми**: досвід + посада. *Hiermit bewerbe ich mich* граматично правильне, але це штамп, з якого починається більшість листів. Імʼя й вік уже є в резюме, а «оголошення мені сподобалося» нічого не каже про тебе.

## Пояснення

### Діловий лист за DIN 5008

**DIN 5008** — німецька норма оформлення ділових текстів (чинна редакція — березень 2020). Вона визначає порядок елементів листа й e-mail. Більшість фірм і установ у Німеччині пишуть саме так, тож лист, оформлений «по-німецьки», виглядає професійно ще до того, як його прочитали.

| Елемент | Приклад | На що зважати |
|---|---|---|
| **Briefkopf** / адреса відправника | *Iryna Bondar · Lindenstraße 12 · 50674 Köln* | телефон і e-mail — тут або в Infoblock |
| **Anschrift** (адреса отримувача) | *Muster GmbH / Frau Dr. Anna Weber / Hauptstraße 5 / 10115 Berlin* | імʼя людини — після назви фірми |
| **Bezugszeile** / дата | *Köln, 8. November 2026* або *2026-11-08* | дата праворуч або в Infoblock |
| **Betreff** | ***Bewerbung als Projektmanagerin – Ihre Anzeige vom 2. November*** | без слова «Betreff», жирним, без крапки |
| **Anrede** | *Sehr geehrte Frau Dr. Weber,* | кома, далі текст **з малої** літери |
| текст | *seit vier Jahren …* | абзаци через порожній рядок |
| **Grußformel** | *Mit freundlichen Grüßen* | **без коми**, потім підпис і імʼя |
| **Anlagen** | *Anlagen: Lebenslauf, Zeugnisse* | перелік долучених документів |

> [!diagram] Ділові листи C1: однаковий каркас, різна мета
> ```yaml
> layout: compare
> columns: { a: "Anschreiben", b: "Mahnung", c: "Beschwerde" }
> nodes:
>   - { id: a1, col: a, label: "1 · Einstieg", text: "Erfahrung + Stelle", note: "без Hiermit bewerbe ich mich", tone: yellow }
>   - { id: a2, col: a, label: "2 · Belege", text: "2–3 Erfolge passend zum Anforderungsprofil", note: "не переказ резюме", tone: pink }
>   - { id: a3, col: a, label: "3 · Abschluss", text: "Eintrittstermin, Gehalt, Gesprächswunsch", note: "впевнено, без Konjunktiv-ланцюгів", tone: gray }
>   - { id: b1, col: b, label: "1 · Bezug", text: "Rechnung Nr. … vom …", note: "факти", tone: yellow }
>   - { id: b2, col: b, label: "2 · Stand", text: "Betrag ist noch offen", note: "без звинувачень", tone: pink }
>   - { id: b3, col: b, label: "3 · Frist", text: "bis zum … + Konsequenz", note: "ввічливо, але чітко", tone: gray }
>   - { id: c1, col: c, label: "1 · Sachverhalt", text: "Was, wann, wo", note: "дати, номери", tone: yellow }
>   - { id: c2, col: c, label: "2 · Forderung", text: "Nacherfüllung / Erstattung", note: "з правовою основою", tone: pink }
>   - { id: c3, col: c, label: "3 · Nachfrist", text: "bis zum … sonst Rücktritt", note: "наслідок, не погроза", tone: gray }
> steps:
>   - { focus: [a1, a2, a3], note: "Anschreiben: почни з того, що ти даєш фірмі; доведи двома-трьома прикладами; закінчи практичними даними (з якої дати, яка зарплата) і бажанням поговорити." }
>   - { focus: [b1, b2, b3], note: "Mahnung: номер і дата рахунку, сума, новий строк. Перше нагадування — Zahlungserinnerung, мʼяке: можливо, рахунок загубився." }
>   - { focus: [c1, c2, c3], note: "Скарга C1: спершу факти, потім чітка вимога й додатковий строк (Nachfrist). Наслідок (Rücktritt vom Vertrag) — як інформація, а не погроза." }
> ```
> Колонки — типи листів; номер у кожному блоці показує порядок частин.

### Anschreiben: що відрізняє C1 від B2

На B2 достатньо структури «хто я — чому пишу — що вмію». На C1 важать **точність і доказовість**:

| Крок | Звороти C1 | Замість (B2 / штамп) |
|---|---|---|
| вступ | *Mit großem Interesse habe ich Ihre Ausschreibung gelesen, da …* · *Seit … verantworte ich …* | *Hiermit bewerbe ich mich …* |
| відповідність | *Ihr Anforderungsprofil deckt sich in weiten Teilen mit meinem Werdegang.* | *Ich passe gut zu Ihnen.* |
| докази | *In meiner jetzigen Position habe ich … eingeführt, wodurch … um 20 % gesunken sind.* | *Ich bin teamfähig und belastbar.* |
| мотивація | *Besonders reizt mich an Ihrem Unternehmen, dass …* | *Ihre Firma ist sehr gut.* |
| практичне | *Mein frühestmöglicher Eintrittstermin ist der 1. März; meine Gehaltsvorstellung liegt bei … € brutto im Jahr.* | — |
| завершення | *Über die Gelegenheit, Sie in einem persönlichen Gespräch zu überzeugen, freue ich mich.* | *Ich würde mich sehr freuen, wenn Sie mich vielleicht einladen würden.* |

> [!tip] «Teamfähig» — не доказ
> *Teamfähigkeit, Belastbarkeit, Eigeninitiative* є в кожному оголошенні, і кожен кандидат їх повторює. Не називай якість — **покажи її дією**: *Im letzten Projekt habe ich ein Team aus fünf Ländern koordiniert* замість *Ich bin teamfähig*.

### Zahlungserinnerung, Mahnung, Absage

**Zahlungserinnerung** — перше, дружнє нагадування; **Mahnung** — формальна вимога з новим строком. Юридично боржник перебуває в прострочці (*Verzug*) після Mahnung, а за грошовими вимогами — не пізніше ніж через 30 днів після настання строку й отримання рахунку; для споживача — лише якщо рахунок про це попереджав (§ 286 BGB; це орієнтир, а не юридична консультація).

| Лист | Тон | Ключові звороти |
|---|---|---|
| Zahlungserinnerung | дружній | *Sicherlich ist es Ihrer Aufmerksamkeit entgangen, dass …* · *Falls Sie den Betrag bereits überwiesen haben, betrachten Sie dieses Schreiben bitte als gegenstandslos.* |
| 1. Mahnung | нейтральний | *Leider konnten wir bis heute keinen Zahlungseingang feststellen.* · *Bitte begleichen Sie den Rechnungsbetrag bis zum …* |
| letzte Mahnung | чіткий | *Sollte der Betrag bis zum … nicht eingehen, sehen wir uns gezwungen, ein gerichtliches Mahnverfahren einzuleiten.* |
| Absage (відмова кандидатові) | ввічливий | *Leider müssen wir Ihnen mitteilen, dass wir uns für eine andere Bewerberin entschieden haben.* · *Für Ihren weiteren Berufsweg wünschen wir Ihnen alles Gute.* |
| Absage (твоя відмова фірмі) | вдячний | *Nach reiflicher Überlegung habe ich mich entschieden, Ihr Angebot nicht anzunehmen.* |

### Скарга C1: від емоцій до вимоги

Скарга C1 відрізняється від B2 тим, що спирається на **права**, а не на почуття. Покупець при дефекті товару може вимагати **Nacherfüllung** — ремонт або заміну на вибір (§ 439 BGB); якщо продавець не реагує в розумний строк (*Nachfrist*), можна відмовитися від договору (*Rücktritt*) або вимагати знижку (*Minderung*). Твій лист не мусить цитувати закон, але має показати, що ти знаєш свої можливості.

| Крок | Звороти |
|---|---|
| факти | *Am 14. Oktober habe ich bei Ihnen … (Bestellnummer …) erworben. Seit dem 2. November …* |
| проблема | *Das Gerät weist folgenden Mangel auf: …* |
| вимога | *Ich fordere Sie daher auf, den Mangel zu beseitigen oder mir ein mangelfreies Ersatzgerät zu liefern.* |
| строк | *Hierfür setze ich Ihnen eine Nachfrist bis zum 25. November 2026.* |
| наслідок | *Nach fruchtlosem Ablauf der Frist behalte ich mir vor, vom Vertrag zurückzutreten.* |

### Зразок: e-mail керівникові (Goethe C1, Teil 2, ≈ 120 слів)

Завдання (власне, у форматі іспиту): фірма вводить новий графік змін, за яким у тебе лишається лише один вільний вихідний на місяць. Напиши керівниці: ввічливо покажи розуміння, назви, що саме стало складніше, опиши прийнятні умови, запропонуй компроміс.

> [!example] E-Mail an Frau Keller
> **Betreff: Neuer Schichtplan ab Januar**
>
> Sehr geehrte Frau Keller,
>
> ich kann gut nachvollziehen, dass der neue Schichtplan nötig ist, weil im Winter mehrere Kolleginnen und Kollegen ausfallen.
>
> Dennoch möchte ich Sie auf ein Problem aufmerksam machen: Da ich zweimal pro Woche abends einen Sprachkurs besuche und am Wochenende meine Mutter betreue, lässt sich der Plan mit nur einem freien Wochenende im Monat für mich kaum vereinbaren.
>
> Akzeptabel wäre für mich ein Plan, in dem ich zumindest jedes zweite Wochenende frei habe. Als Kompromiss schlage ich vor, dass ich dafür häufiger Spätschichten unter der Woche übernehme und bei Engpässen kurzfristig einspringe.
>
> Über ein kurzes Gespräch dazu würde ich mich freuen.
>
> Mit freundlichen Grüßen
> Iryna Bondar

Розбір: чотири функції закрито по черзі (*kann gut nachvollziehen* → розуміння; *Da ich … lässt sich … kaum vereinbaren* → утруднення; *Akzeptabel wäre* → умови; *Als Kompromiss schlage ich vor* → компроміс). Тон — напівформальний: *Sie*, без канцеляриту, Konjunktiv II для мʼякості. ≈ 120 слів.

## Приклади

- *Ihr Anforderungsprofil deckt sich in weiten Teilen mit meinem beruflichen Werdegang.* — Ваші вимоги здебільшого збігаються з моїм професійним шляхом.
- *In meiner jetzigen Position verantworte ich ein Budget von 2 Millionen Euro.* — На теперішній посаді я відповідаю за бюджет 2 млн євро.
- *Mein frühestmöglicher Eintrittstermin ist der 1. März 2027.* — Найраніша дата, з якої я можу почати, — 1 березня 2027.
- *Leider konnten wir bis heute keinen Zahlungseingang feststellen.* — На жаль, досі ми не отримали оплати.
- *Bitte begleichen Sie den offenen Betrag bis zum 30. November.* — Будь ласка, сплатіть заборгованість до 30 листопада.
- *Falls Sie den Betrag bereits überwiesen haben, betrachten Sie dieses Schreiben bitte als gegenstandslos.* — Якщо ви вже переказали суму, вважайте цей лист недійсним.
- *Das Gerät weist seit dem 2. November folgenden Mangel auf: …* — З 2 листопада пристрій має такий дефект: …
- *Hierfür setze ich Ihnen eine Nachfrist bis zum 25. November.* — Для цього встановлюю вам додатковий строк до 25 листопада.
- *Nach reiflicher Überlegung habe ich mich entschieden, Ihr Angebot nicht anzunehmen.* — Після ретельних роздумів я вирішила не приймати вашу пропозицію.
- *Für Ihren weiteren Berufsweg wünschen wir Ihnen alles Gute.* — Бажаємо вам успіхів на подальшому професійному шляху.

## Слова

### Оформлення листа

> [!word] der Briefkopf
> ipa: /ˈbʁiːfkɔpf/ · pos: noun · level: B2 · id: de-c1-korrespondenz-w01
> uk: шапка листа (дані відправника)
> forms: die Briefköpfe
> example: Im **Briefkopf** stehen Name, Adresse und Telefonnummer. — У шапці листа — імʼя, адреса й номер телефону.
> note: der Brief + der Kopf; множина від Kopf: Köpfe. У фірмах — бланк із логотипом.

> [!word] die Anschrift
> ipa: /ˈanʃʁɪft/ · pos: noun · level: B2 · id: de-c1-korrespondenz-w02
> uk: адреса (на листі, конверті)
> forms: die Anschriften
> example: Bitte geben Sie Ihre vollständige **Anschrift** an. — Будь ласка, вкажіть повну адресу.
> note: офіційніше за die Adresse. Anschrift des Empfängers — блок адреси отримувача за DIN 5008.

> [!word] die Bezugszeile
> ipa: /bəˈtsuːksˌtsaɪ̯lə/ · pos: noun · level: C1 · id: de-c1-korrespondenz-w03
> uk: рядок посилань (номер справи, дата листа)
> forms: die Bezugszeilen
> example: In der **Bezugszeile** steht das Datum Ihres Schreibens. — У рядку посилань — дата вашого листа.
> note: елемент ділового листа: Ihr Zeichen, Ihre Nachricht vom, Unser Zeichen, Datum. Від der Bezug (посилання) + die Zeile.

> [!word] die Signatur
> ipa: /zɪɡnaˈtuːɐ̯/ · pos: noun · level: B2 · id: de-c1-korrespondenz-w04
> uk: підпис (блок у кінці e-mail); шифр (у бібліотеці)
> forms: die Signaturen
> example: In der **Signatur** stehen Name, Funktion und Telefonnummer. — У підписі e-mail — імʼя, посада й телефон.
> note: у фірмах ділова e-mail містить обовʼязкові дані підприємства (назва, адреса, реєстр). Власноручний підпис — die Unterschrift.

### Заява про роботу

> [!word] die Stellenausschreibung
> ipa: /ˈʃtɛlənˌʔaʊ̯sʃʁaɪ̯bʊŋ/ · pos: noun · level: C1 · id: de-c1-korrespondenz-w05
> uk: оголошення про вакансію, конкурс на посаду
> forms: die Stellenausschreibungen
> example: Die **Stellenausschreibung** endet am 30. November. — Прийом заяв на вакансію закінчується 30 листопада.
> note: офіційніше за die Stellenanzeige; типово для держслужби й університетів. Дієслово: eine Stelle ausschreiben.

> [!word] ausschreiben
> ipa: /ˈaʊ̯sʃʁaɪ̯bn̩/ · pos: verb · level: C1 · id: de-c1-korrespondenz-w06
> uk: оголошувати (конкурс, вакансію); писати повністю
> forms: ausschreiben → schrieb aus → hat ausgeschrieben
> example: Die Universität hat drei Stellen **ausgeschrieben**. — Університет оголосив конкурс на три посади.
> note: відокремлюване. Друге значення: ein Wort ausschreiben — написати слово повністю, без скорочення.

> [!word] das Anforderungsprofil
> ipa: /ˈanfɔʁdəʁʊŋspʁoˌfiːl/ · pos: noun · level: C1 · id: de-c1-korrespondenz-w07
> uk: перелік вимог до кандидата
> forms: die Anforderungsprofile
> example: Mein Werdegang passt gut zu Ihrem **Anforderungsprofil**. — Мій професійний шлях добре відповідає вашим вимогам.
> note: die Anforderung + das Profil; рід від Profil. В оголошенні — розділ «Ihr Profil» або «Das bringen Sie mit».

> [!word] der Werdegang
> ipa: /ˈveːɐ̯dəɡaŋ/ · pos: noun · level: C1 · id: de-c1-korrespondenz-w08
> uk: (професійний) шлях, біографія
> forms: die Werdegänge
> example: Im Lebenslauf beschreiben Sie Ihren beruflichen **Werdegang**. — У резюме ви описуєте свій професійний шлях.
> note: werden + der Gang. Часто: beruflicher / schulischer Werdegang. Множина рідко.

> [!word] die Eignung
> ipa: /ˈaɪ̯ɡnʊŋ/ · pos: noun · level: C1 · id: de-c1-korrespondenz-w09
> uk: придатність, відповідність (посаді)
> forms: die Eignungen
> example: Das Gespräch soll Ihre **Eignung** für die Stelle klären. — Співбесіда має зʼясувати, чи підходите ви на посаду.
> note: від sich eignen (für). Пор. geeignet. der Eignungstest — тест на професійну придатність.

> [!word] die Teamfähigkeit
> ipa: /ˈtiːmfɛːɪçkaɪ̯t/ · pos: noun · level: B2 · id: de-c1-korrespondenz-w10
> uk: уміння працювати в команді
> forms: — (без множини)
> example: In der Anzeige wird **Teamfähigkeit** erwartet. — В оголошенні очікують уміння працювати в команді.
> note: Team — англ., вимова [tiːm]. В Anschreiben краще показати прикладом, ніж назвати.

> [!word] die Belastbarkeit
> ipa: /bəˈlastbaːɐ̯kaɪ̯t/ · pos: noun · level: C1 · id: de-c1-korrespondenz-w11
> uk: стресостійкість, здатність витримувати навантаження
> forms: — (без множини)
> example: Für die Stelle sind **Belastbarkeit** und Flexibilität wichtig. — Для цієї посади важливі стресостійкість і гнучкість.
> note: від belastbar. Також технічно: Belastbarkeit eines Materials — допустиме навантаження.

> [!word] die Eigeninitiative
> ipa: /ˈaɪ̯ɡn̩ʔinitsi̯aˌtiːvə/ · pos: noun · level: C1 · id: de-c1-korrespondenz-w12
> uk: власна ініціатива, ініціативність
> forms: — (без множини)
> example: Wir suchen jemanden mit viel **Eigeninitiative**. — Шукаємо ініціативну людину.
> note: eigen + die Initiative; ti = [tsi̯]. Стійко: Eigeninitiative zeigen / ergreifen.

> [!word] eigenverantwortlich
> ipa: /ˈaɪ̯ɡn̩fɛɐ̯ʔantvɔʁtlɪç/ · pos: adj · level: C1 · id: de-c1-korrespondenz-w13
> uk: самостійно, під власну відповідальність
> example: Ich habe das Projekt **eigenverantwortlich** geleitet. — Я самостійно керувала проєктом.
> note: часте слово в оголошеннях і Arbeitszeugnis. Синонім: selbstständig.

> [!word] die Motivation
> ipa: /motivaˈtsi̯oːn/ · pos: noun · level: B1 · id: de-c1-korrespondenz-w14
> uk: мотивація
> forms: die Motivationen
> example: Im Anschreiben erklären Sie Ihre **Motivation**. — В Anschreiben ви пояснюєте свою мотивацію.
> note: das Motivationsschreiben — мотиваційний лист (для університету, стипендії). -tion = [tsi̯oːn].

> [!word] der Eintrittstermin
> ipa: /ˈaɪ̯ntʁɪtstɛʁˌmiːn/ · pos: noun · level: C1 · id: de-c1-korrespondenz-w15
> uk: дата початку роботи
> forms: die Eintrittstermine
> example: Bitte nennen Sie Ihren frühestmöglichen **Eintrittstermin**. — Будь ласка, вкажіть найранішу дату, з якої можете почати.
> note: стала вимога в оголошеннях разом із Gehaltsvorstellung. Залежить від твоєї Kündigungsfrist.

> [!word] die Bewerbungsfrist
> ipa: /bəˈvɛʁbʊŋsˌfʁɪst/ · pos: noun · level: B2 · id: de-c1-korrespondenz-w16
> uk: строк подання заяв
> forms: die Bewerbungsfristen
> example: Die **Bewerbungsfrist** endet am 15. Januar. — Строк подання заяв закінчується 15 січня.
> note: die Bewerbung + die Frist. Пізніші заяви часто не розглядають.

> [!word] das Zwischenzeugnis
> ipa: /ˈtsvɪʃn̩ˌtsɔʏ̯knɪs/ · pos: noun · level: C1 · id: de-c1-korrespondenz-w17
> uk: проміжна характеристика з роботи
> forms: die Zwischenzeugnisse
> example: Vor dem Wechsel in die neue Abteilung habe ich ein **Zwischenzeugnis** erhalten. — Перед переходом у новий відділ я отримала проміжну характеристику.
> note: на противагу до das Arbeitszeugnis (в кінці роботи). Просять при зміні керівника чи відділу.

> [!word] die Zufriedenheit
> ipa: /tsuˈfʁiːdn̩haɪ̯t/ · pos: noun · level: B2 · id: de-c1-korrespondenz-w18
> uk: задоволення, задоволеність
> forms: — (без множини)
> example: Sie erledigte ihre Aufgaben stets zu unserer vollsten **Zufriedenheit**. — Вона завжди виконувала завдання до нашого повного задоволення.
> note: -heit → die. У мові характеристик «stets zur vollsten Zufriedenheit» вважають найвищою оцінкою, хоч vollst- граматично дивне.

### Гроші й нагадування

> [!word] die Zahlungserinnerung
> ipa: /ˈtsaːlʊŋsʔɛɐ̯ˌʔɪnəʁʊŋ/ · pos: noun · level: C1 · id: de-c1-korrespondenz-w19
> uk: нагадування про оплату
> forms: die Zahlungserinnerungen
> example: Wir senden Ihnen heute eine freundliche **Zahlungserinnerung**. — Сьогодні надсилаємо вам дружнє нагадування про оплату.
> note: мʼякший крок перед Mahnung, часто без зборів. Пор. die Erinnerung.

> [!word] der Rechnungsbetrag
> ipa: /ˈʁɛçnʊŋsbəˌtʁaːk/ · pos: noun · level: C1 · id: de-c1-korrespondenz-w20
> uk: сума рахунку
> forms: die Rechnungsbeträge
> example: Bitte überweisen Sie den **Rechnungsbetrag** innerhalb von 14 Tagen. — Будь ласка, перекажіть суму рахунку протягом 14 днів.
> note: die Rechnung + der Betrag; рід від Betrag. Кінцеве g — [k].

> [!word] fällig
> ipa: /ˈfɛlɪç/ · pos: adj · level: B2 · id: de-c1-korrespondenz-w21
> uk: що підлягає сплаті; належний (до строку)
> example: Die Miete ist am Monatsersten **fällig**. — Оренду треба сплатити першого числа місяця.
> note: fällig werden — настати (про строк оплати). Іменник die Fälligkeit. Також розм.: Ein Urlaub ist mal wieder fällig — час у відпустку.

> [!word] der Zahlungseingang
> ipa: /ˈtsaːlʊŋsˌʔaɪ̯nɡaŋ/ · pos: noun · level: C1 · id: de-c1-korrespondenz-w22
> uk: надходження оплати
> forms: die Zahlungseingänge
> example: Nach **Zahlungseingang** versenden wir die Ware. — Після надходження оплати ми відправимо товар.
> note: часто без артикля: nach Zahlungseingang. Пор. der Eingang (вхід; надходження).

> [!word] der Zahlungsverzug
> ipa: /ˈtsaːlʊŋsfɛɐ̯ˌtsuːk/ · pos: noun · level: C1 · id: de-c1-korrespondenz-w23
> uk: прострочення платежу
> forms: — (без множини)
> example: Bei **Zahlungsverzug** können Mahngebühren anfallen. — При простроченні платежу можуть нараховуватися збори.
> note: юридичний термін (§ 286 BGB). Дієслово: in Verzug geraten / sein. Кінцеве g — [k].

> [!word] in Verzug geraten
> ipa: /ɪn fɛɐ̯ˈtsuːk ɡəˈʁaːtn̩/ · pos: phrase · level: C1 · id: de-c1-korrespondenz-w24
> uk: прострочити (оплату, виконання)
> example: Der Kunde ist mit der Zahlung **in Verzug geraten**. — Клієнт прострочив оплату.
> note: mit + Dat: mit der Zahlung / mit der Lieferung in Verzug geraten. geraten → gerät → geriet → ist geraten.

> [!word] die Mahngebühr
> ipa: /ˈmaːnɡəˌbyːɐ̯/ · pos: noun · level: C1 · id: de-c1-korrespondenz-w25
> uk: збір за нагадування (за прострочку)
> forms: die Mahngebühren
> example: Für die zweite Mahnung berechnen wir eine **Mahngebühr** von 5 Euro. — За друге нагадування ми стягуємо збір 5 євро.
> note: mahnen + die Gebühr. Рід — від Gebühr. h після a — довгота: [maːn].

> [!word] das Mahnverfahren
> ipa: /ˈmaːnfɛɐ̯ˌfaːʁən/ · pos: noun · level: C1 · id: de-c1-korrespondenz-w26
> uk: судовий наказний порядок стягнення боргу
> forms: die Mahnverfahren
> example: Wir sehen uns gezwungen, ein gerichtliches **Mahnverfahren** einzuleiten. — Ми змушені розпочати судову процедуру стягнення.
> note: у ньому суд надсилає der Mahnbescheid. Рід від das Verfahren.

> [!word] das Inkasso
> ipa: /ɪnˈkaso/ · pos: noun · level: C1 · id: de-c1-korrespondenz-w27
> uk: стягнення боргів (колекторська діяльність)
> forms: die Inkassos (AT auch: die Inkassi)
> example: Die Forderung wurde an ein **Inkasso**unternehmen übergeben. — Борг передали колекторській фірмі.
> note: з італ. incasso. das Inkassobüro, das Inkassounternehmen — колекторська фірма. Наголос на -kas-.

### Скарга C1

> [!word] die Nachfrist
> ipa: /ˈnaːxfʁɪst/ · pos: noun · level: C1 · id: de-c1-korrespondenz-w28
> uk: додатковий строк
> forms: die Nachfristen
> example: Ich setze Ihnen eine **Nachfrist** bis zum 25. November. — Встановлюю вам додатковий строк до 25 листопада.
> note: eine Nachfrist setzen / gewähren. Після неї можливі Rücktritt чи Schadensersatz (орієнтир, не правова консультація).

> [!word] die Nacherfüllung
> ipa: /ˈnaːxʔɛɐ̯ˌfʏlʊŋ/ · pos: noun · level: C1 · id: de-c1-korrespondenz-w29
> uk: усунення недоліку (ремонт або заміна товару)
> forms: die Nacherfüllungen
> example: Als Käufer kann ich zunächst **Nacherfüllung** verlangen. — Як покупець я спершу можу вимагати ремонту або заміни.
> note: термін § 439 BGB: Beseitigung des Mangels або Lieferung einer mangelfreien Sache. Розмовно: Reparatur oder Umtausch.

> [!word] die Ersatzlieferung
> ipa: /ɛɐ̯ˈzatsˌliːfəʁʊŋ/ · pos: noun · level: C1 · id: de-c1-korrespondenz-w30
> uk: заміна (поставка нового товару замість дефектного)
> forms: die Ersatzlieferungen
> example: Ich bitte um eine **Ersatzlieferung** innerhalb von zehn Tagen. — Прошу замінити товар протягом десяти днів.
> note: der Ersatz (заміна) + die Lieferung. Альтернатива — die Reparatur / Nachbesserung.

> [!word] der Rücktritt
> ipa: /ˈʁʏktʁɪt/ · pos: noun · level: C1 · id: de-c1-korrespondenz-w31
> uk: відмова (від договору); відставка
> forms: die Rücktritte
> example: Nach Ablauf der Frist erkläre ich den **Rücktritt** vom Kaufvertrag. — Після спливу строку я відмовляюся від договору купівлі.
> note: Rücktritt vom Vertrag (юрид.), Rücktritt der Ministerin (відставка). Дієслово: zurücktreten (von + Dat).

> [!word] die Minderung
> ipa: /ˈmɪndəʁʊŋ/ · pos: noun · level: C1 · id: de-c1-korrespondenz-w32
> uk: зменшення (ціни через дефект), знижка
> forms: die Minderungen
> example: Statt Rücktritt verlange ich eine **Minderung** des Kaufpreises. — Замість відмови від договору вимагаю зменшити ціну.
> note: від mindern (зменшувати). Пор. die Mietminderung (зменшення орендної плати через недоліки житла).

## Слухаємо

> [!listen] Напиши або скажи, що почув
> level: C1 · type: dictation · id: de-c1-korrespondenz-l01
> audio: Bitte begleichen Sie den offenen Betrag bis zum dreißigsten November.
> explain: *begleichen* — сплатити (борг, рахунок), книжніше за *bezahlen*. *bis zum dreißigsten* — дата з артиклем у Dativ.

> [!listen] Яку пораду дає HR-консультантка щодо Anschreiben?
> level: C1 · type: answer · id: de-c1-korrespondenz-l02
> audio: A: Ich schreibe immer: Ich bin teamfähig, belastbar und flexibel.
> audio: B: Das schreiben alle. Nennen Sie lieber ein konkretes Projekt, in dem Sie das gezeigt haben.
> audio: A: Und wie lang soll das Anschreiben sein?
> audio: B: Eine Seite reicht völlig.
> - [x] Замість загальних якостей навести конкретний проєкт; обсяг — одна сторінка.
> - [ ] Перелічити ще більше якостей і писати дві сторінки.
> - [ ] Не писати про якості й не надсилати Anschreiben.
> - [ ] Скопіювати текст з оголошення.
>
> **Пояснення:** *Nennen Sie lieber ein konkretes Projekt* — показати якість дією; *Eine Seite reicht völlig* — однієї сторінки досить. Переклад: — Я завжди пишу: я вмію працювати в команді, стресостійкий і гнучкий. — Так пишуть усі. Назвіть краще конкретний проєкт, де ви це показали. — А якої довжини має бути Anschreiben? — Однієї сторінки цілком досить.

## Вимова

> [!speak] Скажи вголос: завершення Anschreiben
> level: C1 · id: de-c1-korrespondenz-s01
> text: Über die Gelegenheit zu einem persönlichen Gespräch freue ich mich sehr.
> ipa: /ˈyːbɐ diː ɡəˈleːɡn̩haɪ̯t tsuː ˈaɪ̯nəm pɛʁˈzøːnlɪçn̩ ɡəˈʃpʁɛːç ˈfʁɔʏ̯ə ɪç mɪç zeːɐ̯/
> tip: *Gelegenheit* — наголос на -le-; *persönlichen* — [ø] довге; *Gespräch* — ch після ä = [ç].
> uk: Буду дуже радий нагоді особисто поспілкуватися.

> [!speak] Скажи вголос: додатковий строк
> level: C1 · id: de-c1-korrespondenz-s02
> text: Hierfür setze ich Ihnen eine Nachfrist bis zum fünfundzwanzigsten November.
> ipa: /hiːɐ̯ˈfyːɐ̯ ˈzɛtsə ɪç ˈiːnən ˈaɪ̯nə ˈnaːxfʁɪst bɪs tsʊm ˈfʏnfʊntˌtsvantsɪçstn̩ noˈvɛmbɐ/
> tip: *Nachfrist* — ch після a = [x]; *fünfundzwanzigsten* — читай частинами: fünf-und-zwanzig-sten; *November* — наголос на -vem-.
> uk: Для цього я встановлюю вам додатковий строк до двадцять пʼятого листопада.

## Типові помилки українців

> [!pitfall] Кома після Grußformel і велика літера після Anrede
> ~~Mit freundlichen Grüßen,~~ → **Mit freundlichen Grüßen** (без коми). ~~Sehr geehrte Frau Weber, Ich schreibe Ihnen …~~ → *Sehr geehrte Frau Weber,* / ***i**ch schreibe Ihnen …* — після коми в звертанні текст продовжується з малої (крім іменників і *Sie*). Кома після прощання — вплив англійських і українських листів.

> [!pitfall] Anschreiben як переказ резюме
> *Von 2014 bis 2018 habe ich studiert. Dann habe ich bei … gearbeitet …* — це вже є в *Lebenslauf*. Anschreiben відповідає на питання **«чому я і чому у вас»**: два-три досягнення, повʼязані з вимогами (*Anforderungsprofil*), і мотивація. Хронологія — у резюме.

> [!pitfall] Погрози й емоції замість вимоги
> ~~Das ist eine Frechheit! Ich werde Sie verklagen!~~ — такий лист легко відкласти. Сильніше звучить спокійна вимога з правовою логікою: *Ich fordere Sie auf, den Mangel bis zum … zu beseitigen. Andernfalls behalte ich mir vor, vom Vertrag zurückzutreten.* Наслідок подано як можливість, а не як погрозу.

> [!pitfall] Ланцюги Konjunktiv II і надмірна скромність
> ~~Ich würde mich sehr freuen, wenn Sie mich vielleicht eventuell zu einem Gespräch einladen würden~~ — звучить невпевнено. На C1 досить одного мʼякого елемента: *Über eine Einladung zu einem persönlichen Gespräch freue ich mich.* Також не пиши ~~Ich hoffe, dass Sie meine Bewerbung nicht ablehnen~~ — це привертає увагу до відмови.

## Ситуація: перша Mahnung для клієнта

> [!listen] Бухгалтерка обговорює з колегою, що писати клієнтові. Що вони вирішують?
> level: C1 · type: answer · id: de-c1-korrespondenz-l03
> audio: A: Die Firma Lindner hat die Rechnung vom September immer noch nicht bezahlt.
> audio: B: Haben wir schon erinnert?
> audio: A: Ja, vor drei Wochen. Ohne Reaktion.
> audio: B: Dann schicken wir jetzt die erste Mahnung mit einer Frist von zehn Tagen. Aber noch ohne Mahngebühr, sie sind gute Kunden.
> - [x] Надіслати першу Mahnung зі строком десять днів, поки без збору.
> - [ ] Одразу передати борг колекторам.
> - [ ] Ще раз надіслати дружнє нагадування без строку.
> - [ ] Нарахувати збір і подати до суду.
>
> **Пояснення:** нагадування (*erinnert*) вже було три тижні тому, тому тепер — *die erste Mahnung mit einer Frist von zehn Tagen … noch ohne Mahngebühr*, бо це хороші клієнти. Переклад: — Фірма Lindner досі не оплатила рахунок за вересень. — Ми вже нагадували? — Так, три тижні тому. Без реакції. — Тоді надсилаємо першу Mahnung зі строком десять днів. Але поки без збору, вони хороші клієнти.

> [!speak] Ситуація: продиктуй колезі речення для Mahnung
> level: C1 · id: de-c1-korrespondenz-s03
> text: Leider konnten wir bis heute keinen Zahlungseingang feststellen.
> ipa: /ˈlaɪ̯dɐ ˈkɔntn̩ viːɐ̯ bɪs ˈhɔʏ̯tə ˈkaɪ̯nən ˈtsaːlʊŋsˌʔaɪ̯nɡaŋ ˈfɛstʃtɛlən/
> tip: *Zahlungseingang* — ʔ перед *Eingang*: дві частини чути окремо; *feststellen* — відокремлюване, наголос на fest-.
> uk: На жаль, досі ми не зафіксували надходження оплати.

## Landeskunde: Bewerben in Deutschland

> [!example] Bewerben in Deutschland
> Eine klassische Bewerbung in Deutschland besteht aus drei Teilen: dem Anschreiben, dem Lebenslauf und den Anlagen, also Zeugnissen und Nachweisen. Inzwischen werden die Unterlagen meist als PDF oder über ein Online-Portal eingereicht; die Bewerbungsmappe aus Papier ist selten geworden. Auch das Anschreiben hat an Bedeutung verloren: Manche Unternehmen verzichten ganz darauf und fragen stattdessen einige Punkte im Formular ab. Wer eines schreibt, sollte sich auf eine Seite beschränken. Der Lebenslauf ist in der Regel tabellarisch und antichronologisch aufgebaut, das heißt, die aktuelle Tätigkeit steht oben. Längere Lücken sollte man kurz erklären, etwa mit Elternzeit, Weiterbildung oder einem Umzug aus dem Ausland, statt sie unkommentiert zu lassen.
>
> Ein Bewerbungsfoto war lange üblich, ist aber nicht vorgeschrieben. Seit 2006 gilt das Allgemeine Gleichbehandlungsgesetz (AGG). Sein Ziel ist es, Benachteiligungen unter anderem wegen der ethnischen Herkunft, des Geschlechts, der Religion, einer Behinderung, des Alters oder der sexuellen Identität zu verhindern. Viele Arbeitgeber verlangen deshalb keine Angaben mehr zu Alter, Familienstand oder Herkunft, und manche Stellenausschreibungen betonen ausdrücklich, dass Bewerbungen ohne Foto erwünscht sind.
>
> Eine deutsche Besonderheit ist das Arbeitszeugnis. Nach § 109 der Gewerbeordnung haben Beschäftigte am Ende eines Arbeitsverhältnisses Anspruch auf ein schriftliches Zeugnis. Auf Wunsch muss es nicht nur Art und Dauer der Tätigkeit, sondern auch Leistung und Verhalten beurteilen; man spricht dann von einem qualifizierten Zeugnis. Das Gesetz verlangt, dass das Zeugnis klar und verständlich formuliert ist und keine versteckten Merkmale enthält. Trotzdem hat sich eine eigene „Zeugnissprache“ entwickelt, weil ein Zeugnis zugleich wohlwollend formuliert sein soll. So gilt „stets zu unserer vollsten Zufriedenheit“ in der Praxis als sehr gut, während „zu unserer Zufriedenheit“ nur noch als ausreichend gilt. Wer ein Zeugnis erhält, sollte es deshalb genau lesen und bei Unklarheiten nachfragen.
>
> Für Menschen mit ausländischen Abschlüssen kommt ein weiterer Schritt hinzu: In reglementierten Berufen, etwa in der Medizin oder Pflege, ist eine Anerkennung des Abschlusses Voraussetzung, um überhaupt arbeiten zu dürfen. In anderen Berufen ist sie freiwillig, kann aber Arbeitgebern helfen, eine Qualifikation einzuschätzen. Informationen dazu bietet das Portal „Anerkennung in Deutschland“. Wer seine Unterlagen sorgfältig vorbereitet, spart später Zeit, denn viele Unternehmen entscheiden schon in den ersten Minuten, ob sie eine Bewerbung genauer lesen.

> [!quiz] Nach dem Text: Was stimmt über das Bewerbungsfoto?
> level: C1 · type: single · id: de-c1-korrespondenz-q02
> - [ ] Es ist seit 2006 gesetzlich verboten.
> - [x] Es ist nicht vorgeschrieben, und manche Ausschreibungen wünschen ausdrücklich Bewerbungen ohne Foto.
> - [ ] Ohne Foto wird eine Bewerbung nicht gelesen.
> - [ ] Nur in der Pflege ist ein Foto Pflicht.
>
> **Пояснення:** *war lange üblich, ist aber nicht vorgeschrieben* і *manche Stellenausschreibungen betonen …, dass Bewerbungen ohne Foto erwünscht sind*. Про заборону фото текст не говорить: AGG забороняє дискримінацію, а не фото.

> [!quiz] Nach dem Text: Was verlangt § 109 der Gewerbeordnung? Wähle alle richtigen Aussagen.
> level: C1 · type: multi · id: de-c1-korrespondenz-q03
> - [x] Beschäftigte haben am Ende eines Arbeitsverhältnisses Anspruch auf ein schriftliches Zeugnis.
> - [x] Das Zeugnis muss klar und verständlich formuliert sein.
> - [x] Auf Wunsch beurteilt das Zeugnis auch Leistung und Verhalten.
> - [ ] Das Zeugnis muss eine Schulnote von 1 bis 6 enthalten.
>
> **Пояснення:** усі три твердження — з тексту (*Anspruch auf ein schriftliches Zeugnis; klar und verständlich; auf Wunsch … Leistung und Verhalten*). Шкільних оцінок закон не вимагає: «оцінка» ховається у формулюваннях на кшталт *stets zu unserer vollsten Zufriedenheit*.

> [!quiz] Nach dem Text: Wann ist die Anerkennung eines ausländischen Abschlusses Pflicht?
> level: C1 · type: single · id: de-c1-korrespondenz-q04
> - [ ] immer, in jedem Beruf
> - [x] in reglementierten Berufen, etwa in Medizin oder Pflege
> - [ ] nur für Bewerbungen mit Foto
> - [ ] nie, sie ist immer freiwillig
>
> **Пояснення:** *In reglementierten Berufen … ist eine Anerkennung … Voraussetzung*; *in anderen Berufen ist sie freiwillig*.

## Практика

> [!quiz] Що правильно за DIN 5008? Обери всі.
> level: C1 · type: multi · id: de-c1-korrespondenz-q05
> - [x] Після Anrede стоїть кома, текст продовжується з малої літери.
> - [x] Після «Mit freundlichen Grüßen» кома не потрібна.
> - [x] Слово «Betreff» перед темою не пишуть.
> - [ ] Після Anrede ставлять знак оклику, як в українському листі.
> - [ ] Betreff закінчується крапкою.
>
> **Пояснення:** *Sehr geehrte Frau Weber,* + текст з малої; *Mit freundlichen Grüßen* без коми; тема без слова «Betreff» і без крапки (часто жирним). Знак оклику після звертання в сучасному діловому листі — застаріла форма.

> [!quiz] Яке речення найкраще показує «Teamfähigkeit» в Anschreiben?
> level: C1 · type: single · id: de-c1-korrespondenz-q06
> - [ ] Ich bin sehr teamfähig.
> - [x] Im letzten Projekt habe ich ein Team aus fünf Ländern koordiniert und die Abstimmung über zwei Zeitzonen organisiert.
> - [ ] Teamfähigkeit ist mir wichtig, weil Teams wichtig sind.
> - [ ] Ich arbeite gern mit Menschen.
>
> **Пояснення:** якість **доведена дією** й деталями (5 країн, два часові пояси). Інші варіанти лише називають якість або ходять по колу.

> [!quiz] Заповни пропуски: завершення Anschreiben
> level: C1 · type: fill · bank: Kündigung, Rücktritt · id: de-c1-korrespondenz-q07
>
> ```text fill
> Mein frühestmöglicher [[Eintrittstermin]] ist der 1. März.
> Meine [[Gehaltsvorstellung]] liegt bei 58 000 Euro brutto im Jahr.
> Über eine [[Einladung]] zu einem persönlichen Gespräch freue ich mich.
> ```
>
> **Пояснення:** стала трійка в кінці Anschreiben: *Eintrittstermin*, *Gehaltsvorstellung*, *Einladung zu einem Gespräch*. *Kündigung* і *Rücktritt* — слова з іншого типу листів.

> [!quiz] Упорядкуй кроки, коли клієнт не платить.
> level: C1 · type: order · id: de-c1-korrespondenz-q08
>
> ```text order
> Rechnung mit Zahlungsziel
> Zahlungserinnerung
> erste Mahnung mit Frist
> letzte Mahnung
> gerichtliches Mahnverfahren
> Anschreiben ✗
> ```
>
> **Пояснення:** рахунок → дружнє нагадування → перша Mahnung → остання Mahnung (з попередженням) → судовий *Mahnverfahren*. Anschreiben — лист до заяви про роботу.

> [!quiz] Заповни пропуски: скарга C1
> level: C1 · type: fill · bank: Verzug, Zahlungseingang · id: de-c1-korrespondenz-q09
>
> ```text fill
> Das Gerät weist folgenden [[Mangel]] auf: Der Akku lädt nicht.
> Ich fordere Sie auf, mir ein mangelfreies Gerät als [[Ersatzlieferung]] zu schicken.
> Hierfür setze ich Ihnen eine [[Nachfrist]] bis zum 25. November.
> Nach Ablauf der Frist behalte ich mir den [[Rücktritt]] vom Vertrag vor.
> ```
>
> **Пояснення:** дефект — *Mangel*; заміна — *Ersatzlieferung*; додатковий строк — *Nachfrist*; відмова від договору — *Rücktritt vom Vertrag*. *Verzug* і *Zahlungseingang* стосуються оплати, а не дефекту товару.

> [!quiz] Яке речення — мʼяка Zahlungserinnerung (а не остання Mahnung)?
> level: C1 · type: single · id: de-c1-korrespondenz-q10
> - [x] Sicherlich ist es Ihrer Aufmerksamkeit entgangen, dass die Rechnung vom 2. Oktober noch offen ist.
> - [ ] Sollte der Betrag nicht bis Freitag eingehen, leiten wir ein gerichtliches Mahnverfahren ein.
> - [ ] Wir haben die Forderung an ein Inkassounternehmen übergeben.
> - [ ] Wir berechnen Ihnen hiermit eine Mahngebühr von 10 Euro.
>
> **Пояснення:** *Sicherlich ist es Ihrer Aufmerksamkeit entgangen* — ввічливо припускає, що клієнт просто забув. Решта — пізніші й жорсткіші кроки (суд, колектори, збір).

> [!quiz] Ти відмовляєшся від пропозиції роботи. Яке речення доречне?
> level: C1 · type: single · id: de-c1-korrespondenz-q11
> - [ ] Ihr Angebot ist leider zu schlecht.
> - [x] Nach reiflicher Überlegung habe ich mich entschieden, Ihr Angebot nicht anzunehmen.
> - [ ] Ich sage ab, weil ich keine Lust habe.
> - [ ] Hiermit lehne ich Sie ab.
>
> **Пояснення:** ввічлива й ділова відмова: *Nach reiflicher Überlegung …* Перший і третій варіанти — різкі й розмовні. *Ich lehne Sie ab* — відмовляєш людині, а не пропозиції, і це звучить образливо.

> [!quiz] Склади речення: «Після спливу строку я залишаю за собою право відмовитися від договору.»
> level: C1 · type: order · id: de-c1-korrespondenz-q12
>
> ```text order
> Nach Ablauf der Frist
> behalte ich mir vor,
> vom Vertrag
> zurückzutreten.
> zu zurücktreten ✗
> ```
>
> **Пояснення:** *sich etwas vorbehalten*: *behalte ich mir vor* + інфінітивна група; у відокремлюваному дієслові *zu* стоїть усередині — *zurück**zu**treten*. *von + Dat*: *vom Vertrag*.

> [!quiz] Goethe-Zertifikat C1, Schreiben Teil 2: що правда? Обери всі.
> level: C1 · type: multi · id: de-c1-korrespondenz-q13
> - [x] Пишуть (напів)формальне повідомлення, наприклад e-mail керівникові.
> - [x] Обсяг — приблизно 120 слів.
> - [x] Треба виконати чотири мовні функції завдання (напр. показати розуміння, запропонувати компроміс).
> - [ ] Треба описати графік зі статистикою.
> - [ ] Обсяг — щонайменше 350 слів.
>
> **Пояснення:** за *Modellsatz* Goethe C1: Teil 2 — *E-Mail*, ≈ 120 слів, рекомендовано 25 хв, чотири мовні функції. 350 слів — telc C1 Hochschule, графік — TestDaF.

> [!quiz] Яке звертання правильне в листі до професорки, доктора наук Анни Вебер?
> level: C1 · type: single · id: de-c1-korrespondenz-q14
> - [ ] Sehr geehrte Frau Anna Weber,
> - [x] Sehr geehrte Frau Professorin Weber,
> - [ ] Liebe Frau Professor Dr. Anna,
> - [ ] Sehr geehrter Frau Prof. Weber,
>
> **Пояснення:** у звертанні — найвищий титул і прізвище: *Sehr geehrte Frau Professorin Weber* (поширене й *Frau Professor Weber*). Імʼя в діловому звертанні зазвичай не пишуть; *Sehr geehrter* — форма для чоловіка.

## Фішки

> [!reel] 😊 DIN 5008 дозволила емодзі
> У редакції 2020 року норма DIN 5008 вперше прямо допустила емодзі й емотикони в діловій кореспонденції — якщо вони доречні в контексті. Тобто в чаті з колегою 🙂 можна, а в скарзі чи Anschreiben — краще ні.

> [!reel] 📜 «Vollste Zufriedenheit»
> *Voll* — це вже «повний», і граматично «повніший за повний» звучить дивно. Але в мові характеристик *stets zu unserer vollsten Zufriedenheit* закріпилося як найвища оцінка. Закон вимагає ясності й доброзичливості водночас, тому склалися усталені шаблони — їх читають як шкалу оцінок.

> [!reel] ✉️ «Mit freundlichen Grüßen» без коми
> Українці й англомовні автоматично ставлять кому після прощання. У німецькій її немає: *Mit freundlichen Grüßen*, новий рядок, імʼя. Зате після звертання кома є, і далі пишуть з малої: *Sehr geehrte Frau Weber, vielen Dank …*

## Джерела та що почитати

- [DIN Media — DIN 5008:2020-03](https://www.dinmedia.de/en/standard/din-5008/318422674): чинна норма «Schreib- und Gestaltungsregeln für die Text- und Informationsverarbeitung».
- [DIN — «Einfach richtig schreiben»](https://www.din.de/de/mitwirken/normenausschuesse/nia/aktuelles/einfach-richtig-schreiben-707192): що нового в редакції 2020 (e-mail, таблиці, емодзі).
- [Gesetze im Internet — § 109 GewO «Zeugnis»](https://www.gesetze-im-internet.de/gewo/__109.html): право на характеристику, вимога ясності.
- [Gesetze im Internet — § 1 AGG](https://www.gesetze-im-internet.de/agg/__1.html): мета закону про рівне ставлення.
- [Gesetze im Internet — § 286 BGB «Verzug des Schuldners»](https://www.gesetze-im-internet.de/bgb/__286.html) і [§ 439 BGB «Nacherfüllung»](https://www.gesetze-im-internet.de/bgb/__439.html): орієнтир для Mahnung і скарги (не юридична консультація).
- [Anerkennung in Deutschland](https://www.anerkennung-in-deutschland.de): визнання іноземних кваліфікацій.
- [Goethe-Institut — Modellsatz Goethe-Zertifikat C1 (PDF)](https://www.goethe.de/pro/relaunch/prf/materialien/C1_modular/c1-modular_modellsatz.pdf): Schreiben Teil 2 — e-mail ≈ 120 слів.

> [!important] Підсумок
> - **DIN 5008:** Briefkopf → Anschrift → дата → Betreff (без слова «Betreff», без крапки) → Anrede з комою, текст з малої → Grußformel **без коми** → Anlagen.
> - **Anschreiben C1:** сильний вступ (досвід + посада), 2–3 докази замість «teamfähig», мотивація, Eintrittstermin і Gehaltsvorstellung, впевнене завершення; одна сторінка.
> - **Гроші:** Zahlungserinnerung → Mahnung → letzte Mahnung → Mahnverfahren; *Verzug* — за § 286 BGB (орієнтир).
> - **Скарга C1:** Sachverhalt → Mangel → Nacherfüllung / Ersatzlieferung → Nachfrist → Rücktritt або Minderung — спокійно, без погроз.
> - **Goethe C1, Teil 2:** e-mail ≈ 120 слів, чотири мовні функції, напівформальний тон.
