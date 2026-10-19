---
title: There is, there are — дім і кімнати
order: 120
id: en-a1-there-is
level: A1
icon: px:house
tags: [english, a1, grammar, there-is, home, prepositions]
prerequisites: ["[[English - A1 - 19. Some, any, much, many — лічильні й нелічильні]]", "[[English - A1 - 03. Дієслово to be — am, is, are]]"]
estimatedMinutes: 40
---

# There is, there are — дім і кімнати

> [!success] Після цієї теми ти зможеш
> - сказати, що десь щось є: *There's a sofa in the living room. There are two bedrooms.*;
> - заперечити й спитати: *There isn't a garden. Is there a balcony? — No, there isn't.*;
> - назвати кімнати й меблі англійською;
> - описати, де що стоїть: *under, next to, between, opposite, behind, in front of*.

## Передбач

> [!quiz] Як сказати «У моїй кімнаті є стара шафа»?
> level: A1 · id: en-a1-there-is-q01
> - [ ] In my room is an old wardrobe.
> - [x] There is an old wardrobe in my room.
> - [ ] It is an old wardrobe in my room.
> - [ ] My room is there an old wardrobe.
>
> **Пояснення:** українське «є» про наявність чогось у певному місці англійською — ***there is***. Речення починається з *there*, а місце — у кінці.

## «Тут є…» — навіщо там there

Українською ми починаємо з місця: «**У кімнаті** є диван». Англійці так майже не кажуть. У них для «тут є, там є, існує» є готова рамка: **there + is / are + що + де**.

> [!diagram] Будуємо речення з there is
> ```yaml
> layout: flow
> nodes:
>   - { id: there, label: "початок", text: "There", tone: gray }
>   - { id: be, label: "is / are", text: "is", tone: violet }
>   - { id: what, label: "що?", text: "a sofa", tone: blue }
>   - { id: where, label: "де?", text: "in the living room.", tone: green }
> steps:
>   - { focus: [what, where], note: "Українською: «У вітальні є диван». Спершу місце, потім предмет." }
>   - { focus: [there, be], note: "Англійською починаємо з There is — «тут є». Це просто рамка, there тут не означає «там»." }
>   - { focus: [there, be, what, where], note: "Потім — що є, а місце в кінці: There is a sofa in the living room. Скорочено — There's." }
>   - { set: { be: "are", what: "two armchairs" }, focus: [be, what], note: "Предметів кілька — is змінюється на are: There are two armchairs in the living room." }
> ```

| | Однина / нелічильні | Множина |
|---|---|---|
| **+** | ***There's** a lamp. **There's** some milk.* | ***There are** two lamps. **There are** some books.* |
| **−** | ***There isn't** a garden.* | ***There aren't** any chairs.* |
| **?** | ***Is there** a lift?* | ***Are there** any shops near here?* |
| **коротка відповідь** | *Yes, there **is**. / No, there **isn't**.* | *Yes, there **are**. / No, there **aren't**.* |

Кілька важливих деталей:

- Скорочення ***there's*** — так кажуть майже завжди. А от *there are* у письмі не скорочують.
- У короткій відповіді «так» — повна форма: *Yes, there **is**.*, не ~~Yes, there's~~.
- У запереченні й питанні з множиною — ***any*** (як у [[English - A1 - 19. Some, any, much, many — лічильні й нелічильні]]): *There aren't **any** curtains. Are there **any** shelves?*
- Скільки? — ***How many** rooms **are there**?*
- У переліку дієслово дивиться на **перший** предмет: ***There's** a table and four chairs.* Але: ***There are** four chairs and a table.*

### There is чи It is

*There is* — **представляє** щось нове: «є, існує». *It is* — **описує** те, про що вже говорили.

*There's a cat in the garden. **It's** black.* — У саду кіт. Він чорний.
*There's a new café near my house. **It's** really good.* — Біля мого дому є нове кафе. Воно дуже хороше.

> [!quiz] Перевір себе: «There ___ two bathrooms in this house.»
> level: A1 · id: en-a1-there-is-q02
> - [ ] is
> - [x] are
> - [ ] be
> - [ ] it's
>
> **Пояснення:** *two bathrooms* — множина, тому *there are*.

## Дім: кімнати й меблі

> [!diagram] Квартира: що де є
> ```yaml
> layout: nest
> nodes:
>   - { id: flat, label: "my flat", text: "There are three rooms.", tone: gray }
>   - { id: living, parent: flat, label: "living room", text: "вітальня", tone: blue }
>   - { id: kitchen, parent: flat, label: "kitchen", text: "кухня", tone: yellow }
>   - { id: bedroom, parent: flat, label: "bedroom", text: "спальня", tone: violet }
>   - { id: sofa, parent: living, text: "a sofa", note: "There's a sofa." }
>   - { id: fridge, parent: kitchen, text: "a fridge", note: "There's a fridge." }
>   - { id: bed, parent: bedroom, text: "a bed", note: "There's a bed." }
>   - { id: wardrobe, parent: bedroom, text: "a wardrobe", note: "There's a wardrobe." }
> steps:
>   - { show: [living, kitchen, bedroom], focus: flat, note: "У квартирі три кімнати: There are three rooms in my flat." }
>   - { show: sofa, note: "There's a sofa in the living room — у вітальні є диван." }
>   - { show: fridge, note: "There's a fridge in the kitchen — на кухні є холодильник." }
>   - { show: [bed, wardrobe], note: "There's a bed and a wardrobe in the bedroom. Перелік — дієслово за першим предметом." }
>   - { focus: living, note: "Чого немає? There isn't a TV in the living room. Є? Is there a TV? — No, there isn't." }
> ```

| Кімната | Що там буває |
|---|---|
| *living room* — вітальня | *sofa, armchair, lamp, carpet, curtains, shelf* |
| *bedroom* — спальня | *bed, wardrobe, desk, mirror* |
| *kitchen* — кухня | *fridge, cooker, sink, cupboard, table* |
| *bathroom* — ванна кімната | *bath, sink, mirror, washing machine* |
| *hall* — передпокій | *mirror, stairs* (у будинку) |
| ззовні | *balcony, garden* |

## Де саме — прийменники місця

| Прийменник | Українською | Приклад |
|---|---|---|
| *in* | в, у (всередині) | *The milk is **in** the fridge.* |
| *on* | на (поверхні) | *The lamp is **on** the desk.* |
| *under* | під | *The cat is **under** the bed.* |
| *next to* | поруч з, біля | *The sofa is **next to** the window.* |
| *near* | недалеко від, біля | *There's a park **near** my house.* |
| *between* | між | *The desk is **between** the bed and the wardrobe.* |
| *opposite* | навпроти | *The bathroom is **opposite** the kitchen.* |
| *behind* | за, позаду | *The garden is **behind** the house.* |
| *in front of* | перед | *The car is **in front of** the house.* |
| *above* | над | *There's a mirror **above** the sink.* |

Про *in, on, at* у часі й місці — окрема тема [[English - A1 - 25. Прийменники in, on, at — час і місце]].

## Приклади

- There's a big mirror in the hall. — У передпокої велике дзеркало.
- There are two bedrooms and a small kitchen in our flat. — У нашій квартирі дві спальні й маленька кухня.
- There isn't a bath, but there's a shower. — Ванни немає, але є душ.
- There aren't any shelves in my room. — У моїй кімнаті немає полиць.
- Is there a washing machine? — Yes, there is. — Є пральна машина? — Так, є.
- Are there any shops near here? — No, there aren't. — Тут поруч є магазини? — Ні.
- How many rooms are there in your house? — Скільки кімнат у твоєму будинку?
- The cupboard is between the fridge and the cooker. — Шафка стоїть між холодильником і плитою.
- There's a lovely park opposite our building. — Навпроти нашого будинку гарний парк.
- My desk is in front of the window. — Мій стіл стоїть перед вікном.

## Слова

> [!word] flat
> ipa: /flæt/ · pos: noun · level: A1 · id: en-a1-there-is-w01
> uk: квартира
> example: We live in a small **flat** in Lviv. — Ми живемо в невеликій квартирі у Львові.
> note: у США — *apartment*. Як прикметник *flat* — плаский, рівний.

> [!word] living room
> ipa: /ˈlɪvɪŋ ruːm/ · pos: noun · level: A1 · id: en-a1-there-is-w02
> uk: вітальня
> example: There's a big sofa in the **living room**. — У вітальні великий диван.
> note: *room* можна вимовляти і /ruːm/, і /rʊm/.

> [!word] bedroom
> ipa: /ˈbedruːm/ · pos: noun · level: A1 · id: en-a1-there-is-w03
> uk: спальня
> example: There are two **bedrooms** in our flat. — У нашій квартирі дві спальні.

> [!word] kitchen
> ipa: /ˈkɪtʃɪn/ · pos: noun · level: A1 · id: en-a1-there-is-w04
> uk: кухня
> example: The **kitchen** is very small. — Кухня дуже маленька.
> note: не плутай з *chicken* /ˈtʃɪkɪn/ — курка.

> [!word] bathroom
> ipa: /ˈbɑːθruːm/ · ipa-us: /ˈbæθruːm/ · pos: noun · level: A1 · id: en-a1-there-is-w05
> uk: ванна кімната
> example: Is there a **bathroom** upstairs? — Нагорі є ванна кімната?
> note: в американській *bathroom* — також ввічливе «туалет»: *Where's the bathroom?*

> [!word] hall
> ipa: /hɔːl/ · pos: noun · level: A1 · id: en-a1-there-is-w06
> uk: передпокій; коридор; зала
> example: Leave your shoes in the **hall**. — Залиш взуття в передпокої.
> note: у США — частіше *hallway*. Перший звук — легкий видих /h/, не «г».

> [!word] balcony
> ipa: /ˈbælkəni/ · pos: noun · level: A1 · id: en-a1-there-is-w07
> uk: балкон
> example: There's a small **balcony** with flowers. — Є маленький балкон із квітами.
> note: наголос на першому складі: «БЕЛ-кə-ні».

> [!word] garden
> ipa: /ˈɡɑːdn/ · ipa-us: /ˈɡɑːrdn/ · pos: noun · level: A1 · id: en-a1-there-is-w08
> uk: сад; садок біля будинку
> example: The children play in the **garden**. — Діти граються в саду.
> note: у США ділянку біля будинку частіше називають *yard*.

> [!word] stairs
> ipa: /steəz/ · ipa-us: /sterz/ · pos: noun · level: A1 · id: en-a1-there-is-w09
> uk: сходи
> example: The bathroom is at the top of the **stairs**. — Ванна — нагорі, щойно піднімешся сходами.
> note: звучить так само, як *stares* («пильно дивиться»).

> [!word] floor
> ipa: /flɔː/ · ipa-us: /flɔːr/ · pos: noun · level: A1 · id: en-a1-there-is-w10
> uk: підлога; поверх
> example: Our flat is on the third **floor**. — Наша квартира на третьому поверсі.
> note: британський *ground floor* — наш перший поверх, а *first floor* — другий. У США *first floor* — перший.

> [!word] sofa
> ipa: /ˈsəʊfə/ · ipa-us: /ˈsoʊfə/ · pos: noun · level: A1 · id: en-a1-there-is-w11
> uk: диван
> example: The cat sleeps on the **sofa**. — Кіт спить на дивані.
> note: часто також *couch*.

> [!word] armchair
> ipa: /ˈɑːmtʃeə/ · ipa-us: /ˈɑːrmtʃer/ · pos: noun · level: A1 · id: en-a1-there-is-w12
> uk: крісло
> example: There are two **armchairs** next to the sofa. — Біля дивана два крісла.
> note: *arm* — рука, а тут — підлокітник: «стілець з підлокітниками».

> [!word] bed
> ipa: /bed/ · pos: noun · level: A1 · id: en-a1-there-is-w13
> uk: ліжко
> example: There's a double **bed** in the bedroom. — У спальні двоспальне ліжко.

> [!word] wardrobe
> ipa: /ˈwɔːdrəʊb/ · ipa-us: /ˈwɔːrdroʊb/ · pos: noun · level: A1 · id: en-a1-there-is-w14
> uk: шафа для одягу
> example: My clothes are in the **wardrobe**. — Мій одяг у шафі.
> note: у США — частіше *closet* (часто вбудована).

> [!word] shelf
> ipa: /ʃelf/ · pos: noun · level: A1 · id: en-a1-there-is-w15
> uk: полиця
> example: The books are on the **shelf**. — Книжки на полиці.
> forms: shelf → shelves

> [!word] lamp
> ipa: /læmp/ · pos: noun · level: A1 · id: en-a1-there-is-w16
> uk: лампа; світильник
> example: There's a **lamp** on my desk. — На моєму столі лампа.

> [!word] mirror
> ipa: /ˈmɪrə/ · ipa-us: /ˈmɪrər/ · pos: noun · level: A1 · id: en-a1-there-is-w17
> uk: дзеркало
> example: There's a **mirror** above the sink. — Над умивальником дзеркало.

> [!word] carpet
> ipa: /ˈkɑːpɪt/ · ipa-us: /ˈkɑːrpɪt/ · pos: noun · level: A1 · id: en-a1-there-is-w18
> uk: килим; килимове покриття
> example: There's a blue **carpet** in the living room. — У вітальні синій килим.
> note: невеликий килимок — *rug*.

> [!word] curtains
> ipa: /ˈkɜːtnz/ · ipa-us: /ˈkɝːtnz/ · pos: noun · level: A1 · id: en-a1-there-is-w19
> uk: штори; фіранки
> example: There aren't any **curtains** in the kitchen. — На кухні немає штор.

> [!word] fridge
> ipa: /frɪdʒ/ · pos: noun · level: A1 · id: en-a1-there-is-w20
> uk: холодильник
> example: Is there any milk in the **fridge**? — У холодильнику є молоко?
> note: повне слово — *refrigerator*, але в розмові кажуть *fridge*.

> [!word] cooker
> ipa: /ˈkʊkə/ · ipa-us: /ˈkʊkər/ · pos: noun · level: A1 · id: en-a1-there-is-w21
> uk: плита (кухонна)
> example: There's a new **cooker** in the kitchen. — На кухні нова плита.
> note: не «кухар»! Кухар — *cook*. У США плита — *stove*.

> [!word] sink
> ipa: /sɪŋk/ · pos: noun · level: A1 · id: en-a1-there-is-w22
> uk: раковина; мийка
> example: The dirty plates are in the **sink**. — Брудні тарілки в мийці.

> [!word] bath
> ipa: /bɑːθ/ · ipa-us: /bæθ/ · pos: noun · level: A1 · id: en-a1-there-is-w23
> uk: ванна
> example: There isn't a **bath** — only a shower. — Ванни немає, тільки душ.
> note: у США — *bathtub* або *tub*.

> [!word] washing machine
> ipa: /ˈwɒʃɪŋ məˌʃiːn/ · ipa-us: /ˈwɑːʃɪŋ məˌʃiːn/ · pos: noun · level: A1 · id: en-a1-there-is-w24
> uk: пральна машина
> example: The **washing machine** is in the bathroom. — Пральна машина у ванній.

> [!word] table
> ipa: /ˈteɪbl/ · pos: noun · level: A1 · id: en-a1-there-is-w25
> uk: стіл (обідній, кухонний)
> example: There's a big **table** in the kitchen. — На кухні великий стіл.
> note: письмовий, робочий стіл — *desk*.

> [!word] cupboard
> ipa: /ˈkʌbəd/ · ipa-us: /ˈkʌbərd/ · pos: noun · level: A1 · id: en-a1-there-is-w26
> uk: шафка; кухонна шафа
> example: The cups are in the **cupboard**. — Чашки в шафці.
> note: *p* не читається: «КА-бəд».

> [!word] under
> ipa: /ˈʌndə/ · ipa-us: /ˈʌndər/ · pos: prep · level: A1 · id: en-a1-there-is-w27
> uk: під
> example: My shoes are **under** the bed. — Моє взуття під ліжком.

> [!word] next to
> ipa: /ˈnekst tə/ · pos: prep · level: A1 · id: en-a1-there-is-w28
> uk: поруч з; біля
> example: The bathroom is **next to** the bedroom. — Ванна поруч зі спальнею.

> [!word] between
> ipa: /bɪˈtwiːn/ · pos: prep · level: A1 · id: en-a1-there-is-w29
> uk: між
> example: The sofa is **between** two armchairs. — Диван стоїть між двома кріслами.

> [!word] opposite
> ipa: /ˈɒpəzɪt/ · ipa-us: /ˈɑːpəzɪt/ · pos: prep · level: A1 · id: en-a1-there-is-w30
> uk: навпроти
> example: There's a bank **opposite** our house. — Навпроти нашого будинку банк.
> note: навпроти, обличчям до обличчя — *opposite*; просто «перед» — *in front of*.

> [!word] behind
> ipa: /bɪˈhaɪnd/ · pos: prep · level: A1 · id: en-a1-there-is-w31
> uk: за; позаду
> example: The garden is **behind** the house. — Сад за будинком.

> [!word] in front of
> ipa: /ɪn ˈfrʌnt əv/ · pos: prep · level: A1 · id: en-a1-there-is-w32
> uk: перед
> example: There's a car **in front of** the house. — Перед будинком стоїть машина.
> note: *front* читається з /ʌ/: «франт».

> [!word] near
> ipa: /nɪə/ · ipa-us: /nɪr/ · pos: prep · level: A1 · id: en-a1-there-is-w33
> uk: біля; недалеко від
> example: Is there a supermarket **near** here? — Тут поблизу є супермаркет?
> note: *near* — недалеко; *next to* — впритул, поруч.

> [!word] above
> ipa: /əˈbʌv/ · pos: prep · level: A1 · id: en-a1-there-is-w34
> uk: над
> example: There's a picture **above** the bed. — Над ліжком картина.

## Слухаємо

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: en-a1-there-is-l01
> audio: There are two bedrooms in my flat.
> - [x] There are two bedrooms in my flat.
> - [ ] There are three bedrooms in my flat.
> - [ ] There's a bedroom in my flat.

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: en-a1-there-is-l02
> audio: Is there a washing machine in the kitchen?
> - [ ] There's a washing machine in the kitchen.
> - [x] Is there a washing machine in the kitchen?
> - [ ] Is there a washing machine in the bathroom?

> [!listen] Напиши або скажи, що почуєш
> level: A1 · type: dictation · speed: slow · id: en-a1-there-is-l03
> audio: There isn't a garden, but there's a big balcony.

> [!listen] Напиши або скажи, що почуєш
> level: A1 · type: dictation · speed: slow · id: en-a1-there-is-l04
> audio: The lamp is next to the sofa.

> [!listen] Чого немає в спальні?
> level: A1 · type: answer · speed: slow · id: en-a1-there-is-l05
> audio: My bedroom is small. There's a bed, a desk and a wardrobe. There aren't any curtains.
> - [ ] Шафи
> - [x] Штор
> - [ ] Письмового стола

## Вимова

> [!speak] Скажи вголос
> level: A1 · id: en-a1-there-is-s01
> text: There's a big sofa in the living room.
> ipa: /ðeəz ə ˈbɪɡ ˈsəʊfə ɪn ðə ˈlɪvɪŋ ruːm/
> tip: *there's* — язик між зубами /ð/ і дзвінке /z/: «ðеəз», не «зерс».

> [!speak] Скажи вголос
> level: A1 · id: en-a1-there-is-s02
> text: There are two bedrooms and a small kitchen.
> ipa: /ðər ə ˈtuː ˈbedruːmz ən ə ˈsmɔːl ˈkɪtʃɪn/
> tip: *There are* у мовленні злите й коротке: «ðə-рə». Наголос — на *two* і *bedrooms*.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-there-is-s03
> text: Is there a washing machine? Yes, there is.
> ipa: /ɪz ðər ə ˈwɒʃɪŋ məˌʃiːn jes ðeər ˈɪz/
> tip: у питанні голос іде вгору на *machine*. У відповіді *is* наголошене й повне.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-there-is-s04
> text: The cupboard is between the fridge and the cooker.
> ipa: /ðə ˈkʌbəd ɪz bɪˈtwiːn ðə ˈfrɪdʒ ən ðə ˈkʊkə/
> tip: cupboard — «КА-бəд», без «п». Between — довге /iː/ і наголос у кінці: «бі-ТВІН».

## Типові помилки українців

> [!pitfall] «In the kitchen is a fridge» — калька з «На кухні є холодильник»
> Англійською так не кажуть. Починай з ***there***: *There's a fridge in the kitchen.* Місце — у кінці речення.

> [!pitfall] «It is a park near my house» — it замість there
> *It is* описує вже відоме: *It's a nice park.* А щоб сказати, що щось **є**, — *There is*: ***There's** a park near my house. **It's** really big.*

> [!pitfall] «Opposite» і «in front of» — не одне й те саме
> «Навпроти» (через дорогу, обличчям одне до одного) — ***opposite***: *The bank is opposite the school.* «Перед» (з того боку, куди дивиться предмет) — ***in front of***: *There's a tree in front of the school.*

> [!pitfall] «Cooker» — це не кухар
> *Cooker* — плита (UK). Кухар — *cook*: *My dad is a great cook.* Таких пар-пасток багато, тому вчи ці слова разом.

## Ситуація: дивимося квартиру

> [!listen] Послухай розмову з власницею квартири. Що правда?
> level: A1 · type: answer · speed: slow · id: en-a1-there-is-l06
> audio: A: So, how many rooms are there?
> audio: B: There are two bedrooms, a living room and a small kitchen.
> audio: A: Is there a washing machine?
> audio: B: Yes, there is. It's in the bathroom.
> audio: A: And is there a balcony?
> audio: B: No, there isn't, I'm afraid. But there's a park opposite the building.
> - [x] Дві спальні, пральна машина у ванній, балкона немає
> - [ ] Три спальні й великий балкон
> - [ ] Пральної машини немає, а парк за будинком

Тепер ти — орендар. Спитай уголос:

> [!speak] «Скільки тут кімнат?»
> level: A1 · id: en-a1-there-is-s05
> text: How many rooms are there?
> ipa: /haʊ ˈmeni ˈruːmz ə ðeə/
> tip: *are there* наприкінці — коротко й злито, голос униз: це wh-питання.

> [!speak] «А балкон є?»
> level: A1 · id: en-a1-there-is-s06
> text: And is there a balcony?
> ipa: /ənd ɪz ðər ə ˈbælkəni/
> tip: питання «так / ні» — голос угору на *balcony*. Наголос на першому складі: «БЕЛ-кə-ні».

## Практика

> [!quiz] «Is there a garden?» — як коротко відповісти «так»?
> level: A1 · id: en-a1-there-is-q03
> - [x] Yes, there is.
> - [ ] Yes, there's.
> - [ ] Yes, it is.
> - [ ] Yes, is.
>
> **Пояснення:** у короткій відповіді «так» не скорочуємо: *Yes, there is.* А «ні» — скорочуємо: *No, there isn't.*

> [!quiz] Заповни пропуски: is, are, isn't, aren't
> level: A1 · type: fill · bank · id: en-a1-there-is-q04
>
> ```text fill
> There [[is]] a sofa in the living room.
> There [[are]] two lamps next to it.
> There [[isn't]] a TV, and there [[aren't]] any curtains.
> ```
>
> **Пояснення:** однина — *is / isn't*, множина — *are / aren't*. *Any* — сигнал заперечення з множиною.

> [!quiz] Як сказати «Банк навпроти школи»?
> level: A1 · id: en-a1-there-is-q05
> - [x] The bank is opposite the school.
> - [ ] The bank is in front the school.
> - [ ] The bank is between the school.
> - [ ] The bank is behind of the school.
>
> **Пояснення:** «навпроти» — *opposite* (без *of*). *In front of* — «перед» і завжди з *of*; *between* потребує двох предметів.

> [!quiz] Склади речення: «У моїй квартирі дві спальні».
> level: A1 · type: order · id: en-a1-there-is-q06
>
> ```text order
> There
> are
> two bedrooms
> in my flat.
> is # ✗
> ```
>
> **Пояснення:** *there + are* (бо *two bedrooms* — множина) + що + де.

> [!quiz] «There's a cat in the garden. ___ black.»
> level: A1 · id: en-a1-there-is-q07
> - [x] It's
> - [ ] There's
> - [ ] Its
> - [ ] There is
>
> **Пояснення:** про кота вже сказали — тепер його **описуємо**, тому *It's black*. *Its* без апострофа — «його» (присвійне).

> [!quiz] Заповни пропуски: де що стоїть
> level: A1 · type: fill · bank: above, opposite · id: en-a1-there-is-q08
>
> ```text fill
> The lamp is [[on]] the desk.
> The cat is [[under]] the bed.
> The sofa is [[between]] the two armchairs.
> The bathroom is [[next to]] the bedroom.
> ```
>
> **Пояснення:** *on* — на поверхні, *under* — під, *between* — між двома, *next to* — поруч.

> [!quiz] Склади питання: «Скільки кімнат у твоєму будинку?»
> level: A1 · type: order · id: en-a1-there-is-q09
>
> ```text order
> How many
> rooms
> are there
> in your house?
> is there # ✗
> ```
>
> **Пояснення:** *How many* + іменник у множині + *are there* + місце.

> [!quiz] Що означає слово cooker?
> level: A1 · id: en-a1-there-is-q10
> - [x] плита
> - [ ] кухар
> - [ ] кухня
> - [ ] каструля
>
> **Пояснення:** *cooker* (UK) — кухонна плита, у США — *stove*. Кухар — *cook*, кухня — *kitchen*.

> [!quiz] Чому кажуть «There's a table and four chairs», а не «There are…»?
> level: A1 · id: en-a1-there-is-q11
> - [ ] Бо *chairs* — нелічильне
> - [x] Бо дієслово узгоджується з першим предметом у переліку — *a table*
> - [ ] Бо *there's* завжди стоїть перед переліком
> - [ ] Це помилка, правильно лише *There are*
>
> **Пояснення:** у живому мовленні *there is / are* дивиться на найближчий предмет. *There are four chairs and a table* — теж правильно, бо першими йдуть стільці.

> [!quiz] Заповни пропуски в коротких діалогах
> level: A1 · type: fill · bank · id: en-a1-there-is-q12
>
> ```text fill
> Are there [[any]] shops near here? — Yes, there [[are]].
> Is there a lift in the building? — No, there [[isn't]].
> ```
>
> **Пояснення:** у питанні з множиною — *any*. Відповідь повторює *be* з питання: *are → there are*, *is → there isn't*.

## Фішки

> [!reel] 🏢 First floor — це другий поверх
> У Британії рахують від *ground floor* — нашого першого. Тож *first floor* у Лондоні — наш другий. А в Нью-Йорку *first floor* — перший, як у нас.

> [!reel] 🫖 Cupboard — «дошка для чашок»
> *Cupboard* = *cup* + *board* (полиця). Колись так називали просто полицю для посуду. З часом зʼявилися дверцята, а *p* перестали вимовляти: «КА-бəд».

> [!reel] 🚻 Bathroom без ванни
> В американському ресторані *Where's the bathroom?* означає «Де туалет?», хоча ванни там точно немає. У Британії спитають *Where's the toilet?* або розмовно — *the loo*.

## Джерела та що почитати

- [Cambridge Dictionary — There is, there's and there are](https://dictionary.cambridge.org/grammar/british-grammar/there-is-there-are) — форми й уживання.
- [Cambridge Dictionary — Opposite or in front of?](https://dictionary.cambridge.org/grammar/british-grammar/opposite) — різниця, у якій плутаються всі.
- [Cambridge Dictionary — Between](https://dictionary.cambridge.org/grammar/british-grammar/between), [Under](https://dictionary.cambridge.org/grammar/british-grammar/under), [Above](https://dictionary.cambridge.org/grammar/british-grammar/above) — прийменники місця.
- [Cambridge Dictionary — Furniture](https://dictionary.cambridge.org/grammar/british-grammar/furniture) — чому меблі не рахуються.
- R. Murphy — *Essential Grammar in Use*, розділи про *there is / there are* і прийменники місця.

> [!important] Підсумок
> - «Тут є…» — ***there is*** (однина, нелічильні) / ***there are*** (множина) + що + де.
> - Заперечення: *There isn't a… / There aren't any…*; питання: *Is there a…? Are there any…?*
> - Короткі відповіді: *Yes, there is. / No, there isn't.* Скільки? — *How many … are there?*
> - *There is* представляє нове, *it is* — описує вже відоме.
> - Місце: *in, on, under, next to, near, between, opposite, behind, in front of, above*.
