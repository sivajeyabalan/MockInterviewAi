import React from "react";

import { Github, Linkedin, Mail, Code, User, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Container } from "@/components/container";
import { MainRoutes } from "@/lib/helpers";

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  hoverColor: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({
  href,
  icon,
  label,
  hoverColor,
}) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-2 p-3 rounded-lg hover:bg-muted/10 transition-all duration-200 group ${hoverColor}`}
      aria-label={label}
    >
      {icon}
      <span className="text-sm font-medium group-hover:translate-x-1 transition-transform">
        {label}
      </span>
    </a>
  );
};

interface FooterLinkProps {
  to: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ to, children }) => {
  return (
    <li>
      <Link
        to={to}
        className="text-muted-foreground hover:text-foreground transition-colors duration-200 hover:translate-x-1 transform"
      >
        {children}
      </Link>
    </li>
  );
};

export const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-br from-background via-muted/20 to-background border-t">
      <Container>
        <div className="py-16 space-y-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Developer Info */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                    <Code className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gradient">Sivajeyabalan</h3>
                    <p className="text-sm text-muted-foreground">
                      Full Stack Developer
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Passionate developer creating innovative solutions with modern
                  technologies. Building AI-powered applications to solve
                  real-world problems.
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {MainRoutes.map((route) => (
                  <FooterLink key={route.href} to={route.href}>
                    {route.label}
                  </FooterLink>
                ))}
              </ul>
            </div>

            {/* About Me */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                About Me
              </h3>
              <div className="space-y-3 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-sm">Full Stack Developer</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm">Available for remote work</span>
                </div>
                <p className="text-sm leading-relaxed">
                  Specializing in React, TypeScript, Node.js, and modern web
                  technologies. Always learning and building something new.
                </p>
              </div>
            </div>

            {/* Contact & Social */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Let's Connect
              </h3>
              <div className="space-y-2">
                <SocialLink
                  href="https://github.com/sivajeyabalan"
                  icon={<Github className="h-5 w-5" />}
                  label="GitHub"
                  hoverColor="hover:text-foreground"
                />
                <SocialLink
                  href="https://www.linkedin.com/in/siva-jeya-balan-a31b10261/"
                  icon={<Linkedin className="h-5 w-5" />}
                  label="LinkedIn"
                  hoverColor="hover:text-blue-500"
                />
                <SocialLink
                  href="mailto:sivajeyabalan15@example.com"
                  icon={<Mail className="h-5 w-5" />}
                  label="Email Me"
                  hoverColor="hover:text-primary"
                />
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-8 border-t border-border">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="text-muted-foreground text-sm">
                  © 2024 SivajB. All rights reserved. Built with ❤️ using React
                  & TypeScript.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Made with</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>by SivajB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};
