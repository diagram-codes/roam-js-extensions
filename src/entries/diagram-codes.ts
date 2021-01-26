import { createButtonObserver, runExtension } from "../entry-helpers";
import { render } from "../components/DiagramCodes";

runExtension("diagram-codes", () => {
    createButtonObserver({
        shortcut: "diagram-codes",
        attribute: "diagram-codes",
        render: (b: HTMLButtonElement) =>
          render({
            blockId: b.closest(".roam-block").id,
            parent: b.parentElement,
          }),
      });
});
