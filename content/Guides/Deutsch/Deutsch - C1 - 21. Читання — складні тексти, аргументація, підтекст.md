---
title: Читання — складні тексти, аргументація, підтекст
id: de-c1-lesen
level: C1
icon: px:magnifier
tags: [deutsch, c1, skills, lesen, ironie, argumentation, goethe-c1, telc-c1, testdaf]
prerequisites: ["[[Deutsch - B2 - 27. Читання — довгі тексти, позиції й висновки]]", "[[Deutsch - C1 - 08. Звʼязність тексту — конектори, відсилання, wobei]]"]
estimatedMinutes: 55
---

# Читання — складні тексти, аргументація, підтекст

> [!success] Після цієї теми ти зможеш
> - розпізнавати **іронію**, **натяки** й **оцінку між рядками** в коментарі, колонці чи глосі;
> - розкладати аргументацію автора: **головна теза**, докази, поступки, хибні аргументи (*Scheinargument, Totschlagargument, Verallgemeinerung*);
> - розрізняти, **що автор стверджує**, **що він цитує** і **що лише натякає**;
> - знати формат Lesen на **Goethe-Zertifikat C1**, **telc Deutsch C1 Hochschule** і **TestDaF** та стратегію для кожного типу завдань.

## Передбач

> [!quiz] У колонці про новий вокзал написано: *Zehn Jahre Bauzeit, dreimal so teuer wie geplant – ein Meisterwerk deutscher Planungskunst.* Що думає автор?
> level: C1 · type: single · id: de-c1-lesen-q01
> - [ ] Він щиро захоплюється німецьким плануванням.
> - [x] Він іронізує: будівництво було надто довгим і дорогим.
> - [ ] Він нейтрально наводить факти без оцінки.
> - [ ] Він хвалить архітектуру вокзалу.
>
> **Пояснення:** факти (*zehn Jahre, dreimal so teuer*) прямо суперечать похвалі (*Meisterwerk … Planungskunst*). Коли оцінка «надто гарна» для поданих фактів, це **іронія**: автор має на увазі протилежне. Буквальне прочитання — найчастіша помилка в завданнях на позицію автора.

## Пояснення

### Формат Lesen на іспитах C1

**Goethe-Zertifikat C1 — Lesen** (65 хв, 4 частини, 30 завдань, словники заборонені):

| Teil | Текст | Завдання | Items | Рекомендовано |
|---|---|---|---|---|
| 1 | інформаційна стаття з журналу | пропуски в тексті, вибір з 4 варіантів (граматика й лексика) | 8 | 10 хв |
| 2 | журнальна стаття з великою кількістю інформації | вибір з 3 варіантів: головні думки й деталі | 7 | 20 хв |
| 3 | коментар або репортаж з преси | вставити речення в пропуски, 2 речення зайві | 8 | 20 хв |
| 4 | (науково-)популярні дописи фахівців | хто що каже? 3 особи; 2 твердження не належать нікому (0) | 7 | 15 хв |

**telc Deutsch C1 Hochschule — Leseverstehen + Sprachbausteine** (90 хв разом, ≈ 2200 слів тексту):

| Частина | Що перевіряють | Items |
|---|---|---|
| Teil 1 | реконструкція тексту: підібрати фрагменти до пропусків | 6 |
| Teil 2 | вибіркове читання: підібрати твердження до абзаців | 6 |
| Teil 3 | деталі: richtig / falsch / nicht im Text + 1 завдання на загальне розуміння (заголовок) | 11 + 1 |
| Sprachbausteine | граматика й правопис у тексті, вибір з 4 | 22 |

**TestDaF (цифровий) — Lesen** (≈ 55 хв, 7 типів завдань, 34 items, фіксований порядок, повернутися назад не можна): *Lückentext ergänzen* (5), *Textabschnitte ordnen* (4), *Multiple-Choice* (7), *Sprachhandlungen zuordnen* (4), *Aussagen Kategorien zuordnen* (7), *Aussagen einem Begriffspaar zuordnen* (4), *Fehler in Zusammenfassung erkennen* (3). Тексти — звіти про дослідження, коментарі, описові й аргументативні тексти, часто з графіком.

> [!note] Що спільного
> На всіх трьох іспитах C1 перевіряють не лише «що написано», а й **що автор робить текстом**: критикує, обмежує, порівнює, натякає. TestDaF прямо просить зіставити **мовні дії** (*Sprachhandlungen*: *kritisieren, einräumen, vergleichen, begründen*) з фрагментами. Формати — за чинними документами (Goethe *Modellsatz* квітня 2026, telc *Handbuch*, testdaf.de); завдання в цій темі — власні.

### Шари тексту: сказане, процитоване, натякнуте

> [!diagram] Три шари, які треба розрізняти
> ```yaml
> layout: compare
> columns: { a: "стверджує автор", b: "передає чужу думку", c: "натякає автор" }
> nodes:
>   - { id: a1, col: a, label: "пряма теза", text: "Das Gesetz ist ein Fehler.", note: "Indikativ, оцінні слова", tone: yellow }
>   - { id: a2, col: a, label: "висновок", text: "Unterm Strich bleibt wenig übrig.", note: "кінець абзацу / тексту", tone: yellow }
>   - { id: b1, col: b, label: "непряма мова", text: "Die Ministerin sagt, das Gesetz sei gerecht.", note: "Konjunktiv I = дистанція", tone: pink }
>   - { id: b2, col: b, label: "чужа позиція", text: "Befürworter argumentieren, …", note: "не плутати з автором", tone: pink }
>   - { id: c1, col: c, label: "іронія", text: "ein Meisterwerk der Planung", note: "похвала + погані факти", tone: gray }
>   - { id: c2, col: c, label: "натяк", text: "Zufällig profitiert davon der Schwager.", note: "zufällig, angeblich, sogenannt", tone: gray }
> steps:
>   - { focus: [a1, a2], note: "Те, за що автор відповідає сам: Indikativ, оцінки, висновок. Саме це питають у завданні «Was meint der Autor?»." }
>   - { focus: [b1, b2], note: "Чужі думки: Konjunktiv I (sei, habe), laut, Befürworter meinen, Kritiker wenden ein. Автор може з ними не погоджуватися." }
>   - { focus: [c1, c2], note: "Найтонший шар: іронія і натяк. Слова-сигнали: zufällig, angeblich, sogenannt, лапки, «надто» гарна похвала. Автор не каже прямо, але читач має зрозуміти." }
> ```
> Колонки — три шари тексту; кольори лише розділяють колонки.

### Сигнали іронії й натяку

| Сигнал | Приклад | Що означає |
|---|---|---|
| похвала, що суперечить фактам | *Drei Jahre Verspätung – eine Glanzleistung.* | протилежне до сказаного |
| лапки | *Die „Reform“ ändert fast nichts.* | автор дистанціюється від слова |
| *sogenannt, angeblich, vermeintlich* | *die sogenannte Entlastung* | автор не вірить у назву |
| *zufällig, ausgerechnet* | *Ausgerechnet der Minister fliegt privat.* | натяк на суперечність або вигоду |
| риторичне питання | *Wer hätte das ahnen können?* | «усі могли» — критика |
| перебільшення / применшення | *ein kleines Problem von nur 2 Milliarden* | іронічне применшення |
| частки | *Das war ja wieder mal ein toller Plan.* | *ja, mal, wieder* + похвала = невдоволення |

> [!tip] Тест на іронію
> Спитай себе: **чи міг би автор сказати це серйозно, знаючи ці факти?** Якщо ні — шукай протилежне значення. Іронія майже завжди спирається на контраст між оцінкою і фактами в тому ж реченні чи абзаці.

### Аргументація: сильні й хибні аргументи

Щоб оцінити текст, розклади його: **Kernthese** (що автор доводить) → **аргументи** → **докази** (дані, приклади, авторитети) → **поступка** (*zwar … aber, einräumen*) → **висновок**. Потім перевір, чи аргументи справжні:

| Хибний прийом | Приклад | Чому слабкий |
|---|---|---|
| **Verallgemeinerung** (узагальнення) | *Alle Jugendlichen hängen nur am Handy.* | один випадок → «усі» |
| **Scheinargument** (позірний аргумент) | *Das war schon immer so, also ist es richtig.* | звичка ≠ доказ |
| **Totschlagargument** («вбивчий» аргумент) | *Das ist doch weltfremd!* | закриває дискусію без доводів |
| **Strohmann** (підміна тези) | A: *weniger Autos in der Innenstadt* → B: *A will Autos verbieten!* | спростовують тезу, якої ніхто не висував |
| **falsches Dilemma** | *Entweder wir sparen oder das Land geht unter.* | лише два варіанти, хоча є інші |
| **Autoritätsargument** без підстав | *Ein bekannter Schauspieler sagt, …* | авторитет не з цієї галузі |

### Текстові жанри преси

| Жанр | Що це | Позиція автора |
|---|---|---|
| *Nachricht, Bericht* | новина, звіт | має бути нейтральною |
| *Reportage* | репортаж з деталями й сценами | помітна через вибір деталей |
| *Leitartikel* | редакційна стаття на першій шпальті | чітка, від імені видання |
| *Kommentar* | коментар до події | чітка, від імені автора |
| *Kolumne* | регулярна авторська рубрика | особиста, часто з гумором |
| *Glosse* | коротка, загострена, іронічна замітка | через іронію |
| *Feuilleton* | розділ культури (рецензії, есеї) | оцінна |

### Зразок: глоса з підтекстом

> [!example] Glosse: Die Rettung der Kaffeepause
> Endlich hat sich jemand des drängendsten Problems unserer Zeit angenommen: der Kaffeepause. Eine Unternehmensberatung empfiehlt, sie künftig „ergebnisorientiert“ zu gestalten – mit Tagesordnung, Protokoll und einem „Pausenverantwortlichen“. Zufällig bietet dieselbe Beratung Seminare zur effizienten Pausengestaltung an, zum Schnäppchenpreis von 900 Euro pro Person.
>
> Zugegeben: Wer in einer Pause über das Projekt spricht, arbeitet streng genommen. Aber genau darin liegt ihr Wert. Die besten Ideen entstehen bekanntlich nicht in Sitzungen, sondern zwischen Tür und Angel. Wer auch das noch protokolliert, hat am Ende vor allem eines: ein sehr ordentliches Protokoll über eine Pause, die keine mehr war.

Розбір: **Kernthese** — регламентувати перерви безглуздо, бо їхня цінність — у спонтанності. Іронія: *das drängendste Problem unserer Zeit*, *Schnäppchenpreis von 900 Euro*. Натяк: *Zufällig bietet dieselbe Beratung Seminare … an* — порада вигідна самим консультантам. Поступка: *Zugegeben: …* → *Aber …*. Лапки (*„ergebnisorientiert“*, *„Pausenverantwortlichen“*) — дистанція від чужої лексики.

## Приклади

- *Die „Entlastung“ beträgt für die meisten Haushalte gerade einmal drei Euro im Monat.* — «Полегшення» для більшості домогосподарств становить якихось три євро на місяць.
- *Ausgerechnet die Partei, die das Gesetz eingebracht hat, stimmte dagegen.* — Саме та партія, яка внесла закон, проголосувала проти.
- *Der Autor spielt auf einen früheren Skandal an.* — Автор натякає на попередній скандал.
- *Die Formulierung suggeriert, dass es keine Alternative gibt.* — Формулювання створює враження, що альтернативи немає.
- *Das ist eine unzulässige Verallgemeinerung.* — Це неприпустиме узагальнення.
- *Mit einem Augenzwinkern beschreibt die Kolumnistin ihren ersten Elternabend.* — Колумністка з легкою іронією описує свої перші батьківські збори.
- *Der Leitartikel verharmlost die Folgen der Entscheidung.* — Редакційна стаття применшує наслідки рішення.
- *Diese Lesart wird durch den letzten Absatz bestätigt.* — Таке прочитання підтверджує останній абзац.
- *Im Feuilleton erschien eine scharfe Kritik der Inszenierung.* — У розділі культури зʼявилася гостра критика постановки.
- *Der Text ist bewusst zugespitzt, um eine Debatte anzustoßen.* — Текст навмисно загострено, щоб розпочати дискусію.

## Слова

### Підтекст і тон

> [!word] die Ironie
> ipa: /iʁoˈniː/ · pos: noun · level: B2 · id: de-c1-lesen-w01
> uk: іронія
> forms: die Ironien (рідко)
> example: Die **Ironie** des Textes ist nicht leicht zu erkennen. — Іронію тексту нелегко розпізнати.
> note: наголос на останньому складі. Прикметник ironisch. Ironie des Schicksals — іронія долі.

> [!word] der Sarkasmus
> ipa: /zaʁˈkasmʊs/ · pos: noun · level: C1 · id: de-c1-lesen-w02
> uk: сарказм
> forms: die Sarkasmen (рідко)
> example: Sein **Sarkasmus** verletzt manche Leser. — Його сарказм ображає деяких читачів.
> note: різкіша, зла форма іронії. -mus → der (тенденція). Прикметник sarkastisch.

> [!word] die Andeutung
> ipa: /ˈandɔʏ̯tʊŋ/ · pos: noun · level: C1 · id: de-c1-lesen-w03
> uk: натяк
> forms: die Andeutungen
> example: Der Artikel macht nur vage **Andeutungen**. — Стаття лише туманно натякає.
> note: від andeuten. Andeutungen machen — робити натяки. -ung → die.

> [!word] anspielen (auf + Akk)
> ipa: /ˈanʃpiːlən/ · pos: verb · level: C1 · id: de-c1-lesen-w04
> uk: натякати (на щось)
> forms: anspielen → spielte an → hat angespielt
> example: Worauf **spielt** die Autorin mit dieser Bemerkung **an**? — На що натякає авторка цим зауваженням?
> note: відокремлюване. Іменник die Anspielung (auf + Akk). У спорті ще й «дати пас».

> [!word] suggerieren
> ipa: /zuɡeˈʁiːʁən/ · pos: verb · level: C1 · id: de-c1-lesen-w05
> uk: навіювати, створювати враження
> forms: suggerieren → suggerierte → hat suggeriert
> example: Die Überschrift **suggeriert** einen Skandal, den es nicht gibt. — Заголовок створює враження скандалу, якого немає.
> note: часто з критикою: текст підштовхує до висновку, не доводячи його. gg тут [ɡ].

> [!word] die Unterstellung
> ipa: /ʊntɐˈʃtɛlʊŋ/ · pos: noun · level: C1 · id: de-c1-lesen-w06
> uk: інсинуація, безпідставне звинувачення
> forms: die Unterstellungen
> example: Das ist eine bösartige **Unterstellung**! — Це злісна інсинуація!
> note: від unterstellen (невідокремлюване, наголос на -stel-): приписувати комусь погані наміри без доказів.

> [!word] mehrdeutig
> ipa: /ˈmeːɐ̯dɔʏ̯tɪç/ · pos: adj · level: C1 · id: de-c1-lesen-w07
> uk: багатозначний, неоднозначний
> example: Der letzte Satz ist bewusst **mehrdeutig**. — Останнє речення навмисно неоднозначне.
> note: синоніми: zweideutig (часто з натяком), doppeldeutig. Протилежне: eindeutig.

> [!word] der Seitenhieb
> ipa: /ˈzaɪ̯tn̩hiːp/ · pos: noun · level: C1 · id: de-c1-lesen-w08
> uk: шпилька, ущипливий випад
> forms: die Seitenhiebe
> example: Im Nebensatz verteilt der Autor einen **Seitenhieb** auf die Regierung. — У підрядному реченні автор мимохідь дає шпильку урядові.
> note: einen Seitenhieb austeilen / verteilen (auf + Akk). Буквально «удар збоку». b у кінці — [p].

> [!word] das Augenzwinkern
> ipa: /ˈaʊ̯ɡn̩ˌtsvɪŋkɐn/ · pos: noun · level: C1 · id: de-c1-lesen-w09
> uk: підморгування; легка іронія
> forms: — (без множини)
> example: Der Text ist mit einem **Augenzwinkern** geschrieben. — Текст написано з легкою іронією.
> note: mit einem Augenzwinkern — не всерйоз, жартома. Субстантивований інфінітив → das.

> [!word] herablassend
> ipa: /hɛˈʁaplasn̩t/ · pos: adj · level: C1 · id: de-c1-lesen-w10
> uk: зверхній, поблажливий
> example: Der Kommentar spricht **herablassend** über die Demonstrierenden. — Коментар зверхньо говорить про демонстрантів.
> note: від sich herablassen. Синонім: von oben herab. Сигнал тону автора — корисний для завдань на позицію.

> [!word] die Haltung
> ipa: /ˈhaltʊŋ/ · pos: noun · level: B2 · id: de-c1-lesen-w11
> uk: позиція, ставлення; постава
> forms: die Haltungen
> example: Welche **Haltung** nimmt der Autor zu dem Thema ein? — Яку позицію займає автор щодо цієї теми?
> note: eine Haltung einnehmen / vertreten. Також тілесна постава: eine gerade Haltung.

> [!word] die Intention
> ipa: /ɪntɛnˈtsi̯oːn/ · pos: noun · level: C1 · id: de-c1-lesen-w12
> uk: намір, мета (автора)
> forms: die Intentionen
> example: Die **Intention** des Textes ist es, zu provozieren. — Мета тексту — спровокувати.
> note: книжне до die Absicht. Типове питання: Welche Intention verfolgt der Verfasser?

> [!word] die Lesart
> ipa: /ˈleːsʔaːɐ̯t/ · pos: noun · level: C1 · id: de-c1-lesen-w13
> uk: прочитання, тлумачення
> forms: die Lesarten
> example: Für diese **Lesart** spricht der letzte Absatz. — На користь такого тлумачення свідчить останній абзац.
> note: lesen + die Art. Eine andere Lesart wäre … — інакше це можна прочитати так …

### Аргументація

> [!word] die Kernthese
> ipa: /ˈkɛʁnˌteːzə/ · pos: noun · level: C1 · id: de-c1-lesen-w14
> uk: головна теза
> forms: die Kernthesen
> example: Die **Kernthese** steht erst im letzten Absatz. — Головна теза стоїть лише в останньому абзаці.
> note: der Kern + die These. Синоніми: die Hauptthese, die zentrale Aussage.

> [!word] der Argumentationsstrang
> ipa: /aʁɡumɛntaˈtsi̯oːnsˌʃtʁaŋ/ · pos: noun · level: C1 · id: de-c1-lesen-w15
> uk: лінія аргументації
> forms: die Argumentationsstränge
> example: Der Text verfolgt zwei **Argumentationsstränge**. — Текст розвиває дві лінії аргументації.
> note: der Strang — шнур, нитка. Пор. der rote Faden (наскрізна лінія). Множина з умлаутом.

> [!word] der Trugschluss
> ipa: /ˈtʁuːkʃlʊs/ · pos: noun · level: C1 · id: de-c1-lesen-w16
> uk: хибний висновок, омана
> forms: die Trugschlüsse
> example: Es ist ein **Trugschluss**, dass Verbote allein helfen. — Хибно думати, що допоможуть самі заборони.
> note: trügen (вводити в оману) + der Schluss. g перед sch — [k].

> [!word] das Scheinargument
> ipa: /ˈʃaɪ̯nʔaʁɡuˌmɛnt/ · pos: noun · level: C1 · id: de-c1-lesen-w17
> uk: позірний аргумент
> forms: die Scheinargumente
> example: «Das haben wir immer so gemacht» ist ein **Scheinargument**. — «Ми завжди так робили» — позірний аргумент.
> note: Schein- — «несправжній»: der Scheinriese, die Scheinfirma. Рід від das Argument.

> [!word] das Totschlagargument
> ipa: /ˈtoːtʃlaːkʔaʁɡuˌmɛnt/ · pos: noun · level: C1 · id: de-c1-lesen-w18
> uk: «вбивчий» аргумент, що закриває дискусію
> forms: die Totschlagargumente
> example: «Das ist doch unrealistisch» ist ein typisches **Totschlagargument**. — «Це ж нереалістично» — типовий аргумент, що закриває розмову.
> note: розмовно-публіцистичне. Такий аргумент нічого не доводить, лише обриває обговорення.

> [!word] pauschal
> ipa: /paʊ̯ˈʃaːl/ · pos: adj · level: C1 · id: de-c1-lesen-w19
> uk: огульний, узагальнений; паушальний
> example: Solche **pauschalen** Urteile helfen niemandem. — Такі огульні судження нікому не допомагають.
> note: у тексті — критика: pauschal verurteilen. В економіці нейтральне: die Pauschale (фіксована сума). Наголос на -schal.

> [!word] verallgemeinern
> ipa: /fɛɐ̯ʔalɡəˈmaɪ̯nɐn/ · pos: verb · level: C1 · id: de-c1-lesen-w20
> uk: узагальнювати
> forms: verallgemeinern → verallgemeinerte → hat verallgemeinert
> example: Man darf von einem Einzelfall nicht **verallgemeinern**. — З одного випадку не можна робити узагальнень.
> note: іменник die Verallgemeinerung. ver- + allgemein + -ern; ʔ після ver-.

> [!word] die Zuspitzung
> ipa: /ˈtsuːʃpɪtsʊŋ/ · pos: noun · level: C1 · id: de-c1-lesen-w21
> uk: загострення
> forms: die Zuspitzungen
> example: Die **Zuspitzung** ist ein typisches Mittel der Glosse. — Загострення — типовий засіб глоси.
> note: від zuspitzen (картка вже є в курсі). Також політичне: die Zuspitzung der Krise.

> [!word] verharmlosen
> ipa: /fɛɐ̯ˈhaʁmloːzn̩/ · pos: verb · level: C1 · id: de-c1-lesen-w22
> uk: применшувати (небезпеку), багателізувати
> forms: verharmlosen → verharmloste → hat verharmlost
> example: Der Bericht **verharmlost** die Risiken. — Звіт применшує ризики.
> note: ver- + harmlos. Сигнал оцінки: автор критикує, що хтось подає проблему меншою, ніж вона є.

> [!word] beschönigen
> ipa: /bəˈʃøːnɪɡn̩/ · pos: verb · level: C1 · id: de-c1-lesen-w23
> uk: прикрашати (дійсність), лакувати
> forms: beschönigen → beschönigte → hat beschönigt
> example: Die Firma **beschönigt** ihre Zahlen. — Фірма прикрашає свої показники.
> note: be- + schön. Пор. der Euphemismus — евфемізм. Близьке: schönreden.

> [!word] die Untertreibung
> ipa: /ʊntɐˈtʁaɪ̯bʊŋ/ · pos: noun · level: C1 · id: de-c1-lesen-w24
> uk: применшення, недомовлення
> forms: die Untertreibungen
> example: «Ein kleines Problem» ist eine ironische **Untertreibung**. — «Невеличка проблема» — іронічне применшення.
> note: пара до die Übertreibung. Англ. understatement. unter- тут невідокремлюване, наголос на -trei-.

> [!word] die Polemik
> ipa: /poˈleːmɪk/ · pos: noun · level: C1 · id: de-c1-lesen-w25
> uk: полеміка; різкі, упереджені нападки
> forms: die Polemiken
> example: Der Kommentar ist eher **Polemik** als Analyse. — Коментар — це радше нападки, ніж аналіз.
> note: у німецькій частіше негативне: несправедлива, агресивна критика. Прикметник polemisch (картка вже є).

> [!word] die Rhetorik
> ipa: /ʁeˈtoːʁɪk/ · pos: noun · level: C1 · id: de-c1-lesen-w26
> uk: риторика
> forms: — (без множини)
> example: Hinter der glänzenden **Rhetorik** steckt wenig Inhalt. — За блискучою риторикою мало змісту.
> note: rh = [ʁ]. Наголос на -to-. Прикметник rhetorisch: eine rhetorische Frage.

### Жанри й мова тексту

> [!word] der Leitartikel
> ipa: /ˈlaɪ̯tʔaʁˌtiːkl̩/ · pos: noun · level: C1 · id: de-c1-lesen-w27
> uk: передова (редакційна) стаття
> forms: die Leitartikel
> example: Im **Leitartikel** fordert die Zeitung eine Reform. — У передовій статті газета вимагає реформи.
> note: leiten + der Artikel. Виражає позицію редакції. Автор — der Leitartikler (рідко).

> [!word] das Feuilleton
> ipa: /fœjəˈtõː/ · pos: noun · level: C1 · id: de-c1-lesen-w28
> uk: розділ культури в газеті; есеїстичний текст
> forms: die Feuilletons
> example: Die Rezension erschien im **Feuilleton** der Zeitung. — Рецензія вийшла в розділі культури газети.
> note: з франц.; вимова «фьой(е)тон», в кінці носовий голосний. Не «фейлетон» в українському сенсі (сатира)!

> [!word] die Kolumne
> ipa: /koˈlʊmnə/ · pos: noun · level: C1 · id: de-c1-lesen-w29
> uk: колонка, авторська рубрика
> forms: die Kolumnen
> example: Sie schreibt jede Woche eine **Kolumne** über das Familienleben. — Щотижня вона пише колонку про сімейне життя.
> note: автор — der Kolumnist, die Kolumnistin. Наголос на -lum-.

> [!word] der Kommentator
> ipa: /kɔmɛnˈtaːtoːɐ̯/ · pos: noun · level: C1 · id: de-c1-lesen-w30
> uk: коментатор
> forms: die Kommentatoren
> example: Der **Kommentator** hält die Entscheidung für falsch. — Коментатор вважає рішення хибним.
> note: жінка: die Kommentatorin, мн. die Kommentatorinnen. У множині наголос зміщується: [kɔmɛntaˈtoːʁən].

> [!word] das Stilmittel
> ipa: /ˈʃtiːlˌmɪtl̩/ · pos: noun · level: C1 · id: de-c1-lesen-w31
> uk: стилістичний засіб
> forms: die Stilmittel
> example: Ironie ist das wichtigste **Stilmittel** der Glosse. — Іронія — найважливіший засіб глоси.
> note: der Stil + das Mittel; рід від Mittel. Приклади: Metapher, Übertreibung, rhetorische Frage.

> [!word] die Metapher
> ipa: /meˈtafɐ/ · pos: noun · level: C1 · id: de-c1-lesen-w32
> uk: метафора
> forms: die Metaphern
> example: «Eine Flut von Anträgen» ist eine **Metapher**. — «Потоп заяв» — метафора.
> note: ph = [f], наголос на -ta-. Прикметник metaphorisch.

> [!word] querlesen
> ipa: /ˈkveːɐ̯leːzn̩/ · pos: verb · level: C1 · id: de-c1-lesen-w33
> uk: швидко переглядати текст, читати навскіс
> forms: querlesen → las quer → hat quergelesen
> example: Ich habe den Bericht nur **quergelesen**. — Я лише побіжно переглянув звіт.
> note: відокремлюване; er liest quer. Синонім: überfliegen. Для іспиту: спершу querlesen, потім точно читати потрібні місця.

## Слухаємо

> [!listen] Напиши або скажи, що почув
> level: C1 · type: dictation · id: de-c1-lesen-l01
> audio: Die Formulierung suggeriert, dass es keine Alternative gibt.
> explain: *suggerieren* — створювати враження, не доводячи. Підрядне з *dass*: дієслово *gibt* у кінці.

> [!listen] Подкаст про колонку. Як ведуча оцінює текст?
> level: C1 · type: answer · id: de-c1-lesen-l02
> audio: A: Viele Leser haben die Kolumne wörtlich genommen und sich beschwert.
> audio: B: Dabei ist sie doch klar ironisch. Der Autor lobt die neue Regel so übertrieben, dass man merkt, wie absurd er sie findet.
> - [x] Колонка іронічна: перебільшена похвала показує, що автор вважає правило абсурдним.
> - [ ] Колонка серйозна, читачі зрозуміли її правильно.
> - [ ] Автор щиро підтримує нове правило.
> - [ ] Ведуча не має думки щодо тексту.
>
> **Пояснення:** *klar ironisch*; *lobt … so übertrieben, dass man merkt, wie absurd er sie findet*. Читачі помилилися, бо прочитали текст буквально (*wörtlich genommen*). Переклад: — Багато читачів сприйняли колонку буквально й поскаржилися. — Хоча вона ж очевидно іронічна. Автор так перебільшено хвалить нове правило, що видно, наскільки абсурдним він його вважає.

## Вимова

> [!speak] Скажи вголос: тлумачення
> level: C1 · id: de-c1-lesen-s01
> text: Für diese Lesart spricht vor allem der letzte Absatz.
> ipa: /fyːɐ̯ ˈdiːzə ˈleːsʔaːɐ̯t ʃpʁɪçt foːɐ̯ ˈaləm deːɐ̯ ˈlɛtstə ˈapzats/
> tip: *Lesart* — дві частини, ʔ перед *-art*; *spricht* — [ʃp]; *Absatz* — [ˈapzats], z = [ts].
> uk: На користь такого прочитання свідчить передусім останній абзац.

> [!speak] Скажи вголос: критика аргументу
> level: C1 · id: de-c1-lesen-s02
> text: Das ist eine unzulässige Verallgemeinerung.
> ipa: /das ɪst ˈaɪ̯nə ˈʊntsuːlɛsɪɡə fɛɐ̯ʔalɡəˈmaɪ̯nəʁʊŋ/
> tip: *unzulässige* — наголос на un-; *Verallgemeinerung* — наголос на -mei-, твердий приступ після ver-.
> uk: Це неприпустиме узагальнення.

## Типові помилки українців

> [!pitfall] Читаєш іронію буквально
> *Ein Meisterwerk der Planung* після «трьох років запізнення» — не похвала. Учні часто обирають варіант «автор задоволений», бо бачать позитивні слова. Перевіряй, чи **оцінка збігається з фактами**. Якщо ні — це іронія, і правильна відповідь протилежна до буквального значення.

> [!pitfall] Приписуєш авторові чужу думку
> *Die Ministerin betont, das Gesetz sei gerecht* — це думка міністерки, а не автора (Konjunktiv I = передача чужих слів). Так само *Kritiker wenden ein …, Befürworter argumentieren …* Позицію автора шукай у Indikativ, оцінних словах і висновку.

> [!pitfall] Feuilleton = фейлетон
> Хибний друг: німецьке ***das Feuilleton*** — це **розділ культури** газети (рецензії, есеї, театр, книжки), а не сатиричний фейлетон. Сатиричний жанр ближчий до ***die Glosse***. На TestDaF чи Goethe C1 «Feuilleton» у джерелі тексту підказує: ідеться про культуру.

> [!pitfall] Шукаєш ті самі слова замість змісту
> На C1 варіанти відповіді майже ніколи не повторюють лексику тексту. У тексті *Die Kosten wurden heruntergespielt*, у варіанті — *Der Autor meint, die Kosten seien verharmlost worden*. Шукай **синоніми й перефразування**, а варіант із точним збігом слів часто є пасткою.

## Ситуація: обговорення тексту в семінарі

> [!listen] Студенти готуються до семінару. У чому вони не погоджуються?
> level: C1 · type: answer · id: de-c1-lesen-l03
> audio: A: Ich finde den Kommentar überzeugend. Der Autor nennt viele Zahlen.
> audio: B: Schon, aber schau mal: Er schließt von einer einzigen Stadt auf ganz Deutschland.
> audio: A: Stimmt, das ist eine Verallgemeinerung.
> audio: B: Und der letzte Satz ist ein Totschlagargument: «Wer das anders sieht, ist naiv.»
> - [x] B бачить у коментарі узагальнення з одного міста й аргумент, що закриває дискусію; A погоджується щодо узагальнення.
> - [ ] A і B вважають коментар бездоганним.
> - [ ] B критикує, що в коментарі немає жодного числа.
> - [ ] A вважає, що автор пише про всю Європу.
>
> **Пояснення:** B вказує на два хибні прийоми: *von einer einzigen Stadt auf ganz Deutschland* (Verallgemeinerung) і *Wer das anders sieht, ist naiv* (Totschlagargument). A погоджується: *Stimmt, das ist eine Verallgemeinerung*. Чисел, навпаки, багато. Переклад: — Мені коментар здається переконливим. Автор наводить багато чисел. — Так, але глянь: він з одного-єдиного міста робить висновок про всю Німеччину. — Справді, це узагальнення. — А останнє речення — аргумент, що закриває дискусію: «Хто бачить це інакше, той наївний».

> [!speak] Ситуація: заперечи в семінарі
> level: C1 · id: de-c1-lesen-s03
> text: Schon, aber der Autor schließt von einem Einzelfall auf alle.
> ipa: /ʃoːn aːbɐ deːɐ̯ ˈaʊ̯toːɐ̯ ʃliːst fɔn ˈaɪ̯nəm ˈaɪ̯ntsl̩fal aʊ̯f ˈalə/
> tip: *schon, aber* — поступка з паузою після коми; *Einzelfall* — наголос на Ein-, z = [ts].
> uk: Так, але автор робить висновок з одного випадку про всіх.

## Landeskunde: Pressefreiheit und Selbstkontrolle

> [!example] Pressefreiheit und Selbstkontrolle
> Wer in Deutschland eine Zeitung aufschlägt, liest Texte, die durch das Grundgesetz besonders geschützt sind. Artikel 5 garantiert die Pressefreiheit und die Freiheit der Berichterstattung durch Rundfunk und Film; ausdrücklich heißt es dort: „Eine Zensur findet nicht statt.“ Ihre Schranken finden diese Rechte in den allgemeinen Gesetzen, im Jugendschutz und im Recht der persönlichen Ehre.
>
> Wer aber kontrolliert die Presse, wenn nicht der Staat? Darauf gab die Branche schon in den Fünfzigerjahren eine eigene Antwort. Als die Bundesregierung ein Bundespressegesetz plante, das eine staatliche Aufsicht vorgesehen hätte, gründeten fünf Verleger und fünf Journalisten im November 1956 in Bonn den Deutschen Presserat. Er arbeitet bis heute nach dem Prinzip der freiwilligen Selbstkontrolle und ist paritätisch besetzt, also je zur Hälfte mit Vertretern der Verlage und der Journalisten.
>
> Grundlage seiner Arbeit ist der Pressekodex, der 1973 erstmals beschlossen wurde und heute 16 Ziffern umfasst. Er verlangt unter anderem wahrhaftige Berichterstattung, sorgfältige Recherche und die Achtung der Persönlichkeitsrechte. Eine Ziffer schreibt die klare Trennung von redaktionellen Texten und Werbung vor: Leserinnen und Leser sollen erkennen können, welche Beiträge von einer unabhängigen Redaktion stammen. Jede Person kann sich beim Presserat über einen Artikel beschweren. Stellt er einen schweren Verstoß fest, kann er eine Rüge aussprechen, die die betroffene Zeitung abdrucken soll.
>
> Für das Lesen auf C1-Niveau ist dieses Wissen nützlicher, als es zunächst scheint. Eine Nachricht soll informieren und möglichst neutral sein, ein Kommentar oder Leitartikel darf dagegen offen Partei ergreifen. Eine Glosse wiederum spitzt zu und arbeitet mit Ironie. Viele Zeitungen kennzeichnen Meinungsbeiträge deshalb ausdrücklich, etwa mit Rubriken wie „Kommentar“ oder „Meinung“ und mit dem Namen der Autorin oder des Autors. Auch online sollen Anzeigen als solche erkennbar sein, zum Beispiel durch Hinweise wie „Anzeige“ oder „Sponsored“, die man beim schnellen Lesen allerdings leicht übersieht. Wer erkennt, zu welcher Textsorte ein Beitrag gehört, weiß bereits, wie stark er mit Wertungen rechnen muss. Problematisch wird es dort, wo die Grenzen verschwimmen: bei bezahlten Beiträgen, die wie redaktionelle Texte aussehen, oder bei Nachrichten, in die sich unauffällig Meinungen mischen. Wer kritisch liest, fragt deshalb nicht nur, was in einem Text steht, sondern auch, wer ihn geschrieben hat, für wen und mit welcher Absicht.

> [!quiz] Nach dem Text: Warum wurde der Deutsche Presserat gegründet?
> level: C1 · type: single · id: de-c1-lesen-q02
> - [ ] Das Grundgesetz schrieb seine Gründung vor.
> - [x] Die Presse wollte einer geplanten staatlichen Aufsicht durch eine eigene Selbstkontrolle zuvorkommen.
> - [ ] Die Regierung wollte die Zensur wieder einführen und gründete ihn selbst.
> - [ ] Werbefirmen wollten mehr Einfluss auf Zeitungen.
>
> **Пояснення:** у тексті: *Als die Bundesregierung ein Bundespressegesetz plante, das eine staatliche Aufsicht vorgesehen hätte, gründeten fünf Verleger und fünf Journalisten … den Deutschen Presserat.* Його заснувала сама галузь, а не уряд, на принципі *freiwillige Selbstkontrolle*.

> [!quiz] Nach dem Text: Was stimmt über den Pressekodex? Wähle alle richtigen Aussagen.
> level: C1 · type: multi · id: de-c1-lesen-q03
> - [x] Er wurde 1973 erstmals beschlossen.
> - [x] Er verlangt eine klare Trennung von Redaktion und Werbung.
> - [x] Bei schweren Verstößen kann der Presserat eine Rüge aussprechen.
> - [ ] Er ist ein staatliches Gesetz mit Geldstrafen.
>
> **Пояснення:** 1973, *Trennung von redaktionellen Texten und Werbung*, *Rüge* — усе є в тексті. Кодекс — інструмент саморегулювання, а не державний закон зі штрафами.

> [!quiz] Nach dem Text: Welche Haltung vertritt der letzte Absatz?
> level: C1 · type: single · id: de-c1-lesen-q04
> - [ ] Kommentare sind unseriös und sollten verboten werden.
> - [x] Wer die Textsorte erkennt und nach Autor, Zielgruppe und Absicht fragt, liest kritischer.
> - [ ] Alle Zeitungstexte sind gleich neutral.
> - [ ] Glossen enthalten keine Wertungen.
>
> **Пояснення:** головна думка — *Wer kritisch liest, fragt … wer ihn geschrieben hat, für wen und mit welcher Absicht*. Коментарі текст не засуджує (*darf … offen Partei ergreifen*), а глоса якраз *arbeitet mit Ironie*.

## Практика

> [!quiz] Що правда про Goethe-Zertifikat C1, модуль Lesen? Обери всі.
> level: C1 · type: multi · id: de-c1-lesen-q05
> - [x] Модуль триває 65 хвилин і має 4 частини.
> - [x] У Teil 3 треба вставити речення в пропуски коментаря чи репортажу; два речення зайві.
> - [x] У Teil 4 треба вирішити, хто з фахівців висловлює твердження.
> - [ ] Можна користуватися словником.
> - [ ] Teil 1 — завдання richtig / falsch / nicht im Text.
>
> **Пояснення:** за *Modellsatz* (2026): 65 хв, 4 частини, 30 items; Teil 3 — *Lückentext mit Zuordnung von Sätzen*, Teil 4 — *Wer äußert das?*. Словники заборонені. *richtig / falsch / nicht im Text* — це telc C1 Hochschule, а Teil 1 Goethe — пропуски з вибором з 4 варіантів.

> [!quiz] Який тип завдання є в TestDaF Lesen, але не в Goethe C1 Lesen?
> level: C1 · type: single · id: de-c1-lesen-q06
> - [ ] вибір з кількох варіантів (Multiple-Choice)
> - [x] знайти помилки в резюме тексту (Fehler in Zusammenfassung erkennen)
> - [ ] заповнення пропусків у тексті
> - [ ] читання науково-популярних текстів
>
> **Пояснення:** *Fehler in Zusammenfassung erkennen* — окремий тип завдань TestDaF. Multiple-Choice, пропуски й популярні наукові тексти є на обох іспитах.

> [!quiz] Знайди помилку в резюме глоси «Die Rettung der Kaffeepause».
> level: C1 · type: single · id: de-c1-lesen-q07
> - [ ] Die Autorin hält es für unsinnig, Kaffeepausen streng zu regeln.
> - [ ] Sie deutet an, dass die Beratung von ihrer eigenen Empfehlung profitiert.
> - [x] Sie empfiehlt, Pausen künftig zu protokollieren.
> - [ ] Sie räumt ein, dass Gespräche über Projekte in der Pause streng genommen Arbeit sind.
>
> **Пояснення:** протоколювати перерви радить **консультаційна фірма**, а авторка висміює цю ідею (*ein sehr ordentliches Protokoll über eine Pause, die keine mehr war*). Решта — правильний підсумок: головна теза, натяк (*Zufällig …*), поступка (*Zugegeben …*).

> [!quiz] Які слова сигналізують, що автор дистанціюється від назви чи твердження? Обери всі.
> level: C1 · type: multi · id: de-c1-lesen-q08
> - [x] die sogenannte Reform
> - [x] die angebliche Entlastung
> - [x] die „Entlastung“ (у лапках)
> - [ ] die beschlossene Reform
> - [ ] die deutliche Entlastung
>
> **Пояснення:** *sogenannt*, *angeblich* і лапки показують, що автор не приймає назву чи твердження. *beschlossen* — нейтральний факт, *deutlich* — пряма оцінка без дистанції.

> [!quiz] «Wir müssen entweder alle Kohlekraftwerke sofort schließen oder auf Klimaschutz ganz verzichten.» Який це прийом?
> level: C1 · type: single · id: de-c1-lesen-q09
> - [ ] Autoritätsargument
> - [x] falsches Dilemma
> - [ ] Strohmann
> - [ ] Untertreibung
>
> **Пояснення:** подано лише два крайні варіанти, хоча між ними є багато інших (поступове закриття, компенсації). Це *falsches Dilemma*. *Strohmann* — підміна чужої тези, *Autoritätsargument* — посилання на авторитет, *Untertreibung* — применшення.

> [!quiz] Заповни пропуски: мовні дії автора (як у TestDaF «Sprachhandlungen zuordnen»)
> level: C1 · type: fill · bank: zitiert, verschweigt · id: de-c1-lesen-q10
>
> ```text fill
> «Zwar sind die Kosten hoch, doch …» — Der Autor [[räumt]] etwas [[ein]].
> «Im Gegensatz zu Frankreich …» — Der Autor [[vergleicht]].
> «Das liegt vor allem daran, dass …» — Der Autor [[begründet]].
> ```
>
> **Пояснення:** *zwar … doch* — поступка: *etwas einräumen*; *im Gegensatz zu* — порівняння; *das liegt daran, dass* — обґрунтування. *zitiert* підходило б для лапок із чужими словами, *verschweigt* — для пропущеної інформації; у цих фрагментах ні того, ні іншого немає.

> [!quiz] Заповни пропуски: прочитай між рядків
> level: C1 · type: fill · bank: lobt, wörtlich, Übertreibung · id: de-c1-lesen-q11
>
> ```text fill
> Die Formulierung «ein kleines Problem von 2 Milliarden» ist eine ironische [[Untertreibung]].
> Mit dem Wort «zufällig» [[spielt]] der Autor auf einen Interessenkonflikt an.
> Der Bericht nennt kaum Risiken, er [[verharmlost|beschönigt]] die Lage.
> ```
>
> **Пояснення:** «невеличка проблема в 2 млрд» — *Untertreibung*; *anspielen auf* — натякати (*spielt … an*); подати ризики меншими — *verharmlosen* / *beschönigen*. *lobt* суперечить критичному змісту, *wörtlich* — протилежне до натяку, *Übertreibung* — перебільшення, а тут саме применшення.

> [!quiz] Склади речення: «На користь такого прочитання свідчить передусім останній абзац.»
> level: C1 · type: order · id: de-c1-lesen-q12
>
> ```text order
> Für diese Lesart
> spricht
> vor allem
> der letzte Absatz.
> sprechen ✗
> ```
>
> **Пояснення:** *für etwas sprechen* — свідчити на користь. Після першого члена речення (*Für diese Lesart*) — дієслово, підмет *der letzte Absatz* — однина, тому *spricht*, а не інфінітив *sprechen*.

> [!quiz] Склади речення: «Хто уважно читає текст, помічає, що головну тезу чітко сформульовано лише в останньому абзаці.»
> level: C1 · type: order · id: de-c1-lesen-q15
>
> ```text order
> Wer den Text genau liest,
> erkennt,
> dass die Kernthese
> erst im letzten Absatz
> klar formuliert wird.
> formuliert werden ✗
> ```
>
> **Пояснення:** підрядне речення з *Wer …* стоїть першим, тому в головній частині дієслово *erkennt* — на другому місці. У підрядному *dass*-реченні Passiv завершує речення: *klar formuliert wird*; *formuliert werden* не узгоджується з підметом *die Kernthese* (однина).

> [!quiz] Де найімовірніше знайти гостру іронічну замітку на одну тему?
> level: C1 · type: single · id: de-c1-lesen-q13
> - [ ] у новині (Nachricht)
> - [x] у глосі (Glosse)
> - [ ] у звіті про дослідження (Forschungsbericht)
> - [ ] у тексті закону
>
> **Пояснення:** *Glosse* — короткий, загострений, іронічний жанр. Новина й науковий звіт мають бути нейтральними, а закон іронії не містить.

> [!quiz] Яке речення передає думку автора, а не чужу?
> level: C1 · type: single · id: de-c1-lesen-q14
> - [ ] Die Ministerin betont, das Gesetz sei gerecht.
> - [ ] Kritiker wenden ein, die Kosten seien zu hoch.
> - [x] Unterm Strich bleibt von der Reform wenig übrig.
> - [ ] Laut Umfrage halten 60 Prozent die Reform für richtig.
>
> **Пояснення:** *Unterm Strich bleibt … wenig übrig* — висновок автора в Indikativ. Інші речення передають думки міністерки, критиків чи результати опитування (Konjunktiv I, *laut*).

## Фішки

> [!reel] 📰 Feuilleton — «аркушик»
> Французьке *feuilleton* — «аркушик», від *feuille* (аркуш). У XIX столітті так називали додаток до газети з літературою й критикою. У німецькій слово лишилося назвою розділу культури, а в українській і російській дало «фейлетон» — сатиричну замітку. Одне слово, два різні жанри.

> [!reel] 🎭 Іронія — мінус на мінус
> Іронія працює, коли читач і автор знають однакові факти: *Wieder pünktlich, die Bahn!* смішне лише тому, що всі знають про запізнення. Тому іронію в тексті про незнайому тему розпізнати важче — і саме на ній іспити перевіряють рівень C1.

> [!reel] 🪵 «Totschlagargument»
> Буквально — «аргумент-вбивця». Фрази на кшталт *Das haben wir schon immer so gemacht* чи *Dafür ist kein Geld da* не доводять нічого, але зупиняють розмову. У німецьких тренінгах з комунікації їх збирають у списки, щоб учасники вчилися помічати й ввічливо повертати дискусію до фактів.

## Джерела та що почитати

- [Goethe-Institut — Modellsatz Goethe-Zertifikat C1 (PDF)](https://www.goethe.de/pro/relaunch/prf/materialien/C1_modular/c1-modular_modellsatz.pdf): модуль Lesen — 4 частини, 30 items, рекомендований час.
- [telc — Handbuch telc Deutsch C1 Hochschule (PDF)](https://www.telc.net/fileadmin/user_upload/pdfs/Handbuch_und_Tipps_fuer_Pruefungsvorbereitung/Deutsch_c1_hochschule_Handbuch.pdf): Leseverstehen і Sprachbausteine.
- [TestDaF — Aufbau des digitalen TestDaF](https://www.testdaf.de/de/teilnehmende/der-digitale-testdaf/aufbau-des-digitalen-testdaf/): 7 типів завдань Lesen і кількість items.
- [Gesetze im Internet — Art. 5 GG](https://www.gesetze-im-internet.de/gg/art_5.html): свобода преси, «Eine Zensur findet nicht statt».
- [bpb — Vor 60 Jahren gegründet: Der Deutsche Presserat als Ethik-Instanz](https://www.bpb.de/kurz-knapp/hintergrund-aktuell/237615/vor-60-jahren-gegruendet-der-deutsche-presserat-als-ethik-instanz/): заснування 1956 року, Pressekodex.
- [bpb — Das junge Politik-Lexikon: Deutscher Presserat](https://www.bpb.de/kurz-knapp/lexika/das-junge-politik-lexikon/320102/deutscher-presserat/): скарги й Rüge.
- [Duden — Glosse](https://www.duden.de/rechtschreibung/Glosse): значення жанру.

> [!important] Підсумок
> - **Формати:** Goethe C1 Lesen — 65 хв, 4 частини, 30 items; telc C1 Hochschule — Leseverstehen + Sprachbausteine, 90 хв; TestDaF — ≈ 55 хв, 7 типів, 34 items, без повернення назад.
> - **Три шари тексту:** що стверджує автор (Indikativ, висновок), що він передає (Konjunktiv I, *laut, Kritiker meinen*), на що натякає (іронія, *sogenannt, angeblich, zufällig*, лапки).
> - **Іронія** = оцінка, що суперечить фактам; перевіряй, чи автор міг сказати це серйозно.
> - **Аргументацію** розкладай: Kernthese → аргументи → докази → поступка → висновок; помічай *Verallgemeinerung, Scheinargument, Totschlagargument, Strohmann, falsches Dilemma*.
> - **Жанри:** Nachricht (нейтрально) ≠ Kommentar / Leitartikel (позиція) ≠ Glosse (іронія); *das Feuilleton* — розділ культури, не «фейлетон».
