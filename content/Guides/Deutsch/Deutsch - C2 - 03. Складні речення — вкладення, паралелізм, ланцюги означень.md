---
title: Складні речення — вкладення, паралелізм, ланцюги означень
id: de-c2-satzgefuege
level: C2
icon: px:link
tags: [deutsch, c2, grammar, satzgefuege, schachtelsatz, stil]
prerequisites: ["[[Deutsch - C2 - 02. Тонкощі часів і модальності]]", "[[Deutsch - C1 - 01. Розширені дієприкметникові означення й звороти]]", "[[Deutsch - C1 - 08. Звʼязність тексту — конектори, відсилання, wobei]]"]
estimatedMinutes: 45
---

# Складні речення — вкладення, паралелізм, ланцюги означень

> [!success] Після цієї теми ти зможеш
> - читати Schachtelsatz — речення з кількома вкладеними підрядними — за «каркасом»: головне дієслово, підмет, дужки підрядних;
> - розбирати класичні довгі речення Клейста, Канта й Томаса Манна та переказувати їх кількома простими;
> - будувати паралельні конструкції й еліпсис без граматичних збоїв: *Anna studiert in Wien, ihr Bruder in Graz*;
> - відчувати ритм речення (закон зростання членів, Parenthese, Nachfeld) і редагувати важкі ланцюги означень.

## Передбач

> [!quiz] Прочитай початок новели Клейста «Землетрус у Чилі» (1807). Хто стояв біля стовпа?
> level: C2 · type: single · id: de-c2-satzgefuege-q01
>
> «In St. Jago, der Hauptstadt des Königreichs Chili, stand gerade in dem Augenblicke der großen Erderschütterung vom Jahre 1647, bei welcher viele tausend Menschen ihren Untergang fanden, ein junger, auf ein Verbrechen angeklagter Spanier, namens Jeronimo Rugera, an einem Pfeiler des Gefängnisses, in welches man ihn eingesperrt hatte, und wollte sich erhenken.»
>
> - [x] молодий іспанець, обвинувачений у злочині
> - [ ] багато тисяч людей, що загинули
> - [ ] засновник столиці Чилі
> - [ ] тюремник, який його замкнув
>
> **Пояснення:** знайди відмінюване дієслово головного речення — *stand* — і його підмет у Nominativ: *ein junger, auf ein Verbrechen angeklagter Spanier*. Усе інше — обставини (де, коли) й підрядні, що їх уточнюють. *Menschen* — підмет підрядного *bei welcher …*, а не головного речення.

## Що вже знаєш і що нового

Довгі означення (*die von der Regierung beschlossenen Maßnahmen*) ти розбирав у [[Deutsch - C1 - 01. Розширені дієприкметникові означення й звороти]], ланцюги відсилань і конектори — у [[Deutsch - C1 - 08. Звʼязність тексту — конектори, відсилання, wobei]]. Там одиницею був фрагмент речення або абзац.

Тепер одиниця — **ціле довге речення**: як воно «тримається», як його прочитати без паніки й як побудувати власне — ясне, ритмічне, без збоїв у паралельних частинах.

## 1. Schachtelsatz: речення-матрьошка

Німецьке підрядне відправляє дієслово в кінець. Коли підрядне вкладене в інше підрядне, дієслова **накопичуються** в кінці, як закриті дужки:

*Der Bericht, **den** die Kommission, **die** im Mai gegründet **wurde**, vorgelegt **hat**, **ist** sehr lang.*

| Рівень | Частина | Дієслово |
|---|---|---|
| головне | Der Bericht … **ist** sehr lang. | ist |
| підрядне 1 | den die Kommission … vorgelegt **hat** | hat |
| підрядне 2 | die im Mai gegründet **wurde** | wurde |

> [!diagram] Як вкладені підрядні сидять одне в одному
> ```yaml
> layout: nest
> nodes:
>   - { id: main, label: "головне речення", text: "Der Bericht … ist sehr lang.", tone: gray }
>   - { id: rel1, label: "підрядне 1 · дієслово в кінці", text: "den die Kommission … vorgelegt hat", parent: main, tone: yellow }
>   - { id: rel2, label: "підрядне 2 · дієслово в кінці", text: "die im Mai gegründet wurde", parent: rel1, tone: pink }
> steps:
>   - { focus: main, note: "Каркас: Der Bericht ist sehr lang. Підмет і дієслово головного речення стоять далеко одне від одного, бо між ними — вкладення." }
>   - { focus: rel1, note: "Перше підрядне уточнює der Bericht: den … vorgelegt hat. Його дієслово hat закриває дужку." }
>   - { focus: rel2, note: "Усередині першого — друге: die im Mai gegründet wurde, про die Kommission. Його дієслово wurde стоїть першим у «купі» дієслів." }
>   - { focus: [rel2, rel1, main], note: "Наприкінці три дієслова поспіль: wurde — hat — ist. Читаємо їх зсередини назовні, як закриття дужок." }
> ```

Протилежність — **Treppensatz** («речення-сходи»): кожне нове підрядне стоїть **у кінці** попереднього, тож дієслова не накопичуються: *Wir lesen den Bericht, den die Kommission vorgelegt hat, die im Mai gegründet wurde.* Його читати легше — це перший інструмент редагування.

Українською таке речення легко розгортається, бо дієслово стоїть поруч із підметом. Німецька вимагає тримати в памʼяті «відкриті дужки» до кінця — звідси славетна складність німецької прози.

## 2. Як читати довге речення: чотири кроки

1. **Знайди відмінюване дієслово головного речення** — на 2-му місці, одразу після Vorfeld (а Vorfeld буває дуже довгим, зі вставками).
2. **Знайди його підмет** — Nominativ, що узгоджується з дієсловом.
3. **Візьми в дужки кожне підрядне** — від коми чи сполучника (*der, die, das, welcher, dass, als, wenn, bei welcher*) до його дієслова в кінці.
4. **Прочитай каркас**, потім по черзі «встав» дужки.

Застосуй до Клейста:

| Крок | Що знаходимо |
|---|---|
| дієслово | *stand* … *und wollte sich erhenken* |
| підмет | *ein junger, auf ein Verbrechen angeklagter Spanier* |
| обставини | *in St. Jago* (де), *in dem Augenblicke der großen Erderschütterung vom Jahre 1647* (коли), *an einem Pfeiler des Gefängnisses* (де саме) |
| вставки | *der Hauptstadt des Königreichs Chili* (прикладка), *bei welcher … fanden*, *namens Jeronimo Rugera*, *in welches man ihn eingesperrt hatte* |
| каркас | ***In St. Jago stand ein junger Spanier an einem Pfeiler des Gefängnisses und wollte sich erhenken.*** |

Застарілі риси, які варто знати: *Augenblicke* — давнє -e в Dativ (сьогодні *im Augenblick*), *welcher / welches* як відносні займенники (сьогодні *der / das*), *erhenken* — нині *erhängen*.

> [!diagram] Каркас Клейста: від повного речення до ядра
> ```yaml
> layout: flow
> nodes:
>   - { id: wo, label: "де", text: "In St. Jago", tone: gray }
>   - { id: v, label: "дієслово 1", text: "stand", tone: orange }
>   - { id: s, label: "підмет", text: "ein junger Spanier", tone: mint }
>   - { id: ort, label: "де саме", text: "an einem Pfeiler", tone: gray }
>   - { id: v2, label: "дієслово 2", text: "und wollte sich erhenken.", tone: orange }
> steps:
>   - { focus: [v, v2], note: "Спершу дієслова головного речення: stand … und wollte sich erhenken. Вони дають «що відбувається»." }
>   - { focus: s, note: "Підмет у Nominativ: ein junger Spanier. Означення auf ein Verbrechen angeklagter і namens Jeronimo Rugera тимчасово відкладаємо." }
>   - { focus: [wo, ort], note: "Обставини місця: у Сантьяго, біля стовпа. Час (у мить великого землетрусу 1647 року) — теж обставина, її можна прочитати потім." }
>   - { set: { s: "ein junger, auf ein Verbrechen angeklagter Spanier" }, focus: s, note: "Тепер повертаємо означення на місце. Каркас уже в голові, тож довга група не збиває." }
> ```
> Помаранчевий — дієслова, мʼятний — підмет, сірий — решта.

## 3. Кант: короткі речення, важкі групи

Кант у статті «Відповідь на питання: що таке Просвітництво?» (1784) починає з двох відносно коротких речень, але з важкими групами:

> *Aufklärung ist der Ausgang des Menschen aus seiner selbstverschuldeten Unmündigkeit. Unmündigkeit ist das Unvermögen, sich seines Verstandes ohne Leitung eines anderen zu bedienen.*

- *sich* (Gen) *bedienen* — «користатися чимось» з Genitiv: сьогодні це книжне керування.
- Інфінітивна група *sich … zu bedienen* стоїть після іменника *das Unvermögen* і пояснює його.

Третє речення показує еліпсис і Vorfeld-емфазу: *Selbstverschuldet ist diese Unmündigkeit, wenn die Ursache derselben nicht am Mangel des Verstandes, sondern der Entschließung und des Mutes liegt, sich seiner ohne Leitung eines andern zu bedienen.* Після *sondern* пропущено *am Mangel*: «не в браку розуму, а [у браку] рішучості й мужності». (Цитата в сучасному правописі; в оригіналі *Muthes*.)

## 4. Томас Манн: вставка у вставці

Передмова до «Чарівної гори» (1924) відкривається реченням, яке спершу називає тему, потім на кілька рядків відходить у вставки (в дужках і між тире) — і лише після двокрапки повертається:

> *Die Geschichte Hans Castorps, die wir erzählen wollen, – nicht um seinetwillen (denn der Leser wird einen einfachen, wenn auch ansprechenden jungen Menschen in ihm kennenlernen), sondern um der Geschichte willen […]: diese Geschichte ist sehr lange her …*

Прийом той самий, що Linksversetzung з [[Deutsch - C2 - 01. Стилістичний порядок слів — емфаза й Vorfeld]]: тема — *Die Geschichte Hans Castorps* — винесена вперед, а після довгого відступу її підхоплює *diese Geschichte*, щоб читач не загубився. **Повтор теми після вставки** — головний ключ до такого речення.

## 5. Паралелізм і еліпсис

**Паралелізм** — однакова будова сусідніх частин. Він дає ритм і робить думку запамʼятовуваною:

- *Wer viel liest, weiß viel; wer viel reist, sieht viel.*
- *Je früher wir anfangen, desto eher sind wir fertig.*

**Chiasmus** — дзеркальний паралелізм (A-B / B-A): *Wir leben nicht, um zu essen, sondern wir essen, um zu leben.*

**Еліпсис** — пропуск того, що вже прозвучало. Німецька його любить, але з правилами:

| Тип | Приклад | Умова |
|---|---|---|
| пропуск дієслова (Gapping) | *Anna studiert in Wien, ihr Bruder in Graz.* | дієслово в тій самій формі підходить до обох частин |
| спільний допоміжний | *Er hat das Haus gekauft und renoviert.* | обидва дієслова мають *haben* |
| спільний додаток | *Wir prüfen und unterschreiben den Vertrag.* | обидва дієслова вимагають того самого відмінка |
| пропуск після *sondern / aber* | *nicht am Mangel des Verstandes, sondern der Entschließung* | пропущена частина та сама |

Якщо форми не збігаються, повторюй: *Er **ist** nach Hause gekommen und **hat** sofort gegessen. Ich helfe **meiner Mutter** und unterstütze **sie**.*

## 6. Ритм: короткі вперед, важкі в кінець

Німецький лінгвіст Отто Бегагель описав **закон зростання членів** (Gesetz der wachsenden Glieder, 1909): з двох однорідних частин коротша зазвичай стоїть першою.

- *Er kaufte Brot, Butter und einen großen Laib Käse.* — природно; навпаки звучить незграбно.
- Парні вирази: *Kind und Kegel, Gift und Galle, Glanz und Gloria* — коротше слово першим.
- У реченні: займенники й короткі групи — на початку Mittelfeld, довге й нове — ближче до кінця або в **Nachfeld**: *Wir haben uns gefreut über die vielen Briefe, die nach der Sendung kamen.*

**Parenthese** — вставка між тире, дужками або комами — дає паузу й особисту ремарку: *Die Ministerin – das war allen klar – würde zurücktreten.* Вставка не змінює порядку слів основного речення: *würde* стоїть там, де стояло б без неї.

## 7. Ланцюги означень: коли час розплутувати

Довгі означення й Genitiv-ланцюги — норма права й науки ([[Deutsch - C1 - 02. Nominalstil і Verbalstil — перетворення]]). Але у трьох випадках редактор їх розплутує:

- **три й більше Genitiv поспіль:** *die Prüfung der Voraussetzungen der Gewährung der Leistung* → *Wir prüfen, ob die Voraussetzungen für die Leistung erfüllt sind.*
- **дієприкметникове означення + відносне речення до того самого іменника:** *die von uns im Mai beantragte Förderung, die noch nicht bewilligt wurde* → *Die Förderung, die wir im Mai beantragt haben, ist noch nicht bewilligt.*
- **підмет і дієслово розділені більш ніж рядком** — розбий на два речення й поверни тему займенником.

## Приклади

- Das Haus, in dem die Familie, die wir gestern besucht haben, wohnt, steht unter Denkmalschutz. — Будинок, у якому живе родина, до якої ми вчора ходили в гості, — памʼятка архітектури.
- Ich trinke Kaffee, meine Frau Tee. — Я пʼю каву, моя дружина — чай.
- Er hat die Wohnung gekündigt und ist nach Leipzig gezogen. — Він розірвав договір оренди й переїхав до Лейпціга.
- Wir prüfen und beantworten Ihren Antrag innerhalb von zwei Wochen. — Ми розглянемо Вашу заяву й відповімо на неї протягом двох тижнів.
- Wer zuhört, lernt; wer nur redet, wiederholt sich. — Хто слухає, той учиться; хто лише говорить, той повторюється.
- Nicht die Starken überleben, sondern die Anpassungsfähigen. — Виживають не сильні, а здатні пристосуватися.
- Der Antrag – so viel ist sicher – kommt nicht vor Juli. — Заява — це вже точно — раніше липня не надійде.
- Sie brachte Blumen, eine Flasche Wein und einen selbst gebackenen Apfelkuchen mit. — Вона принесла квіти, пляшку вина й власноруч спечений яблучний пиріг.
- Dass er kommt, glaube ich nicht; dass er anruft, vielleicht. — Що він прийде, я не вірю; що подзвонить — можливо.
- Die Kosten, über die seit Wochen gestritten wird, trägt am Ende die Stadt. — Витрати, про які сперечаються вже кілька тижнів, зрештою покриє місто.

## Слова

> [!word] der Schachtelsatz
> ipa: /ˈʃaxtl̩ˌzats/ · pos: noun · level: C2 · id: de-c2-satzgefuege-w01
> uk: речення з багатьма вкладеними підрядними; «речення-матрьошка»
> forms: die Schachtelsätze
> example: Kleist ist für seine **Schachtelsätze** berühmt. — Клейст славиться своїми довжелезними вкладеними реченнями.
> note: від die Schachtel (коробка): коробка в коробці. Часто з відтінком критики.

> [!word] das Satzgefüge
> ipa: /ˈzatsɡəˌfyːɡə/ · pos: noun · level: C1 · id: de-c2-satzgefuege-w02
> uk: складнопідрядне речення
> forms: die Satzgefüge
> example: Ein **Satzgefüge** besteht aus Haupt- und Nebensatz. — Складнопідрядне речення складається з головного й підрядного.
> note: пара — die Satzreihe (складносурядне: два головні речення з und, aber).

> [!word] verschachtelt
> ipa: /fɛɐ̯ˈʃaxtl̩t/ · pos: adj · level: C1 · id: de-c2-satzgefuege-w03
> uk: заплутаний; багатоступеневий; вкладений одне в одне
> example: Der Vertragstext ist extrem **verschachtelt**. — Текст договору надзвичайно заплутаний.
> note: також про будівлі й структури: ein verschachteltes Gebäude, verschachtelte Ordner.

> [!word] der Einschub
> ipa: /ˈaɪ̯nʃuːp/ · pos: noun · level: C1 · id: de-c2-satzgefuege-w04
> uk: вставка; вставна конструкція
> forms: die Einschübe
> example: Der **Einschub** zwischen den Gedankenstrichen unterbricht den Satz. — Вставка між тире перериває речення.
> note: від einschieben («вставити»). Кінцеве b оглушується: [p].

> [!word] die Parenthese
> ipa: /paʁɛnˈteːzə/ · pos: noun · level: C2 · id: de-c2-satzgefuege-w05
> uk: вставна конструкція (в риториці й синтаксисі)
> forms: die Parenthesen
> example: Eine **Parenthese** steht zwischen Kommas, Klammern oder Gedankenstrichen. — Вставна конструкція стоїть між комами, дужками чи тире.
> note: термін; у побуті — der Einschub. In Parenthese — «між іншим, мимохідь».

> [!word] der Parallelismus
> ipa: /paʁalɛˈlɪsmʊs/ · pos: noun · level: C2 · id: de-c2-satzgefuege-w06
> uk: паралелізм (однакова будова сусідніх частин)
> forms: die Parallelismen
> example: Der **Parallelismus** macht den Slogan einprägsam. — Паралелізм робить гасло легким для запамʼятовування.
> note: риторична фігура; пара — der Chiasmus (дзеркальний порядок).

> [!word] die Ellipse
> ipa: /ɛˈlɪpsə/ · pos: noun · level: C2 · id: de-c2-satzgefuege-w07
> uk: еліпсис (пропуск слова); еліпс (у геометрії)
> forms: die Ellipsen
> example: „Ich Kaffee, sie Tee“ wäre eine zu starke **Ellipse**. — «Я каву, вона чай» було б надто сильним пропуском.
> note: прикметник elliptisch. В українській — еліпсис (синтаксис) і еліпс (фігура); у німецькій одне слово.

> [!word] der Chiasmus
> ipa: /çiˈasmʊs/ · pos: noun · level: C2 · id: de-c2-satzgefuege-w08
> uk: хіазм (перехресний порядок A-B / B-A)
> forms: die Chiasmen
> example: „Wir leben nicht, um zu essen, sondern essen, um zu leben“ ist ein **Chiasmus**. — «Ми живемо не для того, щоб їсти, а їмо, щоб жити» — хіазм.
> note: Ch на початку перед i — [ç], як «хь». AT, CH, півд. DE часто [k]: «кіасмус».

> [!word] entwirren
> ipa: /ɛntˈvɪʁən/ · pos: verb · level: C1 · id: de-c2-satzgefuege-w09
> uk: розплутати; розібратися в чомусь заплутаному
> forms: entwirren → entwirrte → hat entwirrt
> example: Zuerst muss man den Satz **entwirren**, dann versteht man ihn. — Спершу треба розплутати речення, тоді його зрозумієш.
> note: від wirr («заплутаний»); ent- = «зняти, усунути». Про нитки, кабелі, справи й речення.

> [!word] gliedern
> ipa: /ˈɡliːdɐn/ · pos: verb · level: B2 · id: de-c2-satzgefuege-w10
> uk: членувати; поділяти на частини; структурувати
> forms: gliedern → gliederte → hat gegliedert
> example: Ein langer Satz lässt sich in drei kürzere **gliedern**. — Довге речення можна поділити на три коротші.
> note: sich gliedern in (+ Akk) — «поділятися на»: Der Text gliedert sich in vier Teile. Іменник — die Gliederung.

## Слухаємо

> [!listen] Що ти почув?
> level: C2 · type: choice · id: de-c2-satzgefuege-l01
> audio: Ich trinke Kaffee, meine Frau Tee.
> - [x] Ich trinke Kaffee, meine Frau Tee.
> - [ ] Ich trinke Kaffee, meine Frau trinkt Tee.
> - [ ] Ich trinke Kaffee und Tee mit meiner Frau.

> [!listen] Напиши або скажи, що почув
> level: C2 · type: dictation · id: de-c2-satzgefuege-l02
> audio: Der Bericht, den die Kommission vorgelegt hat, ist sehr lang.
> explain: каркас — Der Bericht ist sehr lang; підрядне den … vorgelegt hat стоїть між підметом і дієсловом, з комами з обох боків.

> [!listen] Послухай скорочений початок новели Клейста. Що збирався зробити юнак?
> level: C2 · type: answer · id: de-c2-satzgefuege-l03
> audio: In St. Jago, der Hauptstadt des Königreichs Chili, stand gerade in dem Augenblicke der großen Erderschütterung vom Jahre 1647, bei welcher viele tausend Menschen ihren Untergang fanden, ein junger Spanier an einem Pfeiler des Gefängnisses und wollte sich erhenken.
> - [x] повіситися
> - [ ] втекти з вʼязниці
> - [ ] врятувати людей від землетрусу
>
> **Пояснення:** каркас — *ein junger Spanier stand … und wollte sich erhenken*; *erhenken* — застаріле *erhängen*, «повіситися». Землетрус — лише обставина часу.

> [!listen] Послухай. Хто написав промову?
> level: C2 · type: answer · id: de-c2-satzgefuege-l04
> audio: Die Ministerin – und das wusste damals jeder im Saal – hatte die Rede selbst geschrieben.
> - [x] сама міністерка
> - [ ] хтось із присутніх у залі
> - [ ] її радники
>
> **Пояснення:** *und das wusste damals jeder im Saal* — Parenthese між тире. Без неї: *Die Ministerin hatte die Rede selbst geschrieben.*

## Вимова

Довге речення тримається на **паузах**. Вставку (Parenthese) читають тихіше й трохи швидше, з паузами на тире; після неї голос повертається на рівень основного речення. У паралельних частинах наголоси стоять **на тих самих місцях**: *Wer viel **liest**, weiß **viel**; wer viel **reist**, sieht **viel***. У Gapping (*ihr Bruder in Graz*) наголошене контрастне слово, а пропуск «чути» як коротку паузу.

> [!speak] Скажи вголос
> level: C2 · id: de-c2-satzgefuege-s01
> text: Wer viel liest, weiß viel; wer viel reist, sieht viel.
> ipa: /veːɐ̯ fiːl liːst vaɪ̯s fiːl veːɐ̯ fiːl ʁaɪ̯st ziːt fiːl/
> tip: дві половини — однаковий ритм. liest — довге [iː], reist — дифтонг [aɪ̯]: не сплутай.
> uk: Хто багато читає, той багато знає; хто багато подорожує, той багато бачить.

> [!speak] Скажи вголос
> level: C2 · id: de-c2-satzgefuege-s02
> text: Wir leben nicht, um zu essen, sondern wir essen, um zu leben.
> ipa: /viːɐ̯ ˈleːbn̩ nɪçt ʊm tsuː ˈɛsn̩ ˈzɔndɐn viːɐ̯ ˈɛsn̩ ʊm tsuː ˈleːbn̩/
> tip: хіазм: наголоси leben — essen | essen — leben, дзеркально. Пауза перед sondern.
> uk: Ми живемо не для того, щоб їсти, а їмо, щоб жити.

> [!speak] Скажи вголос
> level: C2 · id: de-c2-satzgefuege-s03
> text: Die Ministerin – das war allen klar – würde zurücktreten.
> ipa: /diː minɪsˈteːʁɪn das vaːɐ̯ ˈalən klaːɐ̯ ˈvʏʁdə tsuˈʁʏktʁeːtn̩/
> tip: вставку між тире — тихіше й швидше, з паузами з обох боків. zurücktreten — наголос на -rück-.
> uk: Міністерка — це всім було ясно — піде у відставку.

> [!speak] Скажи вголос
> level: C2 · id: de-c2-satzgefuege-s04
> text: Anna studiert in Wien, ihr Bruder in Graz.
> ipa: /ˈana ʃtuˈdiːɐ̯t ɪn viːn iːɐ̯ ˈbʁuːdɐ ɪn ɡʁaːts/
> tip: контрастні наголоси: Wien — Graz. Після Bruder — ледь помітна пауза на місці пропущеного дієслова.
> uk: Анна вчиться у Відні, її брат — у Граці.

## Типові помилки українців

> [!pitfall] ~~Er ist gekommen und gegessen~~ — спільний допоміжний
> Пропустити допоміжне дієслово можна, лише якщо воно **те саме**: *Er hat gekocht und gegessen.* Якщо одне дієслово вимагає *sein*, а друге *haben*, повторюй: *Er **ist** nach Hause gekommen und **hat** sofort gegessen.*

> [!pitfall] ~~Ich helfe und unterstütze meine Mutter~~ — спільний додаток
> *helfen* вимагає Dativ, *unterstützen* — Akkusativ. Один додаток на двох можливий, лише коли відмінок збігається (*Wir prüfen und unterschreiben den Vertrag*). Інакше: *Ich helfe **meiner Mutter** und unterstütze **sie**.* Довідники Duden вважають спільний додаток із різними відмінками помилкою.

> [!pitfall] Кома, що закриває підрядне
> Українською підрядне в середині речення теж відокремлюють з обох боків, але в довгому німецькому реченні другу кому часто губляють: ~~Der Mann, den ich gestern getroffen habe ist Arzt.~~ → *Der Mann, den ich gestern getroffen habe**,** ist Arzt.* Правило: після дієслова підрядного, що стоїть у кінці, — кома, якщо речення триває.

> [!pitfall] Ланцюг дієприслівників по-українськи
> «Прийшовши додому, вимкнувши світло й сівши в крісло, він подзвонив…» — у німецькій ланцюг дієприкметникових зворотів (*Nach Hause gekommen, das Licht ausgeschaltet und …*) звучить важко й штучно. Звичніше — підрядне й кілька дієслів поспіль: *Als er nach Hause kam, schaltete er das Licht aus, setzte sich in den Sessel und rief … an.*

## Практика

> [!quiz] Який каркас (головне речення) у «Das Haus, in dem die Familie, die wir gestern besucht haben, wohnt, steht unter Denkmalschutz»?
> level: C2 · type: single · id: de-c2-satzgefuege-q02
> - [x] Das Haus steht unter Denkmalschutz.
> - [ ] Die Familie wohnt unter Denkmalschutz.
> - [ ] Wir haben die Familie besucht.
> - [ ] Die Familie steht unter Denkmalschutz.
>
> **Пояснення:** відмінюване дієслово головного речення — *steht*, підмет — *Das Haus*. *in dem … wohnt* і *die wir … besucht haben* — вкладені підрядні. У кінці три дієслова: *haben — wohnt — steht*, зсередини назовні.

> [!quiz] Які речення з пропуском (еліпсисом) граматично правильні? Обери всі.
> level: C2 · type: multi · id: de-c2-satzgefuege-q03
> - [x] Anna studiert in Wien, ihr Bruder in Graz.
> - [x] Er hat das Haus gekauft und renoviert.
> - [ ] Sie ist angekommen und gleich gegessen.
> - [x] Wir prüfen und unterschreiben den Vertrag.
> - [ ] Ich danke und unterstütze dich.
>
> **Пояснення:** пропуск можливий, коли форма та сама: *studiert* для обох, *hat* для обох, *den Vertrag* — Akkusativ для обох. *gegessen* потребує *hat*, а *danken* вимагає Dativ (*dir*), *unterstützen* — Akkusativ (*dich*).

> [!quiz] Де коми стоять правильно?
> level: C2 · type: single · id: de-c2-satzgefuege-q04
> - [x] Der Bericht, den die Kommission, die im Mai gegründet wurde, vorgelegt hat, ist lang.
> - [ ] Der Bericht, den die Kommission, die im Mai gegründet wurde vorgelegt hat, ist lang.
> - [ ] Der Bericht den die Kommission, die im Mai gegründet wurde, vorgelegt hat ist lang.
> - [ ] Der Bericht, den die Kommission die im Mai gegründet wurde, vorgelegt hat ist lang.
>
> **Пояснення:** кожне підрядне відокремлене з **обох** боків: *, die … wurde,* і *, den … hat,*. В інших варіантах бракує коми на початку або в кінці якогось підрядного.

> [!quiz] Який порядок звучить найприродніше за законом зростання членів?
> level: C2 · type: single · id: de-c2-satzgefuege-q05
> - [x] Sie kaufte Brot, Milch und eine große Tüte frische Äpfel.
> - [ ] Sie kaufte eine große Tüte frische Äpfel, Milch und Brot.
> - [ ] Sie kaufte Milch, eine große Tüte frische Äpfel und Brot.
> - [ ] Sie kaufte eine große Tüte frische Äpfel, Brot und Milch.
>
> **Пояснення:** граматично правильні всі чотири, але природним ритмом німецька ставить коротші члени першими, довгу групу — в кінець (Behaghel). Інші варіанти звучать незграбно.

> [!quiz] Який вислів — хіазм (A-B / B-A)?
> level: C2 · type: single · id: de-c2-satzgefuege-q06
> - [x] Wir leben nicht, um zu essen, sondern wir essen, um zu leben.
> - [ ] Wer viel liest, weiß viel; wer viel reist, sieht viel.
> - [ ] Ich kam, sah und siegte.
> - [ ] Je früher wir anfangen, desto eher sind wir fertig.
>
> **Пояснення:** у хіазмі ті самі слова повертаються в дзеркальному порядку: *leben — essen | essen — leben*. Другий варіант — паралелізм, третій — ланцюг із трьох дій (Trikolon), четвертий — парний сполучник *je … desto*.

> [!quiz] Кант: «…wenn die Ursache derselben nicht am Mangel des Verstandes, sondern der Entschließung und des Mutes liegt». Що пропущено після sondern?
> level: C2 · type: single · id: de-c2-satzgefuege-q07
> - [x] am Mangel — «не в браку розуму, а в браку рішучості й мужності»
> - [ ] die Ursache — «а причина рішучості й мужності»
> - [ ] nicht — «а не рішучості й мужності»
> - [ ] des Menschen — «а людини рішучості й мужності»
>
> **Пояснення:** після *sondern* повторилася б та сама група: *sondern [am Mangel] der Entschließung und des Mutes*. Genitiv *der Entschließung* залежить саме від *Mangel*.

> [!quiz] Де будова частин паралельна? Обери всі.
> level: C2 · type: multi · id: de-c2-satzgefuege-q08
> - [x] Wer zuhört, lernt; wer nur redet, wiederholt sich.
> - [x] Dass er kommt, glaube ich nicht; dass er anruft, vielleicht.
> - [ ] Obwohl es regnete, gingen wir spazieren.
> - [x] Nicht die Starken überleben, sondern die Anpassungsfähigen.
>
> **Пояснення:** у трьох прикладах дві частини повторюють одну схему (*wer … , …* / *dass … , …* / *nicht X, sondern Y*). *Obwohl …, gingen wir …* — звичайне підрядне + головне, без повтору будови.

> [!quiz] Заповни відносні займенники у вкладеному реченні
> level: C2 · type: fill · bank: der, das · id: de-c2-satzgefuege-q09
>
> ```text fill
> Der Bericht, [[den]] die Kommission vorgelegt hat, ist lang.
> Die Kommission, [[die]] im Mai gegründet wurde, tagt monatlich.
> Das Haus, in [[dem]] die Familie wohnt, steht unter Denkmalschutz.
> ```
>
> **Пояснення:** *den* — Akkusativ (*die Kommission hat den Bericht vorgelegt*), *die* — Nominativ жін. роду, *in dem* — Dativ середнього роду після *in* (де?). *der* і *das* у жодне місце не підходять.

> [!quiz] Заповни допоміжні дієслова (Perfekt)
> level: C2 · type: fill · bank: wird, sind · id: de-c2-satzgefuege-q10
>
> ```text fill
> Er [[ist]] nach Hause gekommen und [[hat]] sofort gegessen.
> Sie [[hat]] die Wohnung gekündigt und [[ist]] nach Leipzig gezogen.
> ```
>
> **Пояснення:** *kommen, ziehen* (рух) — з *sein*, *essen, kündigen* — з *haben*. Різні допоміжні не можна «склеїти» еліпсисом — кожне повторюємо. *wird* утворює Futur чи пасив, *sind* — форма множини.

> [!quiz] Склади речення зі вставкою: «Міністерка — це всім було ясно — піде у відставку»
> level: C2 · type: order · id: de-c2-satzgefuege-q11
>
> ```text order
> Die Ministerin
> – das war allen klar –
> würde zurücktreten.
> trat zurück ✗
> ```
>
> **Пояснення:** вставка стоїть між підметом і дієсловом і не змінює порядку слів: *Die Ministerin würde zurücktreten.* «Піде» в оповіді про минуле — *würde* + інфінітив (майбутнє в минулому).

> [!quiz] Склади речення з пропуском дієслова: «Я пʼю каву, моя дружина — чай»
> level: C2 · type: order · id: de-c2-satzgefuege-q12
>
> ```text order
> Ich trinke
> Kaffee,
> meine Frau
> Tee.
> trinken ✗
> ```
>
> **Пояснення:** Gapping: друга частина без дієслова, бо *trinkt* очевидне з першої. Інфінітив *trinken* сюди не підходить.

> [!quiz] Як відредагувати фразу з листа установи «Die Prüfung der Voraussetzungen der Gewährung der Leistung dauert vier Wochen»?
> level: C2 · type: single · id: de-c2-satzgefuege-q13
> - [x] Wir prüfen innerhalb von vier Wochen, ob die Voraussetzungen für die Leistung erfüllt sind.
> - [ ] Die Prüfung der Leistung der Voraussetzungen der Gewährung dauert vier Wochen.
> - [ ] Die Voraussetzungsgewährungsleistungsprüfung dauert vier Wochen.
> - [ ] Die Prüfung dauert vier Wochen der Voraussetzungen der Gewährung der Leistung.
>
> **Пояснення:** три Genitiv поспіль розплутуємо в дієслово й підрядне: *Wir prüfen, ob …* Другий варіант переставляє ланцюг і спотворює зміст, третій — неіснуюче складне слово, четвертий ставить Genitiv після обставини.

> [!quiz] Томас Манн: «Die Geschichte Hans Castorps, die wir erzählen wollen, – nicht um seinetwillen (…), sondern um der Geschichte willen (…): diese Geschichte ist sehr lange her.» Навіщо слова «diese Geschichte»?
> level: C2 · type: single · id: de-c2-satzgefuege-q14
> - [x] Вони повертають тему після довгої вставки, щоб читач не загубив підмет.
> - [ ] Це друга, інша історія, про яку йдеться далі.
> - [ ] Це помилка: підмет у реченні повторювати не можна.
> - [ ] Вони вводять пряму мову героя.
>
> **Пояснення:** тему винесено вперед, потім іде відступ у вставках; після двокрапки *diese Geschichte* підхоплює її, як у Linksversetzung. Це свідомий прийом, а не помилка.

## Фішки

> [!reel] 🌋 Одне речення — і вся катастрофа
> «Землетрус у Чилі» Клейста (1807) відкривається реченням із місцем, датою, катастрофою, героєм і його відчаєм — усе до першої крапки. Каркас короткий: *ein junger Spanier stand … und wollte sich erhenken.*

> [!reel] 🕯️ Sapere aude!
> Кант пише: *Sapere aude! Habe Mut, dich deines eigenen Verstandes zu bedienen!* — «Май мужність користуватися власним розумом!». Латинська фраза — з Горація, а Genitiv після *sich bedienen* — живий слід старої німецької.

> [!reel] 📏 Kind und Kegel
> Чому *Kind und Kegel*, *Gift und Galle*, *Glanz und Gloria*, а не навпаки? Закон Бегагеля (1909): коротше — першим. Наші вуха чекають, що речення «росте» до кінця.

## Джерела та що почитати

- [Project Gutenberg — Heinrich von Kleist, «Ausgewählte Schriften»](https://www.gutenberg.org/ebooks/6645) — повний текст «Das Erdbeben in Chili».
- [Wikisource — Kant, «Beantwortung der Frage: Was ist Aufklärung?»](https://de.wikisource.org/wiki/Beantwortung_der_Frage:_Was_ist_Aufkl%C3%A4rung%3F) — оригінальний текст 1784 року.
- [Project Gutenberg — Thomas Mann, «Der Zauberberg», Bd. 1](https://www.gutenberg.org/ebooks/65661) — передмова «Vorsatz» з довгим першим реченням.
- [Wikipedia — Behaghelsche Gesetze](https://de.wikipedia.org/wiki/Behaghelsche_Gesetze) — закон зростання членів і інші правила порядку.
- [Wikipedia — Schachtelsatz](https://de.wikipedia.org/wiki/Schachtelsatz) — Schachtelsatz і Treppensatz, класичний приклад «Der, der denjenigen, der den Pfahl … umgeworfen hat, anzeigt, …».
- [Wikipedia — Chiasmus](https://de.wikipedia.org/wiki/Chiasmus) і [Parallelismus (Rhetorik)](https://de.wikipedia.org/wiki/Parallelismus_(Rhetorik)) — риторичні фігури з прикладами.
- [Duden — Schachtelsatz](https://www.duden.de/rechtschreibung/Schachtelsatz) — значення й наголос.

> [!important] Підсумок
> - Schachtelsatz читаємо за каркасом: дієслово головного речення → підмет → дужки підрядних → вставляємо по одному.
> - Дієслова вкладених підрядних збираються в кінці й закриваються зсередини назовні; кожне підрядне — з комами з обох боків.
> - Після довгої вставки тему повертають займенником чи повтором (*diese Geschichte*).
> - Паралелізм і хіазм дають ритм; еліпсис можливий лише за тієї самої форми дієслова й того самого відмінка (навіть за однакової форми, як *uns*, Duden радить повторити займенник).
> - Коротке — першим, довге — в кінець або в Nachfeld (закон Бегагеля); Parenthese не змінює порядку слів.
> - Три Genitiv поспіль чи підмет за рядок від дієслова — сигнал розплутати речення.
