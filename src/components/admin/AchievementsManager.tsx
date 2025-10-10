import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Achievement {
  id: string;
  title: string;
  description: string;
  year: string;
  xp: number;
  icon_type: string;
  is_published: boolean;
}

const AchievementsManager = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);

  const emptyAchievement: Omit<Achievement, "id"> = {
    title: "",
    description: "",
    year: new Date().getFullYear().toString(),
    xp: 100,
    icon_type: "trophy",
    is_published: true,
  };

  const [formData, setFormData] = useState(emptyAchievement);

  const fetchAchievements = async () => {
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .order("display_order");

    if (error) {
      toast.error("Failed to load achievements");
      return;
    }

    setAchievements(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleSave = async () => {
    if (!formData.title || !formData.description || !formData.year) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingAchievement) {
      const { error } = await supabase
        .from("achievements")
        .update(formData)
        .eq("id", editingAchievement.id);

      if (error) {
        toast.error("Failed to update achievement");
        return;
      }

      toast.success("Achievement updated successfully");
    } else {
      const { error } = await supabase.from("achievements").insert([formData]);

      if (error) {
        toast.error("Failed to create achievement");
        return;
      }

      toast.success("Achievement created successfully");
    }

    setDialogOpen(false);
    setEditingAchievement(null);
    setFormData(emptyAchievement);
    fetchAchievements();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this achievement?")) return;

    const { error } = await supabase.from("achievements").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete achievement");
      return;
    }

    toast.success("Achievement deleted successfully");
    fetchAchievements();
  };

  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setFormData(achievement);
    setDialogOpen(true);
  };

  const handleNew = () => {
    setEditingAchievement(null);
    setFormData(emptyAchievement);
    setDialogOpen(true);
  };

  if (loading) {
    return <div className="text-center py-8 font-pixel">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-pixel text-primary">Manage Achievements</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNew} className="font-pixel">
              <Plus className="w-4 h-4 mr-2" />
              Add Achievement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-pixel">
                {editingAchievement ? "Edit Achievement" : "New Achievement"}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="xp">XP Points</Label>
                  <Input
                    id="xp"
                    type="number"
                    value={formData.xp}
                    onChange={(e) =>
                      setFormData({ ...formData, xp: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="icon_type">Icon Type</Label>
                <Select
                  value={formData.icon_type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, icon_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trophy">Trophy</SelectItem>
                    <SelectItem value="award">Award</SelectItem>
                    <SelectItem value="target">Target</SelectItem>
                    <SelectItem value="zap">Zap</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSave} className="w-full font-pixel">
                Save Achievement
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {achievements.map((achievement) => (
          <Card key={achievement.id} className="p-6 border-2">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-bold text-lg">{achievement.title}</h3>
                <p className="text-xs text-accent mb-2">{achievement.year}</p>
                <p className="text-sm text-muted-foreground">
                  {achievement.description}
                </p>
                <p className="text-sm text-primary font-pixel mt-2">
                  +{achievement.xp} XP
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(achievement)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(achievement.id)}
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

export default AchievementsManager;
