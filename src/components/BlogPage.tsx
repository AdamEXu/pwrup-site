import { useEffect, useState } from "react";
import BlogPost from "./BlogPost";

interface Post {
    id?: string | number;
    title?: string;
    [key: string]: any;
}

interface MetaResponse {
    tags?: string[];
    months?: string[];
}

interface PostsResponse {
    posts?: Post[];
    total?: number;
    tags?: string[];
    months?: string[];
}

export default function BlogPage() {
    const getParam = (name: string, def = "") => {
        if (typeof window === "undefined") return def;
        const sp = new URLSearchParams(window.location.search);
        return sp.get(name) ?? def;
    };

    const [tag, setTag] = useState<string>(() => getParam("tag"));
    const [month, setMonth] = useState<string>(() => getParam("month"));
    const [q, setQ] = useState<string>(() => getParam("q"));
    const [page, setPage] = useState<number>(
        () => parseInt(getParam("page", "1")) || 1
    );
    const [limit, setLimit] = useState<number>(
        () => parseInt(getParam("limit", "10")) || 10
    );

    const [tags, setTags] = useState<string[]>([]);
    const [months, setMonths] = useState<string[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [total, setTotal] = useState<number>(0);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    // Load metadata (tags/months)
    useEffect(() => {
        fetch("/api/posts/meta")
            .then((r) => r.json())
            .then((data: MetaResponse) => {
                if (data.tags) setTags(data.tags);
                if (data.months) setMonths(data.months);
            })
            .catch(() => {
                // ignore errors; metadata may not be available
            });
    }, []);

    // Load posts when query changes
    useEffect(() => {
        const params = new URLSearchParams();
        if (tag) params.set("tag", tag);
        if (month) params.set("month", month);
        if (q) params.set("q", q);
        params.set("page", String(page));
        params.set("limit", String(limit));

        fetch(`/api/posts?${params.toString()}`)
            .then((r) => r.json())
            .then((data: PostsResponse) => {
                setPosts(data.posts || []);
                setTotal(data.total || 0);
                if (data.tags) setTags(data.tags);
                if (data.months) setMonths(data.months);
            })
            .catch(() => {
                setPosts([]);
                setTotal(0);
            });
    }, [tag, month, q, page, limit]);

    // Reflect selection in URL
    useEffect(() => {
        const params = new URLSearchParams();
        if (tag) params.set("tag", tag);
        if (month) params.set("month", month);
        if (q) params.set("q", q);
        params.set("page", String(page));
        params.set("limit", String(limit));
        const search = params.toString();
        const url = `${window.location.pathname}?${search}`;
        window.history.replaceState(null, "", url);
    }, [tag, month, q, page, limit]);

    return (
        <main className="bg-black text-white min-h-screen p-6">
            <div id="push" style={{ height: "56px" }}></div>
            <div className="blog-page max-w-3xl mx-auto">
                <div className="filters mt-12 flex flex-row gap-4 flex-wrap justify-center">
                    <div className="tags flex flex-wrap gap-4">
                        {tags.map((t) => (
                            <button
                                key={t}
                                onClick={() => {
                                    setTag(t === tag ? "" : t);
                                    setPage(1);
                                }}
                                className={`${
                                    t === tag ? "selected" : ""
                                } px-4 py-2 rounded-full bg-white/10 hover:bg-white/20`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <div className="month-select mt-4">
                        <select
                            value={month}
                            onChange={(e) => {
                                setMonth(e.target.value);
                                setPage(1);
                            }}
                            className="bg-white/10 rounded-full px-4 py-2 hover:bg-white/20"
                        >
                            <option value="">All months</option>
                            {months.map((m) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="search-input mt-4">
                        <input
                            type="text"
                            value={q}
                            placeholder="Search"
                            onChange={(e) => {
                                setQ(e.target.value);
                                setPage(1);
                            }}
                            className="bg-white/10 rounded-full px-4 py-2 hover:bg-white/20"
                        />
                    </div>
                </div>
                <ul className="posts mt-12 space-y-4">
                    {posts.map((p, idx) => (
                        <BlogPost key={p.id ?? idx} post={p} />
                    ))}
                </ul>
                <div className="pagination">
                    <span>
                        Page {page} of {totalPages} ({total} total)
                    </span>
                    <div className="links">
                        {page > 1 && (
                            <button onClick={() => setPage(page - 1)}>
                                Previous
                            </button>
                        )}
                        {page < totalPages && (
                            <button onClick={() => setPage(page + 1)}>
                                Next
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
