
import React from "react";
import { Map } from "lucide-react";
import { Button } from "@/components/ui/button";

const MapViewPlaceholder = ({ onReturn }: { onReturn: () => void }) => (
  <div className="border rounded-lg p-4 h-96 flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <Map className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium">Map View Coming Soon</h3>
      <p className="text-muted-foreground mt-1">
        Interactive map of metro projects will be available soon.
      </p>
      <Button
        variant="outline"
        className="mt-4"
        onClick={onReturn}
      >
        Return to Grid View
      </Button>
    </div>
  </div>
);

export default MapViewPlaceholder;
