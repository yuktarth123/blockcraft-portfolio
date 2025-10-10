-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  role TEXT NOT NULL,
  description TEXT NOT NULL,
  metrics TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  color TEXT NOT NULL DEFAULT 'bg-primary/10 border-primary',
  is_published BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published projects"
  ON public.projects FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage projects"
  ON public.projects FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create web_apps table
CREATE TABLE public.web_apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  tech TEXT[] NOT NULL DEFAULT '{}',
  demo_url TEXT,
  github_url TEXT,
  is_published BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.web_apps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published apps"
  ON public.web_apps FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage apps"
  ON public.web_apps FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create achievements table
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  year TEXT NOT NULL,
  xp INTEGER NOT NULL DEFAULT 0,
  icon_type TEXT NOT NULL DEFAULT 'trophy',
  is_published BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published achievements"
  ON public.achievements FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage achievements"
  ON public.achievements FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create profile_content table
CREATE TABLE public.profile_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tagline TEXT,
  about_text TEXT,
  resume_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  email TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profile_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view profile content"
  ON public.profile_content FOR SELECT
  USING (true);

CREATE POLICY "Admins can update profile content"
  ON public.profile_content FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Insert default profile content
INSERT INTO public.profile_content (tagline, about_text, email)
VALUES (
  'Crafting Digital Experiences, One Block at a Time',
  'Product Manager with a passion for building innovative digital experiences.',
  'contact@yuktarth.com'
);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add triggers
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_web_apps_updated_at
  BEFORE UPDATE ON public.web_apps
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_achievements_updated_at
  BEFORE UPDATE ON public.achievements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profile_content_updated_at
  BEFORE UPDATE ON public.profile_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();