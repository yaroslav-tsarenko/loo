---
title: Числа, вік і номер телефону
order: 104
id: en-a1-numbers
level: A1
icon: px:abacus
tags: [english, a1, vocabulary, numbers, age, phone]
prerequisites: ["[[English - A1 - 03. Дієслово to be — am, is, are]]"]
estimatedMinutes: 35
---

# Числа, вік і номер телефону

> [!success] Після цієї теми ти зможеш
> - рахувати від 0 до 100 і називати сотні й тисячі: *two hundred and fifty, three thousand*;
> - на слух розрізняти *thirteen* і *thirty*, *fifteen* і *fifty*;
> - спитати й назвати вік: *How old are you? — I'm 25.*;
> - продиктувати й записати номер телефону: *oh, double seven…*

## Передбач

> [!quiz] Як англійською сказати «Мені 30 років»?
> level: A1 · id: en-a1-numbers-q01
> - [ ] I have 30 years.
> - [ ] I have 30.
> - [x] I'm 30.
> - [ ] I'm 30 years.
>
> **Пояснення:** вік — це не те, що ти «маєш», а те, чим ти «є»: *I'm 30* або повніше *I'm 30 years old*. «I'm 30 years» без *old* — помилка, а «I have 30 years» — найпоширеніша калька в українців.

## Від 0 до 12 — просто вивчити

Перші дванадцять чисел не підкоряються жодній схемі — їх треба запамʼятати, як імена друзів.

| | | | |
|---|---|---|---|
| 0 zero | 1 one | 2 two | 3 three |
| 4 four | 5 five | 6 six | 7 seven |
| 8 eight | 9 nine | 10 ten | 11 eleven |
| 12 twelve | | | |

## 13–19 і десятки: -teen проти -ty

Від 13 до 19 додаємо **-teen**, а десятки утворюємо з **-ty**. Звучать вони схоже, і саме тут ховається головна пастка на слух — **наголос**.

| -teen (наголос у кінці) | | -ty (наголос на початку) | |
|---|---|---|---|
| 13 thir**TEEN** | /ˌθɜːˈtiːn/ | 30 **THIR**ty | /ˈθɜːti/ |
| 14 four**TEEN** | /ˌfɔːˈtiːn/ | 40 **FOR**ty | /ˈfɔːti/ |
| 15 fif**TEEN** | /ˌfɪfˈtiːn/ | 50 **FIF**ty | /ˈfɪfti/ |
| 16 six**TEEN** | /ˌsɪksˈtiːn/ | 60 **SIX**ty | /ˈsɪksti/ |
| 17 seven**TEEN** | /ˌsevnˈtiːn/ | 70 **SEV**enty | /ˈsevnti/ |
| 18 eigh**TEEN** | /ˌeɪˈtiːn/ | 80 **EIGH**ty | /ˈeɪti/ |
| 19 nine**TEEN** | /ˌnaɪnˈtiːn/ | 90 **NINE**ty | /ˈnaɪnti/ |
| | | 20 **TWEN**ty | /ˈtwenti/ |

> [!diagram] thirteen чи thirty — слухай наголос
> ```yaml
> layout: compare
> columns: { teen: "13 thirteen", ty: "30 thirty" }
> nodes:
>   - { id: t1, col: teen, label: "склад 1", text: "thir", tone: gray }
>   - { id: t2, col: teen, label: "склад 2", text: "TEEN", tone: violet, note: "довге /iː/ + чітке n" }
>   - { id: y1, col: ty, label: "склад 1", text: "THIR", tone: violet }
>   - { id: y2, col: ty, label: "склад 2", text: "ty", tone: gray, note: "коротке, швидке" }
> steps:
>   - { focus: [t1, y1], note: "Початок однаковий — thir. За першим складом їх не розрізнити." }
>   - { focus: t2, note: "У thirteen голос підіймається на TEEN: довге «тіі-н» з чітким n у кінці." }
>   - { focus: y1, note: "У thirty сильний перший склад — THIR, а ty коротке й легке, без n." }
>   - { focus: [t2, y2], note: "Правило для слуху: чуєш довге «тіін» у кінці — це 13–19. Коротке «ті» — 30, 40, 50…" }
> ```
> Те саме для 14 / 40, 15 / 50 … 19 / 90.

> [!warning] Правопис-пастки
> **fifteen, fifty** (не «fiveteen»), **eighteen** (одне t), **forty** (без u, хоча *four* і *fourteen* — з u), **twelve** (а не «twoteen»).

## 21–99: десяток + дефіс + одиниці

Двоцифрові числа будуємо, як в українській: десяток, потім одиниці — і пишемо через **дефіс**.

| Число | Англійською |
|---|---|
| 21 | twenty-one |
| 35 | thirty-five |
| 48 | forty-eight |
| 99 | ninety-nine |

## Сотні, тисячі, мільйони

| Число | Британська | Американська |
|---|---|---|
| 100 | a hundred / one hundred | a hundred / one hundred |
| 105 | a hundred **and** five | a hundred (and) five |
| 250 | two hundred **and** fifty | two hundred (and) fifty |
| 1,000 | a thousand | a thousand |
| 3,600 | three thousand six hundred | three thousand six hundred |
| 2,026 | two thousand **and** twenty-six | two thousand twenty-six |
| 1,000,000 | a million | a million |

- У британській після сотень перед десятками/одиницями ставлять **and**: *three hundred and twelve*. У США його часто пропускають.
- *Hundred, thousand, million* після числа **без -s**: *two hundred, five thousand*. З -s лише «сотні / тисячі» взагалі: *hundreds of people* — сотні людей.

> [!diagram] Читаємо 2,345 частинами
> ```yaml
> layout: flow
> nodes:
>   - { id: num, label: "число", text: "2,345", tone: blue, icon: "px:abacus" }
>   - { id: th, label: "тисячі", text: "?", tone: violet }
>   - { id: hu, label: "сотні", text: "?", tone: mint }
>   - { id: rest, label: "and + решта", text: "?", tone: green }
> steps:
>   - { focus: num, note: "Кома в 2,345 — це не дріб, а роздільник тисяч (в українській тут пробіл: 2 345)." }
>   - { move: { from: num, to: th, value: "2" }, set: { th: "two thousand" }, note: "Усе до коми — тисячі: two thousand. Без -s!" }
>   - { move: { from: th, to: hu, value: "3" }, set: { hu: "three hundred" }, note: "Наступна цифра — сотні: three hundred." }
>   - { move: { from: hu, to: rest, value: "45" }, set: { rest: "and forty-five" }, note: "Решту читаємо як звичайне двоцифрове число, з and перед ним (британський варіант)." }
>   - { focus: [th, hu, rest], note: "Разом: two thousand three hundred and forty-five." }
> ```

> [!tip] Кома і крапка навпаки
> Англійською **1,500** — тисяча пʼятсот, а **1.5** — півтора (*one point five*). В українській навпаки: 1 500 і 1,5. Переплутаєш — і ціна стане в тисячу разів більшою!

## Вік

| Питання / відповідь | Переклад |
|---|---|
| How old are you? | Скільки тобі років? |
| I'm 19. / I'm 19 years old. | Мені 19. |
| How old is your son? — He's six. | Скільки років твоєму синові? — Шість. |
| My grandma is ninety-two. | Моїй бабусі девʼяносто два. |
| a 10-year-old girl | десятирічна дівчинка |

Вік — завжди через **be** (*am / is / are*), бо в англійській вік — це стан, «яким ти є», а не річ, яку ти «маєш».

## Номер телефону

Номер телефону англійською читають **по одній цифрі** й роблять паузи між групами.

| Як записано | Як читають (UK) | Примітка |
|---|---|---|
| 0 | oh | у номерах британці кажуть «оу»; у США — zero |
| 77 | double seven | дві однакові поспіль — double; у США частіше seven seven |
| 777 | seven double seven *або* triple seven | |
| 020 7946 0018 | oh two oh, seven nine four six, oh oh one eight | паузи між групами |

| Фраза | Переклад |
|---|---|
| What's your phone number? | Який у тебе номер телефону? |
| It's 067 225 8143. | Мій номер — 067 225 8143. |
| Can you say that again, please? | Можете повторити, будь ласка? |
| Call me on 0771 234 567. (UK) / Call me at… (US) | Подзвони мені на номер… |

## Приклади

- I'm twenty-three years old. — Мені двадцять три роки.
- My dad is fifty and my mum is forty-eight. — Татові пʼятдесят, а мамі сорок вісім.
- There are thirty students in the group. — У групі тридцять студентів.
- The ticket is fifteen euros. — Квиток коштує пʼятнадцять євро.
- Kyiv is about 1,500 years old. — Києву близько 1 500 років.
- My phone number is oh nine seven, double five, two eight one. — Мій номер — 097 55 281.
- Room one hundred and twelve is on the first floor. — Кімната сто дванадцять на другому поверсі (британський first floor — це наш другий поверх).
- About two hundred people work here. — Тут працює близько двохсот людей.

## Слова

> [!word] zero
> ipa: /ˈzɪərəʊ/ · ipa-us: /ˈzɪroʊ/ · pos: noun · level: A1 · id: en-a1-numbers-w01
> uk: нуль
> example: It's **zero** degrees outside. — Надворі нуль градусів.
> note: у номерах телефону британці кажуть oh /əʊ/.

> [!word] one
> ipa: /wʌn/ · pos: noun · level: A1 · id: en-a1-numbers-w02
> uk: один
> example: I have **one** sister. — У мене одна сестра.
> note: читається «ван», а не «оне».

> [!word] two
> ipa: /tuː/ · pos: noun · level: A1 · id: en-a1-numbers-w03
> uk: два
> example: **Two** coffees, please. — Дві кави, будь ласка.
> note: звучить так само, як to і too.

> [!word] three
> ipa: /θriː/ · pos: noun · level: A1 · id: en-a1-numbers-w04
> uk: три
> example: The lesson is **three** hours long. — Урок триває три години.
> note: /θ/ — язик між зубами, не «срі» і не «фрі».

> [!word] four
> ipa: /fɔː/ · ipa-us: /fɔːr/ · pos: noun · level: A1 · id: en-a1-numbers-w05
> uk: чотири
> example: We are a family of **four**. — Нас у родині четверо.

> [!word] five
> ipa: /faɪv/ · pos: noun · level: A1 · id: en-a1-numbers-w06
> uk: пʼять
> example: The shop opens at **five**. — Магазин відкривається о пʼятій.

> [!word] six
> ipa: /sɪks/ · pos: noun · level: A1 · id: en-a1-numbers-w07
> uk: шість
> example: My son is **six**. — Моєму синові шість.

> [!word] seven
> ipa: /ˈsevn/ · pos: noun · level: A1 · id: en-a1-numbers-w08
> uk: сім
> example: There are **seven** days in a week. — У тижні сім днів.

> [!word] eight
> ipa: /eɪt/ · pos: noun · level: A1 · id: en-a1-numbers-w09
> uk: вісім
> example: I get up at **eight**. — Я встаю о восьмій.
> note: gh не читається: «ейт».

> [!word] nine
> ipa: /naɪn/ · pos: noun · level: A1 · id: en-a1-numbers-w10
> uk: девʼять
> example: Call me after **nine**. — Подзвони мені після девʼятої.

> [!word] ten
> ipa: /ten/ · pos: noun · level: A1 · id: en-a1-numbers-w11
> uk: десять
> example: **Ten** minutes, please. — Десять хвилин, будь ласка.

> [!word] eleven
> ipa: /ɪˈlevn/ · pos: noun · level: A1 · id: en-a1-numbers-w12
> uk: одинадцять
> example: A football team has **eleven** players. — У футбольній команді одинадцять гравців.

> [!word] twelve
> ipa: /twelv/ · pos: noun · level: A1 · id: en-a1-numbers-w13
> uk: дванадцять
> example: There are **twelve** months in a year. — У році дванадцять місяців.

> [!word] thirteen
> ipa: /ˌθɜːˈtiːn/ · ipa-us: /ˌθɝːˈtiːn/ · pos: noun · level: A1 · id: en-a1-numbers-w14
> uk: тринадцять
> example: My sister is **thirteen**. — Моїй сестрі тринадцять.
> note: наголос у кінці: thir-TEEN.

> [!word] fifteen
> ipa: /ˌfɪfˈtiːn/ · pos: noun · level: A1 · id: en-a1-numbers-w15
> uk: пʼятнадцять
> example: The bus comes in **fifteen** minutes. — Автобус буде за пʼятнадцять хвилин.
> note: fif-, а не «five-».

> [!word] eighteen
> ipa: /ˌeɪˈtiːn/ · pos: noun · level: A1 · id: en-a1-numbers-w16
> uk: вісімнадцять
> example: You can vote at **eighteen**. — Голосувати можна з вісімнадцяти.
> note: пишеться з одним t.

> [!word] twenty
> ipa: /ˈtwenti/ · pos: noun · level: A1 · id: en-a1-numbers-w17
> uk: двадцять
> example: She's **twenty**-one today. — Їй сьогодні двадцять один.

> [!word] thirty
> ipa: /ˈθɜːti/ · ipa-us: /ˈθɝːt̬i/ · pos: noun · level: A1 · id: en-a1-numbers-w18
> uk: тридцять
> example: The flat is **thirty** square metres. — Квартира — тридцять квадратних метрів.
> note: наголос на початку: THIR-ty.

> [!word] forty
> ipa: /ˈfɔːti/ · ipa-us: /ˈfɔːrt̬i/ · pos: noun · level: A1 · id: en-a1-numbers-w19
> uk: сорок
> example: My dad is **forty**-five. — Моєму татові сорок пʼять.
> note: пишеться без u: forty, хоча four.

> [!word] fifty
> ipa: /ˈfɪfti/ · pos: noun · level: A1 · id: en-a1-numbers-w20
> uk: пʼятдесят
> example: It costs **fifty** pounds. — Це коштує пʼятдесят фунтів.

> [!word] eighty
> ipa: /ˈeɪti/ · ipa-us: /ˈeɪt̬i/ · pos: noun · level: A1 · id: en-a1-numbers-w21
> uk: вісімдесят
> example: My grandad is **eighty**. — Моєму дідусеві вісімдесят.

> [!word] hundred
> ipa: /ˈhʌndrəd/ · pos: noun · level: A1 · id: en-a1-numbers-w22
> uk: сто; сотня
> example: There are a **hundred** people here. — Тут сто людей.
> note: two hundred — без -s; hundreds of — сотні.

> [!word] thousand
> ipa: /ˈθaʊznd/ · pos: noun · level: A1 · id: en-a1-numbers-w23
> uk: тисяча
> example: The phone costs a **thousand** dollars. — Телефон коштує тисячу доларів.

> [!word] million
> ipa: /ˈmɪljən/ · pos: noun · level: A1 · id: en-a1-numbers-w24
> uk: мільйон
> example: Kyiv has about three **million** people. — У Києві близько трьох мільйонів людей.

> [!word] number
> ipa: /ˈnʌmbə/ · ipa-us: /ˈnʌmbər/ · pos: noun · level: A1 · id: en-a1-numbers-w25
> uk: число; номер
> example: What's your favourite **number**? — Яке твоє улюблене число?

> [!word] phone number
> ipa: /ˈfəʊn ˌnʌmbə/ · ipa-us: /ˈfoʊn ˌnʌmbər/ · pos: noun · level: A1 · id: en-a1-numbers-w26
> uk: номер телефону
> example: What's your **phone number**? — Який у тебе номер телефону?

> [!word] mobile
> ipa: /ˈməʊbaɪl/ · ipa-us: /ˈmoʊbl/ · pos: noun · level: A1 · id: en-a1-numbers-w27
> uk: мобільний (телефон)
> example: Call me on my **mobile**. — Подзвони мені на мобільний.
> note: UK mobile (phone); US cell phone, cell.

> [!word] call
> ipa: /kɔːl/ · pos: verb · level: A1 · id: en-a1-numbers-w28
> uk: дзвонити; телефонувати
> example: Please **call** me tomorrow. — Подзвони мені завтра, будь ласка.

> [!word] double
> ipa: /ˈdʌbl/ · pos: adj · level: A1 · id: en-a1-numbers-w29
> uk: подвійний; (у номерах) дві однакові цифри
> example: My number ends in **double** three. — Мій номер закінчується на дві трійки.

> [!word] old
> ipa: /əʊld/ · ipa-us: /oʊld/ · pos: adj · level: A1 · id: en-a1-numbers-w30
> uk: старий; (про вік) років
> example: How **old** is your car? — Скільки років твоїй машині?

> [!word] How old are you?
> ipa: /ˌhaʊ ˈəʊld ə juː/ · ipa-us: /ˌhaʊ ˈoʊld ər juː/ · pos: phrase · level: A1 · id: en-a1-numbers-w31
> uk: скільки тобі років?
> example: **How old are you?** — I'm twenty. — Скільки тобі років? — Двадцять.
> note: незнайомих дорослих про вік не питають — це вважається неввічливим.

> [!word] year
> ipa: /jɪə/ · ipa-us: /jɪr/ · pos: noun · level: A1 · id: en-a1-numbers-w32
> uk: рік
> example: She's ten **years** old. — Їй десять років.

> [!word] age
> ipa: /eɪdʒ/ · pos: noun · level: A1 · id: en-a1-numbers-w33
> uk: вік
> example: Write your name and **age**. — Напиши своє імʼя і вік.

> [!word] count
> ipa: /kaʊnt/ · pos: verb · level: A1 · id: en-a1-numbers-w34
> uk: рахувати
> example: Can you **count** to ten in English? — Ти вмієш рахувати до десяти англійською?

> [!word] about
> ipa: /əˈbaʊt/ · pos: adv · level: A1 · id: en-a1-numbers-w35
> uk: приблизно; близько
> example: It takes **about** twenty minutes. — Це триває приблизно двадцять хвилин.

## Слухаємо

> [!listen] Яке число ти почув?
> level: A1 · type: choice · speed: slow · id: en-a1-numbers-l01
> audio: fourteen
> - [x] 14
> - [ ] 40
> - [ ] 4

> [!listen] Яке число ти почув?
> level: A1 · type: choice · speed: slow · id: en-a1-numbers-l02
> audio: fifty
> - [ ] 15
> - [x] 50
> - [ ] 55

> [!listen] Яке число ти почув?
> level: A1 · type: choice · speed: slow · id: en-a1-numbers-l03
> audio: She's eighteen.
> - [x] Їй 18.
> - [ ] Їй 80.
> - [ ] Їй 8.

> [!listen] Яке число ти почув?
> level: A1 · type: choice · speed: slow · id: en-a1-numbers-l04
> audio: Three hundred and sixty.
> - [ ] 316
> - [x] 360
> - [ ] 3,060

> [!listen] Напиши або скажи, що почув (цифрами або словами)
> level: A1 · type: dictation · speed: slow · id: en-a1-numbers-l05
> audio: I'm twenty-seven years old.

> [!listen] Напиши або скажи, що почув
> level: A1 · type: dictation · speed: slow · id: en-a1-numbers-l06
> audio: How old is your brother?

> [!listen] Який номер продиктували?
> level: A1 · type: choice · speed: slow · id: en-a1-numbers-l07
> audio: My number is oh seven seven one, double four, nine two three.
> - [ ] 0771 49 923
> - [x] 0771 44 923
> - [ ] 0771 44 932

> [!listen] Який номер продиктували?
> level: A1 · type: choice · speed: slow · id: en-a1-numbers-l08
> audio: It's oh two oh, eight three five six, double one five oh.
> - [x] 020 8356 1150
> - [ ] 020 8356 1500
> - [ ] 020 8536 1150

> [!listen] Послухай діалог. Скільки років доньці Сари?
> level: A1 · type: answer · speed: slow · id: en-a1-numbers-l09
> audio: A: Is that your daughter, Sarah?
> audio: B: Yes, that's Mia.
> audio: A: How old is she?
> audio: B: She's thirteen.
> - [x] 13
> - [ ] 30
> - [ ] 3

> [!listen] Послухай діалог. Скільки коштує квиток?
> level: A1 · type: answer · speed: slow · id: en-a1-numbers-l10
> audio: A: How much is a ticket?
> audio: B: It's forty pounds.
> audio: A: Fourteen?
> audio: B: No, forty. Four, oh.
> - [ ] 14 фунтів
> - [x] 40 фунтів
> - [ ] 4 фунти

## Вимова

> [!pair] thirteen /ˌθɜːˈtiːn/ — thirty /ˈθɜːti/
> level: A1 · id: en-a1-numbers-p01
> say: thirteen
> tip: 13 — наголос у кінці й довге «тіін»; 30 — наголос на початку, коротке «ті».

> [!pair] fourteen /ˌfɔːˈtiːn/ — forty /ˈfɔːti/
> level: A1 · id: en-a1-numbers-p02
> say: forty
> tip: слухай кінець: є чітке n — це 14, немає — 40.

> [!pair] fifteen /ˌfɪfˈtiːn/ — fifty /ˈfɪfti/
> level: A1 · id: en-a1-numbers-p03
> say: fifty
> tip: FIF-ty — сильний перший склад; fif-TEEN — сильний другий.

> [!pair] eighteen /ˌeɪˈtiːn/ — eighty /ˈeɪti/
> level: A1 · id: en-a1-numbers-p04
> say: eighteen
> tip: довгий голосний і n у кінці — ознака -teen.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-numbers-s01
> text: thirteen, thirty, fourteen, forty
> ipa: /ˌθɜːˈtiːn ˈθɜːti ˌfɔːˈtiːn ˈfɔːti/
> tip: перебільшуй наголос: thir-TEEN, THIR-ty. Носії саме так розрізняють ці числа.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-numbers-s02
> text: I'm twenty-five years old.
> ipa: /aɪm ˌtwenti ˈfaɪv jɪəz ˈəʊld/
> tip: years — «йіəз», з дзвінким z у кінці; old — «оулд», не «олд».

> [!speak] Скажи вголос
> level: A1 · id: en-a1-numbers-s03
> text: How old are you?
> ipa: /ˌhaʊ ˈəʊld ə juː/
> tip: are тут слабке /ə/ — «гау-оулд-е-ю», з легким /h/ на початку.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-numbers-s04
> text: two hundred and fifty
> ipa: /ˌtuː ˈhʌndrəd ən ˈfɪfti/
> tip: and — коротке /ən/, майже «ен». Hundred — без «г»: /h/ — видих.

> [!speak] Продиктуй номер
> level: A1 · id: en-a1-numbers-s05
> text: oh nine seven, double three, eight one two
> ipa: /əʊ naɪn ˈsevn ˈdʌbl θriː eɪt wʌn tuː/
> tip: роби паузу між групами — так номер легше записати.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-numbers-s06
> text: What's your phone number?
> ipa: /ˌwɒts jə ˈfəʊn ˌnʌmbə/
> tip: your тут слабке /jə/; наголос на phone.

## Типові помилки українців

> [!pitfall] «I have 25 years»
> Найчастіша калька. Вік в англійській — через be: **I'm 25** / **I'm 25 years old**. Так само: *He's ten. How old are you?* А «I'm 25 years» без *old* теж неправильно.

> [!pitfall] «Two hundreds», «three thousands»
> Після конкретного числа *hundred, thousand, million* — без -s: **two hundred, three thousand**. З -s — лише неточна кількість: *hundreds of people, thousands of books*.

> [!pitfall] Кома замість крапки
> 2,5 українською — «два з половиною», а англійською 2,5 читатимуть як… нічого: такого запису немає. Пиши **2.5** (*two point five*). А **2,500** — це дві тисячі пʼятсот.

## Ситуація: записуємо контакт

> [!listen] Послухай, як друзі обмінюються номерами
> level: A1 · type: choice · speed: slow · id: en-a1-numbers-l11
> audio: A: What's your phone number, Dan?
> audio: B: It's oh seven nine six, double two, five eight oh.
> audio: A: Sorry, can you say that again?
> audio: B: Oh seven nine six, double two, five eight oh.
> - [x] 0796 22 580
> - [ ] 0796 22 508
> - [ ] 0796 2 580

Тепер продиктуй свій номер вголос (можна вигаданий).

> [!speak] «Мій номер — 067 44 905»
> level: A1 · id: en-a1-numbers-s07
> text: My number is oh six seven, double four, nine oh five.
> ipa: /maɪ ˈnʌmbə ɪz əʊ sɪks ˈsevn ˈdʌbl fɔː naɪn əʊ faɪv/
> tip: «oh» — це нуль у номері; в американській вимові кажи zero.

## Практика

> [!quiz] Як правильно написати 40 словом?
> level: A1 · id: en-a1-numbers-q02
> - [ ] fourty
> - [x] forty
> - [ ] fourteen
> - [ ] fourthy
>
> **Пояснення:** *four*, *fourteen*, але **forty** — без u. Тут помиляються навіть носії мови.

> [!quiz] Як прочитати 315 (британський варіант)?
> level: A1 · id: en-a1-numbers-q03
> - [ ] three hundreds fifteen
> - [ ] three hundred fifty
> - [x] three hundred and fifteen
> - [ ] three and hundred fifteen
>
> **Пояснення:** hundred — без -s; *and* — перед десятками й одиницями; 15 — *fifteen*, а не *fifty* (50).

> [!quiz] Обери всі правильні речення
> level: A1 · type: multi · id: en-a1-numbers-q04
> - [x] My son is seven.
> - [ ] My son has seven years.
> - [x] She's thirty years old.
> - [ ] I'm twenty years.
>
> **Пояснення:** вік — *be* + число, або *be* + число + *years old*. «has seven years» і «twenty years» без *old* — помилки.

> [!quiz] Як британці частіше читають номер 0711 455 299?
> level: A1 · id: en-a1-numbers-q05
> - [ ] seven hundred eleven, four hundred fifty-five…
> - [x] oh seven double one, four double five, two double nine
> - [ ] zero seven eleven, four fifty-five, two ninety-nine
>
> **Пояснення:** номери читають по цифрі, нуль — *oh*, дві однакові поспіль — *double*.

> [!quiz] Запиши числа словами
> level: A1 · type: fill · id: en-a1-numbers-q06
>
> ```text fill
> 12 = [[twelve]]
> 20 = [[twenty]]
> 33 = [[thirty-three]]
> 100 = a [[hundred]]
> ```
>
> **Пояснення:** 33 пишеться через дефіс: *thirty-three*.

> [!quiz] Заповни діалог
> level: A1 · type: fill · bank: have, years · id: en-a1-numbers-q07
>
> ```text fill
> A: How [[old]] [[are]] you?
> B: I'm nineteen. And you?
> A: I'm twenty-two years [[old]].
> ```
>
> **Пояснення:** *How old are you? — I'm… years old.* Жодного *have*.

> [!quiz] Склади питання про вік брата
> level: A1 · type: order · id: en-a1-numbers-q08
>
> ```text order
> How
> old
> is
> your
> brother?
> ```
>
> **Пояснення:** *How old* — один блок на початку, далі be і підмет.

> [!quiz] Склади число 4,250 словами
> level: A1 · type: order · id: en-a1-numbers-q09
>
> ```text order
> four
> thousand
> two
> hundred
> and
> fifty
> thousands // ✗
> ```
>
> **Пояснення:** тисячі → сотні → *and* → десятки. *Thousand* після числа — без -s.

> [!quiz] Ціна на ціннику: £1.50. Як її прочитати?
> level: A1 · id: en-a1-numbers-q10
> - [ ] one thousand five hundred pounds
> - [x] one pound fifty
> - [ ] one comma fifty pounds
>
> **Пояснення:** крапка відділяє пенси від фунтів: *one pound fifty* (або *one fifty*). А тисяча пʼятсот фунтів — це £1,500.

## Фішки

> [!reel] 🔢 Чому eleven, а не «oneteen»?
> *Eleven* і *twelve* — давньогерманські слова: «один лишився» і «два лишилося» (понад десять). Тобто рахували на пальцях, а те, що понад десять, «лишалося». Звідси й незвичні назви.

> [!reel] ☎️ Чому британці кажуть «oh» замість нуля
> Цифра 0 схожа на літеру O, а «oh» — коротше й легше, ніж «zero». Тому в номерах телефону, рахунках і роках (*nineteen oh five* — 1905) британці кажуть «оу».

> [!reel] 🎂 Teenager — це 13–19
> *Teenager* — підліток, буквально «людина, чий вік закінчується на -teen»: від *thirteen* до *nineteen*. Дванадцятирічний — ще не teenager!

## Джерела та що почитати

- [Cambridge Dictionary](https://dictionary.cambridge.org/) — послухай *thirteen* і *thirty* в британській та американській вимові.
- [BBC Learning English](https://www.bbc.co.uk/learningenglish/) — уроки для початківців про числа й номери.
- [British Council LearnEnglish](https://learnenglish.britishcouncil.org/) — вправи на числа, вік і ціни.
- R. Murphy — *Essential Grammar in Use*, додаток про числа.

> [!important] Підсумок
> - 13–19 — *-teen* з наголосом у кінці; 20–90 — *-ty* з наголосом на початку.
> - 21–99 — через дефіс: *forty-two*; британці ставлять *and* після сотень: *a hundred and five*.
> - *Two hundred, five thousand* — без -s; кома розділяє тисячі, крапка — дроби.
> - Вік — через be: *I'm 25 (years old)*, ніколи «I have 25 years».
> - Номер телефону — по цифрі: *oh* = 0, *double* = дві однакові.
