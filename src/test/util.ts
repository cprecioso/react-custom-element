import { fromAny } from "@total-typescript/shoehorn";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "custom-element-not-real": any;
    }
  }
}

let i = 0;
export const define = (
  customElement: CustomElementConstructor,
): "custom-element-not-real" => {
  const name = `custom-element-${i++}`;
  customElements.define(name, customElement);
  return fromAny(name);
};
