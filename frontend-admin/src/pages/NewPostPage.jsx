import { Form, Link, useNavigation } from "react-router";

export default function NewPostPage()
{
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    return (
        <main className="new-post-page">
            <div className="new-post-header">
                <div>
                    <span className="page-eyebrow">THE JOURNAL / NEW POST</span>
                    <h1>Write something.</h1>
                    <p>
                        Put your thoughts into words.
                    </p>
                </div>
            </div>

            <Form method="post" className="new-post-form">
                <div className="new-post-field">
                    <label htmlFor="post-title">Title</label>
                    <input
                        id="post-title"
                        type="text"
                        name="title"
                        placeholder="Give your post a title..."
                        required
                        maxLength={150}
                    />
                </div>

                <div className="new-post-field">
                    <label htmlFor="post-content">Content</label>
                    <textarea
                        id="post-content"
                        name="content"
                        placeholder="Start writing your post..."
                        rows={18}
                        required
                    />
                </div>

                <div className="new-post-actions">
                    <Link
                        to="/"
                        className="button button-secondary"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        className="button button-primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Publishing..." : "Publish post"}
                    </button>
                </div>
            </Form>
        </main>
    );
}
