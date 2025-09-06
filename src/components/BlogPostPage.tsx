import React from "react";
import type { Post } from "../lib/kv";

interface BlogPostPageProps {
    post: Post;
    content: string;
}

export default function BlogPostPage({ post, content }: BlogPostPageProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatReadingTime = (minutes?: number) => {
        if (!minutes) return null;
        return `${minutes} min read`;
    };

    return (
        <main className="bg-black text-white">
            <div id="push" style={{ height: "56px" }}></div>
            <div className="min-h-screen bg-black text-white">
                {/* Header Image */}
                {post.headerImage && (
                    <div className="relative h-96 overflow-hidden">
                        <img
                            src={post.headerImage.url}
                            alt={post.headerImage.alt || post.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40" />
                    </div>
                )}
                {/* Content Container */}
                <div className="max-w-4xl mx-auto px-6 py-12">
                    {/* Back to Blog Link */}
                    <div className="mb-8">
                        <a
                            href="/blog"
                            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200"
                        >
                            <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                            Back to Blog
                        </a>
                    </div>
                    {/* Article Header */}
                    <header className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            {post.title}
                        </h1>
                        {post.description && (
                            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                                {post.description}
                            </p>
                        )}
                        {/* Article Meta */}
                        <div className="flex flex-wrap items-center gap-6 text-gray-400 border-b border-gray-700 pb-6">
                            {/* Author */}
                            <div className="flex items-center gap-3">
                                {post.author.image && (
                                    <img
                                        src={post.author.image}
                                        alt={post.author.name}
                                        className="w-10 h-10 rounded-full"
                                    />
                                )}
                                <div>
                                    <p className="text-white font-medium">
                                        {post.author.name}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        {post.author.email}
                                    </p>
                                </div>
                            </div>
                            {/* Date */}
                            <div className="flex items-center gap-2">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                <span>
                                    {formatDate(
                                        post.publishedAt || post.createdAt
                                    )}
                                </span>
                            </div>
                            {/* Reading Time */}
                            {post.readingMinutes && (
                                <div className="flex items-center gap-2">
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <span>
                                        {formatReadingTime(post.readingMinutes)}
                                    </span>
                                </div>
                            )}
                            {/* Status Badge */}
                            <div className="ml-auto">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        post.status === "published"
                                            ? "bg-green-900 text-green-300"
                                            : "bg-yellow-900 text-yellow-300"
                                    }`}
                                >
                                    {post.status}
                                </span>
                            </div>
                        </div>
                    </header>
                    {/* Article Content */}
                    <div>
                        <style>{`
                            .blog-content p {
                                color: #d1d5db;
                                line-height: 1.75;
                                margin-bottom: 1.5rem;
                                padding: 0.5rem 0.75rem;
                                font-size: 1rem;
                            }

                            .blog-content h1 {
                                color: white;
                                font-weight: bold;
                                font-size: 1.875rem;
                                margin-bottom: 2rem;
                                margin-top: 3rem;
                                line-height: 1.2;
                            }

                            .blog-content h2 {
                                color: white;
                                font-weight: bold;
                                font-size: 1.5rem;
                                margin-bottom: 1.5rem;
                                margin-top: 2.5rem;
                                line-height: 1.3;
                            }

                            .blog-content h3 {
                                color: white;
                                font-weight: bold;
                                font-size: 1.25rem;
                                margin-bottom: 1rem;
                                margin-top: 2rem;
                                line-height: 1.4;
                            }

                            .blog-content ul {
                                color: #d1d5db;
                                margin: 1.5rem 0;
                                padding-left: 2rem;
                            }

                            .blog-content ol {
                                color: #d1d5db;
                                margin: 1.5rem 0;
                                padding-left: 2rem;
                            }

                            .blog-content li {
                                color: #d1d5db;
                                line-height: 1.75;
                                margin-bottom: 0.75rem;
                                padding-left: 0.5rem;
                                list-style-type: disc;
                                list-style-position: outside;
                            }

                            .blog-content ul li::marker {
                                color: #60a5fa;
                                font-size: 1.1em;
                            }

                            .blog-content ol li::marker {
                                color: #60a5fa;
                                font-weight: bold;
                            }

                            .blog-content strong {
                                color: white;
                                font-weight: 600;
                            }

                            .blog-content em {
                                color: #e5e7eb;
                                font-style: italic;
                            }

                            .blog-content a {
                                color: #60a5fa;
                                text-decoration: none;
                                transition: color 0.2s;
                            }

                            .blog-content a:hover {
                                color: #93c5fd;
                            }

                            .blog-content code {
                                color: #f472b6;
                                background-color: #374151;
                                padding: 0.25rem 0.5rem;
                                border-radius: 0.375rem;
                                font-size: 0.875rem;
                                font-family: "Courier New", monospace;
                            }

                            .blog-content pre {
                                background-color: #374151;
                                border: 1px solid #4b5563;
                                border-radius: 0.5rem;
                                padding: 1rem;
                                overflow-x: auto;
                                margin: 1.5rem 0;
                            }

                            .blog-content blockquote {
                                border-left: 4px solid #3b82f6;
                                padding-left: 1.5rem;
                                padding-right: 1rem;
                                padding-top: 1rem;
                                padding-bottom: 1rem;
                                font-style: italic;
                                color: #9ca3af;
                                background-color: rgba(17, 24, 39, 0.5);
                                border-radius: 0 0.5rem 0.5rem 0;
                                margin: 1.5rem 0;
                            }

                            .blog-content img {
                                border-radius: 0.5rem;
                                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                                margin: 2rem auto;
                                border: 1px solid #4b5563;
                            }

                            .blog-content hr {
                                border-color: #4b5563;
                                margin: 2rem 0;
                                border-top-width: 2px;
                            }
                        `}</style>
                        <article
                            className="blog-content prose prose-invert prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    </div>
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-gray-700">
                            <h3 className="text-lg font-semibold text-white mb-4">
                                Tags
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag) => (
                                    <a
                                        key={tag}
                                        href={`/blog?tag=${encodeURIComponent(
                                            tag
                                        )}`}
                                        className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        #{tag}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Share Section */}
                    <div className="mt-12 pt-8 border-t border-gray-700">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Share this post
                        </h3>
                        <div className="flex gap-4">
                            <a
                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                                    post.title
                                )}&url=${encodeURIComponent(
                                    typeof window !== "undefined"
                                        ? window.location.href
                                        : ""
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                </svg>
                                Twitter
                            </a>
                            <a
                                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                                    typeof window !== "undefined"
                                        ? window.location.href
                                        : ""
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors duration-200"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                                LinkedIn
                            </a>
                            <button
                                onClick={() =>
                                    typeof window !== "undefined" &&
                                    navigator.clipboard.writeText(
                                        window.location.href
                                    )
                                }
                                className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                    />
                                </svg>
                                Copy Link
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
