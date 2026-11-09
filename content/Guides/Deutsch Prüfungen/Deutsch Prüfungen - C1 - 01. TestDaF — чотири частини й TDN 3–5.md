---
title: TestDaF — чотири частини й TDN 3–5
id: dp-c1-01
level: C1
icon: px:check
tags: [deutsch, exam, skills, c1, testdaf]
prerequisites: ["[[Deutsch - C1 - 21. Читання — складні тексти, аргументація, підтекст]]", "[[Deutsch - C1 - 12. Аудіювання — лекції, дебати, подкасти]]", "[[Deutsch - C1 - 22. Говоріння — презентація, дискусія, модерація]]"]
estimatedMinutes: 55
---

# TestDaF — чотири частини й TDN 3–5

> [!success] Після цієї теми ти зможеш
> - пояснити, як цифровий TestDaF перетворює відповіді на **0–20 балів** у кожній частині і чому вирішує **найслабша** з чотирьох;
> - знати порядок і правила дня іспиту: Lesen → Hören → Schreiben → Sprechen, **назад повернутися не можна**, на столі лише посвідчення;
> - обрати стратегію для кожного з 7 типів завдань у Lesen і Hören, а не лише впізнати формат;
> - виконати мовні дії усної частини (*Rat geben, Optionen abwägen, Maßnahmen kritisieren*) готовими зворотами;
> - перевірити, який результат потрібен саме твоєму вишу й коли прийдуть бали.

## Передбач

> [!quiz] Університет пише: «Sprachnachweis: TestDaF mit TDN 4 × 4». Що це означає?
> level: C1 · type: single · id: dp-c1-01-q01
> - [x] щонайменше TDN 4 у кожній із чотирьох частин
> - [ ] у середньому TDN 4 за чотири частини
> - [ ] TDN 4 у будь-яких двох частинах із чотирьох
> - [ ] сума 40 балів з 80 можливих
>
> **Пояснення:** «4 × 4» — це чотири частини, і в кожній щонайменше TDN 4. Саме так сформульовано в рамковому положенні RO-DT (§ 4 (4)): TestDaF, складений **в усіх частинах** щонайменше на TDN 4, є доказом мовної готовності до будь-якої програми, але з урахуванням § 1 (3)–(5): виш може вимагати менше або більше по окремих частинах. Середнє чи сума тут не рятують: одна частина на TDN 3 означає, що вимогу не виконано.

## Пояснення

Цифровий TestDaF ти вже бачив у темах рівня: які завдання є в Lesen ([[Deutsch - C1 - 21. Читання — складні тексти, аргументація, підтекст]]), Hören ([[Deutsch - C1 - 12. Аудіювання — лекції, дебати, подкасти]]), Schreiben ([[Deutsch - C1 - 19. Письмо — Erörterung, Stellungnahme, опис графіка]]) і Sprechen ([[Deutsch - C1 - 22. Говоріння — презентація, дискусія, модерація]]). Тут ідемо глибше: **як рахують бали, що можна і чого не можна в день іспиту і як працювати з кожним типом завдання**. Усі дані — станом на листопад 2026 за сайтом testdaf.de і рамковим положенням RO-DT (редакція HRK від 04.11.2025, KMK від 27.11.2025).

### Іспит в одному абзаці

TestDaF (*Test Deutsch als Fremdsprache*) розробляє й оцінює **TestDaF-Institut** у Бохумі (установа товариства g.a.s.t.); складають його в ліцензованих **тестових центрах** — за даними testdaf.de, їх понад 500 у близько 100 країнах. Цифрова версія проходить **на компʼютері в тестовому центрі**, не вдома. Чотири частини йдуть у **сталому порядку**, і в межах частини назад повернутися не можна:

| Частина | Завдання | Items | Час (орієнтовно) | Як відповідаєш |
|---|---|---|---|---|
| Lesen | 7 | 34 | ≈ 55 хв | клік / перетягування |
| Hören | 7 | 30 | ≈ 40 хв | клік + короткі відповіді з клавіатури |
| Schreiben | 2 | — | ≈ 60 хв | друкуєш текст у полі |
| Sprechen | 7 | — | ≈ 35 хв | говориш у **гарнітуру**, запис іде автоматично |

Чистого часу виходить понад три години, плюс паузи. Зірочка на testdaf.de чесно попереджає: час і кількість завдань **можуть різнитися**, бо кожен учасник ще й виконує **пробні завдання** (*Erprobungsaufgaben*), які не рахуються. Тому тобі може трапитися два завдання одного типу. Яке з них пробне, ти не знаєш, тож обидва роби на повну.

### Шкала: від відповідей до TDN

Кожну частину оцінюють **окремо**. Сирі результати переводять на єдину шкалу **0–20 балів** — так бали можна порівнювати між частинами й між різними варіантами тесту. Потім бали перетворюються на рівень:

| Бали в частині | Рівень на сертифікаті |
|---|---|
| 0–4 | unter TDN 3 |
| 5–9 | TDN 3 |
| 10–15 | TDN 4 |
| 16–20 | TDN 5 |

На сертифікаті цифрового TestDaF стоять і TDN, і бали кожної частини, і **загальна сума 0–80**. Але приймальна комісія дивиться передусім на TDN по частинах. Сума 70 з 80 не допоможе, якщо в одній частині 9 балів: це TDN 3.

> [!diagram] Як народжується результат TestDaF
> ```yaml
> layout: flow
> nodes:
>   - { id: raw, label: "відповіді", text: "Lesen · Hören", note: "автоматично; короткі відповіді в Hören оцінюють люди", tone: yellow }
>   - { id: rate, label: "оцінювачі", text: "Schreiben · Sprechen", note: "за критеріями, централізовано", tone: pink }
>   - { id: scale, label: "шкала", text: "0–20 балів", note: "окремо для кожної частини", tone: gray }
>   - { id: tdn, label: "рівень", text: "TDN 3 · 4 · 5", note: "5–9 · 10–15 · 16–20", tone: yellow }
>   - { id: uni, label: "виш", text: "найслабша частина", note: "TDN 4 × 4 — стандарт RO-DT", tone: gray }
> edges:
>   - { from: raw, to: scale, label: "кількість правильних" }
>   - { from: rate, to: scale, label: "оцінка" }
>   - { from: scale, to: tdn }
>   - { from: tdn, to: uni }
> steps:
>   - { focus: raw, note: "У Lesen і Hören рахують правильні відповіді. Короткі відповіді, які ти друкуєш у Hören, спершу перевіряють навчені оцінювачі TestDaF-Institut." }
>   - { focus: rate, note: "Тексти й аудіозаписи оцінюють спеціально навчені люди: чи відповідає текст темі, чи враховано всі пункти завдання, чи своїми словами передано джерела, наскільки різноманітні граматика й лексика." }
>   - { move: { from: raw, to: scale, value: "Lesen: 13" }, note: "Усе переводять на одну шкалу 0–20. Так 13 балів у Lesen і 13 у Sprechen означають однаковий рівень." }
>   - { move: { from: scale, to: tdn, value: "13 → TDN 4" }, note: "Межі: 5–9 — TDN 3, 10–15 — TDN 4, 16–20 — TDN 5, нижче 5 — unter TDN 3." }
>   - { move: { from: tdn, to: uni, value: "4 · 4 · 3 · 5" }, note: "Виш дивиться на кожну частину. Якщо одна частина — TDN 3, вимогу «TDN 4 × 4» не виконано, хоч у сумі балів багато." }
> ```
> Жовті й рожеві блоки — етапи оцінювання, сірі — результат. Межі балів — за сторінкою «Auswertung» на testdaf.de.

Що з цього випливає для підготовки:

- **TDN 4 — широкий коридор** (10–15 балів). Мета — не «ледь 10», а запас: тоді погана хвилина в одному завданні не зіпхне тебе в TDN 3.
- **Тягни найслабшу навичку.** Для українців це часто Schreiben (кальки, порядок слів) або Sprechen (паузи). Додатковий бал у сильному Lesen нічого не дасть, якщо Schreiben лишається на 9.
- **Вимоги бувають різні.** RO-DT дозволяє вишам встановлювати диференційовані вимоги. На testdaf.de наводять приклад: для інформатики чи інженерії в Schreiben може вистачити TDN 3, а для перекладознавства потрібен TDN 5. Дивись сторінку свого вишу, а не форуми.
- **TDN 5** у всіх частинах означає «особливо високі знання». За RO-DT цей рівень **вищий**, ніж потрібно для вступу.

### Lesen: 7 завдань і стратегія до кожного

| Тип (*Aufgabentyp*) | Items | Що насправді перевіряють | Що робити |
|---|---|---|---|
| *Lückentext ergänzen* | 5 | словниковий запас у контексті | читай речення до й **після** пропуску; перевір рід, відмінок, колокацію (*Kritik üben*, не ~~machen~~) |
| *Textabschnitte ordnen* | 4 | звʼязність | шукай «гачки»: *dieser, jedoch, Letzteres, dabei* відсилають назад — тема [[Deutsch - C1 - 08. Звʼязність тексту — конектори, відсилання, wobei]] |
| *Multiple-Choice* | 7 | головне й деталі | спершу питання, потім текст; варіант, що дослівно повторює слова тексту, часто пастка |
| *Sprachhandlungen zuordnen* | 4 | що автор **робить** | називай дію, а не зміст: *einräumen, kritisieren, vergleichen, begründen* |
| *Aussagen Kategorien zuordnen* | 7 | розрізнення позицій | спершу запиши собі, чим категорії відрізняються, а потім розподіляй твердження |
| *Aussagen einem Begriffspaar zuordnen* | 4 | протиставлення | пара на кшталт «перевага / недолік» або «причина / наслідок»: шукай сигнали *zwar … aber, folglich* |
| *Fehler in Zusammenfassung erkennen* | 3 | точність | порівнюй кожне речення резюме з текстом: «усі» ≠ «більшість», «спричинило» ≠ «збіглося» |

Тексти — звіти про дослідження й проєкти, коментарі, описові й аргументативні тексти, часто з графіком. Фахових знань не потрібно, а от **широкий словниковий запас** потрібен (testdaf.de прямо пояснює так перше завдання з пропусками).

### Hören: 7 завдань, аудіо й відео

| Тип | Медіа | Items | Що робити |
|---|---|---|---|
| *Kurzantwort: Übersicht ergänzen* | аудіо | 5 | друкуй **ключове слово**, а не речення, не більше 2 слів на поле; орфографія має бути впізнаваною |
| *Kurzantwort: Textstellen zu Begriffspaar notieren* | аудіо | 4 | зроби на папері дві колонки за парою понять і пиши туди одразу |
| *Fehler in Zusammenfassung erkennen* | аудіо | 2 | резюме прочитай до прослуховування й познач «підозрілі» слова |
| *Aussagen Personen zuordnen* | відео | 6 | запамʼятай голоси й імена в перші секунди; хто з ким погоджується |
| *Kurzantwort: Gliederungspunkte zu Vortrag ergänzen* | відео | 4 | лектор сам дає план (*zuerst, dann, zum Schluss*) — лови ці слова |
| *Multiple-Choice* | аудіо | 5 | правильний варіант зазвичай **перефразує** почуте |
| *Laut- und Schriftbild abgleichen* | аудіо | 4 | знайди в надрукованому тексті слова, яких **не було** в аудіо |

Останнє завдання для українців підступне: слух «добудовує» дрібні слова (*deutlich, bereits, fremde*), і здається, що вони звучали. Тренуйся на диктантах (`[!listen] dictation`) і порівнюй з текстом слово за словом. Кожен фрагмент прозвучить лише раз: у демоверсії прямо сказано «Sie hören jeden Text einmal» (testdaf.de, паперовий TestDaF мав текст 3 двічі), а повернутися до попереднього завдання не можна. Тренуйся так само (див. [[Deutsch - C1 - 12. Аудіювання — лекції, дебати, подкасти]]).

### Schreiben: два тексти без права повернутися

| Тип | Обсяг | На що дивляться оцінювачі |
|---|---|---|
| *Argumentativen Text schreiben* | **щонайменше 200 слів** | тема, усі пункти завдання, аргументація, структура |
| *Informationen aus Lesetext und Grafik zusammenfassen* | ≈ 100–150 слів | **своїми словами**, коректно щодо питання; збіги й розбіжності тексту та графіка |

Офіційні критерії (сторінка «Auswertung»): чи текст стосується теми; чи враховано **всі пункти** завдання; чи виконано потрібну дію (аргументувати / узагальнити); чи передано джерела **коректно й своїми словами**; чи точно й доречно сформульовано, чи **різноманітні** граматика й лексика; чи зрозумілий текст попри помилки. Переписати речення з тексту дослівно — найшвидший спосіб втратити бали за «своїми словами».

> [!tip] Друк — теж навичка
> Ти друкуєш на компʼютері тестового центру. Заздалегідь потренуйся швидко набирати **ä, ö, ü, ß** і дізнайся в центрі, яка там розкладка (у німецькій QWERTZ місцями помінялися y і z). Заміна *ae, oe, ue* замість умлаутів — запасний варіант, а не стратегія.

### Sprechen: сім ситуацій, сім мовних дій

| Тип і мовна дія | Ситуація | Говориш |
|---|---|---|
| *Rat geben* | приватна (кафетерій, їдальня) | 0:45 |
| *Optionen abwägen* | — | 1:30 |
| *Text zusammenfassen* | студентська робоча група | 2:00 |
| *Informationen abgleichen, Stellung nehmen* | фахова розмова на семінарі | 1:30 |
| *Thema präsentieren* | туторіум, підготовчий курс | 2:30 |
| *Argumente wiedergeben, Stellung nehmen* | семінар / дискусія у виші | 2:00 |
| *Maßnahmen kritisieren* | інформаційний захід міста чи адміністрації вишу | 1:30 |

Разом — близько 12 хвилин власного мовлення. Завдання ти чуєш у гарнітурі й водночас читаєш на екрані. Потім маєш фіксований час на підготовку, чуєш уявного співрозмовника — і починається запис. Три правила:

1. **Назви дію вголос.** *Ich würde dir raten…*, *Wenn man beide Optionen vergleicht…*, *Ich halte diese Maßnahme für…* Оцінювач перевіряє, чи ти виконав **саме цю** мовну дію (*Sprechhandlung*).
2. **Не мовчи.** Пауза на записі — це втрачений час, і запис не «зачекає». Тримай напоготові зворот-«місток»: *Lassen Sie mich das an einem Beispiel verdeutlichen.*
3. **Регістр за ситуацією.** У кафетерії до подруги — *du*; на інформаційному заході міста — *Sie* і формальні звороти.

### День іспиту: правила, на яких зрізаються

Правила (*Regeln für den Prüfungstag*, g.a.s.t., редакція грудня 2025) ти приймаєш під час реєстрації. Найважливіше:

- **Документ** — оригінал посвідчення або паспорта, **той самий**, що й під час онлайн-реєстрації. Отримав новий паспорт — онови дані в *Teilnehmerportal*.
- **Запізнення:** якщо прийшов після початку вступного інструктажу, тебе вже не допустять.
- **На столі — лише документ.** Папір для нотаток дає наглядач, ручку приносиш свою. Заборонено мати при собі телефон, будь-який **наручний годинник** (зокрема смарт), фітнес-браслет, навушники-вкладиші.
- Задзвонив телефон — **виключення** з іспиту. Те саме за спробу списати, навіть у паузі.
- Будівлю під час іспиту залишати не можна, навіть до кафетерію. Їжу купи заздалегідь.
- Зміст завдань не можна виносити, обговорювати з іншими чи публікувати в соцмережах.

### Після іспиту

- **Результат** цифрового TestDaF — приблизно за **3 тижні** (паперового — близько 6). До дати, вказаної в таблиці термінів, інформації немає. Тож дату іспиту обирай під **дедлайн подачі документів** у виші.
- Скласти TestDaF можна **скільки завгодно разів**, але завжди **всі чотири частини** в один день: «перездати лише Schreiben» не можна. Але після повторного складання можна замовити **комбінований сертифікат** із найкращих результатів по частинах (з 12.05.2026; цифрові спроби за ≤ 6 міс., 29 €, визнання — на розсуд вишу).
- Перевірку оцінювання можна письмово попросити протягом **4 тижнів** після оголошення результатів (за це можуть узяти адміністративний збір). Перевірка коштує 40 € за одну частину, 15 € за кожну наступну, 85 € за всі чотири; якщо результат зміниться, гроші повертають. Сертифікат TestDaF чинний без обмеження строку, але деякі виші хочуть свіжий.
- **Допоміжних засобів немає** в жодній частині: ні словника, ні власних нотаток. Саме цим TestDaF відрізняється від DSH (див. [[Deutsch Prüfungen - C1 - 02. DSH — Hörverstehen, Leseverstehen, наукові структури]]).
- Ціну встановлює g.a.s.t.: станом на 2026 у Німеччині цифровий TestDaF — 210 € (паперовий 215 €), в інших країнах — за ціновою групою (напр. Каїр 155 €); актуальну суму дивись під час реєстрації. Повернення коштів можливе лише за відмови **до** кінця реєстраційного строку.

## Приклади

- *Die vier **Teilprüfungen** werden getrennt ausgewertet.* — Чотири частини оцінюють окремо.
- *Mit **TDN 4** in allen Teilen ist die **Zulassung** zu allen Studiengängen möglich.* — З TDN 4 в усіх частинах можна вступити на будь-яку програму.
- *Man kann nicht zur vorherigen Aufgabe zurückkehren.* — Повернутися до попереднього завдання не можна.
- *Notieren Sie Ihre **Kurzantwort** in Stichworten.* — Запишіть коротку відповідь ключовими словами.
- *Vergleichen Sie den gesprochenen Text mit dem Schriftbild.* — Порівняйте почутий текст із надрукованим.
- *Fassen Sie die Informationen aus Text und Grafik mit eigenen Worten zusammen.* — Узагальніть інформацію з тексту й графіка своїми словами.
- *Ich würde dir raten, zuerst einen **Modelltest** zu machen.* — Я б порадив тобі спершу зробити модельний тест.
- *Wenn man beide Optionen gegeneinander abwägt, spricht mehr für die zweite.* — Якщо зважити обидва варіанти, на користь другого говорить більше.
- *Ich halte diese Maßnahme für wenig durchdacht.* — Я вважаю цей захід непродуманим.
- *Bitte legen Sie nur Ihren Ausweis auf den Tisch.* — Покладіть, будь ласка, на стіл лише посвідчення.

## Слова

### Іспит і результат

> [!word] die Teilprüfung
> ipa: /ˈtaɪ̯lˌpʁyːfʊŋ/ · pos: noun · level: B2 · id: dp-c1-01-w01
> uk: частина іспиту; окремий іспит у складі цілого
> forms: die Teilprüfungen
> example: Der TestDaF besteht aus vier **Teilprüfungen**. — TestDaF складається з чотирьох частин.
> note: офіційний термін RO-DT і TestDaF-Prüfungsordnung; на сайті частіше *Prüfungsteil* (der, -e) — те саме.

> [!word] das Testzentrum
> ipa: /ˈtɛstˌtsɛntʁʊm/ · pos: noun · level: B2 · id: dp-c1-01-w02
> uk: тестовий центр
> forms: die Testzentren
> example: Den digitalen TestDaF legt man in einem lizenzierten **Testzentrum** ab. — Цифровий TestDaF складають у ліцензованому тестовому центрі.
> note: множина -um → -en, як das Museum → die Museen.

> [!word] der Anmeldeschluss
> ipa: /ˈanmɛldəˌʃlʊs/ · pos: noun · level: B2 · id: dp-c1-01-w03
> uk: кінцевий строк реєстрації
> forms: die Anmeldeschlüsse
> example: Nach dem **Anmeldeschluss** wird das Prüfungsentgelt nicht mehr erstattet. — Після закінчення реєстрації внесок уже не повертають.
> note: der Schluss — «кінець». Синонім: die Anmeldefrist (строк реєстрації).

> [!word] das Prüfungsentgelt
> ipa: /ˈpʁyːfʊŋsʔɛntˌɡɛlt/ · pos: noun · level: C1 · id: dp-c1-01-w04
> uk: оплата за іспит; екзаменаційний внесок
> forms: die Prüfungsentgelte
> example: Die Höhe des **Prüfungsentgelts** legt g.a.s.t. fest. — Розмір оплати встановлює g.a.s.t.
> note: das Entgelt [ɛntˈɡɛlt] — офіційне «плата, винагорода»; у розмові: die Prüfungsgebühr.

> [!word] die Kann-Beschreibung
> ipa: /ˈkanbəˌʃʁaɪ̯bʊŋ/ · pos: noun · level: C1 · id: dp-c1-01-w05
> uk: опис «я вмію» (що людина вміє на певному рівні)
> forms: die Kann-Beschreibungen
> example: Zu jedem TestDaF-Niveau gibt es **Kann-Beschreibungen** für alle vier Fertigkeiten. — До кожного рівня TestDaF є описи «я вмію» для всіх чотирьох навичок.
> note: калька англ. can-do statement; пишеться через дефіс. Рід від die Beschreibung.

> [!word] die Skala
> ipa: /ˈskaːla/ · pos: noun · level: B2 · id: dp-c1-01-w06
> uk: шкала
> forms: die Skalen; die Skalas
> example: Die Ergebnisse werden auf eine einheitliche **Skala** von 0 bis 20 übertragen. — Результати переводять на єдину шкалу від 0 до 20.
> note: дві множини, обидві правильні (DWDS); у текстах частіше Skalen. Наголос на першому складі.

> [!word] der Punktwert
> ipa: /ˈpʊŋktveːɐ̯t/ · pos: noun · level: C1 · id: dp-c1-01-w07
> uk: кількість балів (значення в балах)
> forms: die Punktwerte
> example: Der digitale TestDaF weist skalierte **Punktwerte** aus. — Цифровий TestDaF показує масштабовані бали.
> note: офіційне слово сертифіката. Ширше: die Punktzahl — «кількість набраних балів».

> [!word] skaliert
> ipa: /skaˈliːɐ̯t/ · pos: adj · level: C1 · id: dp-c1-01-w08
> uk: масштабований; переведений на шкалу
> example: Auf dem Zertifikat stehen **skalierte** Punktwerte. — На сертифікаті стоять бали, переведені на шкалу.
> note: Partizip II від skalieren (переводити на шкалу); наголос на -lie-.

> [!word] die Eingangsstufe
> ipa: /ˈaɪ̯nɡaŋsˌʃtuːfə/ · pos: noun · level: C1 · id: dp-c1-01-w09
> uk: початковий (найнижчий) рівень шкали
> forms: die Eingangsstufen
> example: TDN 3 gilt als **Eingangsstufe**. — TDN 3 вважається початковим рівнем.
> note: так RO-DT називає TDN 3 і DSH-1. der Eingang — «вхід», die Stufe — «щабель».

> [!word] uneingeschränkt
> ipa: /ˈʊnʔaɪ̯nɡəʃʁɛŋkt/ · pos: adj · level: C1 · id: dp-c1-01-w10
> uk: необмежений; без обмежень
> example: TDN 4 in allen Teilen berechtigt zur **uneingeschränkten** Zulassung. — TDN 4 в усіх частинах дає право на вступ без обмежень.
> note: un- + eingeschränkt (від einschränken — «обмежувати»). Наголос на un-.

### Вступ до вишу

> [!word] die Studienberatung
> ipa: /ˈʃtuːdi̯ənbəˌʁaːtʊŋ/ · pos: noun · level: B2 · id: dp-c1-01-w11
> uk: консультація для абітурієнтів і студентів (служба у виші)
> forms: die Studienberatungen
> example: Welches TDN Ihr Studiengang verlangt, erfahren Sie bei der **Studienberatung**. — Який TDN потрібен для вашої програми, дізнаєтеся в консультації для студентів.
> note: у вишах також das International Office — для іноземних абітурієнтів.

> [!word] die Einschreibung
> ipa: /ˈaɪ̯nʃʁaɪ̯bʊŋ/ · pos: noun · level: B2 · id: dp-c1-01-w12
> uk: зарахування у списки студентів; реєстрація (на семестр)
> forms: die Einschreibungen
> example: Nach der Zulassung folgt die **Einschreibung**. — Після допуску йде зарахування в списки студентів.
> note: синонім: die Immatrikulation. Zulassung — рішення вишу, Einschreibung — твій крок після нього.

> [!word] die Studierfähigkeit
> ipa: /ʃtuˈdiːɐ̯ˌfɛːɪçkaɪ̯t/ · pos: noun · level: C1 · id: dp-c1-01-w13
> uk: готовність до навчання у виші
> forms: — (без множини)
> example: Der TestDaF weist die sprachliche **Studierfähigkeit** nach. — TestDaF підтверджує мовну готовність до навчання у виші.
> note: офіційний термін RO-DT: sprachliche Studierfähigkeit. Наголос на -die-.

### Формат завдань

> [!word] das Teilnehmerportal
> ipa: /ˈtaɪ̯lneːmɐpɔʁˌtaːl/ · pos: noun · level: B2 · id: dp-c1-01-w14
> uk: портал (особистий кабінет) учасника
> forms: die Teilnehmerportale
> example: Ort und Uhrzeit finden Sie im **Teilnehmerportal**. — Місце й час ви знайдете в особистому кабінеті учасника.
> note: der Teilnehmer + das Portal → das. Тут оновлюють дані паспорта й бачать результат.

> [!word] die Erprobungsaufgabe
> ipa: /ɛɐ̯ˈpʁoːbʊŋsˌʔaʊ̯fɡaːbə/ · pos: noun · level: C1 · id: dp-c1-01-w15
> uk: пробне (тестове) завдання, яке не зараховують
> forms: die Erprobungsaufgaben
> example: **Erprobungsaufgaben** werden bei der Ergebnisermittlung nicht berücksichtigt. — Пробні завдання не враховують у результаті.
> note: die Erprobung (від erproben) + die Aufgabe → die. Розпізнати її під час тесту не можна.

> [!word] die Kurzantwort
> ipa: /ˈkʊʁtsˌʔantvɔʁt/ · pos: noun · level: C1 · id: dp-c1-01-w16
> uk: коротка відповідь (кілька слів)
> forms: die Kurzantworten
> example: Die **Kurzantworten** im Hören werden von Beurteilenden bewertet. — Короткі відповіді в Hören оцінюють люди.
> note: рід від die Antwort. Пиши ключове слово, не речення.

> [!word] das Begriffspaar
> ipa: /bəˈɡʁɪfsˌpaːɐ̯/ · pos: noun · level: C1 · id: dp-c1-01-w17
> uk: пара понять
> forms: die Begriffspaare
> example: Ordnen Sie die Aussagen dem **Begriffspaar** «Ursache – Folge» zu. — Віднесіть твердження до пари понять «причина — наслідок».
> note: das Paar → das Begriffspaar. Не плутай: ein paar (кілька) — з малої.

> [!word] die Sprachhandlung
> ipa: /ˈʃpʁaːxˌhandlʊŋ/ · pos: noun · level: C1 · id: dp-c1-01-w18
> uk: мовна дія (що мовець робить словами: критикує, поступається тощо)
> forms: die Sprachhandlungen
> example: Welche **Sprachhandlung** vollzieht der Autor in Absatz 3? — Яку мовну дію виконує автор в абзаці 3?
> note: в усній частині те саме називають die Sprechhandlung. -ung → die.

> [!word] der Gliederungspunkt
> ipa: /ˈɡliːdəʁʊŋsˌpʊŋkt/ · pos: noun · level: C1 · id: dp-c1-01-w19
> uk: пункт плану
> forms: die Gliederungspunkte
> example: Ergänzen Sie die fehlenden **Gliederungspunkte** des Vortrags. — Доповніть пропущені пункти плану доповіді.
> note: die Gliederung (план, структура) + der Punkt → der. Між ними сполучне -s-.

> [!word] abgleichen
> ipa: /ˈapɡlaɪ̯çn̩/ · pos: verb · level: C1 · id: dp-c1-01-w20
> uk: звіряти; зіставляти
> forms: abgleichen → glich ab → hat abgeglichen
> example: Sie **gleichen** das Lautbild mit dem Schriftbild **ab**. — Ви звіряєте почуте з написаним.
> note: відокремлюване: ich gleiche ab. Informationen abgleichen — зіставити дані з різних джерел (Sprechen, завдання 4).

> [!word] erproben
> ipa: /ɛɐ̯ˈpʁoːbn̩/ · pos: verb · level: C1 · id: dp-c1-01-w21
> uk: випробовувати; перевіряти на практиці
> forms: erproben → erprobte → hat erprobt
> example: Einige Aufgaben werden nur **erprobt** und nicht gewertet. — Деякі завдання лише випробовують і не зараховують.
> note: невідокремлюване er-, без ge- у Partizip. Іменник: die Erprobung → Erprobungsaufgabe.

> [!word] der Modelltest
> ipa: /moˈdɛlˌtɛst/ · pos: noun · level: B2 · id: dp-c1-01-w22
> uk: модельний (пробний) тест
> forms: die Modelltests
> example: Auf testdaf.de gibt es kostenlose **Modelltests**. — На testdaf.de є безкоштовні модельні тести.
> note: у Goethe й telc — der Modellsatz / der Übungstest. Наголос: Mo-DELL.

### Компʼютер і запис

> [!word] das Headset
> ipa: /ˈhɛtsɛt/ · pos: noun · level: B2 · id: dp-c1-01-w23
> uk: гарнітура (навушники з мікрофоном)
> forms: die Headsets
> example: Im Teil Sprechen hören Sie die Aufgabe über ein **Headset**. — У Sprechen ви чуєте завдання через гарнітуру.
> note: англіцизм, середній рід; вимова з німецьким [ɛ]: «хетсет».

> [!word] das Ausweisdokument
> ipa: /ˈaʊ̯svaɪ̯sdokuˌmɛnt/ · pos: noun · level: B2 · id: dp-c1-01-w24
> uk: документ, що посвідчує особу (паспорт, ID-картка)
> forms: die Ausweisdokumente
> example: Auf dem Tisch darf nur Ihr **Ausweisdokument** liegen. — На столі може лежати лише ваш документ.
> note: загальне слово для Personalausweis і Reisepass. Має збігатися з документом, указаним під час реєстрації.

> [!word] das Lautbild
> ipa: /ˈlaʊ̯tbɪlt/ · pos: noun · level: C1 · id: dp-c1-01-w25
> uk: звучання слова (почута форма)
> forms: die Lautbilder
> example: Vergleichen Sie das **Lautbild** mit dem Schriftbild. — Порівняйте почуте з написаним.
> note: пара до das Schriftbild (написана форма). Кінцеве d = [t]: «лаутбільт».

### Оцінювання й правила

> [!word] der Beurteilende
> ipa: /bəˈʔʊʁtaɪ̯ləndə/ · pos: noun · level: C1 · id: dp-c1-01-w26
> uk: оцінювач (людина, що оцінює роботу)
> forms: die Beurteilenden
> example: Geschulte **Beurteilende** bewerten Ihre Texte. — Ваші тексти оцінюють навчені оцінювачі.
> note: субстантивований дієприкметник: der Beurteilende, ein Beurteilender; жінка — die Beurteilende. Синонім: der Bewerter.

> [!word] der Prüfungsbeauftragte
> ipa: /ˈpʁyːfʊŋsbəˌʔaʊ̯ftʁaːktə/ · pos: noun · level: C1 · id: dp-c1-01-w27
> uk: уповноважений з проведення іспиту (наглядач)
> forms: die Prüfungsbeauftragten
> example: Folgen Sie den Anweisungen der **Prüfungsbeauftragten**. — Виконуйте вказівки відповідальних за іспит.
> note: субстантивований дієприкметник: ein Prüfungsbeauftragter; жінка — die Prüfungsbeauftragte.

> [!word] der Täuschungsversuch
> ipa: /ˈtɔʏ̯ʃʊŋsfɛɐ̯ˌzuːx/ · pos: noun · level: C1 · id: dp-c1-01-w28
> uk: спроба списати; спроба обману
> forms: die Täuschungsversuche
> example: Schon ein **Täuschungsversuch** führt zum Ausschluss. — Уже спроба списати призводить до виключення.
> note: die Täuschung (обман) + der Versuch (спроба). täuschen — «обманювати»; sich täuschen — «помилятися».

> [!word] die Verwaltungspauschale
> ipa: /fɛɐ̯ˈvaltʊŋspaʊ̯ˌʃaːlə/ · pos: noun · level: C1 · id: dp-c1-01-w29
> uk: фіксований адміністративний збір
> forms: die Verwaltungspauschalen
> example: Für die Überprüfung kann eine **Verwaltungspauschale** erhoben werden. — За перевірку можуть стягнути адміністративний збір.
> note: die Pauschale [paʊ̯ˈʃaːlə] — фіксована сума; pauschal — «загалом, без деталей».

> [!word] der Nachteilsausgleich
> ipa: /ˈnaːxtaɪ̯lsˌʔaʊ̯sɡlaɪ̯ç/ · pos: noun · level: C1 · id: dp-c1-01-w30
> uk: компенсація обмежень (особливі умови для людей з тривалим або постійним фізичним обмеженням; атестат можуть вимагати)
> forms: die Nachteilsausgleiche
> example: Einen **Nachteilsausgleich**, zum Beispiel mehr Zeit, muss man bei der Anmeldung beantragen. — Особливі умови, наприклад більше часу, треба просити під час реєстрації.
> note: der Nachteil (недолік, невигода) + der Ausgleich (вирівнювання). Подають разом з реєстрацією, часто з медичною довідкою.

## Слухаємо

### Перед іспитом

> [!listen] Інструктаж наглядачки пані Ленц. Що учасники мають принести самі?
> level: C1 · type: answer · id: dp-c1-01-l01
> audio: Guten Morgen. Bitte legen Sie nur Ihren Ausweis auf den Tisch. Uhren und Handys, ausgeschaltet, legen Sie bitte zu Ihren Taschen in die Ecke. Papier für Notizen bekommen Sie von mir. Einen Kugelschreiber haben Sie hoffentlich selbst mitgebracht.
> - [ ] a: папір для нотаток
> - [x] b: кулькову ручку
> - [ ] c: годинник, щоб стежити за часом
> - [ ] d: власні навушники
>
> **Пояснення:** *Einen Kugelschreiber haben Sie hoffentlich selbst mitgebracht* — ручку приносять самі. Папір дає наглядачка (*bekommen Sie von mir*), а годинник, навіть звичайний, лежить у сумці.

### Lesen і Hören у форматі TestDaF

> [!listen] Hören, Kurzantwort: Übersicht ergänzen. Лекція докторки Ільзе Брандт про жестові мови.
> level: C1 · type: fill · id: dp-c1-01-l02
> audio: Gebärdensprachen sind keine Pantomime, sondern vollwertige Sprachen mit eigener Grammatik. Außerdem gibt es nicht die eine Gebärdensprache: Fast jedes Land hat seine eigene. Und auch innerhalb eines Landes gibt es regionale Varianten, ähnlich wie Dialekte.
>
> ```fill
> Status: vollwertige [[Sprachen|Sprache]] mit eigener [[Grammatik]]
> international? nein — fast jedes [[Land]] hat eine eigene
> innerhalb eines Landes: regionale [[Varianten|Variante]]
> ```
>
> **Пояснення:** у *Kurzantwort* друкуєш ключове слово. Лекторка сама підказує структуру: *sondern* (не пантоміма, **а** мова), *Außerdem*, *Und auch*. Порівняння з діалектами — приклад, його в таблицю не пишемо.

> [!listen] Hören, Textstellen zu Begriffspaar notieren. Модератор Йонас (A) розмовляє з експерткою з подорожей Петрою Ган (B). Заповни «перевага / недолік».
> level: C1 · type: fill · id: dp-c1-01-l03
> audio: A: Frau Hahn, warum steigen manche Menschen wieder in den Nachtzug?
> audio: B: Man kommt morgens mitten in der Stadt an und spart sich die Hotelnacht. Allerdings sind Tickets für ein eigenes Abteil oft teurer als ein Flug.
>
> ```fill
> Vorteil: Ankunft mitten in der [[Stadt]]; man spart die [[Hotelnacht|Übernachtung]]
> Nachteil: Tickets für ein eigenes [[Abteil]] oft [[teurer]] als ein Flug
> ```
>
> **Пояснення:** межа між колонками — слово ***Allerdings*** («проте»): усе до нього — перевага, після нього — недолік. Пара понять у цьому завданні щоразу інша (за / проти, причина / наслідок), але сигнали ті самі.

> [!listen] Hören, Fehler in Zusammenfassung erkennen. Петра Ган продовжує. Яке речення резюме ХИБНЕ?
> level: C1 · type: answer · id: dp-c1-01-l04
> audio: B: Viele denken, Nachtzüge seien vor allem etwas für junge Leute mit Rucksack. Nach meiner Erfahrung ist es eher umgekehrt: Am häufigsten buchen bei uns Familien und ältere Reisende.
> - [x] a: Nach Frau Hahns Erfahrung buchen vor allem junge Rucksackreisende.
> - [ ] b: Familien gehören zu den häufigsten Kundinnen und Kunden.
> - [ ] c: Auch ältere Reisende buchen oft.
>
> **Пояснення:** про молодь із рюкзаком *viele denken* — це чужа думка в Konjunktiv I (*seien*), яку Ган одразу спростовує: *eher umgekehrt*. Хто дослівно чує «junge Leute mit Rucksack» і ставить галочку, потрапляє в пастку.

> [!listen] Hören, Aussagen Personen zuordnen (відео). Студенти Лея (A) і Тарік (B) про жестову мову як курс за вибором. Хто ставить якість курсу в залежність від умови?
> level: C1 · type: answer · id: dp-c1-01-l05
> audio: A: Ich bin Lea. Ich finde, jede Uni sollte Gebärdensprache als Wahlfach anbieten. Man versteht dann plötzlich, wie viel Grammatik im Raum steckt.
> audio: B: Tarik hier. Schön und gut, aber ohne Lehrkräfte, die selbst gehörlos sind, wird das nichts.
> - [ ] a: Лея
> - [x] b: Тарік
> - [ ] c: обоє
> - [ ] d: ніхто
>
> **Пояснення:** умова звучить у Таріка: *ohne Lehrkräfte, die selbst gehörlos sind, wird das nichts* — «без викладачів, які самі не чують, нічого не вийде». *Schön und gut, aber…* — типовий зворот «так, але». Лея лише за курс.

> [!listen] Hören, Aussagen Personen zuordnen (відео). Лея (A) і Тарік (B) продовжують. Хто вважає онлайн-курс достатнім лише для початку?
> level: C1 · type: answer · id: dp-c1-01-l06
> audio: A: Wobei man heute auch online sehr viel lernen kann.
> audio: B: Online? Für die Grundlagen vielleicht. Aber Mimik und Tempo lernt man nur im direkten Gespräch.
> - [ ] a: Лея
> - [x] b: Тарік
> - [ ] c: обоє
> - [ ] d: ніхто
>
> **Пояснення:** *Für die Grundlagen vielleicht* — «для основ, можливо», далі *Aber…*: решту, на думку Таріка, онлайн не дасть. Лея говорить про онлайн позитивно без обмежень (*sehr viel*).

> [!listen] Hören, Gliederungspunkte zu Vortrag ergänzen (відео). Докторка Брандт називає план доповіді.
> level: C1 · type: fill · id: dp-c1-01-l07
> audio: Mein Vortrag hat drei Teile. Zuerst geht es um die Geschichte der Gehörlosenschulen, dann um die Frage, wie Kinder Gebärdensprache erwerben, und zum Schluss um Gebärdensprache im Beruf.
>
> ```fill
> 1. Geschichte der [[Gehörlosenschulen|Gehörlosenschule]]
> 2. wie Kinder Gebärdensprache [[erwerben|lernen]]
> 3. Gebärdensprache im [[Beruf]]
> ```
>
> **Пояснення:** план дають сигнальні слова *Zuerst — dann — zum Schluss*. У самому завданні пункти розкидані по всій доповіді, тому слухай саме ці «рамки».

> [!listen] Hören, Multiple-Choice. Докторка Брандт про вивчення мов дітьми. Яка сучасна позиція?
> level: C1 · type: answer · id: dp-c1-01-l08
> audio: Lange glaubte man, Gebärden würden Kinder beim Sprechenlernen behindern. Heute gehen viele Fachleute vom Gegenteil aus: Wer früh eine Sprache hat, ob gesprochen oder gebärdet, lernt auch eine zweite leichter.
> - [ ] a: Жести заважають дітям навчитися говорити.
> - [x] b: Рано засвоєна мова, усна чи жестова, полегшує вивчення другої.
> - [ ] c: Дітям варто вчити лише усну мову.
>
> **Пояснення:** a — стара думка (*Lange glaubte man*), її протиставлено сучасній: *Heute gehen viele Fachleute vom Gegenteil aus*. Правильний варіант перефразує почуте: *früh eine Sprache hat* → «рано засвоєна мова».

> [!listen] Hören, Laut- und Schriftbild abgleichen. На екрані: «Im modernen Liegewagen teilen sich bis zu sechs fremde Personen ein Abteil.» Яких слів НЕ було в аудіо?
> level: C1 · type: answer · id: dp-c1-01-l09
> audio: Im Liegewagen teilen sich bis zu sechs Personen ein Abteil.
> - [x] a: modernen, fremde
> - [ ] b: bis zu, sechs
> - [ ] c: teilen, Abteil
>
> **Пояснення:** у записі немає *modernen* і *fremde*. Прикметники-«вставки» найважче помітити, бо речення без них звучить так само природно. Слухай із пальцем на тексті й рухайся слово за словом.

> [!listen] Hören, Laut- und Schriftbild abgleichen. На екрані: «Gebärdensprachdolmetscher arbeiten bei langen Terminen oft zu zweit und wechseln sich regelmäßig ab.» Чого НЕ було в аудіо?
> level: C1 · type: answer · id: dp-c1-01-l10
> audio: Gebärdensprachdolmetscher arbeiten oft zu zweit und wechseln sich regelmäßig ab.
> - [ ] a: oft
> - [x] b: bei langen Terminen
> - [ ] c: regelmäßig
>
> **Пояснення:** зайва в надрукованому тексті ціла група *bei langen Terminen*. *oft* і *regelmäßig* звучали. У завданні бувають і окремі слова, і такі групи.

### Sprechen: впізнай завдання

> [!listen] Sprechen. Звертається одногрупниця Яна. Яку мовну дію від тебе чекають?
> level: C1 · type: answer · id: dp-c1-01-l11
> audio: Du, ich hab ein Problem. Mein TestDaF ist in drei Wochen, aber beim Sprechen bin ich total unsicher. Was würdest du mir raten?
> - [x] a: дати пораду (*Rat geben*) — коротко, на «ти»
> - [ ] b: переказати текст для робочої групи
> - [ ] c: розкритикувати захід адміністрації
> - [ ] d: представити тему на туторіумі
>
> **Пояснення:** *Was würdest du mir raten?* — пряма просьба про пораду. Це перше й найкоротше завдання (0:45), приватна ситуація, тож *du* й розмовний тон доречні: *An deiner Stelle würde ich…*

> [!listen] Sprechen. Оголошення на інформаційному заході міста. Який тип завдання?
> level: C1 · type: answer · id: dp-c1-01-l12
> audio: Die Stadtverwaltung plant, die Nachtbusse am Wochenende abzuschaffen, um Kosten zu sparen. Sie nehmen an der Informationsveranstaltung teil. Äußern Sie Ihre Kritik und begründen Sie sie.
> - [ ] a: *Optionen abwägen*
> - [x] b: *Maßnahmen kritisieren*
> - [ ] c: *Text zusammenfassen*
>
> **Пояснення:** захід (*Maßnahme*) уже заплановано, ситуація — інформаційна зустріч міста, і просять критику з обґрунтуванням. Регістр — *Sie*: *Ich halte diese Maßnahme für…, weil…*

### Диктант

> [!listen] Напиши або скажи, що почув
> level: C1 · type: dictation · id: dp-c1-01-l13
> audio: Die Teilprüfungen werden getrennt ausgewertet.
> explain: *getrennt* — «окремо» (Partizip II від trennen). *ausgewertet* — відокремлюване aus- + ge-.

> [!listen] Напиши або скажи, що почув
> level: C1 · type: dictation · id: dp-c1-01-l14
> audio: Eine Rückkehr zur vorherigen Aufgabe ist nicht möglich.
> explain: *vorherig* — «попередній», з одним r посередині й -ig у кінці; *zur* = zu der (die Aufgabe → Dativ der).

## Вимова

Сім мовних дій усної частини — сім зворотів, які варто мати «в мʼязах». Говори в темпі, без пауз між словами.

> [!speak] Rat geben (0:45, на «ти»)
> level: C1 · id: dp-c1-01-s01
> text: An deiner Stelle würde ich mich zuerst bei der Studienberatung melden.
> ipa: /an ˈdaɪ̯nɐ ˈʃtɛlə ˈvʏʁdə ɪç mɪç tsuˈʔeːɐ̯st baɪ̯ deːɐ̯ ˈʃtuːdi̯ənbəˌʁaːtʊŋ ˈmɛldn̩/
> tip: zuerst — з легким «стопом» перед -erst; ü у würde — губи округлені, язик як для «і».
> uk: На твоєму місці я б спершу звернувся до консультації для студентів.

> [!speak] Optionen abwägen (1:30)
> level: C1 · id: dp-c1-01-s02
> text: Beide Möglichkeiten haben ihre Vorzüge, aber unterm Strich spricht mehr für die zweite.
> ipa: /ˈbaɪ̯də ˈmøːklɪçkaɪ̯tn̩ ˈhaːbn̩ ˈiːʁə ˈfoːɐ̯tsyːɡə ˈaːbɐ ˈʊntɐm ʃtʁɪç ʃpʁɪçt meːɐ̯ fyːɐ̯ diː ˈtsvaɪ̯tə/
> tip: unterm Strich — «зрештою, у підсумку»; Vorzüge — довге [yː]; spricht — st/sp на початку кореня = «шп».
> uk: Обидва варіанти мають переваги, але зрештою більше аргументів за другий.

> [!speak] Text zusammenfassen (2:00)
> level: C1 · id: dp-c1-01-s03
> text: Der Text behandelt im Wesentlichen die Frage, ob Nachtzüge eine Alternative zum Flugzeug sind.
> ipa: /deːɐ̯ tɛkst bəˈhandl̩t ɪm ˈveːzn̩tlɪçn̩ diː ˈfʁaːɡə ɔp ˈnaxttsyːɡə ˈaɪ̯nə altɛʁnaˈtiːvə tsʊm ˈfluːktsɔʏ̯k zɪnt/
> tip: Nachtzüge — ch після a глибоке [x], далі [ts]; Alternative — наголос на -ti-; ob — кінцеве b = [p].
> uk: Текст переважно розглядає питання, чи є нічні поїзди альтернативою літаку.

> [!speak] Informationen abgleichen, Stellung nehmen (1:30)
> level: C1 · id: dp-c1-01-s04
> text: Die Grafik bestätigt diese Aussage nur zum Teil.
> ipa: /diː ˈɡʁaːfɪk bəˈʃtɛːtɪçt ˈdiːzə ˈaʊ̯szaːɡə nuːɐ̯ tsʊm taɪ̯l/
> tip: Grafik — наголос на першому складі, a довге; bestätigt — кінцеве -igt = [ɪçt].
> uk: Графік лише частково підтверджує це твердження.

> [!speak] Thema präsentieren (2:30)
> level: C1 · id: dp-c1-01-s05
> text: Ich möchte Ihnen heute in drei Schritten zeigen, wie sich das Problem entwickelt hat.
> ipa: /ɪç ˈmœçtə ˈiːnən ˈhɔʏ̯tə ɪn dʁaɪ̯ ˈʃʁɪtn̩ ˈtsaɪ̯ɡn̩ viː zɪç das pʁoˈbleːm ɛntˈvɪkl̩t hat/
> tip: Problem — наголос на -blem; entwickelt — наголос на -wi-, ent- ненаголошене.
> uk: Сьогодні я хочу в три кроки показати вам, як розвивалася ця проблема.

> [!speak] Argumente wiedergeben, Stellung nehmen (2:00)
> level: C1 · id: dp-c1-01-s06
> text: Herr Kramer argumentiert, die Kosten seien zu hoch; dem kann ich mich nicht anschließen.
> ipa: /hɛʁ ˈkʁaːmɐ aʁɡumɛnˈtiːɐ̯t diː ˈkɔstn̩ ˈzaɪ̯ən tsuː hoːx deːm kan ɪç mɪç nɪçt ˈanʃliːsn̩/
> tip: seien — Konjunktiv I: чужа думка; зроби коротку паузу на крапці з комою, а тоді голос «повертає» до твоєї позиції.
> uk: Пан Крамер стверджує, що витрати завеликі; з цим я не можу погодитися.

> [!speak] Maßnahmen kritisieren (1:30)
> level: C1 · id: dp-c1-01-s07
> text: Ich halte diese Maßnahme für wenig durchdacht, denn sie trifft vor allem Studierende.
> ipa: /ɪç ˈhaltə ˈdiːzə ˈmaːsnaːmə fyːɐ̯ ˈveːnɪç dʊʁçˈdaxt dɛn ziː tʁɪft foːɐ̯ ˈaləm ʃtuˈdiːʁəndə/
> tip: durchdacht — наголос на -dacht (невідокремлюване durch-); Maßnahme — довге [aː] двічі.
> uk: Я вважаю цей захід непродуманим, адже він бʼє передусім по студентах.

> [!speak] Місток, коли треба виграти секунду
> level: C1 · id: dp-c1-01-s08
> text: Lassen Sie mich das an einem Beispiel verdeutlichen.
> ipa: /ˈlasn̩ ziː mɪç das an ˈaɪ̯nəm ˈbaɪ̯ʃpiːl fɛɐ̯ˈdɔʏ̯tlɪçn̩/
> tip: verdeutlichen — наголос на -deut-, eu = [ɔʏ̯]; Beispiel — sp усередині слова після префікса Bei- = «шп».
> uk: Дозвольте пояснити це на прикладі.

## Типові помилки українців

> [!pitfall] «Сума балів усе вирівняє»
> 17 + 16 + 9 + 15 = 57 балів — гарна сума, але Schreiben з 9 балами — це TDN 3. Для вимоги «TDN 4 × 4» сума не має значення, вирішує **найслабша частина**. Плануй підготовку від неї.

> [!pitfall] «Повернуся до цього завдання наприкінці»
> На паперових іспитах так часто роблять, але в цифровому TestDaF після переходу далі **назад уже не повернешся**. Тож: відповідь на кожне питання ставиш одразу, навіть навмання. Порожня відповідь гарантовано дає 0, а здогад дає шанс.

> [!pitfall] Мовчання в мікрофон
> В українській звичці «подумати, перш ніж сказати» на записі TestDaF нема місця: секунди спливають, і запис іде далі. Говори з першої секунди: назви дію (*Ich würde dir raten…*), потім розгортай. Зворот-місток (*Lassen Sie mich das an einem Beispiel verdeutlichen*) дає тобі час подумати вголос.

> [!pitfall] Переписати фразу з тексту в Schreiben
> У завданні з текстом і графіком оцінюють, чи передано інформацію **своїми словами**. ~~Laut Text sind Nachtzüge „eine echte Alternative für Kurzstrecken“.~~ → *Der Text stellt Nachtzüge als ernstzunehmende Option für kürzere Strecken dar.* Перефразування — тема [[Deutsch Prüfungen - C1 - 02. DSH — Hörverstehen, Leseverstehen, наукові структури]].

## Ситуація: реєстрація в тестовому центрі

> [!listen] Олена (B) приходить на іспит, наглядач пан Вольф (A) перевіряє документи. Чому Олену допускають із новим паспортом?
> level: C1 · type: answer · id: dp-c1-01-l15
> audio: A: Guten Morgen. Ihren Ausweis, bitte.
> audio: B: Bitte. Mein alter Pass ist abgelaufen, das hier ist der neue.
> audio: A: Haben Sie die Daten im Teilnehmerportal aktualisiert?
> audio: B: Ja, letzte Woche schon.
> audio: A: Gut. Dann Uhr und Handy bitte in den Schrank.
> - [x] a: бо вона заздалегідь оновила дані паспорта на порталі учасника
> - [ ] b: бо старий паспорт ще дійсний
> - [ ] c: бо в тестовому центрі документ не перевіряють
> - [ ] d: бо вона показала квиток на поїзд
>
> **Пояснення:** документ має збігатися з тим, що вказано під час реєстрації. Новий паспорт годиться лише тоді, коли дані оновлено в *Teilnehmerportal*: *Haben Sie die Daten … aktualisiert? — Ja, letzte Woche schon.* Переклад: — Добрий ранок. Ваш документ, будь ласка. — Прошу. Мій старий паспорт прострочений, це новий. — Ви оновили дані на порталі учасника? — Так, ще минулого тижня. — Добре. Тоді годинник і телефон, будь ласка, у шафку.

> [!speak] Ситуація: поясни наглядачеві
> level: C1 · id: dp-c1-01-s09
> text: Ich habe mich mit diesem Reisepass angemeldet.
> ipa: /ɪç ˈhaːbə mɪç mɪt ˈdiːzəm ˈʁaɪ̯zəˌpas ˈanɡəmɛldət/
> tip: angemeldet — наголос на an-; ge- всередині ненаголошене.
> uk: Я зареєструвався з цим паспортом.

> [!speak] Ситуація: перепитай про правила
> level: C1 · id: dp-c1-01-s10
> text: Entschuldigung, darf ich meine Armbanduhr in die Tasche legen?
> ipa: /ɛntˈʃʊldɪɡʊŋ daʁf ɪç ˈmaɪ̯nə ˈaʁmbantˌʔuːɐ̯ ɪn diː ˈtaʃə ˈleːɡn̩/
> tip: Armbanduhr — тверде «стоп» перед -uhr [ʔuːɐ̯]; Entschuldigung — наголос на -schul-.
> uk: Перепрошую, можна покласти наручний годинник у сумку?

## Landeskunde: Deutsch für das Studium nachweisen

> [!example] Welche Nachweise deutsche Hochschulen anerkennen
> Wer in Deutschland auf Deutsch studieren möchte und seine Studienqualifikation nicht an einer deutschsprachigen Einrichtung erworben hat, muss vor Studienbeginn nachweisen, dass er den sprachlichen Anforderungen des Studiums gewachsen ist. Geregelt ist diese Pflicht in den Hochschulgesetzen der Länder. Welche Nachweise gelten, haben die Hochschulrektorenkonferenz und die Kultusministerkonferenz gemeinsam in einer Rahmenordnung festgehalten, der sogenannten RO-DT.
>
> Anerkannt werden vier Prüfungen. Die bekannteste ist wohl der TestDaF, der zentral entwickelt und bewertet wird und an lizenzierten Testzentren im In- und Ausland stattfindet. Die DSH dagegen wird von den Hochschulen selbst oder von Studienkollegs angeboten; jeder Standort erlässt dafür eine eigene Prüfungsordnung, die einer gemeinsamen Musterordnung entsprechen muss. Hinzu kommen der Prüfungsteil „Deutsch“ der Feststellungsprüfung an Studienkollegs und das Deutsche Sprachdiplom der Kultusministerkonferenz, Zweite Stufe, kurz DSD II. Letzteres legen Schülerinnen und Schüler an Schulen im Ausland ab, und zwar unentgeltlich.
>
> Für die beiden bekanntesten Prüfungen nennt die Rahmenordnung auch die Maßstäbe. Wer im TestDaF in allen vier Teilen mindestens das Niveau TDN 4 erreicht, erfüllt die sprachliche Voraussetzung für alle Studiengänge. Bei der DSH entspricht dem die Stufe DSH-2.
>
> Wer bestimmte andere Zeugnisse besitzt, ist vom Nachweis befreit. Dazu zählen ein Schulabschluss, der einer deutschen Hochschulzugangsberechtigung entspricht, das Goethe-Zertifikat C2, das ÖSD-Zertifikat C2 und die Prüfung telc Deutsch C1 Hochschule. Das Goethe-Zertifikat C1 wird in der Rahmenordnung dagegen nicht genannt; ob eine Hochschule es akzeptiert, entscheidet sie selbst.
>
> Bemerkenswert ist, wie viel Spielraum die Rahmenordnung den Hochschulen lässt. Sie können die sprachlichen Anforderungen je nach Fach unterschiedlich festlegen und in begründeten Fällen auch niedrigere Hürden ansetzen, etwa ein schwächeres Ergebnis im Schreiben für ein technisches Fach. Eine solche Erleichterung soll allerdings mit der Auflage verbunden werden, die Deutschkenntnisse während des Studiums weiter auszubauen und das auch nachzuweisen. Außerdem gilt sie nur für den jeweiligen Zweck: Wer später das Fach oder die Hochschule wechselt, kann sich nicht automatisch darauf berufen.
>
> Für Bewerberinnen und Bewerber folgt daraus vor allem eines. Maßgeblich ist nicht, was in Foren als „übliche Anforderung“ kursiert, sondern das, was die gewünschte Hochschule für den gewünschten Studiengang verlangt. Wer deren Bewerbungsseite rechtzeitig und genau liest, erspart sich unter Umständen eine teure Wiederholung der Prüfung und manchen verlorenen Monat.

> [!quiz] Landeskunde. Хто, за текстом, проводить DSH?
> level: C1 · type: single · id: dp-c1-01-q02
> - [ ] TestDaF-Institut у ліцензованих тестових центрах
> - [x] самі виші або Studienkollegs (підготовчі коледжі при вишах), кожен за власним положенням
> - [ ] Конференція міністрів освіти (KMK) централізовано
> - [ ] школи за кордоном, безкоштовно
>
> **Пояснення:** *Die DSH dagegen wird von den Hochschulen selbst oder von Studienkollegs angeboten; jeder Standort erlässt dafür eine eigene Prüfungsordnung.* Централізовано й у тестових центрах проводять TestDaF, а в школах за кордоном безкоштовно складають DSD II.

> [!quiz] Landeskunde. Який сертифікат за текстом звільняє від мовного доказу?
> level: C1 · type: single · id: dp-c1-01-q03
> - [ ] Goethe-Zertifikat C1
> - [x] telc Deutsch C1 Hochschule
> - [ ] будь-який сертифікат рівня C1
> - [ ] TestDaF із TDN 3
>
> **Пояснення:** у переліку звільнень — *das Goethe-Zertifikat C2, das ÖSD-Zertifikat C2 und die Prüfung telc Deutsch C1 Hochschule*. Про Goethe C1 сказано прямо: у рамковому положенні його немає, рішення за вишем. TDN 3 — «вхідний» рівень, а не звільнення.

> [!quiz] Landeskunde. Що каже текст про вступ із нижчими мовними вимогами?
> level: C1 · type: single · id: dp-c1-01-q04
> - [ ] Такий вступ автоматично діє в усіх вишах Німеччини.
> - [x] Він повʼязаний з обовʼязком підтягнути німецьку під час навчання й діє лише для цієї мети.
> - [ ] Нижчі вимоги заборонені для технічних спеціальностей.
> - [ ] Після першого семестру мовний доказ більше не потрібен.
>
> **Пояснення:** два обмеження: *mit der Auflage verbunden…, die Deutschkenntnisse … weiter auszubauen* і *gilt sie nur für den jeweiligen Zweck* — у разі зміни спеціальності чи вишу на це не можна посилатися. Приклад із технічним фахом у тексті якраз показує, що нижчі вимоги можливі.

## Практика

> [!quiz] Ти вже в завданні Multiple-Choice (Lesen) і зрозумів, що помилився в Textabschnitte ordnen. Що можна зробити?
> level: C1 · type: single · id: dp-c1-01-q05
> - [ ] повернутися кнопкою «назад» і виправити
> - [ ] виправити наприкінці Lesen, коли лишиться час
> - [x] нічого: попереднє завдання закрите, тож працюй далі
> - [ ] попросити наглядача відкрити завдання знову
>
> **Пояснення:** testdaf.de: *Sie können schneller vorangehen, aber nicht zurück zu einer vorherigen Aufgabe.* Прискоритися можна, повернутися — ні. Тому перевіряй відповідь до того, як перейти далі.

> [!quiz] Бали: Lesen 15, Hören 16, Schreiben 9, Sprechen 14. Чи виконано вимогу «TDN 4 × 4»?
> level: C1 · type: single · id: dp-c1-01-q06
> - [ ] так, бо сума 54 більша за 40
> - [ ] так, бо три частини з чотирьох — TDN 4 або вище
> - [x] ні, бо Schreiben з 9 балами — це TDN 3
> - [ ] ні, бо для TDN 4 потрібно щонайменше 15 балів у кожній частині
>
> **Пояснення:** 9 балів — верхня межа TDN 3 (5–9). TDN 4 починається з 10 балів, а не з 15: останній варіант плутає межі. Сума тут нічого не вирішує.

> [!quiz] Заповни шкалу цифрового TestDaF
> level: C1 · type: fill · id: dp-c1-01-q07
>
> ```text fill
> 0–4 Punkte → unter TDN [[3]]
> 5–9 Punkte → TDN [[3]]
> 10–15 Punkte → TDN [[4]]
> 16–20 Punkte → TDN [[5]]
> Gesamtwert: maximal [[80]] Punkte
> ```
>
> **Пояснення:** межі — 5, 10 і 16 балів; чотири частини по 20 дають максимум 80. «unter TDN 3» на сертифікаті не деталізують.

> [!quiz] Чому тобі в Lesen могли трапитися два завдання Multiple-Choice?
> level: C1 · type: single · id: dp-c1-01-q08
> - [ ] через технічну помилку: друге завдання можна пропустити
> - [x] одне з них може бути пробним, але яке — невідомо, тож обидва роби як справжні
> - [ ] за Multiple-Choice дають подвійні бали
> - [ ] це завдання для тих, хто претендує на TDN 5
>
> **Пояснення:** усі учасники отримують *Erprobungsaufgaben*: їх випробовують для майбутніх тестів і не враховують. Через це одного типу може бути два завдання. Розпізнати пробне не можна, тому пропускати будь-яке — ризик.

> [!quiz] Що з переліку — офіційні критерії оцінювання Schreiben? Обери всі.
> level: C1 · type: multi · id: dp-c1-01-q09
> - [x] чи враховано всі пункти завдання
> - [x] чи інформацію з джерел передано коректно й своїми словами
> - [x] чи різноманітні граматичні структури й лексика
> - [ ] чи текст довший за 400 слів
> - [ ] чи використано щонайменше пʼять складних слів
>
> **Пояснення:** критерії зі сторінки «Auswertung»: тема, усі пункти, потрібна мовна дія, джерела своїми словами, точність, різноманітність, зрозумілість. Для аргументативного тексту є мінімум (≥ 200 слів), але бонусу за довжину немає, як і «норми» складних слів.

> [!quiz] Що треба робити в завданні «Laut- und Schriftbild abgleichen»?
> level: C1 · type: single · id: dp-c1-01-q10
> - [ ] записати почуте речення з памʼяті
> - [x] знайти в надрукованому тексті слова, яких не було в аудіо
> - [ ] виправити орфографічні помилки в тексті
> - [ ] обрати, хто з мовців це сказав
>
> **Пояснення:** testdaf.de: *Sie sollen im Schriftbild Wörter erkennen, die nicht im gesprochenen Text enthalten sind.* Друкованих помилок тут не шукають, і це не диктант.

> [!quiz] Яке з усних завдань TestDaF найдовше?
> level: C1 · type: single · id: dp-c1-01-q11
> - [ ] *Rat geben*
> - [ ] *Text zusammenfassen*
> - [x] *Thema präsentieren*
> - [ ] *Maßnahmen kritisieren*
>
> **Пояснення:** *Thema präsentieren* — 2:30. *Text zusammenfassen* — 2:00, *Maßnahmen kritisieren* — 1:30, *Rat geben* — лише 0:45. Для презентації заздалегідь май схему «вступ — 2–3 пункти — висновок».

> [!quiz] Що з цього може лежати на твоєму столі під час TestDaF?
> level: C1 · type: single · id: dp-c1-01-q12
> - [ ] звичайний (не смарт) наручний годинник
> - [ ] одномовний словник
> - [x] посвідчення особи
> - [ ] власні аркуші для нотаток
>
> **Пояснення:** правила: *Während der Prüfung darf auf Ihrem Schreibtisch nur Ihr Ausweisdokument liegen.* Папір видає наглядач. Будь-який наручний годинник заборонено, а не лише смарт. Допоміжних засобів у TestDaF немає взагалі.

> [!quiz] Ти приїхав, коли вступний інструктаж уже почався. Що буде?
> level: C1 · type: single · id: dp-c1-01-q13
> - [ ] тебе посадять, але Lesen буде коротшим
> - [x] до іспиту тебе вже не допустять
> - [ ] пропустиш лише Lesen і почнеш з Hören
> - [ ] складеш іспит в іншій аудиторії пізніше того ж дня
>
> **Пояснення:** *Wenn Sie erst nach dem Beginn der Einführung zur Prüfung im Prüfungsraum eintreffen, können Sie an der Prüfung nicht mehr teilnehmen.* А якщо не зʼявитися на одну частину, іспит вважають перерваним і сертифіката не видають.

> [!quiz] Дедлайн подачі документів — 15 липня. Коли найпізніше варто складати цифровий TestDaF?
> level: C1 · type: single · id: dp-c1-01-q14
> - [ ] 10 липня: результати показують одразу після Sprechen
> - [x] із запасом, щонайменше за 3 тижні до дедлайну, за датою «Ergebnis» у таблиці термінів
> - [ ] будь-коли: виші чекають результатів скільки треба
> - [ ] не пізніше ніж за 6 місяців
>
> **Пояснення:** оцінювання цифрового TestDaF триває приблизно 3 тижні, паперового — близько 6. testdaf.de радить звіряти дату результату з дедлайнами вишу. Раніше вказаної дати результатів не повідомляють.

> [!quiz] У тебе TDN 4 · 4 · 3 · 5, а потрібно 4 × 4. Що можна зробити?
> level: C1 · type: single · id: dp-c1-01-q15
> - [ ] перескласти лише Schreiben
> - [x] скласти весь TestDaF знову, усі чотири частини в один день
> - [ ] додати TDN 5 зі Sprechen до Schreiben
> - [ ] нічого: TestDaF можна складати лише раз на рік
>
> **Пояснення:** Prüfungsordnung TestDaF: усі частини обовʼязкові й складаються *an einem Prüfungstermin*; повторювати іспит можна *beliebig oft*. Окремої перездачі частини, як у деяких інших іспитах, тут немає; є лише комбінований сертифікат (з 12.05.2026, найкращі частини з цифрових спроб за ≤ 6 міс., 29 €, визнання — на розсуд вишу).

> [!quiz] Які з цих типів завдань є в частині Lesen? Обери всі.
> level: C1 · type: multi · id: dp-c1-01-q16
> - [x] *Lückentext ergänzen*
> - [x] *Sprachhandlungen zuordnen*
> - [x] *Aussagen Kategorien zuordnen*
> - [ ] *Aussagen Personen zuordnen*
> - [ ] *Gliederungspunkte zu Vortrag ergänzen*
>
> **Пояснення:** *Aussagen Personen zuordnen* і *Gliederungspunkte…* — відеозавдання з Hören. Назви схожі, тож запамʼятай: у Lesen — категорії й мовні дії, у Hören — люди й план доповіді.

> [!quiz] Sprachhandlungen zuordnen. «Zwar sind Nachtzüge langsamer als Flugzeuge, das will ich gar nicht bestreiten. Dafür sparen sie aber eine Hotelnacht.» Яку дію виконує автор?
> level: C1 · type: single · id: dp-c1-01-q17
> - [x] *einräumen* (визнавати, поступатися)
> - [ ] *kritisieren* (критикувати)
> - [ ] *vergleichen* (порівнювати)
> - [ ] *begründen* (обґрунтовувати)
>
> **Пояснення:** *Zwar…* + *das will ich gar nicht bestreiten* — автор визнає аргумент іншої сторони. Порівняння (*langsamer als*) тут лише зміст, а не мета речення: тест питає, що автор **робить**.

> [!quiz] Begriffspaar «Vorteil – Nachteil» (про нічні поїзди): «Wer im Liegewagen reist, kommt oft ausgeruhter an als nach einem Frühflug.»
> level: C1 · type: single · id: dp-c1-01-q18
> - [x] Vorteil
> - [ ] Nachteil
> - [ ] обидва
>
> **Пояснення:** *ausgeruhter ankommen* — приїхати більш відпочилим, ніж після раннього рейсу. Недоліку в реченні немає, отже — Vorteil.

> [!quiz] Schreiben, завдання 2: доповни звороти для опису графіка
> level: C1 · type: fill · id: dp-c1-01-q19
>
> ```text fill
> Aus der Grafik [[geht]] hervor, dass immer mehr Menschen nachts reisen. (випливає)
> Im Vergleich [[zum]] Vorjahr ist der Anteil deutlich gestiegen.
> Der Anteil ist um fünf [[Prozentpunkte]] gestiegen. (не «відсотків»)
> Text und Grafik stimmen darin [[überein]], dass die Nachfrage wächst.
> ```
>
> **Пояснення:** *hervorgehen aus* — «випливати з»; *im Vergleich zum* (zu + dem); різниця часток — *Prozentpunkte*; *übereinstimmen* відокремлюване, тому в головному реченні *stimmen … überein*. Більше зворотів — у [[Deutsch - C1 - 19. Письмо — Erörterung, Stellungnahme, опис графіка]].

> [!quiz] Склади зворот для «Optionen abwägen»: «Якщо зважити обидва варіанти, на користь другого говорить більше.»
> level: C1 · type: order · id: dp-c1-01-q20
>
> ```text order
> Wenn man
> beide Optionen
> gegeneinander abwägt,
> spricht mehr
> für die zweite.
> spricht für mehr ✗
> ```
>
> **Пояснення:** підрядне з *wenn* — дієслово в кінці (*abwägt*), тоді головне речення починається з дієслова (*spricht*). *etwas spricht für…* — «щось говорить на користь…».

> [!quiz] «Maßnahmen kritisieren»: заповни звороти (ти на інформаційному заході міста)
> level: C1 · type: fill · id: dp-c1-01-q21 · bank: von, an
>
> ```text fill
> Ich halte diese Maßnahme [[für]] wenig sinnvoll.
> Damit trifft man vor allem diejenigen, die [[auf]] die Nachtbusse angewiesen sind.
> Ich würde stattdessen [[vorschlagen|anregen]], den Takt nur zu verlängern.
> ```
>
> **Пояснення:** *etwas für … halten* — «вважати чимось»; *angewiesen sein auf + Akk* — «залежати від»; *vorschlagen* — «пропонувати». *von* і *an* — типові помилки на місці *für / auf*: ~~an etwas angewiesen~~, ~~von wenig sinnvoll halten~~.

> [!quiz] Що за RO-DT означає TDN 5 в усіх частинах?
> level: C1 · type: single · id: dp-c1-01-q22
> - [ ] це те саме, що сертифікат C2
> - [x] особливо високі знання, вищі за рівень, потрібний для вступу
> - [ ] мінімальна вимога для магістратури
> - [ ] право викладати німецьку
>
> **Пояснення:** RO-DT, § 4 (5): *Das TDN 5 liegt über dem für die Zulassung oder Einschreibung erforderlichen Niveau.* TestDaF вимірює рівні приблизно від B2 до C1. Рівень C2 він не засвідчує, і магістратура окремо TDN 5 не вимагає.

> [!quiz] Короткі відповіді (Kurzantworten) у Hören. Як краще записати?
> level: C1 · type: single · id: dp-c1-01-q23
> - [x] ключове слово чи коротку групу слів, точно за змістом
> - [ ] повне речення, щоб показати граматику
> - [ ] українське слово, якщо німецьке забув
> - [ ] нічого, бо короткі відповіді не оцінюють
>
> **Пояснення:** формат так і називається — *Kurzantwort*: для таблиці чи плану потрібне одне-два слова. Короткі відповіді перевіряють навчені оцінювачі, і перевіряють зміст, тож повне речення лише забирає час.

> [!quiz] Що з цього правда про допоміжні засоби й повторне складання TestDaF?
> level: C1 · type: single · id: dp-c1-01-q24
> - [ ] одномовний словник дозволено в Schreiben
> - [ ] повторно складати можна не частіше ніж раз на пів року
> - [x] допоміжних засобів немає в жодній частині, а складати можна скільки завгодно разів
> - [ ] власні нотатки можна брати в Sprechen
>
> **Пояснення:** TestDaF-Prüfungsordnung: § 8 — *keine Hilfsmittel zugelassen*, § 7 — *beliebig oft wiederholt werden*. Одномовний паперовий словник дозволено в письмовій DSH (RO-DT, Anlage 1 § 10), а не в TestDaF.

## Фішки

> [!reel] 🧪 Ти тестуєш тест
> Кожен учасник цифрового TestDaF виконує ще й пробні завдання (*Erprobungsaufgaben*): так їх перевіряють на справжніх кандидатах, перш ніж зарахувати в бойові. Тому тест іноді довший за таблицю, а одного типу буває два завдання. Яке з них «рахується», тобі не скажуть.

> [!reel] 🏅 TestDaF має знак якості
> Асоціація мовних тестувальників Європи (ALTE) перевіряла TestDaF у 2007, 2012 і 2017 роках і дала йому знак якості Q-Mark. Паперова версія за підсумками четвертого аудиту зберігає його до квітня 2028 року.

> [!reel] 🎚️ Чому «20», а не «34»
> У Lesen 34 відповіді, у Hören 30, але на сертифікаті в кожній частині стоїть максимум 20. Сирі бали переводять на єдину шкалу, щоб 13 у Lesen і 13 у Sprechen означали той самий рівень у будь-якому варіанті тесту. Тому «скільки правильних = скільки балів» не рахується.

## Джерела та що почитати

- [testdaf.de — Testaufbau digitaler TestDaF](https://www.testdaf.de/de/teilnehmende/der-digitale-testdaf/aufbau-des-digitalen-testdaf/): порядок частин, 7 + 7 + 2 + 7 завдань, items, час, пробні завдання; заборона повертатися назад.
- [testdaf.de — Testauswertung digitaler TestDaF](https://www.testdaf.de/de/teilnehmende/der-digitale-testdaf/auswertung-des-digitalen-testdaf/): шкала 0–20, межі TDN, критерії Schreiben і Sprechen.
- [testdaf.de — Termine und Anmeldung](https://www.testdaf.de/de/teilnehmende/mein-testdaf/testdaf-termine-und-anmeldung/): строк оцінювання (≈ 3 тижні цифровий, ≈ 6 тижнів паперовий).
- [testdaf.de — Nachweis der Deutschkenntnisse für das Studium](https://www.testdaf.de/de/hochschulen/der-testdaf-und-hochschulen/nachweis-der-deutschkenntnisse-fuer-das-studium/): TDN 4 × 4, диференційовані вимоги, аудити ALTE.
- [g.a.s.t. — Regeln für den Prüfungstag (PDF, грудень 2025)](https://www.testdaf.de/fileadmin/testdaf/downloads/Dokumente/8.6_Regeln_fuer_den_Pruefungstag_2026.pdf): документи, запізнення, заборонені предмети, виключення.
- [HRK / KMK — Rahmenordnung RO-DT з додатками (PDF, ред. 2025)](https://www.goethe.de/pro/relaunch/prf/rahmenordnung/Rahmenordnung-ueber-Deutsche-Sprachpruefungen-fuer-das-Studium-an-deutschen-Hochschulen.pdf): § 4 про TestDaF, § 8 про звільнення, додаток 2 — TestDaF-Prüfungsordnung (повторення, допоміжні засоби, рекламація).
- [testdaf.de — Vorbereitung auf den digitalen TestDaF](https://www.testdaf.de/de/teilnehmende/der-digitale-testdaf/vorbereitung-auf-den-digitalen-testdaf/): безкоштовні модельні тести, туторіали до кожного типу завдань, пробні терміни в центрах.

> [!important] Підсумок
> - Цифровий TestDaF: **Lesen → Hören → Schreiben → Sprechen**, на компʼютері в тестовому центрі; у межах частини **назад не повернешся**.
> - Кожна частина — **0–20 балів**: 5–9 — TDN 3, 10–15 — TDN 4, 16–20 — TDN 5. **TDN 4 в усіх частинах** за RO-DT відкриває будь-яку програму; виш може вимагати менше або більше по окремих частинах. Сума 0–80 цього не замінює.
> - Пробні завдання не рахуються, але розпізнати їх не можна, тож роби все на повну.
> - Схема дій у Lesen і Hören: сигнальні слова (*allerdings, zuerst, zwar*), перефразування замість дослівних збігів, короткі відповіді ключовими словами.
> - Sprechen — сім мовних дій, разом ≈ 12 хв: назви дію, не мовчи, обирай регістр.
> - День іспиту: той самий документ, що під час реєстрації, без запізнень, без годинника. Результат — за ≈ 3 тижні; перескладати можна скільки завгодно, але лише всі частини разом; з 12.05.2026 є комбінований сертифікат (найкращі частини, ≤ 6 міс., 29 €, визнання — на розсуд вишу).
