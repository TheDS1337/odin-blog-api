import { Link } from "react-router";

export default function PostCard({ post })
{
    return (
        <article className="post-card">
            <div className="post-meta">
                <time>{post.date}</time>

                <span className="meta-dot" aria-hidden="true">·</span>
                <span>{post.readTime}</span>
            </div>

            <h2>
                <Link to={`/posts/${post.id}`}>{post.title}</Link>
            </h2>

            <p className="post-excerpt">{post.excerpt}</p>

            <div className="post-footer">
                <span>
                    By <Link to="#author">{post.author}</Link>
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