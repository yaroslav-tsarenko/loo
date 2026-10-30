---
title: Особові займенники й дієслово sein
id: de-a1-sein
level: A1
icon: px:letterTile
tags: [deutsch, a1, grammar, sein, pronomen]
prerequisites: ["[[Deutsch - A1 - 02. Hallo — привітання, країни, мови, du і Sie]]"]
estimatedMinutes: 35
---

# Особові займенники й дієслово sein

> [!success] Після цієї теми ти зможеш
> - назвати особові займенники *ich, du, er, sie, es, wir, ihr, sie, Sie* і правильно вибрати форму *sein*;
> - сказати, хто ти, звідки, як почуваєшся і де ти зараз: *Ich bin Lehrerin. Ich bin müde. Ich bin zu Hause.*;
> - розрізнити три *sie*: «вона», «вони» і ввічливе «Ви»;
> - заперечити й запитати: *Er ist nicht da. Bist du fertig? Wo sind Sie?*

## Передбач

> [!quiz] Як перекласти «Я студент»?
> level: A1 · id: de-a1-sein-q01
> - [ ] Ich Student.
> - [ ] Ich bin ein Student.
> - [x] Ich bin Student.
> - [ ] Ich ist Student.
>
> **Пояснення:** українське «є» в теперішньому часі ми пропускаємо, а в німецькому реченні **завжди є дієслово** — тут *bin*. Артикля перед професією німці не ставлять: *Ich bin Student*. *Ich bin ein Student* — калька з англійського *I am a student*; *ein* зʼявляється, лише коли є прикметник: *Ich bin ein fleißiger Student.*

## Навіщо німцям «є»

Українською ми кажемо «Я студент», «Вона вдома», «Кава гаряча» — і нічого не бракує. Німецьке речення без дієслова не існує. Якщо дії немає (ніхто не йде, не читає, не працює), місце дієслова займає *sein* — «бути, є, перебувати».

| Українською | Німецькою | Що повідомляє sein |
|---|---|---|
| Я студент. | Ich **bin** Student. | хто ти |
| Вона вдома. | Sie **ist** zu Hause. | де хтось |
| Кава гаряча. | Der Kaffee **ist** heiß. | який предмет |
| Ми втомлені. | Wir **sind** müde. | як почуваємося |
| Мені 25. | Ich **bin** 25. | вік (не *haben*!) |
| Це Анна. | Das **ist** Anna. | хто це |

> [!diagram] Як «Я студент» стає німецьким реченням
> ```yaml
> layout: flow
> nodes:
>   - { id: subj, label: "1-ше місце", text: "Ich", tone: mint }
>   - { id: verb, label: "2-ге · sein", text: "?", tone: orange }
>   - { id: rest, label: "хто / який / де", text: "Student", tone: gray }
> steps:
>   - { focus: [subj, rest], note: "Українською вистачає двох слів: «Я студент». Німецькою так не можна — бракує дієслова." }
>   - { set: { verb: "bin" }, focus: verb, note: "На порожнє місце стає sein. Для ich — завжди bin." }
>   - { focus: [subj, verb, rest], note: "Готово: Ich bin Student. Артикля перед професією немає." }
>   - { set: { subj: "Sie", verb: "ist", rest: "zu Hause" }, note: "«Вона вдома» — Sie ist zu Hause. Для er / sie / es — ist." }
>   - { set: { subj: "Heute", verb: "bin", rest: "ich zu Hause" }, focus: verb, note: "Що б не стояло першим, sein тримає 2-ге місце: Heute bin ich zu Hause. Це правило V2 — детально в темі 09." }
> ```
> Перше місце → sein → решта. Дієслово в німецькому розповідному реченні — **завжди друге**.

## Особові займенники

| Німецькою | Українською | Примітка |
|---|---|---|
| ich | я | з **малої** літери (на відміну від англійського *I*) |
| du | ти | друзі, родина, діти, часто колеги |
| er | він | людина **або** іменник з *der*: *der Tisch → er* |
| sie | вона | людина **або** іменник з *die*: *die Tür → sie* |
| es | воно | іменник з *das* (*das Handy → es*), погода й час: *Es ist kalt.* |
| wir | ми | |
| ihr | ви (кілька людей, з кожним — на «ти») | *Seid ihr fertig?* — друзям, дітям |
| sie | вони | і про людей, і про речі |
| Sie | Ви (ввічливо) | **завжди з великої**; одній людині чи кільком |

> [!tip] er, sie, es — за артиклем, а не за українським родом
> Про речі німці теж кажуть «він / вона / воно», але рід береться з **німецького** артикля. Часто він збігається з українським (*der Tisch — стіл — er*), а часто ні: *das Handy* — телефон, але **es**; *die Uhr* — годинник, але **sie**; *das Mädchen* — дівчинка, але граматично **es**. Тому слова вчимо лише з артиклем — про рід детально в темі [[Deutsch - A1 - 06. Артикль і рід — der, die, das, ein, eine]].

## Форми: bin, bist, ist, sind, seid

*sein* — неправильне дієслово, його форми не схожі одна на одну. Їх просто запамʼятовуємо — це найчастіше дієслово німецької.

| Особа | Займенник | Форма | Приклад |
|---|---|---|---|
| 1 одн. | ich | **bin** | Ich bin aus der Ukraine. |
| 2 одн. | du | **bist** | Du bist sehr pünktlich. |
| 3 одн. | er / sie / es | **ist** | Sie ist Ärztin. |
| 1 мн. | wir | **sind** | Wir sind Kollegen. |
| 2 мн. | ihr | **seid** | Ihr seid zu Hause. |
| 3 мн. / ввічл. | sie / Sie | **sind** | Sie sind Studenten. / Sind Sie Herr Weber? |

Зверни увагу: **wir, sie і Sie** мають ту саму форму *sind*. Скорочень на зразок англійського *I'm* у німецькому письмі немає.

> [!warning] seid ≠ seit
> *ihr **seid*** (ви є) і *seit* (від, з — *seit Montag*) звучать однаково — [zaɪ̯t], але пишуться по-різному. Форма дієслова sein — лише **seid** з *d*: *Seid ihr fertig?*

## Три sie: вона, вони, Ви

Одне слово — три значення. Розрізняємо за двома підказками: **форма дієслова** (*ist* чи *sind*) і **велика літера** (*Sie* посеред речення — завжди ввічливе «Ви»).

> [!diagram] sie ist · sie sind · Sie sind
> ```yaml
> layout: compare
> columns: { a: "вона", b: "вони", c: "Ви (ввічливо)" }
> nodes:
>   - { id: a1, col: a, label: "займенник", text: "sie", tone: mint }
>   - { id: a2, col: a, label: "sein", text: "ist", tone: orange }
>   - { id: a3, col: a, label: "решта", text: "müde.", tone: gray }
>   - { id: b1, col: b, label: "займенник", text: "sie", tone: mint }
>   - { id: b2, col: b, label: "sein", text: "sind", tone: orange }
>   - { id: b3, col: b, label: "решта", text: "müde.", tone: gray }
>   - { id: c1, col: c, label: "займенник", text: "Sie", tone: mint }
>   - { id: c2, col: c, label: "sein", text: "sind", tone: orange }
>   - { id: c3, col: c, label: "решта", text: "müde.", tone: gray }
> steps:
>   - { focus: [a1, a2], note: "sie + ist — лише «вона»: форма ist буває тільки в однині." }
>   - { focus: [b1, b2], note: "sie + sind — «вони». Те саме слово, але sind показує множину." }
>   - { focus: [c1, c2], note: "Sie з великої + sind — ввічливе «Ви». Навіть коли говоримо з однією людиною, дієслово — sind." }
>   - { set: { a1: "Sie", b1: "Sie" }, focus: [a1, b1, c1], note: "На початку речення всі три пишуться з великої. Тоді допомагають дієслово й контекст: Sie ist … — це точно «вона»." }
> ```

## Заперечення: nicht

Щоб заперечити, ставимо *nicht* **після** форми sein — перед прикметником, місцем чи віком.

| Твердження | Заперечення | Переклад |
|---|---|---|
| Ich bin müde. | Ich bin **nicht** müde. | Я не втомлений. |
| Er ist da. | Er ist **nicht** da. | Його немає (на місці). |
| Wir sind zu Hause. | Wir sind **nicht** zu Hause. | Нас немає вдома. |
| Das ist richtig. | Das ist **nicht** richtig. | Це неправильно. |

> [!note] А як «Я не лікар»?
> З іменником німці зазвичай кажуть не *nicht*, а **kein**: *Ich bin **kein** Arzt.* Форма *Ich bin nicht Arzt* трапляється, але звучить незвично. Про *kein* — у темі [[Deutsch - A1 - 11. haben, знахідний відмінок і kein]].

## Питання: дієслово на перше місце

У питанні «так / ні» форма sein стає **першою**, підмет — другим. Жодних допоміжних слів, лише перестановка.

| Твердження | Питання | Переклад |
|---|---|---|
| Du bist müde. | **Bist** du müde? | Ти втомився? |
| Sie ist Ärztin. | **Ist** sie Ärztin? | Вона лікарка? |
| Ihr seid fertig. | **Seid** ihr fertig? | Ви (друзі) готові? |
| Sie sind Frau Bondar. | **Sind** Sie Frau Bondar? | Ви пані Бондар? |
| — | Wo **bist** du? | Де ти? |
| — | Wie alt **sind** Sie? | Скільки Вам років? |
| — | Wer **ist** das? | Хто це? |

З питальним словом порядок такий: **питальне слово → sein → підмет**: *Woher sind Sie? Wie ist Ihr Name?* Знову V2 — дієслово на другому місці.

Відповідаємо коротко *Ja.* / *Nein.* або повним реченням: *Bist du müde? — Ja, ich bin müde. / Nein, ich bin nicht müde.*

> [!warning] «Ja, ich bin» — так не кажуть
> Англійське *Yes, I am* німецькою не перекладається дослівно: *~~Ja, ich bin.~~* Відповідай *Ja.* або *Ja, ich bin müde.* У розмові почуєш і *Ja, bin ich.*

## Професія, національність і «Das bin ich»

Професію й національність після sein уживаємо **без артикля**. Для жінки — форма на **-in**:

| Чоловік | Жінка | Речення |
|---|---|---|
| der Lehrer | die Lehrerin | Ich bin Lehrerin. |
| der Student | die Studentin | Er ist Student. |
| der Arzt | die Ärztin | Sie ist Ärztin. |
| der Ukrainer | die Ukrainerin | Wir sind Ukrainer. |

Артикль *ein* зʼявляється лише з прикметником: *Er ist **ein** guter Arzt.*

> [!tip] Das bin ich. Das sind meine Eltern.
> Після *das* («це») дієслово узгоджується не з *das*, а з тим, **хто** це: *Das **bin** ich* (це я), *Das **sind** Max und Lena* (це Макс і Лена). А не ~~Das ist ich~~ чи ~~Das ist Max und Lena~~.

## Приклади

- Ich bin Olena, und das ist Taras. — Я Олена, а це Тарас.
- Wir sind aus der Ukraine, aus Charkiw. — Ми з України, з Харкова.
- Bist du heute zu Hause? — Ти сьогодні вдома?
- Herr Weber ist nicht da. Er ist krank. — Пана Вебера немає на місці. Він хворий.
- Sind Sie Frau Schneider? — Ja, das bin ich. — Ви пані Шнайдер? — Так, це я.
- Seid ihr fertig? Der Bus ist schon da! — Ви готові? Автобус уже тут!
- Das sind Anna und Jonas. Sie sind Kollegen. — Це Анна і Йонас. Вони колеги.
- Die Tür ist offen. — Двері відчинені.
- Wo ist das Handy? — Es ist hier. — Де телефон? — Ось він.
- Es ist schon spät. — Уже пізно.
- Ist das richtig? — Nein, das ist nicht richtig. — Це правильно? — Ні, це неправильно.

## Слова

> [!word] sein
> ipa: /zaɪ̯n/ · pos: verb · level: A1 · id: de-a1-sein-w01
> uk: бути; є; перебувати
> forms: ich bin · du bist · er ist · war · ist gewesen
> example: Ich **bin** müde, aber glücklich. — Я втомлений, але щасливий.
> note: s перед голосним — дзвінке [z]: «зайн», не «сайн».

> [!word] der Student
> ipa: /ʃtuˈdɛnt/ · pos: noun · level: A1 · id: de-a1-sein-w02
> uk: студент
> forms: die Studenten
> example: Mein Bruder ist **Student** in Berlin. — Мій брат — студент у Берліні.
> note: жінка — die Studentin, die Studentinnen. st- на початку = «шт»: «штудент».

> [!word] der Lehrer
> ipa: /ˈleːʁɐ/ · pos: noun · level: A1 · id: de-a1-sein-w03
> uk: учитель; викладач
> forms: die Lehrer
> example: Ist Herr Roth Ihr **Lehrer**? — Пан Рот — Ваш учитель?
> note: жінка — die Lehrerin, die Lehrerinnen. AT: учителя гімназії називають Herr / Frau Professor. CH: офіційно часто die Lehrperson.

> [!word] der Arzt
> ipa: /aːɐ̯tst/ · pos: noun · level: A1 · id: de-a1-sein-w04
> uk: лікар
> forms: die Ärzte
> example: Sie ist **Ärztin**, er ist **Arzt**. — Вона лікарка, він лікар.
> note: жінка — die Ärztin, die Ärztinnen (з умлаутом).

> [!word] müde
> ipa: /ˈmyːdə/ · pos: adj · level: A1 · id: de-a1-sein-w05
> uk: втомлений; сонний
> example: Nach der Arbeit sind wir **müde**. — Після роботи ми втомлені.
> note: ü — губи як для «у», язик як для «і»; не «мюде» з «ю».

> [!word] krank
> ipa: /kʁaŋk/ · pos: adj · level: A1 · id: de-a1-sein-w06
> uk: хворий
> example: Lena ist heute **krank**. — Лена сьогодні хвора.
> note: «Я на лікарняному» = Ich bin krankgeschrieben.

> [!word] fertig
> ipa: /ˈfɛʁtɪç/ · pos: adj · level: A1 · id: de-a1-sein-w07
> uk: готовий (закінчив); готовий до виходу
> example: Bist du **fertig**? Wir gehen! — Ти готовий? Ми йдемо!
> note: розм. «Ich bin fertig» — ще й «я виснажений». -ig у кінці = [ɪç].

> [!word] richtig
> ipa: /ˈʁɪçtɪç/ · pos: adj · level: A1 · id: de-a1-sein-w08
> uk: правильний
> example: Ist die Adresse **richtig**? — Адреса правильна?
> note: «Ти маєш рацію» = Du hast recht (а не ~~Du bist richtig~~). «Bin ich hier richtig?» — чи я туди потрапив?

> [!word] verheiratet
> ipa: /fɛɐ̯ˈhaɪ̯ʁaːtət/ · pos: adj · level: A1 · id: de-a1-sein-w09
> uk: одружений; заміжня
> example: Sind Sie **verheiratet**? — Nein, ich bin ledig. — Ви одружені? — Ні, неодружений.
> note: одне слово для чоловіка й жінки; часто в анкетах (Familienstand).

> [!word] hier
> ipa: /hiːɐ̯/ · pos: adv · level: A1 · id: de-a1-sein-w10
> uk: тут
> example: Ich bin **hier**, am Eingang. — Я тут, біля входу.
> note: h — легкий видих, не українське «г».

> [!word] zu Hause
> ipa: /tsuː ˈhaʊ̯zə/ · pos: phrase · level: A1 · id: de-a1-sein-w11
> uk: вдома
> example: Ist deine Mutter **zu Hause**? — Твоя мама вдома?
> note: «додому» = nach Hause. AT, CH і на півдні Німеччини часто кажуть daheim: Ich bin daheim.

> [!word] pünktlich
> ipa: /ˈpʏŋktlɪç/ · pos: adj · level: A1 · id: de-a1-sein-w12
> uk: пунктуальний; вчасно
> example: Der Zug ist heute **pünktlich**. — Потяг сьогодні прибуває вчасно.

## Слухаємо

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: de-a1-sein-l01
> audio: Sie ist nicht zu Hause.
> - [ ] Sie ist zu Hause.
> - [x] Sie ist nicht zu Hause.
> - [ ] Ist sie zu Hause?

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: de-a1-sein-l02
> audio: Wir sind müde.
> - [x] Wir sind müde.
> - [ ] Ihr seid müde.
> - [ ] Sie sind müde.

> [!listen] Напиши або скажи, що почув
> level: A1 · type: dictation · speed: slow · id: de-a1-sein-l03
> audio: Bist du krank?

> [!listen] Напиши або скажи, що почув
> level: A1 · type: dictation · speed: slow · id: de-a1-sein-l04
> audio: Ihr seid sehr pünktlich.
> explain: форма дієслова sein — seid з d. Слово seit («від, з») звучить так само, але це прийменник.

> [!listen] Послухай діалог. Де зараз Йонас?
> level: A1 · type: answer · speed: slow · id: de-a1-sein-l05
> audio: A: Hallo, Lena! Ist Jonas zu Hause?
> audio: B: Nein, er ist nicht zu Hause. Er ist noch im Büro.
> - [ ] вдома
> - [x] в офісі
> - [ ] в університеті

> [!listen] Послухай діалог. Хто вони?
> level: A1 · type: answer · speed: slow · id: de-a1-sein-l06
> audio: A: Seid ihr Studentinnen?
> audio: B: Ja, wir sind Studentinnen. Wir sind aus Kyjiw.
> - [x] студентки з Києва
> - [ ] вчительки з Києва
> - [ ] студентки з Відня
>
> **Пояснення:** *Studentinnen* — множина від *die Studentin*; *aus Kyjiw* — з Києва: це офіційне німецьке написання, у медіа ще трапляється й *Kiew*.

## Вимова

У формах *sein, sind, Sie* літера **s перед голосним — дзвінке [z]**, як українське «з»: «зайн», «зінт», «зі». А в кінці слова дзвінкі приголосні глушаться: *sind* звучить «зінт», *seid* — «зайт» (про це — тема 23).

> [!speak] Скажи вголос
> level: A1 · id: de-a1-sein-s01
> text: Ich bin Student.
> ipa: /ɪç bɪn ʃtuˈdɛnt/
> tip: ich — [ç]: кінчик язика за нижніми зубами, звук як «хь» у «хіба», не «іх» і не «ік». st- = «шт».
> uk: Я студент.

> [!speak] Скажи вголос
> level: A1 · id: de-a1-sein-s02
> text: Sie ist nicht zu Hause.
> ipa: /ziː ɪst nɪçt tsuː ˈhaʊ̯zə/
> tip: Sie — дзвінке «зі». Hause — [h] як легкий видих (не українське «г»), s між голосними — дзвінке [z].
> uk: Її немає вдома.

> [!speak] Скажи вголос
> level: A1 · id: de-a1-sein-s03
> text: Wir sind müde.
> ipa: /viːɐ̯ zɪnt ˈmyːdə/
> tip: w = «в». sind закінчується глухим [t]: «зінт». ü — губи трубочкою, язик як для «і».
> uk: Ми втомлені.

> [!speak] Скажи вголос
> level: A1 · id: de-a1-sein-s04
> text: Seid ihr fertig?
> ipa: /zaɪ̯t iːɐ̯ ˈfɛʁtɪç/
> tip: питання «так / ні» — голос угору ↗ на fertig. -ig у кінці звучить як [ɪç].
> uk: Ви готові?

> [!speak] Скажи вголос
> level: A1 · id: de-a1-sein-s05
> text: Woher sind Sie?
> ipa: /voˈheːɐ̯ zɪnt ziː/
> tip: наголос на -her. W-питання — голос униз ↘ у кінці.
> uk: Звідки Ви?

> [!speak] Скажи вголос
> level: A1 · id: de-a1-sein-s06
> text: Das ist richtig.
> ipa: /das ɪst ˈʁɪçtɪç/
> tip: r — горлове [ʁ], без вібрації язика. Два звуки [ç]: «ріхьтіхь».
> uk: Це правильно.

## Типові помилки українців

> [!pitfall] Речення без sein: «Ich Student», «Sie sehr nett»
> В українській «є» зникає, у німецькій — ні: *Ich **bin** Student. Sie **ist** sehr nett. Der Kaffee **ist** heiß.* Перевір кожне речення: якщо в ньому немає жодного дієслова, найімовірніше, бракує *bin / ist / sind*.

> [!pitfall] «Ich habe 20 Jahre» і «Ich habe kalt»
> Вік — через **sein**: *Ich **bin** 20 (Jahre alt).* А «мені холодно» — *Mir ist kalt* (тут українська підказує правильно!). *Ich bin kalt* означає «я холодна, байдужа людина». Детально — у темі [[Deutsch - A1 - 04. Числа, вік і номер телефону]].

> [!pitfall] du там, де потрібне Sie
> До незнайомих дорослих, у Behörde, у лікаря, у магазині — **Sie**: *Sind Sie Frau Müller?*, а не ~~Bist du Frau Müller?~~ Ввічливе «Ви» до **однієї** людини — теж *Sie sind*. А «ви» до кількох друзів — **ihr seid**. На письмі *Sie* — завжди з великої, бо *sie* з малої — це «вона» або «вони».

> [!pitfall] «Ich bin ein Lehrer» і «Ich bin Lehrer» від жінки
> Професія після sein — без артикля: *Ich bin Lehrer.* А жінка каже **Lehrerin**, **Ärztin**, **Studentin** — чоловіча форма про себе звучить як помилка. *ein* — лише з прикметником: *Sie ist eine gute Lehrerin.*

## Ситуація: перший день на курсі у Volkshochschule

> [!listen] Послухай діалог на рецепції мовної школи
> level: A1 · type: choice · speed: slow · id: de-a1-sein-l07
> audio: A: Guten Morgen! Sind Sie Frau Bondar?
> audio: B: Ja, das bin ich. Bin ich hier richtig? Ist das der Deutschkurs A1?
> audio: A: Ja, Sie sind hier richtig. Der Kurs ist in Raum zwölf.
> audio: B: Danke! Ist der Lehrer schon da?
> audio: A: Nein, er ist noch nicht da. Aber viele Teilnehmer sind schon hier.
> - [x] Пані Бондар прийшла куди треба, а викладача ще немає.
> - [ ] Пані Бондар помилилася адресою.
> - [ ] Викладач уже в класі, а учнів ще немає.

Відповідай адміністраторці вголос.

> [!speak] «Так, це я. Я туди потрапила?»
> level: A1 · id: de-a1-sein-s07
> text: Ja, das bin ich. Bin ich hier richtig?
> ipa: /jaː das bɪn ɪç bɪn ɪç hiːɐ̯ ˈʁɪçtɪç/
> tip: Das bin ich — дієслово узгоджується з ich. У питанні Bin ich … голос угору ↗.
> uk: Так, це я. Я туди потрапила?

## Практика

> [!quiz] Обери правильну форму: «Meine Eltern ___ aus Lwiw.»
> level: A1 · id: de-a1-sein-q02
> - [ ] ist
> - [x] sind
> - [ ] seid
> - [ ] bin
>
> **Пояснення:** *meine Eltern* = *sie* (вони) → **sind**. *seid* — лише для *ihr*.

> [!quiz] Обери правильне слово: «___ ihr müde?»
> level: A1 · id: de-a1-sein-q03
> - [x] Seid
> - [ ] Seit
> - [ ] Sind
> - [ ] Bist
>
> **Пояснення:** *ihr* → **seid** з *d*. *Seit* звучить так само, але це прийменник «від, з». *Sind* — для *wir / sie / Sie*.

> [!quiz] Як ввічливо спитати: «Ви з Відня, пане Шмідт?»
> level: A1 · id: de-a1-sein-q04
> - [x] Sind Sie aus Wien, Herr Schmidt?
> - [ ] Bist du aus Wien, Herr Schmidt?
> - [ ] Seid ihr aus Wien, Herr Schmidt?
> - [ ] Sind sie aus Wien, Herr Schmidt?
>
> **Пояснення:** до однієї людини ввічливо — **Sie sind**, з великої літери. *du* до пана Шмідта — фамільярно, *ihr* — до кількох друзів, а *sie* з малої означало б «вони».

> [!quiz] Як сказати німецькою «Мені 30 років»?
> level: A1 · id: de-a1-sein-q05
> - [ ] Ich habe 30 Jahre.
> - [x] Ich bin 30 Jahre alt.
> - [ ] Mir ist 30 Jahre.
> - [ ] Ich bin 30 Jahre.
>
> **Пояснення:** вік — через *sein*: *Ich bin 30* або повністю *Ich bin 30 Jahre alt*. Якщо кажеш *Jahre*, потрібне й *alt*.

> [!quiz] Обери всі правильні речення
> level: A1 · type: multi · id: de-a1-sein-q06
> - [x] Ich bin Lehrerin.
> - [ ] Er Arzt.
> - [x] Wir sind nicht müde.
> - [ ] Du seid krank.
> - [x] Ihr seid pünktlich.
>
> **Пояснення:** у *Er Arzt* бракує дієслова: *Er ist Arzt.* Для *du* — *bist*: *Du bist krank.*

> [!quiz] У яких реченнях sie означає «вони»?
> level: A1 · type: multi · id: de-a1-sein-q07
> - [x] Wo sind sie jetzt?
> - [ ] Sie ist Ärztin.
> - [ ] Sind Sie Herr Weber?
> - [x] Lena und Tim? Sie sind im Kino.
>
> **Пояснення:** «вони» = *sie* + *sind*. У *Sie ist Ärztin* дієслово *ist* — це «вона». *Sind Sie Herr Weber?* — велика літера посеред речення й звертання до однієї людини: це ввічливе «Ви».

> [!quiz] Заповни пропуски формами sein
> level: A1 · type: fill · bank: seit, bist · id: de-a1-sein-q08
>
> ```text fill
> Hallo Max, wo [[bist]] du?
> Ich [[bin]] schon im Café. Lena [[ist]] auch hier.
> Tim und Jana [[sind]] noch nicht da.
> [[Seid]] ihr noch zu Hause?
> ```
>
> **Пояснення:** du → bist, ich → bin, Lena (= sie, вона) → ist, Tim und Jana (= sie, вони) → sind, ihr → **Seid** — з *d*, а не *seit*.

> [!quiz] Заповни пропуски: розмова в Bürgeramt
> level: A1 · type: fill · bank: ist, bist · id: de-a1-sein-q09
>
> ```text fill
> A: Guten Tag! [[Sind]] Sie Herr Kowalenko?
> B: Ja, das [[bin]] ich.
> A: [[Sind]] Sie verheiratet?
> B: Nein, ich [[bin]] nicht verheiratet.
> ```
>
> **Пояснення:** в установі — ввічливе *Sie* → **Sind Sie …?** *Das bin ich* — дієслово узгоджується з *ich*, тому не *ist*.

> [!quiz] Заповни пропуски займенниками er, sie, es
> level: A1 · type: fill · bank: Ihr · id: de-a1-sein-q10
>
> ```text fill
> Wo ist das Handy? — [[Es]] ist hier.
> Und die Uhr? — [[Sie]] ist dort.
> Und der Schlüssel? — [[Er]] ist auch dort.
> ```
>
> **Пояснення:** дивимося на **німецький артикль**, а не на український рід: *das Handy → es* (хоча «телефон» — він), *die Uhr → sie* (хоча «годинник» — він), *der Schlüssel → er*.

> [!quiz] Склади питання: «Ти сьогодні вдома?»
> level: A1 · type: order · id: de-a1-sein-q11
>
> ```text order
> Bist
> du
> heute
> zu
> Hause?
> Ist ✗
> ```
>
> **Пояснення:** питання «так / ні» починається з дієслова; для *du* — **bist**.

> [!quiz] Склади речення: «Ми не втомлені»
> level: A1 · type: order · id: de-a1-sein-q12
>
> ```text order
> Wir
> sind
> nicht
> müde.
> kein ✗
> ```
>
> **Пояснення:** *nicht* стоїть після *sind*, перед прикметником. *kein* — лише з іменником.

> [!quiz] Склади питання: «Де Ви зараз?»
> level: A1 · type: order · id: de-a1-sein-q13
>
> ```text order
> Wo
> sind
> Sie
> jetzt?
> seid ✗
> ```
>
> **Пояснення:** питальне слово → дієслово → підмет. Ввічливе *Sie* → *sind*; *seid* — для *ihr*.

> [!quiz] Жінка каже про себе «Я вчителька». Як правильно?
> level: A1 · id: de-a1-sein-q14
> - [ ] Ich bin Lehrer.
> - [x] Ich bin Lehrerin.
> - [ ] Ich bin eine Lehrer.
> - [ ] Ich Lehrerin.
>
> **Пояснення:** жіноча форма — **-in**: *Lehrerin*. Без артикля, але з дієсловом *bin*.

> [!quiz] Як перекласти «Це мої друзі»?
> level: A1 · id: de-a1-sein-q15
> - [ ] Das ist meine Freunde.
> - [x] Das sind meine Freunde.
> - [ ] Das seid meine Freunde.
> - [ ] Es ist meine Freunde.
>
> **Пояснення:** після *das* дієслово узгоджується з тим, хто це: *meine Freunde* — множина → **sind**. Так само *Das bin ich.*

## Фішки

> [!reel] 🧬 ist і «є» — родичі
> Форми sein походять від трьох давніх коренів. *ist, sind, seid* — від того самого, що й українське «є», «єсть» і латинське *est*. *bin, bist* — родичі українського «бути». А *war, gewesen* — від кореня «перебувати, жити».

> [!reel] 🤝 Хто першим пропонує «du»
> У Німеччині дорослі незнайомі люди — на *Sie*. Перейти на *du* (duzen) пропонує старший за віком чи посадою: *Wollen wir uns duzen?* Самовільне *du* в Behörde звучить грубо. Зате в спортзалі, на кухні стартапу й між студентами *du* — норма з першої хвилини.

> [!reel] 👥 Чому ввічливе Sie — це «вони»
> Колись до шанованої людини зверталися в третій особі множини — ніби до кількох: «Чи бажають вони кави?». Так у XVII–XVIII ст. закріпилося *Sie*. Тому й дієслово — *sind*, як у «вони», а велика літера відрізняє «Ви» від «вони».

## Джерела та що почитати

- [DWDS — sein](https://www.dwds.de/wb/sein) — значення, приклади, вимова й етимологія (три корені дієслова).
- [Duden — sein (Vollverb)](https://www.duden.de/rechtschreibung/sein_Verb_Vollverb) — відмінювання, вимова, приклади.
- [Duden — seid](https://www.duden.de/rechtschreibung/seid) — правопис *seid* і відмінність від *seit*.
- [Duden Sprachratgeber — Duzen oder Siezen?](https://www.duden.de/sprachwissen/sprachratgeber/Duzen-oder-Siezen) — коли *du*, коли *Sie*.
- [DW Learn German — Nicos Weg (A1)](https://learngerman.dw.com/en/beginners/c-36519789) — безкоштовний відеокурс Deutsche Welle з граматикою до кожного уроку.
- Goethe-Institut — сторінка іспиту *Goethe-Zertifikat A1: Start Deutsch 1* на goethe.de: зразки завдань і список слів A1.
- H. Dreyer, R. Schmitt — *Lehr- und Übungsbuch der deutschen Grammatik* (Hueber) — розділи про особові займенники й *sein*.

> [!important] Підсумок
> - У німецькому реченні завжди є дієслово; якщо дії немає — ставимо *sein*.
> - ich **bin**, du **bist**, er / sie / es **ist**, wir **sind**, ihr **seid**, sie / Sie **sind**.
> - Три *sie*: *sie ist* — вона, *sie sind* — вони, *Sie sind* — ввічливе «Ви» (з великої).
> - Заперечення — *nicht* після sein: *Ich bin nicht müde.* Питання — sein на початок: *Bist du fertig?*
> - Професія — без артикля: *Ich bin Lehrerin.* Вік — *Ich bin 20*, а не ~~Ich habe 20 Jahre~~.
