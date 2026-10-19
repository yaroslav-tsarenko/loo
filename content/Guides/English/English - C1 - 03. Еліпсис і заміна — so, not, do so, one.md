---
title: Еліпсис і заміна — so, not, do so, one
order: 503
id: en-c1-ellipsis
level: C1
icon: px:puzzle
tags: [english, c1, grammar, ellipsis, substitution, cohesion, register, ielts]
prerequisites: ["[[English - B1 - 26. Question tags і непрямі питання]]", "[[English - B2 - 10. Звʼязки — although, despite, whereas, however]]"]
estimatedMinutes: 40
---

# Еліпсис і заміна — so, not, do so, one

> [!success] Після цієї теми ти зможеш
> - замінювати ціле речення одним словом: *I think **so***, *I hope **not***, *I'm afraid **so***, ***If so**, …*, ***If not**, …*;
> - уникати повторів через ***one / ones***, ***do***, ***do so***;
> - скорочувати відповіді до «якоря» — допоміжного дієслова чи *to*: *Yes, I **have**.*, *I'd love **to**.*, *She might **be**.*;
> - розрізняти розмовний еліпсис (*Sounds good. Want a coffee?*) і формальну заміну (*may **do so***);
> - писати звʼязно без повторів у IELTS Writing Task 2 і відповідати коротко, але розгорнуто в Speaking Part 3 (C1 ≈ IELTS 7.0–8.0).

## Передбач

> [!quiz] «Ти прийдеш на вечірку? — Сподіваюся, що так». Як відповісти?
> level: C1 · id: en-c1-ellipsis-q01
> - [ ] I hope that yes.
> - [x] I hope so.
> - [ ] I hope it.
> - [ ] I hope yes.
>
> **Пояснення:** англійська не повторює «що так» — ціле речення (*that I'll come*) замінює одне слово ***so***: *I hope **so**.* *I hope that yes* — дослівна калька з української.

## Простими словами

Жива мова економна: те, що співрозмовник і так зрозуміє, ми не повторюємо. Українська робить це вільно: «Думаю, що так», «Хочеш? — Хочу», «Ти закінчив? — Так». Англійська теж економить, але за чіткими правилами. Є два інструменти:

1. **Заміна (substitution)** — ставимо коротке слово замість частини речення: ***so / not*** (замість речення), ***one / ones*** (замість іменника), ***do / do so*** (замість дієслова з усім, що після нього).
2. **Еліпсис (ellipsis)** — просто пропускаємо частину, але лишаємо **«якір»**: допоміжне чи модальне дієслово або частку *to*. *Have you finished? — Yes, I **have**.* *Would you like to come? — I'd love **to**.*

Головне правило: в англійській охоче пропускають слова, але **не викидають каркас** — допоміжне дієслово й *to* лишаються.

> [!diagram] Від повтору до заміни й еліпсиса
> ```yaml
> layout: flow
> nodes:
>   - { id: q, label: "питання", text: "Are you coming to the party?", tone: gray }
>   - { id: full, label: "повтор (громіздко)", text: "Yes, I'm coming to the party.", tone: orange }
>   - { id: ell, label: "еліпсис — лишаємо якір", text: "Yes, I am.", tone: green }
>   - { id: sub, label: "заміна — so / not", text: "I hope so. / I'm afraid not.", tone: violet }
> steps:
>   - { focus: q, note: "Співрозмовник уже назвав дію — coming to the party." }
>   - { move: { from: q, to: full, value: "повтор" }, note: "Повторити все можна, але звучить громіздко й неприродно." }
>   - { move: { from: full, to: ell, value: "coming to the party ✂" }, note: "Еліпсис: викидаємо відоме, лишаємо допоміжне am. Не просто Yes, і не Yes, I." }
>   - { move: { from: ell, to: sub, value: "so / not" }, note: "Якщо відповідь — думка чи надія, ціле речення замінює so або not: I hope so, I'm afraid not." }
>   - { set: { q: "Would you like to join us?", full: "I'd love to join you.", ell: "I'd love to.", sub: "I'm afraid I can't." }, focus: ell, note: "Те саме з інфінітивом: викидаємо join us, але to лишається — I'd love to." }
> ```

## Пояснення

### So і not замість цілого речення

| Дієслово | Так | Ні |
|---|---|---|
| think | *I think **so**.* | *I don't think so.* (формально чи категорично: *I think **not**.*) |
| hope | *I hope **so**.* | *I hope **not**.* (не ~~*I don't hope so*~~) |
| be afraid | *I'm afraid **so**.* | *I'm afraid **not**.* |
| suppose / guess | *I suppose so. / I guess so.* | *I don't suppose so. / I suppose not. / I guess not.* |
| expect | *I expect so.* | *I don't expect so. / I expect not.* |
| believe, imagine | *I believe so. / I imagine so.* | *I don't believe so. / I imagine not.* |

Ще: *It **seems so** / **So it seems**.* *Who **says so**?* *I **told you so**!* *If you **say so**…* (недовірливо: «ну, як скажеш»).

**Не** з *know* і *be sure*: *Is it true? — I **know**.* / *I'm **sure**.* (не ~~*I know so*~~, ~~*I'm sure so*~~).

> [!quiz] Перевір себе: «Ціна зросте? — Сподіваюся, що ні»
> level: C1 · id: en-c1-ellipsis-q02
> - [x] I hope not.
> - [ ] I don't hope so.
> - [ ] I hope no.
> - [ ] I'm not hoping so.
>
> **Пояснення:** з *hope* і *be afraid* заперечення стоїть **після** дієслова: *I hope **not***, *I'm afraid **not***. З *think*, навпаки, природніше *I **don't** think so*.

### If so, if not

Коротка умова, що відсилає до попереднього речення, — і в розмові, і в есе:

- *Are you free on Friday? **If so**, let's meet for lunch.* — Ти вільний у пʼятницю? Якщо так, ходімо на обід.
- *Is the data reliable? **If not**, the conclusions are worthless.* — Чи надійні дані? Якщо ні, висновки нічого не варті.

Не ~~*If yes*~~ / ~~*If no*~~ — це калька з «якщо так / якщо ні».

### One, ones замість іменника

- *These shoes are too small. Have you got any bigger **ones**?*
- *I don't need a new phone — my old **one** works fine.*
- *Which jacket? — The **one** on the left.*

Обмеження:

- лише **злічувані** іменники: *Do you want hot milk or cold?* (не ~~*a cold one*~~ про молоко);
- після присвійного в нейтральному стилі — *mine, yours, Olha's*: *This isn't my bag — **mine** is black.* (*my one* трапляється в розмовній британській, але в письмі його уникають);
- після самого числа — без *ones*: *I bought **three**.* Але з прикметником — так: *three **red ones***.

### Do, do so, do it замість дієслова

- **do** — після порівнянь і в коротких реакціях: *She plays better than I **do**.* *He said he'd call, and he **did**.* *So **do** I.*
- **do so** — формально: *Applicants who wish to apply early may **do so** online.* *The minister promised to resign but has not yet **done so**.*
- **do it / do that** — розмовно: *I promised to fix it, and I'll **do it** tomorrow.*
- Британська розмовна особливість: *Will you call him? — I **might do**.* *Have you told her? — I **should have done**.* Американці скажуть *I might* і *I should have*.

> [!quiz] Перевір себе: які відповіді правильні? Обери всі.
> level: C1 · type: multi · id: en-c1-ellipsis-q03
> - [x] "Is it going to rain?" — "I'm afraid so."
> - [ ] "Is she right?" — "I know so."
> - [x] "Will they win?" — "I don't think so."
> - [ ] "Are you sure?" — "I'm sure so."
> - [x] "Has he left?" — "I believe so."
>
> **Пояснення:** *so* замінює речення після *think, hope, be afraid, believe, suppose, expect*. Після *know* і *be sure* — без *so*: *I know.* / *Yes, I'm sure.*

> [!quiz] Перевір себе: one, ones, do, do so
> level: C1 · type: fill · id: en-c1-ellipsis-q04
>
> ```text fill
> These shoes are too small. Have you got any bigger [[ones]]?
> I don't need a new phone — my old [[one]] works fine.
> She speaks German better than I [[do]].
> The council promised to repair the road, but it has not yet [[done so]].
> ```
>
> **Пояснення:** *ones* — множина (*shoes*), *one* — однина (*phone*). *Do* замінює *speak German*. *Done so* — формальна заміна *repaired the road* (так пишуть у новинах і звітах).

### Еліпсис: лишаємо якір

**Відповіді** — повторюємо лише допоміжне чи модальне:

- *Have you finished? — Yes, I **have**.*
- *Can you still swim? — Not as well as I **used to**.*
- *Is Olha coming? — She **might be**.* (з *be* після модального — *be* лишається)
- *Has he been told? — He **should have been**.*

**Після to** — частка лишається, дієслово зникає:

- *Would you like to come? — I'd love **to**.*
- *You don't have to come if you don't want **to**.*
- *I meant to call, but I forgot **to**.*
- з *be* — *be* лишається: *Are you a manager? — No, but I'd like **to be**.*

**У порівняннях і звʼязаних реченнях:**

- *He earns more than she **does**.* *It's colder than it **was** yesterday.*
- *She can speak French and (she can) write it.*
- Формальне письмо любить пропускати повторене дієслово: *Olha ordered pasta, and Max (ordered) pizza.*

**Ситуативний еліпсис** — лише в розмові й повідомленнях: *Sounds good.* *Want a coffee?* *Seen Max?* *No idea.* *Told you!* — підмет і допоміжне дієслово не потрібні, бо ситуація все пояснює. В есе — ні.

> [!quiz] Перевір себе: «Повечеряєш із нами? — Залюбки!»
> level: C1 · id: en-c1-ellipsis-q05
> - [x] I'd love to!
> - [ ] I'd love!
> - [ ] I'd love it to!
> - [ ] I'd love that to!
>
> **Пояснення:** від *I'd love to join you* лишається якір ***to***. Без нього (*I'd love!*) речення обірване.

> [!diagram] Українська «так / ні» проти англійської заміни
> ```yaml
> layout: compare
> columns: { uk: "українською", en: "англійською" }
> nodes:
>   - { id: u1, col: uk, text: "Думаю, що так.", tone: gray }
>   - { id: e1, col: en, text: "I think so.", note: "не I think that yes", tone: green }
>   - { id: u2, col: uk, text: "Сподіваюся, що ні.", tone: gray }
>   - { id: e2, col: en, text: "I hope not.", note: "не I don't hope so", tone: green }
>   - { id: u3, col: uk, text: "Хочеш піти? — Дуже!", tone: gray }
>   - { id: e3, col: en, text: "I'd love to.", note: "to лишається", tone: green }
>   - { id: u4, col: uk, text: "Якщо так, …", tone: gray }
>   - { id: e4, col: en, text: "If so, …", note: "не If yes", tone: green }
> steps:
>   - { show: [u1, e1], note: "Українське «що так» — це ціле підрядне. Англійська замінює його одним so." }
>   - { show: [u2, e2], note: "З hope і be afraid заперечення — not після дієслова: I hope not, I'm afraid not." }
>   - { show: [u3, e3], note: "Українською можна відповісти одним словом. Англійська викидає дієслово, але to лишає." }
>   - { show: [u4, e4], note: "«Якщо так / якщо ні» → If so / If not. Yes і no в такій ролі не вживають." }
> ```

### Регістр

| Конструкція | Розмова | Есе, офіційний лист |
|---|---|---|
| *I think so / I hope not / I'm afraid so* | ✓ | ✓ (у цитатах і діалогах) |
| *I think not.* | категорично, трохи пихато | ✓ формальне заперечення |
| *If so / If not* | ✓ | ✓ дуже зручно |
| *do so / have done so* | звучить офіційно | ✓ |
| *do it / do that* | ✓ | обережно, буває двозначно |
| *Sounds good. / Want a coffee? / No idea.* | ✓ | ✗ |
| *Olha ordered pasta, and Max pizza.* | рідко | ✓ стисло, книжно |
| *I might do. / I should have done.* | ✓ британська розмовна | ✗ |

### IELTS: звʼязність без повторів

У **Writing Task 2** критерій **Coherence & Cohesion** оцінює, як повʼязані речення, — зокрема відсилання й заміну (*it, this, one, do so*). У публічних band descriptors на Band 6 відсилання ще може бути нечітким, на Band 7 — різноманітні звʼязувальні засоби, хоч і з деяким пере- чи недовживанням, на Band 8 — автор добре керує всіма аспектами звʼязності.

**Band 6 → Band 7–8:**

- *Some people think that governments should fund museums. Other people think that governments should not fund museums.* → *Some argue that governments should fund museums; others believe **they should not**.*
- *Many countries have introduced a sugar tax. Other countries will introduce a sugar tax soon.* → *Many countries have introduced a sugar tax, and **others** are likely to **do so** soon.*
- *Is this approach effective? **If not**, what are the alternatives?* — одне риторичне питання на есе, не більше.

**Де це шкодить:** *do so* чи *it*, які можуть відсилати до двох різних речей; надто стиснутий текст, у якому читач губиться; розмовний еліпсис (*Sounds reasonable.*) в академічному тексті.

У **Speaking Part 3** заміна робить відповідь природною: *I suspect so*, *I'd like to think not*, *Not necessarily*. Але **розгорни** її: *I suspect so, mainly because…* Коротке *Yes, I do.* і пауза — це мінус для Fluency and Coherence: екзаменатор чекає аргумент, а не підтвердження.

## Приклади

- "Will the shop be open on Sunday?" — "**I doubt it**." — «Магазин працюватиме в неділю?» — «Навряд чи».
- "Is the train late again?" — "**I'm afraid so**." — «Потяг знову запізнюється?» — «На жаль, так».
- Check your booking. **If not** confirmed, call the hotel. — Перевір бронювання. Якщо його не підтверджено, подзвони в готель.
- I wanted to visit Odesa this summer, but I couldn't **afford to**. — Я хотів поїхати в Одесу цього літа, але не зміг собі цього дозволити.
- "Have you ever been to Japan?" — "No, but I'd love **to**." — «Ти колись був у Японії?» — «Ні, але дуже хотів би».
- My laptop is slower than **yours**, but the screen is better than **the one** you've got. — Мій ноутбук повільніший за твій, але екран кращий, ніж у тебе.
- Residents may park here overnight, but visitors may not **do so**. — Мешканці можуть паркуватися тут уночі, а відвідувачі — ні.
- She works harder than any of us **do**. — Вона працює більше, ніж будь-хто з нас.
- "Is Max still at the office?" — "He **might be**. His car's outside." — «Макс ще в офісі?» — «Можливо. Його машина на вулиці».
- "**Want a lift?**" — "Thanks, that'd be great." — «Підвезти?» — «Дякую, було б чудово». (розмовне: *Do you want…* зникло)

## Слова

> [!word] I doubt it
> ipa: /aɪ ˈdaʊt ɪt/ · pos: phrase · level: C1 · id: en-c1-ellipsis-w01
> uk: навряд чи; сумніваюся
> example: "Will they lower the prices?" — "**I doubt it**." — «Вони знизять ціни?» — «Навряд чи».
> note: у doubt літера b не вимовляється. Мʼякше за No і зручніше за I don't think so, коли ти скептичний.

> [!word] if so
> ipa: /ɪf ˈsəʊ/ · ipa-us: /ɪf ˈsoʊ/ · pos: phrase · level: C1 · id: en-c1-ellipsis-w02
> uk: якщо так
> example: Are you free on Friday? **If so**, let's meet for lunch. — Ти вільний у пʼятницю? Якщо так, ходімо на обід.
> note: протилежне — if not. Не if yes.

> [!word] if need be
> ipa: /ɪf ˈniːd biː/ · pos: phrase · level: C1 · id: en-c1-ellipsis-w03
> uk: якщо буде потрібно, за потреби
> example: We can work at the weekend **if need be**. — За потреби можемо попрацювати й у вихідні.
> note: стала фраза зі старою формою be (без is). Нейтральніше: if necessary.

> [!word] likewise
> ipa: /ˈlaɪk.waɪz/ · pos: adv · level: C1 · id: en-c1-ellipsis-w04
> uk: так само; навзаєм
> example: "Nice to meet you." — "**Likewise**." — «Приємно познайомитися». — «Навзаєм».
> example: Watch what she does and do **likewise**. — Дивись, що вона робить, і роби так само.

> [!word] not necessarily
> ipa: /nɒt ˌnes.əˈser.əl.i/ · ipa-us: /nɑːt ˌnes.əˈser.əl.i/ · pos: phrase · level: C1 · id: en-c1-ellipsis-w05
> uk: не обовʼязково
> example: "Does expensive mean better?" — "**Not necessarily**." — «Дорожче означає краще?» — «Не обовʼязково».
> note: ідеальний початок відповіді в IELTS Speaking Part 3 — далі поясни чому.

> [!word] I'd like to think so
> ipa: /aɪd ˌlaɪk tə ˈθɪŋk səʊ/ · ipa-us: /aɪd ˌlaɪk tə ˈθɪŋk soʊ/ · pos: phrase · level: C1 · id: en-c1-ellipsis-w06
> uk: хотілося б вірити, що так
> example: "Are we making progress?" — "**I'd like to think so**." — «Є якийсь прогрес?» — «Хотілося б вірити».
> note: скромна, обережна згода. Заперечення — I'd like to think not.

> [!word] the same goes for
> ipa: /ðə ˈseɪm ɡəʊz fɔː/ · ipa-us: /ðə ˈseɪm ɡoʊz fɔːr/ · pos: phrase · level: C1 · id: en-c1-ellipsis-w07
> uk: те саме стосується
> example: Phones are banned during the exam, and **the same goes for** smartwatches. — Телефони на іспиті заборонені, і те саме стосується смарт-годинників.
> note: розмовно — The same goes for me. ≈ Me too.

> [!word] vice versa
> ipa: /ˌvaɪs ˈvɜː.sə/ · ipa-us: /ˌvaɪs ˈvɝː.sə/ · pos: adv · level: C1 · id: en-c1-ellipsis-w08
> uk: навпаки, і навпаки
> example: Teachers learn from their students, and **vice versa**. — Учителі вчаться в учнів, і навпаки.
> note: з латини. Можлива й вимова /ˌvaɪ.sə ˈvɜː.sə/.

> [!word] me neither
> ipa: /ˌmiː ˈnaɪ.ðə/ · ipa-us: /ˌmiː ˈniː.ðɚ/ · pos: phrase · level: C1 · id: en-c1-ellipsis-w09
> uk: я теж ні
> example: "I can't stand horror films." — "**Me neither**." — «Терпіти не можу жахастики». — «Я теж не можу».
> note: розмовно. Нейтрально — Neither can I. Після заперечення — не Me too!

## Слухаємо

> [!listen] Що ти почув?
> level: C1 · type: choice · id: en-c1-ellipsis-l01
> audio: I'm afraid not, the shop's already closed.
> - [ ] I'm afraid so, the shop's already closed.
> - [x] I'm afraid not, the shop's already closed.
> - [ ] I don't think so, the shop's already closed.
>
> **Пояснення:** *I'm afraid not* — ввічливе «на жаль, ні». *So* і *not* звучать зовсім по-різному: /səʊ/ і /nɒt/.

> [!listen] Що ти почув?
> level: C1 · type: choice · id: en-c1-ellipsis-l02
> audio: I'd love to, but I can't make it on Saturday.
> - [x] I'd love to, but I can't make it on Saturday.
> - [ ] I'd love it, but I can't make it on Saturday.
> - [ ] I'd love to go, but I can't make it on Saturday.
>
> **Пояснення:** у кінці фрази *to* не редукується: перед паузою воно звучить повно — /tuː/.

> [!listen] Напиши або скажи, що почув
> level: C1 · type: dictation · id: en-c1-ellipsis-l03
> audio: She said she would call, but she didn't.

> [!listen] Напиши або скажи, що почув
> level: C1 · type: dictation · id: en-c1-ellipsis-l04
> audio: If so, we'll need to book the tickets today.

> [!listen] IELTS Listening, Part 3 (тьютор і студент). What does the student say about the literature review?
> level: C1 · type: answer · tags: ielts · id: en-c1-ellipsis-l05
> audio: A: Have you finished the literature review?
> audio: B: Not quite. I meant to, but the library was closed all week. I should be able to by Friday, though.
> audio: A: Fine. And the questionnaire? If you haven't started it, do that first.
> - [ ] It is already finished.
> - [x] It should be finished by Friday.
> - [ ] It has been cancelled because the library was closed.
> - [ ] It will be done after the questionnaire.
>
> **Пояснення:** *I meant to* = *I meant to finish it*; *I should be able to by Friday* = *to finish it by Friday*. Еліпсис ховає дієслово, але якір *to* підказує, що йдеться про *finish*. Останній варіант — пастка: тьютор радить почати з анкети, а не відкласти огляд.

> [!listen] IELTS Listening, Part 4 (лекція). According to the lecturer, when do speakers leave words out?
> level: C1 · type: answer · tags: ielts · id: en-c1-ellipsis-l06
> audio: In 1949, the linguist George Zipf argued that language is shaped by a principle of least effort.
> audio: Speakers want to say as little as possible, while listeners want as much clarity as possible. Ellipsis is the compromise: we drop only what the listener can easily recover.
> - [ ] When they are tired or in a hurry.
> - [x] When the listener can easily work out the missing words.
> - [ ] Mainly when they are writing rather than speaking.
> - [ ] When they are talking to people they don't know.
>
> **Пояснення:** *we drop only what the listener can easily recover* → *the listener can easily work out the missing words*. Варіант про поспіх — логічний, але в лекції його немає.

## Вимова

> [!speak] Скажи вголос
> level: C1 · id: en-c1-ellipsis-s01
> text: I hope so, but I'm not sure.
> ipa: /aɪ ˈhəʊp səʊ bət aɪm nɒt ʃɔː/
> tip: hope — дифтонг /əʊ/, не «хоп»; sure у британській — /ʃɔː/, в американській — /ʃʊr/.

> [!speak] Скажи вголос
> level: C1 · id: en-c1-ellipsis-s02
> text: I'd love to, but I've got to work late.
> ipa: /aɪd ˈlʌv tuː bət aɪv ˈɡɒt tə wɜːk leɪt/
> tip: to перед паузою — повне /tuː/; got to — /ˈɡɒt tə/, зливається.

> [!speak] Скажи вголос
> level: C1 · id: en-c1-ellipsis-s03
> text: She might be, but I haven't seen her today.
> ipa: /ʃi ˈmaɪt biː bət aɪ ˈhæv.ənt siːn hə təˈdeɪ/
> tip: наголос — на might: невпевненість звучить саме тут; be — повне /biː/ в кінці фрази.

> [!speak] Скажи вголос
> level: C1 · id: en-c1-ellipsis-s04
> text: If not, we'll have to start again.
> ipa: /ɪf ˈnɒt wiːl ˈhæf tə stɑːt əˈɡen/
> tip: again — британське /əˈɡen/ або /əˈɡeɪn/; have to — /ˈhæf tə/.

> [!speak] IELTS Speaking, Part 3 — майбутнє паперових книжок
> level: C1 · id: en-c1-ellipsis-s05
> text: I suspect so, mainly because a lot of readers still enjoy holding a real book.
> ipa: /aɪ səˈspekt səʊ ˈmeɪn.li bɪˈkɒz ə lɒt əv ˈriː.dəz stɪl ɪnˈdʒɔɪ ˈhəʊl.dɪŋ ə rɪəl bʊk/
> tip: питання — «Do you think people will still read printed books in fifty years?». Заміна so + одразу аргумент: коротко, але розгорнуто. suspect — дієслово з наголосом на другому складі.

## Типові помилки українців

> [!pitfall] «I think yes», «I don't hope so», «If yes»
> «Думаю, що так» → ***I think so***; «Сподіваюся, що ні» → ***I hope not***; «Боюся, що ні» → ***I'm afraid not***; «Якщо так» → ***If so***. *Yes* і *no* не замінюють речення всередині фрази.

> [!pitfall] Загублене to: «I'd love», «I don't want»
> Українське «Хочеш? — Хочу!» англійською не обривають на дієслові: ***I'd love to***, ***I don't want to***, ***I'm trying to***. Частка *to* — якір, без неї фраза звучить недоговореною.

> [!pitfall] «I know so», «I'm sure so», «Me too» після заперечення
> *So* не вживають після *know* і *be sure*: *I know.* / *I'm sure.* А на заперечення погоджуються через *neither*: *I can't swim. — **Me neither** / **Neither can I**.* (*Me too* у відповідь на заперечення в нормативній мові вважають помилкою: воно звучить як згода з протилежним.)

> [!pitfall] Забагато чи замало еліпсиса
> В есе ~~*Sounds reasonable.*~~ чи ~~*Want proof? Look at Japan.*~~ — розмовний еліпсис, зниження регістру. А в Speaking Part 3 протилежна пастка: *Do you think…? — Yes, I do.* і тиша. Скорочуй повтори, але не думку.

## Практика

> [!quiz] Відповідай коротко: залиш лише якір
> level: C1 · type: fill · id: en-c1-ellipsis-q06
>
> ```text fill
> "Have you finished the report?" — "Yes, I [[have]]."
> "Is Olha coming tonight?" — "She might [[be]]. She wasn't sure."
> "Why didn't you call me?" — "I meant [[to]], but I forgot."
> "Does he earn more than his wife?" — "No, she earns more than he [[does]]."
> ```
>
> **Пояснення:** якір — допоміжне з питання (*have*), *be* після модального (*might be*), частка *to* (*meant to*) і *does* у порівнянні.

> [!quiz] Склади речення: «Ти вільний у пʼятницю? Якщо так, заходь»
> level: C1 · type: order · id: en-c1-ellipsis-q07
>
> ```text order
> Are you free
> on Friday?
> If so,
> come over.
> If yes, // ✗
> ```
>
> **Пояснення:** «якщо так» → ***If so***. *If yes* — калька.

> [!quiz] Склади речення: «Тобі не обовʼязково приходити, якщо не хочеш»
> level: C1 · type: order · id: en-c1-ellipsis-q08
>
> ```text order
> You don't have to
> come
> if you don't
> want to.
> want. // ✗
> ```
>
> **Пояснення:** дієслово *come* не повторюємо, але *to* лишаємо: *if you don't want **to***.

> [!quiz] Яке речення пасує до офіційних правил університету?
> level: C1 · id: en-c1-ellipsis-q09
> - [x] Students who wish to change their topic may do so before 1 March.
> - [ ] Students who wanna change topic can do it before March.
> - [ ] Students who wish to change their topic may do before 1 March.
> - [ ] Students who wish to change their topic may so before 1 March.
>
> **Пояснення:** формальна заміна — ***do so*** (обидва слова). *May do* без *so* — розмовне британське, *may so* — помилка, *wanna* — розмовне.

> [!quiz] Коли доречне *I think not*?
> level: C1 · id: en-c1-ellipsis-q10
> - [x] Як формальне чи категоричне заперечення: "Shall we accept their offer?" — "I think not."
> - [ ] Як звичайне нейтральне «ні» в будь-якій розмові.
> - [ ] Лише в американській англійській.
> - [ ] Ніколи — це граматична помилка.
>
> **Пояснення:** *I think not* граматично правильне, але звучить формально, рішуче або іронічно. У повсякденній розмові — *I don't think so*.

> [!quiz] Які речення уникають повтору правильно? Обери всі.
> level: C1 · type: multi · id: en-c1-ellipsis-q11
> - [x] Some people prefer to rent; others would rather buy.
> - [x] Many cities have banned cars from the centre, and others plan to do so.
> - [ ] Many cities have banned cars from the centre, and others plan to do.
> - [x] Is the policy fair? If not, it should be changed.
> - [ ] Is the policy fair? If no, it should be changed.
>
> **Пояснення:** ***others*** замінює *other people*, ***do so*** — *ban cars from the centre*, ***If not*** — *if it is not fair*. *Plan to do* без обʼєкта звучить обірвано, *If no* — калька.

> [!quiz] Короткі реакції: обери слово з банку
> level: C1 · type: fill · bank: too, so · id: en-c1-ellipsis-q12
>
> ```text fill
> "I can't stand horror films." — "Me [[neither]]."
> "Nice to meet you, Mr Brown." — "[[Likewise]]."
> "I love this song." — "So [[do]] I."
> Teachers learn from students, and vice [[versa]].
> ```
>
> **Пояснення:** на заперечення — *Me neither*; на «приємно познайомитися» — *Likewise*; згода зі ствердженням — *So do I*; *vice versa* — «і навпаки». *Me too* після заперечення (*can't stand*) — ненормативне й збиває з пантелику.

### У форматі IELTS

Прочитай текст і виконай завдання q13–q17.

*Every generation seems to fear that young people are destroying the language, and text messaging has been a favourite target. Critics point to dropped words and abbreviations, as if they were signs of laziness. Yet leaving words out is hardly new. Telegrams were famously brief, because senders paid by the word, and spoken English has always dropped what listeners can easily recover. In his book Txtng: The Gr8 Db8, the linguist David Crystal argued that texting is not damaging literacy. I am inclined to agree, though with one reservation. The skill that matters is knowing when to switch: a student who writes an essay the way she texts has not mastered ellipsis; she has misjudged her reader.*

> [!quiz] IELTS Reading · Yes / No / Not Given: «The writer believes that text messaging is the main cause of falling literacy.»
> level: C1 · tags: ielts · id: en-c1-ellipsis-q13
> - [ ] Yes
> - [x] No
> - [ ] Not Given
>
> **Пояснення:** автор погоджується з Крісталом, що *texting is not damaging literacy* (*I am inclined to agree*) → **No**.

> [!quiz] IELTS Reading · Yes / No / Not Given: «The writer thinks students need to adapt their style to the reader.»
> level: C1 · tags: ielts · id: en-c1-ellipsis-q14
> - [x] Yes
> - [ ] No
> - [ ] Not Given
>
> **Пояснення:** *The skill that matters is knowing when to switch… she has misjudged her reader* → **Yes**. Це і є його *reservation*.

> [!quiz] IELTS Reading · Yes / No / Not Given: «The writer believes telegrams were harder to write than text messages.»
> level: C1 · tags: ielts · id: en-c1-ellipsis-q15
> - [ ] Yes
> - [ ] No
> - [x] Not Given
>
> **Пояснення:** автор пояснює лише, **чому** телеграми були короткими (*senders paid by the word*). Про складність написання — ані слова → **Not Given**.

> [!quiz] IELTS Reading · Sentence endings: «According to the writer, a student who writes an essay in the style of a text message…»
> level: C1 · tags: ielts · id: en-c1-ellipsis-q16
> - [ ] …is showing a creative use of language.
> - [x] …has failed to think about who she is writing for.
> - [ ] …will gradually improve her literacy.
> - [ ] …is copying the style of telegrams.
>
> **Пояснення:** *she has misjudged her reader* = не врахувала, для кого пише. Зверни увагу на заміну в тексті: *the way she texts* замість повторення *the way she writes text messages*.

> [!quiz] IELTS Reading · Summary completion: обери ОДНЕ слово з банку для кожного пропуску
> level: C1 · type: fill · bank: rare, letter · tags: ielts · id: en-c1-ellipsis-q17
>
> ```text fill
> Critics often see dropped words in text messages as a sign of [[laziness]].
> However, omitting words is not [[new]]: telegrams were short because senders paid by the [[word]].
> According to the writer, the real skill is knowing when to [[switch]] style.
> ```
>
> **Пояснення:** *signs of laziness*, *hardly new*, *paid by the word*, *knowing when to switch*. *Rare* — протилежне до змісту (пропуски слів — звична річ), *letter* — пастка: платили за слово, а не за літеру.

> [!quiz] IELTS Writing Task 2 · Перепиши речення Band 6 на рівень Band 7–8
> level: C1 · tags: ielts · id: en-c1-ellipsis-q18
>
> *Band 6:* «Some people think that young people should learn a second language at school. Other people think that young people should not learn a second language at school.»
>
> - [x] Some believe that young people should learn a second language at school, while others feel they should not.
> - [ ] Some believe young people should learn a second language at school, others not think so.
> - [ ] Some believe that young people should learn a second language at school, while others feel they should not so.
> - [ ] Some people think yes, young people should learn a second language at school, and some people think no.
>
> **Пояснення:** еліпсис після модального (*they should not* = *should not learn one*) і заміна *others* прибирають два повтори — це те, що Coherence & Cohesion називає вмілим відсиланням. *Others not think so* — без допоміжного, *should not so* — так не кажуть, *think yes / think no* — калька.

> [!quiz] IELTS Writing Task 2 · Збери речення Band 7–8 з «Many countries have introduced a tax on sugary drinks. Other countries will probably introduce a tax on sugary drinks soon.»
> level: C1 · type: order · tags: ielts · id: en-c1-ellipsis-q19
>
> ```text order
> Many countries have introduced
> a tax on sugary drinks,
> and others are likely
> to do so soon.
> to do it so // ✗
> ```
>
> **Пояснення:** *others* замінює *other countries*, *do so* — *introduce a tax on sugary drinks*. Одне речення замість двох — і жодного повтору.

## Фішки

> [!reel] ✉️ Телеграма — еліпсис за гроші
> За телеграму платили за кожне слово, тож писали ARRIVING MONDAY STOP SEND MONEY STOP. Займенники, артиклі й допоміжні зникали першими — бо адресат і так їх відновить.

> [!reel] 🇬🇧 I might do — британська фішка
> Британець на «Ти подзвониш йому?» скаже I might do, а американець — I might. Те саме з I should have done проти I should have. Почуєш do в кінці — найімовірніше, говорить британець.

> [!reel] 😏 I told you so
> So тут замінює цілу думку: «я ж казав, що так буде». Фраза настільки популярна, що її вживають навіть як іменник: Spare me the I-told-you-sos! — «Тільки без „я ж казав“!»

## Джерела та що почитати

- 🟢 M. Hewings — *Advanced Grammar in Use* (Cambridge): розділи про заміну (*so, not, do so, one*) і пропуск слів.
- 🟢 [British Council LearnEnglish — English grammar](https://learnenglish.britishcouncil.org/grammar) — граматика за рівнями, зокрема C1.
- 🟡 M. Swan — *Practical English Usage* (Oxford): ellipsis, *so* and *not* (*I hope so / I hope not*), *do so*, *one / ones*.
- 🟡 R. Carter, M. McCarthy — *Cambridge Grammar of English* (Cambridge): ситуативний еліпсис у розмовній мові.
- 🟡 M. A. K. Halliday, R. Hasan — *Cohesion in English* (Longman): класична праця про відсилання, заміну й еліпсис як засоби звʼязності.
- 🟡 D. Crystal — *Txtng: The Gr8 Db8* (Oxford University Press): чому скорочення в повідомленнях — не «смерть мови».
- 🟡 [IELTS.org](https://ielts.org) — публічні band descriptors Writing (Coherence and Cohesion) і Speaking.

> [!important] Підсумок
> - Речення замінюють ***so / not***: *I think so, I hope not, I'm afraid so*; ***If so / If not***. Не з *know* і *be sure*.
> - Іменник — ***one / ones*** (лише злічувані); дієслово — ***do***, формально ***do so***.
> - Еліпсис лишає **якір**: *Yes, I have. — She might be. — I'd love to.*
> - Ситуативний еліпсис (*Sounds good. Want a coffee?*) — лише розмова.
> - IELTS: заміна й еліпсис — інструменти Coherence & Cohesion у Writing і природності в Speaking; але відповідь у Part 3 скорочуй у формі, а не в думці.
