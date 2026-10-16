---
title: Місто, транспорт і як пройти
order: 124
id: en-a1-city
level: A1
icon: px:traffic
tags: [english, a1, vocabulary, city, transport, directions, imperative, situation]
prerequisites: ["[[English - A1 - 20. There is, there are — дім і кімнати]]", "[[English - A1 - 21. Can і can't — уміння й прохання]]"]
estimatedMinutes: 40
---

# Місто, транспорт і як пройти

> [!success] Після цієї теми ти зможеш
> - назвати місця в місті: *bank, post office, station, museum, library…*;
> - розповісти, як дістаєшся кудись: *by bus, by train, on foot*;
> - спитати дорогу: *Excuse me, how do I get to the station? Is there a bank near here?*;
> - зрозуміти й дати просту інструкцію: *Go straight on, turn left, it's on the right.*

## Передбач

> [!quiz] Як сказати «Я їжджу на роботу автобусом»?
> level: A1 · id: en-a1-city-q01
> - [x] I go to work by bus.
> - [ ] I go to work with bus.
> - [ ] I go to work by the bus.
> - [ ] I go to work bus.
>
> **Пояснення:** вид транспорту — ***by** + назва без артикля*: *by bus, by train, by taxi*. Українське «автобусом» перекладаємо не через *with*, а через *by*.

## Місця в місті

| Що | Українською | Що | Українською |
|---|---|---|---|
| *bank* | банк | *station* | вокзал, станція |
| *post office* | пошта | *bus stop* | автобусна зупинка |
| *supermarket* | супермаркет | *car park* | парковка |
| *shop* | магазин | *street / road* | вулиця / дорога |
| *café* | кафе | *bridge* | міст |
| *hotel* | готель | *corner* | ріг (вулиці) |
| *hospital* | лікарня | *traffic lights* | світлофор |
| *museum* | музей | *park* | парк |
| *cinema* | кінотеатр | *city centre* | центр міста |
| *library* | бібліотека | *town* | (невелике) місто |

Аптека — *chemist's* (US *pharmacy*); детальніше про неї — в A2, у темі [[English - A2 - 16. Здоровʼя, тіло й у лікаря]].

## Транспорт: by bus, on foot

| Як | Приклад |
|---|---|
| ***by** + транспорт* (без артикля) | *I go to work **by** bus / **by** train / **by** tram / **by** taxi / **by** underground.* |
| ***on foot*** — пішки | *I go to school **on foot**.* (частіше просто *I walk to school.*) |
| ***take** + the / a + транспорт* | *I **take the bus** to work. Let's **take a taxi**.* |
| ***get on / get off*** — сісти / вийти | ***Get off** at the third stop.* |

Не ~~by foot~~, а *on foot*. І не ~~with the bus~~, а *by bus*. Якщо транспорт «твій» або конкретний — уже з прийменником місця: *in my car, on the 7:15 train*.

## Як спитати дорогу

Почни з ***Excuse me*** — «перепрошую». Далі один із трьох варіантів:

| Питання | Українською |
|---|---|
| *Excuse me, **where is** the station?* | Перепрошую, де вокзал? |
| *Excuse me, **how do I get to** the museum?* | Як мені дістатися до музею? |
| *Excuse me, **is there a** bank **near here**?* | Тут поблизу є банк? |

Корисні відповіді: *It's not far. It's five minutes' walk. It's on the left / on the right. It's opposite the park. It's next to the bank.* (прийменники місця — з теми [[English - A1 - 20. There is, there are — дім і кімнати]]).

## Як пояснити дорогу — наказовий спосіб

Інструкції англійською — це **наказовий спосіб**: просто дієслово, без *you*. Звучить коротко, але це нормально і ввічливо для маршруту.

| Дія | Українською |
|---|---|
| ***Go straight on.*** (US *Go straight ahead.*) | Ідіть прямо. |
| ***Turn left / Turn right.*** | Поверніть ліворуч / праворуч. |
| ***Take the second left.*** | Друга вулиця ліворуч. |
| ***Go past** the bank.* | Пройдіть повз банк. |
| ***Cross** the road / the bridge.* | Перейдіть дорогу / міст. |
| ***Go along** this street.* | Ідіть цією вулицею. |
| *It's **on the left / on the right**.* | Це ліворуч / праворуч. |

Заперечення — ***Don't*** + дієслово: ***Don't** cross here. **Don't** turn left.*

> [!diagram] Маршрут до музею
> ```yaml
> layout: flow
> nodes:
>   - { id: start, label: "you are here", text: "Ти тут", tone: blue, icon: "px:map" }
>   - { id: straight, label: "1", text: "Go straight on.", tone: gray }
>   - { id: left, label: "2", text: "Turn left at the traffic lights.", tone: gray }
>   - { id: past, label: "3", text: "Go past the bank.", tone: gray }
>   - { id: museum, label: "the museum", text: "It's on the right.", tone: green }
> steps:
>   - { focus: start, note: "Питаєш: Excuse me, how do I get to the museum?" }
>   - { move: { from: start, to: straight, value: "you" }, note: "Go straight on — ідеш прямо, нікуди не звертаєш." }
>   - { move: { from: straight, to: left, value: "you" }, note: "Turn left at the traffic lights — на світлофорі ліворуч. At — бо світлофор — точка на маршруті." }
>   - { move: { from: left, to: past, value: "you" }, note: "Go past the bank — проходиш повз банк, не заходячи." }
>   - { move: { from: past, to: museum, value: "you" }, note: "It's on the right — музей праворуч. Thank you! — You're welcome!" }
> ```

> [!quiz] Перевір себе: як сказати «пішки»?
> level: A1 · id: en-a1-city-q02
> - [x] on foot
> - [ ] by foot
> - [ ] with feet
> - [ ] on feet
>
> **Пояснення:** виняток із правила *by + транспорт*: пішки — ***on foot***. Або просто дієслово: *I walk to work.*

## Приклади

- Excuse me, is there a post office near here? — Перепрошую, тут поблизу є пошта?
- How do I get to the city centre? — Як мені дістатися до центру міста?
- Take the number 12 bus and get off at the museum. — Сідайте на дванадцятий автобус і виходьте біля музею.
- Go straight on and turn right at the corner. — Ідіть прямо й на розі поверніть праворуч.
- The library is opposite the hospital. — Бібліотека навпроти лікарні.
- I usually go to work by tram, but today I'm going by taxi. — Я зазвичай їжджу на роботу трамваєм, але сьогодні — таксі.
- It's not far — about ten minutes on foot. — Це недалеко, хвилин десять пішки.
- Don't cross here. Use the traffic lights. — Не переходьте тут. Ідіть до світлофора.
- Sorry, I'm not from here. — Вибачте, я не місцевий.
- Can you show me on the map? — Можете показати мені на мапі?

## Слова

> [!word] bank
> ipa: /bæŋk/ · pos: noun · level: A1 · id: en-a1-city-w01
> uk: банк
> example: The **bank** is next to the supermarket. — Банк поруч із супермаркетом.
> note: також берег річки: *the river bank*.

> [!word] post office
> ipa: /ˈpəʊst ɒfɪs/ · ipa-us: /ˈpoʊst ɑːfɪs/ · pos: noun · level: A1 · id: en-a1-city-w02
> uk: пошта (відділення)
> example: Where's the nearest **post office**? — Де найближча пошта?

> [!word] supermarket
> ipa: /ˈsuːpəmɑːkɪt/ · ipa-us: /ˈsuːpərmɑːrkɪt/ · pos: noun · level: A1 · id: en-a1-city-w03
> uk: супермаркет
> example: Is there a **supermarket** near here? — Тут поблизу є супермаркет?

> [!word] shop
> ipa: /ʃɒp/ · ipa-us: /ʃɑːp/ · pos: noun · level: A1 · id: en-a1-city-w04
> uk: магазин; крамниця
> example: The **shops** close at six on Sundays. — У неділю магазини зачиняються о шостій.
> note: у США — *store*. *Magazine* — журнал, не магазин!

> [!word] café
> ipa: /ˈkæfeɪ/ · ipa-us: /kæˈfeɪ/ · pos: noun · level: A1 · id: en-a1-city-w05
> uk: кафе
> example: Let's meet at the **café** on the corner. — Зустріньмося в кафе на розі.
> note: часто пишуть без наголосу: *cafe*.

> [!word] hotel
> ipa: /həʊˈtel/ · ipa-us: /hoʊˈtel/ · pos: noun · level: A1 · id: en-a1-city-w06
> uk: готель
> example: Our **hotel** is in the city centre. — Наш готель у центрі міста.
> note: наголос на другому складі: «хəу-ТЕЛ».

> [!word] hospital
> ipa: /ˈhɒspɪtl/ · ipa-us: /ˈhɑːspɪtl/ · pos: noun · level: A1 · id: en-a1-city-w07
> uk: лікарня
> example: The **hospital** is on Shevchenko Street. — Лікарня на вулиці Шевченка.
> note: наголос на першому складі: «ХОС-пі-тл».

> [!word] museum
> ipa: /mjuˈziːəm/ · pos: noun · level: A1 · id: en-a1-city-w08
> uk: музей
> example: The **museum** is closed on Mondays. — Музей зачинений по понеділках.
> note: наголос на «ЗІ»: «мʼю-ЗІ-əм».

> [!word] park
> ipa: /pɑːk/ · ipa-us: /pɑːrk/ · pos: noun · level: A1 · id: en-a1-city-w09
> uk: парк
> example: I walk in the **park** every morning. — Я щоранку гуляю в парку.
> note: як дієслово — паркуватися: *Where can I park?*

> [!word] cinema
> ipa: /ˈsɪnəmə/ · pos: noun · level: A1 · id: en-a1-city-w10
> uk: кінотеатр
> example: Let's go to the **cinema** tonight. — Ходімо сьогодні в кіно.
> note: у США — *movie theater*, а «піти в кіно» — *go to the movies*.

> [!word] library
> ipa: /ˈlaɪbrəri/ · ipa-us: /ˈlaɪbreri/ · pos: noun · level: A1 · id: en-a1-city-w11
> uk: бібліотека
> example: I study in the **library** after work. — Після роботи я вчуся в бібліотеці.
> note: книгарня — *bookshop* (US *bookstore*).

> [!word] station
> ipa: /ˈsteɪʃn/ · pos: noun · level: A1 · id: en-a1-city-w12
> uk: вокзал; станція
> example: How do I get to the train **station**? — Як дістатися до залізничного вокзалу?

> [!word] bus stop
> ipa: /ˈbʌs stɒp/ · ipa-us: /ˈbʌs stɑːp/ · pos: noun · level: A1 · id: en-a1-city-w13
> uk: автобусна зупинка
> example: The **bus stop** is opposite the bank. — Зупинка навпроти банку.

> [!word] car park
> ipa: /ˈkɑː pɑːk/ · ipa-us: /ˈkɑːr pɑːrk/ · pos: noun · level: A1 · id: en-a1-city-w14
> uk: парковка; автостоянка
> example: Is there a **car park** near the hotel? — Біля готелю є парковка?
> note: у США — *parking lot*.

> [!word] street
> ipa: /striːt/ · pos: noun · level: A1 · id: en-a1-city-w15
> uk: вулиця
> example: I live on Franko **Street**. — Я живу на вулиці Франка.
> note: у Британії «на вулиці» — *in* або *on*: *in / on Oxford Street*; у США — *on*.

> [!word] road
> ipa: /rəʊd/ · ipa-us: /roʊd/ · pos: noun · level: A1 · id: en-a1-city-w16
> uk: дорога; вулиця
> example: Be careful when you cross the **road**. — Обережно, коли переходиш дорогу.

> [!word] petrol station
> ipa: /ˈpetrəl steɪʃn/ · pos: noun · level: A1 · id: en-a1-city-w17
> uk: заправка; АЗС
> example: Is there a **petrol station** near here? — Тут поблизу є заправка?
> note: у США — *gas station*. Бензин: UK *petrol*, US *gas*.

> [!word] corner
> ipa: /ˈkɔːnə/ · ipa-us: /ˈkɔːrnər/ · pos: noun · level: A1 · id: en-a1-city-w18
> uk: ріг (вулиці); кут
> example: There's a café **on the corner**. — На розі є кафе.
> note: ріг вулиці — *on the corner*, кут кімнати — *in the corner*.

> [!word] traffic lights
> ipa: /ˈtræfɪk laɪts/ · pos: noun · level: A1 · id: en-a1-city-w19
> uk: світлофор
> example: Turn left at the **traffic lights**. — На світлофорі поверніть ліворуч.
> note: завжди множина — бо вогнів кілька.

> [!word] city centre
> ipa: /ˌsɪti ˈsentə/ · ipa-us: /ˌsɪti ˈsentər/ · pos: noun · level: A1 · id: en-a1-city-w20
> uk: центр міста
> example: The bus goes to the **city centre**. — Автобус їде до центру міста.
> note: у США пишуть *center*, а центр міста часто називають *downtown*.

> [!word] town
> ipa: /taʊn/ · pos: noun · level: A1 · id: en-a1-city-w21
> uk: місто (невелике); містечко
> example: I'm from a small **town** near Poltava. — Я з невеликого міста під Полтавою.
> note: велике місто — *city*. «Піти в центр» — *go into town*.

> [!word] bus
> ipa: /bʌs/ · pos: noun · level: A1 · id: en-a1-city-w22
> uk: автобус
> example: I go to work **by bus**. — Я їжджу на роботу автобусом.
> forms: bus → buses
> note: читається «бас», не «бус».

> [!word] train
> ipa: /treɪn/ · pos: noun · level: A1 · id: en-a1-city-w23
> uk: поїзд; потяг
> example: The **train** to Kyiv leaves at nine. — Поїзд до Києва відправляється о девʼятій.

> [!word] tram
> ipa: /træm/ · pos: noun · level: A1 · id: en-a1-city-w24
> uk: трамвай
> example: Take the number 3 **tram**. — Сідайте на третій трамвай.

> [!word] underground
> ipa: /ˈʌndəɡraʊnd/ · ipa-us: /ˈʌndərɡraʊnd/ · pos: noun · level: A1 · id: en-a1-city-w25
> uk: метро
> example: It's quicker by **underground**. — Метро швидше.
> note: у Лондоні — *the Tube*, у США — *the subway*, у багатьох містах — *the metro*.

> [!word] taxi
> ipa: /ˈtæksi/ · pos: noun · level: A1 · id: en-a1-city-w26
> uk: таксі
> example: Let's take a **taxi** — it's late. — Візьмімо таксі, вже пізно.
> note: у США також *cab*.

> [!word] on foot
> ipa: /ɒn ˈfʊt/ · ipa-us: /ɑːn ˈfʊt/ · pos: phrase · level: A1 · id: en-a1-city-w27
> uk: пішки
> example: It's ten minutes **on foot**. — Це десять хвилин пішки.
> note: не ~~by foot~~.

> [!word] ticket
> ipa: /ˈtɪkɪt/ · pos: noun · level: A1 · id: en-a1-city-w28
> uk: квиток
> example: Where can I buy a bus **ticket**? — Де можна купити квиток на автобус?

> [!word] get off
> ipa: /ɡet ˈɒf/ · ipa-us: /ɡet ˈɔːf/ · pos: phrase · level: A1 · id: en-a1-city-w29
> uk: виходити (з транспорту)
> example: **Get off** at the next stop. — Виходьте на наступній зупинці.
> note: сідати — *get on* (автобус, поїзд), але *get in / get out of* — таксі, машина.

> [!word] turn left
> ipa: /tɜːn ˈleft/ · ipa-us: /tɝːn ˈleft/ · pos: phrase · level: A1 · id: en-a1-city-w30
> uk: повернути ліворуч
> example: **Turn left** at the bank. — Біля банку поверніть ліворуч.

> [!word] turn right
> ipa: /tɜːn ˈraɪt/ · ipa-us: /tɝːn ˈraɪt/ · pos: phrase · level: A1 · id: en-a1-city-w31
> uk: повернути праворуч
> example: **Turn right** at the traffic lights. — На світлофорі поверніть праворуч.

> [!word] go straight on
> ipa: /ɡəʊ ˌstreɪt ˈɒn/ · pos: phrase · level: A1 · id: en-a1-city-w32
> uk: іти прямо
> example: **Go straight on** for two hundred metres. — Ідіть прямо двісті метрів.
> note: у США — *go straight ahead*.

> [!word] go past
> ipa: /ɡəʊ ˈpɑːst/ · ipa-us: /ɡoʊ ˈpæst/ · pos: phrase · level: A1 · id: en-a1-city-w33
> uk: пройти (проїхати) повз
> example: **Go past** the church and it's on the left. — Пройдіть повз церкву, і це ліворуч.

> [!word] cross
> ipa: /krɒs/ · ipa-us: /krɔːs/ · pos: verb · level: A1 · id: en-a1-city-w34
> uk: переходити; перетинати
> example: **Cross** the road at the traffic lights. — Переходьте дорогу на світлофорі.

> [!word] on the left
> ipa: /ɒn ðə ˈleft/ · ipa-us: /ɑːn ðə ˈleft/ · pos: phrase · level: A1 · id: en-a1-city-w35
> uk: ліворуч; зліва
> example: The museum is **on the left**. — Музей ліворуч.
> note: праворуч — *on the right*.

> [!word] far
> ipa: /fɑː/ · ipa-us: /fɑːr/ · pos: adj · level: A1 · id: en-a1-city-w36
> uk: далеко; далекий
> example: Is it **far**? — No, it's very close. — Це далеко? — Ні, зовсім близько.
> note: у ствердженні частіше *a long way*: *It's a long way from here.*

> [!word] map
> ipa: /mæp/ · pos: noun · level: A1 · id: en-a1-city-w37
> uk: мапа; карта
> example: Can you show me on the **map**? — Можете показати на мапі?
> note: банківська картка — *card*, а не *map*.

> [!word] How do I get to…?
> ipa: /haʊ duː aɪ ˈɡet tə/ · pos: phrase · level: A1 · id: en-a1-city-w38
> uk: Як мені дістатися до…?
> example: Excuse me, **how do I get to** the station? — Перепрошую, як мені дістатися до вокзалу?

> [!word] Excuse me
> ipa: /ɪkˈskjuːz miː/ · pos: phrase · level: A1 · id: en-a1-city-w39
> uk: перепрошую; вибачте (щоб звернутися)
> example: **Excuse me**, is there a bank near here? — Перепрошую, тут поблизу є банк?
> note: щоб звернутися до незнайомця — *Excuse me*; щоб вибачитися за помилку — *Sorry*.

## Слухаємо

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: en-a1-city-l01
> audio: Turn left at the traffic lights.
> - [x] Turn left at the traffic lights.
> - [ ] Turn right at the traffic lights.
> - [ ] Turn left at the bank.

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: en-a1-city-l02
> audio: Is there a bank near here?
> - [ ] Is there a park near here?
> - [x] Is there a bank near here?
> - [ ] There's a bank near here.

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: en-a1-city-l03
> audio: Get off at the second stop.
> - [ ] Get on at the second stop.
> - [ ] Get off at the next stop.
> - [x] Get off at the second stop.

> [!listen] Надрукуй, що почуєш
> level: A1 · type: dictation · speed: slow · id: en-a1-city-l04
> audio: Go straight on and turn right.

> [!listen] Надрукуй, що почуєш
> level: A1 · type: dictation · speed: slow · id: en-a1-city-l05
> audio: The museum is on the left.

> [!listen] Як ця людина їздить на роботу?
> level: A1 · type: answer · speed: slow · id: en-a1-city-l06
> audio: I don't have a car. I go to work by tram. It takes twenty minutes.
> - [ ] Машиною
> - [x] Трамваєм
> - [ ] Пішки

> [!listen] Де пошта?
> level: A1 · type: answer · speed: slow · id: en-a1-city-l07
> audio: The post office is opposite the park, next to the café.
> - [x] Навпроти парку, поруч із кафе
> - [ ] Поруч із парком, навпроти кафе
> - [ ] За парком

## Вимова

> [!speak] Скажи вголос
> level: A1 · id: en-a1-city-s01
> text: Excuse me, how do I get to the station?
> ipa: /ɪkˈskjuːz mi haʊ də aɪ ˈɡet tə ðə ˈsteɪʃn/
> tip: *get to* — два *t* зливаються в одне: «ге-тə». Station — «СТЕЙ-шн», без «ці».

> [!speak] Скажи вголос
> level: A1 · id: en-a1-city-s02
> text: Is there a supermarket near here?
> ipa: /ɪz ðər ə ˈsuːpəmɑːkɪt ˈnɪə hɪə/
> tip: *near here* — «НІə хіə»: /h/ — легкий видих, не «г».

> [!speak] Скажи вголос
> level: A1 · id: en-a1-city-s03
> text: Go straight on and turn left at the corner.
> ipa: /ɡəʊ ˌstreɪt ˈɒn ən tɜːn ˈleft ət ðə ˈkɔːnə/
> tip: *turn* — довгий /ɜː/, а *r* у британській не вимовляється. *Straight on* злито: «стрей-ТОН».

> [!speak] Скажи вголос
> level: A1 · id: en-a1-city-s04
> text: I go to work on foot.
> ipa: /aɪ ɡəʊ tə ˈwɜːk ɒn ˈfʊt/
> tip: *foot* — короткий /ʊ/: «фут», не «фуут». *Work* — /w/ губами, не «ворк».

## Типові помилки українців

> [!pitfall] «Magazine» — це не магазин
> *Magazine* — журнал. Магазин — ***shop*** (US *store*), великий — *supermarket*. «Я йду в магазин» — *I'm going to the shop.*

> [!pitfall] «With bus», «by foot», «by the bus»
> Транспорт — ***by** + без артикля*: *by bus, by train, by car*. Пішки — ***on foot***. Або через дієслово: *I take the bus. I walk.*

> [!pitfall] «You go straight and you turn left» — зайве you
> В інструкції наказовий спосіб без підмета: ***Go** straight on. **Turn** left.* Це не грубо — так у маршруті говорять усі. Ввічливість додають *Excuse me* у питанні й *please* / *thank you*.

> [!pitfall] «Where is the station?» без «Excuse me»
> Звернутися до незнайомця без вступу — неввічливо. Спершу ***Excuse me***, а в кінці — ***Thank you!*** А *Sorry* — коли щось сталося: наступив на ногу, не почув.

## Ситуація: шукаємо аптеку

> [!listen] Послухай діалог на вулиці. Де аптека?
> level: A1 · type: answer · speed: slow · id: en-a1-city-l08
> audio: A: Excuse me, is there a chemist's near here?
> audio: B: Yes, there's one on King Street.
> audio: A: How do I get there?
> audio: B: Go straight on, then take the second left. Go past the cinema. It's on the right, opposite the bank.
> audio: A: Is it far?
> audio: B: No, it's about five minutes on foot.
> audio: A: Thank you very much!
> - [x] Друга вулиця ліворуч, повз кінотеатр, праворуч навпроти банку
> - [ ] Перша вулиця праворуч, поруч із банком
> - [ ] Друга вулиця ліворуч, ліворуч навпроти кінотеатру

Тепер ти — перехожий, який шукає аптеку. Спитай уголос:

> [!speak] «Перепрошую, тут поблизу є аптека?»
> level: A1 · id: en-a1-city-s05
> text: Excuse me, is there a chemist's near here?
> ipa: /ɪkˈskjuːz mi ɪz ðər ə ˈkemɪsts nɪə hɪə/
> tip: *chemist's* — «КЕ-містс», *ch* тут читається як /k/.

> [!speak] «Як туди дістатися? Це далеко?»
> level: A1 · id: en-a1-city-s06
> text: How do I get there? Is it far?
> ipa: /haʊ də aɪ ˈɡet ðeə ɪz ɪt ˈfɑː/
> tip: *there* — /ð/, язик між зубами. *Is it far?* — питання «так / ні», голос угору.

## Практика

> [!quiz] Заповни пропуски в маршруті
> level: A1 · type: fill · bank: cross, in · id: en-a1-city-q03
>
> ```text fill
> Go [[straight]] on. [[Turn]] left at the traffic lights.
> Go [[past]] the bank. The museum is [[on]] the right.
> ```
>
> **Пояснення:** *go straight on* — прямо, *turn left* — ліворуч, *go past* — повз, *on the right* — праворуч.

> [!quiz] «Я йду в магазин по хліб». Яке слово потрібне?
> level: A1 · id: en-a1-city-q04
> - [x] I'm going to the shop to buy some bread.
> - [ ] I'm going to the magazine to buy some bread.
> - [ ] I'm going to the shopping to buy some bread.
> - [ ] I'm going to the store-house to buy some bread.
>
> **Пояснення:** магазин — *shop* (US *store*). *Magazine* — журнал: класичний хибний друг.

> [!quiz] Склади питання: «Перепрошую, як мені дістатися до вокзалу?»
> level: A1 · type: order · id: en-a1-city-q05
>
> ```text order
> Excuse me,
> how do I
> get to
> the station?
> get on # ✗
> ```
>
> **Пояснення:** *How do I get to…?* — стандартне питання про дорогу. *Get on* — сідати в транспорт.

> [!quiz] «Не переходьте тут дорогу». Як сказати англійською?
> level: A1 · id: en-a1-city-q06
> - [x] Don't cross the road here.
> - [ ] Not cross the road here.
> - [ ] You don't cross the road here.
> - [ ] No cross the road here.
>
> **Пояснення:** заперечний наказ — ***Don't*** + дієслово: *Don't cross, don't turn, don't stop.*

> [!quiz] Заповни пропуски: британське слово → американське
> level: A1 · type: fill · bank: tram, highway · id: en-a1-city-q07
>
> ```text fill
> underground  →  [[subway]]
> car park     →  [[parking lot]]
> shop         →  [[store]]
> ```
>
> **Пояснення:** метро в Нью-Йорку — *subway*, парковка — *parking lot*, магазин — *store*.

> [!quiz] «Is there a bank near here?» — яка відповідь природна?
> level: A1 · id: en-a1-city-q08
> - [x] Yes, there's one on Green Street.
> - [ ] Yes, it is.
> - [ ] Yes, there are.
> - [ ] Yes, near.
>
> **Пояснення:** *one* замінює *a bank*, щоб не повторювати: *there's one on Green Street*. Питали з *is there* — відповідаємо *there is / there's*.

> [!quiz] Склади інструкцію: «Виходьте на другій зупинці».
> level: A1 · type: order · id: en-a1-city-q09
>
> ```text order
> Get off
> at
> the second
> stop.
> Get on # ✗
> ```
>
> **Пояснення:** виходити з автобуса — *get off*, «на зупинці» — *at the stop*.

> [!quiz] Що означає «It's five minutes' walk»?
> level: A1 · id: en-a1-city-q10
> - [ ] Це пʼять хвилин їзди
> - [x] Це пʼять хвилин пішки
> - [ ] Ідіть пʼять хвилин і поверніть
> - [ ] Чекайте пʼять хвилин
>
> **Пояснення:** *walk* тут іменник — «прогулянка, шлях пішки». Те саме — *five minutes on foot*.

## Фішки

> [!reel] 🚇 The Tube — найстаріше метро у світі
> Лондонське метро відкрили 1863 року — тоді потяги тягнули паротяги прямо під землею. Лондонці кажуть *the Tube* — «труба» — через круглі тунелі.

> [!reel] 🛍️ Magazine і магазин — брати-склади
> Обидва слова походять від арабського *makhāzin* — «склади». Українське «магазин» прийшло через французьку, де *magasin* — крамниця. А англійське *magazine* стало «складом статей» — журналом.

> [!reel] 🦓 Zebra crossing
> Пішохідний перехід зі смугами британці називають *zebra crossing* — «зебра». Американці кажуть просто *crosswalk*.

## Джерела та що почитати

- [Cambridge Dictionary — Imperative clauses](https://dictionary.cambridge.org/grammar/british-grammar/imperative-clauses) — наказовий спосіб: *Go, Turn, Don't…*
- [Cambridge Dictionary — Prepositions](https://dictionary.cambridge.org/grammar/british-grammar/prepositions) — *by bus, on foot, opposite, next to*.
- [Cambridge Dictionary — Opposite or in front of?](https://dictionary.cambridge.org/grammar/british-grammar/opposite) — як описати, де що.
- [Oxford Learner's Dictionaries](https://www.oxfordlearnersdictionaries.com/) — UK / US варіанти *underground / subway, car park / parking lot*.
- [BBC Learning English](https://www.bbc.co.uk/learningenglish) — діалоги «як пройти».

> [!important] Підсумок
> - Місця: *bank, post office, shop, supermarket, station, bus stop, museum, library, hospital, cinema*.
> - Транспорт: *by bus / train / tram / taxi / underground*, але *on foot*; *take the bus, get off at…*
> - Спитати дорогу: *Excuse me, where is…? / How do I get to…? / Is there a … near here?*
> - Пояснити: наказовий спосіб — *Go straight on. Turn left. Go past the bank. Don't cross here.*
> - *It's on the left / on the right / opposite… / next to…* — і не забудь *Thank you!*
