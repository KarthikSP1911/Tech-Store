frontend/
│── public/                 # Static files
│── src/
│   ├── api/                # Axios API services
│   ├── assets/             # Images, icons, fonts
│   ├── components/         # Reusable components (Button, Navbar, Footer)
│   ├── features/           # Redux slices (auth, user, products)
│   ├── hooks/              # Custom hooks (useAuth, useFetch)
│   ├── layouts/            # Shared layouts (MainLayout, AdminLayout)
│   ├── pages/              # Page components
│   │   ├── Home/
│   │   │   ├── Home.jsx
│   │   │   └── Home.module.css
│   │   ├── About/
│   │   │   └── About.jsx
│   │   ├── Products/
│   │   │   ├── Products.jsx
│   │   │   └── ProductDetail.jsx
│   │   └── Auth/
│   │       ├── Login.jsx
│   │       └── Register.jsx
│   ├── routes/             # Centralized route definitions
│   │   └── AppRoutes.jsx
│   ├── store/              # Redux store config
│   ├── styles/             # Global styles, theme
│   ├── utils/              # Helper functions/constants
│   ├── App.jsx
│   └── main.jsx
│── .env
│── package.json
│── vite.config.js
