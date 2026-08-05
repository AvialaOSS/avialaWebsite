import LocaleMdx from "../../content/start/locale.mdx";
import { DocPageHeader } from "../../components/TableOfContents";
import { PropsTable } from "../../components/PropsTable";
import { getComponentProps } from "../../props-registry";
import { mdxComponents } from "../../mdx-components";
import { Typography } from "@aviala-design/spiral";

export function LocalePage() {
  const localeProps = getComponentProps("LocaleProvider");
  const configProps = getComponentProps("ConfigProvider");

  return (
    <>
      <DocPageHeader
        title="国际化"
        description="LocaleProvider、ConfigProvider（RTL）与业务 i18n 共存"
      />
      <div className="docs-prose">
        <LocaleMdx components={mdxComponents} />
      </div>
      {localeProps ? (
        <>
          <Typography level="subtitle" as="h2" className="docs-props-heading">
            LocaleProvider
          </Typography>
          <PropsTable props={localeProps.props} />
        </>
      ) : null}
      {configProps ? (
        <>
          <Typography level="subtitle" as="h2" className="docs-props-heading">
            ConfigProvider
          </Typography>
          <PropsTable props={configProps.props} />
        </>
      ) : null}
    </>
  );
}
