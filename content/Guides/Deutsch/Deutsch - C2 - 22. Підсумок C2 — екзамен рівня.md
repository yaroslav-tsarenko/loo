---
title: Підсумок C2 — екзамен рівня
id: de-c2-review
level: C2
icon: px:crown
tags: [deutsch, c2, review, test, gds]
prerequisites: ["[[Deutsch - C2 - 21. Медіація — переказ, резюме, усний переклад у побуті]]"]
estimatedMinutes: 100
---

# Підсумок C2 — екзамен рівня

> [!success] Після цієї теми ти зможеш
> - перевірити себе з усього рівня C2: *стилістичний порядок слів, тонкощі часів і модальності, Schachtelsatz і еліпсис, Konjunktiv у праві й формулах* і лексику тем «Amtsdeutsch, прислівʼя, розмовна мова, етимологія, помʼякшення, гумор, варіанти DACH, хибні друзі, культурні коди, фахова мова, медіація»;
> - розрізняти на слух *wüsste / wusste*, Konjunktiv I у формулах і записати під диктовку речення писемного стилю;
> - пройти міні-іспит у форматі Goethe-Zertifikat C2: GDS — по одному-три завдання з кожної частини *Lesen* і *Hören*, переформулювання з *Schreiben* Teil 1 і репліки для *Sprechen*;
> - почути й вимовити пари, що різняться довготою, наголосом чи кінцем слова (*Wüste / wüsste, Präsens / Präsenz*);
> - позначити в чеклісті «я вмію», що вже працює, а що варто повторити перед іспитом.

Нових правил тут немає: граматика й лексика — з тем C2-01…21 і попередніх рівнів. У текстах міні-іспиту трапляться нові слова (*Stenotypistin, Landschaftspflege, Lastenaufzug*) — розумій їх із контексту, як на справжньому іспиті. Якщо завдання не виходить, повернися до теми, на яку вказує пояснення. Після кожного блоку подивись, де найбільше помилок: це твій план повторення.

> [!diagram] Сказано — мається на увазі: точність C2
> ```yaml
> layout: compare
> columns: { a: "Що сказано", b: "Що зазвичай мається на увазі" }
> nodes:
>   - { id: a1, col: a, label: "Помʼякшення", text: "Das ist nicht ganz unproblematisch.", note: "літота, C2-09", tone: yellow }
>   - { id: a2, col: a, label: "Похвала", text: "Nicht von schlechten Eltern!", note: "літота, C2-09", tone: yellow }
>   - { id: a3, col: a, label: "Евфемізм", text: "eine Preisanpassung", note: "мова економіки, C2-09", tone: yellow }
>   - { id: a4, col: a, label: "Стримана реакція", text: "Das ist ein interessanter Ansatz.", note: "культурний код, C2-19", tone: yellow }
>   - { id: b1, col: b, label: "Помʼякшення", text: "Тут серйозна проблема.", note: "критика без різкості", tone: pink }
>   - { id: b2, col: b, label: "Похвала", text: "Це справді добре.", note: "висока оцінка через заперечення", tone: pink }
>   - { id: b3, col: b, label: "Евфемізм", text: "Ціни зростуть.", note: "пряма мова — для медіації", tone: pink }
>   - { id: b4, col: b, label: "Стримана реакція", text: "Часто — сумнів або «подумаємо».", note: "залежить від тону й продовження", tone: pink }
> steps:
>   - { focus: [a1, a2, a3, a4], note: "Ліва колонка — те, що чути на нараді, в новинах чи від колеги. Граматично все просто." }
>   - { focus: [b1, b2, b3, b4], note: "Права колонка — що за цим зазвичай стоїть. На C2 ти чуєш цей шар і вмієш передати його прямими словами, коли перекладаєш для інших." }
> ```
> Жовтий — дослівне висловлення, рожевий — його звичайне прочитання. Тема пояснення — у підписі.

> [!diagram] Goethe-Zertifikat C2: GDS — чотири модулі
> ```yaml
> layout: flow
> nodes:
>   - { id: le, label: "Lesen · 80 хв", text: "4 частини · 30 завдань", tone: yellow }
>   - { id: ho, label: "Hören · ≈ 35 хв", text: "3 частини · 30 завдань", tone: pink }
>   - { id: sc, label: "Schreiben · 80 хв", text: "Teil 1 + Teil 2", tone: yellow }
>   - { id: sp, label: "Sprechen · ≈ 15 хв", text: "+ 15 хв підготовки", tone: pink }
> steps:
>   - { focus: [le], note: "Lesen: коментар (10), інформаційна стаття (6), репортаж із вилученими абзацами (6), чотири оголошення (8). Без словника." }
>   - { focus: [ho], note: "Hören: 5 радіоуривків, Ja / Nein, один раз; розмова двох людей — мовець 1, мовець 2 чи обидва, один раз; інтервʼю, a / b / c, двічі." }
>   - { focus: [sc], note: "Schreiben: Teil 1 — 10 фрагментів переформулювати з даним словом (20 хв); Teil 2 — лист до редакції чи рецензія ≈ 350 слів (60 хв)." }
>   - { focus: [sp], note: "Sprechen: Teil 1 — доповідь ≈ 5 хв із питаннями; Teil 2 — ти відкриваєш дискусію Pro чи Contra, екзаменатор обстоює протилежне." }
> ```
> Кольори лише чергують модулі. Деталі — у темах C2-12, C2-14, C2-15 і C2-17.

## Блок 1. Граматика стилю: Vorfeld, часи й модальність, складні речення, Konjunktiv

> [!quiz] Склади речення: «Друзів у нього там багато»
> level: C2 · type: order · id: de-c2-review-q01
>
> ```text order
> Freunde
> hat er
> dort
> viele.
> viel. ✗
> ```
>
> **Пояснення:** розщеплений Vorfeld: іменник стоїть угорі (*Freunde*), а кількісне слово лишається в кінці Mittelfeld (*viele*). Узгодження не зникає: *Freunde* — множина, тому **viele**, а не *viel*. Так виділяють тему: «щодо друзів — їх багато». Тема C2-01.

> [!quiz] «Sie sagte die Reise ab, hatte sie doch kaum noch Urlaubstage.» Що означає друга частина?
> level: C2 · type: single · id: de-c2-review-q02
> - [x] …адже в неї майже не лишилося днів відпустки.
> - [ ] …хоча в неї майже не лишилося днів відпустки.
> - [ ] …якщо в неї майже не лишилося днів відпустки.
> - [ ] …бо вона ж хотіла взяти ще кілька днів відпустки.
>
> **Пояснення:** дієслово на першому місці + *doch* після головного речення — книжне обґрунтування: «адже, бо ж». Це не поступка (*obwohl*) і не умова (*wenn*), хоча умова без *wenn* теж починається з дієслова; умову видає позиція перед головним реченням і відсутність *doch*. Останній варіант вигадує зміст, якого в реченні немає. Тема C2-01.

> [!quiz] «Das mag stimmen, aber der Aufwand ist zu hoch.» Як це передати українською?
> level: C2 · type: single · id: de-c2-review-q03
> - [x] Можливо, це й так, але витрати завеликі.
> - [ ] Це їм подобається, але витрати завеликі.
> - [ ] Це мусить бути так, але витрати завеликі.
> - [ ] Це хотіло б бути так, але витрати завеликі.
>
> **Пояснення:** *mögen* + інфінітив перед *aber* — поступка: мовець визнає можливість, щоб потім заперечити. Дослівне «подобається» тут не підходить: *mögen* з інфінітивом у такій рамці — не про смак; *müssen* і Konjunktiv II *möchte* дають інший зміст. Тема C2-02.

> [!quiz] Біографія: «Der Brief, den sie an diesem Morgen öffnete, sollte ihr Leben verändern.» Що означає це речення в оповіді?
> level: C2 · type: single · id: de-c2-review-q04
> - [x] Цьому листу судилося змінити її життя.
> - [ ] Цьому листу не слід було змінювати її життя.
> - [ ] Кажуть, цей лист змінив її життя.
> - [ ] Цей лист хотів змінити її життя.
>
> **Пояснення:** *sollte* + інфінітив в оповіді — «майбутнє в минулому»: оповідач знає, що станеться потім. Граматично *sollte* може означати й «мала (за чиїмось наказом)», але в такому оповіданні це передвіщення оповідача. Пораду в минулому виразило б *hätte … nicht verändern sollen*, чутку — *soll … verändert haben*. Про бажання (*wollte*) тут нічого не сказано. Тема C2-02.

> [!quiz] Колега: «Sie haben doch versprochen, den Bericht zu schreiben.» Ви: «Ich wüsste nicht, dass ich das versprochen hätte.» Що ви маєте на увазі?
> level: C2 · type: single · id: de-c2-review-q05
> - [x] Ввічливо, але твердо заперечуєте, що обіцяли.
> - [ ] Хотіли б дізнатися, чи обіцяли ви це.
> - [ ] Визнаєте, що обіцяли, але забули.
> - [ ] Погоджуєтеся написати звіт.
>
> **Пояснення:** *Ich wüsste nicht, dass …* — ввічлива форма незгоди: «наскільки мені відомо, такого не було». Konjunktiv II тут помʼякшує тон, а не виражає бажання; Konjunktiv II *hätte* в підрядному ще раз дистанціює мовця від закиду. Тема C2-02.

> [!quiz] Які речення правильні? Обери всі.
> level: C2 · type: multi · id: de-c2-review-q06
> - [x] Lena fährt nach Leipzig, ihr Bruder nach Dresden.
> - [x] Er hilft seiner Nachbarin und unterstützt sie, wo er kann.
> - [ ] Er hilft und unterstützt seine Nachbarin.
> - [ ] Ich habe lange gelesen und dann eingeschlafen.
>
> **Пояснення:** еліпсис можливий, коли пропущене слово має ту саму форму, а спільний член — той самий відмінок. *Fährt* підходить обом частинам першого речення. *Helfen* керує Dativ, *unterstützen* — Akkusativ, тому спільний додаток неможливий: треба *seiner Nachbarin … sie*. *Gelesen* утворює Perfekt із *haben*, *eingeschlafen* — із *sein*: потрібно *… und bin dann eingeschlafen*. Тема C2-03.

> [!quiz] «Der Antrag, den der Verein, dessen Vorsitzende damals im Ausland war, erst nach Ablauf der Frist eingereicht hatte, wurde abgelehnt.» Що відхилили?
> level: C2 · type: single · id: de-c2-review-q07
> - [x] заяву
> - [ ] обʼєднання
> - [ ] голову обʼєднання
> - [ ] продовження строку
>
> **Пояснення:** читай за каркасом: *Der Antrag … wurde abgelehnt* — головне речення. Між ними дві дужки: *den der Verein … eingereicht hatte* (заяву подало обʼєднання) і всередині *dessen Vorsitzende … war* (голова була за кордоном). Дієслова закриваються зсередини назовні: *war → eingereicht hatte → wurde abgelehnt*. Тема C2-03.

> [!quiz] Рішення суду: «Der Kläger trägt vor, er habe die Miete pünktlich überwiesen.» Що означає Konjunktiv I тут?
> level: C2 · type: single · id: de-c2-review-q08
> - [x] Це твердження сторони, яке суд ще не встановив.
> - [ ] Це факт, який суд уже встановив.
> - [ ] Це припущення самого суду.
> - [ ] Це вимога до відповідача.
>
> **Пояснення:** у *Tatbestand* безспірне подають в Indikativ, а спірні твердження сторін — у Konjunktiv I: *er habe … überwiesen*. Так суд передає слова позивача, не беручи їх на себе. Гіпотезу виражав би Konjunktiv II, вимогу — Indikativ Präsens. Тема C2-04.

> [!quiz] Заповни пропуски: застиглі формули з Konjunktiv I
> level: C2 · type: fill · id: de-c2-review-q09 · bank: ist, will
>
> ```text fill
> Wie dem auch [[sei]], wir müssen heute eine Lösung finden. (sein)
> Sie wollte den Laden retten, koste es, was es [[wolle]]. (wollen)
> ```
>
> **Пояснення:** формули вчимо цілими: *wie dem auch sei* — «хай там як», *koste es, was es wolle* — «за будь-яку ціну». Обидві стоять у Konjunktiv I, і Indikativ (*ist, will*) їх ламає. Тема C2-04.

## Блок 2. Лексика й регістр: Amtsdeutsch, прислівʼя, розмовна мова, етимологія, точність

> [!quiz] Закон: «Die Behörde soll über den Antrag innerhalb von drei Monaten entscheiden.» Що означає *soll*?
> level: C2 · type: single · id: de-c2-review-q10
> - [x] Установа зобовʼязана так зробити, якщо немає особливого, нетипового випадку.
> - [ ] Установа може так зробити на власний розсуд.
> - [ ] Бажано, але це ні до чого не зобовʼязує.
> - [ ] Установа зобовʼязана без жодних винятків.
>
> **Пояснення:** у мові законів *muss* — обовʼязок без винятків, *soll* — обовʼязок «як правило»: відступ можливий лише в нетиповому випадку, і його треба обґрунтувати. *Kann* — розсуд установи. Побутове «бажано» тут — пастка. Тема C2-05.

> [!quiz] Договір оренди: «Der Mangel ist dem Vermieter unverzüglich anzuzeigen.» Коли треба повідомити про ваду?
> level: C2 · type: single · id: de-c2-review-q11
> - [x] Без винного зволікання — щойно це розумно можливо.
> - [ ] Протягом одного місяця.
> - [ ] Тієї самої хвилини, інакше право втрачено.
> - [ ] Коли орендар вважатиме за потрібне.
>
> **Пояснення:** *unverzüglich* у праві — «без винного зволікання» (*ohne schuldhaftes Zögern*, § 121 BGB), а не «миттєво». Кілька днів на перевірку чи консультацію зазвичай допустимі, але відкладати без причини не можна. *Ist … anzuzeigen* — обовʼязок (*muss angezeigt werden*). Тема C2-05.

> [!quiz] Коли німці кажуть «Das also war des Pudels Kern!»?
> level: C2 · type: single · id: de-c2-review-q12
> - [x] Коли нарешті зрозуміли справжню суть справи.
> - [ ] Коли щось закінчилося краще, ніж очікували.
> - [ ] Коли когось спіймали на брехні.
> - [ ] Коли проблема виявилася дрібницею.
>
> **Пояснення:** це вислів Фауста з трагедії Гете: пудель перетворюється на Мефістофеля, і Фауст розуміє, що за ним ховалося. Сьогодні — «ось у чому річ!». Для щасливого кінця є *Ende gut, alles gut*. Тема C2-06.

> [!quiz] Які вислови — крилаті слова з відомим автором (*geflügelte Worte*)? Обери всі.
> level: C2 · type: multi · id: de-c2-review-q13
> - [x] Die Geister, die ich rief …
> - [x] Die Axt im Haus erspart den Zimmermann.
> - [ ] Morgenstund hat Gold im Mund.
> - [ ] Übung macht den Meister.
>
> **Пояснення:** *Die Geister, die ich rief* — з балади Гете «Der Zauberlehrling» (в оригіналі: *Die ich rief, die Geister*), *Die Axt im Haus …* — з драми Шиллера «Wilhelm Tell». Останні два — народні прислівʼя (*Sprichwörter*) без автора. Тема C2-06.

> [!quiz] Ти пишеш до управителя будинку (*Hausverwaltung*) про конфлікт із сусідом. Яке речення доречне в листі?
> level: C2 · type: single · id: de-c2-review-q14
> - [x] Mit meinem Nachbarn kommt es wiederholt zu Auseinandersetzungen.
> - [ ] Mit meinem Nachbarn gibt es ständig Zoff.
> - [ ] Mein Nachbar nervt total.
> - [ ] Mit meinem Nachbarn ist dauernd Stress angesagt.
>
> **Пояснення:** *Zoff*, *nervt total* і *Stress ist angesagt* — розмовні (*umgangssprachlich*, частково *salopp*): серед друзів це нормально, у листі до установи звучить недбало. *Es kommt zu Auseinandersetzungen* — нейтрально-писемно. Тема C2-07.

> [!quiz] Звідки німецьке *die Grenze*?
> level: C2 · type: single · id: de-c2-review-q15
> - [x] Запозичене зі словʼянських мов у Середньовіччі (староп. *granica*).
> - [ ] Спільний індоєвропейський корінь, як у *Mutter — мати*.
> - [ ] Калька з латинського слова.
> - [ ] Пізнє запозичення з англійської.
>
> **Пояснення:** за етимологічним словником Пфайфера (DWDS), середньоверхньонімецьке *graniza* походить зі старопольського *granica*. Тож *Grenze* і українське «границя» схожі не через спільний прадавній корінь, а через запозичення: це *Lehnwort*, а не *Erbwort*. Тема C2-08.

> [!quiz] Новини: «Für die Beschäftigten gibt es in diesem Jahr eine Nullrunde.» Що це означає?
> level: C2 · type: single · id: de-c2-review-q16
> - [x] Зарплату цього року не підвищать.
> - [ ] Зарплату цього року знизять.
> - [ ] Працівники отримають разову премію.
> - [ ] Переговори про зарплату ще не почалися.
>
> **Пояснення:** *Nullrunde* — евфемізм: «раунд» тарифних переговорів із нульовим підвищенням. Зниження зарплати назвали б прямо (*Lohnkürzung*). Для медіації розгортай евфемізм у прямі слова. Тема C2-09.

> [!quiz] Яке формулювання в *Arbeitszeugnis* означає найвищу оцінку?
> level: C2 · type: single · id: de-c2-review-q17
> - [x] Sie erledigte ihre Aufgaben stets zu unserer vollsten Zufriedenheit.
> - [ ] Sie erledigte ihre Aufgaben zu unserer vollen Zufriedenheit.
> - [ ] Sie war stets bemüht, ihre Aufgaben zu erledigen.
> - [ ] Sie erledigte ihre Aufgaben im Großen und Ganzen zu unserer Zufriedenheit.
>
> **Пояснення:** у коді Arbeitszeugnis важить кожне слово: *stets* + граматично «неможливе» *vollsten* — «відмінно»; *zu unserer vollen Zufriedenheit* без *stets* — лише «задовільно». *Stets bemüht* означає, що старалася, але без результату, а *im Großen und Ganzen* — явне застереження. Тема C2-09.

## Блок 3. Гумор, варіанти, просодія, читання, жанри, говоріння

> [!quiz] «Warum ist der Graf so traurig? Er hat ein Schloss, aber keinen Schlüssel dafür.» На чому тримається жарт?
> level: C2 · type: single · id: de-c2-review-q18
> - [x] *Schloss* — і палац, і замок у дверях (*Teekesselchen*).
> - [ ] На рими *Graf — traurig*.
> - [ ] На переставлених початкових приголосних (*Schüttelreim*).
> - [ ] На буквальному прочитанні ідіоми.
>
> **Пояснення:** *das Schloss* має два значення: «палац» і «замок, що відмикається ключем». Перша частина налаштовує на графа й палац, *Schlüssel* раптом вмикає друге значення. Це *Teekesselchen* — гра на омонімі; рими й обміну звуками тут немає. Тема C2-10.

> [!quiz] Цюрих. Сусід питає: «Wann zügelt ihr eigentlich?» Про що він питає?
> level: C2 · type: single · id: de-c2-review-q19
> - [x] коли ви переїжджаєте
> - [ ] коли ви стримаєтеся й заспокоїтеся
> - [ ] коли ви їдете у відпустку
> - [ ] коли ви повертаєтеся з роботи
>
> **Пояснення:** у Швейцарії *zügeln* — «переїжджати» (у Німеччині *umziehen*). Значення «стримувати, приборкувати» (*seine Wut zügeln*) спільне для всієї мовної області, але в побутовому питанні про сусідів воно не пасує. Слова зі «зсунутим» значенням — найпідступніші. Тема C2-11.

> [!quiz] Доповідь: «Was wir jetzt brauchen, ist nicht mehr Kontrolle, sondern Vertrauen.» Де найдоречніша *Kunstpause*, щоб виділити головне слово?
> level: C2 · type: single · id: de-c2-review-q20
> - [x] після *sondern*, перед *Vertrauen*
> - [ ] між *Was* і *wir*
> - [ ] між *nicht* і *mehr*
> - [ ] між *jetzt* і *brauchen*
>
> **Пояснення:** *Kunstpause* стоїть перед ключовим словом: слухач на мить чекає, і *Vertrauen* звучить сильніше. Пауза всередині тісної групи (*Was wir*, *nicht mehr*, *jetzt brauchen*) рве смисловий відрізок і звучить як збій. Тема C2-13.

> [!quiz] «Sie stand am Fenster. Morgen würde sie kündigen, ganz bestimmt. Warum hatte sie so lange gewartet?» Який це прийом?
> level: C2 · type: single · id: de-c2-review-q21
> - [x] erlebte Rede
> - [ ] innerer Monolog
> - [ ] Rückblende
> - [ ] direkte Rede
>
> **Пояснення:** третя особа й Präteritum, як в оповіді, але думки й питання — героїні: *ganz bestimmt*, *Warum hatte sie …?*. Це *erlebte Rede*. Внутрішній монолог іде від першої особи в Präsens (*Morgen kündige ich*), пряма мова має лапки, а *Rückblende* — це перехід до сцени з минулого. Тема C2-14.

> [!quiz] «Die Kritikerin hat den neuen Roman verrissen.» Що вона зробила?
> level: C2 · type: single · id: de-c2-review-q22
> - [x] Різко розкритикувала роман.
> - [ ] Переказала зміст роману.
> - [ ] Перехвалила роман.
> - [ ] Розірвала книжку на очах у публіки.
>
> **Пояснення:** *einen Roman verreißen* — «рознести, розгромити в рецензії». Протилежність — *Lobeshymnen singen*, між ними — *kritisch würdigen*. Буквальне «розірвати» — пастка: образ узято з *reißen*, але значення переносне. Тема C2-16.

> [!quiz] Дискусія. Опонент перекручує ваші слова. Ви: «Das habe ich so nicht gesagt.» Навіщо ця репліка?
> level: C2 · type: single · id: de-c2-review-q23
> - [x] Щоб виправити перекручення й повернути власне формулювання.
> - [ ] Щоб погодитися з опонентом.
> - [ ] Щоб виграти час на роздуми.
> - [ ] Щоб завершити дискусію.
>
> **Пояснення:** *Das habe ich so nicht gesagt* викриває спрощення: «я казав інше» — і далі треба точно повторити свою думку. Для часу є буферні фрази (*Lassen Sie mich kurz überlegen*), а завершують дискусію підсумком. Тема C2-17.

## Блок 4. Пастки, культурні коди, фахова мова, медіація

> [!quiz] Лікар: «Приймайте ці ліки двічі на день». «Sie sollen das Medikament zweimal täglich ___.»
> level: C2 · type: single · id: de-c2-review-q24
> - [x] einnehmen
> - [ ] trinken
> - [ ] annehmen
> - [ ] aufnehmen
>
> **Пояснення:** ліки «приймають» — **einnehmen** (*Medikamente einnehmen*). *Trinken* — калька з розмовного «пити ліки», *annehmen* — «приймати пропозицію, подарунок», *aufnehmen* — «приймати в лікарню, записувати». Тема C2-18.

> [!quiz] Перша кава з новим колегою. Яких тем із малознайомими людьми в Німеччині зазвичай краще уникати? Обери всі.
> level: C2 · type: multi · id: de-c2-review-q25
> - [x] скільки хто заробляє
> - [x] хвороби й здоровʼя
> - [ ] як минула відпустка
> - [ ] як колега добирається на роботу
>
> **Пояснення:** *Smalltalk* тримається безпечних тем: відпустка, погода, дорога, хобі. Зарплата, ціни на чужі речі, вік і здоровʼя з малознайомими зазвичай табу — не через холодність, а через межу приватного. З близькими колегами ці межі мʼякші. Тема C2-19.

> [!quiz] Хто зазвичай складає *Lastenheft* в IT-проєкті?
> level: C2 · type: single · id: de-c2-review-q26
> - [x] замовник: що система має вміти
> - [ ] підрядник: як саме він це реалізує
> - [ ] тестувальник: які помилки знайдено
> - [ ] юрист: які умови має договір
>
> **Пояснення:** *Lastenheft* описує вимоги замовника — «що». Відповідь підрядника, «як», — *Pflichtenheft*. Ці два слова часто плутають навіть носії, тож у фаховій розмові краще уточнити. Тема C2-20.

> [!quiz] Ти перекладаєш для сусідки на розмові з учителькою її сина. Сусідка каже: «Я хвилююся за сина». Як перекласти за правилами усного перекладу?
> level: C2 · type: single · id: de-c2-review-q27
> - [x] Ich mache mir Sorgen um meinen Sohn.
> - [ ] Sie sagt, dass sie sich Sorgen um ihren Sohn macht.
> - [ ] Meine Nachbarin macht sich Sorgen, aber das ist nicht so schlimm.
> - [ ] Ich mache mir Sorgen für meinen Sohn.
>
> **Пояснення:** в усному перекладі говорять **від першої особи** — так, ніби говорить сама людина: учителька звертається до сусідки, а не до тебе. Переказ у третій особі граматично правильний, але віддаляє співрозмовниць; власний коментар (*aber das ist nicht so schlimm*) — уже не переклад. *Sorgen für* — «піклуватися», а хвилюються *um* + Akk. Тема C2-21.

## Міні-іспит Goethe-Zertifikat C2: GDS — Lesen

Модуль *Lesen* триває 80 хвилин: чотири частини, 30 завдань (10 + 6 + 6 + 8), словником користуватися не можна. **Teil 1** — коментар, 10 завдань із вибором з чотирьох варіантів (позиція автора, деталі, логіка аргументу). **Teil 2** — інформаційна стаття з 6 абзаців: до кожного добрати одне з 8 тверджень, два зайві. **Teil 3** — репортаж, з якого вилучено абзаци: повернути 6 абзаців на місце, один зайвий. **Teil 4** — чотири оголошення (a–d) і 8 тверджень (до одного оголошення може підходити кілька), на які є лише близько 10 хвилин. Нижче — короткі навчальні тексти й по одному-три завдання на кожну частину; на іспиті тексти довші, а завдань більше.

> [!example] Die Nacht ist kein Luxus — ein Kommentar (навчальний текст для Teil 1)
> Wer heute in einer deutschen Großstadt aufwächst, hat die Milchstraße vermutlich nie mit eigenen Augen gesehen. Straßenlaternen, beleuchtete Schaufenster und angestrahlte Fassaden sorgen dafür, dass es auch um Mitternacht nie richtig dunkel wird. Lange galt das als Zeichen von Sicherheit und Fortschritt. Inzwischen mehren sich jedoch die Hinweise, dass künstliches Licht nachtaktive Insekten anlockt, Zugvögel ablenkt und den Schlaf vieler Menschen beeinträchtigen kann.
>
> Man mag einwenden, dass niemand im Dunkeln nach Hause gehen möchte. Das ist richtig, verfehlt aber den Kern der Sache. Es geht nicht darum, Städte zu verdunkeln, sondern darum, Licht dorthin zu lenken, wo es gebraucht wird: auf den Gehweg statt in den Himmel. Dass ein leeres Bürohaus um drei Uhr morgens hell erleuchtet ist, dient niemandes Sicherheit. Manche Gemeinden dimmen ihre Straßenbeleuchtung nachts bereits oder schalten sie teilweise ab. Ihre Erfahrungen sollte man auswerten, statt jede Laterne zur Glaubensfrage zu machen.

> [!quiz] Welche Position vertritt der Autor? (Teil 1 · a, b, c, d)
> level: C2 · type: single · id: de-c2-review-q28
> - [ ] a) Städte sollten nachts weitgehend dunkel bleiben.
> - [x] b) Künstliches Licht sollte gezielter eingesetzt werden.
> - [ ] c) Die Sicherheit der Fußgänger hat Vorrang vor dem Naturschutz.
> - [ ] d) Die Folgen künstlichen Lichts sind noch völlig unerforscht.
>
> **Пояснення:** ключ — *Es geht nicht darum, Städte zu verdunkeln, sondern darum, Licht dorthin zu lenken, wo es gebraucht wird*. Варіант a — пастка: саме це автор заперечує частиною *nicht darum*. Варіант c — заперечення, яке автор визнає (*Das ist richtig*), але вважає неголовним; d суперечить *mehren sich … die Hinweise*. Тема C2-14.

> [!quiz] Welche Funktion hat der Satz „Man mag einwenden, dass niemand im Dunkeln nach Hause gehen möchte“? (Teil 1 · a, b, c, d)
> level: C2 · type: single · id: de-c2-review-q29
> - [x] a) Er nimmt einen Einwand vorweg, den der Autor anschließend relativiert.
> - [ ] b) Er fasst die These des Autors zusammen.
> - [ ] c) Er nennt ein Beispiel für die Folgen künstlichen Lichts.
> - [ ] d) Er gibt das Ergebnis einer Studie wieder.
>
> **Пояснення:** *man mag* + інфінітив — поступка: автор сам озвучує контраргумент, щоб одразу його обмежити (*Das ist richtig, verfehlt aber den Kern der Sache*). У Teil 1 часто питають не «що сказано», а «навіщо це речення в аргументі». Теми C2-02 і C2-14.

> [!example] Die Schreibmaschine (навчальний текст для Teil 2)
> **A** Im späten 19. Jahrhundert begann die Serienfertigung von Schreibmaschinen. Zunächst galten sie als teure Spezialgeräte für Kanzleien und Behörden; erst nach und nach zogen sie in gewöhnliche Büros ein.
>
> **B** Mit der Maschine veränderte sich auch die Arbeitswelt. In den Schreibbüros saßen bald überwiegend Frauen, und der Beruf der Stenotypistin öffnete vielen von ihnen den Weg in die bezahlte Arbeit, wenn auch meist mit geringem Lohn und wenig Aufstiegschancen.
>
> **C** Mit dem Siegeszug des Computers schien die Schreibmaschine endgültig überflüssig. Unzählige Geräte landeten auf Dachböden oder im Müll.
>
> **D** Seit einigen Jahren entdecken manche Schreibende sie wieder. Gerade dass man nichts löschen, nichts kopieren und keine Nachrichten empfangen kann, empfinden sie als Gewinn: Wer tippt, muss vorher denken.

> [!quiz] Welcher Abschnitt passt zur Aussage „Gerade die Grenzen des Geräts machen es für einige wieder attraktiv“? (Teil 2 · A, B, C, D)
> level: C2 · type: single · id: de-c2-review-q30
> - [ ] A
> - [ ] B
> - [ ] C
> - [x] D
>
> **Пояснення:** у D те саме сказано іншими словами: *nichts löschen, nichts kopieren …* — це обмеження, а *empfinden sie als Gewinn* — привабливість. У Teil 2 твердження майже ніколи не повторює слова абзацу: шукай той самий зміст. A говорить про ціну, B — про працю жінок, C — про занепад. Тема C2-14.

> [!example] Glühende Bronze — eine Reportage (навчальний текст для Teil 3)
> Um sieben Uhr morgens ist es in der Werkstatt schon heiß. Seit Tagen steht die Form in der Grube, gebaut aus Lehm, Stroh und viel Geduld. Heute wird gegossen. **[ … ]** Dann öffnet der Meister den Ofen, und die glühende Bronze fließt zischend in die Form. Niemand spricht. Erst als die letzte Glut erloschen ist, klopft jemand dem Lehrling auf die Schulter.

> [!quiz] Welcher Abschnitt passt in die Lücke? (Teil 3)
> level: C2 · type: single · id: de-c2-review-q31
> - [x] Jeder im Team kennt seinen Platz, die letzten Handgriffe werden geprüft. Einen zweiten Versuch gibt es nicht: Misslingt der Guss, sind Wochen an Arbeit verloren.
> - [ ] Wochen später wird die fertige Glocke mit einem Kran auf den Kirchturm gehoben und zum ersten Mal geläutet.
> - [ ] Gegossen wurde an diesem Tag allerdings nicht, denn der Ofen war defekt.
>
> **Пояснення:** після пропуску — *Dann öffnet der Meister den Ofen*: потрібен останній крок перед відливанням у Präsens. Перший абзац саме такий і ще й пояснює напругу, через яку *Niemand spricht*. Другий стрибає на тижні вперед — після нього *Dann öffnet …* неможливе. Третій суперечить *Heute wird gegossen* і самому відливанню далі. У Teil 3 перевіряй час, займенники й послідовність дій. Тема C2-14.

> [!example] Räume zu vermieten (навчальні оголошення для Teil 4)
> **A** Atelier im Hinterhof, 40 m², Nordlicht, kein Wasseranschluss. Nur für ruhige Tätigkeiten wie Malerei oder Grafik. Ab sofort, befristet auf ein Jahr.
>
> **B** Werkstatt im Gewerbehof, 60 m², Starkstrom, Lastenaufzug. Geeignet für Holz- und Metallbearbeitung, Maschinenlärm tagsüber erlaubt.
>
> **C** Schreibtischplatz in einer Ateliergemeinschaft, ideal für Illustration oder Textarbeit. Gemeinsame Küche, monatlich kündbar.
>
> **D** Keramikatelier mit Brennofen zur Mitnutzung, stundenweise buchbar, Kurse am Wochenende.

> [!quiz] Ein Tischler sucht einen Raum, in dem er auch mit lauten Maschinen arbeiten darf. Welche Anzeige passt? (Teil 4 · A, B, C, D)
> level: C2 · type: single · id: de-c2-review-q32
> - [ ] A
> - [x] B
> - [ ] C
> - [ ] D
>
> **Пояснення:** *Tischler* працює з деревом: у B є *Holzbearbeitung* і *Maschinenlärm tagsüber erlaubt*. A прямо обмежує *nur für ruhige Tätigkeiten*, C — місце за столом, D — для кераміки. У Teil 4 не читай усе підряд: шукай у кожному оголошенні ключову умову. Тема C2-14.

## Міні-іспит GDS — Schreiben, Teil 1

У *Schreiben* (80 хв) **Teil 1** триває 20 хвилин: у короткому тексті позначено 10 фрагментів, кожен треба переписати з даним словом так, щоб зміст не змінився. Дане слово **не можна змінювати**; за кожен фрагмент — 2, 1 або 0 балів (у ключі Modellsatz по 1 балу за кожну потрібну зміну довкола даного слова). **Teil 2** — одна з чотирьох тем: дві вільні (лист чи e-mail до редакції щодо трьох тверджень) і дві літературні (рецензія на книжку зі списку поточного року), ≈ 350 слів за 60 хвилин.

> [!example] Leuchttürme — ein Kurzreferat (навчальний текст для Teil 1)
> Früher waren Leuchttürme unverzichtbar, **weil die Schiffe keine elektronischen Navigationsgeräte hatten**. **Man kann ihre Bedeutung für die Seefahrt kaum überschätzen.** Heute werden die meisten Türme automatisch betrieben. **Obwohl sie technisch kaum noch nötig sind**, bleiben sie beliebte Ausflugsziele. **Um sie zu erhalten**, haben sich vielerorts Fördervereine gegründet.

> [!quiz] Teil 1: заверши переформулювання (дане слово вже стоїть у реченні)
> level: C2 · type: fill · id: de-c2-review-q33
>
> ```text fill
> Aufgrund [[fehlender]] elektronischer Navigationsgeräte waren Leuchttürme früher unverzichtbar. (дане слово: aufgrund; дієслово fehlen)
> Trotz ihres geringen technischen [[Nutzens]] bleiben sie beliebte Ausflugsziele. (дане слово: trotz; der Nutzen)
> Zur [[Erhaltung]] der Türme haben sich vielerorts Fördervereine gegründet. (дане слово: zur; erhalten)
> ```
>
> **Пояснення:** *weil … keine … hatten* → *aufgrund* + Genitiv: заперечення переходить у Partizip I *fehlend* із закінченням Genitiv множини **-er**. *Obwohl* → *trotz* + Genitiv: *der Nutzen* має в Genitiv **des Nutzens**. *Um … zu erhalten* → *zur* + іменник жіночого роду: **Erhaltung** (*der Erhalt* потребував би *zum*, а дане слово змінювати не можна). Тема C2-15.

> [!quiz] Teil 1: «Man kann ihre Bedeutung für die Seefahrt kaum überschätzen.» Дане слово — **lässt**. Склади речення.
> level: C2 · type: order · id: de-c2-review-q34
>
> ```text order
> Ihre Bedeutung für die Seefahrt
> lässt
> sich
> kaum
> überschätzen.
> werden ✗
> ```
>
> **Пояснення:** *man kann* + інфінітив → *sich lassen* + інфінітив (Passiversatz): *Ihre Bedeutung lässt sich kaum überschätzen*. *Sich* стоїть одразу після дієслова, інфінітив — у кінці. *Werden* тут зайве: *lässt sich … überschätzt werden* змішує дві конструкції. Тема C2-15.

## Диктант і аудіювання

> [!listen] Що ти почув?
> level: C2 · type: choice · id: de-c2-review-l01
> audio: Ich wüsste gern, wer das eigentlich entschieden hat.
> - [x] Ich wüsste gern, wer das eigentlich entschieden hat.
> - [ ] Ich wusste gern, wer das eigentlich entschieden hat.
> - [ ] Ich wüsste gern, wer das eigentlich entscheiden hat.
>
> **Пояснення:** *wüsste* — Konjunktiv II з коротким огубленим [ʏ]: ввічливе «хотів би знати». *Wusste* [ʊ] — Indikativ Präteritum, з *gern* він не поєднується. *Entscheiden hat* — неможлива форма: Partizip II — *entschieden*. Тема C2-02.

> [!listen] Що ти почув?
> level: C2 · type: choice · id: de-c2-review-l02
> audio: Es sei daran erinnert, dass die Anmeldung am Montag endet.
> - [x] Es sei daran erinnert, dass die Anmeldung am Montag endet.
> - [ ] Es wird daran erinnert, dass die Anmeldung am Montag endet.
> - [ ] Es ist daran erinnert, dass die Anmeldung am Montag endet.
>
> **Пояснення:** *Es sei daran erinnert* — Konjunktiv I у значенні «слід нагадати», книжна формула доповідей і текстів. *Es wird daran erinnert* — звичайний пасив, *Es ist daran erinnert* — неграматичне. Слухай голосний: *sei* [zaɪ̯]. Тема C2-04.

> [!listen] Напиши або скажи, що почув
> level: C2 · type: dictation · id: de-c2-review-l03
> audio: Bitte reichen Sie die fehlenden Nachweise unverzüglich nach.
> explain: nachreichen — відокремлюване: reichen … nach, nach — у кінці речення. Nachweise — множина від der Nachweis. unverzüglich — з ü і z. Тема C2-05.

> [!listen] Напиши або скажи, що почув
> level: C2 · type: dictation · id: de-c2-review-l04
> audio: Je länger die Debatte dauerte, desto deutlicher wurde, dass es keine einfache Lösung gibt.
> explain: je … desto — дієслово в частині з je стоїть у кінці (dauerte), після desto + прикметник — на другому місці (wurde). Перед dass — кома. deutlicher — порівняльний ступінь із -er. Тема C2-03.

## Міні-іспит GDS — Hören

Модуль *Hören* триває близько 35 хвилин: три частини, 30 завдань. **Teil 1** (≈ 12 хв) — пʼять уривків із радіопередач, до кожного три твердження *Ja / Nein*, звучить **один раз**. **Teil 2** (≈ 5 хв) — розмова двох людей: висловлення належить мовцю 1, мовцю 2 чи обом, звучить **один раз**. **Teil 3** (≈ 18 хв) — довге радіоінтервʼю, 10 завдань a / b / c, звучить **двічі**. Нижче — короткі навчальні фрагменти в тому самому порядку. Аудіо синтезоване й чисте, без шуму; читай твердження до прослуховування.

> [!listen] GDS Hören Teil 1 (звучить один раз): уривок 1. Твердження: «Die Beratung kostet eine kleine Gebühr.»
> level: C2 · type: answer · id: de-c2-review-l05
> audio: Im Herbst ist bei der Pilzberatung im Rathaus viel los. Die Sachverständige prüft jeden Korb, und das kostenlos. Ihr Rat: Nur sammeln, was man sicher kennt. Fotos aus dem Internet ersetzen keinen Blick auf das echte Exemplar.
> - [ ] Ja
> - [x] Nein
>
> **Пояснення:** *und das kostenlos* — консультація безкоштовна, отже, твердження не збігається з текстом: *Nein*. У Teil 1 немає варіанта «не сказано»: усе, що не збігається з уривком, — *Nein*. Тема C2-12.

> [!listen] GDS Hören Teil 1 (звучить один раз): уривок 2. Твердження: «Ein großer Teil seiner Einnahmen stammt von den Gemeinden.»
> level: C2 · type: answer · id: de-c2-review-l06
> audio: Mit seinen sechshundert Schafen zieht Jonas Brandl jedes Jahr über die Schwäbische Alb. Von der Wolle allein könnte er nicht leben, sie bringt kaum etwas ein. Sein Geld verdient er vor allem mit Landschaftspflege, und dafür bezahlen ihn die Gemeinden.
> - [x] Ja
> - [ ] Nein
>
> **Пояснення:** *Sein Geld verdient er vor allem mit Landschaftspflege, und dafür bezahlen ihn die Gemeinden* — те саме іншими словами: *vor allem* ≈ *ein großer Teil*. Вовна — пастка: про неї йдеться, але як про джерело, що *kaum etwas einbringt*. Тема C2-12.

> [!listen] GDS Hören Teil 1 (звучить один раз): уривок 3. Твердження: «Herr Ostermann bedauert, dass die Uhr künftig elektrisch aufgezogen wird.»
> level: C2 · type: answer · id: de-c2-review-l07
> audio: Seit vierzig Jahren steigt Herr Ostermann jeden Samstag die hundertzwanzig Stufen zur Turmuhr hinauf und zieht sie von Hand auf. Ab dem nächsten Jahr übernimmt das ein Elektromotor. Traurig sei er nicht, sagt er. Seine Knie seien ganz froh darüber.
> - [ ] Ja
> - [x] Nein
>
> **Пояснення:** *Traurig sei er nicht* — непряма мова в Konjunktiv I передає його слова: він не шкодує, а жартує, що коліна радіють. Отже, *Nein*. Тема C2-12.

> [!listen] GDS Hören Teil 2 (звучить один раз): Frau Kessler (мовець 1) і Herr Adomeit (мовець 2) про «бібліотеку речей». Хто вважає, що власний прилад часто коштує недорого?
> level: C2 · type: answer · id: de-c2-review-l08
> audio: A: Herr Adomeit, Sie halten unsere Bibliothek der Dinge für überflüssig?
> audio: B: Überflüssig nicht, Frau Kessler. Aber wer leiht sich schon eine Bohrmaschine, wenn sie im Baumarkt kaum dreißig Euro kostet?
> audio: A: Genau darum geht es ja nicht. Die meisten Bohrmaschinen laufen im ganzen Leben nur wenige Minuten.
> - [ ] a) мовець 1 — Frau Kessler
> - [x] b) мовець 2 — Herr Adomeit
> - [ ] c) обидва
>
> **Пояснення:** Herr Adomeit: *wenn sie im Baumarkt kaum dreißig Euro kostet* — це його аргумент. Frau Kessler ціну не заперечує, але й не підтримує: *Genau darum geht es ja nicht* — для неї головне, що прилад майже не працює. Імена звучать на початку — запамʼятай, який голос чий. Тема C2-12.

> [!listen] GDS Hören Teil 2 (звучить один раз): продовження розмови. Хто вважає, що такий проєкт залежить від добровольців?
> level: C2 · type: answer · id: de-c2-review-l09
> audio: B: Mag sein. Trotzdem: Ohne Ehrenamtliche, die die Geräte prüfen und reparieren, hält sich so etwas nicht lange.
> audio: A: Da haben Sie recht, Herr Adomeit. Ohne Freiwillige könnten wir morgen schließen.
> - [ ] a) мовець 1 — Frau Kessler
> - [ ] b) мовець 2 — Herr Adomeit
> - [x] c) обидва
>
> **Пояснення:** Herr Adomeit: *Ohne Ehrenamtliche … hält sich so etwas nicht lange*; Frau Kessler погоджується (*Da haben Sie recht*) і додає *Ohne Freiwillige könnten wir morgen schließen*. Позиції збігаються — у Teil 2 це «обидва». *Mag sein* на початку — поступка, а не згода з усім. Тема C2-12.

> [!listen] GDS Hören Teil 3 (1/3, звучить двічі): інтервʼю з картографинею Dr. Seidel. Що вона каже про свою професію?
> level: C2 · type: answer · id: de-c2-review-l10
> audio: A: Frau Dr. Seidel, braucht man im Zeitalter der Navi-Apps überhaupt noch Kartografen?
> audio: B: Mehr denn je. Jede App beruht auf Karten, die jemand entworfen hat. Neu ist nur, dass man uns nicht mehr sieht.
> - [ ] a) Через застосунки вона стала зайвою.
> - [x] b) Вона важлива як ніколи, але стала менш помітною.
> - [ ] c) Вона десятиліттями майже не змінювалася.
>
> **Пояснення:** *Mehr denn je* — «більше, ніж будь-коли»; *Neu ist nur, dass man uns nicht mehr sieht* — роботу картографів не видно за застосунком. Варіант a — те, що припускає питання ведучого, а не відповідь. Тема C2-12.

> [!listen] GDS Hören Teil 3 (2/3, звучить двічі): продовження інтервʼю. У чому, за словами Dr. Seidel, перевага паперової карти?
> level: C2 · type: answer · id: de-c2-review-l11
> audio: A: Was geht verloren, wenn wir nur noch aufs Handy schauen?
> audio: B: Der Überblick. Auf dem Bildschirm sehe ich meinen Weg, aber nicht, wie die Gegend zusammenhängt. Eine Papierkarte zwingt mich, mich selbst zu orientieren.
> - [ ] a) Вона точніша за застосунок.
> - [x] b) Вона показує, як повʼязана вся місцевість, і змушує орієнтуватися самому.
> - [ ] c) Вона дешевша й не потребує заряду.
>
> **Пояснення:** *Der Überblick* і *wie die Gegend zusammenhängt* — головна думка; *zwingt mich, mich selbst zu orientieren* — друга. Про точність і ціну не сказано нічого, хоча це «логічні» переваги — на іспиті не додавай від себе. Тема C2-12.

> [!listen] GDS Hören Teil 3 (3/3, звучить двічі): кінець інтервʼю. Яку позицію займає Dr. Seidel?
> level: C2 · type: answer · id: de-c2-review-l12
> audio: A: Also zurück zum Papier?
> audio: B: Das wäre romantisch, aber unrealistisch. Ich plädiere eher dafür, beides zu können: der App zu folgen und trotzdem zu wissen, wo Norden ist.
> - [ ] a) Від навігаційних застосунків варто відмовитися.
> - [x] b) Треба вміти й користуватися застосунком, і орієнтуватися самостійно.
> - [ ] c) Паперові карти скоро зникнуть.
>
> **Пояснення:** *Das wäre romantisch, aber unrealistisch* — Konjunktiv II відкидає «назад до паперу»; позиція — після *Ich plädiere eher dafür*: *beides zu können*. Варіант a — та сама «романтична» ідея, яку вона відкидає. Теми C2-02 і C2-12.

## Мінімальні пари

На C2 пари — це вже не окремі звуки, а довгота, наголос і кінець слова, від яких залежить граматика чи значення. Слухай уважно голосний і наголошений склад.

> [!pair] Wüste /ˈvyːstə/ — wüsste /ˈvʏstə/
> level: C2 · id: de-c2-review-p01
> say: wüsste
> tip: Wüste («пустеля») — довге напружене [yː]; wüsste (Konjunktiv II від wissen) — коротке [ʏ], на письмі — подвійне ss. Сплутаєш — і ввічливе «Ich wüsste nicht …» стане пустелею.

> [!pair] Präsens /ˈpʁɛːzɛns/ — Präsenz /pʁɛˈzɛnts/
> level: C2 · id: de-c2-review-p02
> say: Präsenz
> tip: Präsens (теперішній час) — наголос на першому складі, у кінці [s]. Präsenz («присутність») — наголос на -senz, у кінці [ts]. Різниця і в наголосі, і в кінцевому звуці.

> [!pair] Ironie /iʁoˈniː/ — ironisch /iˈʁoːnɪʃ/
> level: C2 · id: de-c2-review-p03
> say: ironisch
> tip: наголос «стрибає»: Ironie — на останньому складі з довгим [iː], ironisch — на -ro- з довгим [oː]. Так само Politik — Politiker.

> [!pair] Bescheid /bəˈʃaɪ̯t/ — bescheiden /bəˈʃaɪ̯dn̩/
> level: C2 · id: de-c2-review-p04
> say: bescheiden
> tip: Bescheid («рішення установи») — кінцеве d оглушується в [t]. Bescheiden («скромний») — d дзвінке, далі складотворче [n̩]. Наголос в обох — на -schei-.

## Говоріння: репліки й міні-GDS Sprechen

Перші чотири репліки тренують просодію, помʼякшення, буферну фразу й медіацію. Далі — дві частини *Sprechen*: **Teil 1 — Produktion** (доповідь ≈ 5 хвилин на тему з кількома висловлюваннями, потім питання) і **Teil 2 — Interaktion** (ти обираєш *Pro* чи *Contra* і відкриваєш дискусію, екзаменатор обстоює протилежне). Іспит індивідуальний, ≈ 15 хвилин, перед ним — 15 хвилин підготовки.

> [!speak] Скажи вголос
> level: C2 · id: de-c2-review-s01
> text: Die Lösung ist schneller, günstiger und vor allem gerechter.
> ipa: /diː ˈløːzʊŋ ɪst ˈʃnɛlɐ ˈɡʏnstɪɡɐ ʊnt foːɐ̯ ˈaləm ɡəˈʁɛçtɐ/
> tip: перелік із трьох — перші два елементи з «відкритою» мелодією, на gerechter — спад. Перед vor allem — коротка пауза. Lösung — наголос на першому складі, довге [øː].
> uk: Це рішення швидше, дешевше й насамперед справедливіше.

> [!speak] Скажи вголос
> level: C2 · id: de-c2-review-s02
> text: Der Entwurf ist in einigen Punkten noch ausbaufähig.
> ipa: /deːɐ̯ ɛntˈvʊʁf ɪst ɪn ˈaɪ̯nɪɡn̩ ˈpʊŋktn̩ nɔx ˈaʊ̯sbaʊ̯fɛːɪç/
> tip: Entwurf — наголос на -wurf; ausbaufähig — наголос на aus-, у кінці [ç]. Тон спокійний і доброзичливий: це критика справи, не людини.
> uk: Проєкт у кількох пунктах ще варто доопрацювати.

> [!speak] Скажи вголос
> level: C2 · id: de-c2-review-s03
> text: Das ist eine berechtigte Frage, lassen Sie mich kurz ausholen.
> ipa: /das ɪst ˈaɪ̯nə bəˈʁɛçtɪçtə ˈfʁaːɡə ˈlasn̩ ziː mɪç kʊʁts ˈaʊ̯shoːlən/
> tip: буферна фраза дає кілька секунд на думку — говори її спокійно, не поспішай. berechtigte — наголос на -rech-, [ç] двічі; ausholen — наголос на aus-.
> uk: Це слушне питання, дозвольте мені почати трохи здалеку.

> [!speak] Скажи вголос
> level: C2 · id: de-c2-review-s04
> text: Kurz gesagt: Die Behörde will bis Ende Mai Ihre Gehaltsnachweise sehen.
> ipa: /kʊʁts ɡəˈzaːkt diː bəˈhøːɐ̯də vɪl bɪs ˈɛndə maɪ̯ ˈiːʁə ɡəˈhaltsnaːxˌvaɪ̯zə ˈzeːən/
> tip: медіація: спершу рамка (Kurz gesagt — пауза), далі ядро — хто, що, до коли. Наголоси на Ende Mai і Gehaltsnachweise; Behörde — h у середині вимовляємо, довге [øː].
> uk: Коротко: установа хоче до кінця травня побачити ваші довідки про зарплату.

> [!speak] Sprechen Teil 1 — Produktion: тема «Brauchen Museen noch Originale, wenn es perfekte Kopien gibt?» Почни доповідь.
> level: C2 · id: de-c2-review-s05
> text: Mein Thema ist die Frage, ob Museen noch Originale brauchen.
> ipa: /maɪ̯n ˈteːma ɪst diː ˈfʁaːɡə ɔp muˈzeːən nɔx oʁiɡiˈnaːlə ˈbʁaʊ̯xn̩/
> tip: Thema — th = [t]; Museen — три склади: mu-se-en, наголос на -se-; Originale — наголос на -na-. Після Frage — коротка пауза перед ob.
> uk: Моя тема — питання, чи потрібні музеям іще оригінали.

> [!speak] Sprechen Teil 1 — Produktion: зваж обидві позиції й переходь до власної.
> level: C2 · id: de-c2-review-s06
> text: Wägt man beide Seiten ab, spricht vieles für einen Mittelweg.
> ipa: /vɛːkt man ˈbaɪ̯də ˈzaɪ̯tn̩ ap ʃpʁɪçt ˈfiːləs fyːɐ̯ ˈaɪ̯nən ˈmɪtl̩veːk/
> tip: умова без wenn: дієслово Wägt на початку, довге [ɛː], кінцеве g = [k]. Після ab — пауза (кома). Mittelweg — наголос на Mit-, кінцеве g = [k].
> uk: Якщо зважити обидві сторони, багато що свідчить на користь золотої середини.

> [!speak] Sprechen Teil 2 — Interaktion: тема «Seilbahnen als Verkehrsmittel in der Stadt», ти — *Pro*. Відкрий дискусію.
> level: C2 · id: de-c2-review-s07
> text: Ich bin überzeugt, dass Seilbahnen den Stadtverkehr sinnvoll ergänzen können.
> ipa: /ɪç bɪn yːbɐˈtsɔʏ̯kt das ˈzaɪ̯lbaːnən deːn ˈʃtatfɛɐ̯ˌkeːɐ̯ ˈzɪnfɔl ɛɐ̯ˈɡɛntsn̩ ˈkœnən/
> tip: überzeugt — наголос на -zeugt, [ɔʏ̯], кінцеве g = [k]; Seilbahnen — s на початку дзвінке [z]; ergänzen — наголос на -gän-. Наголос фрази — на ergänzen: ти пропонуєш доповнення, а не заміну.
> uk: Я переконаний, що канатні дороги можуть розумно доповнити міський транспорт.

> [!speak] Sprechen Teil 2 — Interaktion: екзаменатор каже, що канатна дорога не замінить метро. Відповідай.
> level: C2 · id: de-c2-review-s08
> text: Ihr Einwand ist berechtigt, greift aber zu kurz: Es geht um Ergänzung, nicht um Ersatz.
> ipa: /iːɐ̯ ˈaɪ̯nvant ɪst bəˈʁɛçtɪçt ɡʁaɪ̯ft ˈaːbɐ tsuː kʊʁts ɛs ɡeːt ʊm ɛɐ̯ˈɡɛntsʊŋ nɪçt ʊm ɛɐ̯ˈzats/
> tip: спершу поступка (berechtigt), потім контраргумент. Після zu kurz — пауза (двокрапка). Контраст: найсильніше звучать -GÄN- і -SATZ.
> uk: Ваше заперечення слушне, але надто спрощене: ідеться про доповнення, а не про заміну.

> [!quiz] Що правда про GDS Sprechen? Обери всі.
> level: C2 · type: multi · id: de-c2-review-q35
> - [x] Перед іспитом є 15 хвилин підготовки.
> - [x] У Teil 2 ти сам відкриваєш дискусію, а екзаменатор обстоює протилежну позицію.
> - [ ] Іспит складають у парі з іншим кандидатом.
> - [ ] У Teil 1 треба зачитати заздалегідь написаний текст.
>
> **Пояснення:** GDS Sprechen — індивідуальний іспит ≈ 15 хвилин із двома екзаменаторами; нотатки можна мати, але говорити треба вільно, а не читати. Спільне планування в парі — формат нижчих рівнів. Тема C2-17.

## Типові помилки, які ще трапляються

> [!pitfall] Stilbruch: розмовне й канцелярське в одному тексті
> ~~Die Maßnahme ist voll daneben~~ у листі до редакції, ~~Zwecks Klärung melde dich mal~~ у повідомленні другові → *Die Maßnahme halte ich für verfehlt*; *Meld dich mal, dann klären wir das*. На C2 оцінюють не лише правильність, а й те, чи тримається регістр від першого до останнього речення. Теми C2-07 і C2-15.

> [!pitfall] Кальки, що «пережили» C1
> ~~Medikamente trinken~~, ~~eine Prüfung geben~~, *ein Beispiel bringen* (у розмові трапляється, у письмі краще *nennen / anführen*) → *Medikamente **einnehmen***, *eine Prüfung **ablegen***, *ein Beispiel **nennen / anführen***. Що вільніше говориш, то частіше проскакують українські сполуки — їх видно лише під час редагування. Тема C2-18.

> [!pitfall] Буквальне читання помʼякшень
> *nicht ganz unproblematisch* сприймають як «майже без проблем», а *zu unserer vollen Zufriedenheit* — як «відмінно». Насправді перше часто означає серйозну проблему, друге — середню оцінку. У медіації для рідних розгортай такі формули в прямі слова. Тема C2-09.

> [!pitfall] Формат іспиту: «не сказано» і змінене дане слово
> У GDS Hören Teil 1 немає варіанта «у тексті не сказано»: те, чого в уривку немає, — *Nein*. У Schreiben Teil 1 ~~aufgrund → wegen~~ чи ~~zur → zum~~: дане слово має стояти без змін — інакше умову порушено й фрагмент, найімовірніше, не зарахують, навіть якщо речення бездоганне. Теми C2-12 і C2-15.

## Чекліст «я вмію»

Познач, що вже виходить. Пункти, у яких сумніваєшся, повтори у відповідних темах.

**Граматика стилю (C2-01, 02, 03, 04)**
- [ ] Я виділяю тему й рему порядком слів: розщеплений Vorfeld (*Zeit habe ich keine*), Sperrsatz, V1 у анекдоті й обґрунтуванні з *doch*.
- [ ] Я обираю час як стилістичний засіб: Präsens у хроніці, *sollte* + інфінітив як «майбутнє в минулому», *mag* для поступки, *Ich wüsste nicht* для ввічливої незгоди.
- [ ] Я читаю Schachtelsatz за каркасом і будую еліпсис без збоїв у відмінку й допоміжному дієслові.
- [ ] Я розумію Konjunktiv I в законах, судових рішеннях і формулах (*wie dem auch sei*).

**Лексика й регістр (C2-05, 06, 07, 08, 09)**
- [ ] Я читаю *Bescheid* і закон: *muss / soll / kann*, *unverzüglich*, *grundsätzlich*, посилання на параграфи.
- [ ] Я розрізняю *Sprichwort*, *Redewendung* і *geflügeltes Wort* та обережно приписую цитати авторам.
- [ ] Я розумію розмовну й молодіжну мову і знаю позначки *salopp, derb, vulgär*.
- [ ] Я відрізняю спільний корінь від запозичення (*Mutter — мати* проти *Grenze — границя*).
- [ ] Я чую помʼякшення, евфемізми, літоту й код Arbeitszeugnis і передаю їх прямими словами.

**Гумор, варіанти, звучання (C2-10, 11, 12, 13)**
- [ ] Я пояснюю гру слів і розрізняю *Kalauer, Satire, Kabarett*.
- [ ] Я розумію австрійський і швейцарський стандарт, зокрема слова зі «зсунутим» значенням (*zügeln, Sessel*).
- [ ] Я стежу за радіо, кабаре й ток-шоу: хто що каже, хто ухиляється, де позиції збігаються.
- [ ] Я ділю виступ на відрізки, ставлю *Kunstpause* і тримаю наголос, що «стрибає».

**Читання, письмо, говоріння (C2-14, 15, 16, 17)**
- [ ] Я читаю художній текст, есей і норму закону та впізнаю *erlebte Rede*.
- [ ] Я переформульовую з даним словом (*aufgrund, trotz, zur, lässt sich*) і редагую текст у чотири проходи.
- [ ] Я пишу рецензію й лист до редакції за жанровими правилами.
- [ ] Я виголошую доповідь ≈ 5 хвилин, що зважує позиції, і відстоюю *Pro* чи *Contra* в дискусії.

**Пастки, культура, фах, медіація (C2-18, 19, 20, 21)**
- [ ] Я уникаю хибних друзів і кальок (*Konkurs, Akademiker, Medikamente einnehmen*).
- [ ] Я розумію німецьку прямоту, *Smalltalk*, табу й відмінності DACH.
- [ ] Я знаю ключову лексику своєї галузі й систему визнання кваліфікації.
- [ ] Я резюмую з української німецькою, пояснюю лист установи рідним і перекладаю усно від першої особи.

Якщо ти позначив(ла) більшість пунктів і правильно відповів(ла) приблизно на 75–80 % завдань вище, переходь до повного модельного тесту Goethe-Zertifikat C2 (посилання нижче) або до розділу «Іспити».

## Фішки

> [!reel] 🎓 GDS у цифрах
> *Lesen* — 80 хвилин, 4 частини, 30 завдань, без словника. *Hören* — близько 35 хвилин, 3 частини; Teil 1 і Teil 2 звучать один раз, інтервʼю в Teil 3 — двічі. *Schreiben* — 80 хвилин: 10 переформулювань і текст ≈ 350 слів. *Sprechen* — близько 15 хвилин віч-на-віч із двома екзаменаторами після 15 хвилин підготовки. Щоб скласти модуль, треба щонайменше 60 зі 100 балів.

> [!reel] 🧭 Три питання до кожного тексту C2
> *Хто говорить?* — автор, персонаж у ролі (кабаре, *erlebte Rede*), сторона в суді (Konjunktiv I). *Що мається на увазі?* — літота, евфемізм, іронія, стримане «ні». *Для кого я це передаю?* — колега, установа, мама на розмові з учителькою. Якщо на всі три є відповідь, ти читаєш і слухаєш на рівні C2.

> [!reel] 📜 Звідки «велике» мовне свідоцтво
> *Großes Deutsches Sprachdiplom* — стара назва найвищого іспиту з німецької як іноземної, яку Goethe-Zertifikat C2 зберіг у підзаголовку. 1 січня 2012 року в цей сертифікат увійшла й колишня *Zentrale Oberstufenprüfung* (ZOP). Тож старі дипломи ZOP і GDS ти ще можеш побачити в резюме старших колег.

## Джерела та що почитати

- [Goethe-Institut — Goethe-Zertifikat C2: GDS, Modellsatz (PDF)](https://www.goethe.de/pro/relaunch/prf/materialien/C2/c2_modellsatz.pdf) — офіційний зразок усіх модулів: частини, кількість завдань, час.
- [Goethe-Institut — Durchführungsbestimmungen C2 (PDF)](https://www.goethe.de/pro/relaunch/prf/de/Durchfuehrungsbestimmungen_C2_neu.pdf) — тривалість, бали й правила іспиту.
- [Wikipedia — Goethe-Zertifikat C2](https://de.wikipedia.org/wiki/Goethe-Zertifikat_C2) — історія сертифіката, зокрема інтеграція ZOP 2012 року.
- [DWDS — Grenze](https://www.dwds.de/wb/Grenze) — значення й етимологія (Пфайфер): запозичення зі словʼянських мов.
- [DWDS — unverzüglich](https://www.dwds.de/wb/unverz%C3%BCglich) — значення й приклади.
- [DWDS — zügeln](https://www.dwds.de/wb/z%C3%BCgeln) — значення, зокрема швейцарське «переїжджати».
- [DWDS — Präsenz](https://www.dwds.de/wb/Pr%C3%A4senz) — вимова й значення.
- [DW Learn German](https://learngerman.dw.com/de/overview) — безкоштовні курси й матеріали Deutsche Welle.

> [!important] Підсумок
> - Граматика стилю C2: розщеплений Vorfeld (*Freunde hat er viele*), V1 + *doch* як «адже», *sollte* + інфінітив як доля, *mag* як поступка, *Ich wüsste nicht* як ввічливе «ні», еліпсис лише за спільної форми й відмінка, Konjunktiv I у праві й формулах.
> - Лексика: *soll* у законі — обовʼязок «як правило», *unverzüglich* — без винного зволікання; *geflügelte Worte* мають автора; розмовне — не в лист; *Grenze* — запозичення; помʼякшення й евфемізми розгортай у прямі слова.
> - Навички: *Teekesselchen*, швейцарське *zügeln*, *Kunstpause* перед ключовим словом, *erlebte Rede*, *verreißen*, перша особа в усному перекладі, *einnehmen* для ліків, *Lastenheft ≠ Pflichtenheft*.
> - GDS: *Lesen* 80 хв (10 + 6 + 6 + 8), *Hören* ≈ 35 хв (Teil 1 і 2 — один раз, Teil 3 — двічі; у Teil 1 «не сказано» = *Nein*), *Schreiben* Teil 1 — дане слово не змінювати, *Sprechen* — доповідь і дискусія *Pro / Contra*, яку відкриваєш ти.
