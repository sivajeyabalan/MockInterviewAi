import { Interview } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoaderPage } from "./loader-page";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { CustomBreadCrumb } from "@/components/custom-bread-crumb";

import { Button } from "@/components/ui/button";
import { Lightbulb, Video, CheckCircle, ArrowRight } from "lucide-react";
import { QuestionSection } from "@/components/question-section";

export const MockInterviewPage = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const fetchInterview = async () => {
      if (interviewId) {
        try {
          const interviewDoc = await getDoc(doc(db, "interviews", interviewId));
          if (interviewDoc.exists()) {
            setInterview({
              id: interviewDoc.id,
              ...interviewDoc.data(),
            } as Interview);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchInterview();
  }, [interviewId, navigate]);

  if (isLoading) {
    return <LoaderPage className="w-full h-[70vh]" />;
  }

  if (!interviewId || !interview) {
    navigate("/generate", { replace: true });
    return null;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="space-y-4">
        <CustomBreadCrumb
          breadCrumbPage="Start Interview"
          breadCrumpItems={[
            { label: "Mock Interviews", link: "/generate" },
            {
              label: interview?.position || "",
              link: `/generate/interview/${interview?.id}`,
            },
          ]}
        />

        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gradient">
            {interview?.position} Interview
          </h1>
          <p className="text-lg text-muted-foreground">
            Ready to showcase your skills? Let's begin your AI-powered
            interview.
          </p>
        </div>
      </div>

      {/* Important Note Card */}
      <div className="card-premium p-6 border-l-4 border-l-primary">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Lightbulb className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-foreground">
              Interview Instructions
            </h3>
            <div className="space-y-2 text-muted-foreground">
              <p>
                Press <strong>"Record Answer"</strong> to begin answering each
                question. Take your time to think through your responses.
              </p>
              <p>
                Once you finish the interview, you'll receive detailed feedback
                comparing your responses with ideal answers.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Video className="h-4 w-4" />
                <span>
                  <strong>Privacy:</strong> Your video is never recorded or
                  stored.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Questions Section */}
      {interview?.questions && interview?.questions.length > 0 && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Interview Questions</h2>
            <p className="text-muted-foreground">
              Answer each of the {interview?.questions?.length || 0} questions
              thoughtfully. Take your time!
            </p>
          </div>

          <div className="card-premium p-6">
            <QuestionSection questions={interview?.questions} />
          </div>

          {/* End Interview Section */}
          <div className="text-center space-y-4">
            <div className="card-premium p-6 border-2 border-dashed border-muted-foreground/20">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    Ready to Submit?
                  </h3>
                  <p className="text-muted-foreground">
                    Once you've answered all questions, click below to end the
                    interview and view your personalized feedback.
                  </p>
                </div>
                <Button
                  size="lg"
                  className="btn-premium"
                  onClick={() =>
                    navigate(`/generate/feedback/${interviewId}`, {
                      replace: true,
                    })
                  }
                >
                  <CheckCircle className="mr-2 h-5 w-5" />
                  End Interview & View Feedback
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
