# Creative worlds: creature systems (Pokémon-style) and game-design lens

From the user's Pokémon-AI / Omni-Sovereign sources. Use for original creature design, card/battle systems and world bibles. Create **original** creatures; do not copy trademarked characters.

## Type system (19 slots in the source)
Normal · Fire · Water · Grass · Electric · Ice · Fighting · Poison · Ground · Flying · Psychic · Bug · Rock · Ghost · Dragon · Dark · Steel · Fairy · ??? (unknown).

## Rarity table (spawn weights from the source)
Common 60% · Uncommon 25% · Rare 10% · Epic 4% · Legendary 0.9% · Mythical 0.1%.

## Biomes
Forest · Cave · Ocean · Mountain · Urban · Desert · Tundra · Wetland.

## Creature card template
Name · type(s) · rarity · biome · silhouette & 3 distinguishing features · palette · behaviour · signature move (+ visual effect) · evolution line (with trigger) · weakness/resistance · lore hook · **7-layer image prompt** + 360° sheet code (`CHR-xxx`).

## Battle & progression lens (from the strategy-guide sources)
Turn-based loop · stat model (HP/ATK/DEF/SPD/special) · type chart (state it explicitly, verify it is closed and has no accidental infinite loops) · evolution/fusion rules ("DNA fusion lab": define inheritance of types and stats deterministically) · arena rules · reward curve. Use `kosif_decision_sensitivity` to compare balance options and `kosif_probability_check` for drop-rate arithmetic.

## World bible skeleton
Premise · geography (map zones) · factions · tech/magic rules and limits · economy · conflicts (GMC+S) · tone/palette · 5 iconic locations (`LOC-xxx`) · 5 iconic characters (`CHR-xxx`).
