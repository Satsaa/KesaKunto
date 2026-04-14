# `auth` Usage

Thin KesaKunto auth facade.

- Use app-level functions such as `beginSignIn`, `completeSignIn`, and `requireAuth`.
- Do not spread raw OIDC concepts across the app unless the package API requires it.
- `auth-core` owns protocol-level OIDC and JWT mechanics.
- This package owns KesaKunto-specific config and session shaping.
