import { SITE_URL } from "@/lib/site"

// Dynamic on purpose: a prerendered file under .well-known 404s, because the
// static file server skips dot-directories.
export const dynamic = "force-dynamic"

// RFC 9728 metadata for a resource that needs no auth: no authorization
// servers, and an empty bearer_methods_supported, which the RFC defines as
// "no bearer methods are supported". Agents learn that up front instead of
// probing for a 401 that never comes.
export function GET(): Response {
  return Response.json({
    resource: SITE_URL,
    resource_name: "Aditya Garud",
    resource_documentation: `${SITE_URL}/developers`,
    bearer_methods_supported: [],
  })
}
