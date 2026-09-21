/**
 * The shape of every page's editable copy.
 *
 * One file per page in this folder lists the page's sections from top to
 * bottom and the words in each. That list is the single source of truth for
 * both sides of the site:
 *
 *   - wordpress/build-page-copy.mjs turns it into the ACF field groups an
 *     editor sees — a tab per section, a field per piece of text, with the
 *     text below as the starting value;
 *   - lib/cms/copy.ts reads what the editor wrote (one JSON field per page)
 *     and fills in anything left empty with the value here.
 *
 * So a field can never exist on one side and not the other, and a page never
 * renders a blank heading because a field was cleared.
 */

export interface BaseField {
  /** What the editor sees above the input. Plain words: "Small line above the headline". */
  label: string;
  /** One sentence under the label, when the label is not enough. */
  help?: string;
}

export interface TextField extends BaseField {
  kind: "text";
  value: string;
}

export interface ParaField extends BaseField {
  kind: "para";
  value: string;
  rows?: number;
}

/** A textarea read as a list, one item per line — for short lists such as the lines of a headline. */
export interface LinesField extends BaseField {
  kind: "lines";
  value: string[];
}

/** A button or a text link: the words on it and where it goes. */
export interface LinkField extends BaseField {
  kind: "link";
  value: { text: string; url: string };
}

/**
 * A list of repeated rows — steps, cards, facts. ACF without its paid add-on
 * has no repeating rows, so this becomes a fixed number of numbered rows
 * ("Step 1", "Step 2"…); a row left empty is simply not shown.
 */
export interface ItemsField<K extends string = string> extends BaseField {
  kind: "items";
  /** The name of one row, numbered in the editor: "Step" → "Step 1". */
  item: string;
  /** How many rows the editor gets. Always a couple more than the page starts with. */
  slots: number;
  fields: Record<K, { label: string; kind: "text" | "para" }>;
  value: Record<K, string>[];
}

export type Field = TextField | ParaField | LinesField | LinkField | ItemsField;

export interface Section<F extends Record<string, Field> = Record<string, Field>> {
  title: string;
  help?: string;
  fields: F;
}

export interface PageCopy<S extends Record<string, Section> = Record<string, Section>> {
  /** The WordPress page this copy lives on, and the path it renders at. */
  slug: string;
  uri: string;
  title: string;
  sections: S;
}

/* -------------------------------------------------------------- builders */

export const text = (label: string, value: string, help?: string): TextField => ({ kind: "text", label, value, help });

export const para = (label: string, value: string, help?: string, rows = 3): ParaField => ({ kind: "para", label, value, help, rows });

export const lines = (label: string, value: string[], help?: string): LinesField => ({ kind: "lines", label, value, help });

export const link = (label: string, textValue: string, url: string, help?: string): LinkField => ({ kind: "link", label, value: { text: textValue, url }, help });

export function items<K extends string>(
  label: string,
  item: string,
  fields: Record<K, { label: string; kind: "text" | "para" }>,
  value: Record<K, string>[],
  options: { help?: string; slots?: number } = {},
): ItemsField<K> {
  return { kind: "items", label, item, fields, value, help: options.help, slots: options.slots ?? Math.max(value.length + 2, 3) };
}

export const section = <F extends Record<string, Field>>(title: string, fields: F, help?: string): Section<F> => ({ title, help, fields });

export const page = <S extends Record<string, Section>>(slug: string, uri: string, title: string, sections: S): PageCopy<S> => ({ slug, uri, title, sections });

/* ----------------------------------------------------------------- types */

type ValueOf<F> = F extends { kind: "text" | "para" }
  ? string
  : F extends { kind: "lines" }
    ? string[]
    : F extends { kind: "link" }
      ? { text: string; url: string }
      : F extends { kind: "items"; fields: Record<infer K, unknown> }
        ? Record<K & string, string>[]
        : never;

/** What a page component receives: every field filled, from WordPress or from the value above. */
export type CopyOf<P extends PageCopy> = {
  [S in keyof P["sections"]]: { [F in keyof P["sections"][S]["fields"]]: ValueOf<P["sections"][S]["fields"][F]> };
};
