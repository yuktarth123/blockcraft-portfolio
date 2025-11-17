import { Switch } from "@/components/ui/switch";
import { Briefcase } from "lucide-react";

interface ProfessionalModeToggleProps {
  isProfessional: boolean;
  onToggle: (value: boolean) => void;
}

const ProfessionalModeToggle = ({ isProfessional, onToggle }: ProfessionalModeToggleProps) => {
  return (
    <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm border-2 border-border rounded-lg px-4 py-2 block-shadow-card">
      <Briefcase className="w-4 h-4 text-foreground" />
      <span className="text-sm font-medium text-foreground">Professional Mode</span>
      <Switch 
        checked={isProfessional} 
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-primary"
      />
    </div>
  );
};

export default ProfessionalModeToggle;
