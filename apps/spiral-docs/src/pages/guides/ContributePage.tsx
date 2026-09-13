import ContributeMdx from "../../content/start/contribute.mdx";
import { DocPageHeader } from "../../components/TableOfContents";
import { mdxComponents } from "../../mdx-components";

export function ContributePage() {
  return (
    <>
      <DocPageHeader
        title="贡献"
        description="改库请走 developer-kit AGENTS.md；本站开始页只讲消费"
      />
      <div className="docs-prose">
        <ContributeMdx components={mdxComponents} />
      </div>
    </>
  );
}
