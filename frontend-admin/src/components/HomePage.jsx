import { useLoaderData } from "react-router";
import PostCard from "./PostCard.jsx";

export default function HomePage()
{
    const posts = useLoaderData();

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
                className="posts"
                aria-labelledby="posts-title"
            >
                <div className="section-heading">
                    <h2 id="posts-title">Latest posts</h2>

                    <span>{posts.length} post{posts.length !== 1 && 's'}</span>
                </div>

                {posts.map(post => <PostCard key={post.id} post={post} />)}
            </section>
        </main>
    );
};