const initializedAccordions = new WeakSet();

export function initAccordions() {
  document.querySelectorAll("[data-accordion]").forEach((accordion) => {
    if (initializedAccordions.has(accordion)) {
      return;
    }

    const mode = accordion.dataset.accordion;

    if (mode !== "single" && mode !== "multiple") {
      console.warn('Accordion: use data-accordion="single" or "multiple".');
      return;
    }

    const items = [];

    accordion
      .querySelectorAll(":scope > .accordion__item")
      .forEach((element) => {
        const trigger = element.querySelector(
          ":scope > .accordion__heading > .accordion__trigger",
        );

        const panel = element.querySelector(":scope > .accordion__panel");

        if (
          !trigger ||
          !panel ||
          !panel.id ||
          trigger.getAttribute("aria-controls") !== panel.id
        ) {
          console.warn(
            "Accordion: check the trigger and panel markup.",
            element,
          );
          return;
        }

        items.push({
          trigger,
          panel,
          animation: null,
          initialOverflow: panel.style.overflow,
        });
      });

    let hasExpandedItem = false;

    items.forEach((item) => {
      let expanded = item.trigger.getAttribute("aria-expanded") === "true";

      if (mode === "single" && expanded && hasExpandedItem) {
        expanded = false;
      }

      if (expanded) {
        hasExpandedItem = true;
      }

      updateExpandedState(item, expanded);
      item.panel.hidden = !expanded;

      item.trigger.addEventListener("click", () => {
        const shouldExpand =
          item.trigger.getAttribute("aria-expanded") !== "true";

        if (shouldExpand && mode === "single") {
          items.forEach((otherItem) => {
            if (
              otherItem !== item &&
              otherItem.trigger.getAttribute("aria-expanded") === "true"
            ) {
              setExpanded(otherItem, false, accordion);
            }
          });
        }

        setExpanded(item, shouldExpand, accordion);
      });
    });

    initializedAccordions.add(accordion);
  });
}

function setExpanded(item, expanded, accordion) {
  const { trigger, panel } = item;

  const startHeight = panel.hidden ? 0 : panel.getBoundingClientRect().height;

  if (item.animation) {
    item.animation.onfinish = null;
    item.animation.cancel();
    item.animation = null;
  }

  if (!expanded && panel.contains(document.activeElement)) {
    trigger.focus();
  }

  updateExpandedState(item, expanded);
  panel.hidden = false;

  const endHeight = expanded ? panel.getBoundingClientRect().height : 0;

  const styles = getComputedStyle(accordion);
  const configuredDuration = Number(
    styles.getPropertyValue("--accordion-duration").trim(),
  );
  const easing = styles.getPropertyValue("--accordion-easing").trim() || "ease";

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const duration = reducedMotion
    ? 0
    : Number.isFinite(configuredDuration)
      ? Math.max(0, configuredDuration)
      : 250;

  function finish() {
    panel.hidden = !expanded;
    panel.style.overflow = item.initialOverflow;

    if (item.animation) {
      item.animation.onfinish = null;
      item.animation.cancel();
      item.animation = null;
    }
  }

  if (duration === 0 || startHeight === endHeight) {
    finish();
    return;
  }

  panel.style.overflow = "hidden";

  item.animation = panel.animate(
    [{ height: `${startHeight}px` }, { height: `${endHeight}px` }],
    {
      duration,
      easing,
      fill: "both",
    },
  );

  item.animation.onfinish = finish;
}

function updateExpandedState(item, expanded) {
  item.trigger.setAttribute("aria-expanded", String(expanded));
  item.panel.inert = !expanded;
}
