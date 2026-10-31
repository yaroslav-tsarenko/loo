---
title: Їжа й напої — регіональна кухня
id: dl-a2-07
level: A2
icon: px:apple
tags: [deutsch, landeskunde, skills, a2, land, essen, brot, regional]
prerequisites: ["[[Deutschland - A2 - 06. Свята II — Karneval, Ostern, Oktoberfest, Sankt Martin, Maibaum]]"]
estimatedMinutes: 40
---

# Їжа й напої — регіональна кухня

> [!success] Після цього розділу ти зможеш
> - розповісти, чим німецька **Brotkultur** незвичайна, і назвати приблизне число сортів хліба та рік, коли її внесли до національного списку нематеріальної спадщини;
> - пояснити, що таке **Abendbrot**, **Brotzeit** і **Kaffee und Kuchen** і де в дні німця місце кожного з них;
> - назвати кілька регіональних страв — **Spätzle**, **Labskaus**, **Currywurst**, **Bratwurst** — і сказати, звідки вони;
> - розповісти про **Reinheitsgebot** 1516 року: що в ньому було, чого не було і чому його часто розуміють неправильно;
> - замовити просту їжу в пекарні чи на Imbiss і сказати, що ти ситий (*Ich bin satt*), а не «повний».

## Передбач

> [!quiz] Скільки видів хліба й хлібобулочних виробів налічує Deutsches Brotregister?
> level: A2 · type: single · id: dl-a2-07-q01
> - [ ] близько 30
> - [ ] близько 300
> - [x] понад 3000
> - [ ] понад 30 000
>
> **Пояснення:** Deutsches Brotinstitut веде реєстр хліба й пише, що в ньому наразі зафіксовано понад 3000 різних сортів, які щодня випікають у Німеччині. Це не «3000 назв із давніх рецептів», а те, що справді пекарі печуть і продають сьогодні. Інші джерела називають трохи більші числа (3200 і більше), тому безпечна форма — «понад 3000».

## Оповідь

### Brot — не просто хліб

Сам Deutsches Brotinstitut називає німецьку хлібну культуру «світово унікальною». Перевірити таке порівняння важко, а ось число з реєстру є: у Brotregister інститут веде облік понад 3000 сортів — від чорного **Roggenbrot** і темного **Vollkornbrot** до маленьких булочок **Brötchen**. Німецька комісія у справах ЮНЕСКО пояснює таку розмаїтість місцевим ґрунтом і кліматом та історією окремих земель: пекарі пристосовувалися до нестач, умов і воєн.

У 2014 році **Deutsche Brotkultur** потрапила до Bundesweites Verzeichnis des immateriellen Kulturerbes — національного списку нематеріальної культурної спадщини, який веде Німецька комісія у справах ЮНЕСКО. Зверни увагу: це **національний** список, а не Світова спадщина ЮНЕСКО. У рекламі пекарень іноді пишуть «Weltkulturerbe» — це неточно.

### Wurst, Currywurst і Bratwurst

**Die Wurst** — друга візитівка. Найвідоміша вуличка страва — **Currywurst**: порізана смажена ковбаска з томатним соусом і порошком каррі, а до неї *Pommes* або *Brötchen*. Історія каже, що її придумала Herta Heuwer 4 вересня 1949 року в Берліні-Шарлоттенбурзі; на це посилається і Патентне відомство (DPMA), і тут же додає: про першість сперечаються також Гамбург і Рур. Сама Heuwer зареєструвала не рецепт, а назву соусу — **Chillup** (товарний знак внесли до реєстру 21 січня 1959 року).

**Bratwurst** — смажена ковбаска, яку їдять у кожному регіоні по-своєму. А от слово для людини, що її робить, залежить від землі: на півдні й у Швейцарії кажуть **Metzger**, на півночі й сході частіше **Fleischer** чи **Schlachter** (в Австрії — *Fleischhauer*).

### Kaffee und Kuchen, Abendbrot і Brotzeit

День німця зазвичай поділений так: **Frühstück** (булочка, хліб, кава), **Mittagessen** (раніше головна гаряча страва дня), потім у вихідні — **Kaffee und Kuchen** на початку другої половини дня: кава чи чай і пиріг. Слово **Kuchen** — це випічка (яблучний пиріг, сирник, кекс на листі), а **Torte** — святковий торт із кремом чи кількома шарами.

Увечері багато родин їдять **Abendbrot**: хліб, масло, сир, ковбаса, огірки — зазвичай без гарячого. Назва буквально «вечірній хліб», а означає вечерю. У Баварії таку прохолодну закуску звуть **Brotzeit**, у Швабії — **Vesper**. Це звичай, а не правило: багато хто сьогодні вечеряє гарячим, особливо в місті.

> [!diagram] День німця: від Frühstück до Abendbrot
> ```yaml
> layout: flow
> nodes:
>   - { id: fr, label: "зранку", text: "Frühstück", note: "Brötchen, Brot, Kaffee", tone: yellow }
>   - { id: mi, label: "в обід", text: "Mittagessen", note: "часто гаряча страва", tone: pink }
>   - { id: ku, label: "по обіді", text: "Kaffee und Kuchen", note: "частіше у вихідні й на гостини", tone: gray }
>   - { id: ab, label: "ввечері", text: "Abendbrot", note: "хліб, сир, Wurst — без гарячого", tone: yellow }
> steps:
>   - { focus: fr, note: "Сніданок: булочка чи хліб із маслом, сиром або варенням і кава." }
>   - { move: { from: fr, to: mi, value: "Mittag" }, note: "В обід зʼїдають головну гарячу страву — так було в багатьох родинах, хоч у місті це дедалі рідше." }
>   - { move: { from: mi, to: ku, value: "Kuchen" }, note: "У вихідні й на гостини — кава й пиріг: Kaffee und Kuchen." }
>   - { move: { from: ku, to: ab, value: "kalt" }, note: "Ввечері — Abendbrot: хліб, масло, сир, ковбаса. Назва походить від «Brot»." }
> ```

### Регіональна кухня: Spätzle, Labskaus, Spargel

Німеччина — країна регіонів, тому «німецька кухня» — це мозаїка.

- **Spätzle** — яєчні «клецки» з борошна, яйця й води; їх зазвичай їдять у Швабії (Баден-Вюртемберг і баварська Швабія). Назва **Schwäbische Spätzle / Schwäbische Knöpfle** з березня 2012 року захищена в ЄС як g.g.A. (geschützte geografische Angabe): справжніми можуть називатися лише ті, що зроблені в Швабії.
- **Labskaus** — страва північних портових міст, насамперед Гамбурга й Бремена: солонина, картопля, цибуля, буряк, до нього — яйце та оселедець. Це страва моряків, бо інші продукти на кораблях довго не зберігалися. Гамбурзький портал підкреслює, що вона не є «оригінально гамбурзькою». Походження слова точно невідоме; найчастіше його виводять від англійського *lobscouse*.
- **Spargel** — біла спаржа: навесні в Німеччині є «сезон спаржі» (*Spargelzeit*), і її їдять із картоплею, шинкою та соусом.
- **Wein** — вино роблять переважно у 13 німецьких виноробних регіонах (*Weinbaugebiete*); за площею лідирують Rheinhessen, Pfalz, Baden і Württemberg. Найважливіший сорт білого — Riesling. А **Schorle** — це вино чи сік, розбавлені газованою водою (*Weinschorle*, *Apfelschorle*).

> [!diagram] Північ і південь: що де їдять
> ```yaml
> layout: compare
> columns: { n: "Північ — Hamburg, Bremen", s: "Південь — Schwaben, Bayern" }
> nodes:
>   - { id: n1, col: n, label: "страва", text: "Labskaus", note: "моряцька страва: солонина, картопля, цибуля, буряк", tone: yellow }
>   - { id: n2, col: n, label: "портове місто", text: "Hamburg, Bremen", note: "морські порти півночі", tone: gray }
>   - { id: s1, col: s, label: "страва", text: "Spätzle", note: "g.g.A. «Schwäbische Spätzle» з 2012 року", tone: pink }
>   - { id: s2, col: s, label: "вечеря", text: "Brotzeit / Vesper", note: "хліб, Wurst, сир, Brezel", tone: gray }
>   - { id: s3, col: s, label: "пиво", text: "Reinheitsgebot 1516", note: "Ingolstadt, Баварія", tone: pink }
> steps:
>   - { show: [n1, s1], note: "На півночі — моряцька страва Labskaus, на півдні — Spätzle." }
>   - { show: [n2, s2], note: "Різниця є й у вечері: на півдні кажуть Brotzeit чи Vesper, на півночі й у центрі — Abendbrot." }
>   - { show: s3, note: "Reinheitsgebot — баварський закон 1516 року, який згодом поширився на всю Німеччину." }
> ```

### Bier і Reinheitsgebot

**Reinheitsgebot** — «закон чистоти» для пива. Його видали 23 квітня 1516 року в Інгольштадті герцоги Вільгельм IV та Людвіг X (для герцогства Баварія). У тексті сказано, що пиво має варитися лише з ячменю (*Gerste*), хмелю (*Hopfen*) і води (*Wasser*). **Дріжджів у тексті немає** — тоді ще не знали, що саме вони бродять. Спершу закон діяв лише в Баварії; пізніше його поширили на весь Рейх. Сьогодні його положення — частина німецького пивоварного права (*Vorläufiges Biergesetz*, § 9). Для пива верхового бродіння дозволений ще й пшеничний солод (звідси *Weißbier*).

Ще одне непорозуміння: Reinheitsgebot — не гарантія смаку чи якості, він лише каже, з чого можна варити пиво за німецьким правом (є й винятки для «особливих» сортів). А місце, де влітку пʼють пиво просто неба, — **Biergarten**.

## Приклади

- *Zum Frühstück esse ich ein Brötchen mit Butter und Käse.* — На сніданок я їм булочку з маслом і сиром.
- *Zum Abendbrot gibt es bei uns Brot, Käse und Wurst.* — На вечерю в нас хліб, сир і ковбаса.
- *Am Sonntag trinken wir Kaffee und essen Kuchen.* — У неділю ми пʼємо каву й їмо пиріг.
- *Die Spätzle sind aus Schwaben.* — Spätzle — зі Швабії.
- *In Hamburg probiere ich Labskaus.* — У Гамбурзі я спробую Labskaus.
- *Eine Currywurst mit Pommes, bitte!* — Одну Currywurst із картоплею фрі, будь ласка!
- *Im Frühling gibt es überall Spargel.* — Навесні скрізь є спаржа.
- *Ich bin satt, danke. Es war sehr lecker.* — Я ситий, дякую. Було дуже смачно.
- *Wir sitzen im Biergarten und trinken eine Apfelschorle.* — Ми сидимо в пивному саду й пʼємо яблучний шорле.
- *Was ist hier die regionale Spezialität?* — Яка тут регіональна страва?

## Слова

### Хліб і випічка

> [!word] das Abendbrot
> ipa: /ˈaːbn̩tˌbʁoːt/ · pos: noun · level: A2 · id: dl-a2-07-w01
> uk: вечеря (холодна: хліб, сир, ковбаса)
> forms: — (без множини)
> example: Zum **Abendbrot** gibt es Brot, Käse und Wurst. — На вечерю є хліб, сир і ковбаса.
> note: Abendessen (A1-18) — загальне слово; Abendbrot — саме холодна вечеря. AT/CH частіше «Nachtessen» (CH) та «Jause» (AT, між прийомами їжі).

> [!word] die Brotzeit
> ipa: /ˈbʁoːtˌtsaɪ̯t/ · pos: noun · level: A2 · id: dl-a2-07-w02
> uk: Brotzeit (баварська холодна закуска з хліба, ковбаси, сиру)
> forms: die Brotzeiten
> example: Wir machen im Biergarten **Brotzeit**. — Ми їмо хліб із ковбасою в пивному саду.
> note: Бавар. слово; у Швабії й Бадені — *Vesper*; AT — *Jause*.

> [!word] das Vollkornbrot
> ipa: /ˈfɔlkɔʁnˌbʁoːt/ · pos: noun · level: A2 · id: dl-a2-07-w03
> uk: цільнозерновий хліб
> forms: die Vollkornbrote
> example: Zum Frühstück esse ich gern **Vollkornbrot**. — На сніданок я охоче їм цільнозерновий хліб.

> [!word] die Brezel
> ipa: /ˈbʁeːtsl̩/ · pos: noun · level: A2 · id: dl-a2-07-w04
> uk: брецель (бубличок із соляною скоринкою)
> forms: die Brezeln
> example: Ich nehme eine **Brezel** mit Butter. — Я візьму брецель із маслом.
> note: Бавар. *Brezn*, AT *Breze*, також *Brezen*.

> [!word] die Torte
> ipa: /ˈtɔʁtə/ · pos: noun · level: A2 · id: dl-a2-07-w05
> uk: торт
> forms: die Torten
> example: Zum Geburtstag gibt es eine **Torte**. — На день народження буде торт.
> note: Kuchen (A1-18) — загальна випічка (пиріг), Torte — святковий торт із кремом чи шарами.

> [!word] die Bäckerei
> ipa: /bɛkəˈʁaɪ̯/ · pos: noun · level: A2 · id: dl-a2-07-w06
> uk: пекарня
> forms: die Bäckereien
> example: In der **Bäckerei** kaufe ich frische Brötchen. — У пекарні я купую свіжі булочки.

### Мʼясо, ковбаса й гарніри

> [!word] die Bratwurst
> ipa: /ˈbʁaːtvʊʁst/ · pos: noun · level: A2 · id: dl-a2-07-w07
> uk: смажена ковбаска
> forms: die Bratwürste
> example: Möchten Sie eine **Bratwurst** mit Senf? — Бажаєте смажену ковбаску з гірчицею?

> [!word] die Currywurst
> ipa: /ˈkœʁiˌvʊʁst/ · pos: noun · level: A2 · id: dl-a2-07-w08
> uk: каривурст (ковбаска з томатно-каррі соусом)
> forms: die Currywürste
> example: Eine **Currywurst** mit Pommes, bitte. — Одну каривурст із картоплею фрі, будь ласка.
> note: Берлінська закуска; за традицією її придумала Herta Heuwer у 1949 році.

> [!word] der Aufschnitt
> ipa: /ˈaʊ̯fʃnɪt/ · pos: noun · level: A2 · id: dl-a2-07-w09
> uk: нарізка (ковбаса, шинка, сир)
> forms: — (без множини)
> example: Zum Brot nehme ich Käse und **Aufschnitt**. — До хліба я беру сир і нарізку.

> [!word] der Senf
> ipa: /zɛnf/ · pos: noun · level: A2 · id: dl-a2-07-w10
> uk: гірчиця
> forms: — (без множини)
> example: Die Bratwurst schmeckt gut mit **Senf**. — Братвурст смачна з гірчицею.

> [!word] die Gurke
> ipa: /ˈɡʊʁkə/ · pos: noun · level: A2 · id: dl-a2-07-w11
> uk: огірок
> forms: die Gurken
> example: Zum Abendbrot gibt es **Gurken** und Tomaten. — На вечерю є огірки й помідори.

> [!word] das Sauerkraut
> ipa: /ˈzaʊ̯ɐkʁaʊ̯t/ · pos: noun · level: A2 · id: dl-a2-07-w12
> uk: квашена капуста
> forms: — (без множини)
> example: Zur Bratwurst gibt es **Sauerkraut**. — До братвурст є квашена капуста.
> 
### Регіональні страви

> [!word] die Spätzle
> ipa: /ˈʃpɛtslə/ · pos: noun · level: A2 · id: dl-a2-07-w13
> uk: шпецле (яєчні «клецки» зі Швабії)
> forms: — (лише множина)
> example: In Schwaben isst man gern **Spätzle**. — У Швабії охоче їдять шпецле.
> note: Слово переважно у множині; однина *das Spätzle* — одна «клецка». Назва *Schwäbische Spätzle* — g.g.A. в ЄС з 2012 року.

> [!word] das Labskaus
> ipa: /ˈlapskaʊ̯s/ · pos: noun · level: A2 · id: dl-a2-07-w14
> uk: лабскаус (страва моряків: солонина, картопля, цибуля, буряк)
> forms: — (без множини)
> example: In Hamburg esse ich einmal **Labskaus**. — У Гамбурзі я раз зʼїм лабскаус.

> [!word] der Spargel
> ipa: /ˈʃpaʁɡl̩/ · pos: noun · level: A2 · id: dl-a2-07-w15
> uk: спаржа
> forms: die Spargel
> example: Im Mai gibt es frischen **Spargel**. — У травні є свіжа спаржа.
> note: AT/CH часто множина *die Spargeln*.

> [!word] die Spezialität
> ipa: /ʃpetsi̯aliˈtɛːt/ · pos: noun · level: A2 · id: dl-a2-07-w16
> uk: фірмова, регіональна страва
> forms: die Spezialitäten
> example: Was ist hier die **Spezialität**? — Яка тут фірмова страва?

> [!word] das Gericht
> ipa: /ɡəˈʁɪçt/ · pos: noun · level: A2 · id: dl-a2-07-w17
> uk: страва
> forms: die Gerichte
> example: Das ist ein typisches **Gericht** aus dem Norden. — Це типова страва з півночі.
> note: Те саме слово означає і «суд» (das Gericht).

> [!word] die Mahlzeit
> ipa: /ˈmaːltsaɪ̯t/ · pos: noun · level: A2 · id: dl-a2-07-w18
> uk: прийом їжі
> forms: die Mahlzeiten
> example: Das Frühstück ist die erste **Mahlzeit** des Tages. — Сніданок — перший прийом їжі за день.
> note: «Mahlzeit!» — це ще й вітання в обід на роботі (як «смачного»).

> [!word] der Imbiss
> ipa: /ˈɪmbɪs/ · pos: noun · level: A2 · id: dl-a2-07-w19
> uk: закусочна, перекус
> forms: die Imbisse
> example: Am **Imbiss** kaufe ich eine Currywurst. — На закусочній я купую каривурст.
> note: Часто *Imbissbude*, *Imbissstand*.

> [!word] herzhaft
> ipa: /ˈhɛʁtshaft/ · pos: adj · level: A2 · id: dl-a2-07-w20
> uk: ситний, пікантний (не солодкий)
> forms: herzhafter · am herzhaftesten
> example: Zum Frühstück esse ich lieber etwas **Herzhaftes**. — На сніданок я волію щось несолодке.

> [!word] die Vielfalt
> ipa: /ˈfiːlfalt/ · pos: noun · level: A2 · id: dl-a2-07-w21
> uk: різноманітність
> forms: — (без множини)
> example: In Deutschland gibt es eine große **Vielfalt** an Brot. — У Німеччині велике розмаїття хліба.

### Пиво й напої

> [!word] das Reinheitsgebot
> ipa: /ˈʁaɪ̯nhaɪ̯tsɡəˌboːt/ · pos: noun · level: A2 · id: dl-a2-07-w22
> uk: «закон чистоти» (для пива, 1516)
> forms: — (без множини)
> example: Das **Reinheitsgebot** gibt es seit 1516. — Reinheitsgebot існує з 1516 року.

> [!word] der Biergarten
> ipa: /ˈbiːɐ̯ɡaʁtn̩/ · pos: noun · level: A2 · id: dl-a2-07-w23
> uk: пивний сад
> forms: die Biergärten
> example: Im Sommer sitzen wir im **Biergarten**. — Улітку ми сидимо в пивному саду.

> [!word] die Schorle
> ipa: /ˈʃɔʁlə/ · pos: noun · level: A2 · id: dl-a2-07-w24
> uk: шорле (сік або вино, розбавлені газованою водою)
> forms: die Schorlen
> example: Ich trinke eine Apfel**schorle**. — Я пʼю яблучний шорле.
> note: *die Apfelschorle*, *die Weinschorle*; AT: *Gespritzter* (вино з содовою).

> [!word] der Metzger
> ipa: /ˈmɛtsɡɐ/ · pos: noun · level: A2 · id: dl-a2-07-w25
> uk: мʼясник
> forms: die Metzger
> example: Beim **Metzger** kaufe ich frische Wurst. — У мʼясника я купую свіжу ковбасу.
> note: Регіонально: *Fleischer* (північ і схід), *Schlachter* (північ), AT *Fleischhauer*; жіноча форма — *die Metzgerin*.

## Слухаємо

> [!listen] Що буде на вечерю?
> level: A2 · type: choice · speed: slow · id: dl-a2-07-l01
> audio: Zum Abendbrot gibt es Brot, Käse und Wurst.
> - [x] Zum Abendbrot gibt es Brot, Käse und Wurst.
> - [ ] Zum Frühstück gibt es Brot, Käse und Wurst.
> - [ ] Zum Abendessen gibt es Suppe und Fleisch.
>
> **Пояснення:** *das Abendbrot* — холодна вечеря з хліба, сиру й ковбаси. *Frühstück* — це сніданок, а *Abendessen* — загальне слово «вечеря». Тут сказано саме про Abendbrot.

> [!listen] Коли Kaffee und Kuchen?
> level: A2 · type: answer · speed: slow · id: dl-a2-07-l02
> audio: A: Kommst du am Sonntag zu Kaffee und Kuchen?
> audio: B: Gern! Um wie viel Uhr?
> audio: A: Um drei Uhr.
> - [ ] о 13:00
> - [x] о 15:00
> - [ ] о 18:00
> - [ ] о 20:00
>
> **Пояснення:** *um drei Uhr* — о третій; в обіднику це 15:00. Kaffee und Kuchen — це зустріч по обіді, а не вранці й не ввечері.

> [!listen] Напиши або скажи, що почув
> level: A2 · type: dictation · speed: slow · id: dl-a2-07-l03
> audio: Im Norden isst man gern Labskaus, im Süden Spätzle.
>
> **Пояснення:** *im Norden* / *im Süden* — на півночі / на півдні. *Man isst* — безособове «їдять»; *Labskaus* і *Spätzle* — регіональні страви. Слово *Spätzle* стоїть без артикля, як і *Labskaus*.

> [!listen] Що замовляє гість?
> level: A2 · type: answer · speed: slow · id: dl-a2-07-l04
> audio: A: Guten Tag, was darf es sein?
> audio: B: Eine Currywurst mit Pommes, bitte.
> audio: A: Mit Ketchup oder Mayo?
> audio: B: Mit Ketchup, bitte.
> - [ ] Bratwurst mit Sauerkraut
> - [x] Currywurst mit Pommes
> - [ ] Brezel mit Butter
> - [ ] Spätzle mit Soße
>
> **Пояснення:** *Was darf es sein?* — типове запитання продавця: «Що бажаєте?». *Pommes* — картопля фрі, розмовне скорочення від *Pommes frites*.

> [!listen] Reinheitsgebot. Заповни нотатки.
> level: A2 · type: fill · speed: slow · id: dl-a2-07-l05
> audio: Das Reinheitsgebot gibt es seit dem Jahr fünfzehnhundertsechzehn. Es kommt aus Ingolstadt. Im Bier sind nur Gerste, Hopfen und Wasser erlaubt.
>
> ```fill
> Jahr: [[1516]]
> Stadt: [[Ingolstadt]]
> Zutaten: [[Gerste]], [[Hopfen]] und [[Wasser]]
> ```
>
> **Пояснення:** *das Jahr fünfzehnhundertsechzehn* — 1516 (німці читають роки як «пʼятнадцять сотень шістнадцять»). *Gerste* — ячмінь, *Hopfen* — хміль. Дріжджів у тексті закону немає.

## Вимова

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: dl-a2-07-s01
> text: Ein Brötchen mit Butter und Käse, bitte.
> ipa: /aɪ̯n ˈbʁøːtçən mɪt ˈbʊtɐ ʊnt ˈkɛːzə ˈbɪtə/
> tip: ö у Brötchen — довгий [øː], губи вперед; -chen — [çən], мʼякий звук як у «хіть»; -er у Butter звучить як короткий [ɐ].
> uk: Булочку з маслом і сиром, будь ласка.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: dl-a2-07-s02
> text: Zum Abendbrot gibt es Brot, Käse und Wurst.
> ipa: /tsʊm ˈaːbn̩tbʁoːt ɡiːpt ɛs bʁoːt ˈkɛːzə ʊnt vʊʁst/
> tip: gibt — [ɡiːpt], b на кінці складу глухне до [p]; Wurst — w читається як «в», u короткий.
> uk: На вечерю є хліб, сир і ковбаса.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: dl-a2-07-s03
> text: Eine Currywurst mit Pommes, bitte.
> ipa: /ˈaɪ̯nə ˈkœʁivʊʁst mɪt pɔms ˈbɪtə/
> tip: Currywurst — перший склад «кьо», як у Curry [ˈkœʁi]; Pommes — [pɔms], без «е» на кінці.
> uk: Одну каривурст із картоплею фрі, будь ласка.

## Типові помилки й пастки

> [!pitfall] Abendbrot — це не «хліб на вечір»
> Слово **Abendbrot** вживають у значенні «вечеря», не лише про хліб, і воно здебільшого означає **холодну** вечерю. Якщо тебе запросили «zum Abendbrot», не чекай борщу чи гарячих страв — сподівайся на хліб, сир, ковбасу й овочі. Для загальної «вечері» є *das Abendessen*. Це звичай, а не закон: багато німців вечеряють гарячим.

> [!pitfall] Kuchen і Torte — не одне й те саме
> **Kuchen** — це «пиріг, випічка»: *Apfelkuchen*, *Käsekuchen*, *Streuselkuchen*. **Torte** — святковий багатошаровий торт із кремом. «Торт» українською зазвичай відповідає *Torte*, а на *Kaffee und Kuchen* подають частіше саме Kuchen.

> [!pitfall] Reinheitsgebot — не «закон усієї Німеччини від 1516 року»
> Часто кажуть, що з 1516 року всю Німеччину змушували варити пиво за цим законом. Насправді його видали для **герцогства Баварія**; на інші землі він поширився пізніше. У тексті 1516 року **немає дріжджів** — їх назвали значно пізніше. Сьогодні положення Reinheitsgebot — частина німецького права про пиво, а не стародавнє «чудо без змін».

> [!pitfall] «Ich bin voll» — не «я наївся»
> Українське «я наївся» перекладай як **Ich bin satt**. Фразу *Ich bin voll* німці розуміють по-різному, а розмовне *voll sein* може означати «бути пʼяним». Ввічливо відмовитися від добавки: *Danke, ich bin satt.* А ще кажуть *Ich habe Hunger / Durst* («маю голод / спрагу»), а не «я голодний».

## Landeskunde-Text

> [!example] Brot, Kuchen und Spätzle
> Brot ist in Deutschland etwas Besonderes. Im Deutschen Brotregister stehen mehr als 3.000 Brotsorten, zum Beispiel Roggenbrot, Vollkornbrot und Brötchen. Seit 2014 gehört die „Deutsche Brotkultur“ zum immateriellen Kulturerbe in Deutschland.
>
> Viele Familien essen abends Abendbrot. Dann gibt es Brot, Butter, Käse, Wurst und Gurken, aber oft kein warmes Essen. Das warme Essen gibt es am Mittag. Am Sonntagnachmittag trinkt man Kaffee und isst Kuchen.
>
> Auch regional isst man verschieden. In Schwaben im Süden isst man gern Spätzle. Im Norden, zum Beispiel in Hamburg und Bremen, ist Labskaus eine bekannte Spezialität. In Bayern trinkt man dazu ein Bier. Das Reinheitsgebot für Bier gibt es seit 1516.
>
> *Слова:* *das Kulturerbe* — культурна спадщина; *immateriell* — нематеріальний; *regional* — регіональний, місцевий; *verschieden* — різний.

> [!quiz] Lies den Text. Was gibt es oft zum Abendbrot?
> level: A2 · type: single · id: dl-a2-07-q02
> - [ ] Suppe und Fleisch
> - [ ] Spätzle mit Soße
> - [x] Brot, Butter, Käse, Wurst und Gurken
> - [ ] Kuchen und Kaffee
>
> **Пояснення:** *Dann gibt es Brot, Butter, Käse, Wurst und Gurken, aber oft kein warmes Essen.* Kaffee und Kuchen — це інший час дня (по обіді, у неділю), а Spätzle — регіональна страва.

> [!quiz] Lies den Text. Seit wann gehört die Brotkultur zum Kulturerbe?
> level: A2 · type: single · id: dl-a2-07-q03
> - [ ] seit 1516
> - [ ] seit 1949
> - [x] seit 2014
> - [ ] seit 3.000 Jahren
>
> **Пояснення:** *Seit 2014 gehört die „Deutsche Brotkultur“ zum immateriellen Kulturerbe.* 1516 — рік Reinheitsgebot, а 3.000 — кількість сортів хліба, а не рік.

> [!quiz] Lies den Text. Wo isst man Labskaus?
> level: A2 · type: single · id: dl-a2-07-q04
> - [ ] in Schwaben
> - [ ] in Bayern
> - [x] im Norden, zum Beispiel in Hamburg und Bremen
> - [ ] nur in Berlin
>
> **Пояснення:** *Im Norden, zum Beispiel in Hamburg und Bremen, ist Labskaus eine bekannte Spezialität.* Spätzle — це Швабія; Bayern у тексті згадано лише у звʼязку з пивом.

## Практика

> [!quiz] Що правильно про Reinheitsgebot?
> level: A2 · type: single · id: dl-a2-07-q05
> - [ ] Закон від 1516 року відразу діяв у всій Німеччині.
> - [ ] У тексті 1516 року названо дріжджі.
> - [x] Його видали 1516 року в Інгольштадті для Баварії; дріжджів у тексті немає.
> - [ ] Він забороняє пити пиво, зварене в інших країнах.
>
> **Пояснення:** 23 квітня 1516 року герцоги Вільгельм IV та Людвіг X проголосили його на Ландтазі в Інгольштадті для герцогства Баварія. Дозволені інгредієнти — *Gerste*, *Hopfen*, *Wasser*; дріжджі (*Hefe*) не згадано, бо про їхню роль тоді не знали. Закон стосується того, що вживає пивовар, а не того, що пиють люди.

> [!quiz] Обери всі правильні твердження про німецький хліб. Обери всі правильні відповіді.
> level: A2 · type: multi · id: dl-a2-07-q06
> - [x] У Brotregister зафіксовано понад 3000 сортів.
> - [x] Deutsche Brotkultur з 2014 року є в національному списку нематеріальної спадщини.
> - [ ] Deutsche Brotkultur — обʼєкт Світової спадщини ЮНЕСКО.
> - [ ] У Німеччині є лише три види хліба: світлий, темний і жито.
>
> **Пояснення:** національний список веде Німецька комісія у справах ЮНЕСКО, і це **не** міжнародний список ЮНЕСКО. Назви «Weltkulturerbe» в рекламі пекарень вводять в оману. Сортів значно більше трьох.

> [!quiz] Розстав прийоми їжі в порядку дня — від ранку до вечора
> level: A2 · type: order · id: dl-a2-07-q07
>
> ```text order
> das Frühstück
> das Mittagessen
> Kaffee und Kuchen
> das Abendbrot
> ```
>
> **Пояснення:** сніданок (*das Frühstück*) → обід (*das Mittagessen*) → кава й пиріг по обіді (*Kaffee und Kuchen*) → вечеря (*das Abendbrot*). Kaffee und Kuchen — не обовʼязковий щодня прийом, а звичай вихідних і гостин.

> [!quiz] Заповни пропуски словами з банку
> level: A2 · type: fill · id: dl-a2-07-q08 · bank: Süden, Frühstück, Westen
>
> ```text fill
> Zum [[Abendbrot]] gibt es oft Brot, Käse und Wurst.
> Spätzle sind eine Spezialität aus [[Schwaben]].
> Labskaus kommt aus dem [[Norden]].
> Das [[Reinheitsgebot]] ist ein Gesetz für Bier.
> ```
>
> **Пояснення:** *Abendbrot* — холодна вечеря; *Schwaben* — регіон Spätzle; *aus dem Norden* — Dativ після *aus*; *das Reinheitsgebot* — середній рід. *Süden*, *Frühstück* і *Westen* — зайві слова.

> [!quiz] Склади речення: «У неділю ми пʼємо каву й їмо пиріг».
> level: A2 · type: order · id: dl-a2-07-q09
>
> ```text order
> Am Sonntag
> trinken
> wir
> Kaffee und essen Kuchen.
> haben ✗
> ```
>
> **Пояснення:** порядок слів у ствердженні: дієслово — на другому місці, навіть коли речення починається з *Am Sonntag*. *Haben* — зайве дієслово.

> [!quiz] Як ввічливо сказати, що ти наївся?
> level: A2 · type: single · id: dl-a2-07-q10
> - [ ] Ich bin voll.
> - [x] Ich bin satt.
> - [ ] Ich habe es satt.
> - [ ] Ich bin voller.
>
> **Пояснення:** *satt sein* — бути ситим. *Ich bin voll* німці розуміють по-різному (розм. «пʼяний»), а *ich habe es satt* — стійкий вираз «мені це набридло» (*etwas satt haben*), а не «я наївся».

> [!quiz] Яка з цих назв захищена в ЄС як g.g.A. з 2012 року?
> level: A2 · type: single · id: dl-a2-07-q11
> - [ ] Currywurst
> - [ ] Labskaus
> - [x] Schwäbische Spätzle
> - [ ] Abendbrot
>
> **Пояснення:** Регламент (ЄС) № 186/2012 від 7 березня 2012 року вписав *Schwäbische Spätzle / Schwäbische Knöpfle* до реєстру захищених географічних зазначень. Currywurst і Labskaus такого захисту не мають, а Abendbrot — загальна назва прийому їжі.

> [!quiz] Заповни числа й слова з банку
> level: A2 · type: fill · id: dl-a2-07-q12 · bank: 2012, 1949
>
> ```text fill
> Im Brotregister stehen mehr als [[3000|3.000]] Brotsorten.
> Die Brotkultur gehört seit [[2014]] zum Kulturerbe.
> Das Reinheitsgebot für Bier gibt es seit [[1516]].
> ```
>
> **Пояснення:** Brotregister — понад 3000 сортів; 2014 — рік внесення до національного списку; 1516 — рік Reinheitsgebot. *2012* і *1949* — зайві числа: 2012 — захист Spätzle, 1949 — Currywurst, а не хліб чи пиво.

## Фішки

> [!reel] 🥖 3000 видів хліба — і лише в Німеччині?
> Deutsches Brotinstitut веде реєстр: понад 3000 сортів хліба й виробів із борошна, які пекарі печуть сьогодні. Точне число залежить від того, що вважати «окремим видом». А ось рік 2014 і статус — «національна нематеріальна спадщина» — чітко задокументовані; Світовою спадщиною ЮНЕСКО хліб не є.

> [!reel] 🍺 У Reinheitsgebot не було дріжджів
> У тексті 1516 року названо лише ячмінь, хміль і воду. Дріжджі не згадано: тоді ще не знали, що саме вони бродять. Закон видали в Інгольштадті для Баварії; на решту німецьких земель він поширився пізніше.

> [!reel] 🌭 Currywurst: Берлін, 4 вересня 1949 року
> За традицією Herta Heuwer зробила соус із томатної пасти, каррі та вустерського соусу на розі Kantstraße й Kaiser-Friedrich-Straße в Берліні-Шарлоттенбурзі. Патентне відомство (DPMA) називає цю дату, але додає, що першість оскаржують Гамбург і Рур. Зареєстрована назва соусу — Chillup.

> [!reel] ⚓ Labskaus — з британського порту?
> Страву, яку тепер вважають класикою Гамбурга й Бремена, везли моряки. Слово повʼязують з англійським *lobscouse*, але походження остаточно не зʼясоване. Гамбурзький портал прямо пише: Labskaus не «оригінально гамбурзька» страва.

> [!reel] 🍝 Spätzle з географічним захистом
> Назва «Schwäbische Spätzle» з 2012 року — g.g.A. в ЄС. Те, що продають під цією назвою, мусить бути виготовлене в Швабії, а це весь Баден-Вюртемберг і баварська Швабія.

## Джерела та що почитати

- Deutsches Brotinstitut — [Die Deutsche Brotkultur](https://www.brotinstitut.de/brotkultur) і [головна сторінка](https://www.brotinstitut.de/) з відомостями про Deutsches Brotregister (понад 3000 сортів).
- Deutsche UNESCO-Kommission — [Deutsche Brotkultur в Bundesweites Verzeichnis des immateriellen Kulturerbes](https://www.unesco.de/kultur-und-natur/immaterielles-kulturerbe/immaterielles-kulturerbe-deutschland/deutsche-brotkultur) (рік внесення: 2014).
- Deutscher Brauer-Bund — [Reinheitsgebot: Fragen und Antworten](https://brauer-bund.de/reinheitsgebot/fragen-und-antworten/) (23.04.1516, Інгольштадт, дріжджі, чинне право); [bier.de — Das Deutsche Reinheitsgebot](https://www.bier.de/wissen/was-ist-das-deutsche-reinheitsgebot-2/).
- DPMA — [Currywurst: історія товарного знаку Chillup](https://www.dpma.de/dpma/veroeffentlichungen/hintergrund/essentrinken/currywurst/index.html).
- hamburg.de — [Labskaus: Herkunft, Geschichte und Rezept](https://www.hamburg.de/freizeit/essen-trinken/hamburger-kueche/restaurants-labskaus-313168).
- EUR-Lex — [Durchführungsverordnung (EU) Nr. 186/2012: Schwäbische Spätzle / Schwäbische Knöpfle g.g.A.](https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32012R0186).
- Deutsches Weininstitut — [Die 13 deutschen Weinbaugebiete im Profil](https://www.deutscheweine.de/news-medien/meldungen/meldung/783/die-13-deutschen-weinbaugebiete-im-profil).
- DWDS — словникові статті: [Abendbrot](https://www.dwds.de/wb/Abendbrot), [Brotzeit](https://www.dwds.de/wb/Brotzeit), [Spätzle](https://www.dwds.de/wb/Sp%C3%A4tzle), [Labskaus](https://www.dwds.de/wb/Labskaus), [Reinheitsgebot](https://www.dwds.de/wb/Reinheitsgebot), [Currywurst](https://www.dwds.de/wb/Currywurst).

> [!important] Підсумок
> - **Brotkultur:** Brotregister — понад 3000 сортів; з 2014 року в національному списку нематеріальної спадщини (не Світова спадщина ЮНЕСКО).
> - **День:** *Frühstück* → *Mittagessen* → *Kaffee und Kuchen* (вихідні, гостини) → *Abendbrot* (холодна вечеря; на півдні *Brotzeit* / *Vesper*). Це звичаї, а не правила.
> - **Регіони:** *Spätzle* (Швабія, g.g.A. з 2012), *Labskaus* (Гамбург, Бремен), *Currywurst* (Берлін, 1949, спірно), *Spargel* навесні.
> - **Reinheitsgebot:** 23.04.1516, Інгольштадт, Баварія; *Gerste, Hopfen, Wasser*; дріжджів у тексті немає.
> - **Мова:** *Ich bin satt* (не *voll*); *Kuchen* ≠ *Torte*; *Abendbrot* = холодна вечеря.
