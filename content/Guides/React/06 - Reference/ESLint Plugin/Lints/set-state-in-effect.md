# set-state-in-effect

## Огляд

Це правило перевіряє синхронний виклик `setState` в ефекті, що може призвести до повторних рендерів, які погіршують продуктивність.

## Деталі правила

Встановлення state безпосередньо всередині ефекту змушує React перезапустити весь цикл рендерингу. Коли ви оновлюєте state в ефекті, React повинен перерендерити ваш компонент, застосувати зміни до DOM, а потім знову запустити ефекти. Це створює додатковий прохід рендерингу, якого можна було б уникнути, трансформуючи дані безпосередньо під час рендерингу або виводячи state з props.

**Ключові моменти:**
- Трансформуйте дані на верхньому рівні вашого компонента замість цього
- Код природно перезапуститься при зміні props або state без ініціювання додаткових циклів рендерингу
- Синхронні виклики `setState` в ефектах запускають негайні повторні рендери до того, як браузер зможе відмалювати, спричиняючи проблеми з продуктивністю та візуальні смикання
- React повинен рендерити двічі: раз для застосування оновлення state, потім знову після виконання ефектів
- Цей подвійний рендеринг є марнотратним, коли той самий результат можна досягти одним рендером

Для додаткової інформації дивіться "Вам можливо не потрібен Effect".

## Поширені порушення

### Невалідні приклади

```js
// Синхронний setState в ефекті
function Component({data}) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(data); // Додатковий рендер, використовуйте початковий стан замість цього
  }, [data]);
}

// Встановлення стану завантаження синхронно
function Component() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true); // Синхронно, спричиняє додатковий рендер
    fetchData().then(() => setLoading(false));
  }, []);
}

// Трансформація даних в ефекті
function Component({rawData}) {
  const [processed, setProcessed] = useState([]);

  useEffect(() => {
    setProcessed(rawData.map(transform)); // Має виводитися під час рендерингу
  }, [rawData]);
}

// Виведення state з props
function Component({selectedId, items}) {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setSelected(items.find(i => i.id === selectedId));
  }, [selectedId, items]);
}
```

### Валідні приклади

```js
// setState в ефекті допустимий, якщо значення приходить з ref
function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);
}

// Обчислення під час рендерингу
function Component({selectedId, items}) {
  const selected = items.find(i => i.id === selectedId);
  return <div>{selected?.name}</div>;
}
```

## Найкраща практика

**Коли щось можна обчислити з існуючих props або state, не поміщайте це в state.** Замість цього обчислюйте це під час рендерингу. Це робить ваш код швидшим, простішим та менш схильним до помилок.
