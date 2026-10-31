const getReadTime = (content, avgReadingSpeed = 200) =>
{
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / avgReadingSpeed));

    return `${readingTime} min read`;
}

const getExcerpt = (content, maxLength = 160) =>
{
    const text = content.trim().replace(/\s+/g, " ");

    if( text.length <= maxLength )
        return text;

    const excerpt = text.slice(0, maxLength);
    const lastSpace = excerpt.lastIndexOf(" ");

    return `${excerpt.slice(0, lastSpace > 0 ? lastSpace : maxLength)}…`;
}

const getDate = (timestamp) => new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
}).format(new Date(timestamp));

export {
    getReadTime,
    getExcerpt,
    getDate
}