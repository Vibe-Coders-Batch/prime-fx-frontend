import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-lg mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link href="/learner/dashboard" className="text-primary hover:underline">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
