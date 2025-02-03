import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { FileSpreadsheet } from "lucide-react";

export const DataSourceDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
        >
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Data
        </Button>
      </DialogTrigger>
      <DialogTitle />
      <DialogDescription />
      <DialogContent className="max-w-[95vw] w-[95vw] h-[95vh] max-h-[95vh] p-0 gap-0">
        {/*<DataSourceDashboard />*/}
      </DialogContent>
    </Dialog>
  );
};
