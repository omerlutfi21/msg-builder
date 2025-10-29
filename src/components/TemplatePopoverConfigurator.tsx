import { useState, useEffect } from "react";
import { Template, configurableItems, sampleTemplates, VariableMapping } from "@/types/template";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MessageSquare, Settings, Check, Phone, ExternalLink, MessageCircle, Image, FileText, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

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
        <Button variant="default" className="gap-2 shadow-sm">
          <Sparkles className="h-4 w-4" />
          Quick Configure
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[480px] p-0 bg-popover border-border/50 shadow-lg" align="start" sideOffset={8}>
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Quick Configurator</h3>
              <p className="text-xs text-muted-foreground">
                Select and configure in seconds
              </p>
            </div>
          </div>
        </div>

        <Separator />

        <ScrollArea className="h-[540px]">
          <div className="p-6 space-y-6">
            {/* Template Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-5 w-1 bg-primary rounded-full" />
                <Label htmlFor="template-select" className="text-sm font-semibold">
                  Choose Template
                </Label>
              </div>
              <Select
                value={selectedTemplate?.id || ''}
                onValueChange={(value) => {
                  const template = sampleTemplates.find(t => t.id === value);
                  setSelectedTemplate(template || null);
                }}
              >
                <SelectTrigger 
                  id="template-select" 
                  className="w-full h-11 bg-muted/30 border-border/50 hover:bg-muted/50 transition-colors"
                >
                  <SelectValue placeholder="Select a template..." />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {sampleTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center gap-3 py-1">
                        <MessageSquare className="h-4 w-4 text-primary" />
                        <div>
                          <div className="font-medium">{template.name}</div>
                          <div className="text-xs text-muted-foreground">{template.category}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedTemplate && (
              <div className="space-y-6 animate-fade-in">
                {/* Preview Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-1 bg-primary rounded-full" />
                    <Label className="text-sm font-semibold">Live Preview</Label>
                  </div>
                  <Card className="overflow-hidden border-border/50 bg-gradient-to-br from-background to-muted/20">
                    {/* Header */}
                    {selectedTemplate.header && (
                      <div className="border-b border-border/50">
                        {selectedTemplate.header.type === 'IMAGE' && selectedTemplate.header.mediaUrl ? (
                          <img 
                            src={selectedTemplate.header.mediaUrl} 
                            alt="Header"
                            className="w-full h-36 object-cover"
                          />
                        ) : selectedTemplate.header.type === 'TEXT' && selectedTemplate.header.text ? (
                          <div className="p-4 bg-muted/40 flex items-start gap-2">
                            <FileText className="h-4 w-4 text-primary mt-0.5" />
                            <p className="font-semibold text-sm flex-1">
                              {renderTextWithVariables(selectedTemplate.header.text)}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    )}

                    {/* Body */}
                    <div className="p-4 space-y-3">
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
                      <div className="border-t border-border/50">
                        {selectedTemplate.buttons.map((button, index) => (
                          <div
                            key={index}
                            className={`px-4 py-3 flex items-center justify-center gap-2 text-primary text-sm font-medium transition-colors hover:bg-muted/30 ${
                              index !== selectedTemplate.buttons!.length - 1 ? 'border-b border-border/30' : ''
                            }`}
                          >
                            {getButtonIcon(button.type)}
                            <span>{button.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>

                {/* Variable Configuration */}
                {variables.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-1 bg-primary rounded-full" />
                      <Label className="text-sm font-semibold">Configure Variables</Label>
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {variables.length} {variables.length === 1 ? 'field' : 'fields'}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {variables.map((variable, index) => (
                        <div 
                          key={variable} 
                          className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border/50 transition-all hover:bg-muted/50"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <Label htmlFor={`var-${variable}`} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {variable.split('_').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </Label>
                          <Select
                            value={variableMapping[variable] || ''}
                            onValueChange={(value) => handleVariableChange(variable, value)}
                          >
                            <SelectTrigger 
                              id={`var-${variable}`} 
                              className="w-full h-10 bg-background border-border/50 hover:bg-muted/50 transition-colors"
                            >
                              <SelectValue placeholder="Choose value..." />
                            </SelectTrigger>
                            <SelectContent className="bg-popover z-50">
                              {configurableItems.map((item) => (
                                <SelectItem key={item.key} value={item.label}>
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-primary/40" />
                                    {item.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!selectedTemplate && (
              <div className="py-12 text-center">
                <div className="inline-flex p-4 rounded-full bg-muted/50 mb-4">
                  <MessageSquare className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Select a template to get started
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {selectedTemplate && (
          <>
            <Separator />
            <div className="p-4 bg-muted/20">
              <Button 
                onClick={handleSave} 
                className="w-full gap-2 h-11 font-semibold shadow-sm"
                size="lg"
              >
                <Check className="h-4 w-4" />
                Save Configuration
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};
