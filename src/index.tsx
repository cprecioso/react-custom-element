import { ComponentType, ReactNode } from "react";
import { Root, RootOptions, createRoot } from "react-dom/client";

export const createCustomElement = <
  const PropNamesArray extends readonly Exclude<string, "children">[],
>(
  propNames: PropNamesArray,
  Component: ComponentType<
    { [PropName in PropNamesArray[number]]?: string | undefined } & {
      children: ReactNode;
    }
  >,
  {
    shadowRootOptions = { mode: "open" },
    reactRootOptions,
  }: {
    shadowRootOptions?: ShadowRootInit;
    reactRootOptions?: RootOptions;
  } = {},
): CustomElementConstructor => {
  type PropName = PropNamesArray[number];

  class ReactCustomElement extends HTMLElement {
    static observedAttributes = propNames;

    #reactRoot?: Root;
    #props = new Map<PropName, string | undefined>();

    #render() {
      this.#reactRoot?.render(
        // @ts-expect-error Object.fromEntries isn't fully typed
        <Component {...Object.fromEntries(this.#props)}>
          <slot />
        </Component>,
      );
    }

    connectedCallback() {
      const shadowRoot = this.attachShadow(shadowRootOptions);
      this.#reactRoot = createRoot(shadowRoot, reactRootOptions);
      this.#render();
    }

    disconnectedCallback() {
      this.#reactRoot?.unmount();
      this.#reactRoot = undefined;
    }

    attributeChangedCallback(
      name: PropName,
      oldValue: string | undefined,
      newValue: string | undefined,
    ) {
      this.#props.set(name, newValue);
      this.#render();
    }
  }

  const displayName = Component.displayName || Component.name;
  if (displayName) Object.assign(ReactCustomElement, { displayName });

  return ReactCustomElement;
};
