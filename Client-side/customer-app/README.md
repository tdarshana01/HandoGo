# HandiGO Customer App - Micro Frontend

This is the customer-facing application for HandiGO built with React and Tailwind CSS using micro frontend architecture.

## Project Structure

```
customer-app/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Auth/              # Authentication micro frontend module
│   │   │   ├── Login.js       # Login component
│   │   │   ├── Signup.js      # Signup component
│   │   │   ├── README.md      # Auth module documentation
│   │   │   └── index.js       # Module exports
│   │   └── ProtectedRoute.js  # Route protection component
│   ├── context/
│   │   └── AuthContext.js     # Global authentication state
│   ├── services/
│   │   └── auth.service.js    # API service for authentication
│   ├── assets/                # Images and static files
│   ├── App.js                 # Main application component
│   ├── App.css                # Global styles
│   ├── index.js               # Application entry point
│   └── index.css              # Tailwind CSS imports
├── package.json
├── tailwind.config.js
└── README.md
```

## Features

### Authentication Module
- ✅ Login with email and password
- ✅ User registration/signup
- ✅ Form validation
- ✅ Error handling
- ✅ Loading states
- ✅ Responsive design
- ✅ Modern UI with HandiGO branding

### Architecture
- **Micro Frontend**: Each feature is a self-contained module
- **Context API**: Global state management for authentication
- **Service Layer**: Separation of API logic
- **Protected Routes**: Route-level authentication guards
- **Modular Components**: Reusable and maintainable code

## Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
