import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ProfileContent {
  id: string;
  tagline: string | null;
  about_text: string | null;
  resume_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  email: string | null;
}

const ProfileManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileId, setProfileId] = useState<string>("");
  const [formData, setFormData] = useState<Omit<ProfileContent, "id">>({
    tagline: "",
    about_text: "",
    resume_url: "",
    linkedin_url: "",
    github_url: "",
    email: "",
  });

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from("profile_content")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      toast.error("Failed to load profile");
      return;
    }

    if (data) {
      setProfileId(data.id);
      setFormData({
        tagline: data.tagline || "",
        about_text: data.about_text || "",
        resume_url: data.resume_url || "",
        linkedin_url: data.linkedin_url || "",
        github_url: data.github_url || "",
        email: data.email || "",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);

    const { error } = await supabase
      .from("profile_content")
      .update(formData)
      .eq("id", profileId);

    if (error) {
      toast.error("Failed to update profile");
      setSaving(false);
      return;
    }

    toast.success("Profile updated successfully");
    setSaving(false);
  };

  if (loading) {
    return <div className="text-center py-8 font-pixel">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-pixel text-primary">Edit Profile Content</h2>

      <Card className="p-6 border-2">
        <div className="space-y-4">
          <div>
            <Label htmlFor="tagline">Hero Tagline</Label>
            <Input
              id="tagline"
              value={formData.tagline || ""}
              onChange={(e) =>
                setFormData({ ...formData, tagline: e.target.value })
              }
              placeholder="Crafting Digital Experiences..."
            />
          </div>

          <div>
            <Label htmlFor="about_text">About Text</Label>
            <Textarea
              id="about_text"
              value={formData.about_text || ""}
              onChange={(e) =>
                setFormData({ ...formData, about_text: e.target.value })
              }
              rows={6}
              placeholder="Tell your story..."
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ""}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="your@email.com"
            />
          </div>

          <div>
            <Label htmlFor="resume_url">Resume URL</Label>
            <Input
              id="resume_url"
              value={formData.resume_url || ""}
              onChange={(e) =>
                setFormData({ ...formData, resume_url: e.target.value })
              }
              placeholder="https://example.com/resume.pdf"
            />
          </div>

          <div>
            <Label htmlFor="linkedin_url">LinkedIn URL</Label>
            <Input
              id="linkedin_url"
              value={formData.linkedin_url || ""}
              onChange={(e) =>
                setFormData({ ...formData, linkedin_url: e.target.value })
              }
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>

          <div>
            <Label htmlFor="github_url">GitHub URL</Label>
            <Input
              id="github_url"
              value={formData.github_url || ""}
              onChange={(e) =>
                setFormData({ ...formData, github_url: e.target.value })
              }
              placeholder="https://github.com/yourusername"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full font-pixel"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProfileManager;
