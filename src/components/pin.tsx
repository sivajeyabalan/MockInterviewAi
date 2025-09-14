import { Interview } from "@/types";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { TooltipButton } from "./tooltip-button";
import { Eye, Newspaper, Sparkles } from "lucide-react";

interface InterviewPinProps {
  interview: Interview;
  onMockPage?: boolean;
}

export const InterviewPin = ({
  interview,
  onMockPage = false,
}: InterviewPinProps) => {
  const navigate = useNavigate();

  return (
    <Card className="card-premium p-6 space-y-6 hover:shadow-glow transition-all duration-300">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl font-bold text-gradient">
              {interview?.position}
            </CardTitle>
            <CardDescription className="text-muted-foreground leading-relaxed">
              {interview?.description}
            </CardDescription>
          </div>
          {!onMockPage && (
            <div className="flex items-center gap-2">
              <TooltipButton
                content="View"
                buttonVariant="ghost"
                onClick={() => {
                  navigate(`/generate/${interview?.id}`, { replace: true });
                }}
                disbaled={false}
                buttonClassName="p-2 rounded-lg hover:bg-muted/50 transition-colors"
                icon={<Eye className="h-4 w-4" />}
                loading={false}
              />

              <TooltipButton
                content="Feedback"
                buttonVariant="ghost"
                onClick={() => {
                  navigate(`/generate/feedback/${interview?.id}`, {
                    replace: true,
                  });
                }}
                disbaled={false}
                buttonClassName="p-2 rounded-lg hover:bg-chart-4/10 transition-colors"
                icon={<Newspaper className="h-4 w-4" />}
                loading={false}
              />

              <TooltipButton
                content="Start"
                buttonVariant="ghost"
                onClick={() => {
                  navigate(`/generate/interview/${interview?.id}`, {
                    replace: true,
                  });
                }}
                disbaled={false}
                buttonClassName="p-2 rounded-lg hover:bg-primary/10 transition-colors"
                icon={<Sparkles className="h-4 w-4" />}
                loading={false}
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {interview?.techStack.split(",").map((word, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-xs font-medium px-3 py-1 rounded-full border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40 transition-colors"
            >
              {word.trim()}
            </Badge>
          ))}
        </div>
      </div>

      <CardFooter className="p-0 pt-4 border-t">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Newspaper className="h-4 w-4" />
            <span>
              Created{" "}
              {new Date(interview?.createdAt.toDate()).toLocaleDateString(
                "en-US",
                { dateStyle: "long" }
              )}
            </span>
          </div>
          {onMockPage && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {interview?.experience} years exp
              </Badge>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
