---
title: Мистецтво, культура й рецензії
id: de-b2-kultur
level: B2
icon: px:gem
tags: [deutsch, b2, vocabulary, kultur, film, buch, theater, rezension, berlinale]
prerequisites: ["[[Deutsch - A1 - 27. Вільний час, хобі й погода — gern, lieber]]", "[[Deutsch - B1 - 24. Мовні звороти B1 — думка, згода, незгода]]"]
estimatedMinutes: 55
---

# Мистецтво, культура й рецензії

> [!success] Після цієї теми ти зможеш
> - назвати жанри й складники фільму, книжки та вистави: *Handlung, Figur, Szene, Inszenierung, Besetzung*;
> - оцінити твір і обґрунтувати: *Der Film überzeugt durch …, leider wirkt das Ende vorhersehbar*;
> - прочитати рецензію й зрозуміти, схвальна вона чи ні: *Kritik, Rezension, Verriss*;
> - написати коротку рецензію з чотирьох частин (інформація, зміст, оцінка, рекомендація);
> - пояснити, що таке Berlinale і як вона відрізняється від кінотеатру поруч.

## Передбач

> [!quiz] У рецензії: «Der Roman ist gut geschrieben, wirkt aber stellenweise langatmig». Що це означає?
> level: B2 · type: single · id: de-b2-kultur-q01
> - [ ] Роман короткий, але насичений
> - [x] Місцями роман затягнутий, розтягнутий
> - [ ] Роман дуже довгий, але виразний
> - [ ] Роман написаний глибоко й складно
>
> **Пояснення:** ***langatmig*** складається з *lang* («довгий») і *Atem* («подих»): буквально «довгого подиху», тобто розтягнутий, багатослівний, нудний. Це оцінка, а не опис довжини: довгий роман може бути захопливим.

## Фільм: жанри й складники

Жанри (*Genres*) мають звичні назви: **Spielfilm** (ігровий фільм), **Dokumentarfilm**, **Komödie**, **Drama**, **Krimi** (детектив або кримінальна історія), *Thriller*, *Horrorfilm*, *Trickfilm* (анімація). Слово *Krimi* не означає «кримінал»: так називають і книжки, і фільми, і серіали про розслідування. Відомий приклад — телесеріал *Tatort*.

Над фільмом працюють **Regisseur / Regisseurin** (режисер), *Drehbuchautor* (сценарист), *Kameramann* (оператор), *Schauspieler* (актори). Кожен фільм має **Hauptrolle** і *Nebenrollen*; людей, що грають, називають **Besetzung** (склад виконавців), а процес вибору акторів — *Casting*.

> [!diagram] Від ідеї до оцінки: життя фільму
> ```yaml
> layout: flow
> nodes:
>   - { id: s1, label: "1 · задум", text: "Idee + Drehbuch", tone: yellow }
>   - { id: s2, label: "2 · знімання", text: "Dreh (Regie, Besetzung)", tone: pink }
>   - { id: s3, label: "3 · монтаж", text: "Schnitt, Filmmusik", tone: yellow }
>   - { id: s4, label: "4 · показ", text: "Premiere, Festival", tone: pink }
>   - { id: s5, label: "5 · відгуки", text: "Kritik, Rezension", tone: gray }
> edges:
>   - { from: s1, to: s2 }
>   - { from: s2, to: s3 }
>   - { from: s3, to: s4 }
>   - { from: s4, to: s5 }
> steps:
>   - { focus: s1, note: "Спочатку є ідея, яка стає сценарієм (Drehbuch)." }
>   - { focus: s2, note: "Режисер керує зніманням (Regie führen), ролі розподіляють (Besetzung)." }
>   - { focus: s3, note: "У монтажі (Schnitt) з відзнятого матеріалу складають фільм; додають Filmmusik." }
>   - { focus: s4, note: "Фільм показують на Premiere, часто на фестивалі, де його може оцінити журі." }
>   - { focus: s5, note: "Після показу зʼявляються Kritiken і Rezensionen, схвальні або різкі." }
> ```

У розповіді про зміст використовуй теперішній час: *Die Handlung spielt in Berlin. Ein junger Mann sucht seinen Vater.* Для оцінки вживай слова про **Handlung** (сюжет), **Figur** (персонаж), **Szene**, **Schnitt**, **Filmmusik** і **Inszenierung** (постановка, режисерське рішення).

## Книжки, театр, мистецтво

- **Roman** — роман; **Bestseller** — книга, що добре продається; **Lesung** — публічне читання автором своїх текстів.
- **Theater** — і будівля, і вистава. **Inszenierung** — конкретна постановка твору; **Bühne** — сцена. Про виставу кажуть: *Das Stück läuft seit Jahren*, *Die Inszenierung ist modern*.
- **Gemälde** — картина, **Künstler** — митець. Про виставку: *Die Ausstellung zeigt …*.

## Як оцінити й обґрунтувати

Рецензія (**Rezension**) в німецькій пресі зазвичай має чотири частини: 1) *Info* — назва, автор / режисер, рік; 2) *Inhalt* — зміст без «спойлерів»; 3) *Bewertung* — оцінка зі сильними й слабкими сторонами; 4) *Fazit* — підсумок і рекомендація.

> [!diagram] Позитивні й негативні слова в рецензії
> ```yaml
> layout: compare
> columns: { a: "Schwächen", b: "Stärken" }
> nodes:
>   - { id: a1, col: a, label: "сюжет", text: "vorhersehbar", tone: pink }
>   - { id: a2, col: a, label: "темп", text: "langatmig", tone: pink }
>   - { id: a3, col: a, label: "глибина", text: "oberflächlich", tone: pink }
>   - { id: b1, col: b, label: "сюжет", text: "fesselnd", tone: yellow }
>   - { id: b2, col: b, label: "темп", text: "mitreißend", tone: yellow }
>   - { id: b3, col: b, label: "глибина", text: "tiefgründig", tone: yellow }
> steps:
>   - { focus: [a1, b1], note: "Сюжет: vorhersehbar — відомо наперед, нічого не дивує; fesselnd — не відпускає." }
>   - { focus: [a2, b2], note: "Темп: langatmig — затягнутий; mitreißend — захоплює, несе за собою." }
>   - { focus: [a3, b3], note: "Глибина: oberflächlich — поверхневий; tiefgründig — з глибокими думками." }
> ```

Опорні фрази для оцінки:

| Мета | Фраза |
|---|---|
| позитив | Der Film überzeugt durch die starke Besetzung. |
| позитив | Die Musik trägt die Stimmung perfekt. |
| вагання | Einerseits ist die Handlung originell, andererseits wirkt das Ende überzogen. |
| негатив | Leider bleiben die Figuren blass. |
| рекомендація | Ich kann den Film uneingeschränkt empfehlen. |
| застереження | Der Film ist anspruchsvoll und nichts für einen lockeren Abend. |

Корисні вирази для розповіді про сюжет: *Es geht um …*, *Im Mittelpunkt steht …*, *Der Film erzählt die Geschichte von …*. Для порівняння з книжкою: *Die Verfilmung bleibt dem Buch treu* / *weicht stark vom Buch ab*.

## Приклади

- Der Regisseur hat den Roman verfilmt. — Режисер екранізував роман.
- Die Hauptrolle verkörpert eine bekannte Schauspielerin. — Головну роль втілює відома акторка.
- Die Handlung spielt in Berlin in den zwanziger Jahren. — Дія відбувається в Берліні двадцятих років.
- Der Film überzeugt durch seine starke Besetzung. — Фільм переконує сильним складом акторів.
- Leider wirkt das Ende ein wenig vorhersehbar. — На жаль, кінцівка трохи передбачувана.
- Die Kritiker haben den Film sehr gelobt. — Критики дуже схвалили фільм.
- Die Zeitung hat das Buch verrissen. — Газета розгромила книжку у своїй рецензії.
- Die Premiere findet im Februar auf dem Festival statt. — Премʼєра відбудеться в лютому на фестивалі.
- Die Inszenierung bleibt dem Stück treu, wirkt aber modern. — Постановка залишається вірною пʼєсі, але виглядає сучасно.
- Der Künstler zeigt seine Gemälde in einer kleinen Galerie. — Митець показує свої картини в невеликій галереї.

## Слова

> [!word] der Spielfilm
> ipa: /ˈʃpiːlfɪlm/ · pos: noun · level: B2 · id: de-b2-kultur-w01
> uk: ігровий фільм
> forms: die Spielfilme
> example: Der **Spielfilm** dauert zwei Stunden. — Ігровий фільм триває дві години.
> note: Spiel + Film; протилежність — der Dokumentarfilm; sp на початку = [ʃp].

> [!word] der Dokumentarfilm
> ipa: /dokumɛnˈtaːɐ̯ˌfɪlm/ · pos: noun · level: B2 · id: de-b2-kultur-w02
> uk: документальний фільм
> forms: die Dokumentarfilme
> example: Der **Dokumentarfilm** zeigt das Leben im Dorf. — Документальний фільм показує життя в селі.
> note: також die Dokumentation; наголос на -tar-.

> [!word] die Komödie
> ipa: /koˈmøːdi̯ə/ · pos: noun · level: B1 · id: de-b2-kultur-w03
> uk: комедія
> forms: die Komödien
> example: Die **Komödie** hat mich zum Lachen gebracht. — Комедія мене розсмішила.
> note: множина die Komödien [koˈmøːdi̯ən]; ö довге [øː]; тут кінцеве -ie — [i̯ə].

> [!word] der Krimi
> ipa: /ˈkʁiːmi/ · pos: noun · level: B1 · id: de-b2-kultur-w04
> uk: детектив; кримінальна історія (книжка, фільм)
> forms: die Krimis
> example: Am Sonntagabend schauen wir den **Krimi** im Fernsehen. — У неділю ввечері ми дивимося детектив по телевізору.
> note: не «кримінал»; скорочення від Kriminalroman / Kriminalfilm; популярний серіал — Tatort.

> [!word] der Regisseur
> ipa: /ʁeʒɪˈsøːɐ̯/ · pos: noun · level: B2 · id: de-b2-kultur-w05
> uk: режисер
> forms: die Regisseure
> example: Der **Regisseur** hat für den Film viele Preise bekommen. — Режисер отримав за фільм багато нагород.
> note: жінка — die Regisseurin; наголос на останньому складі; g = [ʒ] («ж»); Regie führen — режисувати.

> [!word] die Hauptrolle
> ipa: /ˈhaʊ̯ptˌʁɔlə/ · pos: noun · level: B2 · id: de-b2-kultur-w06
> uk: головна роль
> forms: die Hauptrollen
> example: Sie spielt die **Hauptrolle** in dem neuen Film. — Вона грає головну роль у новому фільмі.
> note: eine Rolle spielen — і «грати роль», і «мати значення»: Das spielt keine Rolle — це не має значення.

> [!word] die Besetzung
> ipa: /bəˈzɛtsʊŋ/ · pos: noun · level: B2 · id: de-b2-kultur-w07
> uk: склад виконавців; розподіл ролей
> forms: die Besetzungen
> example: Die **Besetzung** des Films ist hochkarätig. — Склад виконавців фільму першокласний.
> note: besetzen — розподіляти ролі, також «займати»; die Besetzung — і військова окупація.

> [!word] die Handlung
> ipa: /ˈhandlʊŋ/ · pos: noun · level: B2 · id: de-b2-kultur-w08
> uk: сюжет; дія
> forms: die Handlungen
> example: Die **Handlung** ist spannend, aber etwas verwirrend. — Сюжет цікавий, але трохи заплутаний.
> note: Handlung — також «вчинок» (eine strafbare Handlung); handeln — діяти.

> [!word] die Figur
> ipa: /fiˈɡuːɐ̯/ · pos: noun · level: B2 · id: de-b2-kultur-w09
> uk: персонаж; постать
> forms: die Figuren
> example: Die **Figuren** im Roman wirken sehr echt. — Персонажі в романі здаються дуже справжніми.
> note: також «фігура» (тіло; шахи); наголос на останньому складі, кінцеве -ur = [uːɐ̯].

> [!word] die Szene
> ipa: /ˈstseːnə/ · pos: noun · level: B1 · id: de-b2-kultur-w10
> uk: сцена; епізод
> forms: die Szenen
> example: Die letzte **Szene** hat mich sehr berührt. — Остання сцена мене дуже зворушила.
> note: sz → [stse]; eine Szene machen — влаштувати сцену (скандал); die Szene — також «середовище» (die Musikszene).

> [!word] der Schnitt
> ipa: /ʃnɪt/ · pos: noun · level: B2 · id: de-b2-kultur-w11
> uk: монтаж; розріз
> forms: die Schnitte
> example: Der **Schnitt** macht den Film sehr dynamisch. — Монтаж робить фільм дуже динамічним.
> note: у кіно — das Schneiden / der Schnitt; також «розріз» і «середнє значення» (im Schnitt — у середньому); sch + n: [ʃn].

> [!word] die Filmmusik
> ipa: /ˈfɪlmmuˌziːk/ · pos: noun · level: B2 · id: de-b2-kultur-w12
> uk: музика до фільму
> forms: — (без множини)
> example: Die **Filmmusik** stammt von einem berühmten Komponisten. — Музику до фільму написав відомий композитор.
> note: mm на стику частин — довгий [m]; наголос у Musik на останньому складі.

> [!word] die Verfilmung
> ipa: /fɛɐ̯ˈfɪlmʊŋ/ · pos: noun · level: B2 · id: de-b2-kultur-w13
> uk: екранізація
> forms: die Verfilmungen
> example: Die **Verfilmung** ist näher am Buch als gedacht. — Екранізація ближча до книжки, ніж ми думали.
> note: verfilmen — екранізувати; -ung — завжди die.

> [!word] die Fortsetzung
> ipa: /ˈfɔʁtˌzɛtsʊŋ/ · pos: noun · level: B2 · id: de-b2-kultur-w14
> uk: продовження
> forms: die Fortsetzungen
> example: Die **Fortsetzung** kommt nächstes Jahr ins Kino. — Продовження вийде в кіно наступного року.
> note: fortsetzen — продовжувати; die Fortsetzung folgt — «продовження буде».

> [!word] die Premiere
> ipa: /pʁəˈmi̯eːʁə/ · pos: noun · level: B2 · id: de-b2-kultur-w15
> uk: премʼєра
> forms: die Premieren
> example: Zur **Premiere** kamen viele Gäste. — На премʼєру прийшло багато гостей.
> note: перша публічна вистава / показ; Uraufführung — перша світова вистава твору; ʁ наприкінці [ʁə]; в Австрії [pʁøˈmi̯ɛːɐ̯].

> [!word] das Festival
> ipa: /ˈfɛstival/ · pos: noun · level: B1 · id: de-b2-kultur-w16
> uk: фестиваль
> forms: die Festivals
> example: Das **Festival** dauert zwölf Tage. — Фестиваль триває дванадцять днів.
> note: наголос на першому складі, v = [v]; Duden подає також [ˈfɛstivl̩]; Filmfestival, Musikfestival.

> [!word] die Auszeichnung
> ipa: /ˈaʊ̯sˌtsaɪ̯çnʊŋ/ · pos: noun · level: B2 · id: de-b2-kultur-w17
> uk: нагорода; відзнака
> forms: die Auszeichnungen
> example: Der Film erhielt mehrere **Auszeichnungen**. — Фільм отримав кілька нагород.
> note: auszeichnen — відзначати; ch після ei = [ç]; zeichnen — малювати.

> [!word] die Jury
> ipa: /ˈʒyːʁi/ · pos: noun · level: B2 · id: de-b2-kultur-w18
> uk: журі
> forms: die Jurys
> example: Die **Jury** entscheidet über die Preise. — Журі вирішує, кому дати нагороди.
> note: j = [ʒ] («ж»); y = [yː]; ʁ + i наприкінці; Duden подає також [ʒyˈriː].

> [!word] die Kritik
> ipa: /kʁiˈtiːk/ · pos: noun · level: B2 · id: de-b2-kultur-w19
> uk: критика; відгук, рецензія
> forms: die Kritiken
> example: Der Film bekam sehr gute **Kritiken**. — Фільм отримав дуже добрі відгуки.
> note: Kritik не обовʼязково негативна; множина Kritiken [kʁiˈtiːkn̩]; Kritik üben an (+ Dat) — критикувати.

> [!word] der Kritiker
> ipa: /ˈkʁiːtikɐ/ · pos: noun · level: B2 · id: de-b2-kultur-w20
> uk: критик
> forms: die Kritiker
> example: Der **Kritiker** schrieb in der Zeitung über das Stück. — Критик написав у газеті про пʼєсу.
> note: жінка — die Kritikerin; наголос на першому складі, на відміну від die Kritik.

> [!word] die Rezension
> ipa: /ʁetsɛnˈzi̯oːn/ · pos: noun · level: B2 · id: de-b2-kultur-w21
> uk: рецензія
> forms: die Rezensionen
> example: Die **Rezension** erscheint morgen in der Zeitung. — Рецензія вийде завтра в газеті.
> note: rezensieren — писати рецензію; z = [ts]; -ion — наголос на закінченні.

> [!word] der Verriss
> ipa: /fɛɐ̯ˈʁɪs/ · pos: noun · level: B2 · id: de-b2-kultur-w22
> uk: нищівна рецензія
> forms: die Verrisse
> example: Die Kritik war ein **Verriss**. — Рецензія була нищівною.
> note: від verreißen («розірвати на шматки»); протилежність — Lobeshymne («гімн похвали»).

> [!word] der Roman
> ipa: /ʁoˈmaːn/ · pos: noun · level: B1 · id: de-b2-kultur-w23
> uk: роман
> forms: die Romane
> example: Der **Roman** erzählt eine Familiengeschichte. — Роман розповідає історію сімʼї.
> note: наголос на останньому складі; Roman — також чоловіче імʼя.

> [!word] der Bestseller
> ipa: /ˈbɛstzɛlɐ/ · pos: noun · level: B2 · id: de-b2-kultur-w24
> uk: бестселер
> forms: die Bestseller
> example: Das Buch wurde ein **Bestseller**. — Книжка стала бестселером.
> note: англіцизм; наголос на першому складі; st + z: [stz].

> [!word] die Lesung
> ipa: /ˈleːzʊŋ/ · pos: noun · level: B2 · id: de-b2-kultur-w25
> uk: літературний вечір (читання автора)
> forms: die Lesungen
> example: Die Autorin liest bei einer **Lesung** aus ihrem neuen Roman. — Авторка читає на літературному вечорі уривки з нового роману.
> note: lesen — читати; s перед голосним = [z], довге e.

> [!word] das Theater
> ipa: /teˈaːtɐ/ · pos: noun · level: A2 · id: de-b2-kultur-w26
> uk: театр
> forms: die Theater
> example: Wir gehen heute Abend ins **Theater**. — Сьогодні ввечері ми йдемо в театр.
> note: наголос на -a-; розмовне «Theater machen» — «зчиняти галас»; множина не змінюється.

> [!word] die Inszenierung
> ipa: /ɪnstseˈniːʁʊŋ/ · pos: noun · level: B2 · id: de-b2-kultur-w27
> uk: постановка
> forms: die Inszenierungen
> example: Die **Inszenierung** von „Faust“ ist sehr modern. — Постановка «Фауста» дуже сучасна.
> note: inszenieren — ставити (виставу), також «влаштовувати показ»; sz → [stse].

> [!word] die Bühne
> ipa: /ˈbyːnə/ · pos: noun · level: B1 · id: de-b2-kultur-w28
> uk: сцена
> forms: die Bühnen
> example: Die Schauspieler stehen auf der **Bühne**. — Актори стоять на сцені.
> note: ü довге [yː]; auf der Bühne — на сцені; Bühnenbild — декорації.

> [!word] das Gemälde
> ipa: /ɡəˈmɛːldə/ · pos: noun · level: B2 · id: de-b2-kultur-w29
> uk: картина (живопис)
> forms: die Gemälde
> example: In dem Museum hängen berühmte **Gemälde**. — У музеї висять відомі картини.
> note: ä довге [ɛː]; множина не змінюється; Bild — «картина», «зображення».

> [!word] der Künstler
> ipa: /ˈkʏnstlɐ/ · pos: noun · level: A2 · id: de-b2-kultur-w30
> uk: митець, художник
> forms: die Künstler
> example: Der **Künstler** stellt seine Werke in einer Galerie aus. — Митець виставляє свої роботи в галереї.
> note: жінка — die Künstlerin; ü коротке; -nst-: три приголосні разом.

> [!word] inszenieren
> ipa: /ɪnstseˈniːʁən/ · pos: verb · level: B2 · id: de-b2-kultur-w31
> uk: ставити (виставу, фільм); інсценувати
> forms: inszenieren → inszenierte → hat inszeniert
> example: Der Regisseur **inszeniert** das Stück neu. — Режисер ставить пʼєсу по-новому.
> note: також «влаштовувати показ для ефекту»: eine Show inszenieren.

> [!word] verfilmen
> ipa: /fɛɐ̯ˈfɪlmən/ · pos: verb · level: B2 · id: de-b2-kultur-w32
> uk: екранізувати
> forms: verfilmen → verfilmte → hat verfilmt
> example: Das Buch wurde schon dreimal **verfilmt**. — Книжку вже тричі екранізували.
> note: слабке невідокремлюване дієслово; Partizip II verfilmt без ge-.

> [!word] drehen
> ipa: /ˈdʁeːən/ · pos: verb · level: B2 · id: de-b2-kultur-w33
> uk: знімати (фільм); крутити
> forms: drehen → drehte → hat gedreht
> example: Der Film wurde in Berlin und Prag **gedreht**. — Фільм знімали в Берліні та Празі.
> note: einen Film drehen — знімати фільм; sich drehen — крутитися; es dreht sich um (+ Akk) — «йдеться про».

> [!word] besetzen
> ipa: /bəˈzɛtsn̩/ · pos: verb · level: B2 · id: de-b2-kultur-w34
> uk: розподіляти ролі; займати
> forms: besetzen → besetzte → hat besetzt
> example: Die Rolle wurde mit einer jungen Schauspielerin **besetzt**. — Роль дали молодій акторці.
> note: besetzt — також «зайнято» (телефон, місце); не плутати з besitzen («володіти»).

> [!word] rezensieren
> ipa: /ʁetsɛnˈziːʁən/ · pos: verb · level: B2 · id: de-b2-kultur-w35
> uk: рецензувати
> forms: rezensieren → rezensierte → hat rezensiert
> example: Sie **rezensiert** Bücher für eine Zeitung. — Вона рецензує книжки для газети.
> note: також besprechen (ein Buch besprechen); без ge-.

> [!word] bewerten
> ipa: /bəˈveːɐ̯tn̩/ · pos: verb · level: B2 · id: de-b2-kultur-w36
> uk: оцінювати
> forms: bewerten → bewertete → hat bewertet
> example: Die Zuschauer **bewerten** den Film im Internet. — Глядачі оцінюють фільм в Інтернеті.
> note: die Bewertung — оцінка; Wert — «вартість»; beurteilen — судити про, складати думку.

> [!word] verkörpern
> ipa: /fɛɐ̯ˈkœʁpɐn/ · pos: verb · level: C1 · id: de-b2-kultur-w37
> uk: втілювати, грати (роль)
> forms: verkörpern → verkörperte → hat verkörpert
> example: Sie **verkörpert** die Königin überzeugend. — Вона переконливо втілює королеву.
> note: Körper — «тіло»; ö коротке [œ].

> [!word] langatmig
> ipa: /ˈlaŋʔaːtmɪç/ · pos: adj · level: C1 · id: de-b2-kultur-w38
> uk: затягнутий; багатослівний
> example: Der Mittelteil des Films ist leider etwas **langatmig**. — Середня частина фільму, на жаль, трохи затягнута.
> note: lang + Atem («подих»); ʔ перед Atem; -ig = [ɪç].

> [!word] fesselnd
> ipa: /ˈfɛsl̩nt/ · pos: adj · level: B2 · id: de-b2-kultur-w39
> uk: захопливий; той, що не відпускає
> example: Der Thriller ist von der ersten bis zur letzten Minute **fesselnd**. — Трилер захоплює з першої до останньої хвилини.
> note: fesseln — «звʼязувати, приковувати» (die Fessel — кайдани).

> [!word] mitreißend
> ipa: /ˈmɪtʁaɪ̯sn̩t/ · pos: adj · level: B2 · id: de-b2-kultur-w40
> uk: захопливий; той, що несе за собою
> example: Das Konzert war **mitreißend**. — Концерт був захопливим.
> note: mitreißen — «рвати за собою»; відокремлюване.

> [!word] berührend
> ipa: /bəˈʁyːʁənt/ · pos: adj · level: B2 · id: de-b2-kultur-w41
> uk: зворушливий
> example: Das Ende des Films ist sehr **berührend**. — Кінець фільму дуже зворушливий.
> note: berühren — торкатися й зворушувати; ü довге.

> [!word] vorhersehbar
> ipa: /foːɐ̯ˈheːɐ̯zeːbaːɐ̯/ · pos: adj · level: B2 · id: de-b2-kultur-w42
> uk: передбачуваний
> example: Die Handlung ist leider völlig **vorhersehbar**. — Сюжет, на жаль, цілком передбачуваний.
> note: vorher + sehen + -bar: «те, що можна побачити заздалегідь»; наголос на -her-.

> [!word] tiefgründig
> ipa: /ˈtiːfɡʁʏndɪç/ · pos: adj · level: C1 · id: de-b2-kultur-w43
> uk: глибокий, змістовний
> example: Der Roman ist humorvoll und zugleich **tiefgründig**. — Роман гумористичний і водночас глибокий.
> note: tief + Grund («дно»); протилежність — oberflächlich.

> [!word] anspruchsvoll
> ipa: /ˈanʃpʁʊxsfɔl/ · pos: adj · level: B2 · id: de-b2-kultur-w44
> uk: вибагливий; складний, вимогливий (до глядача)
> example: Das ist ein **anspruchsvoller** Film mit vielen Ebenen. — Це вимогливий до глядача фільм із багатьма рівнями.
> note: Anspruch + voll; про людину — «вибагливий», про твір — «складний, інтелектуальний».

> [!word] überzeugend
> ipa: /yːbɐˈtsɔʏ̯ɡn̩t/ · pos: adj · level: B2 · id: de-b2-kultur-w45
> uk: переконливий
> example: Die Hauptdarstellerin war sehr **überzeugend**. — Акторка в головній ролі була дуже переконливою.
> note: überzeugen — переконувати; наголос на -zeu-; überzeugt von — «переконаний у».

## Слухаємо

> [!listen] Що ти почув?
> level: B2 · type: choice · id: de-b2-kultur-l01
> audio: Die Handlung ist spannend, aber das Ende ist vorhersehbar.
> - [ ] Die Handlung ist langweilig, aber das Ende ist überraschend.
> - [x] Die Handlung ist spannend, aber das Ende ist vorhersehbar.
> - [ ] Die Handlung ist spannend, und das Ende ist überraschend.
>
> **Пояснення:** *aber* протиставляє позитивне («spannend») і негативне («vorhersehbar»). Слухай слова, які змінюють значення: *überraschend* — несподіваний, *vorhersehbar* — передбачуваний.

> [!listen] Що ти почув?
> level: B2 · type: choice · id: de-b2-kultur-l02
> audio: Der Film wurde nach einem berühmten Roman gedreht.
> - [ ] Der Film wurde nach einem berühmten Roman gedruckt.
> - [x] Der Film wurde nach einem berühmten Roman gedreht.
> - [ ] Der Film wurde nach einem berühmten Roman gedacht.
>
> **Пояснення:** *gedreht* — знято, *gedruckt* — надруковано, *gedacht* — подумано. Всі три звучать схоже, але лише *gedreht* пасує до фільму.

> [!listen] Напиши або скажи, що почув
> level: B2 · type: dictation · id: de-b2-kultur-l03
> audio: Der Kritiker lobt die Inszenierung.
> explain: *Kritiker* — наголос на першому складі; *Inszenierung* — sz → [stse], -ung = [ʊŋ].

> [!listen] Напиши або скажи, що почув
> level: B2 · type: dictation · id: de-b2-kultur-l04
> audio: Die Premiere findet im Februar auf dem Festival statt.
> explain: *stattfinden* — відокремлюване: *findet … statt*. *Premiere* — довге [eː] перед -re.

> [!listen] Послухай радіорецензію. Що критик думає про фільм?
> level: B2 · type: answer · id: de-b2-kultur-l05
> audio: A: Der neue Film von Regisseurin Anna Weber ist ein ruhiges Drama über eine Familie auf dem Land.
> audio: A: Die Hauptrolle spielt Lena Berg, und sie ist sehr überzeugend.
> audio: A: Leider ist der Mittelteil etwas langatmig, aber das Ende ist berührend. Ich empfehle den Film.
> - [ ] Він вважає фільм нудним і не радить його дивитися.
> - [x] Фільм загалом гарний: акторка переконлива, середина затягнута, кінець зворушливий; критик радить його.
> - [ ] Він розкритикував акторську гру, але хвалить сюжет.
>
> **Пояснення:** *überzeugend* і *berührend* — хвалять, *langatmig* — заперечення; кінцева рекомендація — *Ich empfehle den Film*.

> [!listen] Послухай розмову після кіно. Що не сподобалось друзям?
> level: B2 · type: answer · id: de-b2-kultur-l06
> audio: A: Wie fandest du den Film?
> audio: B: Die Schauspieler waren super, und die Musik hat mich richtig mitgerissen.
> audio: A: Mich nicht so. Die Figuren blieben blass, und die Handlung war vorhersehbar.
> audio: B: Ja, das stimmt. Das Ende habe ich schon nach der Hälfte erraten.
> - [ ] Музика й акторська гра.
> - [x] Бліді персонажі й передбачуваний сюжет.
> - [ ] Занадто довгий фільм.
>
> **Пояснення:** Партнер хвалить акторів і музику. Критика — *Figuren blieben blass* («персонажі лишалися блідими») та *Handlung vorhersehbar*.

## Вимова

- У запозичених із французької слів зберігаються «французькі» звуки: ***g*** у *Regisseur* і ***j*** у *Jury* дають [ʒ] («ж»).
- ***sz*** у *Szene*, *Inszenierung* читається як [sts]: *Szene* [ˈstseːnə].
- ***y*** у *Jury* — [yː], як німецьке ü; те саме ü у *Bühne*.
- Слова на **-ion** та **-ieren** мають наголос на закінченні: *Rezension*, *rezensieren*, *inszenieren*; а *Kritik* — [kʁiˈtiːk] (наголос на останньому складі), але *Kritiker* — [ˈkʁiːtikɐ] (на першому).

> [!speak] Скажи вголос
> level: B2 · id: de-b2-kultur-s01
> text: Der Regisseur hat den Roman verfilmt.
> ipa: /deːɐ̯ ʁeʒɪˈsøːɐ̯ hat deːn ʁoˈmaːn fɛɐ̯ˈfɪlmt/
> tip: Regisseur — g = [ʒ], наголос на -seur. Roman — наголос на -man. verfilmt — без ge-, кінцеве mt.
> uk: Режисер екранізував роман.

> [!speak] Скажи вголос
> level: B2 · id: de-b2-kultur-s02
> text: Die Handlung ist fesselnd, aber das Ende wirkt vorhersehbar.
> ipa: /diː ˈhandlʊŋ ɪst ˈfɛslnt ˈaːbɐ das ˈɛndə vɪʁkt foːɐ̯ˈheːɐ̯zeːbaːɐ̯/
> tip: fesselnd — [ˈfɛslnt], без вставного голосного між s і l. wirkt — rkt: три приголосні. vorhersehbar — головний наголос на -her-.
> uk: Сюжет захоплює, але кінцівка здається передбачуваною.

> [!speak] Скажи вголос
> level: B2 · id: de-b2-kultur-s03
> text: Die Kritik war ein Verriss.
> ipa: /diː kʁiˈtiːk vaːɐ̯ aɪ̯n fɛɐ̯ˈʁɪs/
> tip: Kritik — наголос на -tik, кінцеве -k. Verriss — ss після короткого i = [s]; наголос на -riss.
> uk: Рецензія була нищівною.

> [!speak] Скажи вголос
> level: B2 · id: de-b2-kultur-s04
> text: Die Jury vergibt den Preis an die Hauptdarstellerin.
> ipa: /diː ˈʒyːʁi fɛɐ̯ˈɡɪpt deːn pʁaɪ̯s an diː ˈhaʊ̯ptdaʁˌʃtɛlɐʁɪn/
> tip: Jury — j = [ʒ]. vergibt — bt = [pt]. Hauptdarstellerin — головний наголос на Haupt-.
> uk: Журі присуджує премію акторці головної ролі.

## Типові помилки українців

> [!pitfall] Kritik — не обовʼязково «критика»
> Українське «критика» звучить негативно, а німецьке **Kritik** — це оцінка загалом, схвальна чи ні. *Der Film bekam gute Kritiken* — «Фільм отримав добрі відгуки», а не «його розкритикували». Якщо хочеш сказати про різку критику, вживай *scharfe Kritik*, а про нищівну рецензію — **Verriss**. Слово *Rezension* близьке до *Kritik*, але стосується письмового огляду твору.

> [!pitfall] Krimi — це детектив, а не «кримінал»
> Українське «кримінал» ми повʼязуємо зі злочинним світом. **Der Krimi** — це жанр: історія про розслідування злочину в книжці, фільмі або серіалі. *Ich lese gern Krimis* — «Я люблю читати детективи». Злочин (як подію) німецькою називають *das Verbrechen* або *die Straftat*.

> [!pitfall] spannend ≠ «напружений» про людину
> **Spannend** про фільм чи книжку означає «захоплюючий, такий, що тримає в напрузі»: *Der Film ist spannend*. Про людину в напрузі кажуть *angespannt* («напружена»), а *gespannt* — «з цікавістю чекає»: *Ich bin gespannt auf den Film*. Тож «Фільм напружений» ≠ *Der Film ist angespannt*.

> [!pitfall] Der Film spielt in Berlin — не «грає в Берліні»
> Про місце й час дії фільму або книжки німецькою кажуть **spielen**: *Die Handlung spielt in Berlin*, *Der Roman spielt im 19. Jahrhundert*. Калька «Фільм грає в Берліні» не працює. Кінотеатр «показує» фільм: *Der Film läuft im Kino* (від *laufen* — «йти, демонструватися»).

## Ситуація: після кіно

> [!listen] Послухай розмову. Що радить співрозмовник B?
> level: B2 · type: answer · id: de-b2-kultur-l07
> audio: A: Hast du die Verfilmung schon gesehen? Ich überlege, ob ich hingehen soll.
> audio: B: Ja, gestern. Die Besetzung ist top, aber der Film ist ziemlich anspruchsvoll. Du solltest das Buch vorher lesen.
> audio: A: Hmm, dann warte ich lieber, bis der Film im Streaming läuft.
> - [ ] Піти на фільм, не читаючи книжки.
> - [x] Прочитати книжку перед фільмом, бо фільм складний.
> - [ ] Узагалі не дивитися фільм.
>
> **Пояснення:** *anspruchsvoll* — вимогливий до глядача. B радить спершу прочитати книжку (*das Buch vorher lesen*).

Скажи вголос свою думку про фільм.

> [!speak] Скажи вголос: «Акторський склад чудовий»
> level: B2 · id: de-b2-kultur-s05
> text: Die Besetzung ist wirklich gelungen.
> ipa: /diː bəˈzɛtsʊŋ ɪst ˈvɪʁklɪç ɡəˈlʊŋən/
> tip: Besetzung — s = [z], наголос на -set-. wirklich — rkl: три приголосні, ch після i = [ç]. gelungen — наголос на -lun-.
> uk: Акторський склад справді вдалий.

> [!speak] Скажи вголос: «Мені фільм сподобався»
> level: B2 · id: de-b2-kultur-s06
> text: Ich kann den Film uneingeschränkt empfehlen.
> ipa: /ɪç kan deːn fɪlm ˈʊnʔaɪ̯nɡəˌʃʁɛŋkt ɛmˈpfeːlən/
> tip: uneingeschränkt — ʔ перед ein-; наголос на un-. empfehlen — emp- як [ɛmpf]: m + pf.
> uk: Я можу рекомендувати фільм без застережень.

## Landeskunde: Die Berlinale

> [!example] Die Berlinale
> Jedes Jahr im Februar wird Berlin für zwölf Tage zur Filmstadt: Dann findet die Berlinale statt, die Internationalen Filmfestspiele Berlin. Das Festival wurde 1951 gegründet, zu Beginn des Kalten Krieges. Es sollte im damals geteilten Berlin ein „Schaufenster der freien Welt“ sein. Heute gilt die Berlinale als eines der größten Publikumsfestivals der Welt: Jedes Jahr kommen Zehntausende Besucher, und auch normale Zuschauer können Karten kaufen. Das Programm umfasst rund 200 Filme aus aller Welt, die in verschiedenen Sektionen laufen. Im Wettbewerb konkurrieren Filme um die wichtigsten Preise, den Goldenen Bären und die Silbernen Bären, die von der Internationalen Jury vergeben werden. Die Sektion Perspectives zeigt Debütfilme, also erste Spielfilme junger Regisseurinnen und Regisseure. Die Sektion Panorama ist für ihren eigenen Publikumspreis bekannt, in der Sektion Generation laufen Filme für junge Zuschauer, und das Forum denkt über das Medium Film selbst nach. Zum Festival gehören außerdem der European Film Market, ein Treffpunkt der Filmbranche, und Berlinale Talents, ein Programm für Nachwuchs in der Filmbranche. Die Berlinale gilt außerdem als das politischste unter den großen Filmfestivals, denn viele Filme beschäftigen sich mit gesellschaftlichen Themen. Für die Filmbranche und die Medien sind die zwölf Tage im Februar einer der wichtigsten Termine des Jahres, und für Berlin und für Unternehmen in Deutschland ist das Festival auch ein bedeutender Wirtschaftsfaktor.

> [!quiz] Wann und wie lange findet die Berlinale laut Text statt?
> level: B2 · type: single · id: de-b2-kultur-q02
> - [ ] im Sommer, eine Woche lang
> - [x] im Februar, zwölf Tage lang
> - [ ] im Oktober, drei Tage lang
> - [ ] im Dezember, einen ganzen Monat lang
>
> **Пояснення:** «Jedes Jahr im Februar wird Berlin für zwölf Tage zur Filmstadt». Інші варіанти змінюють пору року або тривалість.

> [!quiz] Welche Idee stand hinter der Gründung 1951?
> level: B2 · type: single · id: de-b2-kultur-q03
> - [ ] Ein Festival nur für Fachleute der Filmbranche
> - [ ] Ein Festival für Dokumentarfilme aus Osteuropa
> - [x] Ein „Schaufenster der freien Welt“ im geteilten Berlin
> - [ ] Ein Preis für den besten deutschen Film
>
> **Пояснення:** «Es sollte im damals geteilten Berlin ein „Schaufenster der freien Welt“ sein». Про вузький фаховий формат у тексті не сказано; навпаки, це великий фестиваль для публіки.

> [!quiz] Was stimmt laut Text über die Berlinale?
> level: B2 · type: multi · id: de-b2-kultur-q04
> - [x] Auch normale Zuschauer können Karten kaufen.
> - [x] Den Goldenen Bären und die Silbernen Bären vergibt die Internationale Jury.
> - [x] Das Panorama ist für seinen Publikumspreis bekannt.
> - [ ] Es laufen nur etwa zehn Filme pro Jahr.
>
> **Пояснення:** Усі три перші твердження є в тексті. Програма — близько 200 фільмів, а не десять.

## Практика

> [!quiz] «Der Film bekam sehr gute Kritiken.» Що це означає?
> level: B2 · type: single · id: de-b2-kultur-q05
> - [ ] Фільм сильно розкритикували.
> - [x] Фільм отримав дуже добрі відгуки й рецензії.
> - [ ] Фільм відзначили премією.
> - [ ] Фільм заборонили до показу.
>
> **Пояснення:** *Kritik* — це оцінка загалом: *gute Kritiken* означає схвальні відгуки. Нагорода — *Auszeichnung*, а негативна оцінка — *schlechte Kritik* або *Verriss*.

> [!quiz] Які прикметники в рецензії звучать схвально?
> level: B2 · type: multi · id: de-b2-kultur-q06
> - [x] fesselnd
> - [x] mitreißend
> - [x] überzeugend
> - [ ] langatmig
>
> **Пояснення:** *fesselnd* (захоплює), *mitreißend* (несе за собою), *überzeugend* (переконливий) — позитивні. *Langatmig* — затягнутий, тобто критичне слово.

> [!quiz] Заповни пропуски в рецензії
> level: B2 · type: fill · bank: Fortsetzung, Premiere · id: de-b2-kultur-q07
>
> ```text fill
> Der Regisseur hat den Roman [[verfilmt]].
> Die Hauptrolle [[verkörpert]] (втілює) eine bekannte Schauspielerin.
> Die Kritiker loben die [[Inszenierung]] (постановка), aber das Ende ist [[vorhersehbar]] (передбачуване).
> ```
>
> **Пояснення:** *einen Roman verfilmen* — екранізувати, *eine Rolle verkörpern* — втілювати, *Inszenierung* — постановка, *vorhersehbar* — передбачуваний. *Fortsetzung* («продовження») і *Premiere* («премʼєра») не пасують за змістом.

> [!quiz] Заповни пропуски: фестиваль
> level: B2 · type: fill · bank: Premiere, Fortsetzung · id: de-b2-kultur-q08
>
> ```text fill
> Beim [[Festival]] entscheidet eine [[Jury]] über die Preise.
> Der Regisseur nimmt die [[Auszeichnung]] auf der Bühne entgegen.
> ```
>
> **Пояснення:** *beim Festival* (середній рід: *bei dem*), *eine Jury* — журі, *die Auszeichnung* — нагорода. *Premiere* (жіночий рід) не вписується в *beim*, а *Fortsetzung* («продовження») не «приймають».

> [!quiz] Склади речення: «Дія фільму відбувається в Берліні вісімдесятих років.»
> level: B2 · type: order · id: de-b2-kultur-q09
>
> ```text order
> Der
> Film
> spielt
> im
> Berlin
> der
> achtziger
> Jahre.
> läuft ✗
> ```
>
> **Пояснення:** про час і місце дії кажуть *spielen*: *Der Film spielt in …*. *Laufen* означає «демонструватися» (*läuft im Kino*), а не «відбуватися».

> [!quiz] Склади речення: «Критики дуже високо оцінили фільм.»
> level: B2 · type: order · id: de-b2-kultur-q10
>
> ```text order
> Die
> Kritiker
> haben
> den
> Film
> sehr
> gelobt.
> hat ✗
> ```
>
> **Пояснення:** підмет *Kritiker* — множина, тому допоміжне *haben*, а не *hat*. Дієприкметник *gelobt* — в кінці.

> [!quiz] Як по-німецьки: «Фільм тримає в напрузі»?
> level: B2 · type: single · id: de-b2-kultur-q11
> - [ ] Der Film ist angespannt.
> - [x] Der Film ist spannend.
> - [ ] Der Film ist gespannt.
> - [ ] Der Film ist verspannt.
>
> **Пояснення:** *spannend* — про фільм, що захоплює. *Angespannt* — про людину або атмосферу в напрузі, *gespannt* — «з цікавістю чекаючий», *verspannt* — «з затиснутими мʼязами».

> [!quiz] Що таке Verriss?
> level: B2 · type: single · id: de-b2-kultur-q12
> - [ ] схвальна рецензія з рекомендацією
> - [x] дуже негативна, нищівна рецензія
> - [ ] нагорода за найгірший фільм року
> - [ ] розірваний примірник книжки
>
> **Пояснення:** *Verriss* — від *verreißen* («розірвати на шматки»): гостра негативна критика. До нагород і фізичного стану книжки слово не стосується.

## Фішки

> [!reel] 🎬 Берлінале народилася як «вітрина вільного світу»
> Фестиваль заснували 1951 року на початку холодної війни в поділеному Берліні. За словами організаторів, Берлінале створювали для берлінської публіки як «Schaufenster der freien Welt». Досі вона відома як найбільш політичний із великих кінофестивалів. Нагороди головного конкурсу — «Золотий ведмідь» та «Срібні ведмеді».

> [!reel] 🎭 Szene — це й «скандал»
> Слово *Szene* прийшло з латинського *scaena*, а те — з грецького *skēnḗ*: спершу воно означало «місце дії, сцену». З часом зʼявилися інші значення: епізод пʼєси (XVIII ст.), а на початку XIX століття — «сварка, гучна розмова». Тому *Mach keine Szene!* — «Не влаштовуй скандалу!», і до театру цей вислів уже не стосується.

> [!reel] 🩺 kritisch — слово з медицини
> Від грецького *kritikós* («той, що вирішує») пішло латинське *diēs criticī* — «критичні дні», коли за перебігом хвороби вирішувалася доля пацієнта. На початку XVI століття цей вислів потрапив у німецькі медичні тексти, а згодом зʼявилося *kritisch* («вирішальний, загрозливий»). Від того ж грецького кореня *krī́nein* («розрізняти, вирішувати») походять і *Kritik*, і *Krise*.

## Джерела та що почитати

- [Berlinale — Festival Profile](https://www.berlinale.de/en/festival/festival-profile.html): 1951, «showcase of the free world», дванадцять днів у лютому, близько 200 фільмів.
- [Berlinale — Prizes of the International Jury](https://www.berlinale.de/en/festival/awards-and-juries/international-jury.html): Золотий і Срібні ведмеді.
- [Berlinale — Sections](https://www.berlinale.de/en/festival/sections/all-sections.html): Panorama, Generation, Forum.
- [DWDS — Szene](https://www.dwds.de/wb/Szene): значення й етимологія.
- [DWDS — Kritik](https://www.dwds.de/wb/Kritik): значення й походження від грецького *kritikós*.
- [DWDS — Rezension](https://www.dwds.de/wb/Rezension) і [Verriss](https://www.dwds.de/wb/Verriss): значення слів.
- [DWDS — Regisseur](https://www.dwds.de/wb/Regisseur): походження від фр. *régie*.

> [!important] Підсумок
> - Фільм: *Handlung, Figur, Szene, Schnitt, Filmmusik, Inszenierung*; ролі: *Hauptrolle, Besetzung, Regisseur*.
> - Рецензія: *Info → Inhalt → Bewertung → Fazit*; оцінка: *fesselnd, mitreißend, tiefgründig* проти *langatmig, vorhersehbar, oberflächlich*.
> - *Kritik* може бути схвальною; *Verriss* — нищівна; *Krimi* — детектив; *spannend* ≠ *angespannt*.
> - Місце й час дії: *Der Film spielt in …*; показ у кіно: *läuft*.
> - Berlinale: з 1951 року, дванадцять днів у лютому, Золотий і Срібні ведмеді від Internationale Jury.
