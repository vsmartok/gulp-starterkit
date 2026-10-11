let activeModal = null;
let initialized = false;
let scrollLock = null;
let openRequest = 0;

function lockPageScroll() {
  if (scrollLock) {
    return;
  }

  const root = document.documentElement;
  const body = document.body;

  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const scrollbarWidth = window.innerWidth - root.clientWidth;
  const bodyPaddingRight = parseFloat(getComputedStyle(body).paddingRight);

  const savedStyles = [
    [root, ["overflow", "scroll-behavior"]],
    [body, ["position", "top", "left", "width", "padding-right"]],
  ].flatMap(([element, properties]) =>
    properties.map((property) => ({
      element,
      property,
      value: element.style.getPropertyValue(property),
      priority: element.style.getPropertyPriority(property),
    })),
  );

  scrollLock = { scrollX, scrollY, savedStyles };

  root.style.setProperty("overflow", "hidden");

  body.style.setProperty("position", "fixed");
  body.style.setProperty("top", `${-scrollY}px`);
  body.style.setProperty("left", `${-scrollX}px`);
  body.style.setProperty("width", "100%");

  if (scrollbarWidth > 0) {
    body.style.setProperty(
      "padding-right",
      `${bodyPaddingRight + scrollbarWidth}px`,
    );
  }
}

function unlockPageScroll() {
  if (!scrollLock) {
    return;
  }

  const root = document.documentElement;
  const { scrollX, scrollY, savedStyles } = scrollLock;

  savedStyles.forEach(({ element, property, value, priority }) => {
    if (value) {
      element.style.setProperty(property, value, priority);
    } else {
      element.style.removeProperty(property);
    }
  });

  const savedScrollBehavior = savedStyles.find(
    ({ element, property }) =>
      element === root && property === "scroll-behavior",
  );

  root.style.setProperty("scroll-behavior", "auto", "important");
  window.scrollTo(scrollX, scrollY);

  if (savedScrollBehavior.value) {
    root.style.setProperty(
      "scroll-behavior",
      savedScrollBehavior.value,
      savedScrollBehavior.priority,
    );
  } else {
    root.style.removeProperty("scroll-behavior");
  }

  scrollLock = null;
}

function cancelModalAnimations(state) {
  state.animations.forEach((animation) => animation.cancel());
  state.animations = [];
}

async function animateModal(state, opening) {
  const modal = state.element;
  const modalWindow = modal.querySelector(":scope > .modal__window");

  const styles = getComputedStyle(modal);
  const windowStyles = getComputedStyle(modalWindow);
  const interrupted = state.animations.length > 0;

  const offset = styles.getPropertyValue("--modal-offset").trim() || "1rem";
  const backdropColor = styles
    .getPropertyValue("--modal-backdrop-color")
    .trim();

  const startBackground =
    opening && !interrupted ? "transparent" : styles.backgroundColor;

  const startOpacity = opening && !interrupted ? "0" : windowStyles.opacity;

  const startTransform =
    opening && !interrupted ? `translateY(${offset})` : windowStyles.transform;

  cancelModalAnimations(state);

  const durationValue = styles.getPropertyValue("--modal-duration").trim();
  const configuredDuration = durationValue === "" ? 250 : Number(durationValue);

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const duration = reducedMotion
    ? 0
    : Number.isFinite(configuredDuration)
      ? Math.max(0, configuredDuration)
      : 250;

  const easing = styles.getPropertyValue("--modal-easing").trim() || "ease";

  if (duration === 0) {
    return true;
  }

  const options = {
    duration,
    easing,
    fill: "both",
  };

  const animations = [
    modal.animate(
      [
        { backgroundColor: startBackground },
        { backgroundColor: opening ? backdropColor : "transparent" },
      ],
      options,
    ),
    modalWindow.animate(
      [
        { opacity: startOpacity, transform: startTransform },
        {
          opacity: opening ? "1" : "0",
          transform: opening ? "none" : `translateY(${offset})`,
        },
      ],
      options,
    ),
  ];

  state.animations = animations;

  const results = await Promise.allSettled(
    animations.map((animation) => animation.finished),
  );

  return (
    state.animations === animations &&
    results.every((result) => result.status === "fulfilled")
  );
}

async function openModal(modal, trigger) {
  if (activeModal?.element === modal && !activeModal.closing) {
    return;
  }

  if (!modal.querySelector(":scope > .modal__window")) {
    console.warn("Modal: missing .modal__window.", modal);
    return;
  }

  const request = ++openRequest;

  const returnFocus = activeModal?.element.contains(trigger)
    ? activeModal.returnFocus
    : trigger;

  if (activeModal) {
    await closeModal({
      restoreFocus: false,
      unlockScroll: false,
    });
  }

  if (request !== openRequest) {
    return;
  }

  lockPageScroll();

  const state = {
    element: modal,
    returnFocus,
    animations: [],
    closing: false,
    closePromise: null,
    closeOptions: null,
  };

  activeModal = state;
  modal.showModal();

  const completed = await animateModal(state, true);

  if (completed && activeModal === state && !state.closing) {
    cancelModalAnimations(state);
  }
}

function closeModal({ restoreFocus = true, unlockScroll = true } = {}) {
  if (!activeModal) {
    return Promise.resolve();
  }

  const state = activeModal;

  if (state.closing) {
    state.closeOptions.restoreFocus &&= restoreFocus;
    state.closeOptions.unlockScroll &&= unlockScroll;

    return state.closePromise;
  }

  state.closing = true;
  state.closeOptions = { restoreFocus, unlockScroll };

  state.closePromise = (async () => {
    const completed = state.element.open
      ? await animateModal(state, false)
      : true;

    if (!completed || activeModal !== state) {
      return;
    }

    activeModal = null;

    if (state.element.open) {
      state.element.close();
    }

    cancelModalAnimations(state);

    if (state.closeOptions.unlockScroll) {
      unlockPageScroll();
    }

    if (state.closeOptions.restoreFocus && state.returnFocus?.isConnected) {
      state.returnFocus.focus({ preventScroll: true });
    }
  })();

  return state.closePromise;
}

export function initModals() {
  if (initialized) {
    return;
  }

  document.querySelectorAll("dialog.modal").forEach((modal) => {
    let backdropPress = false;

    modal.addEventListener("pointerdown", (event) => {
      backdropPress =
        event.isPrimary && event.button === 0 && event.target === modal;
    });

    modal.addEventListener("pointerup", (event) => {
      backdropPress = backdropPress && event.target === modal;
    });

    modal.addEventListener("pointercancel", () => {
      backdropPress = false;
    });

    modal.addEventListener("click", (event) => {
      const shouldClose = backdropPress && event.target === modal;
      backdropPress = false;

      if (
        shouldClose &&
        activeModal?.element === modal &&
        modal.dataset.modalCloseOnBackdrop !== "false"
      ) {
        closeModal();
      }
    });

    modal.addEventListener("cancel", (event) => {
      event.preventDefault();

      if (activeModal?.element === modal) {
        closeModal();
      }
    });

    modal.addEventListener("close", () => {
      if (activeModal?.element === modal && !modal.open) {
        closeModal();
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const openButton = event.target.closest("[data-modal-open]");
    if (openButton) {
      const modal = document.getElementById(openButton.dataset.modalOpen);

      if (!(modal instanceof HTMLDialogElement) || !modal.matches(".modal")) {
        console.warn("Modal: check the target dialog ID.", openButton);
        return;
      }

      openModal(modal, openButton);
      return;
    }

    const closeButton = event.target.closest("[data-modal-close]");
    if (
      closeButton &&
      activeModal?.element === closeButton.closest("dialog.modal")
    ) {
      closeModal();
    }
  });

  initialized = true;
}
