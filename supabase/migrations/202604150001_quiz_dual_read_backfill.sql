-- Backfill normalized quiz tables from legacy quiz_questions.pilihan JSON
-- Safe to run multiple times.

BEGIN;

WITH legacy_choices AS (
	SELECT
		qq.id AS question_id,
		choice.value AS option_text,
		choice.ordinality AS ordinality,
		CASE
			WHEN lower(trim(choice.value)) = lower(trim(COALESCE(NULLIF(qq.jawaban_benar, ''), '')))
			THEN true
			ELSE false
		END AS is_correct
	FROM public.quiz_questions qq
	CROSS JOIN LATERAL jsonb_array_elements_text(
		CASE
			WHEN qq.pilihan IS NULL OR btrim(qq.pilihan) = '' THEN '[]'::jsonb
			WHEN qq.pilihan ~ '^\s*\[' THEN qq.pilihan::jsonb
			ELSE '[]'::jsonb
		END
	) WITH ORDINALITY AS choice(value, ordinality)
)
INSERT INTO public.quiz_options (question_id, option_key, option_text, is_correct, urutan, created_at)
SELECT
	question_id,
	CASE
		WHEN ordinality BETWEEN 1 AND 26 THEN chr(64 + ordinality)
		ELSE ordinality::text
	END AS option_key,
	option_text,
	is_correct,
	ordinality,
	NOW()
FROM legacy_choices
ON CONFLICT (question_id, option_key) DO NOTHING;

COMMIT;