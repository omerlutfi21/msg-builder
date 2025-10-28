import { useState, useEffect } from "react";
import { Template, configurableItems, VariableMapping } from "@/types/template";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TemplatePreview } from "./TemplatePreview";
import { ArrowLeft, Settings, Save, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TemplateConfiguratorProps {
  template: Template;
  onBack: () => void;
}

export const TemplateConfigurator = ({ template, onBack }: TemplateConfiguratorProps) => {
  const [variableMapping, setVariableMapping] = useState<VariableMapping>({});
  const [variables, setVariables] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Extract variables from template
    const matches = template.bodyText.match(/{{(\w+)}}/g);
    if (matches) {
      const extractedVars = matches.map(match => match.replace(/{{|}}/g, ''));
      setVariables([...new Set(extractedVars)]);
      
      // Initialize mapping with empty values
      const initialMapping: VariableMapping = {};
      extractedVars.forEach(variable => {
        initialMapping[variable] = '';
      });
      setVariableMapping(initialMapping);
    }
  }, [template]);

  const handleVariableChange = (variable: string, value: string) => {
    setVariableMapping(prev => ({
      ...prev,
      [variable]: value,
    }));
  };

  const handleSave = () => {
    const allConfigured = variables.every(variable => variableMapping[variable]);
    
    if (!allConfigured) {
      toast({
        title: "Incomplete Configuration",
        description: "Please configure all variables before saving.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Template Configured!",
      description: "Your template configuration has been saved successfully.",
    });
    
    console.log("Saved configuration:", {
      template,
      variableMapping,
    });
  };

  const renderTemplateWithVariables = () => {
    const parts = template.bodyText.split(/{{(\w+)}}/g);
    
    return parts.map((part, index) => {
      if (variables.includes(part)) {
        return (
          <Badge 
            key={index} 
            variant="secondary" 
            className="bg-variable-light text-variable px-2 py-0.5 text-sm font-medium"
          >
            {`{{${part}}}`}
          </Badge>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Templates
        </Button>
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">{template.name}</h1>
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          {template.category}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Template Content
              </CardTitle>
              <CardDescription>
                Variables are highlighted in the text below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-card-foreground leading-relaxed whitespace-pre-wrap">
                  {renderTemplateWithVariables()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-accent" />
                Configure Variables
              </CardTitle>
              <CardDescription>
                Map each variable to a configurable item
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {variables.map((variable) => (
                <div key={variable} className="space-y-2">
                  <Label htmlFor={variable} className="text-sm font-medium">
                    {variable.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </Label>
                  <Select
                    value={variableMapping[variable] || ''}
                    onValueChange={(value) => handleVariableChange(variable, value)}
                  >
                    <SelectTrigger id={variable} className="w-full">
                      <SelectValue placeholder="Select a value..." />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      {configurableItems.map((item) => (
                        <SelectItem key={item.key} value={item.label}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <TemplatePreview bodyText={template.bodyText} variableMapping={variableMapping} />

          <Button 
            onClick={handleSave} 
            className="w-full gap-2 h-12 text-base font-semibold"
            size="lg"
          >
            <Save className="h-5 w-5" />
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
};
