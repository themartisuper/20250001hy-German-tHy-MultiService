project/
├── backend/
│   ├── server.js                 # входная точка сервера (Express)
│   ├── routes/                   # маршруты API
│   │   ├── bookings.js
│   │   └── admin.js
│   ├── controllers/              # бизнес-логика (функции для маршрутов)
│   │   ├── bookingController.js
│   │   └── adminController.js
│   ├── models/                   # работа с БД (Mongoose, Sequelize и т.д.)
│   │   └── Booking.js
│   ├── middleware/               # middleware, авторизация и т.д.
│   ├── utils/                    # вспомогательные функции, логгеры
│   └── config/
│       └── db.js                 # подключение к базе данных
│
├── frontend/
│   ├── public/                   # статика (отдается сервером)
│   │   ├── index.html
│   │   ├── booking.html
│   │   ├── admin.html
│   │   └── assets/
│   │       ├── css/
│   │       │   ├── main.css
│   │       │   └── admin.css
│   │       ├── js/
│   │       │   ├── main.js
│   │       │   ├── booking.js
│   │       │   └── admin.js
│   │       └── images/
│   └── package.json              # если фронт собирается отдельно (Vite, React и т.п.)
│
├── .env                          # переменные окружения (пароли, ключи)
├── package.json                  # общий npm для monorepo
├── .gitignore
└── README.md



https://www.svgrepo.com/svg/451116/moon

https://www.svgrepo.com/svg/106118/sun-bright