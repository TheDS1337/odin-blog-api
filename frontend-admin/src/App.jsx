
import { useEffect, useState } from "react";
import "./App.css";

const samplePosts = [
    {
        id: 1,
        title: "Building my first full-stack application",
        date: "October 22, 2026",
        author: "Alex Morgan",
        excerpt:
        "What I learned while connecting a React frontend to an Express API, implementing authentication, and working with a PostgreSQL database.",
        readTime: "5 min read",
    },
    {
        id: 2,
        title: "Understanding authentication on the web",
        date: "October 18, 2026",
        author: "Jamie Lee",
        excerpt:
        "A practical introduction to sessions, JWTs, HTTP-only cookies, and the relationship between a frontend and a backend.",
        readTime: "7 min read",
    },
    {
        id: 3,
        title: "Why I enjoy learning by building projects",
        date: "October 12, 2026",
        author: "Sam Taylor",
        excerpt:
        "Learning programming becomes much more interesting when you stop following tutorials and start solving your own problems.",
        readTime: "4 min read",
    },
];

function ThemeIcon({ theme }) {
    if (theme === "dark") {
        // Sun icon: click to switch to light mode.
        return (
        <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
        </svg>
        );
    }

    // Moon icon: click to switch to dark mode.
    return (
        <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        >
        <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />
        </svg>
    );
}

function Header({ theme, onToggleTheme }) {
    return (
        <header className="site-header">
        <a className="brand" href="/" aria-label="The Journal home">
            <span className="brand-mark">b.</span>
            <span>the journal</span>
        </a>

        <nav className="nav-links" aria-label="Main navigation">
            <a href="/">Home</a>
            <a href="/login">Log in</a>

            <a className="nav-signup" href="/signup">
            Sign up
            </a>

            <button
            className="theme-toggle"
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${
                theme === "dark" ? "light" : "dark"
            } theme`}
            title={`Switch to ${
                theme === "dark" ? "light" : "dark"
            } theme`}
            >
            <ThemeIcon theme={theme} />
            </button>
        </nav>
        </header>
    );
}

function PostCard({ post }) {
    return (
        <article className="post-card">
        <div className="post-meta">
            <time>{post.date}</time>
            <span className="meta-dot" aria-hidden="true">
            ·
            </span>
            <span>{post.readTime}</span>
        </div>

        <h2>
            <a href={`/posts/${post.id}`}>{post.title}</a>
        </h2>

        <p className="post-excerpt">{post.excerpt}</p>

        <div className="post-footer">
            <span>
            By <a href="#author">{post.author}</a>
            </span>

            <a className="read-more" href={`/posts/${post.id}`}>
            Read article <span aria-hidden="true">→</span>
            </a>
        </div>
        </article>
    );
}

function Footer() {
    return (
        <footer className="site-footer">
        <a className="footer-brand" href="/">
            the journal.
        </a>

        <p>Written with curiosity. Built with care.</p>
        </footer>
    );
}

export default function App() {
    const [theme, setTheme] = useState(() => {
        try {
        return localStorage.getItem("blog-theme") === "light"
            ? "light"
            : "dark";
        } catch {
        return "dark";
        }
    });

    useEffect(() => {
        document.documentElement.dataset.theme = theme;

        try {
        localStorage.setItem("blog-theme", theme);
        } catch {
        // The theme still works if browser storage is unavailable.
        }
    }, [theme]);

    function toggleTheme() {
        setTheme((currentTheme) =>
        currentTheme === "dark" ? "light" : "dark"
        );
    }

    return (
        <div className="app-shell">
        <Header
            theme={theme}
            onToggleTheme={toggleTheme}
        />

        <main className="main-content">
            <section className="intro">
            <p className="eyebrow">INDEPENDENTLY WRITTEN</p>

            <h1>
                Ideas worth
                <br />
                <span>thinking about.</span>
            </h1>

            <p className="intro-description">
                Notes on technology, programming, and the things
                we learn along the way.
            </p>
            </section>

            <section
            className="articles"
            aria-labelledby="articles-title"
            >
            <div className="section-heading">
                <h2 id="articles-title">Latest articles</h2>

                <span>
                {samplePosts.length} articles
                </span>
            </div>

            {samplePosts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
            </section>

            <Footer />
        </main>
        </div>
    );
};