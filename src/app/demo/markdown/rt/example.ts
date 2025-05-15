export const example = `## 😲 md-editor-rt

Markdown editor, React version, developed with JSX and TypeScript syntax. Supports theme switching, prettier text formatting, and more.

### 🤖 Basic Demo

**Bold**, <u>Underline</u>, _Italic_, ~~Strikethrough~~, Superscript^26^, Subscript~1~, \`inline code\`, [Link](https://github.com/imzbf)

> Quote: "I Have a Dream"

1. So even though we face the difficulties of today and tomorrow, I still have a dream.
2. It is a dream deeply rooted in the American dream.
3. I have a dream that one day this nation will rise up.

- [ ] Friday
- [ ] Saturday
- [x] Sunday

![Image](https://imzbf.github.io/md-editor-rt/imgs/mark_emoji.gif)

## 🤗 Code Demo

\`\`\`js
import { MdEditor } from 'md-editor-rt';
import { defineComponent, ref } from 'vue';
import 'md-editor-rt/lib/style.css';

export default defineComponent({
  name: 'MdEditor',
  setup() {
    const text = ref('');
    return () => (
      <MdEditor
        modelValue={text.value}
        onChange={(v: string) => (text.value = v)}
      />
    );
  },
});
\`\`\`

## 🖨 Text Demo

According to the Planck length unit, the estimated diameter of the observable universe (about 93 billion light-years, or 8.8 × 10^26^ meters) is 5.4 × 10^61^ times the Planck length. The observable universe's volume is 8.4 × 10^184^ cubic Planck lengths (Planck volume).

## 📈 Table Demo

| Header 1 |  Header 2  | Header 3 |
| :------- | :--------: | -------: |
| Left     |  Center    |   Right  |

## 📏 Formula

Inline: $x+y^{2x}$

$$
\\sqrt[3]{x}
$$

## 🧬 Chart

\`\`\`mermaid
flowchart TD
  Start --> Stop
\`\`\`

## 🪄 Tips

!!! note Supported types

note, abstract, info, tip, success, question, warning, failure, danger, bug, example, quote, hint, caution, error, attention

!!!

## ☘️ Placeholder!

That's all
`;
