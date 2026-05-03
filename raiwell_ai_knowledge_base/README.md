# RaiWell AI Demo Knowledge Base

This folder contains a first-pass demo knowledge base for RaiWell AI.

## Files
- `wellness_rules.json` — stress/sleep/fitness/crowd/medical-caution rules
- `safety_rules.json` — PM2.5, rain, water-risk and red-flag safety rules
- `food_patterns.json` — general food pattern logic without medical claims
- `movement_library.json` — movement options and downgrade logic
- `chiangrai_places.json` — seed Chiang Rai experience catalog
- `local_wellness_network.json` — provider/network mock data
- `route_feasibility.json` — rough route clusters and feasibility notes
- `output_schema.json` — required JSON output structure
- `model_routing_strategy.json` — OpenAI/Gemini/Claude demo routing
- `evaluation_rubric.json` — plan quality scoring rubric
- `demo_personas.json` — 5 personas for demo/testing
- `prompt_policy.md` — system prompt policy
- `coach_review_checklist.json` — coach review checklist and buttons

## Important
This is for hackathon demo use. Public-source-backed data still needs local verification. Estimated fields are intentionally labeled as estimated or needs verification. Do not present demo placeholders as confirmed partnerships.

## Local Expert Confirmations
- Coach Roi has locally confirmed that Le Méridien Chiang Rai Fitness can support general fitness/gym-based exercise, coach-led functional training, and HYROX-inspired functional training sessions for RaiWell users.
- Treat this as `verification_status: "coach-confirmed"`, `source_type: "local expert confirmation"`, `verified_by: "Coach Roi"`, and `public_source_required: false`.
- Use the wording "HYROX-inspired functional training". Do not present it as an official HYROX center or official HYROX training unless that affiliation is separately verified later.
- Coach Roi review remains required for intensity, movement scaling, warm-up, cooldown, recovery needs, and user readiness checks.
- Coach Roi is currently the only coach in the RaiWell demo. Other local entries should be described as places, hosts, guides, facilities, or support options, not coaches.

## App Logic Alignment Notes
- The app follows the intended pipeline: user profile -> wellness/safety/food/movement/place knowledge base -> OpenAI structured JSON -> RaiWell UI adapter -> Coach Roi validation -> daily check-in adaptation.
- The Chiang Rai place database is intentionally a seed database. Food, cafe, nature, spa, and community entries are labeled with verification status so Coach Roi can confirm what is truly suitable for wellness use.
- For Maya-style users with high stress and poor sleep, the expected plan type is recovery-first. HYROX-inspired functional training can appear only as a scaled, Coach Roi-reviewed option, preferably indoors at Le Méridien Chiang Rai Fitness when PM2.5/rain/user readiness makes outdoor movement less suitable.
