import { useState, useEffect } from "react";
import { Template, configurableItems, sampleTemplates, VariableMapping } from "@/types/template";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MessageSquare, Check, Phone, ExternalLink, MessageCircle, Image, FileText, Sparkles, X, ArrowLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const TemplatePopoverConfigurator = () => {
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [variableMapping, setVariableMapping] = useState<VariableMapping>({});
  const [variables, setVariables] = useState<string[]>([]);
  const [activeVariable, setActiveVariable] = useState<string | null>(null);
  const [step, setStep] = useState<'select' | 'configure'>('select');
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

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setStep('configure');
  };

  const handleBack = () => {
    setStep('select');
    setSelectedTemplate(null);
    setVariableMapping({});
    setActiveVariable(null);
  };

  const handleVariableChange = (variable: string, value: string) => {
    setVariableMapping(prev => ({
      ...prev,
      [variable]: value,
    }));
    setActiveVariable(null);
  };

  const handleSave = () => {
    if (!selectedTemplate) return;

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
      title: "✓ Template Configured",
      description: `${selectedTemplate.name} is ready to use.`,
    });
    
    console.log("Saved configuration:", {
      template: selectedTemplate,
      variableMapping,
    });
    
    // Reset and close
    setOpen(false);
    setTimeout(() => {
      handleBack();
    }, 300);
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

  const renderTextWithVariables = (text: string, interactive = false) => {
    const parts = text.split(/{{(\w+)}}/g);
    
    return parts.map((part, index) => {
      if (variables.includes(part)) {
        const isMapped = variableMapping[part];
        const isActive = activeVariable === part;
        
        if (interactive) {
          return (
            <Badge 
              key={index}
              variant={isActive ? "default" : "secondary"}
              className={cn(
                "px-2 py-0.5 text-xs font-medium cursor-pointer transition-all",
                isMapped 
                  ? "bg-primary/20 text-primary border-primary/30" 
                  : "bg-muted hover:bg-muted/80 border-border/50",
                isActive && "ring-2 ring-primary ring-offset-1"
              )}
              onClick={() => setActiveVariable(part)}
            >
              {isMapped ? `<${variableMapping[part]}>` : `{{${part}}}`}
            </Badge>
          );
        }
        
        return (
          <Badge 
            key={index} 
            variant="secondary" 
            className="bg-variable-light text-variable px-2 py-0.5 text-xs font-medium"
          >
            {isMapped ? `<${variableMapping[part]}>` : `{{${part}}}`}
          </Badge>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'transactional':
        return <FileText className="h-4 w-4" />;
      case 'marketing':
        return <Sparkles className="h-4 w-4" />;
      case 'utility':
        return <MessageCircle className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'transactional':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'marketing':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'utility':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
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
      <PopoverContent 
        className="w-[700px] p-0 bg-background border-border/50 shadow-xl" 
        align="start" 
        sideOffset={12}
      >
        {step === 'select' ? (
          /* TEMPLATE SELECTION GRID */
          <div className="relative">
            <div className="sticky top-0 z-10 px-6 py-5 bg-gradient-to-b from-background to-background/95 backdrop-blur-sm border-b border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Choose Template</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select from {sampleTemplates.length} ready-to-use templates
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[500px]">
              <div className="p-6 grid grid-cols-2 gap-3">
                {sampleTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className="group relative overflow-hidden cursor-pointer border-border/50 hover:border-primary/50 hover:shadow-md transition-all duration-300"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className={cn(
                          "p-2 rounded-lg border",
                          getCategoryColor(template.category)
                        )}>
                          {getCategoryIcon(template.category)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm mb-1 truncate">
                            {template.name}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {template.category}
                          </Badge>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </div>
                      
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {template.bodyText}
                      </p>

                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                        {template.header && (
                          <Badge variant="secondary" className="text-xs gap-1">
                            {template.header.type === 'IMAGE' ? (
                              <Image className="h-2.5 w-2.5" />
                            ) : (
                              <FileText className="h-2.5 w-2.5" />
                            )}
                          </Badge>
                        )}
                        {template.buttons && template.buttons.length > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {template.buttons.length} btn
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        ) : (
          /* CONFIGURATION VIEW */
          <div className="relative">
            <div className="sticky top-0 z-10 px-6 py-4 bg-gradient-to-b from-background to-background/95 backdrop-blur-sm border-b border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleBack}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div>
                    <h3 className="font-semibold">{selectedTemplate?.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {variables.length > 0 
                        ? `Click variables to configure (${Object.keys(variableMapping).filter(k => variableMapping[k]).length}/${variables.length})` 
                        : 'No variables to configure'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[520px]">
              <div className="p-6 grid grid-cols-2 gap-6">
                {/* LEFT: Interactive Preview */}
                <div className="space-y-4">
                  <Label className="text-sm font-semibold">Live Preview</Label>
                  <Card className="overflow-hidden border-border/50 bg-gradient-to-br from-background to-muted/10">
                    {selectedTemplate?.header && (
                      <div className="border-b border-border/50">
                        {selectedTemplate.header.type === 'IMAGE' && selectedTemplate.header.mediaUrl ? (
                          <img 
                            src={selectedTemplate.header.mediaUrl} 
                            alt="Header"
                            className="w-full h-32 object-cover"
                          />
                        ) : selectedTemplate.header.type === 'TEXT' && selectedTemplate.header.text ? (
                          <div className="p-3 bg-muted/30">
                            <p className="text-sm font-semibold">
                              {renderTextWithVariables(selectedTemplate.header.text, true)}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    )}

                    <div className="p-4 space-y-3">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {selectedTemplate && renderTextWithVariables(selectedTemplate.bodyText, true)}
                      </p>

                      {selectedTemplate?.footer && (
                        <p className="text-xs text-muted-foreground pt-2 border-t border-border/30">
                          {selectedTemplate.footer}
                        </p>
                      )}
                    </div>

                    {selectedTemplate?.buttons && selectedTemplate.buttons.length > 0 && (
                      <div className="border-t border-border/50">
                        {selectedTemplate.buttons.map((button, index) => (
                          <div
                            key={index}
                            className={cn(
                              "px-4 py-2.5 flex items-center justify-center gap-2 text-primary text-xs font-medium transition-colors hover:bg-muted/30",
                              index !== selectedTemplate.buttons!.length - 1 && "border-b border-border/30"
                            )}
                          >
                            {getButtonIcon(button.type)}
                            <span>{button.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>

                  {variables.length > 0 && (
                    <p className="text-xs text-muted-foreground text-center">
                      💡 Click on highlighted variables to configure
                    </p>
                  )}
                </div>

                {/* RIGHT: Variable Configuration */}
                <div className="space-y-4">
                  <Label className="text-sm font-semibold">
                    {activeVariable ? 'Configure Variable' : 'Variables'}
                  </Label>
                  
                  {variables.length === 0 ? (
                    <Card className="p-8 text-center border-dashed">
                      <Check className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        No variables to configure
                      </p>
                    </Card>
                  ) : activeVariable ? (
                    <Card className="p-4 border-primary/30 bg-primary/5 animate-scale-in">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-semibold">
                            {activeVariable.split('_').map(w => 
                              w.charAt(0).toUpperCase() + w.slice(1)
                            ).join(' ')}
                          </Label>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setActiveVariable(null)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <Select
                          value={variableMapping[activeVariable] || ''}
                          onValueChange={(value) => handleVariableChange(activeVariable, value)}
                          open
                        >
                          <SelectTrigger className="hidden" />
                          <SelectContent 
                            className="bg-popover w-full relative border-0 shadow-none" 
                            position="item-aligned"
                          >
                            {configurableItems.map((item) => (
                              <SelectItem 
                                key={item.key} 
                                value={item.label}
                                className="cursor-pointer"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-2 rounded-full bg-primary/40" />
                                  {item.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </Card>
                  ) : (
                    <div className="space-y-2">
                      {variables.map((variable) => {
                        const isMapped = variableMapping[variable];
                        return (
                          <Card
                            key={variable}
                            className={cn(
                              "p-3 cursor-pointer transition-all hover:shadow-sm",
                              isMapped 
                                ? "bg-primary/5 border-primary/30" 
                                : "border-border/50 hover:border-primary/30"
                            )}
                            onClick={() => setActiveVariable(variable)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  {variable.split('_').map(w => 
                                    w.charAt(0).toUpperCase() + w.slice(1)
                                  ).join(' ')}
                                </p>
                                {isMapped && (
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    → {variableMapping[variable]}
                                  </p>
                                )}
                              </div>
                              {isMapped ? (
                                <Check className="h-4 w-4 text-primary" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>

            <div className="sticky bottom-0 px-6 py-4 bg-gradient-to-t from-background to-background/95 backdrop-blur-sm border-t border-border/50">
              <Button 
                onClick={handleSave} 
                className="w-full gap-2 h-11 font-semibold shadow-sm"
                size="lg"
                disabled={variables.length > 0 && !variables.every(v => variableMapping[v])}
              >
                <Check className="h-4 w-4" />
                {variables.length === 0 
                  ? 'Use Template' 
                  : `Save Configuration (${Object.keys(variableMapping).filter(k => variableMapping[k]).length}/${variables.length})`
                }
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
