import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { TooltipButton } from "./tooltip-button";
import { Volume2, VolumeX } from "lucide-react";
import { RecordAnswer } from "./record-answer";

interface QuestionSectionProps {
  questions: { question: string; answer: string }[];
  showExpectedAnswer?: boolean;
}

export const QuestionSection = ({
  questions,
  showExpectedAnswer = false,
}: QuestionSectionProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWebCam, setIsWebCam] = useState(false);

  const [currentSpeech, setCurrentSpeech] =
    useState<SpeechSynthesisUtterance | null>(null);

  const handlePlayQuestion = (qst: string) => {
    if (isPlaying && currentSpeech) {
      // stop the speech if already playing
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentSpeech(null);
    } else {
      if ("speechSynthesis" in window) {
        const speech = new SpeechSynthesisUtterance(qst);
        window.speechSynthesis.speak(speech);
        setIsPlaying(true);
        setCurrentSpeech(speech);

        // handle the speech end
        speech.onend = () => {
          setIsPlaying(false);
          setCurrentSpeech(null);
        };
      }
    }
  };

  return (
    <div className="w-full space-y-6">
      <Tabs
        defaultValue={questions[0]?.question}
        className="w-full"
        orientation="vertical"
      >
        <TabsList className="bg-muted/30 w-full flex flex-wrap items-center justify-start gap-2 p-2 rounded-xl">
          {questions?.map((tab, i) => (
            <TabsTrigger
              key={tab.question}
              value={tab.question}
              className="text-sm font-medium px-4 py-3 rounded-lg border-0 hover:bg-background/50 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">
                  {i + 1}
                </div>
                Question {i + 1}
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {questions?.map((tab, i) => (
          <TabsContent key={i} value={tab.question} className="space-y-6 mt-6">
            <div className="card-premium p-6 space-y-6">
              {/* Question Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">Q</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Question {i + 1}
                  </h3>
                </div>
                <p className="text-base text-muted-foreground leading-relaxed pl-11">
                  {tab.question}
                </p>
              </div>

              {/* Expected Answer Section - Only show if showExpectedAnswer is true */}
              {showExpectedAnswer && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-chart-3/10 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-chart-3">A</span>
                    </div>
                    <h4 className="text-lg font-semibold text-foreground">
                      Expected Answer
                    </h4>
                  </div>
                  <div className="card-premium p-4 bg-chart-3/5 border-l-4 border-l-chart-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tab.answer}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t">
                <TooltipButton
                  content={isPlaying ? "Stop Audio" : "Play Question"}
                  icon={
                    isPlaying ? (
                      <VolumeX className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Volume2 className="h-5 w-5 text-muted-foreground" />
                    )
                  }
                  onClick={() => handlePlayQuestion(tab.question)}
                  className="p-3 rounded-xl hover:bg-muted/50 transition-colors"
                />

                <RecordAnswer
                  question={tab}
                  isWebCam={isWebCam}
                  setIsWebCam={setIsWebCam}
                />
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
