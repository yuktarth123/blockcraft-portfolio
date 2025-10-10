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

interface Project {
  id: string;
  title: string;
  role: string;
  description: string;
  metrics: string[];
  tags: string[];
  color: string;
  is_published: boolean;
  display_order: number;
}

const ProjectsManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const emptyProject: Omit<Project, "id"> = {
    title: "",
    role: "",
    description: "",
    metrics: [],
    tags: [],
    color: "bg-primary/10 border-primary",
    is_published: true,
    display_order: 0,
  };

  const [formData, setFormData] = useState(emptyProject);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("display_order");

    if (error) {
      toast.error("Failed to load projects");
      return;
    }

    setProjects(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSave = async () => {
    if (!formData.title || !formData.role || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingProject) {
      const { error } = await supabase
        .from("projects")
        .update(formData)
        .eq("id", editingProject.id);

      if (error) {
        toast.error("Failed to update project");
        return;
      }

      toast.success("Project updated successfully");
    } else {
      const { error } = await supabase.from("projects").insert([formData]);

      if (error) {
        toast.error("Failed to create project");
        return;
      }

      toast.success("Project created successfully");
    }

    setDialogOpen(false);
    setEditingProject(null);
    setFormData(emptyProject);
    fetchProjects();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete project");
      return;
    }

    toast.success("Project deleted successfully");
    fetchProjects();
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData(project);
    setDialogOpen(true);
  };

  const handleNew = () => {
    setEditingProject(null);
    setFormData(emptyProject);
    setDialogOpen(true);
  };

  if (loading) {
    return <div className="text-center py-8 font-pixel">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-pixel text-primary">Manage Projects</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNew} className="font-pixel">
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-pixel">
                {editingProject ? "Edit Project" : "New Project"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="role">Role *</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
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
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="metrics">Metrics (comma-separated)</Label>
                <Input
                  id="metrics"
                  value={formData.metrics.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      metrics: e.target.value.split(",").map((m) => m.trim()),
                    })
                  }
                  placeholder="40% ↑ Engagement, 25% ↑ Retention"
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tags: e.target.value.split(",").map((t) => t.trim()),
                    })
                  }
                  placeholder="UX Research, A/B Testing"
                />
              </div>
              <div>
                <Label htmlFor="color">Color Class</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  placeholder="bg-primary/10 border-primary"
                />
              </div>
              <Button onClick={handleSave} className="w-full font-pixel">
                Save Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {projects.map((project) => (
          <Card key={project.id} className="p-6 border-2">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-bold text-lg">{project.title}</h3>
                <p className="text-sm text-accent mb-2">{project.role}</p>
                <p className="text-sm text-muted-foreground">
                  {project.description}
                </p>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-secondary text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(project)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(project.id)}
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

export default ProjectsManager;
