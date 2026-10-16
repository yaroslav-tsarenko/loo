---
title: Have got — що в мене є
order: 111
id: en-a1-have-got
level: A1
icon: px:chest
tags: [english, a1, grammar, have-got, possession]
prerequisites: ["[[English - A1 - 10. Дифтонги]]"]
estimatedMinutes: 35
---

# Have got — що в мене є

> [!success] Після цієї теми ти зможеш
> - сказати, що в тебе є: *I've got a car. She's got two brothers.*;
> - заперечити й спитати: *I haven't got time. Have you got a pen?*;
> - коротко відповісти: *Yes, I have. / No, she hasn't.*;
> - вживати американський (і загальний) варіант: *Do you have a pen? — I don't have time.*;
> - не казати «I have 20 years».

## Передбач

> [!quiz] Як англійською «У мене є сестра»?
> level: A1 · id: en-a1-have-got-q01
> - [ ] By me is a sister.
> - [ ] I am a sister.
> - [x] I've got a sister.
> - [ ] To me is sister.
>
> **Пояснення:** українське «у мене є» англійською перевертається: «**я маю**» — *I have got* (*I've got*) або просто *I have*. Хто має — той і підмет.

## У мене є = I have got

Українською володіння звучить як «у мене **є** щось». Англійською — як «я **маю** щось»: власник стає підметом.

| Українською | Англійською (UK, розмовне) | Англійською (загальне) |
|---|---|---|
| У мене є машина. | I've got a car. | I have a car. |
| У неї двоє дітей. | She's got two children. | She has two children. |
| У тебе є хвилинка? | Have you got a minute? | Do you have a minute? |
| У нас немає часу. | We haven't got time. | We don't have time. |

> [!diagram] Як «у мене є» стає «I've got»
> ```yaml
> layout: flow
> nodes:
>   - { id: uk, label: "українською", text: "У мене є кіт.", tone: yellow }
>   - { id: owner, label: "хто має?", text: "?", tone: blue }
>   - { id: verb, label: "дієслово", text: "?", tone: violet }
>   - { id: thing, label: "що?", text: "?", tone: green }
> steps:
>   - { focus: uk, note: "Українською власник «ховається» в «у мене», а підмет — кіт. Англійською навпаки." }
>   - { set: { owner: "I" }, focus: owner, note: "Хто має кота? Я. Отже, підмет — I." }
>   - { set: { verb: "have got → 've got" }, focus: verb, note: "Для I, you, we, they — have got. У розмові скорочуємо: I've got." }
>   - { set: { thing: "a cat" }, focus: thing, note: "Що маю? Кота — a cat. Разом: I've got a cat." }
>   - { set: { uk: "У неї є кіт.", owner: "she", verb: "has got → 's got" }, note: "Для he, she, it — has got: She's got a cat." }
> ```

## Форми have got

| | Ствердження | Заперечення | Питання |
|---|---|---|---|
| I / you / we / they | I **have got** = I**'ve got** | I **haven't got** | **Have** you **got**…? |
| he / she / it | she **has got** = she**'s got** | she **hasn't got** | **Has** she **got**…? |

Короткі відповіді — **без got**:

| Питання | Так | Ні |
|---|---|---|
| Have you got a pen? | Yes, I have. | No, I haven't. |
| Has he got a car? | Yes, he has. | No, he hasn't. |
| Have they got kids? | Yes, they have. | No, they haven't. |

> [!warning] She's — це is чи has?
> *She's* може бути і *she is*, і *she has*. Дивись, що далі: **got** → has (*She's got a dog* — у неї є собака); прикметник, імʼя, місце → is (*She's tall. She's at home.*).

## Have без got: американський і загальний варіант

В американській англійській (і дедалі частіше в британській, особливо на письмі) кажуть просто **have**, а заперечення й питання будують із **do / does** — як у звичайного дієслова:

| | have got (UK, розмовне) | have + do / does (US і загальне) |
|---|---|---|
| + | I've got a car. / She's got a car. | I have a car. / She **has** a car. |
| − | I haven't got a car. / She hasn't got a car. | I **don't have** a car. / She **doesn't have** a car. |
| ? | Have you got a car? / Has she got a car? | **Do** you **have** a car? / **Does** she **have** a car? |
| коротко | Yes, I have. / No, she hasn't. | Yes, I do. / No, she doesn't. |

> [!diagram] Дві системи — не змішуй
> ```yaml
> layout: compare
> columns: { uk: "have got", us: "have + do / does" }
> nodes:
>   - { id: u1, col: uk, label: "питання", text: "Have you got a pen?", tone: blue }
>   - { id: u2, col: uk, label: "відповідь", text: "Yes, I have.", tone: green }
>   - { id: u3, col: uk, label: "заперечення", text: "I haven't got a pen.", tone: red }
>   - { id: s1, col: us, label: "питання", text: "Do you have a pen?", tone: blue }
>   - { id: s2, col: us, label: "відповідь", text: "Yes, I do.", tone: green }
>   - { id: s3, col: us, label: "заперечення", text: "I don't have a pen.", tone: red }
> steps:
>   - { focus: [u1, s1], note: "Обидва питання правильні й означають одне: «У тебе є ручка?»" }
>   - { focus: u1, note: "У have got питання робить сам have: Have you got…? Got лишається після підмета." }
>   - { focus: s1, note: "Без got have — звичайне дієслово, тому потрібен помічник do: Do you have…?" }
>   - { focus: [u2, s2], note: "Відповідаємо тим самим помічником: Have…? → Yes, I have. Do…? → Yes, I do." }
>   - { focus: [u3, s3], note: "Заперечення: haven't got або don't have. А «Do you have got» і «I don't have got» — помилки." }
> ```

Деталі про *do / does* — у темі [[English - A1 - 15. Present Simple — питання й заперечення]]. Поки запамʼятай дві пари: *Have you got…? / Do you have…?*

## Що «маємо» через have got

| Що | Приклад | Переклад |
|---|---|---|
| речі | I've got a new laptop. | У мене новий ноутбук. |
| родина, друзі, тварини | She's got two brothers and a cat. | У неї два брати й кіт. |
| зовнішність | He's got blue eyes and a beard. | У нього блакитні очі й борода. |
| хвороби | I've got a cold. | Я застудився. |
| справи, час | I've got a meeting at ten. Have you got a minute? | У мене зустріч о десятій. Маєш хвилинку? |
| питання, проблеми, ідеї | I've got a question. We've got a problem. | У мене питання. У нас проблема. |

> [!tip] Have got — лише «мати»
> *Have* у значенні дії — *have breakfast, have a shower, have a good time* — **без got**: *I have breakfast at 8*. «I've got breakfast at 8» звучить дивно. *Have got* = лише «мати, володіти».

## Приклади

- I've got two cousins in Canada. — У мене два двоюрідні брати в Канаді.
- My grandad hasn't got a mobile. — У мого дідуся немає мобільного.
- Have you got any brothers or sisters? — Yes, I have. One sister. — У тебе є брати чи сестри? — Так, одна сестра.
- She's got long red hair. — У неї довге руде волосся.
- Sorry, I haven't got time now. — Вибач, зараз у мене немає часу.
- Does your flat have a balcony? — Yes, it does. — У твоїй квартирі є балкон? — Так.
- We don't have a car. We go everywhere by bike. — У нас немає машини. Ми всюди їздимо на велосипеді.
- Has he got a cold? — Yes, poor thing. — Він застудився? — Так, бідолаха.
- I've got an idea! — У мене є ідея!

## Слова

> [!word] car
> ipa: /kɑː/ · ipa-us: /kɑːr/ · pos: noun · level: A1 · id: en-a1-have-got-w01
> uk: машина; автомобіль
> example: Have you got a **car**? — У тебе є машина?

> [!word] cold
> ipa: /kəʊld/ · ipa-us: /koʊld/ · pos: noun · level: A1 · id: en-a1-have-got-w02
> uk: застуда
> example: I've got a **cold**. — Я застудився.
> note: прикметник cold — холодний: It's cold. I'm cold.

> [!word] question
> ipa: /ˈkwestʃən/ · pos: noun · level: A1 · id: en-a1-have-got-w03
> uk: питання
> example: I've got a **question**. — У мене питання.

> [!word] problem
> ipa: /ˈprɒbləm/ · ipa-us: /ˈprɑːbləm/ · pos: noun · level: A1 · id: en-a1-have-got-w04
> uk: проблема
> example: We've got a **problem**. — У нас проблема.
> note: No problem! — Без проблем!

> [!word] meeting
> ipa: /ˈmiːtɪŋ/ · pos: noun · level: A1 · id: en-a1-have-got-w05
> uk: зустріч; збори; нарада
> example: I've got a **meeting** at three. — У мене зустріч о третій.

> [!word] free time
> ipa: /ˌfriː ˈtaɪm/ · pos: noun · level: A1 · id: en-a1-have-got-w06
> uk: вільний час
> example: I haven't got much **free time**. — У мене небагато вільного часу.

> [!word] camera
> ipa: /ˈkæmərə/ · pos: noun · level: A1 · id: en-a1-have-got-w07
> uk: фотоапарат; камера
> example: Has your phone got a good **camera**? — У твого телефона хороша камера?

> [!word] computer
> ipa: /kəmˈpjuːtə/ · ipa-us: /kəmˈpjuːt̬ər/ · pos: noun · level: A1 · id: en-a1-have-got-w08
> uk: компʼютер
> example: We've got two **computers** at home. — У нас удома два компʼютери.

> [!word] plan
> ipa: /plæn/ · pos: noun · level: A1 · id: en-a1-have-got-w09
> uk: план
> example: Have you got any **plans** for Saturday? — У тебе є плани на суботу?

> [!word] nephew
> ipa: /ˈnefjuː/ · pos: noun · level: A1 · id: en-a1-have-got-w10
> uk: племінник
> example: I've got a **nephew** and a niece. — У мене є племінник і племінниця.

> [!word] niece
> ipa: /niːs/ · pos: noun · level: A1 · id: en-a1-have-got-w11
> uk: племінниця
> example: My **niece** has got curly hair. — У моєї племінниці кучеряве волосся.

> [!word] tattoo
> ipa: /tæˈtuː/ · pos: noun · level: A1 · id: en-a1-have-got-w12
> uk: татуювання
> example: He's got a **tattoo** on his arm. — У нього татуювання на руці.

## Слухаємо

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: en-a1-have-got-l01
> audio: She's got a cold.
> - [x] She's got a cold.
> - [ ] She's cold.
> - [ ] She hasn't got a cold.

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: en-a1-have-got-l02
> audio: Do you have a minute?
> - [ ] Have you got a minute?
> - [x] Do you have a minute?
> - [ ] Do you have a meeting?

> [!listen] Надрукуй почуте
> level: A1 · type: dictation · speed: slow · id: en-a1-have-got-l03
> audio: I haven't got time.

> [!listen] Надрукуй почуте
> level: A1 · type: dictation · speed: slow · id: en-a1-have-got-l04
> audio: Has he got any children?

> [!listen] Послухай діалог. Що є в Сема?
> level: A1 · type: answer · speed: slow · id: en-a1-have-got-l05
> audio: A: Have you got a pet, Sam?
> audio: B: Yes, I have. I've got a dog. But I haven't got a cat.
> audio: A: Have you got a car?
> audio: B: No, I haven't. I've got a bike.
> - [x] собака й велосипед
> - [ ] кіт і машина
> - [ ] собака й машина

## Вимова

> [!speak] Скажи вголос
> level: A1 · id: en-a1-have-got-s01
> text: I've got a question.
> ipa: /aɪv ˈɡɒt ə ˈkwestʃən/
> tip: I've — «айв», з коротким дзвінким /v/. Не пропускай його: «I got» звучить інакше.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-have-got-s02
> text: She's got two brothers.
> ipa: /ʃiːz ˈɡɒt tuː ˈbrʌðəz/
> tip: brothers — /ð/ посередині й дзвінке /z/ у кінці.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-have-got-s03
> text: Have you got a minute?
> ipa: /həv juː ˈɡɒt ə ˈmɪnɪt/
> tip: have тут слабке /həv/; голос угору ↗ наприкінці.

> [!speak] Скажи вголос
> level: A1 · id: en-a1-have-got-s04
> text: No, I haven't. Yes, he has.
> ipa: /nəʊ aɪ ˈhævnt jes hi ˈhæz/
> tip: у коротких відповідях have / has наголошені й повні: «хевнт», «хез».

> [!speak] Скажи вголос
> level: A1 · id: en-a1-have-got-s05
> text: We don't have a car.
> ipa: /wi ˌdəʊnt hæv ə ˈkɑː/
> tip: don't — «доунт», дифтонг /əʊ/, а не «донт».

## Типові помилки українців

> [!pitfall] «I have 20 years»
> Вік — це не річ, яку «мають». **I'm 20** (*I'm 20 years old*). Пастка з'являється саме тут, бо «have» вже асоціюється з «у мене є». Див. [[English - A1 - 04. Числа, вік і номер телефону]].

> [!pitfall] «Do you have got…?», «I don't have got…»
> Дві системи не змішуються: або **Have you got…? / I haven't got**, або **Do you have…? / I don't have**. Got живе лише з have-помічником.

> [!pitfall] «I've got breakfast at 8»
> *Have got* — тільки про володіння. Для дій — *have* без got: **I have breakfast at 8. We have a lesson on Monday. Have a nice day!**

## Ситуація: у кафе з колегою

> [!listen] Колеги домовляються
> level: A1 · type: choice · speed: slow · id: en-a1-have-got-l06
> audio: A: Have you got a minute, Olha?
> audio: B: Sorry, I haven't. I've got a meeting at two.
> audio: A: OK. Have you got time after the meeting?
> audio: B: Yes, I have. Let's talk at four.
> - [x] Зараз Ольга зайнята, поговорять о четвертій.
> - [ ] Ольга вільна прямо зараз.
> - [ ] Зустріч о четвертій, розмова о другій.

Відповідай колезі вголос.

> [!speak] «Вибач, ні. У мене зустріч о другій».
> level: A1 · id: en-a1-have-got-s06
> text: Sorry, I haven't. I've got a meeting at two.
> ipa: /ˈsɒri aɪ ˈhævnt aɪv ɡɒt ə ˈmiːtɪŋ ət ˈtuː/
> tip: meeting — довге /iː/ і -ng без «г» у кінці.

## Практика

> [!quiz] Обери правильне: «My brother ___ a new job.»
> level: A1 · id: en-a1-have-got-q02
> - [ ] have got
> - [x] has got
> - [ ] is got
> - [ ] got have
>
> **Пояснення:** *my brother* = *he* → *has got* (*'s got*).

> [!quiz] «Have you got a pen?» Яка коротка відповідь правильна?
> level: A1 · id: en-a1-have-got-q03
> - [ ] Yes, I have got.
> - [x] Yes, I have.
> - [ ] Yes, I do.
> - [ ] Yes, I've.
>
> **Пояснення:** у короткій відповіді — без *got* і без скорочення: *Yes, I have.* *Yes, I do* — відповідь на *Do you have…?*

> [!quiz] Обери всі правильні речення
> level: A1 · type: multi · id: en-a1-have-got-q04
> - [x] I haven't got a car.
> - [x] I don't have a car.
> - [ ] I don't have got a car.
> - [ ] I haven't a car got.
> - [x] Does she have a dog?
>
> **Пояснення:** правильні дві системи: *haven't got* і *don't have*. Змішувати їх не можна.

> [!quiz] Що означає «She's got blue eyes»?
> level: A1 · id: en-a1-have-got-q05
> - [ ] Вона дивиться блакитними очима.
> - [x] У неї блакитні очі.
> - [ ] Вона отримала блакитні очі.
> - [ ] Вона — блакитні очі.
>
> **Пояснення:** *'s got* тут = *has got* (бо далі *got*) — «має».

> [!quiz] Як перекласти «Мені 18, і в мене є молодший брат»?
> level: A1 · id: en-a1-have-got-q06
> - [ ] I have 18 and I have got a younger brother.
> - [x] I'm 18 and I've got a younger brother.
> - [ ] I'm 18 and I'm got a younger brother.
> - [ ] I've got 18 and a younger brother.
>
> **Пояснення:** вік — через *be* (*I'm 18*), володіння — через *have got*.

> [!quiz] Заповни пропуски: have got / has got
> level: A1 · type: fill · bank · id: en-a1-have-got-q07
>
> ```text fill
> I [[have]] got two cousins.
> My sister [[has]] got a tattoo.
> We [[have]] got a big garden.
> Our cat [[has]] got green eyes.
> ```
>
> **Пояснення:** I / we → *have got*; my sister, our cat (= she, it) → *has got*.

> [!quiz] Заповни діалог (британський варіант)
> level: A1 · type: fill · bank: do, does · id: en-a1-have-got-q08
>
> ```text fill
> A: [[Have]] you got a pet?
> B: No, I [[haven't]]. But my sister [[has]] got two rabbits.
> A: [[Has]] she got a dog too?
> ```
>
> **Пояснення:** у системі *have got* питання й відповіді будує сам *have / has*. *Do / does* тут зайві.

> [!quiz] Заповни діалог (американський варіант)
> level: A1 · type: fill · bank: have got, has · id: en-a1-have-got-q09
>
> ```text fill
> A: [[Do]] you have a car?
> B: Yes, I [[do]]. And my wife [[has]] a motorbike.
> A: [[Does]] she have a licence?
> ```
>
> **Пояснення:** без *got* питання й короткі відповіді — через *do / does*. Після *does* — *have*, не *has*.

> [!quiz] Склади питання: «У тебе є хвилинка?»
> level: A1 · type: order · id: en-a1-have-got-q10
>
> ```text order
> Have
> you
> got
> a
> minute?
> do // ✗
> ```
>
> **Пояснення:** *Have + підмет + got + решта?*

> [!quiz] Склади речення: «У неї немає часу»
> level: A1 · type: order · id: en-a1-have-got-q11
>
> ```text order
> She
> hasn't
> got
> time.
> haven't // ✗
> ```
>
> **Пояснення:** *she* → *hasn't got*.

> [!quiz] Що означає «He's tired» і «He's got a car»?
> level: A1 · id: en-a1-have-got-q12
> - [ ] обидва 's = has
> - [ ] обидва 's = is
> - [x] у першому 's = is, у другому 's = has
> - [ ] у першому 's = has, у другому 's = is
>
> **Пояснення:** після *'s* стоїть прикметник *tired* → *is*; стоїть *got* → *has*.

## Фішки

> [!reel] 🇬🇧 Got — «зайве» слово, яке полюбили британці
> Формально *got* у *have got* нічого не додає: *I have a car* = *I've got a car*. Але скорочене *I've* звучить надто коротко, і *got* дає реченню «опору». Тому в розмові британці обожнюють *have got*.

> [!reel] 🇺🇸 Gotten — американське слово
> В американській є форма *gotten* (*I've gotten better* — мені стало краще). Але *have got* у значенні «мати» навіть американці кажуть з *got*: *I've got a question.*

> [!reel] 🎵 I've got a feeling
> *I've got* звучить у сотнях пісень: від The Beatles (*I've Got a Feeling*) до сучасного попу. Слухаєш — і граматика заходить сама.

## Джерела та що почитати

- [British Council LearnEnglish — A1–A2 grammar](https://learnenglish.britishcouncil.org/grammar/a1-a2-grammar) — розділ *have got*.
- [Cambridge Dictionary — English Grammar Today](https://dictionary.cambridge.org/grammar/british-grammar/) — стаття *Have got and have*.
- R. Murphy — *Essential Grammar in Use*, units 9–10 (have got, have).
- M. Swan — *Practical English Usage*, розділ про *have* і *have got*.

> [!important] Підсумок
> - «У мене є» → *I've got* / *I have*: власник — підмет.
> - *I / you / we / they have got*, *he / she / it has got*; заперечення — *haven't / hasn't got*.
> - Питання — *Have you got…?*; коротко — *Yes, I have / No, I haven't* (без got).
> - Загальний / US варіант: *I have*, *I don't have*, *Do you have…? — Yes, I do.* Не змішуй системи.
> - Вік — *I'm 20*, а дії — *have breakfast* без got.
