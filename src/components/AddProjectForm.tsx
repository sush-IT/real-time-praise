import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAddProject } from "@/hooks/useProjects";
import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function AddProjectForm({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techInput, setTechInput] = useState("");
  const [technologies, setTechnologies] = useState<string[]>([]);
  const addProject = useAddProject();

  const addTech = () => {
    const t = techInput.trim();
    if (t && !technologies.includes(t) && technologies.length < 20) {
      setTechnologies([...technologies, t]);
      setTechInput("");
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required");
      return;
    }
    await addProject.mutateAsync({
      title: title.trim(),
      description: description.trim(),
      technologies,
    });
    toast.success("Project added!");
    onClose();
  };

  return (
    <div className="glass rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold gradient-text">Add New Project</h3>
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
        <Button onClick={handleSubmit} disabled={addProject.isPending}>Add Project</Button>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );
}
