/**
 * The shapes the section components accept. A page passes the matching
 * section of its copy (see content/copy), already merged with WordPress.
 */

export interface LinkCopy {
  text: string;
  url: string;
}

export interface HeadingCopy {
  eyebrow: string;
  heading: string;
}

export interface HeadingLedeCopy extends HeadingCopy {
  lede: string;
}

/** A text link beside a heading; an editor hides it by typing a dash. */
export interface LinkedHeadingCopy extends HeadingLedeCopy {
  link: LinkCopy;
}
