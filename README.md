# E-Commerce Web Application

## Overview
This is a fully functional e-commerce web application built with Vue 3, Pinia, Firebase Database and Firebase Authentication. The project features user authentication, product management, shopping cart functionality, and payment simulation (BLIK/Card). The goal of this project is to provide a smooth and intuitive shopping experience.

## Features
- **User Authentication:** Sign up and log in with Firebase Authentication (email and password).
- **Product Management:** Browse a list of products, view product details, and add items to the cart.
- **Shopping Cart:** Manage the shopping cart with real-time updates.
- **Order Processing:** Checkout with multiple payment options (BLIK/Card) and order tracking.
- **State Management:** Pinia is used for state management to handle global store data.
- **Database:** Firebase Firestore is used to store user data, products, orders.
- **UI Framework:** Styled with Bulma for a modern and responsive design.
- **Form Data Persistence:** Form data is preserved when switching components.

## Technologies Used
- **Frontend:** Vue 3, Pinia, Vue Router, TypeScript
- **UI Framework:** Bulma
- **Authentication:** Firebase Authentication
- **State Management:** Pinia
- **Database:** Firebase Firestore

## Firestore Security Rules
To ensure data security, the following Firestore rules are applied:
```javascript
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Rules for groups
    match /groups/{groupId} {
      allow read: if true;  // Anyone can read groups
      allow create: if request.auth != null; // Only authenticated users can create groups
      allow update: if request.auth != null && request.resource.data.members != null && request.auth.uid != null; // Users can add themselves to a group (pendingMembers)
      allow delete: if request.auth != null && request.resource.data.owner == request.auth.uid; // Only the group owner can delete
    }

    // Rules for users
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Rules for tasks
    match /tasks/{taskId} {
      allow read: if request.auth != null; // Any authenticated user can read tasks
      allow create: if request.auth != null; // Any authenticated user can create tasks
      allow update, delete: if request.auth != null; // Any authenticated user can update and delete tasks
    }
  }
}
```

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/dundunek1/E-Commerce-Web-Application.git
   cd E-Commerce-Web-Application
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Install Firebase and Firebase SDK: You need to install Firebase to handle authentication and database functionality. Run the following command:
   ```sh
   npm install firebase
   ```
4. Set up Firebase in your project:

   Go to Firebase Console, create a new Firebase project, or use an existing one.
   Enable Firebase Authentication and Firebase Firestore for your project.
   Copy your Firebase configuration (API key, project ID, etc.) from your Firebase Console.

5. Edit Firebase Configuration:
   Open the src/firebaseConfig.ts
   Replace the placeholder values with your Firebase project credentials (from step 4). It should look like this:
   ```sh
   const firebaseConfig = {
    apiKey: '<YOUR_API_KEY>',
    authDomain: '<YOUR_AUTH_DOMAIN>',
    databaseURL: '<YOUR_DATABASE_URL>',
    projectId: '<YOUR_PROJECT_ID>',
    storageBucket: '<YOUR_STORAGE_BUCKET>',
    messagingSenderId: '<YOUR_MESSAGING_SENDER_ID>',
    appId: '<YOUR_APP_ID>',
    measurementId: '<YOUR_MEASUREMENT_ID>',
    }
   ```
  6. Run the development server:
   ```sh
   npm run dev
   ```
## Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request.

## License
This project is licensed under the MIT License.
