import { useState } from "react";
import { Form, useRouteLoaderData, useNavigation } from "react-router";
import { getDate } from "../utils.js";

export default function CommentCard({ comment })
{
    const [isUserEditingComment, setUserEditingComment] = useState(false);
    const [content, setContent] = useState(comment.content);

    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    const user = useRouteLoaderData("root");

    return (
        <article className="comment-card">
            <header className="comment-header">
                <div className="comment-author">
                    <strong>{comment.author.username}</strong>
                </div>

                <time dateTime={comment.createdAt}>{getDate(comment.createdAt)}</time>
            </header>

            {
                isUserEditingComment ? (
                    <Form
                        method="put"
                        action={`/posts/${comment.postId}/comments/${comment.id}/edit`}
                        className="edit-form comment-edit-form"
                    >
                        <textarea
                            name="content"
                            value={content}
                            onChange={event => setContent(event.target.value)}
                            rows={4}
                            required
                        />

                        <div className="edit-form-actions">
                            <button
                                type="submit"
                                className="button button-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Saving..." : "Save changes"}
                            </button>

                            <button
                                type="button"
                                className="button button-secondary"
                                onClick={() => {
                                    setContent(() => comment.content);
                                    setUserEditingComment(() => false);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </Form>
                ) : (
                    <>
                        <p className="comment-content">
                            {content}
                        </p>

                        {
                            (user?.id === comment.authorId || (user?.isAdmin && !comment.author.isAdmin)) && (
                                <div className="comment-actions">
                                    <button
                                        type="button"
                                        className="button button-secondary"
                                        onClick={() => setUserEditingComment(() => true)}
                                    >
                                        Edit
                                    </button>

                                    <Form
                                        method="delete"
                                        action={`/posts/${comment.postId}/comments/${comment.id}/remove`}
                                    >
                                        <button
                                            type="submit"
                                            className="button button-danger"
                                            onClick={event => {
                                                if( !window.confirm("Are you sure you want to remove this comment?") )
                                                    event.preventDefault();
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </Form>
                                </div>
                            )
                        }
                    </>
                )
            }
        </article>
    );
}