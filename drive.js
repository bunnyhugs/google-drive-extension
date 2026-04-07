window.addEventListener("load", setupListener);

function setupListener() {
  let expanderClicked = new Set(); // track per ID

  const IDS = ["nt:Drive", "nt:Driv"];

  // const log = (...args) => console.log("[ext]", ...args);
  const log = (...args) => {};

  const tryClickExpander = (contextNode) => {
    for (const id of IDS) {
      if (expanderClicked.has(id)) continue;

      let root = null;

      // Direct match
      if (contextNode.id === id) {
        root = contextNode;
        log(`Found #${id} directly`);
      }
      // Inside added node
      else if (contextNode.querySelector) {
        root = contextNode.querySelector(`#${CSS.escape(id)}`);
        if (root) log(`Found #${id} inside node`);
      }

      // Fallback
      if (!root) {
        root = document.getElementById(id);
        if (root) log(`Found #${id} via document`);
      }

      if (!root) {
        log(`No #${id} yet`);
        continue;
      }

      const expanded = root.getAttribute("aria-expanded");
      log(`#${id} aria-expanded =`, expanded);

      if (expanded === "true") {
        log(`Skipping #${id}; already expanded`);
        expanderClicked.add(id);
        continue;
      }

      let expander = null;

      if (contextNode.matches?.('div[data-target="expander"]')) {
        expander = contextNode;
        log(`Expander is node for #${id}`);
      } else {
        expander = root.querySelector('div.a-U-J > div[data-target="expander"]');
        if (expander) log(`Found expander for #${id}`);
      }

      if (!expander) {
        log(`Expander not found for #${id}`);
        continue;
      }

      log(`Clicking expander for #${id}`);
      expander.click();
      expanderClicked.add(id);
    }
  };

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {

      for (const node of mutation.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;

        // Existing logic
        if (node.matches('div.a-X-k')) {
          log("Matched a-X-k dialog");
          const btn = node.querySelector('button.h-De-Vb.h-De-Y.a-X-d');
          if (btn) {
            log("Clicking button in a-X-k");
            btn.click();
          }

          if (node.previousSibling) node.previousSibling.remove();
          node.remove();
        }

        else if (node.matches('div.lb-k.g-ge')) {
          log("Matched lb-k dialog");
          const btn = node.querySelector('button.h-De-Vb.h-De-Y');
          if (btn) {
            log("Clicking button in lb-k");
            btn.click();
          }

          if (node.previousSibling) node.previousSibling.remove();
          node.remove();
        }

        // Expander logic
        tryClickExpander(node);
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["aria-expanded"],
  });

  log("Initial check");
  tryClickExpander(document.body);
}
