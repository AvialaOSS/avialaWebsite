declare module "*.mdx" {
  import type { MDXProps } from "mdx/types";
  export default function MDXContent(props: MDXProps): JSX.Element;
}

declare module "./generated/props.json" {
  import type { PropsRegistry } from "./props-registry";
  const value: PropsRegistry;
  export default value;
}

declare module "./generated/component-changelogs.json" {
  const value: Record<
    string,
    Array<{ version: string; sections: Record<string, string[]> }>
  >;
  export default value;
}

declare module "./generated/npm-latest.json" {
  const value: {
    name: string;
    version: string;
    fetchedAt: string | null;
    error?: string;
  };
  export default value;
}

declare module "./versions/manifest.json" {
  const value: {
    covered: string[];
    default: string;
    versions: Record<
      string,
      {
        spiral: string;
        tokens: string;
        icons: string;
        status: "ready" | "draft";
        components: Record<string, { rev?: string; inherits?: string }>;
      }
    >;
    notes?: string;
  };
  export default value;
}
