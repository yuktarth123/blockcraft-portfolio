-- Add hero section fields to profile_content
ALTER TABLE public.profile_content
ADD COLUMN IF NOT EXISTS hero_title TEXT DEFAULT 'Yuktarth Nagar',
ADD COLUMN IF NOT EXISTS hero_subtitle TEXT DEFAULT 'Product Manager',
ADD COLUMN IF NOT EXISTS hero_avatar_url TEXT,
ADD COLUMN IF NOT EXISTS about_title TEXT DEFAULT 'About Me';

-- Create timeline/experience table
CREATE TABLE IF NOT EXISTS public.timeline_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_type TEXT NOT NULL DEFAULT 'briefcase',
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on timeline_items
ALTER TABLE public.timeline_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for timeline_items
CREATE POLICY "Anyone can view published timeline items"
ON public.timeline_items
FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins can manage timeline items"
ON public.timeline_items
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Add trigger for timeline_items updated_at
CREATE TRIGGER update_timeline_items_updated_at
BEFORE UPDATE ON public.timeline_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default profile_content if not exists
INSERT INTO public.profile_content (id, hero_title, hero_subtitle, tagline, about_text, hero_avatar_url)
VALUES (
  gen_random_uuid(),
  'Yuktarth Nagar',
  'Product Manager',
  'Transforming ideas into impactful products through strategic thinking and data-driven decision making.',
  'As a passionate Product Manager, I specialize in bridging the gap between business objectives and user needs. My experience spans across various domains, from fintech to e-commerce, where I''ve led cross-functional teams to deliver innovative solutions that drive growth and enhance user experience.',
  NULL
)
ON CONFLICT DO NOTHING;

-- Insert default timeline items
INSERT INTO public.timeline_items (year, title, description, icon_type, display_order) VALUES
('2023 - Present', 'Senior Product Manager', 'Leading product strategy and roadmap for key initiatives', 'briefcase', 1),
('2021 - 2023', 'Product Manager', 'Managed end-to-end product development lifecycle', 'briefcase', 2),
('2019 - 2021', 'Associate Product Manager', 'Collaborated with stakeholders to define product requirements', 'briefcase', 3)
ON CONFLICT DO NOTHING;