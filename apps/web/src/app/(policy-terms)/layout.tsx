import Footer from "@/components/Footer";

export default function PolicyTermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </>
  );
}
