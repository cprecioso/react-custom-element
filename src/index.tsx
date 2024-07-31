import type { ComponentType, ReactNode } from "react";
import { type Root, type RootOptions, createRoot } from "react-dom/client";

/**
 * Turns a React component into a DOM Custom Element.
 *
 * @remark You probably will want to `customElements.define()`
 * in order to use it in your HTML.
 */
export const createCustomElement = <
  const PropNamesArray extends readonly Exclude<string, "children">[],
>(
  /**
   * An array of the attributes that your custom element
   * will accept and react to.
   */
  propNames: PropNamesArray,

  /**
   * Your React component. It will get the props declared in the `propNames`
   * argument, and any updates to them.
   *
   * It will also get a `children` prop with the `<slot>` component.
   */
  Component: ComponentType<
    { [PropName in PropNamesArray[number]]?: string | undefined } & {
      children: ReactNode;
    }
  >,

  /**
   * Any options you want to pass to the DOM's `attachShadow` and
   * React's `createRoot`.
   */
  {
    shadowRootOptions = { mode: "open" },
    reactRootOptions,
  }: {
    shadowRootOptions?: ShadowRootInit;
    reactRootOptions?: RootOptions;
  } = {},
): CustomElementConstructor => {
  type PropName = PropNamesArray[number];

  const ComponentDisplayName =
    Component.displayName || Component.name || "React";

  class ReactCustomElement extends HTMLElement {
    static observedAttributes = propNames;
    static displayName = `${ComponentDisplayName}CustomElement`;

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

  return ReactCustomElement;
};
