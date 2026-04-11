import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateProject } from "@/hooks/useProjects";
import type { Project } from "@/hooks/useProjects";
import { Plus, X, Users, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Props {
  project: Project;
  onClose: () => void;
}

export function EditProjectForm({ project, onClose }: Props) {
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [techInput, setTechInput] = useState("");
  const [technologies, setTechnologies] = useState<string[]>(project.technologies || []);
  const [memberInput, setMemberInput] = useState("");
  const [teamMembers, setTeamMembers] = useState<string[]>(project.team_members || []);
  const updateProject = useUpdateProject();

  const addTech = () => {
    const t = techInput.trim();
    if (t && !technologies.includes(t) && technologies.length < 20) {
      setTechnologies([...technologies, t]);
      setTechInput("");
    }
  };

  const addMember = () => {
    const m = memberInput.trim();
    if (m && !teamMembers.includes(m) && teamMembers.length < 20) {
      setTeamMembers([...teamMembers, m]);
      setMemberInput("");
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required");
      return;
    }
    try {
      await updateProject.mutateAsync({
        id: project.id,
        title: title.trim(),
        description: description.trim(),
        technologies,
        team_members: teamMembers,
      });
      toast.success("Project updated!");
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update project");
    }
  };

  return (
    <div className="space-y-4 p-4 rounded-lg bg-secondary/50">
      <h4 className="text-sm font-semibold text-foreground">Edit Project</h4>
      <Input placeholder="Project title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} className="bg-background" />
      <Textarea placeholder="Project description" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={2000} rows={3} className="bg-background" />
      <div className="flex gap-2">
        <Input
          placeholder="Add technology"
          value={techInput}
          onChange={(e) => setTechInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
          maxLength={50}
          className="bg-background"
        />
        <Button size="icon" variant="outline" onClick={addTech}><Plus size={16} /></Button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {technologies.map((t) => (
          <Badge key={t} variant="secondary" className="gap-1 cursor-pointer" onClick={() => setTechnologies(technologies.filter((x) => x !== t))}>
            {t} <X size={12} />
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Add team member"
          value={memberInput}
          onChange={(e) => setMemberInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addMember())}
          maxLength={100}
          className="bg-background"
        />
        <Button size="icon" variant="outline" onClick={addMember}><Users size={16} /></Button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {teamMembers.map((m) => (
          <Badge key={m} variant="outline" className="gap-1 cursor-pointer" onClick={() => setTeamMembers(teamMembers.filter((x) => x !== m))}>
            {m} <X size={12} />
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSubmit} disabled={updateProject.isPending} className="gap-2">
          <Save size={14} /> Save
        </Button>
        <Button size="sm" variant="ghost" onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );
}
