---
title: Сімʼя, люди й зовнішність
order: 108
id: en-a1-family
level: A1
icon: px:heart
tags: [english, a1, vocabulary, family, appearance, character]
prerequisites: ["[[English - A1 - 07. This, that, these, those — речі навколо]]"]
estimatedMinutes: 40
---

# Сімʼя, люди й зовнішність

> [!success] Після цієї теми ти зможеш
> - розповісти про свою сімʼю: *I have one brother. My parents are from Poltava.*;
> - описати зовнішність: *She's tall and slim. She has long dark hair and blue eyes.*;
> - описати характер: *He's kind and funny.*;
> - розрізнити питання *What does she look like?* і *What is she like?*;
> - назвати основні частини тіла.

## Передбач

> [!quiz] Що означає «my parents»?
> level: A1 · id: en-a1-family-q01
> - [ ] мої родичі
> - [x] мої батьки (мама і тато)
> - [ ] мої батьківщини
> - [ ] мої друзі
>
> **Пояснення:** *parents* — це лише мама й тато. «Родичі» — *relatives*. Не називай словом *parents* усю рідню — це часта помилка.

## Сімʼя

> [!diagram] Родинне дерево Оксани
> ```yaml
> layout: tree
> nodes:
>   - { id: gp, label: "grandparents", text: "grandmother + grandfather", tone: yellow }
>   - { id: mum, parent: gp, label: "mother (mum)", text: "Iryna", tone: pink }
>   - { id: aunt, parent: gp, label: "aunt", text: "Olha", tone: violet }
>   - { id: me, parent: mum, label: "me", text: "Oksana", tone: green, icon: "px:heart" }
>   - { id: bro, parent: mum, label: "brother", text: "Denys", tone: blue }
>   - { id: cous, parent: aunt, label: "cousin", text: "Marko", tone: mint }
> steps:
>   - { focus: gp, note: "Нагорі — grandparents: бабуся (grandmother) і дідусь (grandfather)." }
>   - { focus: [mum, aunt], note: "Їхні доньки — Ірина (мама Оксани) та Ольга. Для Оксани Ольга — aunt (тітка)." }
>   - { focus: [me, bro], note: "Оксана і Денис — діти Ірини: Оксана — daughter, Денис — son. Одне для одного вони sister і brother." }
>   - { focus: cous, note: "Син тітки — cousin, двоюрідний брат. Те саме слово і для двоюрідної сестри!" }
>   - { focus: [gp, me, bro, cous], note: "Для бабусі й дідуся Оксана, Денис і Марко — grandchildren (онуки)." }
> ```

| Чоловіки | Жінки | Обоє / разом |
|---|---|---|
| father (dad) — батько (тато) | mother (mum) — мати (мама) | parents — батьки |
| son — син | daughter — донька | children — діти |
| brother — брат | sister — сестра | brothers and sisters — брати й сестри |
| husband — чоловік (у шлюбі) | wife — дружина | |
| grandfather (grandad) — дідусь | grandmother (grandma) — бабуся | grandparents — бабуся й дідусь |
| uncle — дядько | aunt — тітка | |
| cousin — двоюрідний брат | cousin — двоюрідна сестра | cousins |

> [!tip] Mum чи Mom
> Британці кажуть **mum**, американці — **mom**. Обидва слова розмовні, як «мама». Офіційно — *mother*.

Як розповідати про сімʼю:

| Англійською | Переклад |
|---|---|
| I have one brother and two sisters. | У мене один брат і дві сестри. |
| I'm an only child. | Я єдина дитина в сімʼї. |
| My parents are from Poltava. | Мої батьки з Полтави. |
| My sister is married. Her husband is Italian. | Моя сестра заміжня. Її чоловік — італієць. |
| We're a big family. | У нас велика родина. |

Про *have / have got* для «у мене є» детально — у темі [[English - A1 - 11. Have got — що в мене є]]. Поки використовуй *I have…* як готову фразу.

## Зовнішність: What does she look like?

**What does he / she look like?** — «Як він / вона виглядає?» — питання про зовнішність.

| Що описуємо | Слова | Приклад |
|---|---|---|
| зріст | tall, short, medium height | He's tall. — Він високий. |
| статура | slim, thin, a bit overweight | She's slim. — Вона струнка. |
| вік | young, old, middle-aged | My uncle is middle-aged. — Мій дядько середнього віку. |
| волосся | long / short; dark / fair / blond / red / grey; straight / curly | She has long curly hair. — У неї довге кучеряве волосся. |
| очі | blue / green / brown / grey eyes | He has brown eyes. — У нього карі очі. |
| інше | a beard, a moustache, glasses | My dad has a beard. — У тата борода. |
| враження | beautiful, pretty, handsome, good-looking | Your daughter is very pretty. — Твоя донька дуже гарненька. |

> [!tip] Порядок слів: long dark hair
> Коли прикметників кілька: спершу **розмір / довжина**, потім **колір**, потім іменник: *long dark hair, short grey hair, big blue eyes*.

## Характер: What is she like?

**What is he / she like?** — «Який він / вона (як людина)?» — питання про характер.

| Позитивне | Негативне |
|---|---|
| kind — добрий | unkind — недобрий |
| friendly — привітний, дружній | unfriendly — непривітний |
| funny — смішний, з почуттям гумору | boring — нудний |
| clever — розумний | — |
| quiet — тихий, спокійний | loud — галасливий |
| hard-working — працьовитий | lazy — лінивий |

> [!diagram] look like чи be like
> ```yaml
> layout: compare
> columns: { look: "What does she look like?", like: "What is she like?" }
> nodes:
>   - { id: l1, col: look, label: "питаємо про", text: "зовнішність", tone: blue }
>   - { id: l2, col: look, label: "відповідь", text: "She's tall. She has red hair.", tone: green }
>   - { id: k1, col: like, label: "питаємо про", text: "характер", tone: violet }
>   - { id: k2, col: like, label: "відповідь", text: "She's kind and funny.", tone: green }
> steps:
>   - { focus: [l1, k1], note: "Обидва питання мають слово like, але питають різне." }
>   - { focus: l2, note: "look like — «виглядати як»: відповідаємо про зріст, волосся, очі." }
>   - { focus: k2, note: "be like — «бути яким»: відповідаємо про характер." }
>   - { focus: [l2, k2], note: "Підказка: в «зовнішньому» питанні є дієслово look — дивитися. Дивишся — бачиш зовнішність." }
> ```

## Тіло: базові слова

| | | |
|---|---|---|
| head — голова | face — обличчя | hair — волосся |
| eye — око | nose — ніс | mouth — рот |
| ear — вухо | arm — рука (від плеча) | hand — кисть, долоня |
| leg — нога | foot (feet) — стопа | tooth (teeth) — зуб |

> [!warning] Рука — це arm чи hand?
> Українське «рука» = *arm* (вся рука) або *hand* (кисть). *Give me your hand* — дай руку (долоню). *My arm hurts* — болить рука (вище кисті). Так само «нога» — *leg* (уся) або *foot* (стопа).

## Приклади

- This is my family: my mum, my dad, my brother and me. — Це моя сімʼя: мама, тато, брат і я.
- My grandparents live in a village. — Мої бабуся й дідусь живуть у селі.
- Her husband is tall and handsome. — Її чоловік високий і вродливий.
- My aunt has short blond hair and green eyes. — У моєї тітки коротке світле волосся і зелені очі.
- My little sister is very funny. — Моя молодша сестричка дуже смішна.
- What does your brother look like? — He's tall, with dark hair. — Як виглядає твій брат? — Високий, темноволосий.
- What's your boss like? — She's kind and clever. — Яка твоя начальниця? — Добра й розумна.
- I have my father's eyes. — У мене батькові очі.
- Their son is only two. — Їхньому синові лише два роки.

## Слова

### Родина

> [!word] family
> ipa: /ˈfæməli/ · pos: noun · level: A1 · id: en-a1-family-w01
> uk: сімʼя; родина
> example: I have a big **family**. — У мене велика родина.
> forms: family → families

> [!word] mother
> ipa: /ˈmʌðə/ · ipa-us: /ˈmʌðər/ · pos: noun · level: A1 · id: en-a1-family-w02
> uk: мати; мама
> example: My **mother** is a teacher. — Моя мама — вчителька.
> note: розмовне — mum (UK), mom (US).

> [!word] father
> ipa: /ˈfɑːðə/ · ipa-us: /ˈfɑːðər/ · pos: noun · level: A1 · id: en-a1-family-w03
> uk: батько; тато
> example: My **father** is fifty. — Моєму батькові пʼятдесят.
> note: розмовне — dad.

> [!word] parents
> ipa: /ˈpeərənts/ · ipa-us: /ˈperənts/ · pos: noun · level: A1 · id: en-a1-family-w04
> uk: батьки (мама й тато)
> example: My **parents** are in Lviv. — Мої батьки у Львові.
> note: не плутай: «родичі» — relatives.

> [!word] brother
> ipa: /ˈbrʌðə/ · ipa-us: /ˈbrʌðər/ · pos: noun · level: A1 · id: en-a1-family-w05
> uk: брат
> example: My **brother** is older than me. — Мій брат старший за мене.

> [!word] sister
> ipa: /ˈsɪstə/ · ipa-us: /ˈsɪstər/ · pos: noun · level: A1 · id: en-a1-family-w06
> uk: сестра
> example: I have two **sisters**. — У мене дві сестри.

> [!word] son
> ipa: /sʌn/ · pos: noun · level: A1 · id: en-a1-family-w07
> uk: син
> example: Their **son** is a doctor. — Їхній син — лікар.
> note: звучить так само, як sun — сонце.

> [!word] daughter
> ipa: /ˈdɔːtə/ · ipa-us: /ˈdɑːt̬ər/ · pos: noun · level: A1 · id: en-a1-family-w08
> uk: донька
> example: This is my **daughter**, Mia. — Це моя донька Мія.
> note: gh не читається: «до-оте».

> [!word] husband
> ipa: /ˈhʌzbənd/ · pos: noun · level: A1 · id: en-a1-family-w09
> uk: чоловік (у шлюбі)
> example: Her **husband** is from Canada. — Її чоловік з Канади.
> note: «чоловік» (про стать) — man; «мій чоловік» (у шлюбі) — my husband.

> [!word] wife
> ipa: /waɪf/ · pos: noun · level: A1 · id: en-a1-family-w10
> uk: дружина
> forms: wife → wives
> example: This is my **wife**, Natalia. — Це моя дружина Наталія.

> [!word] grandmother
> ipa: /ˈɡrænmʌðə/ · ipa-us: /ˈɡrænmʌðər/ · pos: noun · level: A1 · id: en-a1-family-w11
> uk: бабуся
> example: My **grandmother** is eighty. — Моїй бабусі вісімдесят.
> note: розмовне — grandma, gran (UK), granny.

> [!word] grandfather
> ipa: /ˈɡrænfɑːðə/ · ipa-us: /ˈɡrænfɑːðər/ · pos: noun · level: A1 · id: en-a1-family-w12
> uk: дідусь
> example: My **grandfather** has a beard. — У мого дідуся борода.
> note: розмовне — grandad, grandpa.

> [!word] aunt
> ipa: /ɑːnt/ · ipa-us: /ænt/ · pos: noun · level: A1 · id: en-a1-family-w13
> uk: тітка
> example: My **aunt** lives in Kyiv. — Моя тітка живе в Києві.

> [!word] uncle
> ipa: /ˈʌŋkl/ · pos: noun · level: A1 · id: en-a1-family-w14
> uk: дядько
> example: My **uncle** is very funny. — Мій дядько дуже смішний.

> [!word] cousin
> ipa: /ˈkʌzn/ · pos: noun · level: A1 · id: en-a1-family-w15
> uk: двоюрідний брат; двоюрідна сестра
> example: My **cousin** Marko is twenty. — Моєму двоюрідному брату Марку двадцять.
> note: одне слово для обох статей; читається «казн».

> [!word] boy
> ipa: /bɔɪ/ · pos: noun · level: A1 · id: en-a1-family-w16
> uk: хлопчик; хлопець
> example: Their son is a quiet **boy**. — Їхній син — тихий хлопчик.
> forms: boy → boys

> [!word] girl
> ipa: /ɡɜːl/ · ipa-us: /ɡɝːl/ · pos: noun · level: A1 · id: en-a1-family-w17
> uk: дівчинка; дівчина
> example: Who's that **girl**? — Хто та дівчина?

### Зовнішність

> [!word] tall
> ipa: /tɔːl/ · pos: adj · level: A1 · id: en-a1-family-w18
> uk: високий (про людей, дерева, будинки)
> example: My brother is very **tall**. — Мій брат дуже високий.
> note: про гору чи ціну — high.

> [!word] short
> ipa: /ʃɔːt/ · ipa-us: /ʃɔːrt/ · pos: adj · level: A1 · id: en-a1-family-w19
> uk: низький; короткий
> example: She's **short** and she has **short** hair. — Вона невисока, і в неї коротке волосся.

> [!word] young
> ipa: /jʌŋ/ · pos: adj · level: A1 · id: en-a1-family-w20
> uk: молодий
> example: Your mum looks very **young**! — Твоя мама виглядає дуже молодо!

> [!word] slim
> ipa: /slɪm/ · pos: adj · level: A1 · id: en-a1-family-w21
> uk: стрункий
> example: She's tall and **slim**. — Вона висока і струнка.
> note: fat — грубо; ввічливо — a bit overweight.

> [!word] beautiful
> ipa: /ˈbjuːtɪfl/ · pos: adj · level: A1 · id: en-a1-family-w22
> uk: гарний; красивий; прекрасний
> example: What a **beautiful** baby! — Яке гарне малятко!

> [!word] handsome
> ipa: /ˈhænsəm/ · pos: adj · level: A1 · id: en-a1-family-w23
> uk: вродливий (зазвичай про чоловіків)
> example: Her husband is very **handsome**. — Її чоловік дуже вродливий.
> note: d не читається: «хенсем».

> [!word] hair
> ipa: /heə/ · ipa-us: /her/ · pos: noun · level: A1 · id: en-a1-family-w24
> uk: волосся
> example: She has long dark **hair**. — У неї довге темне волосся.
> note: незлічуване — hair is, без -s (a hair — одна волосина).

> [!word] eye
> ipa: /aɪ/ · pos: noun · level: A1 · id: en-a1-family-w25
> uk: око
> example: He has blue **eyes**. — У нього блакитні очі.

> [!word] beard
> ipa: /bɪəd/ · ipa-us: /bɪrd/ · pos: noun · level: A1 · id: en-a1-family-w26
> uk: борода
> example: My dad has a grey **beard**. — У тата сива борода.

> [!word] fair
> ipa: /feə/ · ipa-us: /fer/ · pos: adj · level: A1 · id: en-a1-family-w27
> uk: світлий (про волосся, шкіру)
> example: Both children have **fair** hair. — В обох дітей світле волосся.

> [!word] dark
> ipa: /dɑːk/ · ipa-us: /dɑːrk/ · pos: adj · level: A1 · id: en-a1-family-w28
> uk: темний
> example: My cousin has **dark** eyes. — У мого двоюрідного брата темні очі.

> [!word] curly
> ipa: /ˈkɜːli/ · ipa-us: /ˈkɝːli/ · pos: adj · level: A1 · id: en-a1-family-w29
> uk: кучерявий
> example: Her hair is short and **curly**. — У неї коротке кучеряве волосся.
> note: протилежне — straight /streɪt/, пряме.

### Характер

> [!word] kind
> ipa: /kaɪnd/ · pos: adj · level: A1 · id: en-a1-family-w30
> uk: добрий
> example: My grandmother is very **kind**. — Моя бабуся дуже добра.

> [!word] funny
> ipa: /ˈfʌni/ · pos: adj · level: A1 · id: en-a1-family-w31
> uk: смішний; кумедний
> example: My uncle is so **funny**! — Мій дядько такий кумедний!

> [!word] friendly
> ipa: /ˈfrendli/ · pos: adj · level: A1 · id: en-a1-family-w32
> uk: привітний; дружній
> example: Our neighbours are very **friendly**. — Наші сусіди дуже привітні.

> [!word] clever
> ipa: /ˈklevə/ · ipa-us: /ˈklevər/ · pos: adj · level: A1 · id: en-a1-family-w33
> uk: розумний; кмітливий
> example: She's a **clever** girl. — Вона розумна дівчинка.
> note: US частіше smart.

> [!word] lazy
> ipa: /ˈleɪzi/ · pos: adj · level: A1 · id: en-a1-family-w34
> uk: лінивий
> example: My cat is fat and **lazy**. — Мій кіт товстий і лінивий.

> [!word] quiet
> ipa: /ˈkwaɪət/ · pos: adj · level: A1 · id: en-a1-family-w35
> uk: тихий; спокійний
> example: He's a **quiet** boy. — Він тихий хлопчик.
> note: не плутай з quite /kwaɪt/ — досить.

### Тіло

> [!word] head
> ipa: /hed/ · pos: noun · level: A1 · id: en-a1-family-w36
> uk: голова
> example: Put your hat on your **head**. — Надінь шапку.

> [!word] face
> ipa: /feɪs/ · pos: noun · level: A1 · id: en-a1-family-w37
> uk: обличчя
> example: She has a beautiful **face**. — У неї гарне обличчя.

> [!word] hand
> ipa: /hænd/ · pos: noun · level: A1 · id: en-a1-family-w38
> uk: рука (кисть); долоня
> example: Wash your **hands**, please. — Помий руки, будь ласка.

> [!word] arm
> ipa: /ɑːm/ · ipa-us: /ɑːrm/ · pos: noun · level: A1 · id: en-a1-family-w39
> uk: рука (від плеча до кисті)
> example: The baby is in her mother's **arms**. — Малюк на руках у мами.

> [!word] leg
> ipa: /leɡ/ · pos: noun · level: A1 · id: en-a1-family-w40
> uk: нога
> example: A spider has eight **legs**. — У павука вісім ніг.

## Слухаємо

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: en-a1-family-l01
> audio: My cousin has short curly hair.
> - [x] My cousin has short curly hair.
> - [ ] My cousin has long curly hair.
> - [ ] My cousin has short dark hair.

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: en-a1-family-l02
> audio: Her husband is tall and quiet.
> - [ ] Her husband is tall and quite.
> - [x] Her husband is tall and quiet.
> - [ ] His wife is tall and quiet.

> [!listen] Напиши або скажи, що почув
> level: A1 · type: dictation · speed: slow · id: en-a1-family-l03
> audio: My parents are very kind.

> [!listen] Напиши або скажи, що почув
> level: A1 · type: dictation · speed: slow · id: en-a1-family-l04
> audio: What does your sister look like?

> [!listen] Послухай. Хто такий Ден?
> level: A1 · type: answer · speed: slow · id: en-a1-family-l05
> audio: A: Who's that in the photo?
> audio: B: That's Dan, my aunt's son.
> - [ ] брат
> - [ ] дядько
> - [x] двоюрідний брат
> - [ ] син

> [!listen] Послухай. Який новий начальник?
> level: A1 · type: answer · speed: slow · id: en-a1-family-l06
> audio: A: What's your new boss like?
> audio: B: He's very friendly and funny. And he's young, about thirty.
> - [x] привітний, з гумором, молодий
> - [ ] суворий, тихий, літній
> - [ ] лінивий і нудний

## Вимова

> [!speak] Скажи вголос
> level: A1 · id: en-a1-family-s01
> text: mother, father, brother
> ipa: /ˈmʌðə ˈfɑːðə ˈbrʌðə/
> tip: th тут дзвінкий /ð/: кінчик язика між зубами. Не «мазер» і не «мадер».

> [!speak] Скажи вголос
> level: A1 · id: en-a1-family-s02
> text: This is my daughter and this is my son.
> ipa: /ˌðɪs ɪz maɪ ˈdɔːtə ənd ˌðɪs ɪz maɪ ˈsʌn/
> tip: daughter — «до-оте», gh не читається; son — коротке /ʌ/, як «сан».

> [!speak] Скажи вголос
> level: A1 · id: en-a1-family-s03
> text: She has long dark hair and blue eyes.
> ipa: /ʃi hæz lɒŋ dɑːk ˈheər ənd bluː ˈaɪz/
> tip: hair — «хеа», з видихом /h/; eyes — «айз», дзвінке z.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-family-s04
> text: What does he look like?
> ipa: /ˌwɒt dəz hi ˈlʊk laɪk/
> tip: does тут слабке /dəz/. Look — коротке /ʊ/, не «лук» з довгим «у».

> [!speak] Скажи вголос
> level: A1 · id: en-a1-family-s05
> text: My cousin is kind and funny.
> ipa: /maɪ ˈkʌzn ɪz ˈkaɪnd ən ˈfʌni/
> tip: cousin — «казн», не «кузин».

## Типові помилки українців

> [!pitfall] parents ≠ родичі
> *My parents* — лише мама й тато. Уся рідня — **relatives**: *I have a lot of relatives in Kharkiv.* А «батьківщина» — *homeland*.

> [!pitfall] «She has long hairs»
> *Hair* (волосся на голові) — **незлічуване**: *She has long hair. Her hair **is** dark.* *Hairs* — окремі волосини: *There are two cat hairs on my coat.*

> [!pitfall] «What is he look like?» і плутанина з like
> Про зовнішність — **What does he look like?** Про характер — **What is he like?** І ніякого *like* у відповіді: *He's tall* (не «He's like tall»).

## Ситуація: фото на телефоні

> [!listen] Подруги розглядають фото
> level: A1 · type: choice · speed: slow · id: en-a1-family-l07
> audio: A: Is this your family?
> audio: B: Yes. This is my mum, and this is my dad. He's very funny.
> audio: A: And who's the tall boy with fair hair?
> audio: B: That's my brother, Oleh. He's sixteen.
> - [x] Брат — високий світловолосий, йому 16; тато — веселий.
> - [ ] Брат — низький і темноволосий; тато — тихий.
> - [ ] На фото лише мама.

Розкажи про свою сімʼю вголос.

> [!speak] «Це моя мама. Вона добра й весела».
> level: A1 · id: en-a1-family-s06
> text: This is my mum. She's kind and funny.
> ipa: /ˌðɪs ɪz maɪ ˈmʌm ʃiːz ˈkaɪnd ən ˈfʌni/
> tip: mum — коротке /ʌ/: «мам». Американці кажуть mom /mɑːm/.

## Практика

> [!quiz] Хто для тебе син твоєї тітки?
> level: A1 · id: en-a1-family-q02
> - [ ] uncle
> - [ ] nephew
> - [x] cousin
> - [ ] brother
>
> **Пояснення:** діти тітки чи дядька — *cousins*, двоюрідні брати й сестри.

> [!quiz] Подруга питає: «What's your brother like?» Що вона хоче знати?
> level: A1 · id: en-a1-family-q03
> - [ ] як він виглядає
> - [x] який у нього характер
> - [ ] що він любить
> - [ ] скільки йому років
>
> **Пояснення:** *What is he like?* — про характер. Про зовнішність — *What does he look like?*

> [!quiz] Обери всі правильні речення
> level: A1 · type: multi · id: en-a1-family-q04
> - [x] She has long hair.
> - [ ] She has long hairs.
> - [x] My parents are teachers.
> - [ ] He has blue eye.
> - [x] Her hair is fair.
>
> **Пояснення:** *hair* — без -s і з *is*; очей двоє — *blue eyes*.

> [!quiz] Яке слово зайве (не про зовнішність)?
> level: A1 · id: en-a1-family-q05
> - [ ] tall
> - [ ] slim
> - [x] lazy
> - [ ] handsome
>
> **Пояснення:** *lazy* (лінивий) — риса характеру, решта — зовнішність.

> [!quiz] Заповни пропуски: родина
> level: A1 · type: fill · bank · id: en-a1-family-q06
>
> ```text fill
> My mother's mother is my [[grandmother]].
> My father's brother is my [[uncle]].
> My uncle's daughter is my [[cousin]].
> My mum's sister is my [[aunt]].
> ```
>
> **Пояснення:** мамина мама — *grandmother*, татів брат — *uncle*, донька дядька — *cousin*, мамина сестра — *aunt*.

> [!quiz] Заповни пропуски: опис людини
> level: A1 · type: fill · bank: hairs, high · id: en-a1-family-q07
>
> ```text fill
> My friend Ira is [[tall]] and slim.
> She has long dark [[hair]] and brown [[eyes]].
> She's very [[kind]] and friendly.
> ```
>
> **Пояснення:** про зріст людини — *tall* (не *high*), волосся — *hair* без -s, очі — *eyes*.

> [!quiz] Склади питання про зовнішність
> level: A1 · type: order · id: en-a1-family-q08
>
> ```text order
> What
> does
> your
> sister
> look
> like?
> ```
>
> **Пояснення:** *What does + підмет + look like?* — питання про зовнішність.

> [!quiz] Склади речення: «У нього коротке світле волосся»
> level: A1 · type: order · id: en-a1-family-q09
>
> ```text order
> He
> has
> short
> fair
> hair.
> hairs. // ✗
> ```
>
> **Пояснення:** порядок: довжина → колір → *hair*. *Hair* — незлічуване, без -s.

> [!quiz] Як перекласти «Моя дружина висока й розумна»?
> level: A1 · id: en-a1-family-q10
> - [ ] My wife is high and clever.
> - [x] My wife is tall and clever.
> - [ ] My wife is a tall and clever.
> - [ ] My wife tall and clever.
>
> **Пояснення:** людина — *tall*; перед прикметником без іменника артикль не потрібен; і не забудь *is*.

## Фішки

> [!reel] 👫 Чому cousin один на всіх
> Слово *cousin* прийшло з французької і не має роду: двоюрідний брат і двоюрідна сестра — одне слово. Хочеш уточнити — кажи *my cousin Anna* або *my female cousin*.

> [!reel] 👨‍👩‍👧 Mum, Mom, Mam
> В Англії — *mum*, у США — *mom*, в Ірландії та на півночі Англії часто — *mam*. А малеча всюди каже *mummy* (UK) чи *mommy* (US).

> [!reel] 💇 Fair — це і «світлий», і «чесний»
> *Fair hair* — світле волосся, *a fair price* — чесна ціна, *It's not fair!* — Це нечесно! Одне слово, кілька значень — памʼятай про контекст.

## Джерела та що почитати

- [British Council LearnEnglish](https://learnenglish.britishcouncil.org/) — словникові вправи *Family* і *Describing people*.
- [Cambridge Dictionary](https://dictionary.cambridge.org/) — вимова й приклади до *cousin, daughter, handsome*.
- [BBC Learning English](https://www.bbc.co.uk/learningenglish/) — уроки для початківців про сімʼю й опис людей.

> [!important] Підсумок
> - *Parents* — мама й тато; родичі — *relatives*; *cousin* — двоюрідний брат або сестра.
> - Зовнішність: *What does she look like? — She's tall. She has long dark hair.*
> - Характер: *What is she like? — She's kind and funny.*
> - *Hair* — незлічуване: *her hair is long*; людина — *tall*, а не *high*.
> - Рука: *arm* (уся) і *hand* (кисть); нога: *leg* і *foot*.
