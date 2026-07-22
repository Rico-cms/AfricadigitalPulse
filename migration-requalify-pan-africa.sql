-- Masque les anciens signaux non traités. Le nouveau collecteur réactive
-- uniquement ceux qui passent le filtre numérique panafricain.
UPDATE signals SET status='rejected' WHERE status='new';
