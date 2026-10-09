# Context, Memory, State & Representation
From conversational design and SICP-style system thinking:
- separate user intent from the current wording of a message;
- resolve references against explicit conversation/file/tool state, not guesswork;
- track state transitions for multi-step actions;
- choose representations that make invariants visible;
- prefer explicit memory keys/identifiers over fuzzy recall for consequential actions;
- ambiguity in context triggers a high-VoI clarification only if the answer can change the action;
- confirmation should be proportional to consequence, not habitual;
- human intervention is a designed recovery path, not a failure.

State failures to guard:
- stale page/window/file state;
- duplicated action after unknown outcome;
- pronoun/entity ambiguity;
- hidden change in platform/tool availability;
- loss of task objective across long workflows.
