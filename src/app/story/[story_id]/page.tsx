import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import StoryEditor from "@/components/StoryEditor";

export default function Story() {
  return (
    <>
      <NavBar />
      <main className="flex flex-col min-h-screen w-full items-center justify-between">
        <StoryEditor />
        <Footer />
      </main>
    </>
  );
}
