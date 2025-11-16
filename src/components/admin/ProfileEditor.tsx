import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const ProfileEditor = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from("profile_content")
      .select("*")
      .maybeSingle();

    if (data) {
      setProfile(data);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profile_content")
        .update(profile)
        .eq("id", profile.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Content</CardTitle>
        <CardDescription>Manage your hero section, about, and contact information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold">Hero Section</h3>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="hero_title">Title</Label>
              <Input
                id="hero_title"
                value={profile.hero_title}
                onChange={(e) => setProfile({ ...profile, hero_title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="hero_subtitle">Subtitle</Label>
              <Input
                id="hero_subtitle"
                value={profile.hero_subtitle}
                onChange={(e) => setProfile({ ...profile, hero_subtitle: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="hero_avatar_url">Avatar URL</Label>
              <Input
                id="hero_avatar_url"
                value={profile.hero_avatar_url || ""}
                onChange={(e) => setProfile({ ...profile, hero_avatar_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="tagline">Tagline</Label>
              <Textarea
                id="tagline"
                value={profile.tagline}
                onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">About Section</h3>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="about_title">Section Title</Label>
              <Input
                id="about_title"
                value={profile.about_title}
                onChange={(e) => setProfile({ ...profile, about_title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="about_text">About Text</Label>
              <Textarea
                id="about_text"
                value={profile.about_text}
                onChange={(e) => setProfile({ ...profile, about_text: e.target.value })}
                rows={5}
              />
            </div>
            <div>
              <Label htmlFor="resume_url">Resume URL</Label>
              <Input
                id="resume_url"
                value={profile.resume_url || ""}
                onChange={(e) => setProfile({ ...profile, resume_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Contact Information</h3>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email || ""}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input
                id="linkedin_url"
                value={profile.linkedin_url || ""}
                onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div>
              <Label htmlFor="github_url">GitHub URL</Label>
              <Input
                id="github_url"
                value={profile.github_url || ""}
                onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                placeholder="https://github.com/..."
              />
            </div>
          </div>
        </div>
      </CardContent>

      <CardHeader>
        <CardTitle>Section Visibility</CardTitle>
        <CardDescription>Toggle which sections appear on your portfolio</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="show-timeline">Show Timeline</Label>
          <Switch
            id="show-timeline"
            checked={profile.show_timeline ?? true}
            onCheckedChange={(checked) => setProfile({...profile, show_timeline: checked})}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="show-projects">Show Projects</Label>
          <Switch
            id="show-projects"
            checked={profile.show_projects ?? true}
            onCheckedChange={(checked) => setProfile({...profile, show_projects: checked})}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="show-webapps">Show Web Apps</Label>
          <Switch
            id="show-webapps"
            checked={profile.show_webapps ?? true}
            onCheckedChange={(checked) => setProfile({...profile, show_webapps: checked})}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="show-achievements">Show Achievements</Label>
          <Switch
            id="show-achievements"
            checked={profile.show_achievements ?? true}
            onCheckedChange={(checked) => setProfile({...profile, show_achievements: checked})}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="show-youtube">Show YouTube Videos</Label>
          <Switch
            id="show-youtube"
            checked={profile.show_youtube ?? true}
            onCheckedChange={(checked) => setProfile({...profile, show_youtube: checked})}
          />
        </div>

        <Button onClick={handleSave} disabled={loading} className="mt-6">
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileEditor;
