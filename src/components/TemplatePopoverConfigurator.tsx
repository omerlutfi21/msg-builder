import { useState, useEffect } from "react";
import { Template, configurableItems, sampleTemplates, VariableMapping } from "@/types/template";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MessageSquare, Settings, Check, Phone, ExternalLink, MessageCircle, Image, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export const TemplatePopoverConfigurator = () => {
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [variableMapping, setVariableMapping] = useState<VariableMapping>({});
  const [variables, setVariables] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedTemplate) {
      // Extract variables from all parts of the template
      const allText = [
        selectedTemplate.bodyText,
        selectedTemplate.header?.text || '',
        ...(selectedTemplate.buttons?.map(b => b.url || '') || []),
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
      } else {
        setVariables([]);
        setVariableMapping({});
      }
    }
  }, [selectedTemplate]);

  const handleVariableChange = (variable: string, value: string) => {
    setVariableMapping(prev => ({
      ...prev,
      [variable]: value,
    }));
  };

  const handleSave = () => {
    if (!selectedTemplate) {
      toast({
        title: "No Template Selected",
        description: "Please select a template first.",
        variant: "destructive",
      });
      return;
    }

    const allConfigured = variables.every(variable => variableMapping[variable]);
    
    if (variables.length > 0 && !allConfigured) {
      toast({
        title: "Incomplete Configuration",
        description: "Please configure all variables before saving.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Template Configured!",
      description: `${selectedTemplate.name} has been configured successfully.`,
    });
    
    console.log("Saved configuration:", {
      template: selectedTemplate,
      variableMapping,
    });
    
    setOpen(false);
  };

  const replaceVariables = (text: string) => {
    let result = text;
    Object.keys(variableMapping).forEach((variable) => {
      const mappedValue = variableMapping[variable];
      const displayValue = mappedValue ? `<${mappedValue}>` : `{{${variable}}}`;
      result = result.replace(new RegExp(`{{${variable}}}`, 'g'), displayValue);
    });
    return result;
  };

  const renderTextWithVariables = (text: string) => {
    const processedText = replaceVariables(text);
    const parts = processedText.split(/(<[^>]+>)/g);
    
    return parts.map((part, index) => {
      if (part.match(/<[^>]+>/)) {
        return (
          <Badge 
            key={index} 
            variant="secondary" 
            className="bg-variable-light text-variable px-1.5 py-0.5 text-xs font-medium"
          >
            {part}
          </Badge>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const getButtonIcon = (type: string) => {
    switch (type) {
      case 'PHONE_NUMBER':
        return <Phone className="h-3 w-3" />;
      case 'URL':
        return <ExternalLink className="h-3 w-3" />;
      case 'QUICK_REPLY':
        return <MessageCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="default" className="gap-2">
          <MessageSquare className="h-4 w-4" />
          Configure Template
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] p-0 bg-popover" align="start">
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Template Configurator</h3>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Select and configure your WhatsApp template
          </p>
        </div>

        <ScrollArea className="h-[600px]">
          <div className="p-4 space-y-4">
            {/* Template Selection */}
            <div className="space-y-2">
              <Label htmlFor="template-select" className="text-sm font-medium">
                Select Template
              </Label>
              <Select
                value={selectedTemplate?.id || ''}
                onValueChange={(value) => {
                  const template = sampleTemplates.find(t => t.id === value);
                  setSelectedTemplate(template || null);
                }}
              >
                <SelectTrigger id="template-select" className="w-full">
                  <SelectValue placeholder="Choose a template..." />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {sampleTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-3 w-3" />
                        {template.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedTemplate && (
              <>
                <Separator />

                {/* Preview */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Preview</Label>
                  <div className="bg-card rounded-lg border border-border/50 overflow-hidden shadow-sm">
                    {/* Header */}
                    {selectedTemplate.header && (
                      <div className="border-b border-border/50">
                        {selectedTemplate.header.type === 'IMAGE' && selectedTemplate.header.mediaUrl ? (
                          <img 
                            src={selectedTemplate.header.mediaUrl} 
                            alt="Header"
                            className="w-full h-32 object-cover"
                          />
                        ) : selectedTemplate.header.type === 'TEXT' && selectedTemplate.header.text ? (
                          <div className="p-3 bg-muted/30 flex items-center gap-2">
                            <FileText className="h-3 w-3 text-muted-foreground" />
                            <p className="font-semibold text-sm">
                              {renderTextWithVariables(selectedTemplate.header.text)}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    )}

                    {/* Body */}
                    <div className="p-3 space-y-2">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {renderTextWithVariables(selectedTemplate.bodyText)}
                      </p>

                      {/* Footer */}
                      {selectedTemplate.footer && (
                        <p className="text-xs text-muted-foreground pt-2 border-t border-border/30">
                          {selectedTemplate.footer}
                        </p>
                      )}
                    </div>

                    {/* Buttons */}
                    {selectedTemplate.buttons && selectedTemplate.buttons.length > 0 && (
                      <div className="border-t border-border/50 divide-y divide-border/50">
                        {selectedTemplate.buttons.map((button, index) => (
                          <div
                            key={index}
                            className="px-3 py-2 flex items-center justify-center gap-2 text-primary text-sm font-medium"
                          >
                            {getButtonIcon(button.type)}
                            <span>{button.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Variable Configuration */}
                {variables.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Configure Variables</Label>
                      {variables.map((variable) => (
                        <div key={variable} className="space-y-1.5">
                          <Label htmlFor={`var-${variable}`} className="text-xs font-medium text-muted-foreground">
                            {variable.split('_').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </Label>
                          <Select
                            value={variableMapping[variable] || ''}
                            onValueChange={(value) => handleVariableChange(variable, value)}
                          >
                            <SelectTrigger id={`var-${variable}`} className="w-full h-9">
                              <SelectValue placeholder="Select value..." />
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
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </ScrollArea>

        {selectedTemplate && (
          <div className="p-4 border-t border-border bg-muted/30">
            <Button 
              onClick={handleSave} 
              className="w-full gap-2"
              size="default"
            >
              <Check className="h-4 w-4" />
              Save Configuration
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
