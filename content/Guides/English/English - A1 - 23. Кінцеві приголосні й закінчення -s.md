---
title: Кінцеві приголосні й закінчення -s
order: 123
id: en-a1-final-consonants
level: A1
icon: px:target
tags: [english, a1, pronunciation, consonants, plural, third-person-s]
prerequisites: ["[[English - A1 - 17. Приголосні th, w, v, r, h]]", "[[English - A1 - 06. Артиклі a, an і множина іменників]]"]
estimatedMinutes: 35
---

# Кінцеві приголосні й закінчення -s

> [!success] Після цієї теми ти зможеш
> - вимовляти дзвінкі приголосні в кінці слова і не плутати *bag* — *back*, *eyes* — *ice*, *prize* — *price*;
> - чути й вимовляти довший голосний перед дзвінким кінцем;
> - обирати правильну вимову закінчення -s: /s/ у *cats*, /z/ у *dogs*, /ɪz/ у *buses*;
> - вимовляти слово до кінця без зайвого голосного: *bag*, а не «бег-а».

## Передбач

> [!quiz] Як ти думаєш, чи однаково звучить закінчення -s у словах cats, dogs і buses?
> level: A1 · id: en-a1-final-consonants-q01
> - [ ] так, усюди /s/
> - [ ] ні: у cats /s/, а в dogs і buses — /z/
> - [x] ні: cats — /s/, dogs — /z/, buses — /ɪz/
>
> **Пояснення:** -s має **три** вимови, і вибір залежить від останнього звуку слова: *cats* /kæts/, *dogs* /dɒɡz/, *buses* /ˈbʌsɪz/. Правило просте й логічне — розберемо його нижче.

## Пояснення

### Дзвінкий кінець — тримай його

У літературній українській дзвінкі в кінці слова **не оглушуються**: «дуб», «сад», «ніж» звучать із дзвінкими [б], [д], [ж]. Це твоя перевага — тримай цю звичку і в англійській. Бо там від одного звуку в кінці залежить значення:

| Дзвінкий кінець | Глухий кінець |
|---|---|
| *bag* /bæɡ/ — сумка | *back* /bæk/ — спина |
| *bed* /bed/ — ліжко | *bet* /bet/ — ставка |
| *eyes* /aɪz/ — очі | *ice* /aɪs/ — лід |
| *prize* /praɪz/ — приз | *price* /praɪs/ — ціна |
| *leave* /liːv/ — іти геть; залишати | *leaf* /liːf/ — листок |
| *dog* /dɒɡ/ — пес | *dock* /dɒk/ — причал |

### Секрет носіїв: довжина голосного

Цікаво, що самі англійці часто вимовляють кінцевий дзвінкий приголосний **не зовсім дзвінко**. Як же вони розрізняють *bag* і *back*? За **голосним перед ним**: перед дзвінким приголосним голосний **довший**, перед глухим — **коротший і «обрізаний»**.

> [!diagram] bag і back: різниця ховається в голосному
> ```yaml
> layout: compare
> columns: { voiced: "bag — дзвінкий кінець", voiceless: "back — глухий кінець" }
> nodes:
>   - { id: b1, col: voiced, label: "початок", text: "b", tone: gray }
>   - { id: v1, col: voiced, label: "голосний", text: "æ — æ — æ", note: "довший, плавний", tone: green }
>   - { id: c1, col: voiced, label: "кінець", text: "ɡ", note: "мʼякий, дзвінкий", tone: blue }
>   - { id: b2, col: voiceless, label: "початок", text: "b", tone: gray }
>   - { id: v2, col: voiceless, label: "голосний", text: "æ", note: "коротший, обірваний", tone: orange }
>   - { id: c2, col: voiceless, label: "кінець", text: "k", note: "різкий, глухий", tone: red }
> steps:
>   - { focus: [b1, b2], note: "Обидва слова починаються однаково — з /b/." }
>   - { focus: [v1, v2], note: "Головна різниця: у bag голосний тягнеться довше, у back — коротко, ніби його обрізали." }
>   - { focus: [c1, c2], note: "Кінець: мʼяке дзвінке /ɡ/ проти різкого глухого /k/. Але навіть якщо /ɡ/ ледь чутне, довгий голосний підкаже слухачу: bag." }
> ```

Тож тренуй **обидва** сигнали: тягни голосний перед дзвінким (*bag, bed, eyes, prize*) і вимовляй дзвінкий до кінця, але **без зайвого голосного** після нього.

### Без хвостика в кінці

Українці іноді «допомагають» собі голосним наприкінці: «бег-а», «дог-у», «кетс-и». В англійській слово закінчується приголосним — і крапка. Закрий звук і зупинись.

### Закінчення -s: /s/, /z/ чи /ɪz/

Ті самі правила діють для **всіх** -s в англійській:

- множина іменників: *cats, dogs, buses*;
- he / she / it у Present Simple: *works, plays, watches*;
- присвійне *'s*: *Kate's, Tom's, George's*;
- скорочення *is / has*: *it's* /ɪts/, *he's* /hiːz/.

Вибір залежить від **останнього звуку** (не літери!) слова:

> [!diagram] Як вимовити -s
> ```yaml
> layout: tree
> nodes:
>   - { id: root, text: "Який останній ЗВУК слова?", tone: violet }
>   - { id: sib, parent: root, label: "s z ʃ ʒ tʃ dʒ (шиплячі)", text: "+ /ɪz/", note: "bus → buses, watch → watches", tone: orange }
>   - { id: vl, parent: root, label: "інший глухий: p t k f θ", text: "+ /s/", note: "cat → cats, stop → stops", tone: blue }
>   - { id: vd, parent: root, label: "дзвінкий або голосний", text: "+ /z/", note: "dog → dogs, play → plays", tone: green }
> steps:
>   - { focus: root, note: "Дивимося не на літеру, а на останній звук основи. Наприклад, laugh закінчується на звук /f/, хоча пишеться gh." }
>   - { focus: sib, note: "Шиплячі s, z, ʃ, ʒ, tʃ, dʒ: ще одне шипіння неможливо приліпити, тож додаємо цілий склад /ɪz/: buses, watches, pages." }
>   - { focus: vl, note: "Глухі p, t, k, f, θ: додаємо глухе /s/ — cats, books, laughs, months." }
>   - { focus: vd, note: "Усі дзвінкі й голосні: додаємо дзвінке /z/ — dogs, bags, plays, trees, eyes." }
> ```

| Остання літера(и) | Останній звук | -s | Приклади |
|---|---|---|---|
| -p, -t, -k, -ke, -gh, -th | /p t k f θ/ | /s/ | *stops, cats, books, likes, laughs, months* |
| -b, -d, -g, -l, -m, -n, -v(e), -r, голосні | дзвінкі й голосні | /z/ | *cabs, kids, dogs, hugs, dreams, waves, plays, cars* |
| -s, -ss, -x, -z, -sh, -ch, -ge, -dge, -se, -ce | /s z ʃ ʒ tʃ dʒ/ | /ɪz/ | *buses, kisses, boxes, dishes, matches, pages, bridges, roses, prices* |

> [!warning] Пастка з e, яка не читається
> *page*, *rose*, *price* закінчуються на *e*, яка не читається, але останній **звук** — /dʒ/, /z/, /s/. Тому *pages* /ˈpeɪdʒɪz/, *roses* /ˈrəʊzɪz/, *prices* /ˈpraɪsɪz/ — з додатковим складом. А *likes* /laɪks/ — без, бо останній звук /k/.

## Приклади

- *Put it in the bag, not on your back.* — Поклади це в сумку, а не на спину.
- *What a nice prize! What's the price?* — Який гарний приз! Яка ціна?
- *She has blue eyes.* — У неї блакитні очі.
- *My cat likes dogs.* — Мій кіт любить собак.
- *He washes the dishes and watches TV.* — Він миє посуд і дивиться телевізор.
- *Two buses and three cabs.* — Два автобуси й три таксі.
- *She laughs and hugs her kids.* — Вона сміється й обіймає дітей.
- *These roses are for Kate's birthday.* — Ці троянди — на день народження Кейт.
- *Read pages ten to twelve.* — Прочитай сторінки з десятої до дванадцятої.
- *We want peace.* — Ми хочемо миру.

## Слова

> [!word] prize
> ipa: /praɪz/ · pos: noun · level: A1 · id: en-a1-final-consonants-w01
> uk: приз; нагорода
> example: She won first **prize**. — Вона виграла перший приз.
> note: дзвінке /z/ у кінці; з /s/ вийде price — ціна.

> [!word] peace
> ipa: /piːs/ · pos: noun · level: A1 · id: en-a1-final-consonants-w02
> uk: мир; спокій
> example: We all want **peace**. — Ми всі хочемо миру.
> note: глухе /s/; peas /piːz/ — горошини.

> [!word] loose
> ipa: /luːs/ · pos: adj · level: A1 · id: en-a1-final-consonants-w03
> uk: вільний (про одяг); нещільний
> example: These jeans are too **loose**. — Ці джинси завеликі (вільні).
> note: глухе /s/; lose /luːz/ (губити) — з дзвінким /z/.

> [!word] feed
> ipa: /fiːd/ · pos: verb · level: A1 · id: en-a1-final-consonants-w04
> uk: годувати
> example: Can you **feed** the cat? — Можеш нагодувати кота?
> forms: feed → fed → fed
> note: довге /iː/ + дзвінке /d/; feet /fiːt/ — ступні.

> [!word] rise
> ipa: /raɪz/ · pos: verb · level: A1 · id: en-a1-final-consonants-w05
> uk: підніматися; сходити (про сонце)
> example: The sun **rises** in the east. — Сонце сходить на сході.
> forms: rise → rose → risen
> note: rises — /ˈraɪzɪz/; rice /raɪs/ — рис.

> [!word] kid
> ipa: /kɪd/ · pos: noun · level: A1 · id: en-a1-final-consonants-w06
> uk: дитина (розм.)
> example: They have two **kids**. — У них двоє дітей.
> note: kids — /kɪdz/.

> [!word] page
> ipa: /peɪdʒ/ · pos: noun · level: A1 · id: en-a1-final-consonants-w07
> uk: сторінка
> example: Open your books at **page** ten. — Відкрийте книжки на десятій сторінці.
> note: pages — /ˈpeɪdʒɪz/, два склади.

> [!word] match
> ipa: /mætʃ/ · pos: noun · level: A1 · id: en-a1-final-consonants-w08
> uk: матч; сірник
> example: Did you watch the **match**? — Ти дивився матч?
> note: matches — /ˈmætʃɪz/.

> [!word] rose
> ipa: /rəʊz/ · ipa-us: /roʊz/ · pos: noun · level: A1 · id: en-a1-final-consonants-w09
> uk: троянда
> example: He gave her a red **rose**. — Він подарував їй червону троянду.
> note: s між голосними — /z/; roses — /ˈrəʊzɪz/.

> [!word] kiss
> ipa: /kɪs/ · pos: noun · level: A1 · id: en-a1-final-consonants-w10
> uk: поцілунок; (дієслово) цілувати
> example: Give me a **kiss**! — Поцілуй мене!
> note: kisses — /ˈkɪsɪz/.

> [!word] laugh
> ipa: /lɑːf/ · ipa-us: /læf/ · pos: verb · level: A1 · id: en-a1-final-consonants-w11
> uk: сміятися; (іменник) сміх
> example: He always **laughs** at my jokes. — Він завжди сміється з моїх жартів.
> note: gh = /f/, тому laughs — /lɑːfs/, з глухим /s/.

> [!word] judge
> ipa: /dʒʌdʒ/ · pos: noun · level: A1 · id: en-a1-final-consonants-w12
> uk: суддя; (дієслово) судити
> example: The **judge** is very strict. — Суддя дуже суворий.
> note: dge = /dʒ/; judges — /ˈdʒʌdʒɪz/.

> [!word] wave
> ipa: /weɪv/ · pos: verb · level: A1 · id: en-a1-final-consonants-w13
> uk: махати (рукою); (іменник) хвиля
> example: She **waves** goodbye. — Вона махає на прощання.
> note: дзвінке /v/ у кінці, waves — /weɪvz/.

> [!word] lock
> ipa: /lɒk/ · ipa-us: /lɑːk/ · pos: verb · level: A1 · id: en-a1-final-consonants-w14
> uk: замикати; (іменник) замок
> example: Don't forget to **lock** the door. — Не забудь замкнути двері.
> note: locks — /lɒks/.

> [!word] bridge
> ipa: /brɪdʒ/ · pos: noun · level: A1 · id: en-a1-final-consonants-w15
> uk: міст
> example: There are many **bridges** in Kyiv. — У Києві багато мостів.
> note: bridges — /ˈbrɪdʒɪz/.

> [!word] hug
> ipa: /hʌɡ/ · pos: verb · level: A1 · id: en-a1-final-consonants-w16
> uk: обіймати; (іменник) обійми
> example: She **hugs** her mum. — Вона обіймає маму.
> note: кінцеве /ɡ/ — як «ґ», дзвінко; hugs — /hʌɡz/.

> [!word] dream
> ipa: /driːm/ · pos: noun · level: A1 · id: en-a1-final-consonants-w17
> uk: мрія; сон
> example: It's my **dream** to visit London. — Моя мрія — побувати в Лондоні.
> forms: dream → dreamt / dreamed → dreamt / dreamed

> [!word] nose
> ipa: /nəʊz/ · ipa-us: /noʊz/ · pos: noun · level: A1 · id: en-a1-final-consonants-w18
> uk: ніс
> example: My **nose** is cold. — У мене холодний ніс.
> note: s тут — /z/: «ноуз».

> [!word] dish
> ipa: /dɪʃ/ · pos: noun · level: A1 · id: en-a1-final-consonants-w19
> uk: страва; тарілка (для подачі)
> example: I'll wash the **dishes**. — Я помию посуд.
> note: dishes — /ˈdɪʃɪz/; wash the dishes — мити посуд.

> [!word] cab
> ipa: /kæb/ · pos: noun · level: A1 · id: en-a1-final-consonants-w20
> uk: таксі
> example: Let's take a **cab**. — Візьмімо таксі.
> note: дзвінке /b/; cap /kæp/ — кепка.

## Слухаємо

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: en-a1-final-consonants-l01
> audio: Put it in the back.
> - [ ] Put it in the bag.
> - [x] Put it in the back.

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: en-a1-final-consonants-l02
> audio: What a nice prize!
> - [x] What a nice prize!
> - [ ] What a nice price!

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: en-a1-final-consonants-l03
> audio: She has blue eyes.
> - [x] She has blue eyes.
> - [ ] She has blue ice.

> [!listen] Напиши або скажи, що почув
> level: A1 · type: dictation · speed: slow · id: en-a1-final-consonants-l04
> audio: She watches films and plays games.

> [!listen] Скільки коштують коробки?
> level: A1 · type: answer · speed: slow · id: en-a1-final-consonants-l05
> audio: A: How much are the roses?
> audio: B: Five pounds.
> audio: A: And the boxes?
> audio: B: Two pounds each.
> - [ ] £5 кожна
> - [x] £2 кожна
> - [ ] £2 за всі

> [!listen] Де ключі?
> level: A1 · type: answer · speed: slow · id: en-a1-final-consonants-l06
> audio: A: Where are my keys?
> audio: B: On the bed, next to your glasses.
> audio: A: Thanks!
> - [x] на ліжку, біля окулярів
> - [ ] у сумці з окулярами
> - [ ] на столі біля склянок

## Вимова

### Мінімальні пари

> [!pair] bag /bæɡ/ — back /bæk/
> level: A1 · id: en-a1-final-consonants-p01
> say: bag
> tip: bag — голосний довший, кінець мʼякий; back — коротко й різко.

> [!pair] bed /bed/ — bet /bet/
> level: A1 · id: en-a1-final-consonants-p02
> say: bet
> tip: bet — голосний «обрізаний» глухим /t/.

> [!pair] eyes /aɪz/ — ice /aɪs/
> level: A1 · id: en-a1-final-consonants-p03
> say: eyes
> tip: eyes — дифтонг довший, у кінці дзижчить /z/; ice — коротший, у кінці свистить /s/.

> [!pair] cap /kæp/ — cab /kæb/
> level: A1 · id: en-a1-final-consonants-p04
> say: cab
> tip: cab — тягни /æ/ трохи довше і закінчи мʼяким /b/.

> [!pair] dog /dɒɡ/ — dock /dɒk/
> level: A1 · id: en-a1-final-consonants-p05
> say: dock
> tip: dock — коротке «о» і різке /k/.

> [!pair] prize /praɪz/ — price /praɪs/
> level: A1 · id: en-a1-final-consonants-p06
> say: price
> tip: price — коротше, зі свистом /s/ у кінці.

> [!pair] leaf /liːf/ — leave /liːv/
> level: A1 · id: en-a1-final-consonants-p07
> say: leave
> tip: leave — /iː/ довше, у кінці дзвінке /v/ (зуби на губу + голос).

> [!pair] sat /sæt/ — sad /sæd/
> level: A1 · id: en-a1-final-consonants-p08
> say: sad
> tip: sad — /æ/ довший, кінець мʼякий.

> [!pair] peas /piːz/ — peace /piːs/
> level: A1 · id: en-a1-final-consonants-p09
> say: peace
> tip: peace — свист /s/ у кінці; peas — дзижчання /z/.

> [!pair] cart /kɑːt/ — card /kɑːd/
> level: A1 · id: en-a1-final-consonants-p10
> say: card
> tip: card — тягнемо «ка-а-ад», кінець дзвінкий.

> [!pair] feed /fiːd/ — feet /fiːt/
> level: A1 · id: en-a1-final-consonants-p11
> say: feet
> tip: feet — /iː/ коротший і різке /t/.

> [!pair] lose /luːz/ — loose /luːs/
> level: A1 · id: en-a1-final-consonants-p12
> say: lose
> tip: lose — довше /uː/ і дзвінке /z/. Пишеться з однією o!

### Скажи вголос

> [!speak] Скажи вголос
> level: A1 · id: en-a1-final-consonants-s01
> text: The bag is big.
> ipa: /ðə bæɡ ɪz bɪɡ/
> tip: кінцеві /ɡ/ — дзвінкі, як «ґ», і без «а» після них.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-final-consonants-s02
> text: She has blue eyes.
> ipa: /ʃi hæz bluː aɪz/
> tip: has і eyes закінчуються на /z/ — дзижчи, не свисти.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-final-consonants-s03
> text: He likes cats and dogs.
> ipa: /hi laɪks kæts ən dɒɡz/
> tip: likes і cats — /s/, dogs — /z/.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-final-consonants-s04
> text: She washes the dishes.
> ipa: /ʃi ˈwɒʃɪz ðə ˈdɪʃɪz/
> tip: після /ʃ/ — додатковий склад /ɪz/: WA-shes, DI-shes.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-final-consonants-s05
> text: Two buses and three cabs.
> ipa: /tuː ˈbʌsɪz ən θriː kæbz/
> tip: buses — три звуки в кінці /sɪz/; cabs — /bz/ дзвінко.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-final-consonants-s06
> text: He laughs and hugs his kids.
> ipa: /hi lɑːfs ən hʌɡz hɪz kɪdz/
> tip: laughs — /fs/ глухо; hugs, his, kids — /z/ дзвінко.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-final-consonants-s07
> text: These roses are for Kate's mum.
> ipa: /ðiːz ˈrəʊzɪz ə fə ˈkeɪts mʌm/
> tip: roses — /zɪz/; Kate's — /ts/, бо Kate закінчується на /t/.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-final-consonants-s08
> text: Feed the dog, please.
> ipa: /fiːd ðə dɒɡ pliːz/
> tip: три слова закінчуються дзвінким: /d/, /ɡ/, /z/. Тягни голосні перед ними.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-final-consonants-s09
> text: What's the price of this prize?
> ipa: /wɒts ðə praɪs əv ðɪs praɪz/
> tip: price — коротко, зі свистом /s/; prize — довше, з дзижчанням /z/.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-final-consonants-s10
> text: Open your books at page five.
> ipa: /ˈəʊpən jɔː bʊks ət peɪdʒ faɪv/
> tip: books — /ks/, page — дзвінке /dʒ/ до кінця, five — /v/, зуби на губу.

## Типові помилки українців

> [!pitfall] Оглушення в кінці: «бек» замість bag
> Якщо сказати *bag* як «бек», *eyes* як «айс», *prize* як «прайс» — вийдуть інші слова: *back*, *ice*, *price*. Тримай дзвінкий до кінця і **тягни голосний** перед ним.

> [!pitfall] Зайвий голосний: «дог-у», «кетс-и»
> Не додавай голосного після кінцевого приголосного. Англійське слово може закінчуватися навіть кількома приголосними поспіль: *texts* /teksts/, *months* /mʌnθs/. Вимов їх до кінця — і замовкни.

> [!pitfall] -s завжди як «с»
> «Догс», «плейс», «бесес» — звучить різко й неприродно. Памʼятай три варіанти: /s/ після глухих (*cats*), /z/ після дзвінких і голосних (*dogs, plays*), /ɪz/ після шиплячих (*buses, watches*). Найчастіший з трьох — саме /z/.

## Практика

> [!quiz] Як вимовляється -s у слові dogs?
> level: A1 · id: en-a1-final-consonants-q02
> - [ ] /s/
> - [x] /z/
> - [ ] /ɪz/
>
> **Пояснення:** *dog* закінчується на дзвінке /ɡ/, тому -s дзвінке: /dɒɡz/.

> [!quiz] У яких словах -s (-es) звучить як /ɪz/? Обери всі.
> level: A1 · type: multi · id: en-a1-final-consonants-q03
> - [x] buses
> - [x] watches
> - [ ] cats
> - [x] pages
> - [ ] plays
> - [ ] likes
>
> **Пояснення:** /ɪz/ — після шиплячих /s z ʃ ʒ tʃ dʒ/: *bus*, *watch*, *page* (/dʒ/). *cats*, *likes* — /s/, *plays* — /z/.

> [!quiz] У яких словах -s звучить як /s/? Обери всі.
> level: A1 · type: multi · id: en-a1-final-consonants-q04
> - [x] books
> - [x] laughs
> - [ ] trees
> - [x] stops
> - [ ] kids
>
> **Пояснення:** /s/ — після глухих /p t k f θ/. *laugh* закінчується на звук /f/ (gh), тому *laughs* /lɑːfs/. *trees* і *kids* — /z/.

> [!quiz] Як англієць найчастіше розрізняє на слух bag і back?
> level: A1 · id: en-a1-final-consonants-q05
> - [ ] за першим звуком
> - [x] за довжиною голосного: перед дзвінким він довший
> - [ ] за наголосом
> - [ ] ніяк — ці слова звучать однаково
>
> **Пояснення:** кінцевий дзвінкий часто вимовляють неповністю, тож головна підказка — голосний: у *bag* він довший, у *back* коротший.

> [!quiz] Як вимовити Kate's?
> level: A1 · id: en-a1-final-consonants-q06
> - [x] /keɪts/
> - [ ] /keɪtz/
> - [ ] /ˈkeɪtɪz/
>
> **Пояснення:** присвійне *'s* підкоряється тим самим правилам: *Kate* закінчується на глухе /t/ → /s/. А *George's* — /ˈdʒɔːdʒɪz/, *Tom's* — /tɒmz/.

> [!quiz] Ти кажеш «айс» про колір очей: «She has blue ice». Що почує англієць?
> level: A1 · id: en-a1-final-consonants-q07
> - [ ] У неї блакитні очі.
> - [x] У неї блакитний лід.
> - [ ] У неї блакитні окуляри.
>
> **Пояснення:** *eyes* /aɪz/ — очі, *ice* /aɪs/ — лід. Дзвінке /z/ у кінці змінює все.

> [!quiz] Впиши вимову закінчення: s, z чи ɪz
> level: A1 · type: fill · id: en-a1-final-consonants-q08 · bank
>
> ```text fill
> cats    — /kæt[[s]]/
> dogs    — /dɒɡ[[z]]/
> boxes   — /ˈbɒks[[ɪz]]/
> plays   — /pleɪ[[z]]/
> ```

> [!quiz] Впиши вимову закінчення: s, z чи ɪz
> level: A1 · type: fill · id: en-a1-final-consonants-q09 · bank
>
> ```text fill
> waves   — /weɪv[[z]]/
> months  — /mʌnθ[[s]]/
> bridges — /ˈbrɪdʒ[[ɪz]]/
> locks   — /lɒk[[s]]/
> ```

> [!quiz] Склади речення «Вона миє посуд і дивиться телевізор»
> level: A1 · type: order · id: en-a1-final-consonants-q10
>
> ```text order
> She
> washes
> the
> dishes
> and
> watches
> TV.
> ```
>
> **Пояснення:** три слова з /ɪz/: *washes*, *dishes*, *watches* — усі після шиплячих.

> [!quiz] Склади транскрипцію слова buses зі звуків
> level: A1 · type: order · id: en-a1-final-consonants-q11
>
> ```text order
> ˈb
> ʌ
> s
> ɪ
> z
> ```
>
> **Пояснення:** /ˈbʌsɪz/ — *bus* + /ɪz/. Слово стало на склад довшим.

> [!quiz] Яке слово звучить з дзвінким кінцем?
> level: A1 · id: en-a1-final-consonants-q12
> - [ ] price
> - [ ] peace
> - [x] lose
> - [ ] loose
>
> **Пояснення:** *lose* /luːz/ — губити. *loose* /luːs/ — вільний. Написання тут не допомагає — допомагає транскрипція.

## Фішки

> [!reel] 🇺🇦 Українська вже вміє дзвінкі кінці
> На відміну від російської чи німецької, літературна українська не оглушує кінцеві приголосні: «дуб», «ніж», «сад». Тож для правильних *bag*, *bed*, *eyes* тобі не треба вчитися нового — лише не «загубити» свою звичку.

> [!reel] 🧩 Одне правило на чотири граматики
> /s/ — /z/ — /ɪz/ працює однаково для множини (*cats*), третьої особи (*works*), присвійного (*Kate's*) і скорочення *is/has* (*it's*). Вивчив раз — користуєшся всюди. А -ed має схоже правило: /t/ — /d/ — /ɪd/.

> [!reel] 👀 Чому eyes, а не «айс»
> Слово *eyes* пишеться з s, але звучить /aɪz/ — бо -s після голосного завжди дзвінке. Тому й *says* /sez/, *is* /ɪz/, *was* /wɒz/: майже кожне «с» у кінці коротких слів насправді дзижчить.

## Джерела та що почитати

- [BBC Learning English — Pronunciation: -s endings](https://www.bbc.co.uk/learningenglish/english/features/pronunciation) — відео про /s z ɪz/.
- [British Council LearnEnglish — Plural nouns](https://learnenglish.britishcouncil.org/grammar/a1-a2-grammar/nouns-singular-and-plural) — множина іменників з вимовою.
- [Cambridge Dictionary](https://dictionary.cambridge.org/) — слухай пари *bag / back*, *prize / price*.
- P. Roach — *English Phonetics and Phonology*: розділ про fortis / lenis і скорочення голосних (pre-fortis clipping).

> [!important] Підсумок
> - Дзвінкий кінець змінює слово: *bag — back*, *eyes — ice*, *prize — price*.
> - Перед дзвінким голосний **довший**, перед глухим — коротший: тренуй обидва сигнали.
> - Без зайвого голосного в кінці: *dog*, а не «дог-у».
> - -s: /s/ після глухих (*cats*), /z/ після дзвінких і голосних (*dogs*, *plays*), /ɪz/ після шиплячих (*buses*, *pages*).
> - Те саме правило — для he/she/it (*watches*), присвійного *'s* і скорочень (*it's*, *he's*).
