"use client";

import {
  BarChart3,
  BookOpen,
  ChevronRight,
  Code2,
  Database,
  Globe,
  HelpCircle,
  Lightbulb,
  Settings,
  Zap,
} from "lucide-react";
import { useState } from "react";

const sections = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Setup & basics",
    icon: Zap,
  },
  {
    id: "dashboard",
    title: "Dashboard",
    description: "Overview tab guide",
    icon: BarChart3,
  },
  {
    id: "pnodes",
    title: "pNodes",
    description: "Node management",
    icon: Database,
  },
  {
    id: "analytics",
    title: "Analytics",
    description: "Network insights",
    icon: Lightbulb,
  },
  {
    id: "features",
    title: "Features",
    description: "Advanced tools",
    icon: Settings,
  },
  {
    id: "faq",
    title: "FAQ",
    description: "Common questions",
    icon: HelpCircle,
  },
];

export default function DocsClientPage() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [searchTerm, setSearchTerm] = useState("");
  const filteredSections = sections.filter((section) =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 min-h-screen">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-1 border-r border-border/50 bg-card/40 backdrop-blur-xl sticky top-0 h-screen overflow-y-auto">
          <div className="p-6 space-y-8">
            {/* Sidebar Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center size-8 rounded-lg bg-primary/20">
                  <BookOpen className="size-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">Docs</h2>
                  <p className="text-xs text-muted-foreground">v1.0</p>
                </div>
              </div>
            </div>

            {/* Search-like input (visual) */}
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search docs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-muted/30 border border-border/50 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1">
              {filteredSections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left group relative px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-primary/15 text-primary font-semibold border border-primary/30"
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
            <div className="pt-6 border-t border-border/30 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Resources
              </p>
              <a
                href="https://github.com/denzubechi/xandeum-pnode-dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm transition-all font-medium"
              >
                <Code2 className="size-4" />
                GitHub
              </a>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-4 p-6 lg:p-12 max-w-5xl">
          {/* Getting Started */}
          {activeSection === "getting-started" && (
            <div className="animate-fade-in space-y-8">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center size-14 rounded-xl bg-primary/15 flex-shrink-0">
                    <Zap className="size-7 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-foreground">
                      Getting Started
                    </h1>
                    <p className="text-lg text-muted-foreground mt-2">
                      Learn the basics and start monitoring your pNodes
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="prose-like space-y-4">
                  <p className="text-foreground/80 leading-relaxed text-lg">
                    The Xandeum pNode Analytics Dashboard is a comprehensive
                    monitoring solution for storage nodes on the Xandeum
                    network. Get real-time insights into node performance,
                    network health, and storage metrics at a glance.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      icon: Globe,
                      title: "Global Network View",
                      desc: "Monitor 200+ pNodes across regions",
                    },
                    {
                      icon: BarChart3,
                      title: "Advanced Analytics",
                      desc: "Deep dive into metrics and trends",
                    },
                    {
                      icon: Database,
                      title: "Smart Filtering",
                      desc: "Find nodes with powerful search",
                    },
                    {
                      icon: Settings,
                      title: "Pro Features",
                      desc: "Theme, refresh, export & more",
                    },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={i}
                        className="group rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-6 hover:border-primary/40 hover:bg-primary/10 transition-all duration-200"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex items-center justify-center size-10 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                            <Icon className="size-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {item.title}
                            </h3>
                            <p className="text-sm text-foreground/70">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-6">
                    Quick Start Guide
                  </h3>
                  <div className="space-y-4">
                    {[
                      "Visit the Dashboard tab to see real-time network overview and key metrics",
                      "Explore pNodes tab to browse, search, and filter storage nodes",
                      "Click any node row to view detailed metrics, charts, and performance data",
                      "Use Analytics tab to identify top performers and regional distribution",
                      "Export data as CSV for further analysis in spreadsheets",
                    ].map((step, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="flex items-center justify-center size-8 rounded-full bg-primary/20 text-primary font-bold flex-shrink-0">
                          {i + 1}
                        </div>
                        <p className="text-foreground/80 pt-0.5">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dashboard */}
          {activeSection === "dashboard" && (
            <div className="animate-fade-in space-y-8">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center size-14 rounded-xl bg-blue-500/15 flex-shrink-0">
                    <BarChart3 className="size-7 text-blue-500" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-foreground">
                      Dashboard Overview
                    </h1>
                    <p className="text-lg text-muted-foreground mt-2">
                      Understanding the main analytics view
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Key Metrics
                  </h2>
                  <div className="rounded-xl border border-border/50 bg-card/50 p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          label: "Total Nodes",
                          desc: "All discovered pNodes in the network",
                        },
                        {
                          label: "Online Nodes",
                          desc: "Nodes currently operational and healthy",
                        },
                        {
                          label: "Network Health",
                          desc: "Composite health score (0-100)",
                        },
                        {
                          label: "Total Storage",
                          desc: "Combined capacity and active usage",
                        },
                      ].map((metric, i) => (
                        <div key={i} className="border-l-3 border-primary pl-4">
                          <p className="font-semibold text-foreground text-lg">
                            {metric.label}
                          </p>
                          <p className="text-sm text-foreground/70 mt-1">
                            {metric.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Interactive Charts
                  </h2>
                  <div className="rounded-xl border border-border/50 bg-card/50 p-8">
                    <ul className="space-y-4">
                      {[
                        "Node Count Trend - Visualize network growth and node accumulation patterns",
                        "Status Distribution - Pie chart showing online, offline, and degraded breakdown",
                        "Regional Distribution - Bar chart of nodes per geographic region",
                        "Uptime History - Line chart tracking 24-hour uptime trends",
                      ].map((chart, i) => (
                        <li key={i} className="flex gap-4 text-foreground/80">
                          <ChevronRight className="size-5 text-primary flex-shrink-0 mt-0.5" />
                          {chart}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* pNodes Management */}
          {activeSection === "pnodes" && (
            <div className="animate-fade-in space-y-8">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center size-14 rounded-xl bg-purple-500/15 flex-shrink-0">
                    <Database className="size-7 text-purple-500" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-foreground">
                      pNodes Management
                    </h1>
                    <p className="text-lg text-muted-foreground mt-2">
                      Browse and manage storage nodes effectively
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Search & Filtering
                  </h2>
                  <div className="rounded-xl border border-border/50 bg-card/50 p-8">
                    <p className="text-foreground/80 mb-6">
                      Find nodes quickly with our powerful search and filter
                      system:
                    </p>
                    <ul className="space-y-3">
                      {[
                        "Full or partial public key matching",
                        "IP address and port lookup",
                        "Filter by status: online, offline, degraded",
                        "Regional and geographic filtering",
                        "Click column headers to sort any metric",
                      ].map((feature, i) => (
                        <li key={i} className="flex gap-3 text-foreground/80">
                          <ChevronRight className="size-5 text-primary flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Node Details
                  </h2>
                  <div className="rounded-xl border border-border/50 bg-card/50 p-8">
                    <div className="space-y-4">
                      {[
                        {
                          label: "Public Key",
                          desc: "Unique identifier and address",
                        },
                        {
                          label: "IP & Port",
                          desc: "Network location and endpoint",
                        },
                        {
                          label: "Status Badge",
                          desc: "Current operational status",
                        },
                        { label: "Region", desc: "Geographic location" },
                        {
                          label: "Uptime %",
                          desc: "24h availability percentage",
                        },
                        {
                          label: "Storage Metrics",
                          desc: "Used vs total capacity",
                        },
                      ].map((info, i) => (
                        <div
                          key={i}
                          className="flex gap-4 pb-3 border-b border-border/30 last:border-0"
                        >
                          <div className="w-32 font-semibold text-foreground">
                            {info.label}
                          </div>
                          <div className="text-foreground/70">{info.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    CSV Export
                  </h2>
                  <div className="rounded-xl border border-border/50 bg-card/50 p-8">
                    <p className="text-foreground/80">
                      Export filtered node data as CSV for analysis in
                      spreadsheets. Click the "Export CSV" button to download
                      your current view with all applied filters and sorting.
                    </p>
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* Analytics */}
          {activeSection === "analytics" && (
            <div className="animate-fade-in space-y-8">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center size-14 rounded-xl bg-yellow-500/15 flex-shrink-0">
                    <Lightbulb className="size-7 text-yellow-500" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-foreground">
                      Advanced Analytics
                    </h1>
                    <p className="text-lg text-muted-foreground mt-2">
                      Deep network insights and performance metrics
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Analytics Features
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        title: "Top Performers",
                        desc: "Highest health score nodes with clickable links",
                      },
                      {
                        title: "Regional Stats",
                        desc: "Node distribution across geographic regions",
                      },
                      {
                        title: "Version Tracking",
                        desc: "Software version and consensus distribution",
                      },
                      {
                        title: "Pod Statistics",
                        desc: "Storage pod metrics and availability rates",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-border/50 bg-card/50 p-4 hover:border-primary/50 transition-colors"
                      >
                        <p className="font-semibold text-foreground">
                          {item.title}
                        </p>
                        <p className="text-sm text-foreground/70 mt-2">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Data Export
                  </h2>
                  <div className="rounded-xl border border-border/50 bg-card/50 p-8">
                    <p className="text-foreground/80">
                      Export top performing nodes as CSV for reporting and
                      further analysis. The export includes all performance
                      metrics, health scores, and regional information.
                    </p>
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* Features */}
          {activeSection === "features" && (
            <div className="animate-fade-in space-y-8">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center size-14 rounded-xl bg-green-500/15 flex-shrink-0">
                    <Settings className="size-7 text-green-500" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-foreground">
                      Advanced Features
                    </h1>
                    <p className="text-lg text-muted-foreground mt-2">
                      Professional tools for power users
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      title: "Light/Dark Theme",
                      desc: "Toggle between light and dark modes",
                    },
                    {
                      title: "Data Refresh",
                      desc: "Manually refresh data at any time",
                    },
                    {
                      title: "Responsive Design",
                      desc: "Works on all devices and screens",
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
                      title: "CSV Export",
                      desc: "Export data for external analysis",
                    },
                    {
                      title: "Tab Navigation",
                      desc: "Quick access to all dashboard areas",
                    },
                    {
                      title: "Copy Utilities",
                      desc: "One-click copy for keys and addresses",
                    },
                  ].map((feature, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-border/50 bg-card/50 p-6 hover:border-primary/50 hover:bg-card transition-all"
                    >
                      <p className="font-semibold text-foreground">
                        {feature.title}
                      </p>
                      <p className="text-sm text-foreground/70 mt-2">
                        {feature.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FAQ */}
          {activeSection === "faq" && (
            <div className="animate-fade-in space-y-8">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center size-14 rounded-xl bg-orange-500/15 flex-shrink-0">
                    <HelpCircle className="size-7 text-orange-500" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-foreground">
                      Frequently Asked Questions
                    </h1>
                    <p className="text-lg text-muted-foreground mt-2">
                      Answers to common questions
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    q: "How often is data refreshed?",
                    a: "Data updates automatically every 10 seconds in production. Use the refresh button for immediate updates.",
                  },
                  {
                    q: "What do node statuses mean?",
                    a: "Online: fully operational, Offline: no response, Degraded: functioning with issues.",
                  },
                  {
                    q: "Can I export node data?",
                    a: "Yes, use the CSV export buttons in the pNodes and Analytics pages to download data.",
                  },
                  {
                    q: "How is network health calculated?",
                    a: "Health score combines online percentage, average uptime, and storage utilization metrics.",
                  },
                  {
                    q: "What's the node limit?",
                    a: "The dashboard handles 200+ nodes efficiently with pagination and filtering.",
                  },
                  {
                    q: "Can I search by IP?",
                    a: "Yes, the search bar supports public keys, partial keys, and IP addresses.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-border/50 bg-card/50 p-6 space-y-3"
                  >
                    <p className="font-semibold text-foreground flex items-start gap-2">
                      <span className="text-primary">Q:</span>
                      {item.q}
                    </p>
                    <p className="text-foreground/80 flex gap-2">
                      <span className="text-primary font-semibold flex-shrink-0">
                        A:
                      </span>
                      <span>{item.a}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
