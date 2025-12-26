"use client";
import {
  BookOpen,
  Database,
  BarChart3,
  Zap,
  HelpCircle,
  Lightbulb,
  ChevronRight,
  Code2,
  Settings,
  Globe,
} from "lucide-react";
import { useState } from "react";

const sections = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Zap,
    description: "Quick introduction and setup",
  },
  {
    id: "dashboard",
    title: "Dashboard Guide",
    icon: BarChart3,
    description: "Understanding the overview",
  },
  {
    id: "pnodes",
    title: "pNodes Management",
    icon: Database,
    description: "Browse and monitor nodes",
  },
  {
    id: "analytics",
    title: "Analytics",
    icon: Lightbulb,
    description: "Deep dive into insights",
  },
  {
    id: "features",
    title: "Features",
    icon: Settings,
    description: "Advanced features guide",
  },
  {
    id: "faq",
    title: "FAQ",
    icon: HelpCircle,
    description: "Common questions answered",
  },
];

export default function DocsClientPage() {
  const [activeSection, setActiveSection] = useState("getting-started");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 min-h-screen">
        {/* Sidebar - Left */}
        <aside className="lg:col-span-1 border-r border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="sticky top-20 p-6">
            {/* Sidebar Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="size-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  Documentation
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Learn how to use the dashboard
              </p>
            </div>

            {/* Sidebar Navigation */}
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left group relative px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon
                        className={`size-4 mt-0.5 flex-shrink-0 transition-transform ${
                          isActive ? "text-primary" : ""
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {section.title}
                        </p>
                        <p
                          className={`text-xs truncate ${
                            isActive
                              ? "text-primary/70"
                              : "text-muted-foreground"
                          }`}
                        >
                          {section.description}
                        </p>
                      </div>
                    </div>
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Sidebar Footer */}
            <div className="mt-8 pt-6 border-t border-border/30">
              <a
                href="https://github.com/denzubechi/xandeum-pnode-dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 hover:bg-muted text-foreground text-sm transition-colors"
              >
                <Code2 className="size-4" />
                View on GitHub
              </a>
            </div>
          </div>
        </aside>

        {/* Main Content - Right */}
        <main className="lg:col-span-3 p-6 lg:p-12">
          <div className="max-w-4xl">
            {/* Getting Started */}
            {activeSection === "getting-started" && (
              <div className="animate-fade-in space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center size-12 rounded-lg bg-primary/10">
                      <Zap className="size-6 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-foreground">
                        Getting Started
                      </h1>
                      <p className="text-muted-foreground">
                        Welcome to Xandeum pNode Analytics
                      </p>
                    </div>
                  </div>
                  <p className="text-foreground/80 leading-relaxed mt-4">
                    The Xandeum pNode Analytics Dashboard is a comprehensive
                    tool for monitoring and managing storage nodes on the
                    Xandeum network. Get real-time insights into node
                    performance, network health, and storage metrics.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 hover:bg-primary/10 transition-colors">
                    <Globe className="size-8 text-primary mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">
                      Real-time Monitoring
                    </h3>
                    <p className="text-sm text-foreground/70">
                      Monitor 200+ pNodes across the globe with live metrics
                    </p>
                  </div>

                  <div className="rounded-xl border border-accent/20 bg-accent/5 p-6 hover:bg-accent/10 transition-colors">
                    <BarChart3 className="size-8 text-accent mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">
                      Analytics & Insights
                    </h3>
                    <p className="text-sm text-foreground/70">
                      Deep dive into network performance and statistics
                    </p>
                  </div>

                  <div className="rounded-xl border border-chart-2/20 bg-[hsl(var(--chart-2)/0.05)] p-6 hover:bg-[hsl(var(--chart-2)/0.1)] transition-colors">
                    <Database
                      className="size-8 mb-3"
                      style={{ color: "hsl(var(--chart-2))" }}
                    />
                    <h3 className="font-semibold text-foreground mb-2">
                      Node Management
                    </h3>
                    <p className="text-sm text-foreground/70">
                      Search, filter, and manage nodes efficiently
                    </p>
                  </div>

                  <div className="rounded-xl border border-chart-3/20 bg-[hsl(var(--chart-3)/0.05)] p-6 hover:bg-[hsl(var(--chart-3)/0.1)] transition-colors">
                    <Settings
                      className="size-8 mb-3"
                      style={{ color: "hsl(var(--chart-3))" }}
                    />
                    <h3 className="font-semibold text-foreground mb-2">
                      Advanced Features
                    </h3>
                    <p className="text-sm text-foreground/70">
                      Theme toggle, refresh, and more controls
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-6">
                  <h3 className="font-semibold text-foreground mb-4">
                    Quick Start Steps
                  </h3>
                  <ol className="space-y-3">
                    {[
                      "Navigate to the Dashboard tab to see network overview and statistics",
                      "Explore the pNodes tab to browse all available storage nodes",
                      "Click on any node to view detailed metrics and performance data",
                      "Use Analytics to understand network trends and top performers",
                      "Use the search and filter features to find specific nodes quickly",
                    ].map((step, i) => (
                      <li key={i} className="flex gap-4">
                        <span className="flex items-center justify-center size-7 rounded-full bg-primary/10 text-primary font-semibold flex-shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-foreground/80 pt-0.5">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            {/* Dashboard Guide */}
            {activeSection === "dashboard" && (
              <div className="animate-fade-in space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center size-12 rounded-lg bg-blue-500/10">
                      <BarChart3 className="size-6 text-blue-500" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-foreground">
                        Dashboard Guide
                      </h1>
                      <p className="text-muted-foreground">
                        Understanding the overview tab
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-xl border border-border bg-card p-8">
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      Key Metrics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          label: "Total Nodes",
                          desc: "All pNodes discovered in the network",
                        },
                        {
                          label: "Online Nodes",
                          desc: "Nodes currently operational and responding",
                        },
                        {
                          label: "Network Health",
                          desc: "Overall health score (0-100)",
                        },
                        {
                          label: "Total Storage",
                          desc: "Combined storage capacity and usage",
                        },
                      ].map((metric, i) => (
                        <div key={i} className="border-l-2 border-primary pl-4">
                          <p className="font-medium text-foreground">
                            {metric.label}
                          </p>
                          <p className="text-sm text-foreground/70">
                            {metric.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-card p-8">
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      Interactive Charts
                    </h3>
                    <ul className="space-y-3">
                      {[
                        "Node Count Trend - Historical growth of nodes in the network",
                        "Status Distribution - Pie chart showing online/offline/degraded breakdown",
                        "Regional Distribution - Bar chart of nodes by geographic region",
                        "Uptime History - Line chart tracking uptime trends over time",
                      ].map((chart, i) => (
                        <li key={i} className="flex gap-3 text-foreground/80">
                          <ChevronRight className="size-5 text-primary flex-shrink-0 mt-0.5" />
                          {chart}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* pNodes Management */}
            {activeSection === "pnodes" && (
              <div className="animate-fade-in space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center size-12 rounded-lg bg-purple-500/10">
                      <Database className="size-6 text-purple-500" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-foreground">
                        pNodes Management
                      </h1>
                      <p className="text-muted-foreground">
                        Browse and manage storage nodes
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-xl border border-border bg-card p-8">
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      Search & Filtering
                    </h3>
                    <p className="text-foreground/80 mb-4">
                      Quickly find nodes using the powerful search and filter
                      system:
                    </p>
                    <ul className="space-y-2">
                      {[
                        "Search by Public Key - Full or partial key matching",
                        "Search by IP Address - Find nodes by their network address",
                        "Filter by Status - View online, offline, or degraded nodes",
                        "Filter by Region - Narrow results to specific geographic regions",
                        "Sort Columns - Click any column header to sort by that metric",
                      ].map((feature, i) => (
                        <li key={i} className="flex gap-3 text-foreground/80">
                          <ChevronRight className="size-5 text-primary flex-shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-border bg-card p-8">
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      Node Information
                    </h3>
                    <p className="text-foreground/80 mb-4">
                      Each node row displays:
                    </p>
                    <div className="space-y-3">
                      {[
                        {
                          label: "Public Key",
                          desc: "Unique identifier for the node",
                        },
                        {
                          label: "IP Address",
                          desc: "Network address and port",
                        },
                        {
                          label: "Status",
                          desc: "Online, offline, or degraded",
                        },
                        { label: "Region", desc: "Geographic location" },
                        {
                          label: "Uptime %",
                          desc: "Percentage of time online",
                        },
                        { label: "Storage", desc: "Used and total capacity" },
                      ].map((info, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="w-32 font-medium text-foreground">
                            {info.label}
                          </div>
                          <div className="text-foreground/70">{info.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics */}
            {activeSection === "analytics" && (
              <div className="animate-fade-in space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center size-12 rounded-lg bg-yellow-500/10">
                      <Lightbulb className="size-6 text-yellow-500" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-foreground">
                        Analytics
                      </h1>
                      <p className="text-muted-foreground">
                        Deep dive into network insights
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-xl border border-border bg-card p-8">
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      Available Analytics
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          title: "Top Performing Nodes",
                          desc: "View the highest performing nodes by uptime and storage",
                        },
                        {
                          title: "Network Statistics",
                          desc: "Comprehensive overview of network-wide metrics",
                        },
                        {
                          title: "Regional Distribution",
                          desc: "Understand the geographic spread of storage capacity",
                        },
                        {
                          title: "Version Information",
                          desc: "Track consensus and version distribution",
                        },
                      ].map((item, i) => (
                        <div key={i} className="border-l-2 border-primary pl-4">
                          <p className="font-medium text-foreground">
                            {item.title}
                          </p>
                          <p className="text-sm text-foreground/70">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Features */}
            {activeSection === "features" && (
              <div className="animate-fade-in space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center size-12 rounded-lg bg-green-500/10">
                      <Settings className="size-6 text-green-500" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-foreground">
                        Advanced Features
                      </h1>
                      <p className="text-muted-foreground">
                        Power-user capabilities
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-xl border border-border bg-card p-8">
                    <h3 className="text-xl font-semibold text-foreground mb-6">
                      Feature Highlights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          title: "Theme Toggle",
                          desc: "Switch between light and dark themes",
                        },
                        {
                          title: "Data Refresh",
                          desc: "Manually refresh data at any time",
                        },
                        {
                          title: "Responsive Design",
                          desc: "Works on desktop, tablet, and mobile",
                        },
                        {
                          title: "Smooth Animations",
                          desc: "Beautiful transitions and interactions",
                        },
                        {
                          title: "Pagination",
                          desc: "Efficiently browse large datasets",
                        },
                        {
                          title: "Copy Utilities",
                          desc: "Copy node keys with one click",
                        },
                      ].map((feature, i) => (
                        <div
                          key={i}
                          className="border border-border/50 rounded-lg p-4 hover:border-primary/50 transition-colors"
                        >
                          <p className="font-medium text-foreground">
                            {feature.title}
                          </p>
                          <p className="text-sm text-foreground/70 mt-1">
                            {feature.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FAQ */}
            {activeSection === "faq" && (
              <div className="animate-fade-in space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center size-12 rounded-lg bg-orange-500/10">
                      <HelpCircle className="size-6 text-orange-500" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-foreground">
                        Frequently Asked Questions
                      </h1>
                      <p className="text-muted-foreground">
                        Common questions and answers
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      q: "How often is the data updated?",
                      a: "Data is refreshed automatically every 30 seconds. You can also manually refresh anytime using the refresh button in the header.",
                    },
                    {
                      q: "What does each node status mean?",
                      a: "Online means the node is operational, Offline means no response, and Degraded means the node is functioning but with issues.",
                    },
                    {
                      q: "Can I export node data?",
                      a: "You can copy individual node public keys using the copy button in the table, or export the entire dataset through the pnodes API.",
                    },
                    {
                      q: "How is network health calculated?",
                      a: "Network health is computed from the percentage of online nodes, average uptime, and storage utilization across all nodes.",
                    },
                    {
                      q: "What is the maximum number of nodes?",
                      a: "The dashboard can handle and display hundreds of nodes. Pagination and filtering help manage large datasets efficiently.",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-border bg-card p-6 hover:bg-card/80 transition-colors"
                    >
                      <p className="font-semibold text-foreground mb-3 flex items-start gap-2">
                        <span className="text-primary">Q:</span>
                        {item.q}
                      </p>
                      <p className="text-foreground/80 pl-6">
                        <span className="text-primary font-semibold">A:</span>{" "}
                        {item.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
