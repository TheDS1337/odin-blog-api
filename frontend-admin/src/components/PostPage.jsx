import { Link, Form, useLoaderData, useRouteLoaderData } from "react-router";
import CommentCard from "./CommentCard.jsx";
import { getReadTime, getDate } from "./utils.jsx";

export default function PostPage()
{
    const { post, comments } = useLoaderData();

    const user = useRouteLoaderData("root");
    const isUserLoggedIn = user && 'id' in user;

    return (
        <main className="main-content post-page">
            <article className="post-article">
                <header className="post-header">
                    <p className="eyebrow">
                        ARTICLE
                    </p>

                    <h1>{post.title}</h1>

                    <div className="post-meta">
                        <span className="post-author">By {post.author.username}</span>
                        <span>·</span>

                        <time dateTime={post.createdAt}>{getDate(post.createdAt)}</time>
                        <span>·</span>

                        <span>{getReadTime(post.content)}</span>
                    </div>
                </header>

                <div className="post-content">
                    {post.content}
                </div>
            </article>

            <section className="comments-section">
                <h2>Comments ({comments.length})</h2>
                {
                    comments.length > 0 ?
                        <div className="comments-list">{comments.map(comment => (<CommentCard key={comment.id} comment={comment}/>))}</div>
                    : 
                        <p className="empty-comments">No comments yet. Be the first to share your thoughts.</p>
                }

                {
                    isUserLoggedIn ? (
                        <Form
                            className="comment-form"
                            method="post"
                            action={`/posts/${post.id}/comments`}
                        >
                            <h3>Leave a comment</h3>

                            <textarea
                                name="content"
                                placeholder="Share your thoughts..."
                                rows={4}
                                required
                            />

                            <div className="comment-form-footer">
                                <span>Be thoughtful and respectful.</span>
                                <button type="submit">Post comment</button>
                            </div>
                        </Form>
                    ) : (
                        <div className="login-prompt">
                            <p>Have something to say?</p>
                            <Link to="/login">Log in</Link> to join the conversation.
                        </div>
                    )
                }
            </section>
        </main>
    );
};