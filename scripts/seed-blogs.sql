
insert into public.blog_posts
  (slug, title, excerpt, category, published_at, read_time, image_url, author, sections, featured, published, sort_order)
values
  ('cinematic-trailers-that-convert', 'Why cinematic trailers convert better than product demos', 'Story first launch films build emotional stakes before the CTA. Here is how we structure hooks, pacing, and grade for maximum retention.', 'Strategy', '2026-05-12'::date, '6 min read', '', 'Starlights Visuals', '[{"paragraphs":["Product demos explain features. Cinematic trailers create desire. The difference is narrative architecture how quickly you establish stakes, who the audience is rooting for, and when the payoff lands relative to your call to action.","We see this consistently in paid social and landing page tests: story first launch films hold attention longer, improve thumb stop rates, and lift downstream conversion when the CTA arrives after emotional investment rather than before it."]},{"heading":"Hook structure that holds attention","paragraphs":["The first three seconds should answer one question: why should I care? That can be a visual surprise, a human moment, or a tension the product resolves but it cannot be a logo sting followed by a spec sheet.","We map hooks on a simple grid: problem, escalation, reveal, proof, CTA. Each beat gets a time budget before we ever open a timeline."]}]'::jsonb, true, true, 1),
  ('character-design-for-ip', 'Character design that anchors your IP across every channel', 'From silhouette readability to merch ready turnarounds the checklist we use before a hero goes into production.', 'Craft', '2026-05-03'::date, '5 min read', '', 'Starlights Visuals', '[{"paragraphs":["A strong character is readable at a glance in an app icon, on a billboard, and on a hoodie. Before we animate or rig anything, we pressure test silhouette, expression range, and costume storytelling so the design survives every downstream format."]},{"heading":"Silhouette and expression","paragraphs":["We thumbnail dozens of shapes before color. If you cannot identify the character in pure black fill at 48 pixels, the design is not ready for production.","Expression sheets come early. Campaign characters need to sell joy, frustration, and triumph without dialogue."]}]'::jsonb, true, true, 2),
  ('production-pipelines-that-ship', 'Production pipelines that ship: concept to final delivery', 'How we align art direction, technical constraints, and milestone reviews so teams ship on time without sacrificing polish.', 'Production', '2026-04-21'::date, '8 min read', '', 'Starlights Visuals', '[{"paragraphs":["Projects slip when creative direction and delivery constraints meet for the first time at the end of a milestone. Our pipeline front loads technical limits, establishes a single approval path, and keeps work in progress visible so producers can de risk schedules early."]},{"heading":"Pre production alignment","paragraphs":["We start with a visual target board and a technical brief: resolution, format, lighting model, and animation requirements.","Milestone reviews are structured as gate checks with clear deliverable lists at each stage."]}]'::jsonb, true, true, 3)
on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  category = excluded.category,
  published_at = excluded.published_at,
  read_time = excluded.read_time,
  sections = excluded.sections,
  featured = excluded.featured,
  published = excluded.published,
  sort_order = excluded.sort_order;


