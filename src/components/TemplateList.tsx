import { Template } from "@/types/template";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowRight } from "lucide-react";

interface TemplateListProps {
  templates: Template[];
  onSelectTemplate: (template: Template) => void;
}

export const TemplateList = ({ templates, onSelectTemplate }: TemplateListProps) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'transactional':
        return 'bg-primary/10 text-primary hover:bg-primary/20';
      case 'marketing':
        return 'bg-accent/10 text-accent hover:bg-accent/20';
      case 'utility':
        return 'bg-secondary text-secondary-foreground hover:bg-secondary/80';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">WhatsApp Templates</h1>
        <p className="text-muted-foreground text-lg">
          Select a template to configure and preview
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card
            key={template.id}
            className="group cursor-pointer transition-all duration-300 hover:shadow-hover border-border/50"
            onClick={() => onSelectTemplate(template)}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-whatsapp-light">
                    <MessageSquare className="h-4 w-4 text-primary" />
                  </div>
                  <Badge variant="secondary" className={getCategoryColor(template.category)}>
                    {template.category}
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-xl mt-2">{template.name}</CardTitle>
              <CardDescription className="line-clamp-2 text-sm">
                {template.bodyText}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="ghost" 
                className="w-full group-hover:bg-primary/5 transition-colors"
              >
                Configure Template
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
