const content = document.querySelector("#content");

const pages = {
  start: {
    title: "Start Here",
    file: "./START-HERE.md",
  },

  "01-map": {
    title: "01 · Build the Map",
    file: "./01-map.md",
    checkpoint: "../checkpoints/01-map/",
  },

  "02-data": {
    title: "02 · Load Geographic Data",
    file: "./02-data.md",
    checkpoint: "../checkpoints/02-data/",
  },

  "03-ui": {
    title: "03 · Build the Sidebar UI",
    file: "./03-ui.md",
    checkpoint: "../checkpoints/03-ui/",
  },

  "04-selection": {
    title: "04 · Synchronize Selection",
    file: "./04-selection.md",
    checkpoint: "../checkpoints/04-selection/",
  },

  "05-filtering": {
    title: "05 · Filter Shared State",
    file: "./05-filtering.md",
    checkpoint: "../checkpoints/05-filtering/",
  },

  "06-polish": {
    title: "06 · Polish the Application",
    file: "./06-polish.md",
    checkpoint: "../checkpoints/06-polish/",
  },

  "07-refactor": {
    title: "07 · Refactor Into Modules",
    file: "./07-refactor.md",
    checkpoint: "../checkpoints/07-complete/",
  },

  "08-favorites": {
    title: "08 · Add Favorites",
    file: "./08-favorites.md",
    checkpoint: "../checkpoints/08-favorites/",
  },

  customize: {
    title: "Make It Yours",
    file: "./CUSTOMIZE.md",
  },

  troubleshooting: {
    title: "Troubleshooting",
    file: "./troubleshooting.md",
  },

  geocoding: {
    title: "ArcGIS Geocoding",
    file: "./extensions/geocoding.md",
  },

  drawing: {
    title: "Draw & Export",
    file: "./extensions/drawing.md",
  },

  "feature-layer": {
    title: "ArcGIS Feature Layer",
    file: "./extensions/feature-layer.md",
  },
};

const coreSequence = [
  "start",
  "01-map",
  "02-data",
  "03-ui",
  "04-selection",
  "05-filtering",
  "06-polish",
  "07-refactor",
  "08-favorites",
];

function setActiveLink(pageKey) {
  document.querySelectorAll("[data-page]").forEach((link) => {
    const isActive = link.dataset.page === pageKey;

    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function createPageLink(pageKey, direction) {
  const page = pages[pageKey];

  if (!page) {
    return "";
  }

  const isPrevious = direction === "previous";

  return `
    <a
      class="page-nav__link ${
        isPrevious ? "page-nav__link--previous" : "page-nav__link--next"
      }"
      href="#${pageKey}"
    >
      <span class="page-nav__direction">
        ${isPrevious ? "← Previous" : "Next →"}
      </span>

      <strong>
        ${page.title}
      </strong>
    </a>
  `;
}

function createPageNavigation(pageKey) {
  const currentIndex = coreSequence.indexOf(pageKey);

  if (currentIndex === -1) {
    return "";
  }

  const previousPageKey = coreSequence[currentIndex - 1];
  const nextPageKey = coreSequence[currentIndex + 1];

  let previousLink = "<span></span>";
  let nextLink = "";

  if (previousPageKey) {
    previousLink = createPageLink(previousPageKey, "previous");
  }

  if (nextPageKey) {
    nextLink = createPageLink(nextPageKey, "next");
  } else {
    nextLink = `
      <a
        class="page-nav__link page-nav__link--next"
        href="#customize"
      >
        <span class="page-nav__direction">
          Core complete 🎉
        </span>

        <strong>
          Make It Yours
        </strong>
      </a>
    `;
  }

  return `
    <nav
      class="page-nav"
      aria-label="Workshop page navigation"
    >
      ${previousLink}

      ${nextLink}
    </nav>
  `;
}

/*
  Adds the checkpoint recovery box near the bottom
  of a core workshop page.

  If the Markdown contains a "Next" heading, the
  checkpoint is inserted immediately before it.

  If there is a divider before "Next", the checkpoint
  is inserted before that divider so the visual flow is:

  Check Your Work
  checkpoint
  divider
  Next
*/
function insertCheckpointBanner(page) {
  if (!page.checkpoint) {
    return;
  }

  const banner = document.createElement("aside");
  banner.className = "checkpoint-banner";

  const text = document.createElement("div");

  const title = document.createElement("strong");
  title.textContent = "Need a clean checkpoint?";

  const description = document.createElement("p");
  description.textContent =
    "Open the completed version for this stage and keep moving.";

  text.appendChild(title);
  text.appendChild(description);

  const link = document.createElement("a");

  link.className = "checkpoint-banner__link";
  link.href = page.checkpoint;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = "Open checkpoint ↗";

  banner.appendChild(text);
  banner.appendChild(link);

  const nextHeading = Array.from(content.querySelectorAll("h1, h2")).find(
    (heading) => heading.textContent.trim().toLowerCase() === "next",
  );

  if (nextHeading) {
    const divider = nextHeading.previousElementSibling;

    if (divider && divider.tagName === "HR") {
      divider.insertAdjacentElement("beforebegin", banner);

      return;
    }

    nextHeading.insertAdjacentElement("beforebegin", banner);

    return;
  }

  const pageNavigation = content.querySelector(".page-nav");

  if (pageNavigation) {
    pageNavigation.insertAdjacentElement("beforebegin", banner);

    return;
  }

  content.appendChild(banner);
}

/*
  Creates predictable IDs for Markdown headings.

  Example:

  "Quick Diagnostic Checklist"

  becomes:

  quick-diagnostic-checklist
*/
function slugifyHeading(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[`'"]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/*
  Makes links such as:

  #quick-diagnostic-checklist

  scroll inside the current Markdown page instead of being
  interpreted as workshop navigation.
*/
function setupInPageLinks() {
  const headings = content.querySelectorAll("h1, h2, h3, h4, h5, h6");

  const usedIds = new Set();

  headings.forEach((heading) => {
    const baseId = heading.id || slugifyHeading(heading.textContent);

    if (!baseId) {
      return;
    }

    let uniqueId = baseId;
    let suffix = 2;

    while (usedIds.has(uniqueId)) {
      uniqueId = `${baseId}-${suffix}`;
      suffix += 1;
    }

    heading.id = uniqueId;
    usedIds.add(uniqueId);
  });

  content.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href").slice(1);

      if (!targetId) {
        return;
      }

      const target = document.getElementById(targetId);

      /*
          If the target exists inside the currently
          rendered Markdown page, scroll to it.

          Otherwise, leave the link alone so workshop
          routes such as #01-map still work normally.
        */
      if (target && content.contains(target)) {
        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

/*
  Copies text to the clipboard.

  navigator.clipboard is used when available.
  The fallback keeps the button working in more browsers.
*/
async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");

  textarea.value = text;
  textarea.setAttribute("readonly", "");

  textarea.style.position = "fixed";
  textarea.style.opacity = "0";

  document.body.appendChild(textarea);

  textarea.select();

  document.execCommand("copy");

  textarea.remove();
}

function setupCopyButtons() {
  const copyableLanguages = new Set([
    "language-js",
    "language-javascript",
    "language-html",
    "language-css",
    "language-json",
    "language-bash",
    "language-shell",
    "language-sh",
  ]);

  const codeBlocks = content.querySelectorAll("pre");

  codeBlocks.forEach((pre) => {
    const code = pre.querySelector("code");

    if (!code) {
      return;
    }

    const isCopyable = Array.from(code.classList).some((className) =>
      copyableLanguages.has(className),
    );

    if (!isCopyable) {
      return;
    }

    if (pre.closest(".code-block")) {
      return;
    }

    const wrapper = document.createElement("div");

    wrapper.className = "code-block";

    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const button = document.createElement("button");

    button.type = "button";
    button.className = "code-copy-button";
    button.textContent = "Copy";

    button.setAttribute("aria-label", "Copy code to clipboard");

    wrapper.appendChild(button);

    button.addEventListener("click", async () => {
      const originalText = button.textContent;

      try {
        await copyText(code.textContent);

        button.textContent = "Copied!";
        button.classList.add("is-copied");

        setTimeout(() => {
          button.textContent = originalText;
          button.classList.remove("is-copied");
        }, 1500);
      } catch (error) {
        console.error("Could not copy code:", error);

        button.textContent = "Copy failed";

        setTimeout(() => {
          button.textContent = originalText;
        }, 1500);
      }
    });
  });
}

/*
  Converts OPTIONAL-START / OPTIONAL-END comments in
  rendered Markdown into collapsed <details> sections.

  Example Markdown:

  <!-- OPTIONAL-START: ✨ Make It Yours -->

  Normal Markdown content here.

  <!-- OPTIONAL-END -->

  Marked renders the content normally first, then this
  function wraps those rendered nodes so code fences,
  lists, headings, and links keep their normal behavior.
*/
function setupOptionalSections() {
  const walker = document.createTreeWalker(content, NodeFilter.SHOW_COMMENT);

  const comments = [];

  while (walker.nextNode()) {
    comments.push(walker.currentNode);
  }

  const startPrefix = "OPTIONAL-START:";

  comments.forEach((startComment) => {
    const value = startComment.nodeValue.trim();

    if (!value.startsWith(startPrefix)) {
      return;
    }

    const title = value.slice(startPrefix.length).trim() || "Optional";

    let endComment = startComment.nextSibling;

    while (
      endComment &&
      !(
        endComment.nodeType === Node.COMMENT_NODE &&
        endComment.nodeValue.trim() === "OPTIONAL-END"
      )
    ) {
      endComment = endComment.nextSibling;
    }

    if (!endComment) {
      console.warn(`Optional section "${title}" is missing OPTIONAL-END.`);
      return;
    }

    const details = document.createElement("details");
    details.className = "optional-section";

    const summary = document.createElement("summary");
    summary.className = "optional-section__summary";

    const summaryText = document.createElement("strong");
    summaryText.textContent = title;

    summary.appendChild(summaryText);
    details.appendChild(summary);

    startComment.parentNode.insertBefore(details, startComment);

    while (
      startComment.nextSibling &&
      startComment.nextSibling !== endComment
    ) {
      details.appendChild(startComment.nextSibling);
    }

    startComment.remove();
    endComment.remove();
  });
}

/*
  Converts fenced ```activity JSON blocks in the Markdown
  into small interactive learning activities.

  Supported types:
  - multiple-choice
  - fill-blank
  - reveal

  Keeping the activity definition inside a fenced code block
  avoids putting large raw HTML structures in the Markdown.
*/
function setupActivities() {
  const activityBlocks = content.querySelectorAll(
    "pre > code.language-activity",
  );

  activityBlocks.forEach((code, index) => {
    let activity;

    try {
      activity = JSON.parse(code.textContent);
    } catch (error) {
      console.error("Could not parse workshop activity:", error);
      return;
    }

    const pre = code.parentElement;
    const card = document.createElement("section");

    card.className = `learning-activity learning-activity--${activity.type}`;

    const heading = document.createElement("div");
    heading.className = "learning-activity__heading";

    if (activity.eyebrow) {
      const eyebrow = document.createElement("p");
      eyebrow.className = "learning-activity__eyebrow";
      eyebrow.textContent = activity.eyebrow;
      heading.appendChild(eyebrow);
    }

    if (activity.title) {
      const title = document.createElement("strong");
      title.className = "learning-activity__title";
      title.textContent = activity.title;
      heading.appendChild(title);
    }

    card.appendChild(heading);

    if (activity.prompt) {
      const prompt = document.createElement("p");
      prompt.className = "learning-activity__prompt";
      prompt.textContent = activity.prompt;
      card.appendChild(prompt);
    }

    if (activity.context) {
      const contextBlock = document.createElement("pre");
      contextBlock.className = "learning-activity__context";
      contextBlock.textContent = activity.context;
      card.appendChild(contextBlock);
    }

    const controls = document.createElement("div");
    controls.className = "learning-activity__controls";

    const feedback = document.createElement("div");
    feedback.className = "learning-activity__feedback";
    feedback.setAttribute("role", "status");
    feedback.setAttribute("aria-live", "polite");
    feedback.hidden = true;

    function showFeedback(kind, message) {
      feedback.hidden = false;
      feedback.className = `learning-activity__feedback learning-activity__feedback--${kind}`;
      feedback.textContent = message;
    }

    if (activity.type === "multiple-choice") {
      const options = document.createElement("fieldset");
      options.className = "learning-activity__options";

      const legend = document.createElement("legend");
      legend.className = "visually-hidden";
      legend.textContent =
        activity.prompt || activity.title || "Choose an answer";
      options.appendChild(legend);

      const groupName = `activity-${window.location.hash.slice(1) || "start"}-${index}`;

      (activity.options || []).forEach((option) => {
        const label = document.createElement("label");
        label.className = "learning-activity__option";

        const input = document.createElement("input");
        input.type = "radio";
        input.name = groupName;
        input.value = option.value;

        const text = document.createElement("span");
        text.textContent = `${option.value}. ${option.label}`;

        label.append(input, text);
        options.appendChild(label);
      });

      card.appendChild(options);

      const button = document.createElement("button");
      button.type = "button";
      button.className = "learning-activity__button";
      button.textContent = activity.buttonLabel || "Check answer";

      button.addEventListener("click", () => {
        const selected = options.querySelector('input[type="radio"]:checked');

        if (!selected) {
          showFeedback("notice", "Choose an answer first.");
          return;
        }

        if (selected.value === activity.correct) {
          card.classList.add("is-correct");
          showFeedback("correct", activity.success || "Correct!");
          return;
        }

        card.classList.remove("is-correct");
        showFeedback(
          "incorrect",
          activity.hint || "Not quite. Try another answer.",
        );
      });

      options.addEventListener("change", () => {
        if (
          feedback.classList.contains("learning-activity__feedback--incorrect")
        ) {
          feedback.hidden = true;
        }
      });

      controls.appendChild(button);
    } else if (activity.type === "fill-blank") {
      const label = document.createElement("label");
      label.className = "learning-activity__input-label";
      label.textContent = activity.inputLabel || "Your answer";

      const input = document.createElement("input");
      input.type = "text";
      input.className = "learning-activity__input";
      input.placeholder = activity.placeholder || "Type your answer";
      input.autocomplete = "off";
      input.spellcheck = false;

      label.appendChild(input);
      card.appendChild(label);

      const button = document.createElement("button");
      button.type = "button";
      button.className = "learning-activity__button";
      button.textContent = activity.buttonLabel || "Check answer";

      const normalizeAnswer = (value) =>
        value.trim().toLowerCase().replace(/\s+/g, "");

      const checkAnswer = () => {
        const value = input.value.trim();

        if (!value) {
          showFeedback("notice", "Type an answer first.");
          return;
        }

        const acceptedAnswers = (activity.answers || []).map(normalizeAnswer);
        const isCorrect = acceptedAnswers.includes(normalizeAnswer(value));

        if (isCorrect) {
          card.classList.add("is-correct");
          showFeedback("correct", activity.success || "Correct!");
          return;
        }

        card.classList.remove("is-correct");
        showFeedback("incorrect", activity.hint || "Not quite. Try again.");
      };

      button.addEventListener("click", checkAnswer);

      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          checkAnswer();
        }
      });

      input.addEventListener("input", () => {
        if (
          feedback.classList.contains("learning-activity__feedback--incorrect")
        ) {
          feedback.hidden = true;
        }
      });

      controls.appendChild(button);
    } else if (activity.type === "reveal") {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "learning-activity__button";
      button.textContent = activity.buttonLabel || "Reveal answer";

      button.addEventListener("click", () => {
        showFeedback("reveal", activity.answer || "");
        button.disabled = true;
        button.textContent = "Revealed";
      });

      controls.appendChild(button);
    } else {
      console.warn("Unknown workshop activity type:", activity.type);
      return;
    }

    card.appendChild(controls);
    card.appendChild(feedback);

    pre.replaceWith(card);
  });
}

async function loadPage() {
  let pageKey = window.location.hash.slice(1) || "start";

  if (!pages[pageKey]) {
    pageKey = "start";
  }

  const page = pages[pageKey];

  setActiveLink(pageKey);

  content.innerHTML = "<p>Loading...</p>";

  try {
    const response = await fetch(page.file);

    if (!response.ok) {
      throw new Error(`Could not load ${page.file}: HTTP ${response.status}`);
    }

    const markdown = await response.text();

    const pageNavigation = createPageNavigation(pageKey);

    content.innerHTML = `
      ${marked.parse(markdown)}

      ${pageNavigation}
    `;

    /*
      Markdown task-list checkboxes are disabled by
      default by Marked. Let attendees use them as
      progress checks.
    */
    content.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      checkbox.disabled = false;
    });

    /*
      Add the checkpoint only after the Markdown has
      rendered so it can be placed directly before
      the page's Next section.
    */
    insertCheckpointBanner(page);

    /*
      Set up features that depend on the rendered
      Markdown HTML.
    */
    setupOptionalSections();
    setupActivities();
    setupInPageLinks();
    setupCopyButtons();

    document.title = `${page.title} | Build Your Own City Explorer`;

    window.scrollTo(0, 0);
  } catch (error) {
    console.error(error);

    content.innerHTML = `
      <div class="page-error">
        <h1>Page not available</h1>

        <p>
          This section could not be loaded.
          Check the browser Console for details.
        </p>

        <p>
          You can also open
          <a href="#troubleshooting">
            Troubleshooting
          </a>.
        </p>
      </div>
    `;
  }
}

window.addEventListener("hashchange", loadPage);

loadPage();
