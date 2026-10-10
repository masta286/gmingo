const videos = [
  {
    user: "@mastar_editz",
    caption: "When the animation hits different 🔥 Who is your favorite anime character?",
    music: "♪ Original sound — MASTAR",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=900&q=80",
    likes: 12400,
    comments: 342,
    shares: 81
  },
  {
    user: "@anime_world",
    caption: "That final scene was absolutely insane 😭🔥",
    music: "♪ Anime Edit Sound",
    image: "https://images.unsplash.com/photo-1614583224978-f9c3b0f1e4f5?auto=format&fit=crop&w=900&q=80",
    likes: 8932,
    comments: 211,
    shares: 56
  },
  {
    user: "@editking",
    caption: "POV: you finally unlock your main character energy ⚡",
    music: "♪ Epic Original Sound",
    image: "https://images.unsplash.com/photo-1541560052-77ec1bbc09f7?auto=format&fit=crop&w=900&q=80",
    likes: 5201,
    comments: 98,
    shares: 32
  }
];

const feed = document.getElementById("feed");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");

function formatNumber(n) {
  return n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "K" : n;
}

function renderFeed() {
  feed.innerHTML = videos.map((v, i) => `
    <article class="video-card">
      <img class="video-bg" src="${v.image}" alt="Video prototype background">
      <div class="gradient"></div>

      <div class="video-info">
        <div class="username">${v.user}</div>
        <div class="caption">${v.caption}</div>
        <div class="music">${v.music}</div>
      </div>

      <div class="side-actions">
        <div class="avatar">M</div>

        <button class="action like-btn" data-index="${i}">
          ♡
          <small class="like-count">${formatNumber(v.likes)}</small>
        </button>

        <button class="action comment-btn" data-index="${i}">
          💬
          <small>${formatNumber(v.comments)}</small>
        </button>

        <button class="action share-btn" data-index="${i}">
          ↗
          <small>${formatNumber(v.shares)}</small>
        </button>
      </div>
    </article>
  `).join("");
}

function openModal(title, text) {
  modalTitle.textContent = title;
  modalText.textContent = text;
  modal.classList.remove("hidden");
}

document.addEventListener("click", (e) => {
  const like = e.target.closest(".like-btn");
  const comment = e.target.closest(".comment-btn");
  const share = e.target.closest(".share-btn");
  const nav = e.target.closest(".nav-item");

  if (like) {
    const index = Number(like.dataset.index);
    const count = like.querySelector(".like-count");

    if (!like.classList.contains("liked")) {
      videos[index].likes++;
      like.classList.add("liked");
      like.firstChild.textContent = "♥";
    } else {
      videos[index].likes--;
      like.classList.remove("liked");
      like.firstChild.textContent = "♡";
    }

    count.textContent = formatNumber(videos[index].likes);
  }

  if (comment) {
    openModal("Comments", "Comments panel — ready to be connected to a real database.");
  }

  if (share) {
    openModal("Share", "Share menu — this prototype can later connect to TikTok-style sharing.");
  }

  if (nav) {
    document.querySelectorAll(".nav-item").forEach(x => x.classList.remove("active"));
    nav.classList.add("active");

    const action = nav.dataset.action;
    if (action !== "home") {
      openModal(action.charAt(0).toUpperCase() + action.slice(1),
        `${action} page is a prototype placeholder.`);
    }
  }
});

document.getElementById("createBtn").onclick = () =>
  openModal("Create video", "Upload, record, add music, captions and effects here.");

document.getElementById("searchBtn").onclick = () =>
  openModal("Search", "Search users, hashtags and videos here.");

document.getElementById("loginBtn").onclick = () =>
  openModal("Log in", "A real authentication form can be added here.");

document.getElementById("closeModal").onclick = () =>
  modal.classList.add("hidden");

modal.addEventListener("click", e => {
  if (e.target === modal) modal.classList.add("hidden");
});

renderFeed();
