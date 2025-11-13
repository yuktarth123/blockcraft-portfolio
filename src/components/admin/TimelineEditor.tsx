import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

interface TimelineItem {
  id?: string;
  year: string;
  title: string;
  description: string;
  icon_type: string;
  display_order: number;
  is_published: boolean;
}

const TimelineEditor = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("timeline_items")
      .select("*")
      .order("display_order");

    if (data) {
      setItems(data);
    }
  };

  const handleAdd = () => {
    setItems([
      ...items,
      {
        year: "",
        title: "",
        description: "",
        icon_type: "briefcase",
        display_order: items.length,
        is_published: true,
      },
    ]);
  };

  const handleUpdate = (index: number, field: keyof TimelineItem, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleDelete = async (index: number, id?: string) => {
    if (id) {
      const { error } = await supabase.from("timeline_items").delete().eq("id", id);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      for (const item of items) {
        if (item.id) {
          await supabase.from("timeline_items").update(item).eq("id", item.id);
        } else {
          await supabase.from("timeline_items").insert(item);
        }
      }

      toast({ title: "Success", description: "Timeline updated successfully" });
      fetchItems();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline Items</CardTitle>
        <CardDescription>Manage your professional experience timeline</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {items.map((item, index) => (
          <Card key={index}>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold">Item {index + 1}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(index, item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid gap-4">
                <div>
                  <Label>Year/Period</Label>
                  <Input
                    value={item.year}
                    onChange={(e) => handleUpdate(index, "year", e.target.value)}
                    placeholder="2023 - Present"
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={item.title}
                    onChange={(e) => handleUpdate(index, "title", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={item.description}
                    onChange={(e) => handleUpdate(index, "description", e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Label>
                    <input
                      type="checkbox"
                      checked={item.is_published}
                      onChange={(e) => handleUpdate(index, "is_published", e.target.checked)}
                      className="mr-2"
                    />
                    Published
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex gap-4">
          <Button onClick={handleAdd} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save All"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimelineEditor;
