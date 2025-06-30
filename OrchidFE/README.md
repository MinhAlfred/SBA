# Orchid Shop Frontend

A React-based frontend application for an Orchid Shop, featuring user authentication, product management, and shopping cart functionality.

## Project Structure

The project follows a feature-based architecture with the following structure:

```
src/
├── assets/           # Static assets like images and icons
├── components/       # Shared UI components
│   ├── common/       # Common components used across features
│   ├── forms/        # Reusable form components
│   └── layout/       # Layout components like NavBar
├── constants/        # Application constants and configuration
├── context/          # React context providers
├── features/         # Feature-based modules
│   ├── auth/         # Authentication related components
│   ├── cart/         # Shopping cart functionality
│   ├── orchids/      # Orchid management components
│   └── users/        # User management components
├── hooks/            # Custom React hooks
├── services/         # API services and data fetching
├── styles/           # Global styles and theme configuration
└── utils/            # Utility functions and helpers
```

## Features

- **Authentication**: User login and registration with role-based access control
- **Orchid Management**: View, add, edit, and delete orchids
- **Shopping Cart**: Add orchids to cart, update quantities, and checkout
- **User Management**: Admin interface for managing users and roles

## Technologies Used

- React with Vite for fast development and building
- React Router for navigation
- React Bootstrap for UI components
- React Hook Form for form handling
- Axios for API requests
- Context API for state management
- Local Storage for data persistence

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```
3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_APP_API_URL=http://your-api-url
```

## Authentication

The application uses role-based authentication with two roles:

- **User**: Can view orchids, add to cart, and checkout
- **Admin**: Can manage orchids and users

## Vite Configuration

This project uses Vite for development and building. Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
