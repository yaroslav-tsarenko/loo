---
title: Письмо — рецензія, лист до редакції, коментар, есе
id: de-c2-genres
level: C2
icon: px:scroll
tags: [deutsch, c2, skills, schreiben, rezension, leserbrief, kommentar, essay, goethe-c2, gds]
prerequisites: ["[[Deutsch - C2 - 15. Письмо — стилістика й редагування]]", "[[Deutsch - C1 - 19. Письмо — Erörterung, Stellungnahme, опис графіка]]"]
estimatedMinutes: 55
---

# Письмо — рецензія, лист до редакції, коментар, есе

> [!success] Після цієї теми ти зможеш
> - виконати **GDS Schreiben Teil 2**: лист чи e-mail до редакції щодо трьох тверджень або рецензію на роман зі списку — ≈ 350 слів за 60 хвилин;
> - дотримуватися **жанрових конвенцій**: рецензія ≠ переказ, лист до редакції ≠ есей, коментар ≠ новина;
> - писати **заголовок і лід**, що втримують читача, і завершення, що лишається в памʼяті;
> - вживати Redemittel C2 для оцінки книжки, згоди й незгоди з автором статті та для зваженої позиції.

## Передбач

> [!quiz] Ти пишеш лист до редакції газети щодо статті про платні міські дороги. Який початок найкраще відповідає жанру?
> level: C2 · type: single · id: de-c2-genres-q01
> - [x] Sehr geehrte Damen und Herren, mit großem Interesse habe ich Ihren Artikel „Wer zahlt für die Stadt?“ vom 3. Mai gelesen und möchte zu drei Aussagen Stellung nehmen.
> - [ ] Hallo Leute, euer Artikel über die Maut war echt spannend!
> - [ ] In der heutigen Zeit spielt der Verkehr eine immer wichtigere Rolle.
> - [ ] Die Citymaut wurde erstmals in Singapur eingeführt; im Folgenden werden ihre Vor- und Nachteile erörtert.
>
> **Пояснення:** лист до редакції — **лист**: формальне звертання, **посилання на конкретну статтю** (назва, дата) і мета листа. Другий варіант — неформальний регістр (Stilbruch). Третій — штамп без звʼязку зі статтею. Четвертий — початок шкільної Erörterung, а не листа: немає ні адресата, ні приводу.

## Пояснення

### GDS Schreiben Teil 2: чотири теми — одна твоя

На GDS у Teil 2 обираєш **одну з чотирьох тем** (60 хв, ≈ 350 слів):

| Тема | Жанр | Що вимагають |
|---|---|---|
| 1, 2 — «вільні» | лист або e-mail до редакції після статті, серії статей чи телепередачі | послатися на **всі три** наведені твердження, висловити й обґрунтувати свою думку, дати приклади |
| 3, 4 — літературні | рецензія (*Buchbesprechung*) для блогу чи літературного форуму | 3 змістові аспекти, напр.: коротко переказати зміст, детально схарактеризувати героя чи тему, порекомендувати книжку певній аудиторії |

Літературні теми можна обирати, лише якщо ти прочитав роман зі **списку на поточний рік** (його публікують на goethe.de; на 2026 рік — *Wolf Haas, «Junger Mann»* і *Daniela Krien, «Die Liebe im Ernstfall»*; на 2027 — *Kirsten Boie, «Dunkelnacht»* і *Michael Köhlmeier, «Frankie»*). Оцінюють 5 критеріїв по 0–4 бали, сума × 4 = до 80 балів. Серед питань до оцінювача: чи опрацьовано **всі аспекти** завдання, чи є **обґрунтування й приклади**, чи текст **звʼязний і чітко структурований**, чи **лексика й стиль відповідають жанру**.

> [!note] Формат і зразки
> Формат — за *Modellsatz* GDS (березень 2026) і *Durchführungsbestimmungen* C2 (вересень 2025); список романів — за Literaturliste Goethe-Institut (станом на грудень 2025). Теми й зразки нижче — власні. Для рецензії ми беремо **Theodor Fontane, «Effi Briest» (1896)** — класику, яку можна вільно цитувати; романи зі списку тут лише називаємо.

### Чотири жанри: чим вони різняться

> [!diagram] Рецензія, лист до редакції, коментар, есей
> ```yaml
> layout: compare
> columns: { rez: "Rezension", lb: "Leserbrief", kom: "Kommentar", ess: "Essay" }
> nodes:
>   - { id: r1, col: rez, label: "привід", text: "книжка, фільм, вистава", note: "автор, назва, жанр, рік", tone: yellow }
>   - { id: r2, col: rez, label: "ядро", text: "оцінка з аргументами", note: "переказ — лише короткий", tone: yellow }
>   - { id: l1, col: lb, label: "привід", text: "конкретна стаття", note: "назва, дата, твердження", tone: pink }
>   - { id: l2, col: lb, label: "ядро", text: "власна позиція читача", note: "звертання й підпис", tone: pink }
>   - { id: k1, col: kom, label: "привід", text: "актуальна подія", note: "читач уже знає факти", tone: gray }
>   - { id: k2, col: kom, label: "ядро", text: "чітка оцінка автора", note: "загострення, висновок-вимога", tone: gray }
>   - { id: e1, col: ess, label: "привід", text: "питання чи спостереження", note: "часто особисте", tone: yellow }
>   - { id: e2, col: ess, label: "ядро", text: "рух думки", note: "відступи, парадокс, відкритий кінець", tone: yellow }
> steps:
>   - { focus: [r1, r2], note: "Рецензія: спершу паспорт книжки, потім КОРОТКИЙ зміст (Präsens!), далі — оцінка з прикладами: мова, герої, будова. Наприкінці — рекомендація конкретній аудиторії." }
>   - { focus: [l1, l2], note: "Лист до редакції: це лист. Звертання, посилання на статтю, твоя позиція щодо кожного твердження, приклади, завершення з побажанням чи вимогою, прощання." }
>   - { focus: [k1, k2], note: "Коментар у газеті: факти читач уже знає з новини. Автор одразу оцінює, загострює й закінчує висновком або вимогою." }
>   - { focus: [e1, e2], note: "Есей: не доводить, а міркує. Можна почати з особистого спостереження, можна відступати. Позиція — у формулі чи питанні наприкінці." }
> ```
> Колонки — чотири жанри; кольори лише розділяють колонки.

### Рецензія: будова й мова

| Частина | Зміст | Redemittel |
|---|---|---|
| **Überschrift** | влучний, часто оцінний заголовок | *Ein Leben in Konventionen* · *Liebe als Ernstfall* |
| **Einstieg** | цитата, сцена, питання — не «У цій рецензії я…» | *„Effi, komm.“ – rufen die Freundinnen durchs Fenster, als …* |
| **Basisinformationen** | автор, назва, жанр, рік, видавництво | *Der 1895/96 erschienene Roman von Theodor Fontane …* |
| **Inhalt** | коротко, **у Präsens**, без розкриття всіх таємниць | *Die 17-jährige Effi heiratet den deutlich älteren Baron von Innstetten …* |
| **Analyse** | герої, мова, будова, тема — з прикладами | *Fontane erzählt lakonisch, fast beiläufig …* · *Die Figurenzeichnung überzeugt, weil …* |
| **Bewertung** | сильні й слабкі сторони | *Lesenswert ist der Roman vor allem wegen … · Etwas langatmig wirken allerdings …* |
| **Empfehlung** | кому й чому | *Wer …, dem sei dieses Buch wärmstens empfohlen.* · *Für Leserinnen und Leser, die …, ist es ein Gewinn.* |

> [!tip] Рецензія — не шкільний переказ
> Переказ займає щонайбільше третину тексту. Решта — **оцінка з доказами**: «чому мова переконує» з прикладом, «чим герой цікавий» з епізодом. Оцінювач GDS прямо питає, чи *alle Aspekte der Aufgabenstellung inhaltlich und vom Umfang her angemessen* опрацьовано — переказ на 300 слів з одним реченням рекомендації не пройде.

### Зразок: уривок рецензії (≈ 150 слів)

> [!example] Pflicht gegen Gefühl – Fontanes „Effi Briest“
> „Effi, komm.“ – das rufen die Freundinnen durchs offene Fenster, gerade als Effi zum ersten Mal ihrem künftigen Mann gegenübersteht. Der Ruf zurück ins Kinderspiel kommt zu spät: Kurz darauf heiratet die 17-Jährige den mehr als zwanzig Jahre älteren Baron von Innstetten und zieht mit ihm in die pommersche Kleinstadt Kessin. Dort langweilt sie sich, fürchtet sich und lässt sich auf eine kurze Affäre ein, die Jahre später durch alte Briefe ans Licht kommt.
>
> Was den Roman bis heute lesenswert macht, ist nicht die Handlung, sondern die Art, wie Fontane erzählt: lakonisch, fast beiläufig, oft in Gesprächen, in denen das Wichtigste gerade nicht gesagt wird. Niemand ist hier einfach schuldig, alle folgen Regeln, an die sie selbst kaum noch glauben. Etwas langatmig wirken allenfalls manche Plaudereien über den Adel. Wer wissen möchte, wie gesellschaftliche Konventionen Menschen zerstören können, dem sei dieses Buch wärmstens empfohlen.

### Лист до редакції: будова

1. **Betreff / Anrede:** *Ihr Artikel „…“ vom … · Sehr geehrte Damen und Herren,*
2. **Bezug:** *Mit großem Interesse / Mit einiger Verwunderung habe ich … gelesen.*
3. **Твердження 1, 2, 3** — кожне назви й оціни: *Die Aussage, dass …, halte ich für zutreffend / überzogen, denn … · Ein Beispiel aus meinem Alltag: …*
4. **Зважений висновок:** *Unterm Strich … · Ich würde mir wünschen, dass Ihre Zeitung …*
5. **Gruß:** *Mit freundlichen Grüßen* + імʼя (і місто — так листи публікують у газетах).

Тон — **ввічливо-критичний**: можна різко не погоджуватися, але без образ і без розмовного регістру. Сильні Redemittel незгоди: *Dem muss ich entschieden widersprechen. · Diese Darstellung greift zu kurz. · Hier wird ein komplexes Problem unzulässig vereinfacht.*

### Коментар і есей: заголовок, лід, фінал

- **Überschrift** — коротка, з оцінкою або грою слів: *Teuer erkauftes Schweigen*, *Die Stadt gehört allen*.
- **Vorspann (Lead)** — 1–2 речення під заголовком: тема + напрям думки. Читач має знати, **про що** і **з якого боку**.
- **Aufhänger** — актуальний привід: подія, цифра, цитата, з яких починається текст.
- **Фінал** коментаря — вимога чи загострена формула (*Wer jetzt schweigt, stimmt zu.*); фінал есею — часто питання чи парадокс, що лишається відкритим.

## Приклади

- *Der Roman lebt weniger von seiner Handlung als von seiner Erzählweise.* — Роман тримається не так на сюжеті, як на манері оповіді.
- *Der Spannungsbogen trägt bis zur letzten Seite.* — Напруга тримається до останньої сторінки.
- *Die Nebenfiguren wirken leider etwas klischeehaft.* — Другорядні персонажі, на жаль, трохи шаблонні.
- *Die Kritik hat den Debütroman zunächst verrissen.* — Критика спершу рознесла цей дебютний роман.
- *Mit einiger Verwunderung habe ich Ihren Kommentar zur Mietpreisbremse gelesen.* — Я з певним подивом прочитав ваш коментар про обмеження зростання орендної плати.
- *Diese Darstellung greift meines Erachtens zu kurz.* — Як на мене, такий виклад надто спрощений.
- *Die Zeitung veröffentlicht nur eine Auswahl der Zuschriften.* — Газета публікує лише частину листів читачів.
- *Der Gastbeitrag einer Pflegerin hat eine heftige Debatte ausgelöst.* — Колонка запрошеної авторки-медсестри викликала гостру дискусію.
- *Ihr Essay ist ein Denkanstoß, keine fertige Antwort.* — Її есей — поштовх до роздумів, а не готова відповідь.
- *Wer Familienromane mag, dem sei dieses Buch wärmstens empfohlen.* — Хто любить родинні романи, тому щиро раджу цю книжку.

## Слова

### Рецензія

> [!word] die Buchbesprechung
> ipa: /ˈbuːxbəˌʃpʁɛçʊŋ/ · pos: noun · level: C1 · id: de-c2-genres-w01
> uk: рецензія на книжку, огляд книжки
> forms: die Buchbesprechungen
> example: Für den Blog schreibe ich eine **Buchbesprechung**. — Для блогу я пишу рецензію на книжку.
> note: das Buch + die Besprechung; рід від Besprechung. Синонім: die Rezension (книжніше).

> [!word] der Rezensent
> ipa: /ʁetsɛnˈzɛnt/ · pos: noun · level: C2 · id: de-c2-genres-w02
> uk: рецензент
> forms: die Rezensenten
> example: Der **Rezensent** lobt vor allem die Sprache. — Рецензент хвалить передусім мову.
> note: n-відміна: den / dem / des Rezensenten. Жінка: die Rezensentin.

> [!word] der Klappentext
> ipa: /ˈklapn̩ˌtɛkst/ · pos: noun · level: C1 · id: de-c2-genres-w03
> uk: анотація на клапані обкладинки чи звороті книжки
> forms: die Klappentexte
> example: Der **Klappentext** verspricht mehr, als der Roman hält. — Анотація обіцяє більше, ніж дає роман.
> note: die Klappe — клапан суперобкладинки. Не плутай з рецензією: Klappentext пише видавництво, щоб продати книжку.

> [!word] verreißen
> ipa: /fɛɐ̯ˈʁaɪ̯sn̩/ · pos: verb · level: C2 · id: de-c2-genres-w04
> uk: розносити (в рецензії), нищівно критикувати
> forms: verreißen → verriss → hat verrissen
> example: Die Kritikerin hat das Stück gnadenlos **verrissen**. — Критикиня безжально рознесла виставу.
> note: іменник der Verriss (уже є в курсі). Протилежне: loben, feiern.

> [!word] die Lobeshymne
> ipa: /ˈloːbəsˌhʏmnə/ · pos: noun · level: C2 · id: de-c2-genres-w05
> uk: хвалебна пісня, захоплений відгук
> forms: die Lobeshymnen
> example: Die Feuilletons singen **Lobeshymnen** auf den Roman. — Розділи культури співають роману хвалебні пісні.
> note: Lobeshymnen auf + Akk singen. y = [ʏ]. Часто іронічно.

> [!word] lesenswert
> ipa: /ˈleːzn̩sveːɐ̯t/ · pos: adj · level: C1 · id: de-c2-genres-w06
> uk: вартий прочитання
> example: Trotz kleiner Schwächen ist das Buch **lesenswert**. — Попри дрібні вади книжка варта прочитання.
> note: модель -wert: sehenswert, hörenswert, empfehlenswert.

> [!word] empfehlenswert
> ipa: /ɛmˈpfeːlənsveːɐ̯t/ · pos: adj · level: B2 · id: de-c2-genres-w07
> uk: вартий рекомендації
> example: Besonders **empfehlenswert** ist das Hörbuch. — Особливо варта рекомендації аудіокнижка.
> note: від empfehlen + -wert. pf — [pf], без «ф».

> [!word] die Erzählweise
> ipa: /ɛɐ̯ˈtsɛːlvaɪ̯zə/ · pos: noun · level: C1 · id: de-c2-genres-w08
> uk: манера оповіді
> forms: die Erzählweisen
> example: Die nüchterne **Erzählweise** passt zum Thema. — Твереза манера оповіді пасує до теми.
> note: erzählen + die Weise. Пор. die Erzählperspektive (хто розповідає).

> [!word] die Figurenzeichnung
> ipa: /fiˈɡuːʁənˌtsaɪ̯çnʊŋ/ · pos: noun · level: C2 · id: de-c2-genres-w09
> uk: змалювання персонажів
> forms: die Figurenzeichnungen
> example: Die **Figurenzeichnung** ist differenziert und glaubwürdig. — Персонажів змальовано тонко й переконливо.
> note: die Figur + die Zeichnung. Типове слово рецензій.

> [!word] packend
> ipa: /ˈpakn̩t/ · pos: adj · level: C1 · id: de-c2-genres-w10
> uk: захопливий
> example: Der Thriller ist **packend** bis zur letzten Seite. — Трилер захоплює до останньої сторінки.
> note: від packen — хапати. Синонім: fesselnd.

> [!word] konstruiert
> ipa: /kɔnstʁuˈiːɐ̯t/ · pos: adj · level: C1 · id: de-c2-genres-w11
> uk: штучний, надуманий
> example: Das Ende wirkt etwas **konstruiert**. — Кінець здається дещо надуманим.
> note: у рецензії — критика: події підігнано під задум автора. u та i — окремі склади.

> [!word] klischeehaft
> ipa: /kliˈʃeːhaft/ · pos: adj · level: C2 · id: de-c2-genres-w12
> uk: шаблонний, банальний
> example: Die Bösewichte sind leider ziemlich **klischeehaft**. — Лиходії, на жаль, доволі шаблонні.
> note: від das Klischee. Синоніми: schablonenhaft, stereotyp.

> [!word] kitschig
> ipa: /ˈkɪtʃɪç/ · pos: adj · level: C1 · id: de-c2-genres-w13
> uk: кічовий, несмачно-солодкавий
> example: Die Liebesszene am Schluss ist mir zu **kitschig**. — Любовна сцена наприкінці, як на мене, надто солодкава.
> note: der Kitsch — німецьке слово, що пішло в інші мови. tsch — [tʃ].

### Лист до редакції й коментар

> [!word] die Redaktion
> ipa: /ʁedakˈtsi̯oːn/ · pos: noun · level: B1 · id: de-c2-genres-w14
> uk: редакція
> forms: die Redaktionen
> example: Die **Redaktion** behält sich vor, Leserbriefe zu kürzen. — Редакція залишає за собою право скорочувати листи читачів.
> note: der Redakteur, die Redakteurin — журналіст у штаті. Стандартна примітка під листами: Kürzungen vorbehalten.

> [!word] die Zuschrift
> ipa: /ˈtsuːʃʁɪft/ · pos: noun · level: C1 · id: de-c2-genres-w15
> uk: лист (читача), відгук
> forms: die Zuschriften
> example: Zu dem Artikel erreichten uns zahlreiche **Zuschriften**. — Щодо статті ми отримали чимало листів.
> note: книжно-офіційне; у газеті часто як заголовок рубрики. Синонім: der Leserbrief.

> [!word] der Gastbeitrag
> ipa: /ˈɡastbaɪ̯ˌtʁaːk/ · pos: noun · level: C1 · id: de-c2-genres-w16
> uk: колонка запрошеного автора
> forms: die Gastbeiträge
> example: In einem **Gastbeitrag** fordert die Ärztin mehr Personal. — У своїй колонці лікарка вимагає більше персоналу.
> note: автор не працює в редакції. Рід від der Beitrag; g у кінці — [k].

> [!word] der Meinungsbeitrag
> ipa: /ˈmaɪ̯nʊŋsbaɪ̯ˌtʁaːk/ · pos: noun · level: C1 · id: de-c2-genres-w17
> uk: публікація-думка, авторська колонка
> forms: die Meinungsbeiträge
> example: **Meinungsbeiträge** sind in der Zeitung klar gekennzeichnet. — Публікації-думки в газеті чітко позначено.
> note: загальна назва для Kommentar, Kolumne, Gastbeitrag. Протилежне: der Bericht.

> [!word] die Replik
> ipa: /ʁeˈpliːk/ · pos: noun · level: C2 · id: de-c2-genres-w18
> uk: відповідь (на статтю, виступ), репліка у полеміці
> forms: die Repliken
> example: Eine Woche später erschien eine scharfe **Replik** des Ministers. — Через тиждень зʼявилася гостра відповідь міністра.
> note: у публіцистиці — текст-відповідь на чужий текст. Синонім: die Entgegnung.

> [!word] der Aufhänger
> ipa: /ˈaʊ̯fhɛŋɐ/ · pos: noun · level: C2 · id: de-c2-genres-w19
> uk: привід (для статті); петелька, вішалка
> forms: die Aufhänger
> example: Als **Aufhänger** dient eine neue Studie. — Приводом для статті стало нове дослідження.
> note: буквально петелька, за яку вішають одяг. У журналістиці — подія, на яку «вішають» текст.

> [!word] der Vorspann
> ipa: /ˈfoːɐ̯ʃpan/ · pos: noun · level: C2 · id: de-c2-genres-w20
> uk: лід, вступний абзац під заголовком; титри на початку фільму
> forms: die Vorspanne
> example: Der **Vorspann** fasst die These in zwei Sätzen zusammen. — Лід підсумовує тезу у двох реченнях.
> note: англ. lead / teaser. У кіно — початкові титри (протилежне: der Abspann).

> [!word] die Zwischenüberschrift
> ipa: /ˈtsvɪʃn̩ʔyːbɐˌʃʁɪft/ · pos: noun · level: C1 · id: de-c2-genres-w21
> uk: підзаголовок (усередині тексту)
> forms: die Zwischenüberschriften
> example: **Zwischenüberschriften** erleichtern die Orientierung. — Підзаголовки полегшують орієнтацію в тексті.
> note: zwischen + die Überschrift. У рецензії для блогу — доречні, у листі до редакції — ні.

> [!word] der Gesichtspunkt
> ipa: /ɡəˈzɪçtsˌpʊŋkt/ · pos: noun · level: C1 · id: de-c2-genres-w22
> uk: аспект, точка зору
> forms: die Gesichtspunkte
> example: Unter ökologischen **Gesichtspunkten** ist die Maut sinnvoll. — З екологічного погляду плата за проїзд доцільна.
> note: unter diesem Gesichtspunkt — з цього погляду. Синонім: der Aspekt.

### Есей, книжка, ринок

> [!word] der Essayist
> ipa: /ɛseˈɪst/ · pos: noun · level: C2 · id: de-c2-genres-w23
> uk: есеїст
> forms: die Essayisten
> example: Als **Essayist** ist er bekannter denn als Romancier. — Як есеїста його знають краще, ніж як романіста.
> note: n-відміна. Жінка: die Essayistin. Прикметник essayistisch.

> [!word] der Denkanstoß
> ipa: /ˈdɛŋkʔanˌʃtoːs/ · pos: noun · level: C2 · id: de-c2-genres-w24
> uk: поштовх до роздумів
> forms: die Denkanstöße
> example: Der Essay liefert wichtige **Denkanstöße**. — Есей дає важливі поштовхи до роздумів.
> note: denken + der Anstoß. ß після довгого [oː]. Похвала для есею й коментаря.

> [!word] würdigen
> ipa: /ˈvʏʁdɪɡn̩/ · pos: verb · level: C1 · id: de-c2-genres-w25
> uk: належно оцінювати, віддавати належне
> forms: würdigen → würdigte → hat gewürdigt
> example: Die Rezension **würdigt** vor allem die Übersetzung. — Рецензія передусім віддає належне перекладу.
> note: kritisch würdigen — зважено оцінити (і плюси, і мінуси). Іменник die Würdigung.

> [!word] die Neuerscheinung
> ipa: /ˈnɔʏ̯ʔɛɐ̯ˌʃaɪ̯nʊŋ/ · pos: noun · level: C1 · id: de-c2-genres-w26
> uk: новинка, нове видання
> forms: die Neuerscheinungen
> example: Im Herbst stellen die Verlage ihre **Neuerscheinungen** vor. — Восени видавництва представляють свої новинки.
> note: neu + die Erscheinung (erscheinen — виходити друком). ʔ перед er-.

> [!word] der Debütroman
> ipa: /deˈbyːʁoˌmaːn/ · pos: noun · level: C2 · id: de-c2-genres-w27
> uk: дебютний роман
> forms: die Debütromane
> example: Ihr **Debütroman** stand auf der Shortlist. — Її дебютний роман потрапив до короткого списку.
> note: das Debüt + der Roman; рід від Roman. Наголос: De-büt.

> [!word] der Verlag
> ipa: /fɛɐ̯ˈlaːk/ · pos: noun · level: B1 · id: de-c2-genres-w28
> uk: видавництво
> forms: die Verlage
> example: Der Roman erscheint im Frühjahr in einem kleinen **Verlag**. — Роман виходить навесні в невеликому видавництві.
> note: g у кінці — [k]. Хто видає — der Verleger, die Verlegerin.

> [!word] die Buchpreisbindung
> ipa: /ˈbuːxpʁaɪ̯sˌbɪndʊŋ/ · pos: noun · level: C2 · id: de-c2-genres-w29
> uk: фіксована (обовʼязкова) ціна на книжки
> forms: — (без множини)
> example: Dank der **Buchpreisbindung** kostet ein neues Buch überall gleich viel. — Завдяки фіксованій ціні нова книжка всюди коштує однаково.
> note: у Німеччині — з 2002 року за законом (BuchPrG; до того — з 1888 як угода видавців, Sammelrevers); в Австрії — теж; у Швейцарії — немає.

## Слухаємо

> [!listen] Напиши або скажи, що почув
> level: C2 · type: dictation · id: de-c2-genres-l01
> audio: Wer Familienromane mag, dem sei dieses Buch wärmstens empfohlen.
> explain: *Wer …, dem …* — співвідносна конструкція (*wer* — Nominativ, *dem* — Dativ від *empfehlen*). *sei … empfohlen* — Konjunktiv I у Passiv: стала формула рекомендації.

## Вимова

> [!speak] Скажи вголос: оцінка книжки
> level: C2 · id: de-c2-genres-s01
> text: Der Spannungsbogen trägt, nur das Ende wirkt etwas konstruiert.
> ipa: /deːɐ̯ ˈʃpanʊŋsˌboːɡn̩ tʁɛːkt nuːɐ̯ das ˈɛndə vɪʁkt ˈɛtvas kɔnstʁuˈiːɐ̯t/
> tip: *trägt* — g перед t звучить [k]; *konstruiert* — чотири склади, наголос на -ier-.
> uk: Напруга тримається, лише кінець здається трохи надуманим.

## Типові помилки українців

> [!pitfall] Зміст у минулому часі
> Українською переказ сюжету часто ведуть у минулому часі («Еффі вийшла заміж…»). У німецькій рецензії й Inhaltsangabe — **Präsens**: *Effi heiratet …, zieht nach Kessin …* Те, що сталося **до** подій роману, ставимо в **Perfekt** (*Effi hat als Mädchen im Garten gespielt, bevor sie heiratet*). Präteritum лишай хіба що для історії створення книжки (*Fontane schrieb den Roman in den 1890er-Jahren*).

> [!pitfall] Лист до редакції як загальний твір
> Найчастіше втрачають бали, коли пишуть «есей на тему» й забувають, що це **лист**: без звертання, без посилання на статтю, з одним-двома твердженнями замість трьох. Перевір: є *Sehr geehrte …*, є назва статті, кожне з трьох тверджень названо й оцінено, є *Mit freundlichen Grüßen*.

> [!pitfall] Kritik — не лише «критика»
> *Die Kritik* у німецькій — це й **рецензія** (*eine Kritik in der Zeitung*), і **критики як група** (*Die Kritik feierte den Film*), і негативна оцінка. *Die Kritik war begeistert* — «критики були в захваті», а не суперечність. А «розкритикувати» в рецензії точніше: *verreißen*.

> [!pitfall] Рецензія = переказ
> Шкільна звичка — переказати книжку від початку до кінця й додати «мені сподобалось». На C2 переказ — щонайбільше третина; решта — аналіз з прикладами (*Die Figurenzeichnung überzeugt, weil …*) і рекомендація конкретній аудиторії. І не розкривай фінал без потреби — для блогу це вважають неввічливим щодо читачів.

## Ситуація: літературна передача на радіо

> [!listen] Двоє критиків обговорюють новий роман. У чому вони розходяться?
> level: C2 · type: answer · id: de-c2-genres-l02
> audio: A: Ich habe das Buch verschlungen. Die Erzählweise ist lakonisch, aber nie kalt.
> audio: B: Die Sprache ist stark, keine Frage. Aber ab der Mitte trägt der Spannungsbogen nicht mehr.
> audio: A: Das sehe ich anders. Gerade die ruhigen Kapitel machen das Ende so stark.
> - [x] Обоє хвалять мову, але B вважає, що з середини напруга провисає, а A — що спокійні розділи якраз посилюють фінал.
> - [ ] Обоє вважають роман невдалим.
> - [ ] A критикує мову, а B її хвалить.
> - [ ] B вважає фінал найслабшим місцем, і A з цим погоджується.
>
> **Пояснення:** згода — *Die Sprache ist stark, keine Frage*; незгода — *ab der Mitte trägt der Spannungsbogen nicht mehr* проти *Gerade die ruhigen Kapitel machen das Ende so stark*. Переклад: — Я проковтнула цю книжку. Оповідь лаконічна, але ніколи не холодна. — Мова сильна, безперечно. Але з середини напруга вже не тримається. — Я бачу це інакше. Саме спокійні розділи роблять фінал таким сильним.

> [!speak] Ситуація: заперечи ввічливо, але твердо
> level: C2 · id: de-c2-genres-s02
> text: Diese Darstellung greift meines Erachtens zu kurz.
> ipa: /ˈdiːzə ˈdaːɐ̯ʃtɛlʊŋ ɡʁaɪ̯ft ˈmaɪ̯nəs ɛɐ̯ˈʔaxtn̩s tsuː kʊʁts/
> tip: *meines Erachtens* — наголос на -ach-, ch після a — [x]; *Darstellung* — наголос на першому складі.
> uk: Як на мене, такий виклад надто спрощений.

## Landeskunde: Ein Preis für jedes Buch

> [!example] Ein Preis für jedes Buch
> Wer in Deutschland einen neuen Roman kauft, zahlt dafür überall denselben Preis: in der kleinen Buchhandlung auf dem Land, im großen Kaufhaus in der Innenstadt und beim Versandhändler im Internet. Rabattschlachten wie bei Fernsehern oder Turnschuhen gibt es bei neuen Büchern nicht. Grund dafür ist das Buchpreisbindungsgesetz vom 2. September 2002. Nach § 5 muss der Verlag für jedes Buch einen Endpreis festsetzen und veröffentlichen, und wer Bücher gewerbsmäßig an Kundinnen und Kunden in Deutschland verkauft, muss sich nach § 3 an diesen Preis halten.
>
> Das Gesetz nennt seinen Zweck ausdrücklich. Es dient „dem Schutz des Kulturgutes Buch“: Feste Preise sollen ein breites Angebot sichern und dafür sorgen, dass es viele Verkaufsstellen gibt. Die Idee dahinter ist einfach. Wenn große Händler Bestseller nicht billiger anbieten dürfen, können auch kleine Buchhandlungen überleben, die mit ihrer Beratung, ihren Lesungen und ihrem Sortiment jenseits der Bestsellerlisten das kulturelle Leben einer Stadt prägen. Die Regel gilt übrigens auch für E-Books. Ausgenommen sind dagegen gebrauchte Bücher, und nach 18 Monaten darf ein Verlag die Preisbindung für eine Ausgabe aufheben.
>
> Umstritten ist das Modell trotzdem. Kritiker halten feste Preise für einen Eingriff in den Wettbewerb, der vor allem den Verlagen nütze und die Leserinnen und Leser Geld koste. Die Nachbarländer haben sich unterschiedlich entschieden: Österreich kennt ebenfalls eine gesetzliche Buchpreisbindung, in der Schweiz dagegen sind die Preise frei. Dort fiel die Preisbindung 2007, und ein Gesetz zu ihrer Wiedereinführung lehnten die Stimmberechtigten im März 2012 in einer Volksabstimmung ab. Befürworter verweisen darauf, dass es in Deutschland bis heute ein dichtes Netz von Buchhandlungen gibt, auch in kleineren Städten. Gegner halten dagegen, dass sich der Handel ohnehin ins Internet verlagere und feste Preise daran wenig änderten. Wer einen Leserbrief zu diesem Thema schreibt, findet also auf beiden Seiten ernst zu nehmende Argumente – eine gute Voraussetzung für einen abgewogenen Text.
>
> Besonders sichtbar wird der Buchmarkt jedes Jahr im Herbst. Zum Auftakt der Frankfurter Buchmesse vergibt die Stiftung Buchkultur und Leseförderung des Börsenvereins des Deutschen Buchhandels den Deutschen Buchpreis für den deutschsprachigen „Roman des Jahres“. Den Preis gibt es seit 2005. Verlage reichen ihre Titel selbst ein, eine siebenköpfige Jury, die jedes Jahr wechselt, wählt zunächst eine Longlist und später eine Shortlist aus. Schon die Nominierung kann einem Buch viele neue Leserinnen und Leser bringen.
>
> Für Rezensentinnen und Rezensenten ist diese Zeit die Hochsaison. Feuilletons, Blogs und Literatursendungen besprechen die nominierten Titel, oft mit sehr unterschiedlichen Urteilen. Wer selbst eine Rezension schreibt, steht damit in einer langen Tradition: Er hilft anderen bei der Entscheidung, welches der vielen neuen Bücher ihre Zeit und ihr Geld wert ist. Eine gute Rezension verrät deshalb nicht nur, ob ihr Verfasser ein Buch mochte. Sie zeigt, warum: an der Sprache, an den Figuren, an einer einzelnen Szene. Erst diese Begründung macht aus einer bloßen Meinung ein Urteil, mit dem andere etwas anfangen können, auch wenn sie am Ende zu einem anderen Ergebnis kommen.

> [!quiz] Nach dem Text: Für welches Buch gilt die Buchpreisbindung in Deutschland NICHT?
> level: C2 · type: single · id: de-c2-genres-q02
> - [ ] für einen neuen Roman im Kaufhaus
> - [ ] für ein neues E-Book im Internet
> - [x] für einen gebrauchten Roman auf dem Flohmarkt
> - [ ] für einen neuen Bestseller in einer kleinen Buchhandlung
>
> **Пояснення:** *Die Regel gilt übrigens auch für E-Books. Ausgenommen sind dagegen gebrauchte Bücher.* Місце продажу (універмаг, інтернет, мала книгарня) значення не має.

> [!quiz] Nach dem Text: Welche Ziele nennt das Gesetz? Wähle alle richtigen Antworten.
> level: C2 · type: multi · id: de-c2-genres-q03
> - [x] das Kulturgut Buch schützen
> - [x] ein breites Angebot an Büchern sichern
> - [x] viele Verkaufsstellen erhalten
> - [ ] Bücher für alle möglichst billig machen
>
> **Пояснення:** *Es dient „dem Schutz des Kulturgutes Buch“: Feste Preise sollen ein breites Angebot sichern und dafür sorgen, dass es viele Verkaufsstellen gibt.* Дешевизна — навпаки, аргумент критиків закону.

> [!quiz] Nach dem Text: Was stimmt über den Deutschen Buchpreis?
> level: C2 · type: single · id: de-c2-genres-q04
> - [ ] Ihn vergibt der Staat für das beste Sachbuch des Jahres.
> - [x] Er zeichnet einen deutschsprachigen Roman aus; eine jährlich wechselnde Jury wählt erst eine Longlist, dann eine Shortlist.
> - [ ] Nur Schweizer und österreichische Autoren dürfen teilnehmen.
> - [ ] Die Jury sucht die Bücher selbst aus, Verlage dürfen nichts einreichen.
>
> **Пояснення:** премію вручає фонд Börsenverein, а не держава; це *„Roman des Jahres“*, а не нонфікшн; *Verlage reichen ihre Titel selbst ein*; журі з 7 осіб щороку інше.

## Практика

> [!quiz] Що правда про GDS Schreiben Teil 2? Обери всі.
> level: C2 · type: multi · id: de-c2-genres-q05
> - [x] Треба обрати одну з чотирьох тем.
> - [x] Рецензію можна писати лише на роман зі списку поточного року.
> - [x] У листі до редакції треба послатися на всі три наведені твердження.
> - [ ] Текст має бути щонайменше 600 слів.
> - [ ] Літературна тема обовʼязкова для всіх.
>
> **Пояснення:** 4 теми (2 вільні, 2 літературні), ≈ 350 слів, 60 хв. Літературні теми — за бажанням, і лише якщо ти прочитав книжку зі списку на рік іспиту.

> [!quiz] Яке речення підходить для переказу змісту в рецензії?
> level: C2 · type: single · id: de-c2-genres-q06
> - [ ] Effi heiratete mit 17 Jahren den Baron von Innstetten.
> - [x] Mit 17 Jahren heiratet Effi den deutlich älteren Baron von Innstetten.
> - [ ] Ich finde es schrecklich, dass Effi mit 17 Jahren heiraten musste.
> - [ ] Effi wird mit 17 Jahren geheiratet haben.
>
> **Пояснення:** переказ — у **Präsens** і без власних емоцій (їм місце в оцінці). Präteritum — звичка з української; *wird … geheiratet haben* — Futur II зі значенням припущення, тут недоречний.

> [!quiz] Розстав частини листа до редакції в правильному порядку
> level: C2 · type: order · id: de-c2-genres-q07
>
> ```text order
> Sehr geehrte Damen und Herren,
> mit großem Interesse habe ich Ihren Artikel „Wer zahlt für die Stadt?“ gelesen.
> Die Aussage, Pendler würden am stärksten belastet, halte ich für zutreffend.
> Unterm Strich wünsche ich mir eine sachlichere Debatte.
> Mit freundlichen Grüßen
> ```
>
> **Пояснення:** звертання → посилання на статтю → позиція щодо твердження → висновок-побажання → прощання. Між позицією й висновком у справжньому листі стоять ще два твердження з прикладами.

> [!quiz] Заповни пропуски: Redemittel рецензії
> level: C2 · type: fill · id: de-c2-genres-q08 · bank: empfehlen, verreißen, gelesen
>
> ```text fill
> Wer Familienromane mag, dem sei dieses Buch wärmstens [[empfohlen]].
> Das Ende wirkt leider etwas [[konstruiert]].
> Die Kritikerin hat den Roman regelrecht [[verrissen]].
> ```
>
> **Пояснення:** *dem sei … empfohlen* — Konjunktiv I Passiv, потрібен дієприкметник (*empfohlen*, не інфінітив). *konstruiert* — надуманий. Perfekt *hat … verrissen* (інфінітив *verreißen* тут неможливий). *gelesen* не пасує за змістом жодного рядка.

> [!quiz] Яке речення типове для коментаря, а не для новини?
> level: C2 · type: single · id: de-c2-genres-q09
> - [ ] Der Stadtrat hat am Dienstag eine Citymaut von fünf Euro beschlossen.
> - [ ] Die Maut gilt ab dem 1. März werktags von 7 bis 19 Uhr.
> - [x] Mit dieser Maut bestraft die Stadt ausgerechnet jene, die keine Alternative zum Auto haben.
> - [ ] Laut Verwaltung sollen die Einnahmen in den Nahverkehr fließen.
>
> **Пояснення:** коментар оцінює (*bestraft … ausgerechnet jene*). Решта — факти й чужі слова (*laut Verwaltung*) — матеріал новини.

> [!quiz] Завдання: лист до редакції з трьома твердженнями. Кандидатка детально розібрала два, а третє не згадала. Що станеться?
> level: C2 · type: single · id: de-c2-genres-q10
> - [ ] Нічого: головне — мовна правильність.
> - [x] Вона втратить бали за виконання завдання, бо не опрацювала всі аспекти.
> - [ ] Текст не оцінюватимуть узагалі.
> - [ ] Вона отримає додаткові бали за глибину аналізу.
>
> **Пояснення:** перше питання оцінювача — *Haben Sie alle Aspekte der Aufgabenstellung bearbeitet?* Пропущене твердження знижує бали за змістом навіть за бездоганної мови; текст при цьому оцінюють.

> [!quiz] Що робить заголовок і лід коментаря сильними? Обери всі.
> level: C2 · type: multi · id: de-c2-genres-q11
> - [x] заголовок короткий і вже натякає на позицію
> - [x] лід у 1–2 реченнях називає тему і напрям думки
> - [x] на початку є актуальний привід (подія, цифра, цитата)
> - [ ] заголовок — повне речення з усіма фактами
> - [ ] лід починається словами «У цьому коментарі я хочу…»
>
> **Пояснення:** *Überschrift* — стисла, часто оцінна; *Vorspann* — тема + напрям; *Aufhänger* — актуальний привід. Довгий «інформаційний» заголовок і метатекст («я хочу написати») послаблюють текст.

> [!quiz] Склади речення: «Рідко якийсь роман так мене захоплював, як цей.»
> level: C2 · type: order · id: de-c2-genres-q12
>
> ```text order
> Selten
> hat mich
> ein Roman
> so gefesselt
> wie dieser.
> ich hat ✗
> ```
>
> **Пояснення:** *Selten* на першому місці → дієслово *hat* одразу після нього (V2). Займенник *mich* (Akkusativ) стоїть перед підметом *ein Roman* — так у німецькій звичайно ставлять ненаголошені займенники. *wie dieser* — порівняння без коми.

> [!quiz] Чим есей відрізняється від Erörterung?
> level: C2 · type: single · id: de-c2-genres-q13
> - [ ] Есей завжди коротший за 200 слів.
> - [x] Есей міркує й може лишити питання відкритим; Erörterung систематично зважує аргументи й доходить висновку.
> - [ ] В есеї заборонено писати від першої особи.
> - [ ] Erörterung — художній жанр, а есей — науковий.
>
> **Пояснення:** Erörterung (C1-19) — «за» і «проти» за чіткою схемою з висновком. Есей — рух думки: особисте *Ich*, відступи, парадокс, відкритий фінал.

> [!quiz] Заповни пропуски: лист до редакції
> level: C2 · type: fill · id: de-c2-genres-q14 · bank: lesen, bezogen, zugestimmt
>
> ```text fill
> Mit großem Interesse habe ich Ihren Artikel [[gelesen]].
> Ich möchte mich auf die Aussage [[beziehen]], dass Pendler am stärksten belastet werden.
> Dem kann ich allerdings nur zum Teil [[zustimmen]].
> ```
>
> **Пояснення:** *habe … gelesen* — Perfekt; *möchte … beziehen* і *kann … zustimmen* — модальне дієслово + інфінітив. Дистрактори — ті самі дієслова в хибній формі: *lesen* після *habe*, *bezogen* і *zugestimmt* після модального дієслова.

> [!quiz] Яке формулювання незгоди найкраще пасує до листа до редакції?
> level: C2 · type: single · id: de-c2-genres-q15
> - [ ] Ihr Autor hat ja wohl keine Ahnung.
> - [x] Hier wird ein komplexes Problem meines Erachtens unzulässig vereinfacht.
> - [ ] Das ist doch totaler Quatsch.
> - [ ] Ich stimme nicht zu.
>
> **Пояснення:** друге — тверда, але ввічлива й обґрунтована критика. Перше й третє — образа й розмовний регістр. Четверте — коректне, але порожнє: без пояснення, з чим саме й чому.

## Фішки

> [!reel] 📺 Літературний квартет
> У 1988–2001 роках на ZDF виходила передача «Das Literarische Quartett»: четверо критиків на чолі з Марселем Райх-Раніцьким сперечалися про нові книжки. Похвала в студії могла зробити роман бестселером, а розгромна оцінка — зупинити продажі. З 2015 року передачу відновили в новому складі.

> [!reel] 📖 Klappentext
> *Die Klappe* — клапан суперобкладинки, який загинається всередину. Текст на ньому пише не критик, а видавництво, і його мета — продати книжку. Тому в рецензії *Der Klappentext verspricht …* часто звучить як перша обережна критика: обіцяли одне, а отримали інше.

> [!reel] ✂️ Verriss
> *Verreißen* буквально — «розірвати». Так, ймовірно, почали називати нищівну рецензію, після якої від книжки «лишаються клапті». Протилежний полюс — *die Lobeshymne*, «хвалебна пісня». Добра рецензія C2 зазвичай між ними: *kritisch würdigen*.

## Джерела та що почитати

- [Goethe-Institut — Modellsatz Goethe-Zertifikat C2: GDS (PDF)](https://www.goethe.de/pro/relaunch/prf/materialien/C2/c2_modellsatz.pdf): Schreiben Teil 2, чотири теми й критерії оцінювання.
- [Goethe-Institut — Literaturliste C2 (PDF)](https://www.goethe.de/pro/relaunch/prf/Literaturliste_C2/Goethe_Zertifikat_C2_Literaturliste.pdf): романи для літературних тем на 2026 і 2027 роки.
- [Goethe-Institut — Durchführungsbestimmungen C2 (PDF)](https://www.goethe.de/pro/relaunch/prf/de/Durchfuehrungsbestimmungen_C2_neu.pdf): вибір теми й бали за Teil 2.
- [Gesetze im Internet — Buchpreisbindungsgesetz, § 1](https://www.gesetze-im-internet.de/buchprg/__1.html), [§ 3](https://www.gesetze-im-internet.de/buchprg/__3.html), [§ 8](https://www.gesetze-im-internet.de/buchprg/__8.html): мета закону, обовʼязок фіксованої ціни, 18 місяців.
- [Deutscher Buchpreis — Der Preis](https://www.deutscher-buchpreis.de/der-preis/): хто вручає, журі, Longlist і Shortlist.
- [Wikipedia — Buchpreisbindung](https://de.wikipedia.org/wiki/Buchpreisbindung): Австрія, Швейцарія, референдум 2012 року.
- [Wikipedia — Das Literarische Quartett](https://de.wikipedia.org/wiki/Das_Literarische_Quartett): історія передачі.
- [Projekt Gutenberg — Theodor Fontane, «Effi Briest»](https://www.gutenberg.org/ebooks/5323): текст роману для власної рецензії.

> [!important] Підсумок
> - **GDS Schreiben Teil 2:** 1 тема з 4, ≈ 350 слів, 60 хв; лист до редакції — **усі три** твердження; рецензія — лише на роман зі **списку поточного року**.
> - **Рецензія:** заголовок → вступ-зачіпка → паспорт книжки → короткий зміст **у Präsens** → аналіз з прикладами → оцінка → рекомендація (*dem sei … empfohlen*).
> - **Лист до редакції:** звертання, посилання на статтю, позиція щодо кожного твердження з прикладом, висновок, *Mit freundlichen Grüßen*; тон — ввічливо-критичний.
> - **Коментар:** привід (*Aufhänger*), лід (*Vorspann*), чітка оцінка, загострений фінал. **Есей:** рух думки, відступи, відкритий кінець.
> - *Die Kritik* — і рецензія, і критики, і негативна оцінка; *verreißen* ↔ *Lobeshymnen singen*; між ними — *kritisch würdigen*.
