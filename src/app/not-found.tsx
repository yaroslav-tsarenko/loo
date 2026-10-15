import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="page">
      <h1 className="page-title">Сторінку не знайдено</h1>
      <p className="page-lead">
        Можливо, файл у vault перейменували або перенесли. Шукайте через{' '}
        <kbd>⌘K</kbd> або поверніться до{' '}
        <Link className="ui-link" href="/">
          бібліотеки
        </Link>
        .
      </p>
    </div>
  )
}
