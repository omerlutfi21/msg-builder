import { useState, useEffect } from "react";
import { Template, configurableItems, VariableMapping } from "@/types/template";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WhatsAppTemplatePreview } from "./WhatsAppTemplatePreview";
import { ArrowLeft, Settings, Save, MessageSquare, Image, FileText, MousePointerClick } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface TemplateConfiguratorProps {
  template: Template;
  onBack: () => void;
}

export const TemplateConfigurator = ({ template, onBack }: TemplateConfiguratorProps) => {
  const [variableMapping, setVariableMapping] = useState<VariableMapping>({});
  const [variables, setVariables] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Extract variables from all parts of the template
    const allText = [
      template.bodyText,
      template.header?.text || '',
      ...(template.buttons?.map(b => b.url || '') || []),
    ].join(' ');
    
    const matches = allText.match(/{{(\w+)}}/g);
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

  const renderTextWithVariables = (text: string) => {
    const parts = text.split(/{{(\w+)}}/g);
    
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
                Template Structure
              </CardTitle>
              <CardDescription>
                Variables are highlighted in the text below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Header */}
              {template.header && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    {template.header.type === 'IMAGE' ? (
                      <Image className="h-4 w-4" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                    HEADER ({template.header.type})
                  </div>
                  {template.header.type === 'IMAGE' && template.header.mediaUrl ? (
                    <img 
                      src={template.header.mediaUrl} 
                      alt="Header preview"
                      className="w-full h-32 object-cover rounded-lg border border-border"
                    />
                  ) : template.header.text ? (
                    <div className="bg-muted/50 p-3 rounded-lg text-sm">
                      {renderTextWithVariables(template.header.text)}
                    </div>
                  ) : null}
                </div>
              )}

              {/* Body */}
              <div className="space-y-2">
                <div className="text-sm font-semibold text-muted-foreground">BODY</div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-card-foreground leading-relaxed whitespace-pre-wrap text-sm">
                    {renderTextWithVariables(template.bodyText)}
                  </p>
                </div>
              </div>

              {/* Footer */}
              {template.footer && (
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-muted-foreground">FOOTER</div>
                  <div className="bg-muted/50 p-3 rounded-lg text-xs text-muted-foreground">
                    {template.footer}
                  </div>
                </div>
              )}

              {/* Buttons */}
              {template.buttons && template.buttons.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <MousePointerClick className="h-4 w-4" />
                    BUTTONS ({template.buttons.length})
                  </div>
                  <div className="space-y-2">
                    {template.buttons.map((button, index) => (
                      <div key={index} className="bg-muted/50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{button.text}</span>
                          <Badge variant="outline" className="text-xs">
                            {button.type}
                          </Badge>
                        </div>
                        {button.url && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {renderTextWithVariables(button.url)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
          <WhatsAppTemplatePreview template={template} variableMapping={variableMapping} />

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
