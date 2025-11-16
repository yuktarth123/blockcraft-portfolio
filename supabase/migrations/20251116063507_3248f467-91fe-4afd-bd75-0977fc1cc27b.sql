-- Add visibility toggles to profile_content
ALTER TABLE public.profile_content
ADD COLUMN show_timeline boolean DEFAULT true,
ADD COLUMN show_projects boolean DEFAULT true,
ADD COLUMN show_webapps boolean DEFAULT true,
ADD COLUMN show_achievements boolean DEFAULT true,
ADD COLUMN show_youtube boolean DEFAULT true;

-- Create youtube_videos table
CREATE TABLE public.youtube_videos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  video_url text NOT NULL,
  display_order integer DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.youtube_videos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for youtube_videos
CREATE POLICY "Admins can manage youtube videos"
ON public.youtube_videos
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view published youtube videos"
ON public.youtube_videos
FOR SELECT
USING (is_published = true);

-- Add trigger for updated_at
CREATE TRIGGER update_youtube_videos_updated_at
BEFORE UPDATE ON public.youtube_videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();