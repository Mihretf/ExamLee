# Examlee Frontend - src Folder

This folder contains all frontend source code for the Examlee platform.

## Folder Structure

- **components/**  
  Reusable UI components (Navbar, ExamCard, Buttons, CommentSection, etc.)

- **pages/**  
  Full React pages/screens for the app:
  - Home.jsx
  - Login.jsx
  - Register.jsx
  - ExamDetail.jsx
  - Profile.jsx

- **services/**  
  Functions to handle API calls using axios:
  - api.js → axios instance
  - authService.js → login, register requests
  - examService.js → fetch exams, like/save exams

- **hooks/**  
  Custom React hooks for reusable logic:
  - useAuth.js
  - useExams.js

- **context/**  
  React Context providers for global state:
  - UserContext.js
  - ExamContext.js

- **assets/**  
  Static files like images, icons, logos, etc.

## Notes for Team Members

1. Each teammate should create pages inside `pages/` and components inside `components/`.
2. Reusable code should go into `components/`, API calls into `services/`, and shared state into `context/`.
3. Keep file names clear to avoid conflicts (e.g., `Home.jsx` vs `Login.jsx`).
4. Styling is handled with Tailwind CSS. You can use className directly on JSX elements.
5. Do not delete or move folders unless necessary; this structure is shared across the team.