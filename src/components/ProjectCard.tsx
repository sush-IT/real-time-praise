import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/StarRating";
import { RatingDistribution } from "@/components/RatingDistribution";
import { EditProjectForm } from "@/components/EditProjectForm";
import { useProjectRatings, useAddRating } from "@/hooks/useProjects";
import type { Project } from "@/hooks/useProjects";
import { MessageSquare, Send, Trash2, LogIn, Users, Pencil } from "lucide-react";
import { toast } from "sonner";

interface Props {
  project: Project;
  isAdmin?: boolean;
  userId?: string;
  onLogin?: () => void;
  onDelete?: () => void;
}

export function ProjectCard({ project, isAdmin, userId, onLogin, onDelete }: Props) {
  const { data: ratings = [] } = useProjectRatings(project.id);
  const addRating = useAddRating();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const userExistingRating = userId
    ? ratings.find((r) => r.user_id === userId)
    : null;

  const handleSubmit = async () => {
    if (!userId) { onLogin?.(); return; }
    if (rating === 0) { toast.error("Please select a rating"); return; }
    const trimmedComment = comment.trim();
    if (trimmedComment.length > 1000) { toast.error("Comment too long"); return; }

    try {
      await addRating.mutateAsync({
        project_id: project.id,
        rating,
        user_id: userId,
        reviewer_name: "User",
        comment: trimmedComment || null,
      });
      setRating(0); setComment(""); setShowForm(false);
      toast.success("Rating submitted!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit rating");
    }
  };

  return (
    <div className="glass rounded-xl p-6 space-y-4 transition-all duration-300 hover:glow-primary">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-foreground">{project.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
        </div>
        {isAdmin && (
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => setShowEdit(!showEdit)} className="text-muted-foreground hover:text-foreground">
              <Pencil size={16} />
            </Button>
            {onDelete && (
              <Button variant="ghost" size="icon" onClick={onDelete} className="text-destructive hover:text-destructive">
                <Trash2 size={16} />
              </Button>
            )}
          </div>
        )}
      </div>

      {showEdit && isAdmin && (
        <EditProjectForm project={project} onClose={() => setShowEdit(false)} />
      )}

      <div className="flex flex-wrap gap-1.5">
        {project.technologies.map((tech) => (
          <Badge key={tech} variant="secondary" className="text-xs bg-secondary text-secondary-foreground">
            {tech}
          </Badge>
        ))}
      </div>

      {project.team_members && project.team_members.length > 0 && (
        <div className="flex flex-wrap gap-1.5 items-center">
          <Users size={14} className="text-muted-foreground" />
          {project.team_members.map((member) => (
            <Badge key={member} variant="outline" className="text-xs">
              {member}
            </Badge>
          ))}
        </div>
      )}

      <RatingDistribution ratings={ratings} />

      {userExistingRating ? (
        <div className="text-xs text-muted-foreground p-2 rounded bg-secondary/30">
          You rated this project <StarRating value={userExistingRating.rating} readonly size={12} />
        </div>
      ) : !showForm ? (
        userId ? (
          <Button variant="outline" size="sm" onClick={() => setShowForm(true)} className="gap-2">
            <MessageSquare size={14} /> Rate this project
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={onLogin} className="gap-2">
            <LogIn size={14} /> Sign in to rate
          </Button>
        )
      ) : (
        <div className="space-y-3 p-4 rounded-lg bg-secondary/50">
          <StarRating value={rating} onChange={setRating} size={24} />
          <Textarea
            placeholder="Write a comment (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={1000}
            rows={2}
            className="bg-background"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSubmit} disabled={addRating.isPending} className="gap-2">
              <Send size={14} /> Submit
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {ratings.length > 0 && (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          <p className="text-xs font-medium text-muted-foreground">Recent Reviews ({ratings.length})</p>
          {ratings.slice(0, 5).map((r) => (
            <div key={r.id} className="text-xs p-2 rounded bg-secondary/30 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">{r.reviewer_name}</span>
                <StarRating value={r.rating} readonly size={12} />
              </div>
              {r.comment && <p className="text-muted-foreground">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
