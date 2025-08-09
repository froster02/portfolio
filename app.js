(function () {
  const config = window.siteConfig || {};

  const elements = {
    name: document.getElementById("name"),
    avatar: document.getElementById("avatar"),
    tagline: document.getElementById("tagline"),
    socials: document.getElementById("socials"),
    projectsGrid: document.getElementById("projectsGrid"),
    aboutName: document.getElementById("aboutName"),
    aboutLocation: document.getElementById("aboutLocation"),
    aboutCompany: document.getElementById("aboutCompany"),
    aboutWebsite: document.getElementById("aboutWebsite"),
    aboutTwitter: document.getElementById("aboutTwitter"),
    aboutEmail: document.getElementById("aboutEmail"),
    aboutLinkedIn: document.getElementById("aboutLinkedIn"),
    aboutBio: document.getElementById("aboutBio"),
    contactButton: document.getElementById("contactButton"),
    resumeButton: document.getElementById("resumeButton"),
    footerName: document.getElementById("footerName"),
    footerTag: document.getElementById("footerTag"),
    skillsGrid: document.getElementById("skillsGrid"),
    githubStatsImg: document.getElementById("githubStatsImg"),
    githubLangsImg: document.getElementById("githubLangsImg"),
    wakatimeBadgeImg: document.getElementById("wakatimeBadgeImg"),
    wakatimeCardImg: document.getElementById("wakatimeCardImg"),
    leetcodeSolved: document.getElementById("leetcodeSolved"),
    leetcodeSubmissions: document.getElementById("leetcodeSubmissions"),
    leetcodeLink: document.getElementById("leetcodeLink"),
  };

  const numberFmt = new Intl.NumberFormat(undefined, { notation: "compact" });

  function createEl(tag, options = {}) {
    const el = document.createElement(tag);
    if (options.className) el.className = options.className;
    if (options.text) el.textContent = options.text;
    if (options.html) el.innerHTML = options.html;
    if (options.attrs) Object.entries(options.attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  }

  function colorForLanguage(language) {
    const map = {
      JavaScript: "#f1e05a",
      TypeScript: "#3178c6",
      Python: "#3572A5",
      Go: "#00ADD8",
      Rust: "#DEA584",
      Java: "#b07219",
      C: "#555555",
      "C++": "#f34b7d",
      Ruby: "#701516",
      PHP: "#4F5D95",
      CSS: "#563d7c",
      HTML: "#e34c26",
      Shell: "#89e051",
      Swift: "#F05138",
      Kotlin: "#A97BFF",
      Dart: "#00B4AB",
    };
    return map[language] || "#888";
  }

  function normalizeRepoId(str, owner) {
    if (!str) return null;
    if (str.includes("/")) return str.toLowerCase();
    if (owner) return `${owner}/${str}`.toLowerCase();
    return str.toLowerCase();
  }

  function setText(el, text) {
    if (!el) return;
    el.textContent = text || "—";
  }

  function setLink(el, href, label) {
    if (!el) return;
    if (href) {
      el.innerHTML = `<a href="${href}" target="_blank" rel="noopener">${label || href}</a>`;
    } else {
      el.textContent = "—";
    }
  }

  function buildSocials({ htmlUrl, blog, twitter }) {
    elements.socials.innerHTML = "";
    const links = [];
    if (htmlUrl) links.push({ href: htmlUrl, label: "GitHub" });
    if (blog) links.push({ href: blog, label: "Website" });
    if (twitter) links.push({ href: `https://twitter.com/${twitter}`, label: "Twitter" });
    if (config.linkedin) links.push({ href: config.linkedin, label: "LinkedIn" });

    links.forEach((l) => {
      const a = createEl("a", { className: "btn btn-ghost", text: l.label, attrs: { href: l.href, target: "_blank", rel: "noopener" } });
      elements.socials.appendChild(a);
    });
  }

  function buildProjectCard(repo) {
    const card = createEl("a", { className: "card reveal", attrs: { href: repo.html_url, target: "_blank", rel: "noopener", role: "listitem" } });

    const title = createEl("h3", { className: "card-title" });
    const name = createEl("span", { text: repo.name });
    const stars = createEl("span", { text: `★ ${numberFmt.format(repo.stargazers_count)}`, className: "muted" });
    title.appendChild(name);
    title.appendChild(stars);

    const desc = createEl("p", { className: "card-desc", text: repo.description || "No description provided." });

    const meta = createEl("div", { className: "card-meta" });
    const langColor = createEl("span", { className: "lang-dot" });
    langColor.style.background = colorForLanguage(repo.language);
    const langText = createEl("span", { text: repo.language || "Other" });
    const updated = new Date(repo.pushed_at || repo.updated_at);
    const updatedText = createEl("span", { text: `Updated ${updated.toLocaleDateString()}` });
    meta.appendChild(langColor);
    meta.appendChild(langText);
    meta.appendChild(updatedText);

    const topicsWrap = createEl("div", { className: "topics" });
    (repo.topics || []).slice(0, 6).forEach((t) => {
      topicsWrap.appendChild(createEl("span", { className: "topic", text: t }));
    });

    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(meta);
    if (repo.topics && repo.topics.length) card.appendChild(topicsWrap);

    return card;
  }

  function revealInView() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  }

  async function fetchJson(url, headers = {}) {
    const res = await fetch(url, { headers: { "Accept": "application/vnd.github+json", ...headers } });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return res.json();
  }

  async function loadGitHub(username) {
    try {
      const profile = await fetchJson(`https://api.github.com/users/${username}`);

      // Name and avatar
      const displayName = config.name || profile.name || profile.login;
      setText(elements.name, displayName);
      elements.avatar.src = profile.avatar_url;
      elements.avatar.referrerPolicy = "no-referrer";

      // Tagline
      const tagline = config.tagline || profile.bio || "Crafting thoughtful software experiences.";
      setText(elements.tagline, tagline);

      // About
      setText(elements.aboutName, displayName);
      setText(elements.aboutLocation, profile.location);
      setText(elements.aboutCompany, profile.company);
      setLink(elements.aboutWebsite, profile.blog, profile.blog);
      setText(elements.aboutTwitter, profile.twitter_username ? `@${profile.twitter_username}` : "");
      setText(elements.aboutEmail, config.email || profile.email);
      setLink(elements.aboutLinkedIn, config.linkedin, "LinkedIn");
      setText(elements.aboutBio, profile.bio || config.tagline);

      // Socials
      buildSocials({ htmlUrl: profile.html_url, blog: profile.blog, twitter: profile.twitter_username });

      // Footer
      setText(elements.footerName, displayName);

      // CTA
      if (config.email || profile.email) {
        elements.contactButton.href = `mailto:${config.email || profile.email}`;
      } else {
        elements.contactButton.href = profile.html_url;
      }
      if (config.resumeUrl) {
        elements.resumeButton.href = config.resumeUrl;
      } else {
        elements.resumeButton.style.display = "none";
      }

      // Repos
      const repos = await fetchJson(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
      let filtered = repos.filter(r => !r.fork && !r.archived);

      // Sort by stars desc then recent push
      filtered.sort((a, b) => {
        if (b.stargazers_count !== a.stargazers_count) return b.stargazers_count - a.stargazers_count;
        return new Date(b.pushed_at) - new Date(a.pushed_at);
      });

      // Topics require a separate accept header per repo; we can fetch them in parallel but limit for rate.
      const topicFetches = filtered.slice(0, 24).map(async (r) => {
        try {
          const data = await fetchJson(`https://api.github.com/repos/${r.full_name}/topics`, { "Accept": "application/vnd.github.mercy-preview+json" });
          r.topics = data.names || [];
        } catch (_) { r.topics = []; }
      });
      await Promise.all(topicFetches);

      // Featured repos prioritization
      const owner = profile.login;
      const wanted = new Set((config.featuredRepos || []).map((x) => normalizeRepoId(x, owner)));
      const featured = [];
      const rest = [];
      filtered.forEach((r) => {
        const id = r.full_name.toLowerCase();
        if (wanted.has(id)) featured.push(r); else rest.push(r);
      });
      const finalList = [...featured, ...rest].slice(0, Math.max(1, config.projectsLimit || 6));

      // Render
      elements.projectsGrid.innerHTML = "";
      finalList.forEach((repo) => {
        elements.projectsGrid.appendChild(buildProjectCard(repo));
      });

      revealInView();

      // Skills
      renderSkills();

      // Stats images (GitHub Stats / Langs)
      if (elements.githubStatsImg) {
        elements.githubStatsImg.src = `https://github-readme-stats.vercel.app/api?username=${profile.login}&show_icons=true&theme=radical&hide_title=false&layout=compact`;
        elements.githubLangsImg.src = `https://github-readme-stats.vercel.app/api/top-langs?username=${profile.login}&show_icons=true&locale=en&layout=compact&theme=radical`;
      }

      // WakaTime
      if (config.wakatime && config.wakatime.userId) {
        elements.wakatimeBadgeImg.src = `https://wakatime.com/badge/user/${config.wakatime.userId}.svg`;
        elements.wakatimeCardImg.src = `https://github-readme-stats.vercel.app/api/wakatime?username=${config.wakatime.username}&layout=compact&theme=radical`;
      }

      // LeetCode
      if (config.leetcode) {
        setText(elements.leetcodeSolved, String(config.leetcode.solved));
        setText(elements.leetcodeSubmissions, String(config.leetcode.submissions));
        if (elements.leetcodeLink) {
          elements.leetcodeLink.href = config.leetcode.profileUrl || `https://leetcode.com/u/${config.leetcode.username}/`;
        }
      }
    } catch (err) {
      console.error(err);
      // Fallback to config-only rendering
      renderFallback();
    }
  }

  function renderFallback() {
    const displayName = config.name || "Your Name";
    setText(elements.name, displayName);
    setText(elements.tagline, config.tagline || "Crafting thoughtful software experiences.");
    setText(elements.aboutName, displayName);
    setText(elements.aboutBio, config.tagline || "");
    elements.avatar.src = "https://avatars.githubusercontent.com/u/9919?v=4"; // GitHub's avatar as placeholder

    elements.projectsGrid.innerHTML = "";
    const info = createEl("div", { className: "card", html: "<strong>Connect GitHub:</strong> Set your username in <code>config.js</code> to automatically show your projects here." });
    elements.projectsGrid.appendChild(info);

    renderSkills();

    if (elements.githubStatsImg && config.githubUsername) {
      elements.githubStatsImg.src = `https://github-readme-stats.vercel.app/api?username=${config.githubUsername}&show_icons=true&theme=radical&hide_title=false&layout=compact`;
      elements.githubLangsImg.src = `https://github-readme-stats.vercel.app/api/top-langs?username=${config.githubUsername}&show_icons=true&locale=en&layout=compact&theme=radical`;
    }

    if (config.wakatime && config.wakatime.userId) {
      elements.wakatimeBadgeImg.src = `https://wakatime.com/badge/user/${config.wakatime.userId}.svg`;
      elements.wakatimeCardImg.src = `https://github-readme-stats.vercel.app/api/wakatime?username=${config.wakatime.username}&layout=compact&theme=radical`;
    }

    if (config.leetcode) {
      setText(elements.leetcodeSolved, String(config.leetcode.solved));
      setText(elements.leetcodeSubmissions, String(config.leetcode.submissions));
      if (elements.leetcodeLink) elements.leetcodeLink.href = config.leetcode.profileUrl;
    }
  }

  function renderSkills() {
    if (!elements.skillsGrid) return;
    const skills = config.skills || [];
    elements.skillsGrid.innerHTML = "";
    skills.forEach((s) => {
      const item = createEl("div", { className: "skill" });
      const img = createEl("img", { attrs: { src: s.icon, alt: s.label, loading: "lazy" } });
      const label = createEl("span", { text: s.label });
      item.appendChild(img);
      item.appendChild(label);
      elements.skillsGrid.appendChild(item);
    });
  }

  // Subtle parallax / shine on hero name
  function initHeroEffects() {
    const hero = document.getElementById("hero");
    const name = document.getElementById("name");
    let rafId = 0;
    function onMove(e) {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const angle = (x - 0.5) * 16;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        name.style.backgroundImage = `linear-gradient(${120 + angle}deg, var(--accent-1), var(--accent-2))`;
      });
    }
    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", () => {
      name.style.backgroundImage = "linear-gradient(90deg, var(--accent-1), var(--accent-2))";
    });
  }

  function init() {
    initHeroEffects();

    const username = (config.githubUsername || "").trim();
    if (!username || username === "YOUR_GITHUB_USERNAME") {
      renderFallback();
      return;
    }
    loadGitHub(username);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
