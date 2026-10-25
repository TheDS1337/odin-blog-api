import App from './App.jsx'

import HomePage from './components/HomePage.jsx';
import SignupPage from './components/SignupPage.jsx';
import LoginPage from './components/LoginPage.jsx';

export default [
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <HomePage /> 
            },
            {
                path: "signup",
                element: <SignupPage />
            },
            {
                path: "login",
                element: <LoginPage />
            }
        ]
    }
];