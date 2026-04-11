import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/ProjectCard";
import { AddProjectForm } from "@/components/AddProjectForm";
import { AuthDialog } from "@/components/AuthDialog";
import { RatingCriteria } from "@/components/RatingCriteria";
import { useProjects, useDeleteProject } from "@/hooks/useProjects";
import { useAuth } from "@/hooks/useAuth";
import { Plus, LogIn, LogOut, BarChart3, User } from "lucide-react";


const Index = () => {
  const { data: projects = [], isLoading } = useProjects();
  const { user, isAdmin, signOut } = useAuth();
  const deleteProject = useDeleteProject();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="min-h-screen bg-background">

      <header className="border-b border-border sticky top-0 z-50 glass">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="text-primary" size={28} />
            <h1 className="text-xl font-bold gradient-text">ProjectRate</h1>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button size="sm" onClick={() => setShowAddForm(true)} className="gap-2">
                <Plus size={14} /> Add Project
              </Button>
            )}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <User size={12} />
                  {user.email}
                </span>
                <Button size="sm" variant="ghost" onClick={() => signOut()} className="gap-2 text-muted-foreground">
                  <LogOut size={14} /> Logout
                </Button>
              </div>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setShowAuth(true)} className="gap-2">
                <LogIn size={14} /> Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="text-center space-y-2 py-8">
          <h2 className="text-4xl font-bold gradient-text">Rate & Review Projects</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Real-time project reviews with live analytics. Sign in to rate projects and see how others feel — instantly.
          </p>
        </div>

        {showAddForm && isAdmin && (
          <AddProjectForm onClose={() => setShowAddForm(false)} />
        )}

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass rounded-xl p-6 h-64 animate-pulse" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">No projects yet</p>
            <p className="text-sm">Admin can add projects to get started</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isAdmin={isAdmin}
                userId={user?.id}
                onLogin={() => setShowAuth(true)}
                onDelete={() => deleteProject.mutate(project.id)}
              />
            ))}
          </div>
        )}

        {/* Rating Criteria at Bottom */}
        <RatingCriteria />
      </main>

      <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
    </div>
  );
};

export default Index;
