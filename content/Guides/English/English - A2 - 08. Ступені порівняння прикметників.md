---
title: Ступені порівняння прикметників
order: 208
id: en-a2-comparison
level: A2
icon: px:scales
tags: [english, a2, grammar, comparatives, superlatives, adjectives]
prerequisites: ["[[English - A2 - 01. Was і were — минуле дієслова to be]]", "[[English - A1 - 08. Сімʼя, люди й зовнішність]]"]
estimatedMinutes: 40
---

# Ступені порівняння прикметників

> [!success] Після цієї теми ти зможеш
> - порівняти дві речі: *cheaper than, more comfortable than, better than*;
> - назвати найкраще й найгірше: *the cheapest, the most popular, the best day of my life*;
> - сказати «такий самий» і «не такий»: *as fast as, not as big as, the same as*;
> - уточнити різницю: *much bigger, a bit cheaper, slightly older*;
> - не помилитися з неправильними формами *good — better — best, bad — worse — worst*.

## Передбач

> [!quiz] Як сказати «Мій брат вищий за мене»?
> level: A2 · id: en-a2-comparison-q01
> - [ ] My brother is more tall than me.
> - [ ] My brother is taller that me.
> - [x] My brother is taller than me.
> - [ ] My brother is tallest than me.
>
> **Пояснення:** короткий прикметник отримує **-er**, а «ніж / за» — це **than**. *That* — зовсім інше слово («що, той»).

## Простими словами

Українською ми теж маємо три сходинки: *дешевий → дешевший → найдешевший*. Англійська будує їх двома способами, і вибір залежить від **довжини слова**:

- **короткі** слова (один склад, або два з *-y* в кінці) приклеюють закінчення: *cheap → cheap**er** → the cheap**est***;
- **довгі** слова (два склади й більше) ставлять перед собою слово: *expensive → **more** expensive → **the most** expensive*.

Логіка проста: до короткого слова ще можна щось дописати, а *expensiveer* язик уже не витягне.

> [!diagram] Три телефони — три сходинки
> ```yaml
> layout: flow
> nodes:
>   - { id: a, label: "£300", text: "an expensive phone", note: "звичайна форма", tone: red }
>   - { id: b, label: "£200", text: "cheaper than A", note: "порівняльна: -er + than", tone: yellow }
>   - { id: c, label: "£100", text: "the cheapest", note: "найвища: the + -est", tone: green }
> edges:
>   - { from: a, to: b, label: "−£100" }
>   - { from: b, to: c, label: "−£100" }
> steps:
>   - { focus: a, note: "Телефон за £300 — expensive. Це просто опис, без порівняння." }
>   - { move: { from: a, to: b, value: "cheap + er" }, note: "Порівнюємо два: B is cheaper than A. Короткий прикметник + -er, далі than." }
>   - { move: { from: b, to: c, value: "the + cheap + est" }, note: "Серед трьох (чи більше) — the cheapest. Артикль the обовʼязковий: найдешевший лише один." }
>   - { focus: [a, b, c], set: { a: "the most expensive" }, note: "А для довгого слова — more / the most: A is the most expensive phone." }
> ```

## Пояснення

### Як утворити форми

| Прикметник | Правило | Порівняльний | Найвищий |
|---|---|---|---|
| 1 склад | **+ -er / -est** | cheap → cheap**er** | the cheap**est** |
| закінчується на **-e** | **+ -r / -st** | nice → nice**r** | the nice**st** |
| короткий «приголосний-голосний-приголосний» | **подвоїти** | big → bi**gg**er, hot → ho**tt**er | the bi**gg**est |
| 2 склади на **-y** | **y → i** | easy → eas**ier**, busy → bus**ier** | the eas**iest** |
| 2+ склади | **more / the most** | modern → **more** modern | **the most** modern |

Деякі двоскладові приймають обидва способи: *quiet, clever, simple, narrow* → *quieter* і *more quiet*. Якщо сумніваєшся — *more* майже завжди зрозумілий, а от *expensiver* — ніколи.

> [!quiz] Перевір себе: правопис
> level: A2 · type: fill · bank: biger, easyer · id: en-a2-comparison-q02
>
> ```text fill
> big → [[bigger]]
> easy → [[easier]]
> nice → [[nicer]]
> hot → [[hotter]]
> ```
>
> **Пояснення:** *big, hot* — подвоєння кінцевого приголосного; *easy* — *y → i*; *nice* — уже є *-e*, додаємо лише *-r*.

### Неправильні форми

| | Порівняльний | Найвищий |
|---|---|---|
| **good** — добрий | **better** | **the best** |
| **bad** — поганий | **worse** | **the worst** |
| **far** — далекий | **further** / **farther** | **the furthest** / **the farthest** |
| many / much — багато | **more** | **the most** |
| little — мало | **less** | **the least** |

> [!diagram] Короткі проти довгих
> ```yaml
> layout: compare
> columns: { short: "Короткі: -er / -est", long: "Довгі: more / the most" }
> nodes:
>   - { id: s1, col: short, text: "fast → faster → the fastest" }
>   - { id: s2, col: short, text: "big → bigger → the biggest", note: "подвоєння" }
>   - { id: s3, col: short, text: "happy → happier → the happiest", note: "y → i" }
>   - { id: l1, col: long, text: "modern → more modern → the most modern", tone: violet }
>   - { id: l2, col: long, text: "comfortable → more comfortable → the most comfortable", tone: violet }
>   - { id: l3, col: long, text: "good → better → the best", note: "неправильне — просто запамʼятай", tone: orange }
> steps:
>   - { show: [s1, s2, s3], note: "Ліворуч — короткі слова: приклеюємо -er / -est, стежимо за правописом." }
>   - { show: [l1, l2], note: "Праворуч — довгі: слово не змінюється, перед ним more / the most." }
>   - { show: l3, note: "І кілька винятків, які не підкоряються жодному правилу: good, bad, far." }
> ```

> [!quiz] Перевір себе: -er чи more?
> level: A2 · id: en-a2-comparison-q03
>
> *The book is ___ than the film.*
>
> - [ ] interestinger
> - [x] more interesting
> - [ ] most interesting
> - [ ] more interestinger
>
> **Пояснення:** *interesting* — чотири склади, тому **more interesting**. Подвійне *more … -er* — помилка.

### Than, as … as, the same as

- **than** — «ніж, за»: *Kyiv is bigger **than** Lviv.* Після *than* у розмові — *me, him, her*: *She's older than **me**.* (офіційніше — *than I am*).
- **as … as** — «такий самий, як»: *My bag is **as heavy as** yours.*
- **not as … as** — «не такий, як»: *Lviv is**n't as big as** Kyiv.* Часто ввічливіше, ніж *smaller*.
- **the same as** / **similar to** / **different from**: *Your phone is **the same as** mine.*

### Наскільки: much, a bit, slightly

Перед порівняльною формою можна сказати, **наскільки** більше:

- велика різниця — **much / a lot / far**: *much cheaper, a lot bigger, far better*;
- маленька — **a bit / slightly**: *a bit older, slightly more expensive*.

*Very* тут не працює: не «very bigger», а ***much bigger***.

### Найвищий ступінь: the … in / of

- **in** + місце або група: *the tallest building **in** the world, the best student **in** my class*;
- **of** + період або кількість: *the best day **of** my life, the cheapest **of** the three*;
- **one of the** + множина: *one of the most popular **cities** in Europe.*

> [!quiz] Перевір себе: in чи of?
> level: A2 · id: en-a2-comparison-q04
>
> *Burj Khalifa is the tallest building ___ the world.*
>
> - [x] in
> - [ ] of
> - [ ] than
> - [ ] from
>
> **Пояснення:** *the world* — місце → **in**. *Of* — для періоду чи групи предметів: *the best day of the year*.

## Приклади

- *My new flat is much bigger than the old one.* — Моя нова квартира набагато більша за стару.
- *The train is faster, but the bus is cheaper.* — Поїзд швидший, але автобус дешевший.
- *This is the most comfortable chair in the house.* — Це найзручніше крісло в домі.
- *Today was the worst day of the week.* — Сьогодні був найгірший день тижня.
- *She isn't as tall as her sister.* — Вона не така висока, як сестра.
- *Your English is better than mine!* — Твоя англійська краща за мою!
- *It's a bit warmer today than yesterday.* — Сьогодні трохи тепліше, ніж учора.
- *Lisbon is one of the most popular destinations in Europe.* — Лісабон — один з найпопулярніших напрямків у Європі.
- *My phone is the same as yours.* — У мене такий самий телефон, як у тебе.
- *The second hotel was slightly more expensive.* — Другий готель був трохи дорожчий.

## Слова

> [!word] comfortable
> ipa: /ˈkʌmf.tə.bəl/ · ipa-us: /ˈkʌmf.tɚ.bəl/ · pos: adj · level: A2 · id: en-a2-comparison-w01
> uk: зручний, комфортний
> example: These shoes are **more comfortable** than my old ones. — Ці черевики зручніші за мої старі.
> note: вимовляється три склади: КАМФ-те-бл, «-for-» ковтається.

> [!word] convenient
> ipa: /kənˈviː.ni.ənt/ · pos: adj · level: A2 · id: en-a2-comparison-w02
> uk: зручний (за часом, розташуванням)
> example: The flat is very **convenient** — the metro is next door. — Квартира дуже зручна: метро поруч.
> note: comfortable — фізично зручний (крісло); convenient — зручний для планів (час, місце).

> [!word] dangerous
> ipa: /ˈdeɪn.dʒər.əs/ · pos: adj · level: A2 · id: en-a2-comparison-w03
> uk: небезпечний
> example: Motorbikes are **more dangerous** than cars. — Мотоцикли небезпечніші за автомобілі.

> [!word] safe
> ipa: /seɪf/ · pos: adj · level: A2 · id: en-a2-comparison-w04
> uk: безпечний
> example: It's one of **the safest** cities in the world. — Це одне з найбезпечніших міст у світі.

> [!word] modern
> ipa: /ˈmɒd.ən/ · ipa-us: /ˈmɑː.dɚn/ · pos: adj · level: A2 · id: en-a2-comparison-w05
> uk: сучасний
> example: The new station is much **more modern**. — Новий вокзал набагато сучасніший.
> note: наголос на перший склад: МО-дн, не «мо-ДЕРН».

> [!word] ancient
> ipa: /ˈeɪn.ʃənt/ · pos: adj · level: A2 · id: en-a2-comparison-w06
> uk: стародавній, античний
> example: Rome is one of **the most ancient** cities in Europe. — Рим — одне з найдавніших міст Європи.

> [!word] huge
> ipa: /hjuːdʒ/ · pos: adj · level: A2 · id: en-a2-comparison-w07
> uk: величезний
> example: Their new house is **huge**! — Їхній новий будинок величезний!
> note: «дуже великий» уже сам по собі, тож very huge не кажуть — absolutely huge.

> [!word] narrow
> ipa: /ˈnær.əʊ/ · ipa-us: /ˈner.oʊ/ · pos: adj · level: A2 · id: en-a2-comparison-w08
> uk: вузький
> example: The streets in the old town are very **narrow**. — Вулиці в старому місті дуже вузькі.

> [!word] deep
> ipa: /diːp/ · pos: adj · level: A2 · id: en-a2-comparison-w09
> uk: глибокий
> example: Lake Baikal is **the deepest** lake in the world. — Байкал — найглибше озеро у світі.

> [!word] heavy
> ipa: /ˈhev.i/ · pos: adj · level: A2 · id: en-a2-comparison-w10
> uk: важкий (вагою); сильний (дощ, рух)
> example: My suitcase is **heavier** than yours. — Моя валіза важча за твою.

> [!word] wet
> ipa: /wet/ · pos: adj · level: A2 · id: en-a2-comparison-w11
> uk: мокрий; дощовий
> example: This summer was **wetter** than last year. — Це літо було дощовішим, ніж торік.

> [!word] dry
> ipa: /draɪ/ · pos: adj · level: A2 · id: en-a2-comparison-w12
> uk: сухий
> example: The south is **drier** than the north. — Південь посушливіший за північ.
> note: dry → drier → the driest (y → i).

> [!word] shallow
> ipa: /ˈʃæl.əʊ/ · ipa-us: /ˈʃæl.oʊ/ · pos: adj · level: A2 · id: en-a2-comparison-w13
> uk: мілкий, неглибокий
> example: The water is **shallower** near the beach. — Біля пляжу вода мілкіша.
> note: протилежне — deep.

> [!word] polite
> ipa: /pəˈlaɪt/ · pos: adj · level: A2 · id: en-a2-comparison-w14
> uk: ввічливий
> example: Could you… is **more polite** than Can you… — «Could you…» ввічливіше, ніж «Can you…».

> [!word] popular
> ipa: /ˈpɒp.jə.lə/ · ipa-us: /ˈpɑː.pjə.lɚ/ · pos: adj · level: A2 · id: en-a2-comparison-w15
> uk: популярний
> example: Football is **the most popular** sport in the UK. — Футбол — найпопулярніший спорт у Британії.

> [!word] similar
> ipa: /ˈsɪm.ɪ.lə/ · ipa-us: /ˈsɪm.ə.lɚ/ · pos: adj · level: A2 · id: en-a2-comparison-w16
> uk: схожий
> example: Ukrainian is **similar to** Polish. — Українська схожа на польську.
> note: similar **to**, не «similar on / with».

> [!word] useful
> ipa: /ˈjuːs.fəl/ · pos: adj · level: A2 · id: en-a2-comparison-w17
> uk: корисний
> example: This app is **more useful** than a paper map. — Цей застосунок корисніший за паперову карту.
> note: корисний для здоровʼя — healthy, а не useful.

> [!word] tiny
> ipa: /ˈtaɪ.ni/ · pos: adj · level: A2 · id: en-a2-comparison-w18
> uk: крихітний
> example: Our hotel room was **tiny**. — Наш номер у готелі був крихітний.
> note: tiny → tinier → the tiniest (y → i).

> [!word] valuable
> ipa: /ˈvæl.ju.ə.bəl/ · pos: adj · level: A2 · id: en-a2-comparison-w19
> uk: цінний
> example: This is **the most valuable** painting in the museum. — Це найцінніша картина в музеї.

> [!word] than
> ipa: /ðæn/ · pos: conj · level: A2 · id: en-a2-comparison-w20
> uk: ніж, за (у порівнянні)
> example: Cats sleep more **than** dogs. — Коти сплять більше, ніж собаки.
> note: у реченні звучить слабко — /ðən/. Не плутай з then (потім) і that.

> [!word] as … as
> ipa: /əz … əz/ · pos: phrase · level: A2 · id: en-a2-comparison-w21
> uk: такий самий … як
> example: The film was **as good as** the book. — Фільм був такий самий гарний, як книжка.
> note: not as … as — не такий … як; twice as … as — удвічі більш…

> [!word] the same as
> ipa: /ðə ˈseɪm əz/ · pos: phrase · level: A2 · id: en-a2-comparison-w22
> uk: такий самий, як; той самий, що
> example: My birthday is **the same as** my dad's. — У мене день народження того ж дня, що й у тата.
> note: the same **as**, не «the same like».

> [!word] slightly
> ipa: /ˈslaɪt.li/ · pos: adv · level: A2 · id: en-a2-comparison-w23
> uk: трохи, дещо
> example: The second flat was **slightly** bigger. — Друга квартира була трохи більша.

> [!word] a bit
> ipa: /ə ˈbɪt/ · pos: phrase · level: A2 · id: en-a2-comparison-w24
> uk: трохи
> example: Can you speak **a bit** slower, please? — Можете говорити трохи повільніше?

> [!word] tidy
> ipa: /ˈtaɪ.di/ · pos: adj · level: A2 · id: en-a2-comparison-w25
> uk: охайний, прибраний
> example: My room is **tidier** than my brother's. — У моїй кімнаті охайніше, ніж у брата.
> note: tidy → tidier → the tidiest (y → i). Протилежне — messy.

## Слухаємо

> [!listen] Що ти почув?
> level: A2 · type: choice · id: en-a2-comparison-l01
> audio: It's much better than mine.
> - [ ] It's much bigger than mine.
> - [x] It's much better than mine.
> - [ ] It's a bit better than mine.

> [!listen] Що ти почув?
> level: A2 · type: choice · id: en-a2-comparison-l02
> audio: She isn't as tall as her brother.
> - [ ] She's as tall as her brother.
> - [x] She isn't as tall as her brother.
> - [ ] She's taller than her brother.

> [!listen] Надрукуй почуте
> level: A2 · type: dictation · id: en-a2-comparison-l03
> audio: This is the most comfortable chair in the house.

> [!listen] Чому Ліам обрав квартиру на Green Street?
> level: A2 · type: answer · id: en-a2-comparison-l04
> audio: A: So which flat did you choose in the end, Liam?
> audio: B: The one on Green Street. It's a bit smaller than the other one, but it's much cheaper, and it's closer to my work.
> - [ ] Вона більша й сучасніша
> - [x] Вона дешевша й ближча до роботи
> - [ ] Вона найдешевша в місті
> - [ ] Вона така сама, як інша

> [!listen] Скільки їхати поїздом?
> level: A2 · type: answer · id: en-a2-comparison-l05
> audio: A: Is the train faster than the bus?
> audio: B: Yes, it is. The bus takes three hours and the train only takes two. But the train is twice as expensive.
> - [ ] Три години
> - [x] Дві години
> - [ ] Удвічі довше, ніж автобусом
> - [ ] Так само, як автобусом

## Вимова

> [!speak] Скажи вголос
> level: A2 · id: en-a2-comparison-s01
> text: It's cheaper than the other one.
> ipa: /ɪts ˈtʃiː.pə ðən ði ˈʌð.ə wʌn/
> tip: -er в кінці — нейтральне /ə/, без «р» (у британській). than — слабке /ðən/.

> [!speak] Скажи вголос
> level: A2 · id: en-a2-comparison-s02
> text: She's as tall as her brother.
> ipa: /ʃiz əz ˈtɔːl əz hə ˈbrʌð.ə/
> tip: обидва as — коротке /əz/; наголос лише на tall і brother.

> [!speak] Скажи вголос
> level: A2 · id: en-a2-comparison-s03
> text: This is the best day of my life!
> ipa: /ðɪs ɪz ðə ˈbest ˈdeɪ əv maɪ ˈlaɪf/
> tip: of — слабке /əv/. Покажи емоцію: голос високо на best, униз на life.

> [!speak] Скажи вголос
> level: A2 · id: en-a2-comparison-s04
> text: My new flat is much bigger.
> ipa: /maɪ ˌnjuː ˈflæt ɪz ˈmʌtʃ ˈbɪɡ.ə/
> tip: flat — відкрите /æ/, рот ширше, ніж для «е». bigger — ДВА g на письмі, але один звук.

> [!speak] Скажи вголос
> level: A2 · id: en-a2-comparison-s05
> text: It's the most expensive hotel in the city.
> ipa: /ɪts ðə ˌməʊst ɪkˈspen.sɪv həʊˈtel ɪn ðə ˈsɪt.i/
> tip: hotel — наголос на другий склад: хоу-ТЕЛ. expensive — ік-СПЕН-сів.

> [!speak] Скажи вголос
> level: A2 · id: en-a2-comparison-s06
> text: The weather is worse than yesterday.
> ipa: /ðə ˈweð.ər ɪz ˈwɜːs ðən ˈjes.tə.deɪ/
> tip: worse — /wɜːs/, як у word, а не «ворс». weather is — r звучить, бо далі голосний.

## Типові помилки українців

> [!pitfall] «More better», «the most good», «very bigger»
> Одна позначка порівняння на слово: або *-er*, або *more*: ***better***, не «more better»; ***the best***, не «the most good». І посилюємо не *very*, а ***much / a lot / far***: *much bigger*.

> [!pitfall] «Taller that me», «the same like»
> «Ніж» — це ***than*** /ðən/, а не *that* і не *then*. «Такий самий, як» — ***the same as***: *My phone is the same as yours.*

> [!pitfall] «The best of the world», «similar on»
> Для місць — ***in***: *the best restaurant **in** the city, the tallest **in** the world*. *Of* — для періоду й групи: *the best day **of** my life*. А «схожий на» — ***similar to***.

## Практика

> [!quiz] Встав порівняльну форму
> level: A2 · type: fill · bank: gooder, badder · id: en-a2-comparison-q05
>
> ```text fill
> This café is [[better]] than the one near my office. (good)
> The traffic today is [[worse]] than yesterday. (bad)
> My grandparents live [[further|farther]] from the city than we do. (far)
> ```
>
> **Пояснення:** *good → better, bad → worse, far → further / farther* — неправильні форми, їх просто запамʼятовуємо.

> [!quiz] Склади речення: «Львів не такий великий, як Київ»
> level: A2 · type: order · id: en-a2-comparison-q06
>
> ```text order
> Lviv
> isn't
> as big
> as Kyiv.
> than Kyiv. // ✗
> ```
>
> **Пояснення:** *not as … as* — «не такий … як». *Than* стоїть лише після порівняльної форми (*bigger than*).

> [!quiz] Обери правильне посилення
> level: A2 · id: en-a2-comparison-q07
>
> *The new phone is ___ than the old one — almost twice the price.*
>
> - [ ] very more expensive
> - [x] much more expensive
> - [ ] more much expensive
> - [ ] most expensive
>
> **Пояснення:** велику різницю показуємо **much** перед *more expensive*. *Very* з порівняльною формою не вживається.

> [!quiz] Обери всі правильні речення
> level: A2 · id: en-a2-comparison-q08
> - [x] My sister is younger than me.
> - [ ] This is the most cheap hotel.
> - [x] It's one of the oldest buildings in the city.
> - [ ] Today is more hot than yesterday.
> - [x] Is Polish similar to Ukrainian?
>
> **Пояснення:** *cheap* і *hot* — короткі: *the cheapest*, *hotter*. Інші речення правильні: *one of the + множина*, *similar to*.

> [!quiz] Встав найвищий ступінь
> level: A2 · type: fill · id: en-a2-comparison-q09
>
> ```text fill
> We stayed in [[the cheapest]] hostel in the city. (cheap)
> This is [[the most comfortable]] sofa in the shop. (comfortable)
> It was [[the best]] holiday of my life. (good)
> ```
>
> **Пояснення:** найвищий ступінь — завжди з **the**: *the cheapest*, *the most comfortable*, *the best*.

> [!quiz] Встав пропущене слово
> level: A2 · id: en-a2-comparison-q10
>
> *Your bag is the same ___ mine!*
>
> - [ ] like
> - [x] as
> - [ ] than
> - [ ] that
>
> **Пояснення:** сталий вираз — ***the same as***. *Like* тут — калька з «такий, як».

> [!quiz] Склади речення: «Це був найкращий день у моєму житті»
> level: A2 · type: order · id: en-a2-comparison-q11
>
> ```text order
> It
> was
> the best day
> of my life.
> the goodest day // ✗
> ```
>
> **Пояснення:** *good → better → the best*. «Життя» як період → *of my life*.

> [!quiz] Який варіант правильний?
> level: A2 · id: en-a2-comparison-q12
>
> *The airport is ___ from the city centre than the station.*
>
> - [ ] farer
> - [x] further
> - [ ] more far
> - [ ] farest
>
> **Пояснення:** *far* — неправильний: *further / farther*. *Farer* і *more far* не існують.

> [!quiz] Встав as … as
> level: A2 · type: fill · bank: than · id: en-a2-comparison-q13
>
> ```text fill
> The train ticket is twice [[as]] expensive [[as]] the bus ticket.
> I'm not [[as]] fit [[as]] I was ten years ago.
> ```
>
> **Пояснення:** *as + прикметник + as*; «удвічі дорожчий» — *twice as expensive as*. *Than* сюди не підходить.

> [!quiz] «She isn't as old as she looks». Що це означає?
> level: A2 · id: en-a2-comparison-q14
> - [ ] Вона старша, ніж здається.
> - [x] Вона молодша, ніж здається.
> - [ ] Вона виглядає на свій вік.
> - [ ] Вона така ж стара, як її подруга.
>
> **Пояснення:** *not as old as she looks* — «не така стара, як виглядає», тобто насправді молодша.

## Фішки

> [!reel] 🎭 «The most unkindest cut» — Шекспіру можна
> У «Юлії Цезарі» Шекспір пише the most unkindest cut of all — подвійний ступінь. У XVI столітті так казали для емоції. Тобі на іспиті — не можна: тільки the unkindest.

> [!reel] 🏆 Good, better, best — три різні корені
> Як go — went, так і good — better — best: форми прийшли з різних слів. Better і best — родичі німецьких besser і best, а не слова good.

> [!reel] 🗺️ Further чи farther?
> Для відстані американці кажуть farther, британці — further (farther теж можна). Для «додатковий» — лише further: further information — додаткова інформація.

## Джерела та що почитати

- 🟢 R. Murphy — *Essential Grammar in Use* (Cambridge): розділи про *older than*, *not as … as* і *the oldest*.
- 🟢 [Cambridge Dictionary — Comparison: adjectives](https://dictionary.cambridge.org/grammar/british-grammar/comparison-adjectives-bigger-biggest-more-and-most) — правила, правопис, винятки.
- 🟡 [Cambridge Dictionary — As … as](https://dictionary.cambridge.org/grammar/british-grammar/as-as) — порівняння рівності й *twice as … as*.
- 🟡 [BBC Learning English](https://www.bbc.co.uk/learningenglish) — короткі уроки й вправи на comparatives.

> [!important] Підсумок
> - Короткі прикметники: **-er / the -est** (*cheaper, the cheapest*; *bigger, easier*).
> - Довгі: **more / the most** (*more comfortable, the most popular*).
> - Неправильні: *good → better → best, bad → worse → worst, far → further → furthest*.
> - *Than* — «ніж»; *as … as* — «такий самий»; *not as … as* — «не такий»; *the same as*.
> - Посилення: *much / a lot / far* (велика різниця), *a bit / slightly* (мала); не *very*.
> - *The … **in*** + місце, *the … **of*** + період або група.
