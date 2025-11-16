import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  video_url: string;
}

const YouTube = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const { data, error } = await supabase
      .from('youtube_videos')
      .select('*')
      .eq('is_published', true)
      .order('display_order');
    
    if (error) {
      console.error('Error fetching videos:', error);
      return;
    }
    
    setVideos(data || []);
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  };

  if (videos.length === 0) return null;

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-12 text-center">Music & Creative Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <div key={video.id} className="bg-card rounded-lg overflow-hidden border border-border shadow-sm">
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={getYouTubeEmbedUrl(video.video_url)}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">{video.title}</h3>
                <p className="text-sm text-muted-foreground">{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default YouTube;
