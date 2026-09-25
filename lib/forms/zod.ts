/**
 * The parts of zod the form schemas use, imported by name.
 *
 * `import { z } from "zod"` hands Turbopack a namespace object it cannot shake,
 * so every one of zod's error-message locales went to the browser with the
 * forms: 85 KB, most of it never run. Named imports keep only what is called.
 * Schemas import this as `import * as z from "./zod"` and read as before.
 */
import { array, boolean, enum as enumOf, literal, number, object, string } from "zod";

export { array, boolean, enumOf as enum, literal, number, object, string };
export type { infer } from "zod";
