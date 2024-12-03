# EmployWise User Management App

A React application that integrates with the Reqres API to perform basic user management functions. This project demonstrates authentication, user listing, and CRUD operations.

## Features

- User Authentication
- Paginated User List
- Edit User Details
- Delete Users
- Responsive Design using Material-UI
- Protected Routes
- Error Handling

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd employwise-assignment
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Usage

1. Access the application at `http://localhost:5173`
2. Login using the following credentials:
   - Email: eve.holt@reqres.in
   - Password: cityslicka

## Technologies Used

- React
- React Router DOM
- Material-UI
- Axios
- Vite

## Project Structure

```
src/
  ├── components/
  │   ├── Login.jsx
  │   └── UserList.jsx
  ├── App.jsx
  └── main.jsx
```

## API Endpoints

The application uses the following endpoints from Reqres API (https://reqres.in/):

- POST /api/login - Authentication
- GET /api/users?page={page} - Fetch users
- PUT /api/users/{id} - Update user
- DELETE /api/users/{id} - Delete user
