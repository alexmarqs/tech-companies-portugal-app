/** A company's `categories` is one name or a list; always read it as a list. */
export const getCategoryList = (categories: string[] | string): string[] =>
  Array.isArray(categories) ? categories : [categories];

// Category names arrive from the source README with a trailing emoji
// ("Automotive 🚘"). Strip the pictographs wherever the name has to read as
// prose — titles, headings, meta descriptions, API names — while leaving real
// punctuation intact, so "E-commerce 🛍️" stays "E-commerce", not "Ecommerce".
export const normalizeText = (text: string) =>
  text
    .replace(/\p{Extended_Pictographic}|️|‍/gu, "")
    .replace(/\s+/g, " ")
    .trim();
