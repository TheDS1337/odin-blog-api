import { Link } from "react-router";
import { getReadTime, getExcerpt, getDate } from "../utils.js";

export default function PostCard({ post })
{
    return (
        <article className="post-card">
            <div className="post-meta">
                <time dateTime={post.createdAt}>{getDate(post.createdAt)}</time>

                <span className="meta-dot" aria-hidden="true">·</span>
                <span>{getReadTime(post.content)}</span>
            </div>

            <h2>
                <Link to={`/posts/${post.id}`} className="post-card-link">{post.title}</Link>
            </h2>

            <p className="post-excerpt">{getExcerpt(post.content)}</p>

            <div className="post-footer">
                <span>
                    By <Link to="#author">{post.author.username}</Link>
                </span>
            </div>
        </article>
    );
};