"use client"

import { useEffect, useState } from "react"
// import ProfileSidebar from "./ProfileSidebar"
// import ProfileInfo from "./ProfileInfo"
// import UserStories from "./UserStories"
// import CollaboratedStories from "./CollaboratedStories"
// import CreateStory from "./CreateStory"
import NavBar from "@/components/NavBar"
import Footer from "@/components/Footer"
import ProfileSidebar from "@/components/ProfileSidebar"
import ProfileInfo from "@/components/ProfileInfo"
import UserStories from "@/components/UserStories"
import { useRouter } from "next/navigation"
import { hasCookie } from "cookies-next/client"

type ProfileView = "profile" | "my-stories" | "collaborations" | "create-story"

export default function ProfileLayout() {
  const router = useRouter();
  useEffect(() => {
    if (!hasCookie('user')) {
      router.push('/login');
    }
  }, [router]);

  const [currentView, setCurrentView] = useState<ProfileView>("profile")

  const renderContent = () => {
    switch (currentView) {
      case "profile":
        return <ProfileInfo />
      case "my-stories":
        return <UserStories />
      case "collaborations":
        return <CollaboratedStories />
      case "create-story":
        return <CreateStory />
      default:
        return <ProfileInfo />
    }
  }

  return (
    <>
      <NavBar />

      <main className="flex flex-col min-h-screen w-full items-center justify-between">
        <div className="flex flex-col w-full bg-gray-50 text-gray-900 mt-16 flex-grow">
          <section className="w-full text-center py-12 bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
            <h1 className="text-4xl font-bold tracking-tight">Your Profile</h1>
            <p className="mt-4 text-lg max-w-2xl mx-auto">
              Manage your profile, view your stories, and start new creative journeys.
            </p>
          </section>
          <div className="flex flex-col md:flex-row max-w-7xl mx-auto w-full px-4 py-8 gap-8">
            <ProfileSidebar currentView={currentView} setCurrentView={setCurrentView} />
            <div className="flex-grow">{renderContent()}</div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  )
}
