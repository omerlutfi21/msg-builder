import { useState } from "react";
import { Template, sampleTemplates } from "@/types/template";
import { TemplateList } from "@/components/TemplateList";
import { TemplateConfigurator } from "@/components/TemplateConfigurator";

const Index = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {!selectedTemplate ? (
          <TemplateList 
            templates={sampleTemplates} 
            onSelectTemplate={setSelectedTemplate}
          />
        ) : (
          <TemplateConfigurator 
            template={selectedTemplate}
            onBack={() => setSelectedTemplate(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
