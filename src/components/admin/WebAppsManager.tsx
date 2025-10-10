import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface WebApp {
  id: string;
  name: string;
  description: string;
  tech: string[];
  demo_url: string | null;
  github_url: string | null;
  is_published: boolean;
}

const WebAppsManager = () => {
  const [apps, setApps] = useState<WebApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<WebApp | null>(null);

  const emptyApp: Omit<WebApp, "id"> = {
    name: "",
    description: "",
    tech: [],
    demo_url: null,
    github_url: null,
    is_published: true,
  };

  const [formData, setFormData] = useState(emptyApp);

  const fetchApps = async () => {
    const { data, error } = await supabase
      .from("web_apps")
      .select("*")
      .order("display_order");

    if (error) {
      toast.error("Failed to load apps");
      return;
    }

    setApps(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleSave = async () => {
    if (!formData.name || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingApp) {
      const { error } = await supabase
        .from("web_apps")
        .update(formData)
        .eq("id", editingApp.id);

      if (error) {
        toast.error("Failed to update app");
        return;
      }

      toast.success("App updated successfully");
    } else {
      const { error } = await supabase.from("web_apps").insert([formData]);

      if (error) {
        toast.error("Failed to create app");
        return;
      }

      toast.success("App created successfully");
    }

    setDialogOpen(false);
    setEditingApp(null);
    setFormData(emptyApp);
    fetchApps();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this app?")) return;

    const { error } = await supabase.from("web_apps").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete app");
      return;
    }

    toast.success("App deleted successfully");
    fetchApps();
  };

  const handleEdit = (app: WebApp) => {
    setEditingApp(app);
    setFormData(app);
    setDialogOpen(true);
  };

  const handleNew = () => {
    setEditingApp(null);
    setFormData(emptyApp);
    setDialogOpen(true);
  };

  if (loading) {
    return <div className="text-center py-8 font-pixel">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-pixel text-primary">Manage Web Apps</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNew} className="font-pixel">
              <Plus className="w-4 h-4 mr-2" />
              Add App
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-pixel">
                {editingApp ? "Edit App" : "New App"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="tech">Tech Stack (comma-separated)</Label>
                <Input
                  id="tech"
                  value={formData.tech.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tech: e.target.value.split(",").map((t) => t.trim()),
                    })
                  }
                  placeholder="React, Node.js, PostgreSQL"
                />
              </div>
              <div>
                <Label htmlFor="demo_url">Demo URL</Label>
                <Input
                  id="demo_url"
                  value={formData.demo_url || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, demo_url: e.target.value || null })
                  }
                  placeholder="https://demo.example.com"
                />
              </div>
              <div>
                <Label htmlFor="github_url">GitHub URL</Label>
                <Input
                  id="github_url"
                  value={formData.github_url || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, github_url: e.target.value || null })
                  }
                  placeholder="https://github.com/username/repo"
                />
              </div>
              <Button onClick={handleSave} className="w-full font-pixel">
                Save App
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {apps.map((app) => (
          <Card key={app.id} className="p-6 border-2">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-bold text-lg">{app.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {app.description}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {app.tech.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-muted text-xs rounded font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(app)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(app.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WebAppsManager;
