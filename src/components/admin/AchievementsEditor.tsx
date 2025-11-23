import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

interface Achievement {
  id?: string;
  title: string;
  description: string;
  year: string;
  xp: number;
  icon_type: string;
  display_order: number;
  is_published: boolean;
}

const AchievementsEditor = () => {
  const { toast } = useToast();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    const { data } = await supabase.from("achievements").select("*").order("display_order");
    if (data) setAchievements(data);
  };

  const handleAdd = () => {
    setAchievements([
      ...achievements,
      {
        title: "",
        description: "",
        year: "",
        xp: 0,
        icon_type: "trophy",
        display_order: achievements.length,
        is_published: true,
      },
    ]);
  };

  const handleUpdate = (index: number, field: keyof Achievement, value: any) => {
    const updated = [...achievements];
    updated[index] = { ...updated[index], [field]: value };
    setAchievements(updated);
  };

  const handleDelete = async (index: number, id?: string) => {
    if (id) {
      await supabase.from("achievements").delete().eq("id", id);
    }
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      for (const achievement of achievements) {
        if (achievement.id) {
          await supabase.from("achievements").update(achievement).eq("id", achievement.id);
        } else {
          await supabase.from("achievements").insert(achievement);
        }
      }
      toast({ title: "Success", description: "Achievements updated successfully" });
      fetchAchievements();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements</CardTitle>
        <CardDescription>Manage your achievements with XP levels</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {achievements.map((achievement, index) => (
          <Card key={index}>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between">
                <h4 className="font-semibold">Achievement {index + 1}</h4>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(index, achievement.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid gap-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={achievement.title}
                    onChange={(e) => handleUpdate(index, "title", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={achievement.description}
                    onChange={(e) => handleUpdate(index, "description", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Year</Label>
                    <Input
                      value={achievement.year}
                      onChange={(e) => handleUpdate(index, "year", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>XP (Experience Points)</Label>
                    <Input
                      type="number"
                      value={achievement.xp}
                      onChange={(e) => handleUpdate(index, "xp", parseInt(e.target.value) || 0)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Level: {Math.floor(achievement.xp / 100) + 1}
                    </p>
                  </div>
                </div>
                <div>
                  <Label>Icon Type</Label>
                  <Input
                    value={achievement.icon_type}
                    onChange={(e) => handleUpdate(index, "icon_type", e.target.value)}
                    placeholder="trophy, star, award, medal"
                  />
                </div>
                <Label>
                  <input
                    type="checkbox"
                    checked={achievement.is_published}
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
            Add Achievement
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save All"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementsEditor;
