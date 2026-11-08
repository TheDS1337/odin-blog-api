import HomePage from "../pages/HomePage.jsx";

export default {
    index: true,
    loader: async () => {
        const response = await fetch("/api/posts", {
            method: "GET",
            credentials: "include"
        });

        if( !response.ok )
            throw new Error("Failed to load posts.");
        
        return response.json();
    },
    Component: HomePage 
};