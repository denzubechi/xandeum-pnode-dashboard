import DocsClientPage from "./docs-client-page";
import { NetworkHeader } from "@/components/network-header";

export const metadata = {
  title: "Documentation - Xandeum pNode Analytics",
  description: "Learn how to use the Xandeum pNode Analytics Dashboard",
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <NetworkHeader />
      <DocsClientPage />
    </div>
  );
}
