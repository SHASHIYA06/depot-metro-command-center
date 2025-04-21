
import React from "react";
import { Building, MapPin } from "lucide-react";

interface MetroCityGridProps {
  metroCities: any[];
  selectedCity: string | null;
  setSelectedCity: (city: string | null) => void;
}

const MetroCityGrid = ({
  metroCities,
  selectedCity,
  setSelectedCity,
}: MetroCityGridProps) => (
  <div>
    <h2 className="text-xl font-semibold mb-2">Metro Systems by City</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {metroCities.map((city) => (
        <button
          key={city.id}
          className={`p-3 rounded-lg border transition-colors flex flex-col items-center
            ${selectedCity === city.name ? 
              "border-primary bg-primary/10 shadow-sm" : 
              "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}
          onClick={() => setSelectedCity(selectedCity === city.name ? null : city.name)}
        >
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center mb-1"
            style={{ backgroundColor: city.color + '20' }}
          >
            <Building className="h-4 w-4" style={{ color: city.color }} />
          </div>
          <span className="text-sm font-medium">{city.name}</span>
          <span className="text-xs text-muted-foreground mt-1 flex items-center">
            <MapPin className="h-3 w-3 mr-0.5" />
            {city.projects} projects
          </span>
        </button>
      ))}
    </div>
  </div>
);

export default MetroCityGrid;
