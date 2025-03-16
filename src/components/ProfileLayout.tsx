"use client";

import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import ProfileSidebar from "@/components/ProfileSidebar";

export default function ProfileLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <NavBar />

      <main className="flex flex-col min-h-screen w-full items-center justify-between">
        <div className="flex flex-col w-full bg-gray-50 text-gray-900 mt-16 flex-grow">
          <section className="w-full text-center py-12 bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
            <h1 className="text-4xl font-bold tracking-tight">Your Profile</h1>
            <p className="mt-4 text-lg max-w-2xl mx-auto">
              Manage your profile, view your stories, and start new creative
              journeys.
            </p>
          </section>
          <div className="flex flex-col md:flex-row max-w-7xl mx-auto w-full px-4 py-8 gap-8">
            <ProfileSidebar />
            <div className="flex-grow">{children}</div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}
