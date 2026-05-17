export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-secondary/30 relative flex min-h-screen flex-1 flex-col items-center justify-center px-4 py-12">
      <div
        className="bg-brand-red/10 absolute top-1/4 -right-32 -z-10 h-96 w-96 rounded-full blur-3xl"
        aria-hidden
      />
      <div
        className="bg-brand-navy/10 absolute bottom-1/4 -left-32 -z-10 h-96 w-96 rounded-full blur-3xl"
        aria-hidden
      />
      {children}
    </div>
  );
}
