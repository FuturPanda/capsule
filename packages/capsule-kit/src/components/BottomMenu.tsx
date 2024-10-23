import {
  Briefcase,
  FileText,
  MessageSquare,
  Monitor,
  User,
  X,
} from "lucide-react";
import { Button } from "./ui/button";

export const BottomMenu = () => {
  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 bg-opacity-80 rounded-full p-2 flex gap-2">
      <Button variant="ghost" size="icon">
        <User className="h-4 w-4 text-white" />
      </Button>
      <Button variant="ghost" size="icon">
        <Briefcase className="h-4 w-4 text-white" />
      </Button>
      <Button variant="ghost" size="icon">
        <FileText className="h-4 w-4 text-white" />
      </Button>
      <Button variant="ghost" size="icon">
        <MessageSquare className="h-4 w-4 text-white" />
      </Button>
      <Button variant="ghost" size="icon">
        <Monitor className="h-4 w-4 text-white" />
      </Button>
      <Button variant="ghost" size="icon">
        <X className="h-4 w-4 text-white" />
      </Button>
    </div>
  );
};
