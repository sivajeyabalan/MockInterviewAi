import { InterviewPin } from "@/components/pin";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/config/firebase.config";
import { Interview } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Plus, Sparkles, TrendingUp, Calendar, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export const Dashboard = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const userId = user?.uid;

  useEffect(() => {
    setLoading(true);
    const interviewQuery = query(
      collection(db, "interviews"),
      where("userId", "==", userId)
    );

    const unsubscribe = onSnapshot(
      interviewQuery,
      (snapshot) => {
        const interviewList: Interview[] = snapshot.docs.map((doc) => {
          const id = doc.id;
          return {
            id,
            ...doc.data(),
          };
        }) as Interview[];
        setInterviews(interviewList);
        setLoading(false);
      },
      (error) => {
        console.log("Error on fetching : ", error);
        toast.error("Error..", {
          description: "Something went wrong.. Try again later..",
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gradient">Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Manage and track your AI-powered interview sessions
          </p>
        </div>
        <Link to={"/generate/create"}>
          <Button size="lg" className="btn-premium">
            <Plus className="mr-2 h-5 w-5" />
            Create New Interview
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-premium p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Interviews
              </p>
              <p className="text-3xl font-bold text-gradient">
                {interviews.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Target className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="card-premium p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                This Month
              </p>
              <p className="text-3xl font-bold text-gradient">
                {
                  interviews.filter((interview) => {
                    const createdAt = interview.createdAt?.toDate();
                    if (!createdAt) return false;
                    const now = new Date();
                    const startOfMonth = new Date(
                      now.getFullYear(),
                      now.getMonth(),
                      1
                    );
                    return createdAt >= startOfMonth;
                  }).length
                }
              </p>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
              <Calendar className="h-6 w-6 text-accent" />
            </div>
          </div>
        </div>

        <div className="card-premium p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Success Rate
              </p>
              <p className="text-3xl font-bold text-gradient">98%</p>
            </div>
            <div className="w-12 h-12 bg-chart-3/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-chart-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Interviews Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your Interview Sessions</h2>
          <div className="text-sm text-muted-foreground">
            {interviews.length}{" "}
            {interviews.length === 1 ? "session" : "sessions"}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-48 rounded-2xl" />
            ))
          ) : interviews.length > 0 ? (
            interviews.map((interview) => (
              <div key={interview.id} className="animate-slide-up">
                <InterviewPin interview={interview} />
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
              <div className="w-32 h-32 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="h-16 w-16 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-muted-foreground mb-4">
                No Interview Sessions Yet
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md">
                Start your journey by creating your first AI-powered interview
                session. Get personalized questions and real-time feedback.
              </p>
              <Link to={"/generate/create"}>
                <Button size="lg" className="btn-premium">
                  <Plus className="mr-2 h-5 w-5" />
                  Create Your First Interview
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
