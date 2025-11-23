import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

interface Project {
  id?: string;
  title: string;
  role: string;
  description: string;
  metrics: string[];
  tags: string[];
  color: string;
  display_order: number;
  is_published: boolean;
}

const ProjectsEditor = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("display_order");
    if (data) setProjects(data);
  };

  const handleAdd = () => {
    setProjects([
      ...projects,
      {
        title: "",
        role: "",
        description: "",
        metrics: [],
        tags: [],
        color: "bg-primary/10 border-primary",
        display_order: projects.length,
        is_published: true,
      },
    ]);
  };

  const handleUpdate = (index: number, field: keyof Project, value: any) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    setProjects(updated);
  };

  const handleDelete = async (index: number, id?: string) => {
    if (id) {
      await supabase.from("projects").delete().eq("id", id);
    }
    setProjects(projects.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      for (const project of projects) {
        if (project.id) {
          await supabase.from("projects").update(project).eq("id", project.id);
        } else {
          await supabase.from("projects").insert(project);
        }
      }
      toast({ title: "Success", description: "Projects updated successfully" });
      fetchProjects();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects</CardTitle>
        <CardDescription>Manage your portfolio projects</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {projects.map((project, index) => (
          <Card key={index}>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between">
                <h4 className="font-semibold">Project {index + 1}</h4>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(index, project.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid gap-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={project.title}
                    onChange={(e) => handleUpdate(index, "title", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Role</Label>
                  <Input
                    value={project.role}
                    onChange={(e) => handleUpdate(index, "role", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={project.description}
                    onChange={(e) => handleUpdate(index, "description", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Metrics (comma-separated)</Label>
                  <Input
                    value={project.metrics.join(", ")}
                    onChange={(e) => handleUpdate(index, "metrics", e.target.value.split(",").map(s => s.trim()))}
                  />
                </div>
                <div>
                  <Label>Tags (comma-separated)</Label>
                  <Input
                    value={project.tags.join(", ")}
                    onChange={(e) => handleUpdate(index, "tags", e.target.value.split(",").map(s => s.trim()))}
                  />
                </div>
                <div>
                  <Label>Color Classes</Label>
                  <Input
                    value={project.color}
                    onChange={(e) => handleUpdate(index, "color", e.target.value)}
                    placeholder="bg-primary/10 border-primary"
                  />
                </div>
                <Label>
                  <input
                    type="checkbox"
                    checked={project.is_published}
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
            Add Project
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save All"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectsEditor;
