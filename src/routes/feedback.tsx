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
      console.log("Missing userId or interviewId:", { userId, interviewId });
      return;
    }

    setIsLoading(true);
    try {
      const querSanpRef = query(
        collection(db, "userAnswers"),
        where("userId", "==", userId),
        where("mockIdRef", "==", interviewId)
      );

      console.log(
        "Refreshing feedbacks with userId:",
        userId,
        "interviewId:",
        interviewId
      );

      const querySnap = await getDocs(querSanpRef);
      console.log("Feedback query results:", querySnap.docs.length);

      if (querySnap.docs.length > 0) {
        console.log(
          "Found documents:",
          querySnap.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );
      } else {
        // Fallback: check if there are any user answers at all for this user
        console.log(
          "No results found, checking all user answers for this user..."
        );
        const allUserAnswersQuery = query(
          collection(db, "userAnswers"),
          where("userId", "==", userId)
        );
        const allUserAnswersSnap = await getDocs(allUserAnswersQuery);
        console.log(
          "All user answers for this user:",
          allUserAnswersSnap.docs.length
        );
        if (allUserAnswersSnap.docs.length > 0) {
          console.log(
            "All user answers data:",
            allUserAnswersSnap.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
              mockIdRef: doc.data().mockIdRef,
              interviewId: interviewId,
              mockIdRefMatch: doc.data().mockIdRef === interviewId,
            }))
          );

          // Check if any answers match this interview
          const matchingAnswers = allUserAnswersSnap.docs.filter(
            (doc) => doc.data().mockIdRef === interviewId
          );
          console.log(
            "Matching answers for this interview:",
            matchingAnswers.length
          );
        }

        // Also try a different approach - get all documents and filter client-side
        console.log("Trying alternative query approach...");
        const alternativeQuery = query(collection(db, "userAnswers"));
        const alternativeSnap = await getDocs(alternativeQuery);
        console.log(
          "Total userAnswers in database:",
          alternativeSnap.docs.length
        );

        const userAnswers = alternativeSnap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as UserAnswer))
          .filter(
            (answer: UserAnswer) =>
              answer.userId === userId && answer.mockIdRef === interviewId
          );

        console.log("Client-side filtered answers:", userAnswers.length);
        if (userAnswers.length > 0) {
          console.log("Client-side filtered data:", userAnswers);
          setFeedbacks(userAnswers as UserAnswer[]);
          return; // Exit early if we found data
        }
      }

      // If we still haven't found anything, try one more approach
      console.log(
        "Trying final fallback - getting all user answers and filtering..."
      );
      const finalQuery = query(collection(db, "userAnswers"));
      const finalSnap = await getDocs(finalQuery);
      const allAnswers = finalSnap.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as UserAnswer)
      );
      const userSpecificAnswers = allAnswers.filter(
        (answer) => answer.userId === userId && answer.mockIdRef === interviewId
      );
      console.log(
        "Final fallback found:",
        userSpecificAnswers.length,
        "answers"
      );
      if (userSpecificAnswers.length > 0) {
        console.log("Final fallback data:", userSpecificAnswers);
        setFeedbacks(userSpecificAnswers);
        return;
      }

      const interviewData: UserAnswer[] = querySnap.docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as UserAnswer;
      });

      console.log("Processed feedback data:", interviewData);
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
            <Button
              onClick={async () => {
                console.log("Force refresh with all data...");
                const allQuery = query(collection(db, "userAnswers"));
                const allSnap = await getDocs(allQuery);
                console.log("All userAnswers:", allSnap.docs.length);

                const allData = allSnap.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                }));
                console.log("All data:", allData);

                // Set all data as feedbacks for testing
                setFeedbacks(allData as UserAnswer[]);
              }}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              Show All Data
            </Button>
            <Button
              onClick={async () => {
                console.log("Showing all MY answers...");
                console.log("Current userId:", userId);
                console.log("Current interviewId:", interviewId);

                const myAnswersQuery = query(
                  collection(db, "userAnswers"),
                  where("userId", "==", userId)
                );
                const myAnswersSnap = await getDocs(myAnswersQuery);
                console.log("My answers:", myAnswersSnap.docs.length);

                const myAnswers = myAnswersSnap.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                })) as UserAnswer[];
                console.log("My answers data:", myAnswers);

                // Show which answers belong to which interview
                myAnswers.forEach((answer, index) => {
                  console.log(`Answer ${index + 1}:`, {
                    question: answer.question.substring(0, 50) + "...",
                    mockIdRef: answer.mockIdRef,
                    currentInterviewId: interviewId,
                    belongsToCurrentInterview: answer.mockIdRef === interviewId,
                    rating: answer.rating,
                    feedback: answer.feedback.substring(0, 100) + "...",
                  });
                });

                setFeedbacks(myAnswers);
              }}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              Show My Answers
            </Button>
            <Button
              onClick={async () => {
                console.log("Manual test query...");
                console.log("Current userId:", userId);
                console.log("Current interviewId:", interviewId);

                const testQuery = query(collection(db, "userAnswers"));
                const testSnap = await getDocs(testQuery);
                console.log(
                  "Manual test - Total documents:",
                  testSnap.docs.length
                );

                if (testSnap.docs.length > 0) {
                  console.log("All documents in database:");
                  testSnap.docs.forEach((doc, index) => {
                    const data = doc.data();
                    console.log(`Document ${index + 1}:`, {
                      id: doc.id,
                      userId: data.userId,
                      mockIdRef: data.mockIdRef,
                      question: data.question,
                      rating: data.rating,
                      feedback: data.feedback,
                      matchesCurrentUser: data.userId === userId,
                      matchesCurrentInterview: data.mockIdRef === interviewId,
                    });
                  });

                  // Filter for current user and interview
                  const filtered = testSnap.docs.filter((doc) => {
                    const data = doc.data();
                    return (
                      data.userId === userId && data.mockIdRef === interviewId
                    );
                  });
                  console.log(
                    "Filtered results for current user and interview:",
                    filtered.length
                  );
                }
              }}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              Test Query
            </Button>
            <Button
              onClick={async () => {
                console.log("Testing current interview answers...");
                console.log(
                  "Looking for answers with interviewId:",
                  interviewId
                );

                // Try to find answers for the current interview specifically
                const currentInterviewQuery = query(
                  collection(db, "userAnswers"),
                  where("mockIdRef", "==", interviewId)
                );
                const currentInterviewSnap = await getDocs(
                  currentInterviewQuery
                );
                console.log(
                  "Current interview answers found:",
                  currentInterviewSnap.docs.length
                );

                if (currentInterviewSnap.docs.length > 0) {
                  const currentAnswers = currentInterviewSnap.docs.map(
                    (doc) => ({
                      id: doc.id,
                      ...doc.data(),
                    })
                  ) as UserAnswer[];
                  console.log("Current interview answers:", currentAnswers);
                  setFeedbacks(currentAnswers);
                } else {
                  console.log("No answers found for current interview");
                  toast.info("No answers found for current interview");
                }
              }}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              Current Interview
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
