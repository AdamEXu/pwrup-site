import React from "react";
import type { Post } from "../lib/kv";

interface BlogPostProps {
    post: Post;
}

export default function BlogPost({ post }: BlogPostProps) {
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

    const getExcerpt = (content: string, maxLength: number = 150) => {
        const plainText = content.replace(/[#*`]/g, "").trim();
        if (plainText.length <= maxLength) return plainText;
        return plainText.substring(0, maxLength).trim() + "...";
    };

    return (
        <article className="group cursor-pointer">
            <a href={`/blog/${post.slug}`} className="block">
                <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1">
                    {/* Header Image */}
                    {post.headerImage && (
                        <div className="relative h-36 overflow-hidden">
                            <img
                                src={post.headerImage.url}
                                alt={post.headerImage.alt || post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                            {/* Status Badge */}
                            <div className="absolute top-4 right-4">
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        post.status === "published"
                                            ? "bg-green-900/80 text-green-300 backdrop-blur-sm"
                                            : "bg-yellow-900/80 text-yellow-300 backdrop-blur-sm"
                                    }`}
                                >
                                    {post.status}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                        {/* Title */}
                        <h2 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                            {post.title}
                        </h2>

                        {/* Description/Excerpt */}
                        <p className="text-gray-400 mb-4 line-clamp-3">
                            {post.description || getExcerpt(post.content)}
                        </p>

                        {/* Meta Information */}
                        <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-4">
                                {/* Author */}
                                <div className="flex items-center gap-2">
                                    {post.author.image && (
                                        <img
                                            src={post.author.image}
                                            alt={post.author.name}
                                            className="w-6 h-6 rounded-full"
                                        />
                                    )}
                                    <span>{post.author.name}</span>
                                </div>

                                {/* Date */}
                                <div className="flex items-center gap-1">
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
                                    <div className="flex items-center gap-1">
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
                                            {formatReadingTime(
                                                post.readingMinutes
                                            )}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {post.tags.slice(0, 3).map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-xs hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                                {post.tags.length > 3 && (
                                    <span className="px-2 py-1 text-gray-500 text-xs">
                                        +{post.tags.length - 3} more
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </a>
        </article>
    );
}
