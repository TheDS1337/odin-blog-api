import { getDate } from "./utils.jsx";

export default function CommentCard({ comment })
{
    return (
        <article className="comment-card">
            <header className="comment-header">
                <div className="comment-author">
                    <strong>{comment.author.username}</strong>
                </div>

                <time dateTime={comment.createdAt}>{getDate(comment.createdAt)}</time>
            </header>

            <p className="comment-content">
                {comment.content}
            </p>
        </article>
    );
}