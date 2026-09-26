import MigrationMdx from "../../content/start/migration-3-1.mdx";
import { mdxComponents } from "../../mdx-components";

export function MigrationPage() {
  return (
    <div className="docs-prose">
      <MigrationMdx components={mdxComponents} />
    </div>
  );
}
