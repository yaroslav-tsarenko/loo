---
title: Будова речення — Vorfeld, Ausklammerung, тема й рема
id: de-c1-satzbau
level: C1
icon: px:puzzle
tags: [deutsch, c1, grammar, wortstellung, vorfeld, nachfeld, thema-rhema]
prerequisites: ["[[Deutsch - B1 - 19. Порядок слів у середині речення — TeKaMoLo, місце nicht]]", "[[Deutsch - C1 - 06. Умова без wenn — Sollte…, Hätte ich…, angenommen]]"]
estimatedMinutes: 45
---

# Будова речення — Vorfeld, Ausklammerung, тема й рема

> [!success] Після цієї теми ти зможеш
> - свідомо обирати, що поставити на перше місце (Vorfeld), щоб речення звʼязувалося з попереднім або виділяло контраст;
> - вживати *es* як заповнювач першого місця і знати, коли воно зникає: *Es kamen viele Gäste → Gestern kamen viele Gäste*;
> - виносити частину речення за дужку (Ausklammerung) там, де це норма: *Er hat mehr gearbeitet als ich*;
> - будувати текст за принципом «відоме → нове» (тема й рема) і ставити частки фокуса *sogar, ausgerechnet, immerhin, erst recht*.

## Передбач

> [!quiz] «Gestern war ich beim Arzt. ___» Яке продовження звучить найприродніше?
> level: C1 · type: single · id: de-c1-satzbau-q01
> - [x] Er hat mir neue Tabletten verschrieben.
> - [ ] Verschrieben hat er mir neue Tabletten.
> - [ ] Mir neue Tabletten hat er verschrieben.
> - [ ] Hat er mir neue Tabletten verschrieben.
>
> **Пояснення:** лікаря вже згадано, тож *er* — відома інформація (тема) і природно відкриває речення. *Verschrieben hat er …* — можливе, але лише з сильним контрастом. *Mir neue Tabletten* — два члени речення на першому місці, а речення з дієсловом на початку звучить як питання.

## Поля речення

На B1 ([[Deutsch - B1 - 19. Порядок слів у середині речення — TeKaMoLo, місце nicht]]) ти бачив **дужку речення** (Satzklammer) і **середнє поле** (Mittelfeld). Повна модель має пʼять частин:

| Vorfeld | ліва дужка | Mittelfeld | права дужка | Nachfeld |
|---|---|---|---|---|
| Gestern | hat | mir der Kollege ein Buch | geschenkt, | das ich schon lange suche. |
| Das Buch | habe | ich leider noch nicht | gelesen. | |
| Wir | haben | länger | gewartet | als geplant. |
| — | Hast | du heute Zeit? | | |

- **Vorfeld** — усе перед відмінюваним дієсловом. У розповідному реченні там стоїть **рівно один член речення** (може бути довгим).
- **Ліва й права дужки** — відмінюване дієслово й решта дієслівної групи (Partizip, інфінітив, префікс).
- **Mittelfeld** — порядок за правилами B1: займенники вперед, відоме перед новим, *nicht* перед тим, що заперечує.
- **Nachfeld** — після правої дужки: підрядні речення, порівняння, уточнення.

> [!diagram] Пʼять полів німецького речення
> ```yaml
> layout: flow
> nodes:
>   - { id: vf, label: "Vorfeld · 1 член", text: "Gestern", tone: gray }
>   - { id: lk, label: "ліва дужка", text: "hat", tone: orange }
>   - { id: mf, label: "Mittelfeld", text: "mir der Kollege ein Buch", tone: gray }
>   - { id: rk, label: "права дужка", text: "geschenkt,", tone: orange }
>   - { id: nf, label: "Nachfeld", text: "das ich lange suche.", tone: gray }
> steps:
>   - { focus: [lk, rk], note: "Каркас — дужка: hat … geschenkt. Вона на місці в кожному розповідному реченні з двочленним присудком." }
>   - { focus: vf, note: "Vorfeld — одне місце перед hat. Тут Gestern; якби там стояв der Kollege, gestern перейшло б у Mittelfeld." }
>   - { focus: mf, note: "Mittelfeld: займенник mir, далі підмет der Kollege, нове — ein Buch — ближче до кінця." }
>   - { focus: nf, note: "Nachfeld: відносне речення стоїть після правої дужки, щоб не розривати середину." }
>   - { set: { vf: "Der Kollege", mf: "mir gestern ein Buch" }, focus: [vf, mf], note: "Інший вибір Vorfeld — те саме речення: Der Kollege hat mir gestern ein Buch geschenkt, … Дієслова не рухаються." }
> ```
> Кольори: помаранчевий — дієслівна дужка, сірий — решта (Vorfeld, Mittelfeld, Nachfeld).

## Vorfeld: що ставити першим

Українська дозволяє переставляти слова майже вільно. Німецька тримає дієслово на другому місці, але **Vorfeld вільний**: першим може стати майже будь-який член речення. Вибір залежить від тексту.

| Що у Vorfeld | Навіщо | Приклад |
|---|---|---|
| підмет | нейтральний початок | *Die Kommission hat den Plan abgelehnt.* |
| відома інформація, звʼязок із попереднім | плавний текст | *Gestern war ich in Graz. **Dort** habe ich Olena getroffen.* |
| рамка часу чи місця | налаштувати читача | ***Im Jahr 2015** kamen viele Geflüchtete nach Deutschland.* |
| займенник-відсилання | звʼязати думки | ***Das** hat mich überrascht.* / ***Dabei** zeigte sich, …* |
| контраст (з наголосом) | протиставлення | ***Den Film** habe ich gesehen, das Buch nicht.* |
| Partizip чи інфінітив (з наголосом) | сильний контраст | ***Gelesen** habe ich das Buch nicht, nur durchgeblättert.* |

> [!tip] Тест Vorfeld
> Щоб перевірити, чи група слів — **один** член речення, постав її перед дієсловом. *Nach der langen Diskussion im Ausschuss* **hat** … — спрацювало, отже, це один член. ~~Nach der Diskussion die Kommission hat …~~ — два члени, не працює.

## es — заповнювач першого місця

Коли перше місце нічим заповнити — бо все нове хочеться поставити далі, — його займає **es** (Platzhalter, Vorfeld-*es*). Справжній підмет тоді стоїть у Mittelfeld, а дієслово узгоджується з ним:

- ***Es** kamen viele Gäste.* — Прийшло багато гостей. (дієслово *kamen* — за *Gäste*)
- ***Es** wurde bis Mitternacht diskutiert.* — Дискутували до опівночі. (пасив без підмета)
- ***Es** ist ein Fehler passiert.* — Сталася помилка.

Таке *es* **зникає**, щойно Vorfeld займає щось інше: *Gestern kamen viele Gäste. Bis Mitternacht wurde diskutiert.*

Інші *es* поводяться інакше — не плутай:

| es | Приклад | Зникає? |
|---|---|---|
| заповнювач Vorfeld | Es kamen viele Gäste. → Gestern kamen viele Gäste. | так |
| безособове (погода, час) | Es regnet. → Heute regnet es. | ні |
| es gibt | Es gibt ein Problem. → Hier gibt es ein Problem. | ні |
| корелят підрядного (Korrelat) | Ich finde es gut, dass du kommst. | ні, якщо Vorfeld займає інше слово; часто факультативний і зникає, коли підрядне стоїть першим (*Dass du kommst, finde ich gut*) |

## Ausklammerung: що можна після дужки

Права дужка зазвичай закриває речення. Але деякі частини природно стоять **після** неї, у Nachfeld (це й називають Ausklammerung):

| Що | Приклад | Норма |
|---|---|---|
| підрядне речення | Ich habe vergessen, **dass heute Montag ist**. | майже завжди |
| відносне речення | Ich habe den Mann gesehen, **der gestern hier war**. | звично |
| порівняння з *als / wie* | Er hat mehr gearbeitet **als ich**. | звично |
| інфінітивна група | Wir haben beschlossen, **früher anzufangen**. | звично |
| довга прийменникова група | Wir haben lange gesprochen **über die Pläne für den Sommer**. | розмова; в есе — помірно |
| уточнення, післядумка | Ich habe ihn gestern getroffen, **in der Mensa**. | розмова |

**Не** виносимо за дужку прямий обʼєкт (крім розмовного уточнення-повтору: *Ich hab ihn gesehen, den Peter*), підмет і короткі обставини: ~~Ich habe gekauft ein Auto~~, ~~Wir müssen besprechen das Problem~~.

## Тема й рема: відоме → нове

Речення в тексті тримається за попереднє: **тема** — те, про що мова (відоме), **рема** — нове, заради чого речення сказано. Тема тяжіє до **початку** (Vorfeld, початок Mittelfeld), рема — до **кінця Mittelfeld**, безпосередньо перед правою дужкою. Українська працює так само («Книжку я віддав *сестрі*»), тож інтуїція допомагає — але в німецькій їй заважає жорсткий V2.

Перевірка питанням:

| Питання | Відповідь | Рема |
|---|---|---|
| Wem hast du das Buch gegeben? | Ich habe es **meiner Schwester** gegeben. | meiner Schwester |
| Was hast du deiner Schwester gegeben? | Ich habe ihr **ein Buch** gegeben. | ein Buch |
| Wann kommt der Bus? | Der Bus kommt **um acht**. | um acht |

Правила Mittelfeld, які звідси випливають: займенники (завжди відомі) — першими; означений артикль (відоме) — перед неозначеним (нове); найважливіше — останнім перед дієсловом у кінці.

> [!diagram] Тематична прогресія: рема стає темою
> ```yaml
> layout: timeline
> nodes:
>   - { id: s1, at: "речення 1", text: "Die Stadt plant einen neuen Park.", note: "рема: einen neuen Park", tone: yellow }
>   - { id: s2, at: "речення 2", text: "Der Park soll am Fluss entstehen.", note: "тема: der Park · рема: am Fluss", tone: pink }
>   - { id: s3, at: "речення 3", text: "Dort stehen bisher alte Lagerhallen.", note: "тема: dort · рема: alte Lagerhallen", tone: yellow }
>   - { id: s4, at: "речення 4", text: "Diese sollen bis 2027 abgerissen werden.", note: "тема: diese · рема: bis 2027 abgerissen", tone: pink }
> steps:
>   - { show: s1, focus: s1, note: "Нове в кінці: einen neuen Park — з неозначеним артиклем." }
>   - { show: s2, focus: s2, note: "Нове з першого речення стає темою й відкриває друге: der Park — уже з означеним артиклем." }
>   - { show: s3, focus: s3, note: "dort відсилає до am Fluss. Новим стають склади." }
>   - { show: s4, focus: s4, note: "diese підхоплює склади. Текст тримається ланцюгом «рема → тема»." }
> ```

## Частки фокуса й оцінні прислівники: sogar, ausgerechnet, immerhin, erst recht

*sogar* і *ausgerechnet* — частки фокуса: вони **виділяють** один член речення й стоять **перед ним** (також у Vorfeld). *immerhin* і *erst recht* — оцінні прислівники всього речення:

- ***Sogar** der Chef hat gelacht.* — Навіть шеф засміявся.
- ***Ausgerechnet** heute streikt die Bahn!* — Саме сьогодні, як на зло, страйкує залізниця!
- *Wir haben verloren, aber **immerhin** haben wir ein Tor geschossen.* — Ми програли, але принаймні забили гол.
- *Du sagst, ich schaffe das nicht? Jetzt **erst recht**!* — Кажеш, я не впораюся? Тепер тим паче!

Місце змінює зміст: *Sogar **ich** habe das verstanden* (навіть я) ≠ *Ich habe sogar **das** verstanden* (навіть це).

## Приклади

- Im Frühjahr beginnen die Bauarbeiten. — Навесні почнуться будівельні роботи.
- Den Vertrag habe ich unterschrieben, die Hausordnung noch nicht. — Договір я підписав, а правила будинку — ще ні.
- Es haben sich über hundert Personen angemeldet. — Зареєструвалося понад сто осіб.
- Gestern haben sich über hundert Personen angemeldet. — Учора зареєструвалося понад сто осіб.
- Es wird gebeten, die Türen zu schließen. — Просимо зачиняти двері.
- Wir haben länger gewartet als geplant. — Ми чекали довше, ніж планували.
- Ich habe nicht gewusst, dass du schon in Wien wohnst. — Я не знав, що ти вже живеш у Відні.
- Gekündigt hat er nicht, aber er sucht etwas Neues. — Звільнитися він не звільнився, але шукає щось нове.
- Die Ergebnisse sind überraschend. Sie zeigen, dass … — Результати несподівані. Вони показують, що…
- Ausgerechnet am Wochenende ist die Heizung ausgefallen. — Саме на вихідних, як на зло, зламалося опалення.
- Immerhin hat die Vermieterin sofort reagiert. — Принаймні орендодавиця одразу відреагувала.

## Слова

> [!word] das Vorfeld
> ipa: /ˈfoːɐ̯fɛlt/ · pos: noun · level: C1 · id: de-c1-satzbau-w01
> uk: передпілля, перше місце в реченні (перед дієсловом)
> forms: die Vorfelder
> example: Im **Vorfeld** steht genau ein Satzglied. — На першому місці стоїть рівно один член речення.
> note: загальномовне значення: im Vorfeld (+ Gen) — «напередодні, заздалегідь»: im Vorfeld der Wahl.

> [!word] das Nachfeld
> ipa: /ˈnaːxfɛlt/ · pos: noun · level: C1 · id: de-c1-satzbau-w02
> uk: заключне поле (після дієслівної дужки)
> forms: die Nachfelder
> example: Nebensätze stehen meist im **Nachfeld**. — Підрядні речення зазвичай стоять у заключному полі.
> note: лінгвістичний термін; пара до das Vorfeld і das Mittelfeld.

> [!word] die Ausklammerung
> ipa: /ˈaʊ̯sklaməʁʊŋ/ · pos: noun · level: C1 · id: de-c1-satzbau-w03
> uk: винесення за дужку
> forms: die Ausklammerungen
> example: Die **Ausklammerung** von Vergleichen ist ganz normal. — Винесення порівнянь за дужку — цілком нормальне явище.
> note: ausklammern — «винести за дужки» (і в математиці), а також «залишити осторонь»: ein Thema ausklammern.

> [!word] der Platzhalter
> ipa: /ˈplatsˌhaltɐ/ · pos: noun · level: C1 · id: de-c1-satzbau-w04
> uk: заповнювач; знак-замінник
> forms: die Platzhalter
> example: In „Es kamen viele Gäste“ ist es nur ein **Platzhalter**. — У «Es kamen viele Gäste» es — лише заповнювач.
> note: також в IT і шаблонах: Platzhalter für den Namen — поле для імені.

> [!word] die Hervorhebung
> ipa: /hɛɐ̯ˈfoːɐ̯heːbʊŋ/ · pos: noun · level: C1 · id: de-c1-satzbau-w05
> uk: виділення, підкреслення
> forms: die Hervorhebungen
> example: Das Vorfeld dient oft der **Hervorhebung**. — Перше місце часто слугує для виділення.
> note: від hervorheben. У цитатах: Hervorhebung im Original — «виділення в оригіналі».

> [!word] die Wortstellung
> ipa: /ˈvɔʁtˌʃtɛlʊŋ/ · pos: noun · level: B2 · id: de-c1-satzbau-w06
> uk: порядок слів
> forms: die Wortstellungen
> example: Die **Wortstellung** im Deutschen ist strenger als im Ukrainischen. — Порядок слів у німецькій суворіший, ніж в українській.
> note: синоніми — die Satzstellung, die Wortfolge. Множина вживається рідко.

> [!word] ausgerechnet
> ipa: /ˈaʊ̯sɡəʁɛçnət/ · pos: adv · level: C1 · id: de-c1-satzbau-w07
> uk: саме (як на зло); якраз
> example: **Ausgerechnet** heute habe ich meinen Schirm vergessen. — Якраз сьогодні я забув парасольку.
> note: з досадою чи здивуванням; стоїть перед словом, яке виділяє. Наголос також на -rech-.

> [!word] sogar
> ipa: /zoˈɡaːɐ̯/ · pos: adv · level: A2 · id: de-c1-satzbau-w08
> uk: навіть
> example: **Sogar** meine Oma benutzt WhatsApp. — Навіть моя бабуся користується WhatsApp.
> note: стоїть перед виділеним словом. Наголос на -gar; s — дзвінке [z].

> [!word] erst recht
> ipa: /eːɐ̯st ʁɛçt/ · pos: phrase · level: C1 · id: de-c1-satzbau-w09
> uk: тим паче; тим більше; на зло всьому
> example: Du hältst mich für zu alt? Jetzt **erst recht**! — Думаєш, я застарий? Тепер тим паче!
> note: erst recht nicht — «тим паче ні»: Wenn du nicht hilfst, mache ich es erst recht nicht.

> [!word] immerhin
> ipa: /ˈɪmɐhɪn/ · pos: adv · level: B2 · id: de-c1-satzbau-w10
> uk: принаймні; все-таки; як-не-як
> example: Das Hotel war laut, aber **immerhin** sauber. — Готель був гамірний, але принаймні чистий.
> note: наголос також на -hin. Ще «як-не-як»: Er ist immerhin dein Bruder.

## Слухаємо

> [!listen] Що ти почув?
> level: C1 · type: choice · id: de-c1-satzbau-l01
> audio: Gestern kamen über hundert Gäste.
> - [ ] Es kamen über hundert Gäste.
> - [x] Gestern kamen über hundert Gäste.
> - [ ] Gestern kamen es über hundert Gäste.

> [!listen] Напиши або скажи, що почув
> level: C1 · type: dictation · id: de-c1-satzbau-l02
> audio: Den Vertrag habe ich unterschrieben, die Hausordnung noch nicht.
> explain: Den Vertrag у Vorfeld — контраст до die Hausordnung. Hausordnung — правила будинку.

> [!listen] Напиши або скажи, що почув
> level: C1 · type: dictation · id: de-c1-satzbau-l03
> audio: Ausgerechnet heute streikt die Bahn.
> explain: ausgerechnet — «саме (як на зло)», стоїть перед heute.

> [!listen] Послухай діалог. Що B хоче підкреслити?
> level: C1 · type: answer · id: de-c1-satzbau-l04
> audio: A: Hast du das Buch gelesen?
> audio: B: Gelesen habe ich es nicht, nur durchgeblättert.
> - [x] що лише погортав книжку, а не прочитав
> - [ ] що прочитав книжку двічі
> - [ ] що ще не купив книжку
>
> **Пояснення:** *Gelesen* у Vorfeld — сильний контраст: «прочитати — не прочитав, а лише погортав». Такий порядок зазвичай має наголос на першому слові.

> [!listen] Послухай новину. Що сталося з парком?
> level: C1 · type: answer · id: de-c1-satzbau-l05
> audio: Die Stadt plant einen neuen Park. Der Park soll am Fluss entstehen. Dort stehen bisher alte Lagerhallen. Diese sollen bis 2027 abgerissen werden.
> - [ ] парк уже відкрили біля річки
> - [x] парк лише планують на місці старих складів біля річки
> - [ ] склади перетворять на парк без зносу
>
> **Пояснення:** *plant* — лише план. Кожне речення підхоплює нове з попереднього: *der Park → am Fluss → dort → Lagerhallen → diese*. Склади мають знести до 2027 року.

## Вимова

Vorfeld і наголос повʼязані. Нейтральний порядок (*Ich habe das Buch gelesen*) несе головний наголос на ремі в кінці Mittelfeld: *Ich habe das **Buch** gelesen*. Якщо на перше місце ставиш обʼєкт чи Partizip для **контрасту**, наголос переходить туди й часто є другий наголос на протиставленні: ***Den Film** habe ich gesehen, das **Buch** nicht*. Частки фокуса (*sogar, ausgerechnet*) самі ненаголошені або слабко наголошені — головний наголос падає на виділене слово: *Sogar der **Chef** hat gelacht.*

> [!speak] Скажи вголос
> level: C1 · id: de-c1-satzbau-s01
> text: Den Film habe ich gesehen, das Buch nicht.
> ipa: /deːn fɪlm ˈhaːbə ɪç ɡəˈzeːən das buːx nɪçt/
> tip: два наголоси контрасту: Film і Buch. Buch — довге [uː] і [x] у кінці.
> uk: Фільм я бачив, а книжку — ні.

> [!speak] Скажи вголос
> level: C1 · id: de-c1-satzbau-s02
> text: Es kamen über hundert Gäste.
> ipa: /ɛs ˈkaːmən ˈyːbɐ ˈhʊndɐt ˈɡɛstə/
> tip: es — коротке й ненаголошене. über — довге [yː]. Gäste — ä коротке [ɛ].
> uk: Прийшло понад сто гостей.

> [!speak] Скажи вголос
> level: C1 · id: de-c1-satzbau-s03
> text: Wir haben länger gewartet als geplant.
> ipa: /viːɐ̯ ˈhaːbn̩ ˈlɛŋɐ ɡəˈvaʁtət als ɡəˈplant/
> tip: länger — ng = [ŋ], без [ɡ]. als geplant — після паузи-дужки, рівно.
> uk: Ми чекали довше, ніж планували.

> [!speak] Скажи вголос
> level: C1 · id: de-c1-satzbau-s04
> text: Ausgerechnet heute streikt die Bahn.
> ipa: /ˈaʊ̯sɡəʁɛçnət ˈhɔʏ̯tə ʃtʁaɪ̯kt diː baːn/
> tip: головний наголос на heute — це виділене слово. streikt — «шт» на початку.
> uk: Саме сьогодні страйкує залізниця.

> [!speak] Скажи вголос
> level: C1 · id: de-c1-satzbau-s05
> text: Sogar der Chef hat gelacht.
> ipa: /zoˈɡaːɐ̯ deːɐ̯ ʃɛf hat ɡəˈlaxt/
> tip: головний наголос на Chef — це виділене слово. Chef — [ʃ], як «ш». gelacht — [x] після a.
> uk: Навіть шеф засміявся.

## Типові помилки українців

> [!pitfall] Два члени речення перед дієсловом
> Українське «Після довгої дискусії комісія ухвалила…» підштовхує до ~~Nach der langen Diskussion die Kommission hat entschieden~~. У німецькому розповідному реченні перед відмінюваним дієсловом — **один** член: *Nach der langen Diskussion **hat** die Kommission entschieden.* Довгі вступи в есе — найчастіше місце цієї помилки.

> [!pitfall] Обʼєкт за дужкою
> ~~Ich habe gelesen einen interessanten Artikel.~~ ~~Wir müssen besprechen das Problem.~~ Прямий обʼєкт і підмет стоять у Mittelfeld, усередині дужки: *Ich habe einen interessanten Artikel **gelesen**. Wir müssen das Problem **besprechen**.* За дужку виносимо підрядні речення, порівняння й (у розмові) довгі прийменникові групи.

> [!pitfall] Порівняння всередині дужки
> ~~Er hat als ich mehr gearbeitet.~~ ~~Die Reise hat als erwartet länger gedauert.~~ Українське «довше, ніж очікували» переноситься в середину речення, а в німецькій *als / wie*-група природно стоїть **після** дужки: *Die Reise hat länger **gedauert als erwartet**.*

> [!pitfall] es там, де Vorfeld уже зайнятий
> Заповнювач потрібен лише на порожньому першому місці: ~~Gestern es kamen viele Gäste~~, ~~Gestern kamen es viele Gäste~~ → *Gestern kamen viele Gäste.* І навпаки, не можна просто викинути *es* з порожнього Vorfeld: ~~Ist wichtig, dass …~~ → ***Es** ist wichtig, dass …* або *Wichtig ist, dass …* (тоді *es* зникає); погодне *es* лишається завжди: ~~Heute regnet~~ → *Heute regnet **es***.

## Практика

> [!quiz] Яке речення правильне?
> level: C1 · type: single · id: de-c1-satzbau-q02
> - [x] Nach der langen Diskussion hat die Kommission entschieden.
> - [ ] Nach der langen Diskussion die Kommission hat entschieden.
> - [ ] Die Kommission nach der langen Diskussion hat entschieden.
> - [ ] Nach der langen Diskussion entschieden hat die Kommission.
>
> **Пояснення:** у Vorfeld — один член (*Nach der langen Diskussion*), далі відмінюване дієслово *hat*. В інших варіантах перед *hat* стоять два члени або Partizip без контрасту відриває підмет.

> [!quiz] «Gestern ___ viele Gäste.»
> level: C1 · type: single · id: de-c1-satzbau-q03
> - [x] kamen
> - [ ] kamen es
> - [ ] es kamen
> - [ ] kam es
>
> **Пояснення:** Vorfeld займає *Gestern*, тож заповнювач *es* не потрібен. Дієслово узгоджується з підметом *viele Gäste* (множина): *kamen*.

> [!quiz] У яких реченнях es — заповнювач, який зникне, якщо на перше місце поставити інше слово?
> level: C1 · type: multi · id: de-c1-satzbau-q04
> - [x] Es kamen viele Gäste.
> - [x] Es wurde viel gelacht.
> - [ ] Es regnet seit Stunden.
> - [ ] Es gibt viele Probleme.
> - [ ] Ich finde es gut, dass du kommst.
>
> **Пояснення:** *Gestern kamen viele Gäste. Gestern wurde viel gelacht.* — *es* зникло. Погодне *es* (*Heute regnet es*), *es gibt* (*Hier gibt es …*) і корелят (*Ich finde es gut, dass …*) лишаються.

> [!quiz] Яке речення з частиною за дужкою звучить нормально?
> level: C1 · type: single · id: de-c1-satzbau-q05
> - [x] Er hat mehr gearbeitet als ich.
> - [ ] Er hat gearbeitet mehr als ich.
> - [ ] Ich habe gekauft ein neues Auto.
> - [ ] Wir haben das Problem besprochen gründlich.
>
> **Пояснення:** за дужку природно виносять порівняння з *als*. *mehr*, прямий обʼєкт *ein neues Auto* і коротка обставина *gründlich* мають стояти в Mittelfeld.

> [!quiz] «Wem hast du das Fahrrad verkauft?» Яка відповідь правильна?
> level: C1 · type: single · id: de-c1-satzbau-q06
> - [x] Ich habe es meinem Nachbarn verkauft.
> - [ ] Ich habe meinem Nachbarn das Fahrrad es verkauft.
> - [ ] Das Fahrrad habe ich verkauft meinem Nachbarn.
> - [ ] Es habe ich meinem Nachbarn verkauft.
>
> **Пояснення:** відоме (*das Fahrrad*) — займенником *es* на початку Mittelfeld, нове (*meinem Nachbarn*) — перед дієсловом. Ненаголошене обʼєктне *es* не може стояти в Vorfeld, а Dativ-обʼєкт не виносять за дужку.

> [!quiz] Що може стояти після правої дужки (у Nachfeld)?
> level: C1 · type: multi · id: de-c1-satzbau-q07
> - [x] підрядне з dass
> - [x] порівняння з als
> - [ ] прямий обʼєкт в Akkusativ
> - [x] відносне речення
> - [ ] Partizip II
>
> **Пояснення:** підрядні, відносні речення й порівняння природно стоять у Nachfeld. Akkusativ-обʼєкт належить до Mittelfeld, а Partizip II сам утворює праву дужку.

> [!quiz] «___ heute, wo ich keine Zeit habe, ruft er an!» (як на зло саме)
> level: C1 · type: single · id: de-c1-satzbau-q08
> - [x] Ausgerechnet
> - [ ] Immerhin
> - [ ] Erst recht
> - [ ] Übrigens
>
> **Пояснення:** досада «саме тоді, коли не треба» — *ausgerechnet*. *immerhin* — «принаймні», *erst recht* — «тим паче», *übrigens* — «до речі».

> [!quiz] «Der Film war langweilig, aber ___ war die Musik schön.» (принаймні)
> level: C1 · type: single · id: de-c1-satzbau-q09
> - [x] immerhin
> - [ ] ausgerechnet
> - [ ] erst recht
> - [ ] vielmehr
>
> **Пояснення:** *immerhin* — «принаймні, хоч щось добре». *ausgerechnet* — досада, *erst recht* — «тим паче», *vielmehr* — «радше, навпаки».

> [!quiz] Що виражає «Gelesen habe ich das Buch nicht, nur durchgeblättert»?
> level: C1 · type: single · id: de-c1-satzbau-q10
> - [x] контраст: не прочитав, а лише погортав
> - [ ] питання: чи прочитав я книжку?
> - [ ] минулий час без жодного відтінку
> - [ ] умову: якби я прочитав книжку
>
> **Пояснення:** Partizip II у Vorfeld — виділення для контрасту, з наголосом на *Gelesen*. Питання починалося б з дієслова, а умова потребувала б *Hätte*.

> [!quiz] Заповни пропуски: es чи дієслово
> level: C1 · type: fill · bank: Er, haben · id: de-c1-satzbau-q11
>
> ```text fill
> [[Es]] ist wichtig, dass alle pünktlich sind.
> Gestern [[kamen]] nur drei Leute. (kommen, Präteritum)
> [[Es]] wurde lange über den Plan diskutiert.
> ```
>
> **Пояснення:** *es* — заповнювач порожнього Vorfeld перед *dass*-реченням (можна й *Wichtig ist, dass …*); після *Gestern* заповнювач не потрібен — лише дієслово *kamen*; у пасиві без підмета Vorfeld заповнює *es*.

> [!quiz] Заповни частки фокуса
> level: C1 · type: fill · id: de-c1-satzbau-q12
>
> ```text fill
> [[Sogar|Selbst]] der Chef hat gelacht. (навіть)
> [[Ausgerechnet]] heute streikt die Bahn! (як на зло саме)
> Wir haben verloren, aber [[immerhin]] haben wir ein Tor geschossen. (принаймні)
> Du glaubst nicht an mich? Jetzt [[erst recht]]! (тим паче)
> ```
>
> **Пояснення:** частка фокуса стоїть перед словом, яке виділяє, — також у Vorfeld. Кожна підказка в дужках відповідає одній частці.

> [!quiz] Склади речення, почавши з обставини: «Після довгої дискусії комісія відхилила план»
> level: C1 · type: order · id: de-c1-satzbau-q13
>
> ```text order
> Nach langer Diskussion
> hat
> die Kommission
> den Plan
> abgelehnt.
> ablehnte ✗
> ```
>
> **Пояснення:** обставина займає Vorfeld, далі *hat*, підмет у Mittelfeld, обʼєкт, а Partizip *abgelehnt* закриває дужку.

> [!quiz] Склади речення: «Ми чекали довше, ніж планували»
> level: C1 · type: order · id: de-c1-satzbau-q14
>
> ```text order
> Wir
> haben
> länger gewartet
> als geplant.
> warten ✗
> ```
>
> **Пояснення:** порівняння *als geplant* стоїть за дужкою, після *gewartet*. *warten* — інфінітив, а Perfekt потребує Partizip II.

> [!quiz] «Was hast du deiner Schwester geschenkt?» Яка відповідь природна?
> level: C1 · type: single · id: de-c1-satzbau-q15
> - [x] Ich habe ihr ein Buch geschenkt.
> - [ ] Ich habe ein Buch ihr geschenkt.
> - [ ] Ein Buch habe ich geschenkt ihr.
> - [ ] Ich habe ihr geschenkt ein Buch.
>
> **Пояснення:** займенник *ihr* (відоме) — першим у Mittelfeld, нове *ein Buch* — перед дієсловом. Обʼєкти не виносять за дужку.

> [!quiz] «Die Studie untersucht den Schlaf von 500 Kindern. ___» Яке продовження правильне?
> level: C1 · type: single · id: de-c1-satzbau-q16
> - [x] Dabei zeigte sich, dass viele zu wenig schlafen.
> - [ ] Dabei es zeigte sich, dass viele zu wenig schlafen.
> - [ ] Zeigte sich dabei, dass viele zu wenig schlafen.
> - [ ] Dabei sich zeigte, dass viele zu wenig schlafen.
>
> **Пояснення:** *Dabei* у Vorfeld звʼязує речення з попереднім, далі одразу дієслово *zeigte*. З дієсловом на початку речення стає питанням або умовою.

## Фішки

> [!reel] 👑 Es war einmal …
> Казки починаються з *Es war einmal ein König* — «Жив-був король». *es* тут лише тримає перше місце, щоб король — головна новина — прозвучав ближче до кінця. Без *es*: *Ein König war einmal* — так ніхто казок не починає.

> [!reel] 🗣️ Kenn ich. — порожній Vorfeld
> У розмові німці часто «викидають» займенник із першого місця: *Kenn ich. Weiß ich nicht. Hab ich doch gesagt!* Пропадає саме те, що й так відоме: *das* чи *ich*. У письмовому тексті так не пишуть.

> [!reel] 📐 Звідки поля
> Модель «Vorfeld — Mittelfeld — Nachfeld» називають топологічною: вона описує не члени речення, а **місця**. Її розробили для німецької саме тому, що дієслівна дужка ділить речення на чіткі поля — у більшості мов такої рамки немає.

## Джерела та що почитати

- [grammis (IDS Mannheim) — Subjektkomplement im Vorfeld](https://grammis.ids-mannheim.de/systematische-grammatik/1096) — вузька сторінка про підмет у Vorfeld; загальна картина Vorfeld — у розділах граматики Duden та grammis про лінійну структуру речення.
- [DWDS — ausgerechnet](https://www.dwds.de/wb/ausgerechnet) — значення й приклади.
- [DWDS — immerhin](https://www.dwds.de/wb/immerhin) — «принаймні, все-таки».
- [DWDS — Vorfeld](https://www.dwds.de/wb/Vorfeld) — загальне й лінгвістичне значення.
- Duden — *Die Grammatik* (Band 4) — розділ про топологічні поля й Ausklammerung.
- H. Dreyer, R. Schmitt — *Lehr- und Übungsbuch der deutschen Grammatik* (Hueber) — розділи про порядок слів.

> [!important] Підсумок
> - Поля: **Vorfeld** (один член) — ліва дужка — **Mittelfeld** — права дужка — **Nachfeld**.
> - У Vorfeld — те, що звʼязує з попереднім, рамка або контраст; нейтрально — підмет.
> - *es* заповнює порожній Vorfeld і зникає, коли там щось інше; погодне *es* і *es gibt* лишаються, корелят часто факультативний.
> - За дужку — підрядні речення, порівняння з *als / wie*, інфінітивні групи; прямий обʼєкт — ні (крім розмовного уточнення).
> - Відоме → нове: займенники й означений артикль раніше, рема — перед дієсловом у кінці.
> - *sogar, ausgerechnet* — частки фокуса (перед виділеним словом); *immerhin, erst recht* — оцінні прислівники.
