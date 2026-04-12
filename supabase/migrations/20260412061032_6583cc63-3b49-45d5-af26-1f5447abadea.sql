ALTER TABLE public.ratings DROP CONSTRAINT ratings_rating_check;
ALTER TABLE public.ratings ADD CONSTRAINT ratings_rating_check CHECK (rating >= 0 AND rating <= 10);