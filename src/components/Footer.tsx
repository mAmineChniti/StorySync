export default function Footer() {
  return (
    <footer className="text-gray-500 bg-gray-100 w-full h-10 fixed bottom-0 left-0 flex items-center justify-center">
      &copy; {new Date().getFullYear()} StorySync. All rights reserved.
    </footer>
  );
}
