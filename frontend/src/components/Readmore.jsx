import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function ReadMore({ text, lines = 3, onEdit = null, className = '' }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;

  const textLines = text.split('\n');
  const isLongText = textLines.length > lines;

  const previewText = isLongText
    ? textLines.slice(0, lines).join('\n')
    : text;

  return (
    <div className="space-y-2">
      
      {/* TEXT BLOCK - only this triggers edit */}
      <p
        onClick={() => onEdit && onEdit()}
        className={`text-base text-muted-foreground whitespace-pre-wrap leading-relaxed cursor-pointer hover:text-foreground transition-colors ${className}`}
      >
        {isExpanded ? text : previewText}
        {isLongText && !isExpanded && '...'}
      </p>

      {/* BUTTON - NEVER triggers edit */}
      {isLongText && (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();   // <-- Prevents triggering edit
            setIsExpanded(!isExpanded);
          }}
          className="gap-2 h-auto p-0 text-primary hover:text-primary/90"
        >
          {isExpanded ? (
            <>
              <ChevronUp size={16} />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown size={16} />
              Read More
            </>
          )}
        </Button>
      )}
    </div>
  );
}
