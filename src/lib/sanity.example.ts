// OPTIONAL — only relevant if this project uses Sanity as its CMS.
// Not wired up by default so projects that don't use Sanity aren't forced
// into the dependency.
//
// To use:
//   1. npm install @sanity/client
//   2. Rename this file to sanity.ts
//   3. Fill in your project's values in .env (see .env.example)
//   4. Define your actual schemas separately — they're project-specific,
//      drafted as step 4 of the build order in CLAUDE.md, not part of
//      this template.
//
// import { createClient } from '@sanity/client';
//
// export const sanity = createClient({
//   projectId: import.meta.env.SANITY_PROJECT_ID,
//   dataset: import.meta.env.SANITY_DATASET ?? 'production',
//   apiVersion: '2025-01-01',
//   useCdn: true,
// });
//
// Example query pattern once schemas exist:
//
// export async function getPage(slug: string) {
//   return sanity.fetch(
//     `*[_type == "page" && slug.current == $slug][0]`,
//     { slug }
//   );
// }
export {};
