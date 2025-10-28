import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";

interface TemplatePreviewProps {
  bodyText: string;
  variableMapping: { [key: string]: string };
}

export const TemplatePreview = ({ bodyText, variableMapping }: TemplatePreviewProps) => {
  const renderPreviewText = () => {
    let previewText = bodyText;
    
    // Replace variables with mapped values or placeholders
    Object.keys(variableMapping).forEach((variable) => {
      const mappedValue = variableMapping[variable];
      const displayValue = mappedValue ? `<${mappedValue}>` : `{{${variable}}}`;
      previewText = previewText.replace(new RegExp(`{{${variable}}}`, 'g'), displayValue);
    });

    // Split by angle brackets to identify mapped variables
    const parts = previewText.split(/(<[^>]+>)/g);
    
    return parts.map((part, index) => {
      if (part.match(/<[^>]+>/)) {
        return (
          <Badge 
            key={index} 
            variant="secondary" 
            className="bg-variable-light text-variable px-2 py-0.5 text-sm font-medium"
          >
            {part}
          </Badge>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <Card className="border-variable/20 bg-gradient-to-br from-background to-whatsapp-light/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Eye className="h-5 w-5 text-variable" />
          Live Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-card p-4 rounded-lg shadow-sm border border-border/50">
          <p className="text-card-foreground leading-relaxed whitespace-pre-wrap">
            {renderPreviewText()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
