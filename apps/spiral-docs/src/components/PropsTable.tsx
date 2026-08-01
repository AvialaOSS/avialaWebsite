import { Table, TableCell, TableHead, TableRow, Typography } from "@aviala-design/spiral";

export type PropItem = {
  name: string;
  type: string;
  /** Literal union members when type was expanded from an enum / string union. */
  values?: string[];
  defaultValue?: string;
  required?: boolean;
  description?: string;
};

type PropsTableProps = {
  title?: string;
  /** Anchor id; defaults to slug of title. */
  id?: string;
  props: PropItem[];
};

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function PropsTable({ title = "API", id, props }: PropsTableProps) {
  if (props.length === 0) return null;

  const sectionId = id ?? (title === "API" ? "api" : `api-${slugify(title)}`);

  return (
    <section className="docs-props" id={sectionId}>
      <Typography level="title" as="h2">
        {title}
      </Typography>
      <div className="docs-props-table-wrap">
        <Table className="docs-props-table" aria-label={title}>
          <TableRow header>
            <TableHead>属性</TableHead>
            <TableHead>说明</TableHead>
            <TableHead>类型</TableHead>
            <TableHead>默认值</TableHead>
          </TableRow>
          {props.map((prop) => (
            <TableRow key={prop.name}>
              <TableCell>
                <code>{prop.name}</code>
                {prop.required ? <span className="docs-props-required">*</span> : null}
              </TableCell>
              <TableCell text={prop.description ?? "—"} />
              <TableCell>
                <code className="docs-props-type">{prop.type}</code>
              </TableCell>
              <TableCell text={prop.defaultValue ?? "—"} />
            </TableRow>
          ))}
        </Table>
      </div>
    </section>
  );
}
