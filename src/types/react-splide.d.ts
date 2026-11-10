declare module "@splidejs/react-splide" {
  import type {
    Options,
    Splide as SplideCore,
  } from "@splidejs/splide";
  import { Component } from "react";
  import type {
    ComponentPropsWithoutRef,
    ComponentType,
    HTMLAttributes,
    ReactNode,
  } from "react";

  export interface SplideProps extends HTMLAttributes<HTMLElement> {
    options?: Options;
    hasTrack?: boolean;
    tag?: "div" | "section" | "header" | "footer" | "nav";
    children?: ReactNode;
    onMove?: (
      splide: SplideCore,
      newIndex: number,
      previousIndex: number,
      destinationIndex: number,
    ) => void;
  }

  export class Splide extends Component<SplideProps> {
    splide?: SplideCore;
    go(control: number | string): void;
  }

  export const SplideSlide: ComponentType<ComponentPropsWithoutRef<"li">>;
}
