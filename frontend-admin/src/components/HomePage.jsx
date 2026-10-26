import { useLoaderData } from "react-router";
import PostCard from "./PostCard.jsx";

export default function HomePage()
{
    const { posts } = useLoaderData();

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

                    <span>{posts.length} articles</span>
                </div>

                {posts.map(post => <PostCard key={post.id} post={post} />)}
            </section>
        </main>
    );
};