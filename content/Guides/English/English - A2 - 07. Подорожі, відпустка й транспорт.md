---
title: Подорожі, відпустка й транспорт
order: 207
id: en-a2-travel
level: A2
icon: px:globe
tags: [english, a2, vocabulary, travel, airport, prepositions-of-movement]
prerequisites: ["[[English - A1 - 24. Місто, транспорт і як пройти]]", "[[English - A2 - 02. Past Simple — правильні й неправильні дієслова]]"]
estimatedMinutes: 40
---

# Подорожі, відпустка й транспорт

> [!success] Після цієї теми ти зможеш
> - розрізняти *travel, trip, journey* і *holiday* та казати *How was your trip?* без помилок;
> - пройти аеропорт англійською: *check in, security, boarding pass, gate, delayed, customs*;
> - описати рух: *into, out of, across, through, along, past, towards, over*;
> - сказати, як ти їдеш: *by car, on the train, in a taxi, on foot*;
> - розповісти про свою подорож у Past Simple.

## Передбач

> [!quiz] Друг повернувся з Італії. Як спитати «Як пройшла поїздка?»
> level: A2 · id: en-a2-travel-q01
> - [ ] How was your travel?
> - [x] How was your trip?
> - [ ] How was your road?
> - [ ] How was your travelling?
>
> **Пояснення:** конкретна поїздка «туди й назад» — **trip**. *Travel* — це подорожування взагалі (і переважно незлічуване), а «як дорога?» дослівно (*your road*) англієць не зрозуміє.

## Простими словами

Українське «подорож» англійська розкладає на кілька слів — залежно від того, **на що** ти дивишся:

- **travel** — подорожування як заняття: *I love **travel**. **Travel** broadens the mind.* Найчастіше — дієслово: *We **travelled** around Spain.*
- **trip** — поїздка з метою, туди й назад: *a business **trip**, a day **trip**, a **trip** to the mountains.*
- **journey** — сам шлях з пункту А в пункт Б: *The **journey** took six hours.*
- **holiday** (UK) / **vacation** (US) — відпустка, канікули: *We're **on holiday** next week.*

> [!diagram] Аеропорт: від дверей до виходу на посадку
> ```yaml
> layout: flow
> nodes:
>   - { id: home, label: удома, text: "pack your suitcase", icon: "px:house" }
>   - { id: checkin, label: стійка реєстрації, text: "check in", note: "drop your luggage", tone: blue }
>   - { id: security, label: контроль, text: "security", note: "liquids, laptop out", tone: orange }
>   - { id: gate, label: вихід, text: "gate 12", note: "boarding", tone: violet }
>   - { id: plane, label: літак, text: "take off → land", tone: blue, icon: "px:rocket" }
>   - { id: arr, label: приліт, text: "baggage reclaim → customs → arrivals", tone: green }
> steps:
>   - { focus: home, note: "Спершу pack — пакуєш валізу (suitcase). Hand luggage — ручна поклажа." }
>   - { move: { from: home, to: checkin, value: "passport" }, note: "Check in: показуєш паспорт, здаєш багаж і отримуєш boarding pass — посадковий талон." }
>   - { move: { from: checkin, to: security, value: "boarding pass" }, note: "Security — перевірка безпеки: рідини окремо, ноутбук дістаєш із сумки." }
>   - { move: { from: security, to: gate, value: "boarding pass" }, note: "Дивишся табло departures (виліт) і йдеш до gate — виходу на посадку. Board — сідати на борт." }
>   - { move: { from: gate, to: plane, value: "passengers" }, note: "Літак take off — злітає, а потім land — приземляється. Якщо щось пішло не так — delayed (затримано) або cancelled (скасовано)." }
>   - { move: { from: plane, to: arr, value: "suitcase" }, note: "Baggage reclaim — видача багажу, customs — митниця, arrivals — зала прильоту. Ти на місці!" }
> ```

## Пояснення

### Travel, trip, journey, holiday

| Слово | Що це | Типові сполучення |
|---|---|---|
| **travel** | подорожування загалом; дієслово «подорожувати, їздити» | *travel abroad, travel by train, air travel* |
| **trip** | поїздка туди й назад, з метою | *go on a trip, a business trip, a school trip* |
| **journey** | дорога з А в Б | *a long journey, a train journey, Have a good journey!* |
| **holiday / vacation** | відпустка, відпочинок | *go on holiday, be on holiday, summer holidays* |

> [!quiz] Перевір себе: travel, trip чи journey?
> level: A2 · type: fill · bank · id: en-a2-travel-q02
>
> ```text fill
> I'm going on a business [[trip]] to Warsaw next week.
> The train [[journey]] from Kyiv to Lviv takes about five hours.
> My grandparents love to [[travel]]. They've been to twenty countries!
> ```
>
> **Пояснення:** конкретна поїздка з метою — **trip**; сама дорога, її тривалість — **journey**; подорожувати як заняття — дієслово **travel**.

### Як ти їдеш: by, on, in

- **by** + транспорт **без артикля**: *by car, by bus, by train, by plane, by bike*;
- **on** — для транспорту, де можна стояти й ходити: *on the bus, on the train, on the plane, on my bike*;
- **in** — для маленького транспорту: *in a car, in a taxi, in my dad's car*;
- пішки — **on foot**: *We went there **on foot**.*

Якщо є артикль чи присвійний займенник — *by* уже не працює: ***in my car***, не «by my car».

### Прийменники руху

| Прийменник | Значення | Приклад |
|---|---|---|
| **into** | у, всередину | *She walked **into** the shop.* |
| **out of** | з, назовні | *He got **out of** the taxi.* |
| **across** | через (поверхню, з боку на бік) | *We swam **across** the river.* |
| **through** | крізь, через (всередині) | *The train went **through** a tunnel.* |
| **along** | уздовж | *We walked **along** the beach.* |
| **past** | повз | *Go **past** the church.* |
| **towards** | у напрямку до | *He ran **towards** the exit.* |
| **over** | через (зверху), над | *The plane flew **over** the Alps.* |

> [!diagram] Прогулянка Лондоном: прийменники руху
> ```yaml
> layout: timeline
> nodes:
>   - { id: s1, at: "1", text: "We walked out of the hotel.", note: "out of — назовні", tone: blue }
>   - { id: s2, at: "2", text: "We walked along the river.", note: "along — уздовж", tone: blue }
>   - { id: s3, at: "3", text: "We went across the bridge.", note: "across — з одного боку на інший", tone: violet }
>   - { id: s4, at: "4", text: "We walked through the park.", note: "through — крізь, усередині", tone: green }
>   - { id: s5, at: "5", text: "We went past the museum.", note: "past — повз", tone: orange }
>   - { id: s6, at: "6", text: "We went into a café.", note: "into — всередину", tone: pink }
> steps:
>   - { show: s1, note: "Виходимо з готелю — out of. Протилежність — into." }
>   - { show: s2, note: "Ідемо вздовж річки — along: рух паралельно до лінії." }
>   - { show: s3, note: "Переходимо міст — across: з одного боку на інший, по поверхні." }
>   - { show: s4, note: "Парк — простір з деревами навколо. Ми всередині нього → through." }
>   - { show: s5, note: "Музей не цікавить — проходимо повз: past." }
>   - { show: s6, note: "І нарешті заходимо в кафе — into. Шість прийменників — одна прогулянка." }
> ```

> [!quiz] Перевір себе: прийменник руху
> level: A2 · id: en-a2-travel-q03
>
> *The road goes ___ the forest — it's dark and full of trees on both sides.*
>
> - [ ] across
> - [x] through
> - [ ] over
> - [ ] along
>
> **Пояснення:** ліс — обʼємний простір, дорога проходить **всередині** нього → **through**. *Across* — по відкритій поверхні: *across the road, across the field*.

## Приклади

- *We travelled around Italy by train.* — Ми подорожували Італією поїздом.
- *It was a long journey, but the views were amazing.* — Дорога була довга, але краєвиди неймовірні.
- *I booked a cheap hostel in the city centre.* — Я забронював дешевий хостел у центрі міста.
- *Our flight was delayed for three hours.* — Наш рейс затримали на три години.
- *Please have your boarding pass ready.* — Будь ласка, приготуйте посадковий талон.
- *We went sightseeing and bought some souvenirs.* — Ми оглядали визначні місця й купили кілька сувенірів.
- *She got out of the taxi and ran into the station.* — Вона вийшла з таксі й забігла на вокзал.
- *I always get jet lag after long flights.* — Після довгих перельотів у мене завжди джетлаг.
- *We spent two weeks at the seaside.* — Ми провели два тижні на морі.
- *Have a good journey! — Thanks, see you soon!* — Гарної дороги! — Дякую, до зустрічі!

## Слова

> [!word] travel
> ipa: /ˈtræv.əl/ · pos: verb · level: A2 · id: en-a2-travel-w01
> forms: travel → travelled → travelled
> uk: подорожувати, їздити; (n) подорожі
> example: I'd love to **travel** around Japan. — Я б дуже хотів поїздити Японією.
> note: UK travelled, travelling / US traveled, traveling. Іменник переважно незлічуваний: air travel.

> [!word] trip
> ipa: /trɪp/ · pos: noun · level: A2 · id: en-a2-travel-w02
> uk: поїздка
> example: We went on a day **trip** to Chernivtsi. — Ми поїхали на одноденну екскурсію до Чернівців.

> [!word] journey
> ipa: /ˈdʒɜː.ni/ · ipa-us: /ˈdʒɝː.ni/ · pos: noun · level: A2 · id: en-a2-travel-w03
> uk: дорога, шлях, переїзд
> example: How long is the **journey** to the airport? — Скільки їхати до аеропорту?

> [!word] holiday
> ipa: /ˈhɒl.ə.deɪ/ · ipa-us: /ˈhɑː.lə.deɪ/ · pos: noun · level: A2 · id: en-a2-travel-w04
> uk: відпустка, канікули; свято
> example: We're going **on holiday** to Croatia. — Ми їдемо у відпустку до Хорватії.
> note: UK holiday / US vacation. On holiday — не «in holiday».

> [!word] abroad
> ipa: /əˈbrɔːd/ · ipa-us: /əˈbrɑːd/ · pos: adv · level: A2 · id: en-a2-travel-w05
> uk: за кордон, за кордоном
> example: Have you ever lived **abroad**? — Ти колись жив за кордоном?
> note: без to: go abroad, не «go to abroad».

> [!word] destination
> ipa: /ˌdes.tɪˈneɪ.ʃən/ · pos: noun · level: A2 · id: en-a2-travel-w06
> uk: місце призначення, напрямок
> example: Lisbon is a popular **destination** for tourists. — Лісабон — популярний туристичний напрямок.

> [!word] book
> ipa: /bʊk/ · pos: verb · level: A2 · id: en-a2-travel-w07
> uk: бронювати, замовляти
> example: I **booked** the tickets online. — Я забронював квитки онлайн.

> [!word] booking
> ipa: /ˈbʊk.ɪŋ/ · pos: noun · level: A2 · id: en-a2-travel-w08
> uk: бронювання
> example: I have a **booking** for two nights. — У мене заброньовано номер на дві ночі.
> note: синонім — reservation (частіше в US і в ресторанах).

> [!word] passport
> ipa: /ˈpɑːs.pɔːt/ · ipa-us: /ˈpæs.pɔːrt/ · pos: noun · level: A2 · id: en-a2-travel-w09
> uk: паспорт (закордонний)
> example: Don't forget your **passport**! — Не забудь паспорт!

> [!word] visa
> ipa: /ˈviː.zə/ · pos: noun · level: A2 · id: en-a2-travel-w10
> uk: віза
> example: Do I need a **visa** for the USA? — Мені потрібна віза до США?

> [!word] baggage reclaim
> ipa: /ˈbæɡ.ɪdʒ rɪˌkleɪm/ · pos: noun · level: A2 · id: en-a2-travel-w11
> uk: видача багажу (в аеропорту)
> example: We waited at **baggage reclaim** for forty minutes. — Ми сорок хвилин чекали на видачі багажу.
> note: US — baggage claim. Сам багаж — luggage (UK) / baggage (US), незлічувані.

> [!word] suitcase
> ipa: /ˈsuːt.keɪs/ · pos: noun · level: A2 · id: en-a2-travel-w12
> uk: валіза
> example: My **suitcase** was too heavy. — Моя валіза була заважка.

> [!word] hand luggage
> ipa: /ˈhænd ˌlʌɡ.ɪdʒ/ · pos: noun · level: A2 · id: en-a2-travel-w13
> uk: ручна поклажа
> example: I only took **hand luggage**. — Я взяв лише ручну поклажу.
> note: US carry-on (bag).

> [!word] check in
> ipa: /ˌtʃek ˈɪn/ · pos: verb · level: A2 · id: en-a2-travel-w14
> uk: зареєструватися (на рейс, у готелі)
> example: We **checked in** online the night before. — Ми зареєструвалися онлайн напередодні ввечері.
> note: іменник — check-in (з дефісом): the check-in desk.

> [!word] boarding pass
> ipa: /ˈbɔː.dɪŋ ˌpɑːs/ · ipa-us: /ˈbɔːr.dɪŋ ˌpæs/ · pos: noun · level: A2 · id: en-a2-travel-w15
> uk: посадковий талон
> example: Can I see your **boarding pass**, please? — Можна ваш посадковий талон?

> [!word] departures
> ipa: /dɪˈpɑː.tʃəz/ · ipa-us: /dɪˈpɑːr.tʃɚz/ · pos: noun · level: A2 · id: en-a2-travel-w16
> uk: виліт, зала вильоту (на табло)
> example: Check the **departures** board for your gate. — Подивися номер виходу на табло вильоту.

> [!word] arrivals
> ipa: /əˈraɪ.vəlz/ · pos: noun · level: A2 · id: en-a2-travel-w17
> uk: приліт, зала прильоту
> example: I'll meet you in **arrivals**. — Зустріну тебе в залі прильоту.

> [!word] gate
> ipa: /ɡeɪt/ · pos: noun · level: A2 · id: en-a2-travel-w18
> uk: вихід на посадку; ворота
> example: Flight BA 882 is boarding at **gate** 14. — Посадка на рейс BA 882 — через вихід 14.

> [!word] flight
> ipa: /flaɪt/ · pos: noun · level: A2 · id: en-a2-travel-w19
> uk: рейс, переліт
> example: The **flight** to Barcelona took three hours. — Переліт до Барселони тривав три години.

> [!word] delayed
> ipa: /dɪˈleɪd/ · pos: adj · level: A2 · id: en-a2-travel-w20
> uk: затриманий (рейс, поїзд)
> example: Our train was **delayed** by an hour. — Наш поїзд затримали на годину.

> [!word] cancelled
> ipa: /ˈkæn.səld/ · pos: adj · level: A2 · id: en-a2-travel-w21
> uk: скасований
> example: All flights were **cancelled** because of the snow. — Через сніг усі рейси скасували.
> note: UK cancelled / US canceled.

> [!word] security
> ipa: /sɪˈkjʊə.rə.ti/ · ipa-us: /səˈkjʊr.ə.t̬i/ · pos: noun · level: A2 · id: en-a2-travel-w22
> uk: контроль безпеки; безпека
> example: There was a long queue at **security**. — На контролі безпеки була довга черга.

> [!word] customs
> ipa: /ˈkʌs.təmz/ · pos: noun · level: A2 · id: en-a2-travel-w23
> uk: митниця
> example: We went through **customs** quickly. — Ми швидко пройшли митницю.
> note: customs (митниця) — завжди з -s; a custom — звичай.

> [!word] land
> ipa: /lænd/ · pos: verb · level: A2 · id: en-a2-travel-w24
> uk: приземлятися
> example: We **landed** in Vienna at midnight. — Ми приземлилися у Відні опівночі.
> note: протилежне — take off (злітати).

> [!word] board
> ipa: /bɔːd/ · ipa-us: /bɔːrd/ · pos: verb · level: A2 · id: en-a2-travel-w25
> uk: сідати (на літак, поїзд, корабель)
> example: Passengers can now **board** the plane. — Пасажири вже можуть сідати в літак.

> [!word] aisle seat
> ipa: /ˈaɪl ˌsiːt/ · pos: noun · level: A2 · id: en-a2-travel-w26
> uk: місце біля проходу
> example: Could I have an **aisle seat**, please? — Можна місце біля проходу?
> note: aisle — s не читається, звучить як I'll.

> [!word] window seat
> ipa: /ˈwɪn.dəʊ ˌsiːt/ · ipa-us: /ˈwɪn.doʊ ˌsiːt/ · pos: noun · level: A2 · id: en-a2-travel-w27
> uk: місце біля вікна
> example: I always ask for a **window seat**. — Я завжди прошу місце біля вікна.

> [!word] go sightseeing
> ipa: /ˌɡəʊ ˈsaɪtˌsiː.ɪŋ/ · ipa-us: /ˌɡoʊ ˈsaɪtˌsiː.ɪŋ/ · pos: phrase · level: A2 · id: en-a2-travel-w28
> uk: оглядати визначні місця
> example: We **went sightseeing** in the old town. — Ми оглядали старе місто.
> note: the sights — визначні місця.

> [!word] guided tour
> ipa: /ˌɡaɪ.dɪd ˈtʊə/ · ipa-us: /ˌɡaɪ.dɪd ˈtʊr/ · pos: noun · level: A2 · id: en-a2-travel-w29
> uk: екскурсія з гідом
> example: We took a **guided tour** of the castle. — Ми оглянули замок з екскурсоводом.

> [!word] hostel
> ipa: /ˈhɒs.təl/ · ipa-us: /ˈhɑː.stəl/ · pos: noun · level: A2 · id: en-a2-travel-w30
> uk: хостел
> example: Students often stay in **hostels**. — Студенти часто зупиняються в хостелах.

> [!word] accommodation
> ipa: /əˌkɒm.əˈdeɪ.ʃən/ · ipa-us: /əˌkɑː.məˈdeɪ.ʃən/ · pos: noun · level: A2 · id: en-a2-travel-w31
> uk: житло (на час поїздки), проживання
> example: The price includes flights and **accommodation**. — Ціна включає переліт і проживання.
> note: у UK незлічуване; пишеться з двома c і двома m.

> [!word] souvenir
> ipa: /ˌsuː.vəˈnɪə/ · ipa-us: /ˌsuː.vəˈnɪr/ · pos: noun · level: A2 · id: en-a2-travel-w32
> uk: сувенір
> example: I bought a fridge magnet as a **souvenir**. — На памʼять я купив магніт на холодильник.

> [!word] pack
> ipa: /pæk/ · pos: verb · level: A2 · id: en-a2-travel-w33
> uk: пакувати (речі), збирати валізу
> example: Have you **packed** yet? — Ти вже спакувався?

> [!word] unpack
> ipa: /ʌnˈpæk/ · pos: verb · level: A2 · id: en-a2-travel-w34
> uk: розпаковувати
> example: I was too tired to **unpack**. — Я так утомився, що не мав сил розпаковувати речі.

> [!word] jet lag
> ipa: /ˈdʒet ˌlæɡ/ · pos: noun · level: A2 · id: en-a2-travel-w35
> uk: джетлаг, збій біоритму після перельоту
> example: I had terrible **jet lag** after the flight to Tokyo. — Після перельоту до Токіо в мене був жахливий джетлаг.

> [!word] the seaside
> ipa: /ðə ˈsiː.saɪd/ · pos: noun · level: A2 · id: en-a2-travel-w36
> uk: узбережжя, море (як місце відпочинку)
> example: We spent a week at **the seaside**. — Ми тиждень відпочивали на морі.
> note: «поїхати на море» — go to the seaside, не «go to the sea».

> [!word] the countryside
> ipa: /ðə ˈkʌn.tri.saɪd/ · pos: noun · level: A2 · id: en-a2-travel-w37
> uk: сільська місцевість, природа за містом
> example: I prefer holidays in **the countryside**. — Мені більше подобається відпочинок за містом.

> [!word] into
> ipa: /ˈɪn.tuː/ · pos: prep · level: A2 · id: en-a2-travel-w38
> uk: у, в (всередину — рух)
> example: She jumped **into** the pool. — Вона стрибнула в басейн.
> note: in — де? (місце), into — куди? (рух усередину).

> [!word] out of
> ipa: /ˈaʊt əv/ · pos: prep · level: A2 · id: en-a2-travel-w39
> uk: з, із (назовні)
> example: He got **out of** the car. — Він вийшов з машини.

> [!word] across
> ipa: /əˈkrɒs/ · ipa-us: /əˈkrɑːs/ · pos: prep · level: A2 · id: en-a2-travel-w40
> uk: через, на інший бік (по поверхні)
> example: Walk **across** the bridge and turn left. — Перейди міст і поверни ліворуч.

> [!word] through
> ipa: /θruː/ · pos: prep · level: A2 · id: en-a2-travel-w41
> uk: крізь, через (усередині чогось)
> example: The road goes **through** the mountains. — Дорога пролягає через гори.
> note: ough тут звучить /uː/; не плутай з though /ðəʊ/ і thought /θɔːt/.

> [!word] along
> ipa: /əˈlɒŋ/ · ipa-us: /əˈlɑːŋ/ · pos: prep · level: A2 · id: en-a2-travel-w42
> uk: уздовж, по
> example: We cycled **along** the coast. — Ми їхали велосипедами вздовж узбережжя.

> [!word] towards
> ipa: /təˈwɔːdz/ · ipa-us: /tɔːrdz/ · pos: prep · level: A2 · id: en-a2-travel-w43
> uk: у напрямку до, до
> example: The dog ran **towards** me. — Собака побіг до мене.
> note: UK towards / US частіше toward.

> [!word] past
> ipa: /pɑːst/ · ipa-us: /pæst/ · pos: prep · level: A2 · id: en-a2-travel-w44
> uk: повз
> example: Go **past** the bank and the station is on your right. — Пройди повз банк, і вокзал буде праворуч.

> [!word] over
> ipa: /ˈəʊ.və/ · ipa-us: /ˈoʊ.vɚ/ · pos: prep · level: A2 · id: en-a2-travel-w45
> uk: над; через (зверху)
> example: The plane flew **over** the city. — Літак пролетів над містом.

## Ситуація: на реєстрації в аеропорту

| | |
|---|---|
| **A:** Good morning. Can I see your passport, please? | Доброго ранку. Можна ваш паспорт? |
| **B:** Here you are. | Ось, будь ласка. |
| **A:** Are you checking in any bags today? | Здаватимете сьогодні багаж? |
| **B:** Just this suitcase. | Лише цю валізу. |
| **A:** Window or aisle? | Біля вікна чи біля проходу? |
| **B:** Window, please. | Біля вікна, будь ласка. |
| **A:** Here's your boarding pass. Boarding starts at 10:40 from gate 12. | Ось ваш посадковий талон. Посадка о 10:40, вихід 12. |
| **B:** Thank you. Is the flight on time? | Дякую. Рейс вилітає за розкладом? |
| **A:** Yes, it is. Have a good flight! | Так. Приємного польоту! |

## Слухаємо

> [!listen] Що ти почув?
> level: A2 · type: choice · id: en-a2-travel-l01
> audio: Our flight is delayed.
> - [x] Our flight is delayed.
> - [ ] Our flight is cancelled.
> - [ ] Our flight is on time.

> [!listen] Що ти почув?
> level: A2 · type: choice · id: en-a2-travel-l02
> audio: I'd like an aisle seat, please.
> - [ ] I'd like a window seat, please.
> - [x] I'd like an aisle seat, please.
> - [ ] I'd like a seat, please.

> [!listen] Напиши або скажи, що почув
> level: A2 · type: dictation · id: en-a2-travel-l03
> audio: We went on a trip to the mountains.

> [!listen] Напиши або скажи, що почув
> level: A2 · type: dictation · id: en-a2-travel-l04
> audio: Don't forget your passport and boarding pass.

> [!listen] З якого виходу посадка?
> level: A2 · type: answer · id: en-a2-travel-l05
> audio: A: Good morning. Can I see your passport, please?
> audio: B: Here you are.
> audio: A: Are you checking in any bags today?
> audio: B: Just this suitcase.
> audio: A: OK. Here's your boarding pass. Boarding starts at ten forty from gate twelve.
> - [ ] Вихід 2
> - [x] Вихід 12
> - [ ] Вихід 20
> - [ ] Вихід 40

> [!listen] Що сталося з багажем Емми?
> level: A2 · type: answer · id: en-a2-travel-l06
> audio: A: How was your trip to Scotland, Emma?
> audio: B: Amazing! But the journey was awful. Our flight was delayed for five hours, and then the airline lost my luggage.
> audio: A: Oh no! Did you get it back?
> audio: B: Yes, two days later.
> - [ ] Вона забула валізу вдома
> - [ ] Багаж не пропустили на митниці
> - [x] Авіакомпанія його загубила, але через два дні повернула
> - [ ] Валізу так і не знайшли

## Вимова

> [!speak] Скажи вголос
> level: A2 · id: en-a2-travel-s01
> text: Can I have a window seat, please?
> ipa: /kən aɪ ˌhæv ə ˈwɪn.dəʊ ˌsiːt pliːz/
> tip: can — слабке /kən/. seat — довге /iː/: «сі-іт», не «сіт» (sit — сидіти).

> [!speak] Скажи вголос
> level: A2 · id: en-a2-travel-s02
> text: I'd like an aisle seat, please.
> ipa: /aɪd ˌlaɪk ən ˈaɪl ˌsiːt pliːz/
> tip: aisle — /aɪl/, рівно як I'll. Літера s не читається. an aisle зливається: «е-нАйл».

> [!speak] Скажи вголос
> level: A2 · id: en-a2-travel-s03
> text: Just one suitcase and hand luggage.
> ipa: /dʒʌst wʌn ˈsuːt.keɪs ən ˈhænd ˌlʌɡ.ɪdʒ/
> tip: luggage — ЛА-ґідж: перше u як в cup, у кінці — /ɪdʒ/, не «-ейдж».

> [!speak] Скажи вголос
> level: A2 · id: en-a2-travel-s04
> text: Is the flight on time?
> ipa: /ɪz ðə ˈflaɪt ɒn ˈtaɪm/
> tip: голос угору в кінці — питання «так / ні». the — /ðə/: язик між зубами.

> [!speak] Скажи вголос
> level: A2 · id: en-a2-travel-s05
> text: We went abroad for two weeks.
> ipa: /wi ˌwent əˈbrɔːd fə tuː ˈwiːks/
> tip: abroad — наголос на другому складі: е-БРОД, з довгим /ɔː/. Без to перед abroad.

> [!speak] Скажи вголос
> level: A2 · id: en-a2-travel-s06
> text: How was your journey?
> ipa: /haʊ wəz jɔː ˈdʒɜː.ni/
> tip: journey — ДЖЕР-ні, звук /ɜː/ як у bird. Не «джорні».

## Типові помилки українців

> [!pitfall] «How was your travel?», «I like travels»
> «Поїздка» — це ***trip***, «дорога» — ***journey***. *Travel* — переважно дієслово або незлічуване «подорожування»: ***I like travelling*** (UK) / *traveling* (US). *Travels* у множині буває лише в книжному «мандри»: *Gulliver's Travels*.

> [!pitfall] «Luggages», «two baggages»
> *Luggage* і *baggage* — незлічувані, як «багаж» загалом: ***How much luggage** do you have?* Рахуємо валізами: *two suitcases* або *two pieces of luggage*.

> [!pitfall] «Go to abroad», «by my car», «in holiday»
> - ***go abroad*** — без *to* (як *go home*);
> - *by* — лише без артикля: ***by car***, але ***in my car***;
> - у відпустці — ***on holiday***, не «in holiday».

## Практика

> [!quiz] Встав by, on або in
> level: A2 · type: fill · id: en-a2-travel-q04
>
> ```text fill
> We usually go to my grandparents' [[by]] train.
> I left my umbrella [[on]] the bus this morning!
> She came to the party [[in]] a taxi.
> It's only ten minutes [[on]] foot.
> ```
>
> **Пояснення:** *by train* — спосіб, без артикля; *on the bus* — транспорт, у якому можна ходити; *in a taxi* — маленький транспорт; пішки — *on foot*.

> [!quiz] Склади речення: «Ми перейшли через міст»
> level: A2 · type: order · id: en-a2-travel-q05
>
> ```text order
> We
> walked
> across
> the bridge.
> into // ✗
> ```
>
> **Пояснення:** міст переходимо з одного боку на інший по поверхні → **across**.

> [!quiz] Яке питання правильне?
> level: A2 · id: en-a2-travel-q06
> - [ ] How many luggages do you have?
> - [x] How much luggage do you have?
> - [ ] How many luggage do you have?
> - [ ] How much luggages do you have?
>
> **Пояснення:** *luggage* — незлічуване, тож **how much** і без *-s*.

> [!quiz] Обери все, що робиш в аеропорту ДО посадки в літак
> level: A2 · id: en-a2-travel-q07
> - [x] check in
> - [x] go through security
> - [ ] go through customs
> - [x] find your gate
> - [ ] land
>
> **Пояснення:** митницю (*customs*) проходиш **після** прильоту, а *land* — це приземлення.

> [!quiz] Що відбувається першим?
> level: A2 · id: en-a2-travel-q08
> - [ ] board → check in → security
> - [x] check in → security → board
> - [ ] security → board → check in
> - [ ] check in → board → security
>
> **Пояснення:** спершу реєстрація (*check in*), потім контроль безпеки (*security*), і лише тоді посадка (*board*).

> [!quiz] Заповни табло аеропорту
> level: A2 · type: fill · bank: journey, custom · id: en-a2-travel-q09
>
> ```text fill
> Flight LO 752 to Warsaw — [[delayed]] (затримано) — new time 14:30
> Flight PS 101 to Rome — [[cancelled]] (скасовано)
> Flight W6 330 to Vienna — boarding at [[gate]] (вихід) 7
> After you land, go through [[customs]] (митниця) to arrivals.
> ```
>
> **Пояснення:** *delayed* — затримано, *cancelled* (UK) — скасовано, *gate* — вихід на посадку, *customs* — митниця (завжди з *-s*).

> [!quiz] Склади речення: «Наш рейс скасували через сніг»
> level: A2 · type: order · id: en-a2-travel-q10
>
> ```text order
> Our flight
> was
> cancelled
> because of the snow.
> cancel // ✗
> ```
>
> **Пояснення:** «рейс скасували» — *the flight was cancelled*: *was* + форма на *-ed*. Причина — *because of*.

## Фішки

> [!reel] 💺 Aisle — літера s просто для краси
> У старофранцузькій було ele — «крило» (будівлі). Англійці додали s, сплутавши з isle — «острів». Вимова лишилась /aɪl/, як I'll.

> [!reel] 🌅 Journey — це «день дороги»
> Слово journey прийшло з французького journée — «день». Спершу так називали відстань, яку можна пройти за один день. Звідси й journal — щоденник.

> [!reel] 🧳 Luggage — те, що тягнеш
> Luggage — від дієслова lug, «тягти щось важке». Тому багаж і незлічуваний: це не речі поштучно, а вся ноша, яку ти тягнеш за собою.

## Джерела та що почитати

- 🟢 [Cambridge Dictionary — Travel, trip or journey?](https://dictionary.cambridge.org/grammar/british-grammar/travel-trip-or-journey) — різниця на прикладах.
- 🟢 M. McCarthy, F. O'Dell — *English Vocabulary in Use: Elementary* (Cambridge): розділи про подорожі, аеропорт і готель.
- 🟡 [Oxford Learner's Dictionaries — Oxford 3000](https://www.oxfordlearnersdictionaries.com/wordlists/oxford3000-5000) — вимова UK / US для кожного слова.
- 🟡 [BBC Learning English](https://www.bbc.co.uk/learningenglish) — розмовні ситуації в аеропорту й готелі.

> [!important] Підсумок
> - **trip** — поїздка, **journey** — дорога, **travel** — подорожувати (і незлічуване «подорожі»), **holiday** — відпустка (*on holiday*).
> - Аеропорт: *check in → security → gate → board → take off → land → baggage reclaim → customs → arrivals*.
> - *By car / by train* (без артикля), *on the bus / on the train*, *in a taxi*, *on foot*.
> - Прийменники руху: *into, out of, across, through, along, past, towards, over*.
> - *Luggage* — незлічуване; *go abroad* — без *to*.
