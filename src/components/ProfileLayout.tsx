"use client";

import ProfileSidebar from "@/components/ProfileSidebar";

export default function ProfileLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col flex-1 w-full bg-background text-foreground">
      <section className="w-full text-center py-8 sm:py-12 bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight px-2">
          Your Profile
        </h1>
        <p className="mt-2 sm:mt-4 text-sm sm:text-lg max-w-2xl mx-auto px-4">
          Manage your profile, view your stories, and start new creative journeys.
        </p>
      </section>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 sm:gap-8 py-4 sm:py-8">
          <ProfileSidebar />
          <div className="flex-grow min-w-0 overflow-x-hidden">{children}</div>
        </div>
      </div>
    </div>
  );
}
