import { r as redis, k as keys } from '../../../chunks/kv_BGMYywOY.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async () => {
  try {
    const tagKeys = await redis.keys(keys.tag("*"));
    const tags = tagKeys.map((key) => key.split(":").pop()).filter(Boolean);
    const months = [];
    return new Response(JSON.stringify({
      tags: tags.sort(),
      months: months.sort()
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return new Response(JSON.stringify({
      tags: [],
      months: []
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
