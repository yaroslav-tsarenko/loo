# Levelup design language — «Loo Pixel-soft»

One look for every screen: the app, lessons, the marketplace and the long-read articles. Violet Loo is the centre of the
brand; the UI around him is calm, readable and a little bit pixel. Duolingo-like structure (path → lesson → feedback →
reward), but our own skin: lavender paper by day, «night arcade» by night, stepped-corner pixel buttons.

## Principles

1. **Readable first.** All text — titles included — is Onest. Body 16–17px, line-height ≥ 1.55. No pixel font in
   sentences, headings, tabs, labels or articles.
2. **Pixel is an accent, not a theme.** Where pixel shows up:
   - buttons (`.lu-btn`, `.lu-ibtn`) — stepped corners + flat 3D lip;
   - optional framed blocks (`.lu-px`) for 1–2 hero elements per screen at most;
   - segmented progress bars (`.lu-progress` without inner text);
   - Loo and pixel icons;
   - Pixelify Sans (`--lu-font-logo`) **only** in the wordmark. At UI sizes it misreads (5→S, в→e), so counters and
     reward numbers are heavy Onest (800, tabular nums). `--lu-font-pixel` is kept as an alias of Onest for them.
   - faint pixel-dot grid on the canvas (`body`).
3. **Violet leads, mint helps.** Primary action = violet (`--lu-violet`). Secondary = mint (`--lu-mint`, dark ink
   `--lu-on-mint`). Green only means *correct / done*, red only *wrong / hearts*, yellow = XP, orange = streak,
   blue = gems/info, orange = bucks. Don't use green as a generic «go» colour any more.
4. **Soft blocks.** Cards: 2px border, `--lu-r-lg` (14px) radius, flat lip shadow (`0 4px 0 border`). No blurred drop
   shadows except overlays. No gradients on surfaces (one allowed: the `super` button).
5. **Playful, not childish.** Loo talks in short lines; emojis are fine in content; motion is short and springy
   (`--lu-ease-bounce`), always disabled under `prefers-reduced-motion`.

## Tokens (src/app/tokens.css)

| Role | Light | Dark |
| --- | --- | --- |
| canvas `--lu-bg` | `#f6f3ff` lavender | `#16112b` night |
| surface `--lu-surface` / `-2` / `-3` | `#fff` / `#f8f5ff` / `#ece6fb` | `#1e1838` / `#261f45` / `#302855` |
| border / strong | `#e3dbf7` / `#cbbfeb` | `#342b5c` / `#4a3f7a` |
| text / 2 / 3 | `#2a2145` / `#655a85` / `#a398c2` | `#eeeaff` / `#b0a6d6` / `#7b71a3` |
| primary `--lu-violet` (+ `-lip -hover -soft -ink`) | `#7c4dff` | `#8c69ff` |
| accent `--lu-mint` | `#2dd4bf` | `#4fe3cc` |

Each colour has `-lip` (3D edge), `-hover`, `-soft` (tinted surface), `-ink` (text on light surfaces). Tones:
`data-tone="violet|mint|green|blue|red|yellow|orange|purple|pink|gray"` sets `--tone*` for any kit component.

Legacy variables in `globals.css` (`--bg --t1 --t2 --accent --blue-bg …`) are aliases of these tokens — new CSS should
use `--lu-*` directly.

Fonts: `--lu-font` (Onest), `--lu-font-mono` (JetBrains Mono), `--lu-font-logo` (Pixelify Sans, wordmark only).
Radii: `--lu-r-xs 4 · --lu-r-sm 8 · --lu-r 10 · --lu-r-lg 14 · --lu-r-xl 20`. Prefer these over pills; pills only for
tiny tags.

## Pixel frame

`.lu-btn`, `.lu-ibtn` (non-plain) and `.lu-px` draw themselves with `::before` (border + lip) and `::after` (face),
both clipped to a two-step corner. Consequences:

- **Don't set `background`, `border` or `box-shadow` on these elements** — set the knobs instead:
  `--b / --b-hover / --b-lip / --b-ink / --b-face` on buttons; `--px-face / --px-line / --px-bw / --px-lip / --px-s`
  on `.lu-px`.
- Don't use `::before/::after` on them for anything else.
- Children aren't clipped, so overhanging badges work.

## Icons — no Apple emoji

UI never shows emoji glyphs. Pick, in this order:
1. **Our pixel icons** — `<PixelIcon name="…" />` or the ref `px:name` in `<Icon>` / course YAML. Grids live in
   `src/ui/design/pixel-icons/*.ts` (16×16, `k` outline, palette in `palette.ts`); preview at `/design`.
2. **Game marks**: the warrior rank → `px:insignia`; difficulty levels / course ranks (IT career) → `levelIcon(level)` /
   `IT_RANK_ICON` refs; currencies → `<CurrencyIcon currency="bucks|gems" />` / `<Price />` (pixel coin `px:buck`,
   crystal `gem`). Loo himself only grows with the rank (`<Loo stage="egg|small|normal" />`); power on him is gear
   (`skin.head|body|weapon|amulet|aura`).
3. **Real brand marks** for technologies — Simple Icons, `si:SiReact`.
4. **An icon library** (Phosphor `pi:`, Tabler `tb:`, Lucide `lucide:`) for small utility glyphs.
5. Languages → flags (`px:flagUk`, `px:flagDe`, `px:flagUa`).

Emoji inside long-read *content* (vault markdown) is the author's text and stays.

## Scroll panes and trees

- Long panes (the sidebar) hide the native scrollbar and draw an **island**: `<IslandScroll>` (`src/ui/shell/IslandScroll.tsx`)
  — a 5px violet pill sized by viewport/content, shown on hover and while scrolling, fading when idle, draggable (mouse,
  pen, finger). Scrolling itself stays native (wheel, keys, touch momentum). Reuse it for any other scroll pane.
- Explorer trees (sidebar «Теорія», `TheoryTree`) — guide icon → pixel `folder`/`folderOpen` → chapter status square
  (hollow = unread, half = reading, green = studied), indent guides, `done/total` per folder, current page highlighted.

## Code

Code blocks are always a dark «arcade screen» (`--code-bg`), in both themes, with the «Loo night» syntax palette
(`--code-token-*`, shiki css-variables theme). Inline code = violet ink on violet-soft.

## Articles (reader)

Long-reads are not Notion pages any more: centred column (~720px), Onest 17px/1.7, bold violet-tinted headings with a
small pixel square marker, callouts as soft tinted blocks with a coloured left bar and an icon, tables with
violet-soft headers, images/figures framed like cards, code as arcade screens.
