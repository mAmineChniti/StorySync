export default function Footer() {
  return (
    <footer className="py-6 text-gray-500 text-center bg-gray-100 w-full fixed bottom-0 left-0">
      &copy; {new Date().getFullYear()} StorySync. All rights reserved.
    </footer>
  );
}
