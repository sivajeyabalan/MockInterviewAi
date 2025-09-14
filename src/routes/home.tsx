// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Sparkles, ArrowRight, Users, TrendingUp, Award } from "lucide-react";
import Marquee from "react-fast-marquee";

import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { MarqueImg } from "@/components/marquee-img";
import { Link } from "react-router-dom";
import aiImg from "@/assets/aiImg.png";

const HomePage = () => {
  return (
    <div className="flex-col w-full pb-24">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10">
        <Container>
          <div className="py-20 md:py-32">
            <div className="text-center space-y-8 animate-fade-in">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight">
                <span className="text-gradient">AI Superpower</span>
                <br />
                <span className="text-4xl md:text-5xl lg:text-6xl text-muted-foreground font-bold">
                  for Interviews
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Master your interviews with AI-driven insights, personalized
                practice, and real-time feedback. Transform your preparation and
                land your dream job.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                <Link to="/generate">
                  <Button
                    size="lg"
                    className="btn-premium text-lg px-8 py-6 group"
                  >
                    Start Your Journey
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/signin">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 py-6 border-2 hover:bg-primary/5"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full animate-float"></div>
        <div
          className="absolute top-40 right-20 w-16 h-16 bg-accent/10 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/4 w-12 h-12 bg-primary/20 rounded-full animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Stats Section */}
      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-2 animate-slide-up">
            <div className="text-4xl md:text-5xl font-bold text-gradient">
              250k+
            </div>
            <div className="text-lg text-muted-foreground font-medium">
              Offers Received
            </div>
            <div className="text-sm text-muted-foreground">
              by our users worldwide
            </div>
          </div>
          <div
            className="text-center space-y-2 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="text-4xl md:text-5xl font-bold text-gradient">
              1.2M+
            </div>
            <div className="text-lg text-muted-foreground font-medium">
              Interviews Aced
            </div>
            <div className="text-sm text-muted-foreground">
              with AI-powered preparation
            </div>
          </div>
          <div
            className="text-center space-y-2 animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="text-4xl md:text-5xl font-bold text-gradient">
              69%
            </div>
            <div className="text-lg text-muted-foreground font-medium">
              Success Rate
            </div>
            <div className="text-sm text-muted-foreground">
              for prepared candidates
            </div>
          </div>
        </div>
      </Container>

      {/* Hero Image Section */}
      <Container className="py-16">
        <div className="relative rounded-3xl overflow-hidden shadow-premium group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 z-10"></div>
          <img
            src={aiImg}
            alt="AI Interview Preparation"
            className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
          />

          <div className="absolute top-8 left-8 z-20">
            <div className="glass rounded-2xl px-6 py-4">
              <div className="flex items-center gap-2 text-primary font-semibold">
                {/* <Sparkles className="h-5 w-5" />
                AI Interview Copilot */}
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 right-8 z-20 max-w-md">
            {/* <div className="card-premium p-8">
              <h3 className="text-2xl font-bold text-foreground mb-3">
                Ready to Ace Your Next Interview?
              </h3>
              <p className="text-muted-foreground mb-6">
                Get personalized questions, real-time feedback, and expert
                insights tailored to your role and experience level.
              </p>
              <Link to="/generate">
                <Button className="w-full btn-premium">
                  Start Practice Session
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div> */}
          </div>
        </div>
      </Container>

      {/* Features Section */}
      <Container className="py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gradient">
            Why Choose Our Platform?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the future of interview preparation with cutting-edge AI
            technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card-premium p-8 text-center space-y-4 group">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">Personalized Practice</h3>
            <p className="text-muted-foreground">
              AI adapts to your skill level and provides questions tailored to
              your target role
            </p>
          </div>

          <div className="card-premium p-8 text-center space-y-4 group">
            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-accent/20 transition-colors">
              <TrendingUp className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-2xl font-bold">Real-time Feedback</h3>
            <p className="text-muted-foreground">
              Get instant insights on your answers, body language, and
              communication skills
            </p>
          </div>

          <div className="card-premium p-8 text-center space-y-4 group">
            <div className="w-16 h-16 bg-chart-3/10 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-chart-3/20 transition-colors">
              <Award className="h-8 w-8 text-chart-3" />
            </div>
            <h3 className="text-2xl font-bold">Proven Results</h3>
            <p className="text-muted-foreground">
              Join thousands of successful candidates who landed their dream
              jobs
            </p>
          </div>
        </div>
      </Container>

      {/* Marquee Section */}
      <div className="py-16 bg-muted/30">
        <div className="text-center mb-8">
          <p className="text-muted-foreground font-medium">
            Trusted by leading companies worldwide
          </p>
        </div>
        <Marquee pauseOnHover speed={50}>
          <MarqueImg img="/assets/img/logo/firebase.png" />
          <MarqueImg img="/assets/img/logo/meet.png" />
          <MarqueImg img="/assets/img/logo/zoom.png" />
          <MarqueImg img="/assets/img/logo/microsoft.png" />
          <MarqueImg img="/assets/img/logo/tailwindcss.png" />
          <MarqueImg img="/assets/img/logo/react.png" />
        </Marquee>
      </div>

      {/* CTA Section */}
      <Container className="py-20">
        <div className="text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to Transform Your Interview Skills?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of professionals who have already elevated their
            interview game with our AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/signup">
              <Button size="lg" className="btn-premium text-lg px-8 py-6">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/signin">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 border-2"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HomePage;
