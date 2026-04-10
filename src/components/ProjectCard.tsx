import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/StarRating";
import { RatingDistribution } from "@/components/RatingDistribution";
import { useProjectRatings, useAddRating } from "@/hooks/useProjects";
import type { Project } from "@/hooks/useProjects";
import { MessageSquare, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  project: Project;
  isAdmin?: boolean;
  onDelete?: () => void;
}

export function ProjectCard({ project, isAdmin, onDelete }: Props) {
  const { data: ratings = [] } = useProjectRatings(project.id);
  const addRating = useAddRating();
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) { toast.error("Please select a rating"); return; }
    const trimmedName = name.trim();
    if (trimmedName.length > 100) { toast.error("Name too long"); return; }
    const trimmedComment = comment.trim();
    if (trimmedComment.length > 1000) { toast.error("Comment too long"); return; }

    await addRating.mutateAsync({
      project_id: project.id,
      rating,
      reviewer_name: trimmedName || "Anonymous",
      comment: trimmedComment || null,
    });
    setRating(0); setName(""); setComment(""); setShowForm(false);
    toast.success("Rating submitted!");
  };

  return (
    <div className="glass rounded-xl p-6 space-y-4 transition-all duration-300 hover:glow-primary">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-foreground">{project.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
        </div>
        {isAdmin && onDelete && (
          <Button variant="ghost" size="icon" onClick={onDelete} className="text-destructive hover:text-destructive">
            <Trash2 size={16} />
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {project.technologies.map((tech) => (
          <Badge key={tech} variant="secondary" className="text-xs bg-secondary text-secondary-foreground">
            {tech}
          </Badge>
        ))}
      </div>

      <RatingDistribution ratings={ratings} />

      {!showForm ? (
        <Button variant="outline" size="sm" onClick={() => setShowForm(true)} className="gap-2">
          <MessageSquare size={14} /> Rate this project
        </Button>
      ) : (
        <div className="space-y-3 p-4 rounded-lg bg-secondary/50">
          <StarRating value={rating} onChange={setRating} size={24} />
          <Input
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            className="bg-background"
          />
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
          <p className="text-xs font-medium text-muted-foreground">Recent Reviews</p>
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
