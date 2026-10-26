import App from './App.jsx'

import HomePage from './components/HomePage.jsx';
import SignupPage from './components/SignupPage.jsx';
import LoginPage from './components/LoginPage.jsx';

async function loadPosts()
{
    const response = await fetch("/api/posts", {
        method: "GET",
        credentials: "include"
    });

    if( !response.ok )
        throw new Error("Failed to load posts.");
    
    return { posts: await response.json() };
}

export default [
    {
        Component: App,
        children: [
            {
                index: true,
                loader: loadPosts,
                Component: HomePage 
            },
            {
                path: "signup",
                Component: SignupPage
            },
            {
                path: "login",
                Component: LoginPage
            }
        ]
    }
];