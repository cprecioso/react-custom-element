import { render } from "@testing-library/react";
import { within } from "shadow-dom-testing-library";
import { test } from "vitest";
import { createCustomElement } from "..";
import { define } from "./util";

test("renders", () => {
  const CustomElement = define(createCustomElement([], () => <p>Hello</p>));
  const { container } = render(<CustomElement />);
  within(container).getByShadowText("Hello");
});

test("passes props", () => {
  const CustomElement = define(
    createCustomElement(["name"], ({ name }) => <p>Hello {name}</p>),
  );
  const { container } = render(<CustomElement name="Carlos" />);
  within(container).getByShadowText("Hello Carlos");
});

test("reacts on prop change", () => {
  const CustomElement = define(
    createCustomElement(["name"], ({ name }) => <p>Hello {name}</p>),
  );
  const { container, rerender } = render(<CustomElement name="Carlos" />);
  within(container).getByShadowText("Hello Carlos");
  rerender(<CustomElement name="Pepe" />);
  within(container).getByShadowText("Hello Pepe");
});

test("passes slot as child", () => {
  const CustomElement = define(
    createCustomElement([], ({ children }) => <p>Hello {children}</p>),
  );
  const { container } = render(<CustomElement>Carlos</CustomElement>);
  within(container).getByShadowText("Hello");
  within(container).getByText("Carlos");
});
