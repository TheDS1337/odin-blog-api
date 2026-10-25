import { Link } from "react-router";

export default function Footer()
{
    return (
        <footer className="site-footer">
            <Link
                className="footer-brand"
                to="/"
            >
                the journal.
            </Link>

            <p>Written with curiosity. Built with care.</p>
        </footer>
    );
};