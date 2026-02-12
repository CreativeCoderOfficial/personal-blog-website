import { CheckCircle2, BookOpen, Clock } from "lucide-react";

interface SummaryBoxProps {
  summary: string;
  takeaways: string[];
  readingTime: number;
}

export default function SummaryBox({ summary, takeaways, readingTime }: SummaryBoxProps) {
  return (
    <div className="
      p-6 rounded-2xl
      bg-card/50 border border-border-subtle
      relative overflow-hidden
    ">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent-purple/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 relative z-10">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-accent-orange font-bold">
              <BookOpen className="w-5 h-5" />
              <h3>Summary</h3>
            </div>
            {/* Reading Time Badge */}
            <div className="flex items-center gap-1.5 text-xs font-medium text-text-secondary bg-main/50 px-3 py-1 rounded-full border border-border-subtle">
              <Clock className="w-3.5 h-3.5" />
              {readingTime} min read
            </div>
        </div>
      </div>

      <p className="text-text-secondary text-sm leading-relaxed mb-6 relative z-10">
        {summary}
      </p>

      {/* Bullets using strict theme colors */}
      <div className="grid gap-3 relative z-10">
        {takeaways.map((point, index) => (
          <div key={index} className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-accent-purple shrink-0 mt-1" />
            <span className="text-text-primary text-sm font-medium">
              {point}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}