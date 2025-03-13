'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { env } from '@/env';
import { getAccessToken, getUserId } from '@/lib';
import { type StoryContent, type StoryDetails } from '@/types/storyResponses';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Placeholder } from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { BookOpen, Edit, GitBranch } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const NEXT_PUBLIC_STORY_API_URL = env.NEXT_PUBLIC_STORY_API_URL;

const fetchStoryDetails = async (id: string): Promise<StoryDetails | null> => {
  const authToken = getAccessToken();
  if (!authToken) throw new Error('No authentication token found');
  const response = await fetch(
    `${NEXT_PUBLIC_STORY_API_URL}/get-story-details`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ id }),
    },
  );
  if (!response.ok) return null;
  const data = (await response.json()) as {
    message: string;
    story: StoryDetails;
  };
  return data.story;
};

const fetchStoryContent = async (id: string): Promise<StoryContent | null> => {
  const response = await fetch(
    `${NEXT_PUBLIC_STORY_API_URL}/get-story-content`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    },
  );
  if (!response.ok) return null;
  const data = (await response.json()) as {
    message: string;
    content: StoryContent;
  };
  return data.content;
};

const fetchStoryCollaborators = async (id: string): Promise<string[]> => {
  const response = await fetch(
    `${NEXT_PUBLIC_STORY_API_URL}/get-story-collaborators`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    },
  );
  if (!response.ok) throw new Error('Failed to fetch collaborators');
  const data = (await response.json()) as {
    message: string;
    collaborators: string[];
  };
  return data.collaborators;
};

export default function StoryEditor() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const user_id = getUserId();
  const id = params?.id as string;

  const {
    data: story,
    isLoading: loadingStory,
    error: storyError,
  } = useQuery({
    queryKey: ['story', id],
    queryFn: () => fetchStoryDetails(id),
    enabled: !!id,
  });

  const {
    data: content,
    isLoading: loadingContent,
    error: contentError,
  } = useQuery({
    queryKey: ['content', id],
    queryFn: () => fetchStoryContent(id),
    enabled: !!id,
  });

  const { data: collaborators } = useQuery({
    queryKey: ['collaborators', id],
    queryFn: () => fetchStoryCollaborators(id),
    enabled: !!id,
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Start writing your story...' }),
    ],
    content: content?.content ?? '',
    onUpdate: ({ editor }) => setEditedContent(editor.getHTML()),
    editable: isEditing,
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditing);
    }
  }, [isEditing, editor]);

  useEffect(() => {
    if (content?.content && editor) {
      const initialContent =
        typeof content.content === 'string'
          ? content.content
          : JSON.stringify(content.content);
      editor.commands.setContent(initialContent);
    }
  }, [content, editor]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const authToken = getAccessToken();
      if (!authToken) throw new Error('No authentication token found');
      await fetch(`${NEXT_PUBLIC_STORY_API_URL}/edit-story`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ story_id: id, content: editedContent }),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['content', id] });
      setIsEditing(false);
    },
  });

  const canEdit = () => {
    if (!story || !user_id) return false;
    return (
      story.owner_id.toString() === user_id || collaborators?.includes(user_id)
    );
  };

  if (!id)
    return (
      <div className="max-w-6xl mx-auto mt-16 p-10 min-h-[80vh] min-w-[80vh] flex flex-col justify-center">
        <Card className="text-center">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Invalid story ID.</p>
          </CardContent>
        </Card>
      </div>
    );

  if (!user_id)
    return (
      <div className="max-w-6xl mx-auto mt-16 p-10 min-h-[80vh] min-w-[80vh] flex flex-col justify-center">
        <Card className="text-center">
          <CardHeader>
            <CardTitle>Please Login to View</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              You need to be logged in to view this content.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push('/login')}>Login</Button>
          </CardFooter>
        </Card>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto mt-16 p-10 min-h-[80vh] min-w-[80vh] flex flex-col justify-center">
      <Card className="w-full min-h-[60vh]">
        <CardHeader className="flex justify-center text-center">
          <CardTitle className="text-4xl font-bold">
            {loadingStory ? (
              <div className="h-10 bg-gray-300 w-1/2 animate-pulse" />
            ) : (
              (story?.title ?? 'Error Loading Story')
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="min-h-[40vh] relative">
          {!loadingStory && storyError && (
            <p className="text-center text-red-500">
              Error loading story details.
            </p>
          )}
          {loadingContent ? (
            <div className="animate-pulse">
              <div className="h-80 bg-gray-300 rounded" />
            </div>
          ) : contentError ? (
            <p className="text-center text-red-500">Error loading content.</p>
          ) : isEditing ? (
            <div className="prose max-w-none p-4 border rounded-lg">
              {editor && <EditorContent editor={editor} />}
            </div>
          ) : content?.content ? (
            <div
              className="prose max-w-none p-4"
              dangerouslySetInnerHTML={{ __html: content.content }}
            />
          ) : (
            <div className="text-center absolute inset-0 flex flex-col justify-center items-center">
              <p className="mb-4 text-gray-600 text-lg">
                No content yet. Start writing to get started!
              </p>
              {canEdit() && (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" /> Start Writing
                </Button>
              )}
            </div>
          )}
        </CardContent>
        {canEdit() && (
          <CardFooter className="flex justify-end gap-2 mt-4">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    if (content?.content) {
                      const initialContent =
                        typeof content.content === 'string'
                          ? content.content
                          : JSON.stringify(content.content);
                      editor?.commands.setContent(initialContent);
                    } else {
                      editor?.commands.setContent('');
                    }
                  }}
                  disabled={saveMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => saveMutation.mutate()}
                  disabled={saveMutation.isPending}
                >
                  {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            ) : (
              content?.content && (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit Story
                </Button>
              )
            )}
          </CardFooter>
        )}
      </Card>
      <div className="mt-8 flex gap-4 justify-end">
        <Button onClick={() => router.push(`/fork/${id}`)}>
          <GitBranch className="mr-2 h-4 w-4" /> Fork Story
        </Button>
        <Button variant="outline">
          <BookOpen className="mr-2 h-4 w-4" /> Submit Fork for Review
        </Button>
      </div>
    </div>
  );
}
