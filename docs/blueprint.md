# **App Name**: Bikir-Climat Webstore

## Core Features:

- Dual Currency Management: Allows manual price management for PMR (Rubles) and Moldova (Lei), switchable via a header toggle. When switching currencies, update contact phone numbers to appropriate PMR/MD numbers. Read region from Zustand store.
- Hybrid Cart: Offers users the option to add items to a cart or use a 'Buy in 1 click' feature.
- Aesthetic Installation Services: Highlights 'Aesthetic Installation' (with cable boxes) as a service option linked to product purchases.
- Product Display: Displays products fetched from Firestore with region-specific pricing based on the selected currency (PMR/MD).
- Interactive Quiz Section: Leads users to product recommendations and informs product attributes by having users fill out an interactive quiz asking them for information such as, 'What type of room will you be conditioning' and 'What is the room square footage'. The user will then get presented with the perfect AC solution.
- Order Placement and Management: Enables customers to place orders, stores order details (customer info, items, total price, currency, status) in Firestore, and manages order statuses.

## Style Guidelines:

- Primary color: Dark navy blue (#0F172A) to convey a modern and sophisticated feel, aligning with high-quality products.
- Background color: A desaturated dark blue (#1E293B) provides a subtle contrast to the primary color in a dark scheme. Desaturation maintains a sophisticated look.
- Accent color: A vibrant light blue (#38BDF8), approximately 30 degrees to the 'right' of dark navy blue on the color wheel, is used for interactive elements and highlights, ensuring good contrast and drawing attention to key actions.
- Body and headline font: 'PT Sans' (humanist sans-serif), which is versatile and combines a modern look with a little warmth; suitable for both headlines and body text, providing readability and a contemporary feel.
- Use consistent and minimalist icons from 'lucide-react' for navigation, product categories, and interactive elements, ensuring clarity and ease of use.
- Implement a clean and spacious layout with a glassmorphism effect on key elements like the header and product cards, providing a modern, airy feel. Ensure ample white space for a balanced design.
- Incorporate subtle micro-animations using Framer Motion for transitions, button hovers, and the interactive quiz, enhancing user engagement and providing a smooth, polished experience.