import { Template, VariableMapping } from "@/types/template";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Phone, ExternalLink, MessageCircle } from "lucide-react";

interface WhatsAppTemplatePreviewProps {
  template: Template;
  variableMapping: VariableMapping;
}

export const WhatsAppTemplatePreview = ({ template, variableMapping }: WhatsAppTemplatePreviewProps) => {
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
            className="bg-variable-light text-variable px-2 py-0.5 text-xs font-medium"
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
    <Card className="border-variable/20 bg-gradient-to-br from-background to-whatsapp-light/10 sticky top-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Eye className="h-5 w-5 text-variable" />
          WhatsApp Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* WhatsApp-style message bubble */}
        <div className="bg-card rounded-lg shadow-card overflow-hidden border border-border/50">
          {/* Header */}
          {template.header && (
            <div className="border-b border-border/50">
              {template.header.type === 'IMAGE' && template.header.mediaUrl ? (
                <img 
                  src={template.header.mediaUrl} 
                  alt="Header"
                  className="w-full h-48 object-cover"
                />
              ) : template.header.type === 'TEXT' && template.header.text ? (
                <div className="p-4 bg-muted/30">
                  <p className="font-semibold text-foreground">
                    {renderTextWithVariables(template.header.text)}
                  </p>
                </div>
              ) : null}
            </div>
          )}

          {/* Body */}
          <div className="p-4 space-y-3">
            <p className="text-card-foreground leading-relaxed whitespace-pre-wrap text-sm">
              {renderTextWithVariables(template.bodyText)}
            </p>

            {/* Footer */}
            {template.footer && (
              <p className="text-xs text-muted-foreground pt-2 border-t border-border/30">
                {template.footer}
              </p>
            )}
          </div>

          {/* Buttons */}
          {template.buttons && template.buttons.length > 0 && (
            <div className="border-t border-border/50 divide-y divide-border/50">
              {template.buttons.map((button, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full h-11 rounded-none justify-center gap-2 text-primary hover:bg-primary/5 font-medium"
                >
                  {getButtonIcon(button.type)}
                  {button.type === 'URL' && button.url 
                    ? renderTextWithVariables(`${button.text} → ${button.url}`)
                    : button.text
                  }
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Info badge */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <Badge variant="secondary" className="text-xs">
            Interactive Preview
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
