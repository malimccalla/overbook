import { AppSidebar } from "@/components/app-sidebar";
import { GraphQLProvider } from "@/components/graphql-provider";
import { PageHeader } from "@/components/page-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GraphQLProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <PageHeader />
          <div className="flex-1 overflow-hidden">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </GraphQLProvider>
  );
}
