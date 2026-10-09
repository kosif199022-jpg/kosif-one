# Mobile Full Pro Bridge v1

Provider: KOSIF Think 0.9.5+
Prefix: `KOSIF_FULL_PRO_MOBILE_V1:`
Purpose: preserve mobile Full Pro access when ChatGPT exposes `kosif_think` but not the dedicated Full Pro tool names.

Security: start issues a random request capability token; only its hash and expiry are stored in durable KV. Subsequent bridge actions require the token. Secure image execution still passes through the private Cloudflare Secure Executor service binding and its one-time execution ticket.

This is an exposure compatibility layer, not a relaxation of Full Pro gates.
