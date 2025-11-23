import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut } from "lucide-react";
import ProfileEditor from "@/components/admin/ProfileEditor";
import TimelineEditor from "@/components/admin/TimelineEditor";
import ProjectsEditor from "@/components/admin/ProjectsEditor";
import WebAppsEditor from "@/components/admin/WebAppsEditor";
import AchievementsEditor from "@/components/admin/AchievementsEditor";
import YouTubeEditor from "@/components/admin/YouTubeEditor";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase.rpc("has_role", {
        _user_id: session.user.id,
        _role: "admin"
      });

      if (error) {
        console.error("Error checking admin role:", error);
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges. Please contact the administrator.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      if (!data) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges. Please contact the administrator.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error("Error:", error);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Portfolio Admin</h1>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="webapps">Web Apps</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="youtube">YouTube</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileEditor />
          </TabsContent>

          <TabsContent value="timeline">
            <TimelineEditor />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectsEditor />
          </TabsContent>

          <TabsContent value="webapps">
            <WebAppsEditor />
          </TabsContent>

          <TabsContent value="achievements">
            <AchievementsEditor />
          </TabsContent>

          <TabsContent value="youtube">
            <YouTubeEditor />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
