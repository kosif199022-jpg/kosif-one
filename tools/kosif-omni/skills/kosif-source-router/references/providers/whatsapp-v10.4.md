# WhatsApp Provider Contract
Imported from KOSIF WhatsApp 0.8.1.

- Use the live provider for messaging, files, contacts, scheduling, delivery checks and diagnostics.
- Preserve exact text unless editing is requested.
- Persist saved-contact aliases in the provider; never guess mappings.
- New sends receive fresh idempotency; retry the same payload with the same idempotency key only after reconciling uncertain state.
- Prefer a bundle call for text + attachments and stored/R2 file paths for known files.
- Scheduling requires explicit timezone/offset.
- Job completion or HTTP 200 is not proof of delivered/read; use receipt-aware delivery state.
- Never expose bridge secrets; pairing uses real provider QR/code only.
- Its historical mobile Think bridge is preserved as fallback policy, but canonical mobile Full Pro now uses the KOSIF Think mobile bridge.
