import PostCard from "./PostCard.jsx";

const samplePosts =
[
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

export default function HomePage()
{
    return (
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

                    <span>{samplePosts.length} articles</span>
                </div>

                {samplePosts.map(post => <PostCard key={post.id} post={post} />)}
            </section>
        </main>
    );
};