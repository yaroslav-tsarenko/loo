---
title: Мета й спосіб — um … zu, damit, ohne … zu, statt … zu
id: de-b1-um-zu
level: B1
icon: px:letterTile
tags: [deutsch, b1, grammar, um-zu, damit, infinitiv]
prerequisites: ["[[Deutsch - B1 - 10. Інфінітив із zu]]"]
estimatedMinutes: 40
---

# Мета й спосіб — um … zu, damit, ohne … zu, statt … zu

> [!success] Після цієї теми ти зможеш
> - пояснити мету: *Ich lerne Deutsch, um in Deutschland zu arbeiten.* / *… damit meine Kinder es leichter haben.*;
> - вибрати між *um … zu* (той самий підмет) і *damit* (різні підмети);
> - сказати «без того, щоб …»: *ohne … zu*, *ohne dass*;
> - сказати «замість того, щоб …»: *statt … zu*, *statt dass*;
> - уникнути помилки «für zu» і перекладати «щоб» залежно від змісту.

## Передбач

> [!quiz] Яке слово пропущено? «Ich lerne Deutsch, ___ in Deutschland zu arbeiten.»
> level: B1 · type: single · id: de-b1-um-zu-q01
> - [x] um
> - [ ] für
> - [ ] damit
> - [ ] dass
>
> **Пояснення:** мета при **тому самому підметі** («я вчу» і «я працюватиму») — *um … zu*. *Für* ставлять перед іменником (*für die Arbeit*), а не перед *zu* + інфінітив. *Damit* вимагає окремого речення з підметом і особовою формою дієслова: *damit ich arbeiten kann*.

## Українське «щоб» німецькою

Українською «щоб» — одне коротке слово, а німецька розрізняє три випадки:

| Що означає «щоб» | Німецькою | Приклад |
|---|---|---|
| мета, підмет той самий | **um … zu** + інфінітив | Ich spare Geld, **um** ein Auto **zu** kaufen. |
| мета, підмети різні | **damit** + речення | Ich spare Geld, **damit** meine Kinder studieren können. |
| бажання, вимога («хочу, щоб ти …») | **dass** + речення | Ich will, **dass** du kommst. |

Коли перекладаєш «щоб», спершу спитай: **це мета дії чи бажання?** Якщо мета — тоді *um … zu* або *damit*.

## um … zu: мета при одному підметі

*Um … zu* відповідає на запитання «навіщо?». Схема: головне речення, кома, *um* + група + *zu* + інфінітив. Підмет в інфінітивній групі не повторюємо.

> [!diagram] Як із двох речень вийшло одне
> ```yaml
> layout: flow
> nodes:
>   - { id: a, label: "речення 1", text: "Ich lerne Deutsch.", tone: gray }
>   - { id: b, label: "речення 2 (мета)", text: "Ich will in Deutschland arbeiten.", tone: gray }
>   - { id: u, label: "звʼязка", text: "um", tone: orange }
>   - { id: g, label: "група", text: "in Deutschland", tone: gray }
>   - { id: z, label: "zu + інфінітив", text: "zu arbeiten.", tone: orange }
> steps:
>   - { focus: [a, b], note: "Спершу — два речення з однаковим підметом (ich). Друге пояснює, навіщо перше." }
>   - { focus: [u], note: "Прибираємо підмет і модальне дієслово, ставимо um." }
>   - { focus: [g, z], note: "Уточнення залишаємо, інфінітив — наприкінці з zu: um in Deutschland zu arbeiten." }
> ```

Група з *um … zu* може стояти й **на початку** речення. Тоді після коми йде дієслово (воно на другому місці): *Um Deutsch zu lernen, besuche ich einen Kurs.*

*Zu + прикметник + um … zu* — «занадто …, щоб …»: *Ich bin zu müde, um noch zu lernen.* — «Я занадто втомлений, щоб ще вчитися». Те саме з *genug*: *Er ist alt genug, um allein zu reisen.*

## damit: мета при різних підметах

Якщо підмети **різні**, *um … zu* зазвичай не можна, потрібне підрядне речення з *damit*: дієслово наприкінці.

*Ich erkläre es dir noch einmal, **damit** du es **verstehst**.* — «Пояснюю тобі ще раз, щоб ти зрозумів».

*Damit* можна вжити й при однаковому підметі (*Ich lerne Deutsch, damit ich in Deutschland arbeiten kann*), але *um … zu* коротше й природніше. Якщо підмет загальний (*man*), *um … zu* теж можливе: *Das Messer ist da, um Brot zu schneiden.*

> [!diagram] um … zu чи damit
> ```yaml
> layout: compare
> columns: { a: "um … zu", b: "damit" }
> nodes:
>   - { id: a1, col: a, label: "підмет", text: "той самий", note: "Ich lerne, um Arzt zu werden.", tone: yellow }
>   - { id: a2, col: a, label: "форма", text: "um + група + zu + інфінітив", note: "Інфінітив без підмета.", tone: yellow }
>   - { id: a3, col: a, label: "дієслово", text: "в інфінітиві", note: "Дієслово не змінюється.", tone: yellow }
>   - { id: b1, col: b, label: "підмет", text: "різні (або той самий)", note: "Ich helfe dir, damit du Zeit hast.", tone: pink }
>   - { id: b2, col: b, label: "форма", text: "damit + підмет + дієслово в кінці", note: "Окреме підрядне речення.", tone: pink }
>   - { id: b3, col: b, label: "дієслово", text: "відмінюється, наприкінці", note: "damit du es verstehst.", tone: pink }
> steps:
>   - { focus: [a1, a2, a3], note: "um … zu: один підмет, інфінітив із zu наприкінці, кома перед um." }
>   - { focus: [b1, b2, b3], note: "damit: речення з власним підметом і відмінюваним дієсловом наприкінці." }
> ```

## ohne … zu і ohne dass

*Ohne* відповідає «без того, щоб; не роблячи». При одному підметі — *ohne … zu*; при різних — *ohne dass*.

- *Er ging, **ohne** ein Wort **zu** sagen.* — Він пішов, не сказавши ні слова.
- *Sie ging, **ohne dass** er es bemerkte.* — Вона пішла так, що він не помітив.

Після *ohne zu* — зворотний займенник ставимо *перед* *zu*: *Er geht, **ohne sich zu** verabschieden.* А коли дія вже була в минулому: *ohne etwas gesagt **zu haben*** (Infinitiv Perfekt).

## statt … zu і statt dass

*Statt* (також *anstatt*) — «замість того, щоб». При одному підметі — *statt … zu*; при різних — *statt dass*.

- ***Statt** zu arbeiten, schläft er.* — Замість того щоб працювати, він спить.
- ***Statt dass** er hilft, muss ich alles allein machen.* — Замість того щоб він допоміг, я мушу все робити сам.

Коли група *statt … zu* стоїть **першою**, після коми дієслово — на першому місці своєї частини: *Statt zu arbeiten, **schläft** er.*

## Кома

Перед *um, ohne, statt, anstatt* + *zu*-інфінітивом кома **обовʼязкова**. Перед *damit, ohne dass, statt dass* — теж, бо це підрядні речення.

## Приклади

- Ich lerne Deutsch, um in Deutschland zu arbeiten. — Я вчу німецьку, щоб працювати в Німеччині.
- Ich erkläre es dir noch einmal, damit du es verstehst. — Пояснюю тобі ще раз, щоб ти зрозумів.
- Sie nimmt einen Schirm mit, um nicht nass zu werden. — Вона бере парасольку, щоб не змокнути.
- Er ging, ohne ein Wort zu sagen. — Він пішов, не сказавши ні слова.
- Sie ging, ohne dass er es bemerkte. — Вона пішла непомітно для нього.
- Statt zu arbeiten, schläft er. — Замість того щоб працювати, він спить.
- Ich bin zu müde, um noch zu lernen. — Я занадто втомлений, щоб ще вчитися.
- Ich stehe früh auf, um den Zug zu erreichen. — Я встаю рано, щоб встигнути на потяг.
- Ich höre abends Podcasts, statt fernzusehen. — Увечері я слухаю подкасти замість того, щоб дивитися телевізор.
- Sie leiht ihm Geld, damit er das Auto kaufen kann. — Вона позичає йому гроші, щоб він міг купити авто.

## Слова

> [!word] der Zweck
> ipa: /tsvɛk/ · pos: noun · level: B1 · id: de-b1-um-zu-w01
> uk: мета, призначення
> forms: die Zwecke
> example: Welchen **Zweck** hat diese Regel? — Яке призначення має це правило?
> note: zu diesem Zweck — із цією метою; zwecklos — безглуздий. zw = [tsv].

> [!word] die Absicht
> ipa: /ˈapzɪçt/ · pos: noun · level: B1 · id: de-b1-um-zu-w02
> uk: намір
> forms: die Absichten
> example: Ich habe die **Absicht**, nächstes Jahr umzuziehen. — У мене є намір наступного року переїхати.
> note: b перед s = [p]: «апзіхт». mit Absicht — навмисно.

> [!word] verhindern
> ipa: /fɛɐ̯ˈhɪndɐn/ · pos: verb · level: B2 · id: de-b1-um-zu-w03
> uk: перешкоджати; запобігати
> forms: er verhindert · verhinderte · hat verhindert
> example: Der Zaun **verhindert**, dass Kinder auf die Straße laufen. — Паркан не дає дітям вибігти на дорогу.
> note: невідокремлюване ver-; Partizip II без ge-.

> [!word] damit
> ipa: /daˈmɪt/ · pos: conj · level: B1 · id: de-b1-um-zu-w04
> uk: щоб (мета, різні підмети)
> example: Ich rufe an, **damit** du nicht wartest. — Я телефоную, щоб ти не чекав.
> note: сполучник — наголос на -mit: [daˈmɪt]; прислівник damit («з цим») може мати наголос на da-: [ˈdaːmɪt] (Was machst du damit?)

> [!word] ohne dass
> ipa: /ˈoːnə das/ · pos: phrase · level: B1 · id: de-b1-um-zu-w05
> uk: без того, щоб (різні підмети)
> example: Er ist gegangen, **ohne dass** wir es gemerkt haben. — Він пішов так, що ми не помітили.
> note: після dass — речення з дієсловом наприкінці. Для того самого підмета — ohne … zu.

> [!word] schaffen
> ipa: /ˈʃafn̩/ · pos: verb · level: A2 · id: de-b1-um-zu-w06
> uk: встигнути, впоратися
> forms: er schafft · schaffte · hat geschafft
> example: Ich habe es **geschafft**, pünktlich zu sein. — Я встиг(ла) бути вчасно.
> note: інше дієслово: schaffen — створювати (schuf, hat geschaffen). Розм.: Ich bin geschafft = «я виснажений».

> [!word] sich anstrengen
> ipa: /ˈanʃtʁɛŋən zɪç/ · pos: verb · level: B1 · id: de-b1-um-zu-w07
> uk: докладати зусиль; напружуватися
> forms: er strengt sich an · strengte sich an · hat sich angestrengt
> example: Ich **strenge** mich an, um die Prüfung zu bestehen. — Я докладаю зусиль, щоб скласти іспит.
> note: відокремлюване; anstrengend — виснажливий.

> [!word] die Mühe
> ipa: /ˈmyːə/ · pos: noun · level: B1 · id: de-b1-um-zu-w08
> uk: зусилля, труд
> forms: die Mühen
> example: Sie gibt sich viel **Mühe**, um Deutsch zu lernen. — Вона дуже старається вивчити німецьку.
> note: sich Mühe geben — старатися; Das ist die Mühe wert — воно того варте.

> [!word] vermeiden
> ipa: /fɛɐ̯ˈmaɪ̯dn̩/ · pos: verb · level: B2 · id: de-b1-um-zu-w09
> uk: уникати
> forms: er vermeidet · vermied · hat vermieden
> example: Ich benutze das Auto nicht, um Stau zu **vermeiden**. — Я не користуюся авто, щоб уникнути заторів.
> note: Partizip II без ge-: vermieden.

> [!word] bemerken
> ipa: /bəˈmɛʁkn̩/ · pos: verb · level: B1 · id: de-b1-um-zu-w10
> uk: помітити
> forms: er bemerkt · bemerkte · hat bemerkt
> example: Sie ging, ohne dass er es **bemerkte**. — Вона пішла непомітно для нього.
> note: також «зауважити» (eine Bemerkung machen).

## Слухаємо

> [!listen] Що ти почув?
> level: B1 · type: choice · id: de-b1-um-zu-l01
> audio: Ich lerne Deutsch, um in Deutschland zu arbeiten.
> - [x] Ich lerne Deutsch, um in Deutschland zu arbeiten.
> - [ ] Ich lerne Deutsch, damit ich in Deutschland arbeite.
> - [ ] Ich lerne Deutsch, ohne in Deutschland zu arbeiten.

> [!listen] Напиши або скажи, що почув
> level: B1 · type: dictation · id: de-b1-um-zu-l02
> audio: Er ging, ohne ein Wort zu sagen.

> [!listen] Напиши або скажи, що почув
> level: B1 · type: dictation · id: de-b1-um-zu-l03
> audio: Ich erkläre es dir, damit du es verstehst.

> [!listen] Послухай і дай відповідь. Навіщо вона встає рано?
> level: B1 · type: answer · id: de-b1-um-zu-l04
> audio: A: Warum stehst du so früh auf?
> audio: B: Um den ersten Zug zu erreichen.
> - [x] щоб встигнути на перший потяг
> - [ ] щоб піти на роботу пішки
> - [ ] щоб приготувати сніданок
>
> **Пояснення:** *um den ersten Zug zu erreichen* — «щоб встигнути на перший потяг».

## Вимова

Сполучник *damit* має наголос на **-mit**: [daˈmɪt]. Прислівник *damit* («з цим») — на першому складі: [ˈdaːmɪt]: *Was machst du **da**mit?* У групі *um … zu* слово **zu** слабке, [tsu], а наголос припадає на корінь інфінітива: *um … zu **ar**beiten*. Перед *um* — коротка пауза.

> [!speak] Скажи вголос
> level: B1 · id: de-b1-um-zu-s01
> text: Ich lerne Deutsch, um in Deutschland zu arbeiten.
> ipa: /ɪç ˈlɛʁnə dɔʏ̯tʃ ʊm ɪn ˈdɔʏ̯tʃlant tsuː ˈaʁbaɪ̯tn̩/
> tip: Deutsch — «дойч» з дифтонгом [ɔʏ̯] і кінцем [tʃ]. Пауза після Deutsch перед um.
> uk: Я вчу німецьку, щоб працювати в Німеччині.

> [!speak] Скажи вголос
> level: B1 · id: de-b1-um-zu-s02
> text: Ich erkläre es dir, damit du es verstehst.
> ipa: /ɪç ɛɐ̯ˈklɛːʁə ɛs diːɐ̯ daˈmɪt duː ɛs fɛɐ̯ˈʃteːst/
> tip: damit — наголос на -mit. verstehst: ver- слабке, наголос на -steh-.
> uk: Пояснюю тобі, щоб ти зрозумів.

> [!speak] Скажи вголос
> level: B1 · id: de-b1-um-zu-s03
> text: Er ging, ohne ein Wort zu sagen.
> ipa: /eːɐ̯ ɡɪŋ ˈoːnə aɪ̯n vɔʁt tsuː ˈzaːɡn̩/
> tip: ohne — довге [oː]. ei = [aɪ̯], w = [v], s перед голосним = [z].
> uk: Він пішов, не сказавши ні слова.

> [!speak] Скажи вголос
> level: B1 · id: de-b1-um-zu-s04
> text: Statt zu arbeiten, schläft er.
> ipa: /ʃtat tsuː ˈaʁbaɪ̯tn̩ ʃlɛːft eːɐ̯/
> tip: st- на початку = «шт»; schläft — довге [ɛː], потім «фт».
> uk: Замість того щоб працювати, він спить.

## Типові помилки українців

> [!pitfall] «Für arbeiten» і «für zu arbeiten»
> *Für* ставимо перед **іменником**: *Ich lerne Deutsch **für die Arbeit**.* А перед дією — *um … zu*: *Ich lerne Deutsch, **um zu arbeiten**.* Не ~~für arbeiten~~ і не ~~für zu arbeiten~~.

> [!pitfall] «Um du es verstehst» — підмет після um
> *Um … zu* — тільки з **інфінітивом** і без підмета: *um es zu verstehen*. Хочеш поставити інший підмет — потрібен *damit*: *damit **du** es verstehst*. Не ~~um du es verstehst~~, не ~~um du zu verstehen~~.

> [!pitfall] «Щоб» не завжди damit
> Для бажання й вимоги вживаємо *dass*: *Ich will, **dass** du kommst; Ich möchte, **dass** er hilft.* Не ~~Ich will, damit du kommst~~. *Damit* — тільки мета: «щоб ти міг, щоб було».

> [!pitfall] Зворотні дієслова й zu
> Займенник стоїть **перед** *zu*: *ohne **sich** zu verabschieden*, *um **sich** zu erholen*. Не ~~ohne zu sich verabschieden~~. У відокремлюваних *zu* — усередині: *ohne anzurufen*, не ~~ohne zu anrufen~~.

## Ситуація: чому ти вчиш німецьку

> [!listen] Послухай діалог. Що робить співрозмовник B увечері?
> level: B1 · type: answer · id: de-b1-um-zu-l05
> audio: A: Warum lernst du so viel Deutsch?
> audio: B: Ich lerne jeden Tag, um bald eine Arbeit zu finden.
> audio: A: Und was machst du, damit du schneller lernst?
> audio: B: Ich höre abends Podcasts, statt fernzusehen.
> - [x] слухає подкасти, а не дивиться телевізор
> - [ ] дивиться телевізор, а не слухає подкасти
> - [ ] читає газету
>
> **Пояснення:** *statt fernzusehen* — «замість того, щоб дивитися телевізор».

> [!speak] «Я слухаю подкасти замість того, щоб дивитися телевізор.»
> level: B1 · id: de-b1-um-zu-s05
> text: Ich höre abends Podcasts, statt fernzusehen.
> ipa: /ɪç ˈhøːʁə ˈaːbn̩ts ˈpɔtkasts ʃtat ˈfɛʁntsuzeːən/
> tip: abends — [ˈaːbn̩ts]; ö довге. fernzusehen — zu всередині слова.
> uk: Увечері я слухаю подкасти замість того, щоб дивитися телевізор.

## Практика

> [!quiz] Яке слово пропущено? «Ich erkläre es dir, ___ du es verstehst.»
> level: B1 · type: single · id: de-b1-um-zu-q02
> - [x] damit
> - [ ] um
> - [ ] für
> - [ ] ohne
>
> **Пояснення:** підмет другої частини інший (*du*), тому потрібне *damit*. *Um* ставить інфінітив без підмета.

> [!quiz] Яка форма правильна? «Sie arbeitet, ohne eine Pause ___.»
> level: B1 · type: single · id: de-b1-um-zu-q03
> - [x] zu machen
> - [ ] machen
> - [ ] zu machen zu
> - [ ] gemacht
>
> **Пояснення:** *ohne … zu* + інфінітив: *ohne eine Pause zu machen*.

> [!quiz] Як сказати: «Замість того щоб працювати, він спить»?
> level: B1 · type: single · id: de-b1-um-zu-q04
> - [x] Statt zu arbeiten, schläft er.
> - [ ] Statt arbeiten, schläft er.
> - [ ] Statt er zu arbeiten, schläft er.
> - [ ] Statt zu arbeiten, er schläft.
>
> **Пояснення:** *statt* + *zu* + інфінітив; після коми — дієслово на першому місці своєї частини (*schläft er*).

> [!quiz] Яке речення правильне?
> level: B1 · type: single · id: de-b1-um-zu-q05
> - [x] Er geht, ohne dass es jemand merkt.
> - [ ] Er geht, ohne es jemand zu merken.
> - [ ] Er geht, ohne zu jemand merken.
> - [ ] Er geht, ohne dass merkt jemand es.
>
> **Пояснення:** підмети різні (*er* ↔ *jemand*), тому *ohne dass* + дієслово наприкінці.

> [!quiz] Яке слово пропущено? «Ich bin zu müde, ___ noch zu lernen.»
> level: B1 · type: single · id: de-b1-um-zu-q06
> - [x] um
> - [ ] damit
> - [ ] dass
> - [ ] für
>
> **Пояснення:** структура *zu + прикметник, um … zu*: «занадто втомлений, щоб …».

> [!quiz] Обери всі правильні речення
> level: B1 · type: multi · id: de-b1-um-zu-q07
> - [x] Ich spare Geld, um ein Auto zu kaufen.
> - [x] Ich spare Geld, damit meine Kinder studieren können.
> - [ ] Ich spare Geld, damit ein Auto zu kaufen.
> - [ ] Ich spare Geld, um meine Kinder studieren können.
> - [ ] Ich spare Geld, für ein Auto zu kaufen.
>
> **Пояснення:** *um … zu* — інфінітив і той самий підмет; *damit* — окреме речення з відмінюваним дієсловом. *Für* перед інфінітивом не ставимо.

> [!quiz] Обери всі правильні речення
> level: B1 · type: multi · id: de-b1-um-zu-q08
> - [x] Er ging, ohne ein Wort zu sagen.
> - [x] Sie ging, ohne dass er es bemerkte.
> - [x] Statt zu lernen, sah er fern.
> - [ ] Er ging, ohne ein Wort sagen.
> - [ ] Sie ging, ohne dass er es zu bemerken.
> - [ ] Statt zu lernen er sah fern.
>
> **Пояснення:** після *ohne dass* — підмет і відмінюване дієслово (*bemerkte*). Без *zu* не можна. Після групи *statt zu lernen* дієслово — на першому місці (*sah er fern*).

> [!quiz] Обери всі правильні речення
> level: B1 · type: multi · id: de-b1-um-zu-q09
> - [x] Ich stehe früh auf, um den Zug zu erreichen.
> - [x] Er ging, ohne anzurufen.
> - [x] Sie kommt, um uns abzuholen.
> - [ ] Ich stehe früh auf, um zu aufstehen.
> - [ ] Er ging, ohne zu anrufen.
>
> **Пояснення:** у відокремлюваних дієсловах *zu* — усередині: *anzurufen, abzuholen*. У *erreichen* — окремо: *zu erreichen*.

> [!quiz] Заповни пропуски: um або damit
> level: B1 · type: fill · id: de-b1-um-zu-q10
>
> ```text fill
> Ich lerne Deutsch, [[um]] in Berlin zu arbeiten.
> Ich erkläre es dir noch einmal, [[damit]] du es verstehst.
> Sie nimmt einen Schirm mit, [[um]] nicht nass zu werden.
> ```
>
> **Пояснення:** один підмет (*ich ↔ ich*, *sie ↔ sie*) — *um … zu*; різні — *damit*.

> [!quiz] Заповни пропуски: ohne, statt
> level: B1 · type: fill · id: de-b1-um-zu-q11
>
> ```text fill
> Er arbeitet den ganzen Tag, [[ohne]] eine Pause zu machen. (не роблячи)
> [[Statt|Anstatt]] zu lernen, spielt er Computer. (замість того, щоб)
> Sie ging, [[ohne dass]] ich es merkte. (так, що я не помітив)
> ```
>
> **Пояснення:** *ohne … zu* «не роблячи», *statt … zu* «замість того», *ohne dass* — при різних підметах.

> [!quiz] Заповни форми з zu
> level: B1 · type: fill · id: de-b1-um-zu-q12
>
> ```text fill
> Ich stehe früh auf, um den Zug [[zu erreichen]] (erreichen).
> Sie kommt, um uns [[abzuholen|zu holen]] (забрати).
> Er ging, ohne [[anzurufen]] (не зателефонувавши).
> ```
>
> **Пояснення:** *erreichen* — невідокремлюване (*zu erreichen*), *abholen* і *anrufen* — відокремлювані (*abzuholen, anzurufen*).

> [!quiz] Заповни damit-речення
> level: B1 · type: fill · id: de-b1-um-zu-q13
>
> ```text fill
> Ich helfe dir, damit du früher fertig [[bist|wirst]].
> Sie leiht ihm Geld, damit er das Auto kaufen [[kann]] (може).
> ```
>
> **Пояснення:** після *damit* дієслово відмінюється й стоїть наприкінці: *du … bist*, *er … kaufen kann*.

> [!quiz] Склади речення: «Я вчу німецьку, щоб працювати в Німеччині»
> level: B1 · type: order · id: de-b1-um-zu-q14
>
> ```text order
> Ich
> lerne
> Deutsch,
> um
> in Deutschland
> zu arbeiten.
> damit ✗
> ```
>
> **Пояснення:** головне речення + кома + *um* + група + *zu arbeiten*. *Damit* вимагало б підмет і відмінюване дієслово.

> [!quiz] Склади речення: «Замість того щоб працювати, він спить»
> level: B1 · type: order · id: de-b1-um-zu-q15
>
> ```text order
> Statt
> zu arbeiten,
> schläft
> er.
> arbeiten statt ✗
> ```
>
> **Пояснення:** група *statt zu arbeiten* — на першому місці, після коми — дієслово (*schläft*), потім підмет.

> [!quiz] Склади речення: «Вона пішла так, що він не помітив»
> level: B1 · type: order · id: de-b1-um-zu-q16
>
> ```text order
> Sie
> ging,
> ohne dass
> er
> es
> bemerkte.
> bemerken ✗
> ```
>
> **Пояснення:** *ohne dass* відкриває підрядне речення: підмет *er*, потім *es*, дієслово *bemerkte* — наприкінці.

> [!quiz] Склади речення, що починається словом «Um»
> level: B1 · type: order · id: de-b1-um-zu-q17
>
> ```text order
> Um
> Deutsch
> zu lernen,
> besuche
> ich
> einen Kurs.
> dass ✗
> ```
>
> **Пояснення:** група *Um Deutsch zu lernen* стоїть першою; після коми — дієслово (*besuche*), потім підмет *ich*.

## Фішки

> [!reel] 🇳🇱 Ще одна «um … zu» — по-голландськи
> У нідерландській є точно така ж конструкція: *om … te* («om Duits te leren» — щоб вивчати німецьку). Німецьке *um … zu* — родич голландського *om … te*, тож голландцям це правило знайоме.

> [!reel] 🔁 Одне слово — два наголоси
> Сполучник *damit* («щоб») звучить [daˈmɪt]. Прислівник *damit* («з цим») теж часто [daˈmɪt], але з наголосом на початку — [ˈdaːmɪt] — його вимовляють, коли хочуть виділити слово: *Was machst du **da**mit?* Наголос допомагає швидше зрозуміти, про яке *damit* ідеться.

> [!reel] 🏆 Ohne Fleiß kein Preis
> Німецьке прислівʼя *Ohne Fleiß kein Preis* («Без старанності немає нагороди») — гарний приклад *ohne*. Той самий принцип в *ohne dass*: *Ohne dass man übt, wird man nicht besser.* — «Без практики кращим не станеш».

## Джерела та що почитати

- [DWDS — damit](https://www.dwds.de/wb/damit) — сполучник і прислівник, значення, вимова.
- [DWDS — Zweck](https://www.dwds.de/wb/Zweck) — значення, словосполучення.
- [DWDS — Absicht](https://www.dwds.de/wb/Absicht) — значення й приклади.
- [Rat für deutsche Rechtschreibung — Regelwerk](https://www.rechtschreibrat.com/regeln-und-woerterverzeichnis/) — правила коми при інфінітивних групах.
- H. Dreyer, R. Schmitt — *Lehr- und Übungsbuch der deutschen Grammatik* (Hueber) — розділи «Finalsätze» та «um … zu».

> [!important] Підсумок
> - Мета при одному підметі — **um … zu**, при різних — **damit** + речення. Бажання — **dass**.
> - **Ohne … zu** / **ohne dass**: «без того, щоб»; **statt … zu** / **statt dass**: «замість того, щоб».
> - Не **für** перед інфінітивом, а *um … zu*; не повторюй підмет після *um*.
> - У відокремлюваних *zu* всередині: *um aufzustehen, ohne anzurufen*.
> - Кома перед *um, ohne, statt* і перед *damit, dass* обовʼязкова.
