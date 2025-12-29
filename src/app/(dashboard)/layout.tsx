import { Navbar } from "@/components/layout/Navbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="pt-24 min-h-screen">
            <Navbar />
            {children}
        </div>
    );
}
