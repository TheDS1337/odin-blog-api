import { Link } from "react-router";

/*

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
*/
export default function PostCard({ post })
{
    return (
        <article className="post-card">
            <div className="post-meta">
                <time>{post.updatedAt}</time>

                <span className="meta-dot" aria-hidden="true">·</span>
                <span>{post.readTime}</span>
            </div>

            <h2>
                <Link to={`/posts/${post.id}`}>{post.title}</Link>
            </h2>

            <p className="post-excerpt">{post.content}</p>

            <div className="post-footer">
                <span>
                    By <Link to="#author">{post.authorId}</Link>
                </span>

                <Link
                    className="read-more"
                    to={`/posts/${post.id}`}
                >
                    Read article <span aria-hidden="true">→</span>
                </Link>
            </div>
        </article>
    );
};