# KesaKunto Feature List

## Food Logging

Single `+` entry point opens a picker with three paths: AI, barcode, manual, plus pantry-based entry.

### AI

- Input can be photo, text, or both.
- Flow is conversational until the user is satisfied.
- Accept button is always visible once any item is suggested.
- Multiple items can be accepted at once.
- `photo and/or text` produces suggested item(s) with estimated macros.
- Rainbow border effect appears only on actively AI-driven UI elements, not on accepted or finalized items.

### Barcode

- Scan EAN and show matching product(s).
- Show multiple matches when the scan is ambiguous.

### Manual

- Opens the shared item editor directly with empty fields.

### From Pantry

- Each pantry is shown as a tappable group with icon and name.
- Tapping a pantry opens or expands to its items.
- Selecting an item opens the shared item editor prefilled.
- Finalizing decrements pantry quantity by the logged amount.
- Editing a finalized log adjusts pantry quantity by the difference.

### Shared Item Editor

- Fields: name, weight in grams, kcal/100g, protein/100g, fat/100g, carbs/100g.
- Nutritional stats are stored per 100g only.
- Total nutrients are derived display values only.
- Weight and macro inputs support draggable sliders, with optional typing.
- Changing weight updates total nutrients in real time.
- Changing any per-100g macro updates totals in real time.
- Confirming logs the item to the day’s consumption log.

## Pantry

- Multiple pantries are supported.
- One default pantry is mandatory, cannot be deleted, and can be renamed.
- Each pantry has a name, emoji icon, and description.
- Pantry description is shown in the UI and sent to AI as context.
- Add items by barcode scan using Open Food Facts.
- Add items by text search using Open Food Facts.
- Add items manually with per-100g macros.
- Add items with no nutritional data and mark them incomplete.
- The same item can exist multiple times as separate batches or expiry entries.
- Expiry date is optional per item.
- Items expiring within 3 days are visually flagged.
- Items with missing macros are visually flagged.
- Pantry items can be edited or deleted.
- Pantry name, icon, and description are editable.
- AI receives pantry items, quantities, and expiry dates and should prioritize accordingly.

## Metrics

### Built-In Metrics

- Weight: daily, unit kg.
- Steps: daily, synced from Health Connect or HealthKit with manual fallback.
- Water intake: daily, unit ml.
- Calories: daily, derived from consumption log.
- Protein: daily, derived from consumption log.
- Fat: daily, derived from consumption log.
- Carbs: daily, derived from consumption log.

### User-Defined Metrics

- Users can create arbitrary metrics.
- Frequency can be `daily`, `time-point`, `weekly`, or `monthly`.
- Each metric has a stable reference value.
- Reference type can be `target`, `minimum`, or `maximum`.
- Reference display can be `line on graph` or `none`.
- Graph style can be `line`, `bar`, or `scatter`.
- Unit label is optional.
- Allowed maximum value is optional.
- AI can suggest metrics based on goals and existing data.

### Shared Metric Rules

- Reference value is editable at any time.
- Charts show historical values, rolling average, and reference line when enabled.
- Reference type controls good/bad coloring.
- `minimum`: below reference is bad.
- `maximum`: above reference is bad.
- `target`: deviation either direction is bad.
- Stats panel shows historical average.
- Stats panel also shows 90th percentile for maximum metrics or 10th percentile for minimum metrics.

## Workouts

- Users can log workout sessions.
- Session title is optional free text.
- Session type can be `strength`, `endurance`, `flexibility`, `sport`, or `other`.
- Duration is in minutes and supports a draggable slider.
- Each session can contain repeated exercises.
- Exercise fields: name, sets, reps, weight.
- Muscle groups are selected on front and back body diagrams with draw-to-select interaction.
- Session description and notes are free text.
- Walk logging is not a workout feature because walks are captured through steps.
- Workout sessions appear on the day they occurred.
- AI receives the last 7 days of workouts as an aggregated summary of type, duration, and muscle groups hit.

## Daily Plan

- User opens the daily plan screen and can give an optional prompt.
- `prompt + pantry + metrics + last 7 days aggregated summary` produces an AI-generated meal plan.
- The plan uses a human-in-the-loop conversational refinement flow until acceptance.
- After acceptance, the result is stored as a list of individual meal items for the day.
- There is no separate whole-day plan concept after acceptance.

### Plan Items

- Each item has a name, ingredients list, and estimated macros.
- Marking an item complete depletes pantry quantities for all ingredients.
- Unmarking restores the exact previously depleted pantry quantities.
- Items can be edited by changing ingredients or amounts.
- Items can be removed entirely.

### Purchase Suggestions

- AI may suggest ingredients not in the pantry.
- Each suggestion includes an `Add to pantry` action.
- That action opens the standard item editor.
- User can edit name, grams, and macros before saving to pantry.

### Post-Acceptance AI

- AI can still modify the accepted plan.
- AI modifications must go through the same actions users use.
- There are no LLM-only operations.

## AI

- Animated rainbow border appears on UI elements that are actively invoking or waiting on AI.
- AI-generated content at rest does not keep the rainbow effect.
- New AI-generated content should use a brief fade-in on first appearance.
- Each AI feature can use a specific provider and model or inherit the default.
- Multiple entries for the same provider type are allowed.
- Provider config fields: name, provider type, base URL, model, API key.
- Supported provider types: `Ollama`, `Claude`, `OpenAI`, `custom OpenAI-compatible`.
- Default provider is used when a feature has no specific assignment.
- AI always receives current pantry state, last 7 days aggregated metrics, active goals, and today’s consumption so far.

### AI Features

- `prompt + context` produces a daily meal plan.
- `photo and/or text` identifies food items and estimates macros.
- `text` produces workout suggestions or metric suggestions.
- `context` produces shopping suggestions within the daily plan flow.

## Charts And Progress

- Any metric can be charted.
- Charts show daily values, rolling average, and reference line when configured.
- Body measurements chart includes weight, waist, chest, hips, and arm.
- Body measurements chart becomes visible after 2 or more entries.
- All charts include a date range selector.

## Reviews

- Weekly review shows all tracked metrics per day, color coded against reference values.
- Monthly review shows averages and percentile stats per metric.
- Monthly review does not include automatic suggestions.

## Configuration

- Manage metrics: add, edit, delete custom metrics, and edit reference values on all metrics.
- Manage AI providers: add, edit, delete, clone providers, and assign them per feature.
- Manage goal weights and targets: start weight, target weight, start date.
- Change password.
