import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface YouTubeVideo {
  id?: string;
  title: string;
  description: string;
  video_url: string;
  display_order: number;
  is_published: boolean;
}

const YouTubeEditor = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const { data, error } = await supabase
      .from('youtube_videos')
      .select('*')
      .order('display_order');
    
    if (error) {
      console.error('Error fetching videos:', error);
      return;
    }
    
    setVideos(data || []);
  };

  const handleAdd = () => {
    setVideos([...videos, {
      title: '',
      description: '',
      video_url: '',
      display_order: videos.length,
      is_published: true
    }]);
  };

  const handleUpdate = (index: number, field: keyof YouTubeVideo, value: any) => {
    const updated = [...videos];
    updated[index] = { ...updated[index], [field]: value };
    setVideos(updated);
  };

  const handleDelete = async (index: number) => {
    const video = videos[index];
    if (video.id) {
      const { error } = await supabase
        .from('youtube_videos')
        .delete()
        .eq('id', video.id);
      
      if (error) {
        console.error('Error deleting video:', error);
        return;
      }
    }
    
    const updated = videos.filter((_, i) => i !== index);
    setVideos(updated);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      for (const video of videos) {
        if (video.id) {
          const { error } = await supabase
            .from('youtube_videos')
            .update(video)
            .eq('id', video.id);
          
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('youtube_videos')
            .insert(video);
          
          if (error) throw error;
        }
      }
      
      toast({
        title: "Success",
        description: "YouTube videos saved successfully",
      });
      
      await fetchVideos();
    } catch (error) {
      console.error('Error saving videos:', error);
      toast({
        title: "Error",
        description: "Failed to save videos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>YouTube Videos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {videos.map((video, index) => (
          <Card key={index}>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={video.title}
                  onChange={(e) => handleUpdate(index, 'title', e.target.value)}
                  placeholder="Video title"
                />
              </div>
              
              <div>
                <Label>Description</Label>
                <Textarea
                  value={video.description}
                  onChange={(e) => handleUpdate(index, 'description', e.target.value)}
                  placeholder="Video description"
                />
              </div>
              
              <div>
                <Label>YouTube URL</Label>
                <Input
                  value={video.video_url}
                  onChange={(e) => handleUpdate(index, 'video_url', e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`published-${index}`}
                  checked={video.is_published}
                  onCheckedChange={(checked) => handleUpdate(index, 'is_published', checked)}
                />
                <Label htmlFor={`published-${index}`}>Published</Label>
              </div>
              
              <Button onClick={() => handleDelete(index)} variant="destructive">
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
        
        <div className="flex gap-4">
          <Button onClick={handleAdd}>Add Video</Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save All"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default YouTubeEditor;
