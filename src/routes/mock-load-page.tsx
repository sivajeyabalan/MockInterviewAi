/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from "@/config/firebase.config";
import { Interview } from "@/types";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LoaderPage } from "./loader-page";
import { CustomBreadCrumb } from "@/components/custom-bread-crumb";
import { Button } from "@/components/ui/button";
import {
  Lightbulb,
  Sparkles,
  WebcamIcon,
  Video,
  Mic,
  Play,
} from "lucide-react";
import { InterviewPin } from "@/components/pin";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import WebCam from "react-webcam";

export const MockLoadPage = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isWebCamEnabled, setIsWebCamEnabled] = useState(false);

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

  if (!interviewId) {
    navigate("/generate", { replace: true });
  }

  if (!interview) {
    navigate("/generate", { replace: true });
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <CustomBreadCrumb
          breadCrumbPage={interview?.position || ""}
          breadCrumpItems={[{ label: "Mock Interviews", link: "/generate" }]}
        />

        <Link to={`/generate/interview/${interviewId}/start`}>
          <Button size="lg" className="btn-premium">
            <Play className="mr-2 h-5 w-5" />
            Start Interview
          </Button>
        </Link>
      </div>

      {/* Interview Details Card */}
      {interview && (
        <div className="card-premium p-6">
          <InterviewPin interview={interview} onMockPage />
        </div>
      )}

      {/* Setup Instructions */}
      <div className="card-premium p-6 border-l-4 border-l-accent">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Lightbulb className="h-6 w-6 text-accent" />
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-foreground">
              Setup Instructions
            </h3>
            <div className="space-y-2 text-muted-foreground">
              <p>
                Enable your webcam and microphone to start the AI-generated mock
                interview. The interview consists of{" "}
                {interview?.questions?.length || 0} carefully crafted questions.
              </p>
              <p>
                You'll receive a personalized report with detailed feedback
                based on your responses.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  <span>
                    <strong>Privacy:</strong> Video never recorded
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  <span>
                    <strong>Audio:</strong> Used for speech analysis
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Webcam Section */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Camera Setup</h2>
          <p className="text-muted-foreground">
            Test your camera and microphone before starting the interview
          </p>
        </div>

        <div className="flex justify-center">
          <div className="card-premium p-8 w-full max-w-2xl">
            <div className="aspect-video w-full flex flex-col items-center justify-center bg-muted/30 rounded-2xl overflow-hidden">
              {isWebCamEnabled ? (
                <WebCam
                  onUserMedia={() => setIsWebCamEnabled(true)}
                  onUserMediaError={() => setIsWebCamEnabled(false)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-4 text-muted-foreground">
                  <WebcamIcon className="h-24 w-24" />
                  <p className="text-lg font-medium">Camera Disabled</p>
                  <p className="text-sm text-center">
                    Click the button below to enable your camera
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={() => setIsWebCamEnabled(!isWebCamEnabled)}
            variant={isWebCamEnabled ? "destructive" : "default"}
            size="lg"
            className={isWebCamEnabled ? "" : "btn-premium"}
          >
            {isWebCamEnabled ? (
              <>
                <Video className="mr-2 h-5 w-5" />
                Disable Camera
              </>
            ) : (
              <>
                <Video className="mr-2 h-5 w-5" />
                Enable Camera
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
