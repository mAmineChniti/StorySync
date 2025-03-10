'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, Calendar, Tag, User } from 'lucide-react';
import { useEffect, useState } from 'react';

const sampleBooks = [
  {
    id: 1,
    title: 'The Lost Chronicles',
    author: 'Emily Johnson',
    description: 'A tale of adventure and mystery in a forgotten world.',
    genre: 'Fantasy',
    startDate: '2023-01-15',
    coverImage: '/placeholder.svg?height=200&width=150',
  },
  {
    id: 2,
    title: 'Echoes of Tomorrow',
    author: 'Michael Chen',
    description: 'A science fiction epic about time travel and human destiny.',
    genre: 'Science Fiction',
    startDate: '2023-02-22',
    coverImage: '/placeholder.svg?height=200&width=150',
  },
  {
    id: 3,
    title: 'Whispers in the Dark',
    author: 'Sarah Williams',
    description: 'A chilling horror story set in an abandoned mansion.',
    genre: 'Horror',
    startDate: '2023-03-10',
    coverImage: '/placeholder.svg?height=200&width=150',
  },
  {
    id: 4,
    title: 'City of Secrets',
    author: 'James Rodriguez',
    description:
      'A detective navigates a city filled with corruption and intrigue.',
    genre: 'Mystery',
    startDate: '2023-04-05',
    coverImage: '/placeholder.svg?height=200&width=150',
  },
  {
    id: 5,
    title: 'Love Beyond Time',
    author: 'Emily Johnson',
    description: 'A romance that spans centuries and defies the laws of time.',
    genre: 'Romance',
    startDate: '2023-05-18',
    coverImage: '/placeholder.svg?height=200&width=150',
  },
  {
    id: 6,
    title: 'The Final Frontier',
    author: 'Michael Chen',
    description: 'Explorers venture into the unknown reaches of space.',
    genre: 'Science Fiction',
    startDate: '2023-06-30',
    coverImage: '/placeholder.svg?height=200&width=150',
  },
];

const allGenres = [...new Set(sampleBooks.map((book) => book.genre))];
const allAuthors = [...new Set(sampleBooks.map((book) => book.author))];

export default function HomeContent() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState(sampleBooks);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    let result = sampleBooks;

    if (selectedGenres.length > 0) {
      result = result.filter((book) => selectedGenres.includes(book.genre));
    }

    if (selectedAuthors.length > 0) {
      result = result.filter((book) => selectedAuthors.includes(book.author));
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.description.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query),
      );
    }

    setFilteredBooks(result);
  }, [selectedGenres, selectedAuthors, searchQuery]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
    );
  };

  const toggleAuthor = (author: string) => {
    setSelectedAuthors((prev) =>
      prev.includes(author)
        ? prev.filter((a) => a !== author)
        : [...prev, author],
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="flex flex-col w-full bg-gray-50 text-gray-900 mt-16">
      <section className="w-full text-center py-12 bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
        <h1 className="text-4xl font-bold tracking-tight">Discover Stories</h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto">
          Browse through our collection of stories and find your next favorite
          read.
        </p>
      </section>

      <div className="flex flex-col md:flex-row max-w-7xl mx-auto w-full px-4 py-8">
        <Button
          variant="outline"
          className="md:hidden mb-4"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? 'Hide Filters' : 'Show Filters'}
        </Button>

        <aside
          className={`${isSidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-64 shrink-0 mb-6 md:mb-0 md:mr-8`}
        >
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <div className="mt-4">
                <Input
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Genre filters */}
              <div>
                <h3 className="font-semibold mb-2">Genres</h3>
                <div className="space-y-2">
                  {allGenres.map((genre) => (
                    <div key={genre} className="flex items-center space-x-2">
                      <Checkbox
                        id={`genre-${genre}`}
                        checked={selectedGenres.includes(genre)}
                        onCheckedChange={() => toggleGenre(genre)}
                      />
                      <Label htmlFor={`genre-${genre}`}>{genre}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Authors</h3>
                <div className="space-y-2">
                  {allAuthors.map((author) => (
                    <div key={author} className="flex items-center space-x-2">
                      <Checkbox
                        id={`author-${author}`}
                        checked={selectedAuthors.includes(author)}
                        onCheckedChange={() => toggleAuthor(author)}
                      />
                      <Label htmlFor={`author-${author}`}>{author}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSelectedGenres([]);
                  setSelectedAuthors([]);
                  setSearchQuery('');
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        </aside>

        <div className="flex-grow">
          <h2 className="text-2xl font-bold mb-6">
            {filteredBooks.length}{' '}
            {filteredBooks.length === 1 ? 'Book' : 'Books'} Found
          </h2>

          {filteredBooks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">
                No books match your filters. Try adjusting your criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <Card
                  key={book.id}
                  className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-center mb-4">
                      {/** <img
                        src={book.coverImage || "/placeholder.svg"}
                        alt={`Cover of ${book.title}`}
                        className="h-48 object-cover rounded-md"
                      />**/}
                    </div>{' '}
                    <CardTitle className="line-clamp-2">{book.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <User className="h-4 w-4 mr-1" />
                      <span>{book.author}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Tag className="h-4 w-4 mr-1" />
                      <span>{book.genre}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Started: {formatDate(book.startDate)}</span>
                    </div>
                    <p className="text-gray-700 line-clamp-3">
                      {book.description}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Read Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
