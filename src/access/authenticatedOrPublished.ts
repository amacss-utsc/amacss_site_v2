import type { Access } from "payload"

// These collections do not enable Payload drafts, so every saved document is
// published. Filtering on `_status` would fail because that field does not exist.
export const authenticatedOrPublished: Access = () => true
