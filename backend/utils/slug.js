// تولید slug که حروف فارسی را نگه می‌دارد (برای URL خوانا و سئو)
const slugify = (text) =>
  String(text || '')
    .trim()
    .toLowerCase()
    .replace(/[\u200c\s_]+/g, '-')
    .replace(/[^\p{L}\p{N}-]+/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);

// یکتا کردن slug با پسوند -2، -3 و ...
const uniqueSlug = async (Model, base, excludeId) => {
  let root = slugify(base) || `article-${require('crypto').randomBytes(3).toString('hex')}`;
  let candidate = root;
  let n = 2;
  // eslint-disable-next-line no-await-in-loop
  while (await Model.exists({ slug: candidate, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) {
    candidate = `${root}-${n++}`;
  }
  return candidate;
};

module.exports = { slugify, uniqueSlug };
