-- ============================================
-- POET'S SANCTUARY - COMPLETE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- PROFILES (extends Supabase Auth)
-- ============================================

CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  social_links JSONB DEFAULT '{}',
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BOOKS / POETRY COLLECTIONS
-- ============================================

CREATE TABLE public.books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  subtitle VARCHAR(255),
  description TEXT NOT NULL,
  long_description TEXT,
  cover_image_url TEXT NOT NULL,
  pdf_url TEXT NOT NULL,
  pdf_size_bytes BIGINT,
  page_count INTEGER,
  published_year INTEGER,
  publisher TEXT,
  isbn VARCHAR(20),
  language VARCHAR(10) DEFAULT 'en',
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  seo_title VARCHAR(255),
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BLOG POSTS
-- ============================================

CREATE TABLE public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  category VARCHAR(100),
  reading_time_minutes INTEGER DEFAULT 5,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  seo_title VARCHAR(255),
  seo_description TEXT,
  author_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- COMMENTS
-- ============================================

CREATE TABLE public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  author_name VARCHAR(100) NOT NULL,
  author_email VARCHAR(255),
  author_website VARCHAR(255),
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  is_spam BOOLEAN DEFAULT false,
  like_count INTEGER DEFAULT 0,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- POST LIKES (session-based)
-- ============================================

CREATE TABLE public.post_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  session_id VARCHAR(255) NOT NULL,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, session_id)
);

-- ============================================
-- BOOKMARKS
-- ============================================

CREATE TABLE public.bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- ============================================
-- READING PROGRESS
-- ============================================

CREATE TABLE public.reading_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
  current_page INTEGER DEFAULT 0,
  percentage INTEGER DEFAULT 0,
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- ============================================
-- NEWSLETTER SUBSCRIBERS
-- ============================================

CREATE TABLE public.newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

-- ============================================
-- CONTACT MESSAGES
-- ============================================

CREATE TABLE public.contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  replied BOOLEAN DEFAULT false,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_books_slug ON public.books(slug);
CREATE INDEX idx_books_featured ON public.books(is_featured) WHERE is_featured = true;
CREATE INDEX idx_books_published ON public.books(is_published) WHERE is_published = true;
CREATE INDEX idx_books_created_at ON public.books(created_at DESC);

CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(is_published) WHERE is_published = true;
CREATE INDEX idx_blog_posts_published_at ON public.blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_tags ON public.blog_posts USING GIN(tags);

CREATE INDEX idx_comments_post_id ON public.comments(post_id);
CREATE INDEX idx_comments_approved ON public.comments(is_approved) WHERE is_approved = true;
CREATE INDEX idx_post_likes_post_id ON public.post_likes(post_id);
CREATE INDEX idx_reading_progress_user_id ON public.reading_progress(user_id);
CREATE INDEX idx_reading_progress_book_id ON public.reading_progress(book_id);

-- Full text search indexes
CREATE INDEX idx_blog_posts_fts ON public.blog_posts USING GIN(
  to_tsvector('english', title || ' ' || COALESCE(excerpt, '') || ' ' || COALESCE(content, ''))
);
CREATE INDEX idx_books_fts ON public.books USING GIN(
  to_tsvector('english', title || ' ' || COALESCE(description, ''))
);

-- ============================================
-- FUNCTIONS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE ON public.books
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Search functions
CREATE OR REPLACE FUNCTION search_blog_posts(search_query TEXT)
RETURNS TABLE(
  id UUID, title VARCHAR, slug VARCHAR,
  excerpt TEXT, featured_image_url TEXT,
  published_at TIMESTAMPTZ, relevance REAL
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    bp.id, bp.title, bp.slug, bp.excerpt,
    bp.featured_image_url, bp.published_at,
    ts_rank(
      to_tsvector('english', bp.title || ' ' || COALESCE(bp.excerpt, '')),
      plainto_tsquery('english', search_query)
    ) AS relevance
  FROM blog_posts bp
  WHERE bp.is_published = true
    AND to_tsvector('english', bp.title || ' ' || COALESCE(bp.excerpt, ''))
        @@ plainto_tsquery('english', search_query)
  ORDER BY relevance DESC
  LIMIT 30;
END;
$$;

CREATE OR REPLACE FUNCTION search_books(search_query TEXT)
RETURNS TABLE(
  id UUID, title VARCHAR, slug VARCHAR,
  description TEXT, cover_image_url TEXT, relevance REAL
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    b.id, b.title, b.slug, b.description,
    b.cover_image_url,
    ts_rank(
      to_tsvector('english', b.title || ' ' || COALESCE(b.description, '')),
      plainto_tsquery('english', search_query)
    ) AS relevance
  FROM books b
  WHERE b.is_published = true
    AND to_tsvector('english', b.title || ' ' || COALESCE(b.description, ''))
        @@ plainto_tsquery('english', search_query)
  ORDER BY relevance DESC
  LIMIT 20;
END;
$$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, is_admin)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    CASE WHEN NEW.email = current_setting('app.admin_email', true) THEN true ELSE false END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published books are viewable by everyone" ON public.books FOR SELECT USING (is_published = true);
CREATE POLICY "Admin can manage books" ON public.books FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published posts are viewable by everyone" ON public.blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Admin can manage posts" ON public.blog_posts FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit comments" ON public.comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Approved comments are visible" ON public.comments FOR SELECT USING (is_approved = true);
CREATE POLICY "Admin can manage comments" ON public.comments FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view likes" ON public.post_likes FOR SELECT USING (true);
CREATE POLICY "Anyone can like posts" ON public.post_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can delete own likes" ON public.post_likes FOR DELETE USING (
  session_id = current_setting('app.session_id', true)
);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own bookmarks" ON public.bookmarks FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own reading progress" ON public.reading_progress FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin manages subscribers" ON public.newsletter_subscribers FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view contact messages" ON public.contact_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admin can update contact messages" ON public.contact_messages FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- ============================================
-- SEED DATA - 9 POETRY BOOKS
-- ============================================

INSERT INTO public.books (title, slug, description, long_description, cover_image_url, pdf_url, published_year, is_featured, is_published) VALUES
(
  'Garden of Grief',
  'garden-of-grief',
  'This one took a long time to finish. Not because there was too much to say, but because grief doesn''t write itself in neat paragraphs.',
  'Garden of Grief is a collection of poems that sit inside loss. Not the tidy, resolved kind that poetry usually offers, but the kind that arrives uninvited at 2am and stays for months. These poems were written in the gaps, between the funeral and the moving on, between knowing someone is gone and actually feeling it. If you''ve ever loved someone you couldn''t keep, these words are for you.',
  '/images/books/gog.webp',
  '/pdfs/GARDEN_OF_GRIEF.pdf',
  2024,
  true,
  true
),
(
  'You and the Moon',
  'you-and-the-moon',
  'Love poems. The unreasonably sincere kind. Some of them are actually about the moon.',
  'You and the Moon is about longing across distance, the kind that feels romantic and ridiculous in equal measure. The moon becomes a stand-in for everything you can see but can''t touch, everything that''s beautiful precisely because it''s out of reach. These poems were written for someone specific. Maybe they''ll mean something to you too.',
  '/images/books/you-and-the-moon.webp',
  '/pdfs/You_and_the_Moon.pdf',
  2024,
  true,
  true
),
(
  'A Fool''s Dream',
  'a-fools-dream',
  'The kind of optimism that hurts. Dreams you keep having even after you know better.',
  'A Fool''s Dream is about hope that won''t quit. The philosophical kind, the stubborn refusal to stop wanting things even when wanting them is embarrassing. These poems question whether dreams are noble or just a sophisticated form of self-deception. The answer is probably both, and somehow that makes them worth having anyway.',
  '/images/books/a-fools-dream.webp',
  '/pdfs/A_Fools_Dream.pdf',
  2023,
  true,
  true
),
(
  'A Diary of My Thoughts',
  'a-diary-of-my-thoughts',
  'Unfiltered. The kind of thoughts you write at 3am and half-regret by morning.',
  'A Diary of My Thoughts is exactly what it sounds like. It is not polished. Some of these poems were written in the margins of receipts, some in notes apps, some immediately after conversations that went sideways. They are not always wise or profound. But they are honest, which felt like the more important thing.',
  '/images/books/a-diary-of-my-thoughts.webp',
  '/pdfs/A_Diary_of_my_Thoughts.pdf',
  2023,
  false,
  true
),
(
  'A Letdown',
  'a-letdown',
  'Short. Honest. The aftermath of expectations meeting reality.',
  'A Letdown is a thin book, deliberately. It is about disappointment, the quiet, specific kind that comes from people, from situations, from yourself. Each poem is brief because disappointment doesn''t need much decoration. It just needs to be named.',
  '/images/books/a-letdown.webp',
  '/pdfs/A_Letdown.pdf',
  2023,
  false,
  true
),
(
  'Dawn and Dusk',
  'dawn-and-dusk',
  'Between the start of things and their end. The light that happens in between.',
  'Dawn and Dusk moves through transitions. The in-between times, when something is ending but hasn''t ended yet, when something new is forming but hasn''t arrived. There is a particular quality to that light, literally and figuratively, and this collection tries to live inside it for a while.',
  '/images/books/dawn-and-dusk.webp',
  '/pdfs/Dawn_and_Dusk.pdf',
  2023,
  false,
  true
),
(
  'Drunk Off Her',
  'drunk-off-her',
  'About that specific obsession. The kind everyone has had but nobody talks about well.',
  'Drunk Off Her is an uncomfortable book. It is about wanting someone so much it stops making sense, the dizziness of it, the way it makes you stupid and sharp at the same time. These poems don''t apologize for the feeling. They just describe it accurately.',
  '/images/books/drunk-off-her.webp',
  '/pdfs/DRUNK_OFF_HER.pdf',
  2022,
  false,
  true
),
(
  'Fading Light',
  'fading-light',
  'About things disappearing slowly. You watch them go and cannot stop it.',
  'Fading Light is about endings that take their time. Relationships that wind down, not explode. Ambitions that quietly recede. People who drift. The particular sadness of watching something fade is different from the sadness of sudden loss. This book lives in that slower kind of grief.',
  '/images/books/fading-light.webp',
  '/pdfs/Fading_Light.pdf',
  2022,
  false,
  true
),
(
  'Midday Blues',
  'midday-blues',
  'Sadness that arrives without reason. The ordinary ache of being alive in the middle of a regular Tuesday.',
  'Midday Blues is about depression without drama. The low-level, persistent kind that shows up on ordinary days for no particular reason. These poems don''t try to explain it or fix it. They just say: yes, this is real, it happens to people, and you are not alone in the middle of your unremarkable Tuesday.',
  '/images/books/midday-blues.webp',
  '/pdfs/Midday_Blues.pdf',
  2022,
  false,
  true
);

-- ============================================
-- SEED BLOG POSTS
-- ============================================

INSERT INTO public.blog_posts (title, slug, content, excerpt, featured_image_url, tags, category, is_published, published_at) VALUES
(
  'Why I Write About Grief',
  'why-i-write-about-grief',
  '<p>There is a moment, sometime after losing someone, when you realize that the language you have for it is completely wrong.</p><p>People say things like "moving on" and "healing" and "closure." None of those words describe what actually happens. What actually happens is that the grief becomes part of you. It doesn''t leave. It just learns to share the space.</p><p>I started writing Garden of Grief not to process anything, but because I was frustrated by how badly the existing poems described what I was going through. They were too beautiful. Too resolved. They ended with lessons learned and wisdom gained, and I kept thinking: no, that''s not it. That''s not what this feels like at all.</p><p>Writing that book was the most uncomfortable thing I''ve done. Not cathartic in the movie sense of the word. More like putting an honest description on something that had been living unnamed for too long. There is some relief in that, I think. Not in the grief lifting, but in having found the right words for it.</p><p>If you''ve read Garden of Grief and it felt too raw, that was intentional. If it felt like I was describing something you''d never shown anyone, that was the point.</p>',
  'There is a moment, sometime after losing someone, when you realize that the language you have for it is completely wrong.',
  '/images/blog/grief-writing.jpg',
  ARRAY['grief', 'writing', 'personal'],
  'Reflections',
  true,
  NOW() - INTERVAL '7 days'
),
(
  'On Writing Love Poems Without Being Embarrassing',
  'on-writing-love-poems',
  '<p>Love poetry has a credibility problem.</p><p>The moment you admit you''ve written love poems, people assume a certain kind of poem. Overwrought. Purple. Metaphors that strain too hard. You and the Moon started as an experiment in writing love poems that were direct without being saccharine, sincere without being precious.</p><p>The thing about romantic feeling is that it is genuinely ridiculous. You think about someone constantly. Their opinions matter to you in ways that don''t make rational sense. You read into silences. You construct elaborate scenarios in your head based on limited data. None of this is dignified. But pretending it isn''t happening, or dressing it up in elegant language to make it sound sophisticated, misses what''s actually interesting about it.</p><p>The poems in You and the Moon try to describe the experience accurately. The moon enters not as a metaphor for something cosmic and grand, but because when you''re in that state, ordinary things start carrying more weight than they should. A full moon really does feel personal when you''re in love with someone far away. I''m not apologizing for that.</p>',
  'Love poetry has a credibility problem. The moment you admit you''ve written love poems, people assume a certain kind.',
  '/images/blog/moon-writing.jpg',
  ARRAY['love', 'poetry', 'writing', 'craft'],
  'Craft',
  true,
  NOW() - INTERVAL '3 days'
),
(
  'The Books That Changed How I Write',
  'books-that-changed-how-i-write',
  '<p>I am reluctant to write influence lists because they always sound performative. But some books actually did change the way I write, and leaving them unnamed feels dishonest.</p><p>The first was Mary Oliver''s Upstream. Not her poetry, specifically, but her essays about attention. The idea that looking closely at something ordinary is itself a form of discipline, that paying attention is a practice. I started trying to apply that to emotions. What is grief, exactly, if you look at it closely? Not the concept, but the specific sensory experience of it on a Tuesday morning?</p><p>The second was Ocean Vuong''s On Earth We''re Briefly Gorgeous. It showed me that a poem could carry tremendous weight without announcing that it was carrying weight. The restraint in that book is extraordinary.</p><p>The third, and this one surprises people, is Annie Dillard''s The Writing Life. Specifically the line: "How we spend our days is, of course, how we spend our lives." I think about that line when I''m trying to convince myself that writing is optional.</p><p>None of these are easy books. They all ask something of you. That feels right.</p>',
  'I am reluctant to write influence lists because they always sound performative. But some books actually changed how I write.',
  '/images/blog/books-influence.jpg',
  ARRAY['reading', 'influences', 'craft', 'books'],
  'Reading',
  true,
  NOW() - INTERVAL '1 day'
);
