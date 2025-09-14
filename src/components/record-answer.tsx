import { useAuth } from "@/contexts/AuthContext";
import {
  CircleStop,
  Loader,
  Mic,
  RefreshCw,
  Save,
  Video,
  VideoOff,
  WebcamIcon,
  CheckCircle,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import useSpeechToText, { ResultType } from "react-hook-speech-to-text";
import { useParams } from "react-router-dom";
import WebCam from "react-webcam";
import { TooltipButton } from "./tooltip-button";
import { toast } from "sonner";
import { chatSession } from "@/scripts";
import { SaveModal } from "./save-modal";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebase.config";

interface RecordAnswerProps {
  question: { question: string; answer: string };
  isWebCam: boolean;
  setIsWebCam: (value: boolean) => void;
}

interface AIResponse {
  ratings: number;
  feedback: string;
}

export const RecordAnswer = ({
  question,
  isWebCam,
  setIsWebCam,
}: RecordAnswerProps) => {
  const {
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
    speechRecognitionProperties: {
      interimResults: true,
      maxAlternatives: 3,
      grammars: undefined,
    },
    timeout: 10000, // 10 seconds timeout
    crossBrowser: false, // Use native browser API for better performance
  });

  const [userAnswer, setUserAnswer] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<AIResponse | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [confidence, setConfidence] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioQuality, setAudioQuality] = useState<"good" | "fair" | "poor">(
    "good"
  );

  const { user } = useAuth();
  const userId = user?.uid;
  const { interviewId } = useParams();

  const recordUserAnswer = async () => {
    if (isRecording) {
      try {
        stopSpeechToText();
      } catch (error) {
        console.error("Error stopping speech recognition:", error);
        toast.error("Error", {
          description: "Failed to stop recording. Please try again.",
        });
        return;
      }

      // Check if we have enough content
      if (userAnswer?.length < 30) {
        toast.error("Answer Too Short", {
          description:
            "Your answer should be more than 30 characters. Please try speaking longer.",
        });
        return;
      }

      // Check audio quality
      if (audioQuality === "poor" && confidence < 0.5) {
        toast.warning("Low Audio Quality", {
          description:
            "Audio quality is poor. Consider re-recording for better results.",
        });
      }

      // Generate AI result
      const aiResult = await generateResult(
        question.question,
        question.answer,
        userAnswer
      );

      setAiResult(aiResult);

      // Auto-save the result after AI generation
      if (aiResult && aiResult.ratings > 0) {
        console.log("Auto-saving AI result...", aiResult);
        try {
          await saveUserAnswer(false, aiResult);
          console.log("Auto-save completed successfully");
        } catch (error) {
          console.error("Auto-save failed:", error);
          toast.error("Save Failed", {
            description: "Failed to save your answer. Please try again.",
          });
        }
      } else {
        console.log("Auto-save skipped - no valid AI result:", {
          aiResult,
          ratings: aiResult?.ratings,
        });
      }
    } else {
      try {
        // Reset states when starting
        setConfidence(0);
        setAudioQuality("good");
        startSpeechToText();
        toast.success("Recording Started", {
          description: "Speak clearly into your microphone.",
        });
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        toast.error("Recording Failed", {
          description:
            "Failed to start recording. Please check your microphone permissions and try again.",
        });
      }
    }
  };

  const cleanJsonResponse = (responseText: string) => {
    // Step 1: Trim any surrounding whitespace
    let cleanText = responseText.trim();

    // Step 2: Remove any occurrences of "json" or code block symbols (``` or `)
    cleanText = cleanText.replace(/(json|```|`)/g, "");

    // Step 3: Clean and normalize text
    cleanText = cleanText
      .replace(/[^\x20-\x7E\s]/g, "") // Remove non-printable characters
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim();

    // Step 4: Try to extract JSON from the response if it's wrapped in other text
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanText = jsonMatch[0];
    }

    // Step 5: Fix common AI response format issues
    cleanText = cleanText
      .replace(/"ratings"\s*:\s*\[(\d+)\]/g, '"ratings": $1') // Convert array to number
      .replace(/"ratings"\s*:\s*\[(\d+\.?\d*)\]/g, '"ratings": $1'); // Handle decimal numbers

    // Step 5: Parse the clean JSON text
    try {
      return JSON.parse(cleanText);
    } catch (error) {
      console.error("JSON parsing error:", error);
      console.error("Cleaned text:", cleanText);

      // Fallback: try to extract just the essential parts
      try {
        const ratingsMatch = cleanText.match(/"ratings"\s*:\s*\[?(\d+)\]?/);
        const feedbackMatch = cleanText.match(/"feedback"\s*:\s*"([^"]*)"/);

        if (ratingsMatch && feedbackMatch) {
          return {
            ratings: parseInt(ratingsMatch[1]),
            feedback: feedbackMatch[1],
          };
        }
      } catch (fallbackError) {
        console.error("Fallback parsing also failed:", fallbackError);
      }

      throw new Error("Invalid JSON format: " + (error as Error)?.message);
    }
  };

  const generateResult = async (
    qst: string,
    qstAns: string,
    userAns: string
  ): Promise<AIResponse> => {
    setIsAiGenerating(true);
    const prompt = `Question: "${qst}"
User Answer: "${userAns}"
Correct Answer: "${qstAns}"

Please compare the user's answer to the correct answer and provide a rating from 1 to 10 based on answer quality, plus feedback for improvement.

IMPORTANT: Return ONLY valid JSON in this exact format:
{
  "ratings": [number between 1-10],
  "feedback": "[your feedback text here]"
}

Do not include any other text, explanations, or formatting outside the JSON object.`;

    try {
      const aiResult = await chatSession.sendMessage(prompt);
      const responseText = aiResult.response.text();

      console.log("AI Response:", responseText);

      const parsedResult: AIResponse = cleanJsonResponse(responseText);
      console.log("Parsed Result:", parsedResult);

      return parsedResult;
    } catch (error) {
      console.error("Error generating AI result:", error);
      toast.error("Error", {
        description:
          "An error occurred while generating feedback. Please try again.",
      });
      return { ratings: 0, feedback: "Unable to generate feedback" };
    } finally {
      setIsAiGenerating(false);
    }
  };

  const recordNewAnswer = () => {
    setUserAnswer("");
    setAiResult(null);
    setIsSaved(false);
    stopSpeechToText();
    startSpeechToText();
  };

  const saveUserAnswer = async (
    showModal = true,
    aiResultToSave: AIResponse | null = null
  ) => {
    setLoading(true);

    const resultToSave = aiResultToSave || aiResult;
    if (!resultToSave) {
      console.log("No AI result to save", { aiResultToSave, aiResult });
      return;
    }

    const currentQuestion = question.question;
    try {
      // query the firbase to check if the user answer already exists for this question
      const userAnswerQuery = query(
        collection(db, "userAnswers"),
        where("userId", "==", userId),
        where("question", "==", currentQuestion)
      );

      const querySnap = await getDocs(userAnswerQuery);

      // if the user already answerd the question dont save it again
      if (!querySnap.empty) {
        console.log("Query Snap Size", querySnap.size);
        if (showModal) {
          toast.info("Already Answered", {
            description: "You have already answered this question",
          });
        }
        return;
      } else {
        // save the user answer
        const userAnswerData = {
          mockIdRef: interviewId,
          question: question.question,
          correct_ans: question.answer,
          user_ans: userAnswer,
          feedback: resultToSave.feedback,
          rating: resultToSave.ratings,
          userId,
          createdAt: serverTimestamp(),
          updateAt: serverTimestamp(),
        };

        console.log("Saving user answer:", userAnswerData);

        const docRef = await addDoc(
          collection(db, "userAnswers"),
          userAnswerData
        );
        console.log("User answer saved with ID:", docRef.id);

        // Verify the data was saved correctly
        const verifyQuery = query(
          collection(db, "userAnswers"),
          where("userId", "==", userId),
          where("mockIdRef", "==", interviewId)
        );
        const verifySnap = await getDocs(verifyQuery);
        console.log(
          "Verification: Found",
          verifySnap.docs.length,
          "answers for this interview"
        );

        if (showModal) {
          toast("Saved", { description: "Your answer has been saved.." });
        } else {
          toast.success("Auto-saved", {
            description:
              "Your answer and feedback have been automatically saved!",
          });
        }
        setIsSaved(true);
      }

      if (showModal) {
        setUserAnswer("");
        stopSpeechToText();
      }
    } catch (error) {
      console.error("Error saving user answer:", error);
      toast.error("Error", {
        description: "An error occurred while saving your answer.",
      });
    } finally {
      setLoading(false);
      if (showModal) {
        setOpen(!open);
      }
    }
  };

  useEffect(() => {
    if (results.length === 0) return;

    setIsProcessing(true);

    // Process results with confidence scoring and filtering
    const processedResults = results
      .filter((result): result is ResultType => typeof result !== "string")
      .map((result) => ({
        transcript: result.transcript,
        confidence: 0.8, // Default confidence since the library doesn't provide it
        timestamp: result.timestamp || Date.now(),
      }))
      .filter((result) => {
        // Filter out low-confidence results and very short transcripts
        return result.confidence > 0.3 && result.transcript.trim().length > 2;
      })
      .sort((a, b) => a.timestamp - b.timestamp); // Sort by timestamp

    if (processedResults.length > 0) {
      // Calculate average confidence
      const avgConfidence =
        processedResults.reduce((sum, result) => sum + result.confidence, 0) /
        processedResults.length;
      setConfidence(avgConfidence);

      // Determine audio quality based on confidence
      if (avgConfidence > 0.8) {
        setAudioQuality("good");
      } else if (avgConfidence > 0.6) {
        setAudioQuality("fair");
      } else {
        setAudioQuality("poor");
      }

      // Combine transcripts with better spacing
      const combineTranscripts = processedResults
        .map((result) => result.transcript.trim())
        .join(" ")
        .replace(/\s+/g, " ") // Remove extra spaces
        .trim();

      setUserAnswer(combineTranscripts);
    }

    setIsProcessing(false);
  }, [results]);

  return (
    <div className="w-full flex flex-col items-center gap-8 mt-4">
      {/* save modal */}
      <SaveModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={saveUserAnswer}
        loading={loading}
      />

      <div className="w-full h-[400px] md:w-96 flex flex-col items-center justify-center border p-4 bg-gray-50 rounded-md">
        {isWebCam ? (
          <WebCam
            onUserMedia={() => setIsWebCam(true)}
            onUserMediaError={() => setIsWebCam(false)}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <WebcamIcon className="min-w-24 min-h-24 text-muted-foreground" />
        )}
      </div>

      <div className="flex itece justify-center gap-3">
        <TooltipButton
          content={isWebCam ? "Turn Off" : "Turn On"}
          icon={
            isWebCam ? (
              <VideoOff className="min-w-5 min-h-5" />
            ) : (
              <Video className="min-w-5 min-h-5" />
            )
          }
          onClick={() => setIsWebCam(!isWebCam)}
        />

        <TooltipButton
          content={isRecording ? "Stop Recording" : "Start Recording"}
          icon={
            isRecording ? (
              <CircleStop className="min-w-5 min-h-5" />
            ) : (
              <Mic className="min-w-5 min-h-5" />
            )
          }
          onClick={recordUserAnswer}
        />

        <TooltipButton
          content="Record Again"
          icon={<RefreshCw className="min-w-5 min-h-5" />}
          onClick={recordNewAnswer}
        />

        <TooltipButton
          content={isSaved ? "Already Saved" : "Save Result"}
          icon={
            isAiGenerating ? (
              <Loader className="min-w-5 min-h-5 animate-spin" />
            ) : isSaved ? (
              <CheckCircle className="min-w-5 min-h-5 text-green-500" />
            ) : (
              <Save className="min-w-5 min-h-5" />
            )
          }
          onClick={() => setOpen(!open)}
          disbaled={!aiResult || isSaved}
        />
      </div>

      <div className="w-full mt-4 p-4 border rounded-md bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Your Answer:</h2>
          <div className="flex items-center gap-3">
            {/* Confidence Indicator */}
            {isRecording && confidence > 0 && (
              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-600">Confidence:</div>
                <div className="flex items-center gap-1">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        confidence > 0.8
                          ? "bg-green-500"
                          : confidence > 0.6
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600">
                    {Math.round(confidence * 100)}%
                  </span>
                </div>
              </div>
            )}

            {/* Processing Indicator */}
            {isProcessing && (
              <div className="flex items-center gap-1 text-blue-600 text-sm">
                <Loader className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </div>
            )}

            {isSaved && (
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <CheckCircle className="h-4 w-4" />
                <span>Saved</span>
              </div>
            )}
          </div>
        </div>

        <p className="text-sm mt-2 text-gray-700 whitespace-normal">
          {userAnswer || "Start recording to see your answer here"}
        </p>

        {/* Audio Quality Tips */}
        {isRecording && audioQuality === "poor" && (
          <div className="mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <p className="text-xs text-yellow-600 mb-1">Audio Quality Tips:</p>
            <ul className="text-xs text-yellow-800 list-disc list-inside space-y-1">
              <li>Speak closer to your microphone</li>
              <li>Reduce background noise</li>
              <li>Speak more clearly and slowly</li>
            </ul>
          </div>
        )}

        {/* Interim Result Display */}
        {interimResult && interimResult !== userAnswer && (
          <div className="mt-2 p-2 bg-blue-50 border-l-4 border-blue-400 rounded">
            <p className="text-xs text-blue-600 mb-1">Listening...</p>
            <p className="text-sm text-blue-800 italic">{interimResult}</p>
          </div>
        )}

        {aiResult && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-semibold text-blue-800">
                AI Feedback:
              </h3>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">
                  {aiResult.ratings}/10
                </span>
              </div>
            </div>
            <p className="text-sm text-blue-700">{aiResult.feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
};
