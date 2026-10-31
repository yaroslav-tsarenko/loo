---
title: Сполучники — und, aber, denn, sondern і deshalb, trotzdem
id: de-a2-konnektoren
level: A2
icon: px:letterTile
tags: [deutsch, a2, grammar, konnektoren, wortstellung]
prerequisites: ["[[Deutsch - A1 - 09. Питання й місце дієслова — V2 і W-Fragen]]", "[[Deutsch - A2 - 11. Підрядні речення з weil, dass, wenn — дієслово в кінці]]"]
estimatedMinutes: 40
---

# Сполучники — und, aber, denn, sondern і deshalb, trotzdem

> [!success] Після цієї теми ти зможеш
> - зʼєднувати прості речення сполучниками *und, aber, oder, denn, sondern* без зміни порядку слів;
> - вживати *deshalb, trotzdem, außerdem, dann, danach* з інверсією: *Es regnet, deshalb bleibe ich zu Hause.*;
> - розрізняти *aber* («але») і *sondern* («а, лише»);
> - розставляти коми й будувати довші, звʼязні речення.

## Передбач

> [!quiz] Яке речення правильне?
> level: A2 · type: single · id: de-a2-konnektoren-q01
> - [x] Ich bin krank, deshalb bleibe ich zu Hause.
> - [ ] Ich bin krank, deshalb ich bleibe zu Hause.
> - [ ] Ich bin krank, denn bleibe ich zu Hause.
> - [ ] Ich bin krank, deshalb zu Hause bleibe ich.
>
> **Пояснення:** *deshalb* — прислівник: він займає **перше місце** в другому реченні, тому дієслово стоїть на **другому** (*deshalb bleibe ich*, інверсія). *denn* дієслово не зміщує, але змінює зміст: «бо».

## Пояснення

### Дві групи сполучників

У німецькому реченні дієслово стоїть на **другому місці** (V2). Сполучники діляться на ті, що цей порядок не чіпають, і на ті, що ставлять дієслово перед підметом.

| Група | Слова | Порядок після слова |
|---|---|---|
| **Позиція 0** (союзи) | und, aber, oder, denn, sondern | звичайний: підмет + дієслово |
| **Позиція 1** (прислівники) | deshalb, deswegen, daher, trotzdem, dennoch, außerdem, dann, danach | інверсія: дієслово + підмет |

> [!diagram] Позиція 0 і позиція 1
> ```yaml
> layout: compare
> columns: { a: "Позиція 0: aber", b: "Позиція 1: trotzdem" }
> nodes:
>   - { id: a1, col: a, label: "сполучник", text: "aber", note: "не рахується як місце речення", tone: gray }
>   - { id: a2, col: a, label: "підмет", text: "ich", tone: mint }
>   - { id: a3, col: a, label: "дієслово", text: "gehe", tone: orange }
>   - { id: a4, col: a, label: "решта", text: "heute arbeiten", tone: gray }
>   - { id: b1, col: b, label: "прислівник", text: "trotzdem", note: "стоїть на 1-му місці", tone: gray }
>   - { id: b2, col: b, label: "дієслово", text: "gehe", tone: orange }
>   - { id: b3, col: b, label: "підмет", text: "ich", tone: mint }
>   - { id: b4, col: b, label: "решта", text: "heute arbeiten", tone: gray }
> steps:
>   - { focus: [a1, a2, a3], note: "Ich bin müde, aber ich gehe heute arbeiten. Після aber — звичайний порядок: підмет, потім дієслово." }
>   - { focus: [b1, b2, b3], note: "Ich bin müde, trotzdem gehe ich heute arbeiten. Після trotzdem — дієслово, потім підмет." }
> ```
> Мʼятний блок — підмет, помаранчевий — дієслово, сірий — решта; мітка є в кожному блоці.

### Позиція 0: und, aber, oder, denn, sondern

Ці пʼять слів просто **зʼєднують два речення**, не впливаючи на порядок слів.

| Союз | Значення | Приклад |
|---|---|---|
| **und** | і, й | Ich lerne Deutsch und er lernt Englisch. |
| **aber** | але | Ich bin müde, aber ich arbeite weiter. |
| **oder** | або | Fährst du mit dem Bus, oder gehst du zu Fuß? |
| **denn** | бо | Ich bleibe zu Hause, denn ich bin krank. |
| **sondern** | а (лише) | Er ist nicht faul, sondern müde. |

Перед *aber, denn, sondern* кома **обовʼязкова**; перед *und, oder* між двома цілими реченнями її зазвичай не ставлять (допустимо поставити).

> [!tip] denn ≠ weil
> Обидва слова означають «бо», але порядок слів різний: після *denn* — звичайний (*denn ich bin krank*), після *weil* — дієслово в кінці (*weil ich krank bin*). Докладніше про *weil* — у темі [[Deutsch - A2 - 11. Підрядні речення з weil, dass, wenn — дієслово в кінці]].

### aber чи sondern

- **aber** — протиставлення: обидві частини правдиві. *Das Hotel ist teuer, aber sehr schön.*
- **sondern** — виправлення: після заперечення (*nicht, kein*) називаємо правильний варіант. *Das Hotel ist nicht teuer, sondern billig.*

> [!diagram] aber чи sondern?
> ```yaml
> layout: compare
> columns: { a: "aber", b: "sondern" }
> nodes:
>   - { id: a1, col: a, label: "умова", text: "обидві частини правдиві", note: "Ich bin müde, aber ich arbeite.", tone: yellow }
>   - { id: a2, col: a, label: "заперечення?", text: "необовʼязкове", tone: yellow }
>   - { id: b1, col: b, label: "умова", text: "перша частина заперечена, друга її виправляє", note: "Er ist nicht faul, sondern müde.", tone: pink }
>   - { id: b2, col: b, label: "заперечення?", text: "є: nicht / kein", tone: pink }
> steps:
>   - { focus: [a1, a2], note: "aber: «але» — можна й без заперечення." }
>   - { focus: [b1, b2], note: "sondern: «а» — лише після заперечення, друга частина замінює першу." }
> ```
> Жовті блоки — aber, рожеві — sondern; назва сполучника є в заголовку колонки.

Корисна пара: **nicht nur …, sondern auch** — «не лише …, а й»: *Er spricht nicht nur Deutsch, sondern auch Englisch.*

### Позиція 1: deshalb, trotzdem, außerdem, dann, danach

Ці слова — прислівники. Вони займають **перше місце** в реченні, тому дієслово йде одразу за ними, а підмет — після дієслова.

| Слово | Значення | Приклад |
|---|---|---|
| **deshalb / deswegen / daher** | тому | Es regnet, deshalb bleibe ich zu Hause. |
| **trotzdem / dennoch** | все ж таки | Es regnet, trotzdem gehe ich spazieren. |
| **außerdem** | крім того | Ich bin müde. Außerdem habe ich Hunger. |
| **sonst** | інакше | Beeil dich, sonst kommen wir zu spät. |
| **dann / danach** | потім, після цього | Ich esse, danach gehe ich schlafen. |
| **also** | отже, тож | Er hat Zeit, also kommt er mit. |

Прислівник може стояти й **усередині** речення: *Ich bleibe deshalb zu Hause.* Тоді порядок звичайний. Інверсія — лише коли прислівник на першому місці.

## Приклади

- Ich möchte Kaffee, und mein Freund möchte Tee. — Я хочу каву, а мій друг — чай.
- Das Wetter ist schlecht, aber wir gehen spazieren. — Погода погана, але ми йдемо на прогулянку.
- Er ist nicht müde, sondern hungrig. — Він не втомлений, а голодний.
- Ich bleibe zu Hause, denn ich bin krank. — Я лишаюся вдома, бо хворий.
- Es ist kalt, deshalb trage ich eine Jacke. — Холодно, тому я вдягаю куртку.
- Es regnet, trotzdem gehen wir ins Kino. — Йде дощ, але ми все одно йдемо в кіно.
- Sie ist klug. Außerdem ist sie sehr nett. — Вона розумна. Крім того, вона дуже мила.
- Wir frühstücken, danach fahren wir los. — Ми снідаємо, після цього вирушаємо.
- Du musst lernen, sonst fällst du durch. — Тобі треба вчитися, інакше не складеш.
- Er hat nicht nur Hunger, sondern auch Durst. — Він не лише голодний, а й спраглий.

## Слова

> [!word] und
> ipa: /ʊnt/ · pos: conj · level: A1 · id: de-a2-konnektoren-w01
> uk: і; й; а
> example: Ich trinke Tee **und** er trinkt Kaffee. — Я пʼю чай, а він — каву.
> note: кінцеве d глушиться: [t]. Не змінює порядку слів.

> [!word] sondern
> ipa: /ˈzɔndɐn/ · pos: conj · level: A2 · id: de-a2-konnektoren-w02
> uk: а (лише); але (після заперечення)
> example: Das ist kein Hund, **sondern** ein Wolf. — Це не собака, а вовк.
> note: після nicht / kein; кома обовʼязкова. s на початку — дзвінке [z]; -ern = [ɐn].

> [!word] deshalb
> ipa: /ˈdɛshalp/ · pos: adv · level: A2 · id: de-a2-konnektoren-w03
> uk: тому; через це
> example: Ich bin krank, **deshalb** bleibe ich zu Hause. — Я хворий, тому лишаюся вдома.
> note: кінцеве b глушиться: [p]. Дієслово йде одразу після слова.

> [!word] deswegen
> ipa: /ˈdɛsveːɡn̩/ · pos: adv · level: A2 · id: de-a2-konnektoren-w04
> uk: через це; тому
> example: Er hat keine Zeit, **deswegen** kommt er nicht. — У нього немає часу, тому він не прийде.
> note: те саме, що deshalb, трохи розмовніше.

> [!word] daher
> ipa: /ˈdaːheːɐ̯/ · pos: adv · level: B1 · id: de-a2-konnektoren-w05
> uk: звідси; тому
> example: Es gab einen Unfall, **daher** ist die Straße gesperrt. — Сталася аварія, тому вулицю перекрито.
> note: daher також може означати «звідси, звідти»: Daher kommt der Name. — Звідси назва.

> [!word] trotzdem
> ipa: /ˈtʁɔtsdeːm/ · pos: adv · level: A2 · id: de-a2-konnektoren-w06
> uk: все ж таки; незважаючи на це
> example: Es regnet, **trotzdem** gehen wir spazieren. — Йде дощ, але ми все одно йдемо гуляти.
> note: tz = [ts]; наголос на першому складі. Інверсія: trotzdem gehe ich.

> [!word] dennoch
> ipa: /ˈdɛnɔx/ · pos: adv · level: B1 · id: de-a2-konnektoren-w07
> uk: проте; все ж
> example: Er ist müde, **dennoch** arbeitet er weiter. — Він утомився, проте продовжує працювати.
> note: письмовіше за trotzdem. -ch після o = [x].

> [!word] außerdem
> ipa: /ˈaʊ̯sɐdeːm/ · pos: adv · level: A2 · id: de-a2-konnektoren-w08
> uk: крім того; до того ж
> example: Die Wohnung ist günstig. **Außerdem** liegt sie zentral. — Квартира недорога. До того ж вона розташована в центрі.
> note: au = [aʊ̯]. Не плутай з außerhalb («поза межами»).

> [!word] sonst
> ipa: /zɔnst/ · pos: adv · level: A2 · id: de-a2-konnektoren-w09
> uk: інакше; ще (щось); зазвичай
> example: Beeil dich, **sonst** verpassen wir den Zug! — Поспішай, інакше ми пропустимо потяг!
> note: ще одне значення: Sonst noch etwas? — Ще щось?

> [!word] also
> ipa: /ˈalzoː/ · pos: adv · level: A2 · id: de-a2-konnektoren-w10
> uk: отже; тож
> example: Er hat Zeit, **also** kommt er mit. — У нього є час, отже, він піде з нами.
> note: also ≠ «також» (це auch). На початку фрази Also, … — як «ну, отже,…».

> [!word] jedoch
> ipa: /jeˈdɔx/ · pos: adv · level: B1 · id: de-a2-konnektoren-w11
> uk: проте; однак
> example: Das Hotel ist schön, **jedoch** sehr teuer. — Готель гарний, проте дуже дорогий.
> note: jedoch може стояти і на першому місці (інверсія), і в середині речення. j = [j].

> [!word] allerdings
> ipa: /ˈalɐdɪŋs/ · pos: adv · level: B1 · id: de-a2-konnektoren-w12
> uk: правда; однак
> example: Ich komme gern, **allerdings** nur bis acht Uhr. — Я радо прийду, правда, лише до восьмої.
> note: помʼякшене «але»: додає застереження.

> [!word] nämlich
> ipa: /ˈnɛːmlɪç/ · pos: adv · level: B1 · id: de-a2-konnektoren-w13
> uk: адже; річ у тім, що
> example: Ich kann nicht kommen. Ich bin **nämlich** krank. — Я не можу прийти. Річ у тім, що я хворий.
> note: стоїть усередині речення, після дієслова: Ich bin nämlich krank. ä довге [ɛː].

> [!word] übrigens
> ipa: /ˈyːbʁɪɡn̩s/ · pos: adv · level: B1 · id: de-a2-konnektoren-w14
> uk: до речі
> example: **Übrigens**, morgen habe ich Geburtstag. — До речі, завтра в мене день народження.
> note: ü — губи трубочкою, язик як для «і». -ig- = [ɪɡ]: g перед n — [ɡ].

> [!word] entweder … oder
> ipa: /ˈɛntveːdɐ ˈoːdɐ/ · pos: phrase · level: A2 · id: de-a2-konnektoren-w15
> uk: або … або
> example: **Entweder** fahren wir mit dem Zug, **oder** wir fliegen. — Або ми їдемо потягом, або летимо.
> note: після entweder — звичайний порядок (V2); oder — позиція 0.

> [!word] weder … noch
> ipa: /ˈveːdɐ nɔx/ · pos: phrase · level: A2 · id: de-a2-konnektoren-w16
> uk: ні … ні
> example: Ich habe **weder** Zeit **noch** Geld. — У мене немає ні часу, ні грошей.
> note: німецька не вимагає подвійного заперечення: weder … noch вже заперечує, nicht не потрібне.

> [!word] nicht nur … sondern auch
> ipa: /nɪçt nuːɐ̯ ˈzɔndɐn aʊ̯x/ · pos: phrase · level: A2 · id: de-a2-konnektoren-w17
> uk: не лише … а й
> example: Sie spricht **nicht nur** Deutsch, **sondern auch** Polnisch. — Вона розмовляє не лише німецькою, а й польською.
> note: sondern auch — позиція 0, після неї звичайний порядок.

> [!word] einerseits … andererseits
> ipa: /ˈaɪ̯nɐzaɪ̯ts ˈandəʁɐzaɪ̯ts/ · pos: phrase · level: B1 · id: de-a2-konnektoren-w18
> uk: з одного боку … з іншого боку
> example: **Einerseits** ist die Stadt laut, **andererseits** gibt es viel zu tun. — З одного боку, місто гамірне, з іншого — тут багато чим можна зайнятися.
> note: Seite → seits: слова зі словотвірним суфіксом -seits (= «з боку»).

> [!word] sowohl … als auch
> ipa: /zoˈvoːl als aʊ̯x/ · pos: phrase · level: B1 · id: de-a2-konnektoren-w19
> uk: як … так і
> example: Er spricht **sowohl** Deutsch **als auch** Englisch. — Він говорить і німецькою, і англійською.
> note: наголос на -wohl; als auch — після другого елемента.

> [!word] zum Beispiel
> ipa: /tsʊm ˈbaɪ̯ʃpiːl/ · pos: phrase · level: A2 · id: de-a2-konnektoren-w20
> uk: наприклад
> example: Ich mag Obst, **zum Beispiel** Äpfel und Birnen. — Я люблю фрукти, наприклад яблука та груші.
> note: скорочення: z. B. Beispiel: sp на початку складу = «шп».

## Слухаємо

> [!listen] Що ти почув?
> level: A2 · type: choice · speed: slow · id: de-a2-konnektoren-l01
> audio: Es regnet, trotzdem gehen wir spazieren.
> - [ ] Es regnet, deshalb gehen wir spazieren.
> - [x] Es regnet, trotzdem gehen wir spazieren.
> - [ ] Es regnet, aber wir gehen spazieren.
>
> **Пояснення:** *trotzdem* — «все ж таки»; *deshalb* — «тому». Після обох — інверсія (*gehen wir*), після *aber* — звичайний порядок (*wir gehen*).

> [!listen] Напиши або скажи, що почув
> level: A2 · type: dictation · speed: slow · id: de-a2-konnektoren-l02
> audio: Ich bin müde, aber ich lerne weiter.
> explain: перед *aber* — кома; після нього звичайний порядок: *aber ich lerne*.

> [!listen] Напиши або скажи, що почув
> level: A2 · type: dictation · speed: slow · id: de-a2-konnektoren-l03
> audio: Er ist nicht krank, sondern müde.
> explain: *nicht … sondern* — виправлення: не «хворий», а «втомлений». Перед *sondern* — кома.

> [!listen] Послухай і скажи, чому Лена не прийшла
> level: A2 · type: answer · speed: slow · id: de-a2-konnektoren-l04
> audio: A: Wo ist Lena heute? Sie ist nicht im Büro.
> audio: B: Sie ist krank, deshalb bleibt sie zu Hause. Außerdem hat sie Fieber.
> audio: A: Oh nein! Dann rufe ich sie später an.
> - [ ] Вона у відпустці.
> - [x] Вона хвора, у неї температура.
> - [ ] Вона запізнюється.
>
> **Пояснення:** *deshalb* — тому (через хворобу); *außerdem* — крім того (ще й температура).

## Вимова

Сполучники — короткі слова, і їх легко «проковтнути»; але контрастні *deshalb, trotzdem, außerdem* мають виразний наголос на **першому складі**. Кінцеві *-b, -d* глушаться: *deshalb* [ˈdɛshalp], *und* [ʊnt].

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-konnektoren-s01
> text: Es regnet, deshalb bleibe ich zu Hause.
> ipa: /ɛs ˈʁeːɡnət ˈdɛshalp ˈblaɪ̯bə ɪç tsuː ˈhaʊ̯zə/
> tip: deshalb — наголос на de-, кінцеве b = [p]. regnet — g перед n = [ɡ], -et = [ət].
> uk: Йде дощ, тому я лишаюся вдома.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-konnektoren-s02
> text: Er ist nicht faul, sondern müde.
> ipa: /eːɐ̯ ɪst nɪçt faʊ̯l ˈzɔndɐn ˈmyːdə/
> tip: sondern — дзвінке [z] на початку, -ern = [ɐn]. ü — губи трубочкою.
> uk: Він не ледачий, а втомлений.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-konnektoren-s03
> text: Es ist kalt, trotzdem gehe ich spazieren.
> ipa: /ɛs ɪst kalt ˈtʁɔtsdeːm ˈɡeːə ɪç ʃpaˈtsiːʁən/
> tip: trotzdem — [ts] посередині; spazieren — sp = «шп», наголос на -zie-.
> uk: Холодно, але я все одно йду гуляти.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-konnektoren-s04
> text: Ich bin müde. Außerdem habe ich Hunger.
> ipa: /ɪç bɪn ˈmyːdə ˈaʊ̯sɐdeːm ˈhaːbə ɪç ˈhʊŋɐ/
> tip: außerdem — au = [aʊ̯], ß = [s]; пауза після крапки.
> uk: Я втомлений. Крім того, я голодний.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-konnektoren-s05
> text: Beeil dich, sonst verpassen wir den Zug!
> ipa: /bəˈʔaɪ̯l dɪç zɔnst fɛɐ̯ˈpasn̩ viːɐ̯ deːn tsuːk/
> tip: sonst закінчується на [nst]; Zug — кінцеве g = [k]: «цук».
> uk: Поспішай, інакше ми пропустимо потяг!

## Типові помилки українців

> [!pitfall] «Deshalb ich gehe» — без інверсії
> Українське «тому я йду» легко перенести дослівно: ~~Deshalb ich gehe~~. Але *deshalb* стоїть на першому місці, тож дієслово — одразу за ним: **Deshalb gehe ich**. Те саме з *trotzdem, außerdem, dann, danach*. А от після *und, aber, denn* — звичайний порядок: *aber ich gehe*.

> [!pitfall] «Denn ich krank bin» — дієслово в кінці після denn
> Після *denn* дієслово **не** йде в кінець: *denn ich bin krank*. Кінцеве дієслово — прикмета *weil*: *weil ich krank bin*. Якщо плутаєш — просто заміни *denn* на *weil* і перестав дієслово.

> [!pitfall] aber замість sondern
> Після заперечення з виправленням потрібне *sondern*: ~~Er ist nicht faul, aber müde~~ → *Er ist nicht faul, **sondern** müde.* *aber* зберігається для протиставлення двох правдивих частин: *Er ist müde, aber glücklich.*

> [!pitfall] also — не «також»
> Українське «також» — це *auch*. *Also* означає «отже, тож». Хочеш сказати «я теж голодний» — *Ich habe **auch** Hunger*; а *Ich habe also Hunger* означало б «отже, я голодний». Порівняй: *Ich habe Hunger, also esse ich.* — «Я голодний, отже їм.»

## Практика

> [!quiz] Вибери сполучник за значенням
> level: A2 · type: fill · id: de-a2-konnektoren-q02
>
> ```text fill
> Ich bin müde, (але) [[aber]] ich lerne weiter.
> Ich bleibe zu Hause, (бо) [[denn]] ich bin krank.
> Es regnet, (тому) [[deshalb]] nehme ich einen Regenschirm.
> Es regnet, (все ж) [[trotzdem]] gehen wir spazieren.
> ```
>
> **Пояснення:** *aber* — але; *denn* — бо; *deshalb* — тому; *trotzdem* — все ж таки.

> [!quiz] Допиши дієслово (інверсія після прислівника)
> level: A2 · type: fill · id: de-a2-konnektoren-q03
>
> ```text fill
> Ich habe keine Zeit, deshalb (kommen) [[komme]] ich nicht.
> Er ist krank, trotzdem (arbeiten) [[arbeitet]] er.
> Wir essen, danach (gehen) [[gehen]] wir spazieren.
> ```
>
> **Пояснення:** після *deshalb, trotzdem, danach* дієслово стоїть на другому місці — перед підметом (*komme ich, arbeitet er, gehen wir*).

> [!quiz] Допиши парний сполучник
> level: A2 · type: fill · bank: aber, und · id: de-a2-konnektoren-q04
>
> ```text fill
> Ich trinke nicht nur Kaffee, [[sondern]] auch Tee.
> [[Entweder]] fahren wir mit dem Zug, oder wir fliegen.
> Weder er [[noch]] sie ist da.
> ```
>
> **Пояснення:** *nicht nur … sondern auch*, *entweder … oder*, *weder … noch*. Слова *aber* та *und* в парних конструкціях не вживаються.

> [!quiz] Склади речення (почни зі слова Es): «Йде дощ, але ми все одно йдемо гуляти»
> level: A2 · type: order · id: de-a2-konnektoren-q05
>
> ```text order
> Es
> regnet,
> trotzdem
> gehen
> wir
> spazieren.
> aber ✗
> ```
>
> **Пояснення:** *trotzdem* — на першому місці, далі дієслово *gehen*, потім підмет *wir*. Слово *aber* було б зайвим.

> [!quiz] Склади речення (почни зі слова Ich): «Я вчу німецьку, бо живу в Берліні»
> level: A2 · type: order · id: de-a2-konnektoren-q06
>
> ```text order
> Ich
> lerne
> Deutsch,
> denn
> ich
> wohne
> in
> Berlin.
> weil ✗
> ```
>
> **Пояснення:** після *denn* порядок звичайний: *ich wohne*. З *weil* дієслово пішло б у кінець (*weil ich in Berlin wohne*).

> [!quiz] Склади речення (почни зі слова Er): «Він не ледачий, а втомлений»
> level: A2 · type: order · id: de-a2-konnektoren-q07
>
> ```text order
> Er
> ist
> nicht
> faul,
> sondern
> müde.
> aber ✗
> ```
>
> **Пояснення:** після заперечення з виправленням — *sondern*, а не *aber*.

> [!quiz] Яке слово підходить: «Es regnet, ___ gehen wir spazieren»?
> level: A2 · type: single · id: de-a2-konnektoren-q08
> - [x] trotzdem
> - [ ] deshalb
> - [ ] denn
> - [ ] weil
>
> **Пояснення:** йдеться про дію всупереч дощу — *trotzdem*. *deshalb* означало б «через дощ ми гуляємо» (нелогічно), після *denn* не буває інверсії (*denn gehen wir*), після *weil* дієслово йде в кінець.

> [!quiz] Яке слово підходить: «Das ist nicht mein Bruder, ___ mein Cousin»?
> level: A2 · type: single · id: de-a2-konnektoren-q09
> - [ ] aber
> - [x] sondern
> - [ ] denn
> - [ ] deshalb
>
> **Пояснення:** після заперечення друга частина виправляє першу — *sondern*. *aber* означало б «але водночас», тут воно звучить дивно.

> [!quiz] Який порядок слів правильний після denn?
> level: A2 · type: single · id: de-a2-konnektoren-q10
> - [x] Ich bleibe zu Hause, denn ich bin krank.
> - [ ] Ich bleibe zu Hause, denn ich krank bin.
> - [ ] Ich bleibe zu Hause, denn bin ich krank.
> - [ ] Ich bleibe zu Hause, denn krank ich bin.
>
> **Пояснення:** *denn* — позиція 0, порядок звичайний. Дієслово в кінці — для *weil*.

> [!quiz] Які слова стоять у позиції 0 (не змінюють порядку слів)? Обери всі правильні відповіді
> level: A2 · type: multi · id: de-a2-konnektoren-q11
> - [x] und
> - [x] aber
> - [ ] deshalb
> - [x] denn
> - [ ] trotzdem
>
> **Пояснення:** *und, aber, oder, denn, sondern* — позиція 0. *deshalb, trotzdem* — прислівники з інверсією.

> [!quiz] Обери всі речення з правильним порядком слів
> level: A2 · type: multi · id: de-a2-konnektoren-q12
> - [x] Es ist kalt, deshalb trage ich eine Jacke.
> - [ ] Es ist kalt, deshalb ich trage eine Jacke.
> - [x] Ich bin müde, aber ich arbeite weiter.
> - [ ] Ich bin müde, aber arbeite ich weiter.
> - [x] Sie lernt Deutsch, außerdem lernt sie Englisch.
>
> **Пояснення:** після *deshalb* і *außerdem* — дієслово перед підметом. Після *aber* — підмет перед дієсловом.

> [!quiz] Обери всі речення з правильною комою
> level: A2 · type: multi · id: de-a2-konnektoren-q13
> - [x] Ich bin müde, aber ich arbeite weiter.
> - [x] Er bleibt zu Hause, denn er ist krank.
> - [ ] Er bleibt zu Hause denn er ist krank.
> - [ ] Das ist nicht rot sondern blau.
> - [x] Das ist nicht rot, sondern blau.
>
> **Пояснення:** перед *aber, denn, sondern* кома обовʼязкова.

> [!quiz] Що означає «also» у реченні «Ich habe Hunger, also esse ich»?
> level: A2 · type: single · id: de-a2-konnektoren-q14
> - [ ] також
> - [x] отже
> - [ ] ніколи
> - [ ] тільки
>
> **Пояснення:** *also* — «отже, тож», а «також» німецькою — *auch*.

> [!quiz] Що означає «außerdem»?
> level: A2 · type: single · id: de-a2-konnektoren-q15
> - [ ] тому
> - [x] крім того
> - [ ] проте
> - [ ] замість цього
>
> **Пояснення:** *Er ist klug, außerdem ist er nett.* — «Він розумний, крім того, він милий».

> [!quiz] Що означає «sonst» у «Beeil dich, sonst kommen wir zu spät»?
> level: A2 · type: single · id: de-a2-konnektoren-q16
> - [x] інакше
> - [ ] тому
> - [ ] також
> - [ ] тоді
>
> **Пояснення:** *sonst* — «інакше, а то»: наслідок, якщо не зробити сказане. «Тоді» — *dann*.

## Фішки

> [!reel] 🎯 Aber — не лише «але»
> Слово *aber* у розмові стає «частинкою емоції»: *Das ist aber schön!* означає «Ого, як гарно!», а не «Це, але гарно». Воно підсилює здивування або захоплення. Типова риса живої німецької.

> [!reel] 🗣️ «Also…» — німецьке «ну…»
> Німці часто починають думку словом *Also,* — як ми «ну» або «отже». Це не завжди «тому»: часто це просто пауза, щоб зібратися з думками. *Also, ich glaube, wir sollten gehen.*

> [!reel] 🔁 Різниця в одну літеру: denn, dann, den
> *denn* — «бо», *dann* — «тоді, потім», *den* — артикль знахідного відмінка (*den Tisch*). Звучать майже однаково, а пишуться по-різному. Тест: *Ich esse, dann gehe ich* (потім), *Ich esse, denn ich habe Hunger* (бо).

## Джерела та що почитати

- [DWDS — sondern](https://www.dwds.de/wb/sondern): значення, вживання, відмінність від aber.
- [DWDS — deshalb](https://www.dwds.de/wb/deshalb): значення й вживання слова.
- [DWDS — trotzdem](https://www.dwds.de/wb/trotzdem): значення, вживання, етимологія.
- [DWDS — also](https://www.dwds.de/wb/also): значення, приклади, відмінність від auch.
- [DWDS — aber](https://www.dwds.de/wb/aber): значення й частинка aber.
- [Duden — deshalb](https://www.duden.de/rechtschreibung/deshalb): правопис і значення.
- [DW — Nicos Weg (A2)](https://learngerman.dw.com/uk/nicos-weg/c-36519789): безкоштовний відеокурс Deutsche Welle, теми звʼязного мовлення.
- H. Dreyer, R. Schmitt — *Lehr- und Übungsbuch der deutschen Grammatik* (Hueber) — розділ про сполучники.

> [!important] Підсумок
> - **Позиція 0** (порядок звичайний): *und, aber, oder, denn, sondern*; кома перед *aber, denn, sondern*.
> - **Позиція 1** (інверсія — дієслово перед підметом): *deshalb, deswegen, trotzdem, außerdem, dann, danach*.
> - *aber* — протиставлення; *sondern* — виправлення після заперечення.
> - *denn* — звичайний порядок; *weil* — дієслово в кінці.
> - *also* — «отже», а не «також» (*auch*).
