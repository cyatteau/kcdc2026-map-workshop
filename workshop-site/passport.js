const SUPABASE_URL =
  "https://bvgbibcsnsiasndhgzrm.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_WplcQuzoiMJKYxd12LdH3Q_09YtvnOj";


const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    },
  );


let currentUser = null;

let currentProfile = null;


/*
  Build the Passport UI.
*/
function createPassportUI() {
  if (
    document.querySelector(
      "#explorer-passport",
    )
  ) {
    return;
  }


  const sidebar =
    document.querySelector(
      ".site-sidebar",
    );


  if (!sidebar) {
    console.error(
      "Could not find .site-sidebar",
    );

    return;
  }


  const passport =
    document.createElement(
      "section",
    );

  passport.id =
    "explorer-passport";

  passport.className =
    "explorer-passport";

  passport.innerHTML = `
    <p class="passport-eyebrow">
      🗺️ Explorer Passport
    </p>

    <div class="passport-row">
      <strong id="passport-name">
        Explorer
      </strong>

      <span id="passport-points">
        ⭐ 0
      </span>
    </div>

    <button
      id="leaderboard-button"
      class="passport-button"
      type="button"
    >
      🏆 Leaderboard
    </button>
  `;


  const nav =
    sidebar.querySelector(
      ".site-nav",
    );


  if (nav) {
    sidebar.insertBefore(
      passport,
      nav,
    );
  } else {
    sidebar.appendChild(
      passport,
    );
  }


  createNameModal();

  createToast();

  createLeaderboardModal();
}


/*
  First-visit name modal.
*/
function createNameModal() {
  const overlay =
    document.createElement(
      "div",
    );

  overlay.id =
    "passport-modal";

  overlay.className =
    "passport-modal";

  overlay.hidden = true;

  overlay.innerHTML = `
    <div
      class="passport-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="passport-dialog-title"
    >
      <p class="passport-dialog__eyebrow">
        KCDC 2026
      </p>

      <h2 id="passport-dialog-title">
        Welcome, Explorer! 🗺️
      </h2>

      <p>
        Pick a workshop nickname.
        You'll use it for discoveries
        and the leaderboard.
      </p>

      <p class="passport-dialog__hint">
        A nickname is perfect.
        No personal information needed.
      </p>

      <form id="passport-name-form">
        <label for="explorer-name">
          Explorer name
        </label>

        <input
          id="explorer-name"
          name="explorer-name"
          maxlength="30"
          minlength="2"
          autocomplete="off"
          required
          placeholder="NullIslandNinja"
        />

        <button type="submit">
          Start Exploring
        </button>
      </form>

      <p
        id="passport-form-error"
        class="passport-error"
        aria-live="polite"
      ></p>
    </div>
  `;

  document.body.appendChild(
    overlay,
  );


  const form =
    overlay.querySelector(
      "#passport-name-form",
    );

  form.addEventListener(
    "submit",
    handleNameSubmit,
  );
}


/*
  Toast shown after a discovery.
*/
function createToast() {
  const toast =
    document.createElement(
      "aside",
    );

  toast.id =
    "discovery-toast";

  toast.className =
    "discovery-toast";

  toast.hidden = true;

  toast.setAttribute(
    "aria-live",
    "polite",
  );

  document.body.appendChild(
    toast,
  );
}


/*
  Leaderboard modal.
*/
function createLeaderboardModal() {
  const overlay =
    document.createElement(
      "div",
    );

  overlay.id =
    "leaderboard-modal";

  overlay.className =
    "passport-modal";

  overlay.hidden = true;

  overlay.innerHTML = `
    <div
      class="passport-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="leaderboard-title"
    >
      <button
        id="leaderboard-close"
        class="dialog-close"
        type="button"
        aria-label="Close leaderboard"
      >
        ×
      </button>

      <p class="passport-dialog__eyebrow">
        KCDC 2026
      </p>

      <h2 id="leaderboard-title">
        🏆 Explorer Leaderboard
      </h2>

      <ol
        id="leaderboard-list"
        class="leaderboard-list"
      ></ol>
    </div>
  `;

  document.body.appendChild(
    overlay,
  );


  document
    .querySelector(
      "#leaderboard-button",
    )
    .addEventListener(
      "click",
      showLeaderboard,
    );


  overlay
    .querySelector(
      "#leaderboard-close",
    )
    .addEventListener(
      "click",
      () => {
        overlay.hidden = true;
      },
    );
}


/*
  Create or restore anonymous session.
*/
async function ensureUser() {
  const {
    data: {
      session,
    },
  } =
    await supabaseClient.auth
      .getSession();


  if (session?.user) {
    currentUser =
      session.user;

    return;
  }


  const {
    data,
    error,
  } =
    await supabaseClient.auth
      .signInAnonymously();


  if (error) {
    throw error;
  }


  currentUser =
    data.user;
}


/*
  Load existing nickname.
*/
async function loadProfile() {
  const {
    data,
    error,
  } =
    await supabaseClient
      .from("profiles")
      .select("display_name")
      .eq(
        "user_id",
        currentUser.id,
      )
      .maybeSingle();


  if (error) {
    throw error;
  }


  currentProfile = data;


  if (!currentProfile) {
    showNameModal();

    return;
  }


  updatePassportName(
    currentProfile.display_name,
  );
}


/*
  Show nickname modal.
*/
function showNameModal() {
  const modal =
    document.querySelector(
      "#passport-modal",
    );

  modal.hidden = false;


  window.setTimeout(
    () => {
      document
        .querySelector(
          "#explorer-name",
        )
        ?.focus();
    },
    0,
  );
}


/*
  Save nickname.
*/
async function handleNameSubmit(
  event,
) {
  event.preventDefault();


  const input =
    document.querySelector(
      "#explorer-name",
    );

  const errorElement =
    document.querySelector(
      "#passport-form-error",
    );


  const displayName =
    input.value.trim();


  if (
    displayName.length < 2
    ||
    displayName.length > 30
  ) {
    errorElement.textContent =
      "Use 2–30 characters.";

    return;
  }


  errorElement.textContent = "";


  const {
    error,
  } =
    await supabaseClient
      .from("profiles")
      .upsert({
        user_id:
          currentUser.id,

        display_name:
          displayName,
      });


  if (error) {
    console.error(error);

    errorElement.textContent =
      "Could not save your name. Try again.";

    return;
  }


  currentProfile = {
    display_name:
      displayName,
  };


  updatePassportName(
    displayName,
  );


  document.querySelector(
    "#passport-modal",
  ).hidden = true;
}


/*
  Update sidebar name.
*/
function updatePassportName(
  name,
) {
  document.querySelector(
    "#passport-name",
  ).textContent = name;
}


/*
  Read this user's claims and
  calculate current points.
*/
async function loadPoints() {
  const {
    data,
    error,
  } =
    await supabaseClient
      .from("claims")
      .select("points")
      .eq(
        "user_id",
        currentUser.id,
      );


  if (error) {
    throw error;
  }


  const total =
    (data || []).reduce(
      (
        sum,
        claim,
      ) =>
        sum + claim.points,
      0,
    );


  updatePoints(total);
}


/*
  Update sidebar point display.
*/
function updatePoints(
  points,
) {
  document.querySelector(
    "#passport-points",
  ).textContent =
    `⭐ ${points}`;
}


/*
  Claim one discovery.
*/
async function claimDiscovery(
  discoveryId,
) {
  const {
    data,
    error,
  } =
    await supabaseClient.rpc(
      "claim_discovery",
      {
        p_discovery_id:
          discoveryId,
      },
    );


  if (error) {
    console.error(error);

    showToast(
      "Hmm...",
      "That discovery could not be claimed.",
      false,
    );

    return;
  }


  const result =
    data?.[0];


  if (!result) {
    return;
  }


  updatePoints(
    result.total_points,
  );


  if (
    result.claim_status ===
    "already_claimed"
  ) {
    showToast(
      "Already found!",
      result.discovery_name,
      false,
    );

    return;
  }


  if (result.won_prize) {
    showToast(
      "🏆 INSTANT PRIZE!",
      `${result.discovery_name} · +${result.points_awarded} points · Show this screen to Courtney for ${result.prize_label}!`,
      true,
    );

    return;
  }


  showToast(
    "🎉 Discovery found!",
    `${result.discovery_name} · +${result.points_awarded} points`,
    false,
  );
}


/*
  Display toast.
*/
function showToast(
  title,
  message,
  prize,
) {
  const toast =
    document.querySelector(
      "#discovery-toast",
    );


  toast.innerHTML = "";


  const heading =
    document.createElement(
      "strong",
    );

  heading.textContent =
    title;


  const detail =
    document.createElement(
      "span",
    );

  detail.textContent =
    message;


  toast.append(
    heading,
    detail,
  );


  toast.classList.toggle(
    "is-prize",
    prize,
  );


  toast.hidden = false;


  window.clearTimeout(
    showToast.timeout,
  );


  showToast.timeout =
    window.setTimeout(
      () => {
        toast.hidden = true;
      },
      prize
        ? 12000
        : 5000,
    );
}


/*
  Leaderboard.
*/
async function showLeaderboard() {
  const modal =
    document.querySelector(
      "#leaderboard-modal",
    );

  const list =
    document.querySelector(
      "#leaderboard-list",
    );


  list.innerHTML =
    "<li>Loading...</li>";

  modal.hidden = false;


  const {
    data,
    error,
  } =
    await supabaseClient.rpc(
      "get_leaderboard",
    );


  if (error) {
    console.error(error);

    list.innerHTML =
      "<li>Could not load leaderboard.</li>";

    return;
  }


  list.innerHTML = "";


  data.forEach(
    (
      explorer,
      index,
    ) => {
      const item =
        document.createElement(
          "li",
        );

      const name =
        document.createElement(
          "span",
        );

      const points =
        document.createElement(
          "strong",
        );


      name.textContent =
        `${index + 1}. ${explorer.display_name}`;

      points.textContent =
        `${explorer.total_points} pts`;


      item.append(
        name,
        points,
      );


      list.appendChild(
        item,
      );
    },
  );
}


/*
  Discovery buttons are inside
  Markdown loaded dynamically.

  Event delegation means this still
  works after site.js replaces #content.
*/
document.addEventListener(
  "click",
  async (
    event,
  ) => {
    const button =
      event.target.closest(
        "[data-discovery-id]",
      );


    if (!button) {
      return;
    }


    if (!currentUser) {
      return;
    }


    button.disabled = true;


    await claimDiscovery(
      button.dataset
        .discoveryId,
    );


    button.disabled = false;
  },
);


/*
  Start Passport.
*/
async function initPassport() {
  try {
    createPassportUI();

    await ensureUser();

    await loadProfile();

    await loadPoints();
  } catch (error) {
    console.error(
      "Workshop Passport failed:",
      error,
    );
  }
}


initPassport();