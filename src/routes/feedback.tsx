import { db } from "@/config/firebase.config";
import { Interview, UserAnswer } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { LoaderPage } from "./loader-page";
import { CustomBreadCrumb } from "@/components/custom-bread-crumb";
import { InterviewPin } from "@/components/pin";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import {
  CircleCheck,
  Star,
  Trophy,
  Award,
  Newspaper,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Feedback = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState<UserAnswer[]>([]);
  const [activeFeed, setActiveFeed] = useState("");
  const { user } = useAuth();
  const userId = user?.uid;
  const navigate = useNavigate();

  // Function to refresh feedbacks
  const refreshFeedbacks = useCallback(async () => {
    if (!userId || !interviewId) {
      // Required identifiers missing; nothing to fetch
      return;
    }

    setIsLoading(true);
    try {
      const userAnswersQuery = query(
        collection(db, "userAnswers"),
        where("userId", "==", userId),
        where("mockIdRef", "==", interviewId)
      );

      const querySnap = await getDocs(userAnswersQuery);
      const interviewData: UserAnswer[] = querySnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as UserAnswer[];

      setFeedbacks(interviewData);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      toast.error("Error", {
        description: "Something went wrong. Please try again later..",
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, interviewId]);

  useEffect(() => {
    if (!interviewId) {
      navigate("/generate", { replace: true });
      return;
    }
    if (interviewId) {
      const fetchInterview = async () => {
        if (interviewId) {
          try {
            const interviewDoc = await getDoc(
              doc(db, "interviews", interviewId)
            );
            if (interviewDoc.exists()) {
              setInterview({
                id: interviewDoc.id,
                ...interviewDoc.data(),
              } as Interview);
            }
          } catch (error) {
            console.log(error);
          }
        }
      };

      fetchInterview();
      refreshFeedbacks();
    }
  }, [interviewId, navigate, userId, refreshFeedbacks]);

  // Add a listener to refresh when the page becomes visible (in case user navigates back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && interviewId && userId) {
        console.log("Page became visible, refreshing feedbacks...");
        refreshFeedbacks();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [interviewId, userId, refreshFeedbacks]);

  //   calculate the ratings out of 10

  const overAllRating = useMemo(() => {
    if (feedbacks.length === 0) return "0.0";

    const totalRatings = feedbacks.reduce(
      (acc, feedback) => acc + feedback.rating,
      0
    );

    return (totalRatings / feedbacks.length).toFixed(1);
  }, [feedbacks]);

  if (isLoading) {
    return <LoaderPage className="w-full h-[70vh]" />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="space-y-4">
        <CustomBreadCrumb
          breadCrumbPage="Interview Feedback"
          breadCrumpItems={[
            { label: "Mock Interviews", link: "/generate" },
            {
              label: `${interview?.position}`,
              link: `/generate/interview/${interview?.id}`,
            },
          ]}
        />

        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-chart-3 to-chart-4 rounded-full flex items-center justify-center mx-auto">
            <Trophy className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gradient">Congratulations!</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your personalized feedback is now available. Dive in to see your
            strengths, areas for improvement, and tips to help you ace your next
            interview.
          </p>
        </div>
      </div>

      {/* Overall Rating Card */}
      <div className="card-premium p-8 text-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Overall Performance</h2>
          <div className="flex items-center justify-center gap-4">
            <div className="text-6xl font-bold text-gradient">
              {overAllRating}
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold text-muted-foreground">
                / 10
              </div>
              <div className="text-sm text-muted-foreground">Average Score</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Star className="h-5 w-5 text-chart-4" />
            <span className="text-muted-foreground">
              {parseFloat(overAllRating) >= 8
                ? "Excellent Performance!"
                : parseFloat(overAllRating) >= 6
                ? "Good Job!"
                : "Keep Practicing!"}
            </span>
          </div>
        </div>
      </div>

      {/* Interview Details */}
      {interview && (
        <div className="card-premium p-6">
          <InterviewPin interview={interview} onMockPage />
        </div>
      )}

      {/* Feedback Section */}
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Detailed Feedback</h2>
            <p className="text-muted-foreground">
              Review your answers and learn from the AI's analysis
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={refreshFeedbacks}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              {isLoading ? "Refreshing..." : "Refresh Feedback"}
            </Button>
          </div>
        </div>

        {feedbacks && feedbacks.length > 0 ? (
          <div className="space-y-4">
            {feedbacks.map((feed, index) => (
              <div key={feed.id} className="card-premium p-6">
                <Accordion type="single" collapsible>
                  <AccordionItem value={feed.id} className="border-0">
                    <AccordionTrigger
                      onClick={() => setActiveFeed(feed.id)}
                      className={cn(
                        "px-0 py-0 flex items-center justify-between text-lg font-semibold hover:no-underline",
                        activeFeed === feed.id
                          ? "text-primary"
                          : "text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">
                            {index + 1}
                          </span>
                        </div>
                        <span className="text-left">{feed.question}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-chart-4" />
                          <span className="font-semibold">
                            {feed.rating}/10
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-0 py-6 space-y-6">
                      {/* Expected Answer */}
                      <div className="card-premium p-6 border-l-4 border-l-chart-3">
                        <div className="flex items-center gap-3 mb-4">
                          <CircleCheck className="h-5 w-5 text-chart-3" />
                          <h3 className="text-lg font-semibold text-chart-3">
                            Expected Answer
                          </h3>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {feed.correct_ans}
                        </p>
                      </div>

                      {/* Your Answer */}
                      <div className="card-premium p-6 border-l-4 border-l-chart-4">
                        <div className="flex items-center gap-3 mb-4">
                          <CircleCheck className="h-5 w-5 text-chart-4" />
                          <h3 className="text-lg font-semibold text-chart-4">
                            Your Answer
                          </h3>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {feed.user_ans}
                        </p>
                      </div>

                      {/* Feedback */}
                      <div className="card-premium p-6 border-l-4 border-l-primary">
                        <div className="flex items-center gap-3 mb-4">
                          <Award className="h-5 w-5 text-primary" />
                          <h3 className="text-lg font-semibold text-primary">
                            AI Feedback
                          </h3>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {feed.feedback}
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Newspaper className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              No Feedback Available
            </h3>
            <p className="text-muted-foreground">
              Complete the interview to see your personalized feedback.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
