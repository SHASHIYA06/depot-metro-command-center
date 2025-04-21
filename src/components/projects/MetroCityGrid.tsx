
import React from "react";
import { Building } from "lucide-react";

const MetroCityGrid = ({
  metroCities,
  selectedCity,
  setSelectedCity,
}: {
  metroCities: any[];
  selectedCity: string | null;
  setSelectedCity: (city: string | null) => void;
}) => (
  <div>
    <h2 className="text-xl font-semibold mb-2">Metro Systems by City</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {metroCities.map((city) => (
        <button
          key={city.id}
          className={`p-2 rounded-lg text-sm text-center border transition-colors
            ${selectedCity === city.name ? "border-primary bg-primary/10" : "border-gray-200 hover:border-gray-300"}`}
          onClick={() => setSelectedCity(selectedCity === city.name ? null : city.name)}
        >
          <span className="text-xs block mb-1 text-muted-foreground">{city.projects} projects</span>
          <span className="font-medium">{city.name}</span>
        </button>
      ))}
    </div>
  </div>
);

export default MetroCityGrid;
