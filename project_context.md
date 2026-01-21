# Project Context: Bikir-Climat
## О проекте
Современный интернет-магазин и лендинг услуг по кондиционированию в Приднестровье и Молдове.
Стек: Next.js 14 (App Router), Tailwind CSS, Framer Motion, Firebase (Firestore).

## Ключевые особенности
1. **Двухвалютность:** Ручное управление ценами. Есть цена для ПМР (рубли) и для Молдовы (леи). Переключатель в шапке меняет валюту и контактный телефон.
2. **Гибридная корзина:** Возможность добавить товар в корзину ИЛИ "Купить в 1 клик".
3. **Услуги:** Акцент на "Эстетичный монтаж" (с коробами) как опцию к товару.
4. **Дизайн:** Glassmorphism, минимализм, микро-анимации, "воздух".

## Структура БД (Firebase)
- **products:**
  - id, title, description
  - price_pmr (number), price_md (number)
  - images (array string)
  - specs (object: площадь, тип, инвертор)
  - category (cond, service)
- **orders:**
  - id, customer_name, phone, address
  - items (array), total_price, currency (PMR/MD)
  - status (new, done)
