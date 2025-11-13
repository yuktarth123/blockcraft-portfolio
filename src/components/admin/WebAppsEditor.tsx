import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

interface WebApp {
  id?: string;
  name: string;
  description: string;
  tech: string[];
  demo_url: string | null;
  github_url: string | null;
  display_order: number;
  is_published: boolean;
}

const WebAppsEditor = () => {
  const { toast } = useToast();
  const [apps, setApps] = useState<WebApp[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    const { data } = await supabase.from("web_apps").select("*").order("display_order");
    if (data) setApps(data);
  };

  const handleAdd = () => {
    setApps([
      ...apps,
      {
        name: "",
        description: "",
        tech: [],
        demo_url: null,
        github_url: null,
        display_order: apps.length,
        is_published: true,
      },
    ]);
  };

  const handleUpdate = (index: number, field: keyof WebApp, value: any) => {
    const updated = [...apps];
    updated[index] = { ...updated[index], [field]: value };
    setApps(updated);
  };

  const handleDelete = async (index: number, id?: string) => {
    if (id) {
      await supabase.from("web_apps").delete().eq("id", id);
    }
    setApps(apps.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      for (const app of apps) {
        if (app.id) {
          await supabase.from("web_apps").update(app).eq("id", app.id);
        } else {
          await supabase.from("web_apps").insert(app);
        }
      }
      toast({ title: "Success", description: "Web apps updated successfully" });
      fetchApps();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Web Applications</CardTitle>
        <CardDescription>Manage your web app portfolio</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {apps.map((app, index) => (
          <Card key={index}>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between">
                <h4 className="font-semibold">App {index + 1}</h4>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(index, app.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid gap-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={app.name}
                    onChange={(e) => handleUpdate(index, "name", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={app.description}
                    onChange={(e) => handleUpdate(index, "description", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Technologies (comma-separated)</Label>
                  <Input
                    value={app.tech.join(", ")}
                    onChange={(e) => handleUpdate(index, "tech", e.target.value.split(",").map(s => s.trim()))}
                  />
                </div>
                <div>
                  <Label>Demo URL</Label>
                  <Input
                    value={app.demo_url || ""}
                    onChange={(e) => handleUpdate(index, "demo_url", e.target.value)}
                  />
                </div>
                <div>
                  <Label>GitHub URL</Label>
                  <Input
                    value={app.github_url || ""}
                    onChange={(e) => handleUpdate(index, "github_url", e.target.value)}
                  />
                </div>
                <Label>
                  <input
                    type="checkbox"
                    checked={app.is_published}
                    onChange={(e) => handleUpdate(index, "is_published", e.target.checked)}
                    className="mr-2"
                  />
                  Published
                </Label>
              </div>
            </CardContent>
          </Card>
        ))}
        <div className="flex gap-4">
          <Button onClick={handleAdd} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add App
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save All"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebAppsEditor;
