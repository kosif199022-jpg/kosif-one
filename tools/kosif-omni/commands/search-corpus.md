---
description: Search your own text corpus (prompts, books, code dumps) with Arabic-aware full-text search
argument-hint: <words or "exact phrase">
---
Search my local corpus for: $ARGUMENTS

Call `kosif_corpus_status` first; if the index is not built call `kosif_corpus_index` repeatedly until done=true, then `kosif_corpus_search`. Show file names and short snippets, use `kosif_corpus_read` for more context, and report identical copies once. If the corpus is not configured, tell me to set KOSIF_CORPUS_DIR.
