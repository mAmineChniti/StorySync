'use client';

import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function Landing() {
  return (
    <div className="flex flex-col flex-grow w-full bg-gray-50 text-gray-900 mt-16">
      <section className="w-full text-center py-20 bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
        <h1 className="text-5xl font-bold tracking-tight">
          Welcome to StorySync
        </h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto">
          Discover stories, collaborate with writers, and bring ideas to life.
          Join a thriving community of storytellers today!
        </p>
        <Button className="mt-6 px-6 py-3 text-lg">
          <Link href="/login">Get Started</Link>
        </Button>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 my-16 px-6 max-w-6xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>🔍 Discover Stories</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Browse stories by genre or writer. Find inspiration and new worlds
              waiting to be explored.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>✍️ Collaborate with Writers</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Join writers and contribute to evolving stories. Work together
              seamlessly.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>📖 Share & Publish</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Publish your work, get feedback, and grow your audience as a
              writer.
            </p>
          </CardContent>
        </Card>
      </section>

      <Footer />
    </div>
  );
}
