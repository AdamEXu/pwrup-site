import React from "react";
import type { Post } from "../lib/kv";

interface BlogPostProps {
    post: Post;
    content: string;
}

export default function BlogPost({ post, content }: BlogPostProps) {
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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
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
                                {formatDate(post.publishedAt || post.createdAt)}
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
                <article
                    className="prose prose-invert prose-lg max-w-none
            prose-headings:text-white prose-headings:font-bold
            prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8
            prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8
            prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-6
            prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300
            prose-strong:text-white prose-strong:font-semibold
            prose-em:text-gray-200
            prose-code:text-pink-400 prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded
            prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700
            prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-6 prose-blockquote:italic
            prose-ul:text-gray-300 prose-ol:text-gray-300
            prose-li:mb-2
            prose-img:rounded-lg prose-img:shadow-lg"
                    dangerouslySetInnerHTML={{ __html: content }}
                />

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
    );
}
