"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserId } from "@/lib";
import { StoryService } from "@/lib/requests";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Highlight from "@tiptap/extension-highlight";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { Placeholder } from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { createLowlight } from "lowlight";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Edit,
  GitBranch,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  SeparatorHorizontal,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function StoryEditor() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [userId, setUserId] = useState<string | null>("");
  useEffect(() => {
    setUserId(getUserId());
  }, []);
  const story_id = params?.story_id as string;
  const lowlight = createLowlight();
  const {
    data: story,
    isLoading: loadingStory,
    error: storyError,
  } = useQuery({
    queryKey: ["story", story_id],
    queryFn: () => StoryService.getDetails(story_id),
    staleTime: 30 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
    enabled: !!story_id,
  });

  const {
    data: content,
    isLoading: loadingContent,
    error: contentError,
  } = useQuery({
    queryKey: ["content", story_id],
    queryFn: () => StoryService.getContent(story_id),
    staleTime: 30 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !!story_id,
  });

  const { data: collaborators } = useQuery({
    queryKey: ["collaborators", story_id],
    queryFn: () => StoryService.getCollaborators(story_id),
    staleTime: 60 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !!story_id,
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        horizontalRule: false,
      }),
      Placeholder.configure({ placeholder: "Start writing your story..." }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: true }),
      CodeBlockLowlight.configure({ lowlight }),
      HorizontalRule,
    ],
    content: content?.content ?? "",
    onUpdate: ({ editor }) => setEditedContent(editor.getHTML()),
    editable: isEditing,
    editorProps: {
      attributes: { class: "focus:outline-none" },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    editor?.setEditable(isEditing);
  }, [isEditing, editor]);

  useEffect(() => {
    if (content?.content && editor) editor.commands.setContent(content.content);
  }, [content, editor]);

  const saveMutation = useMutation({
    mutationFn: () => StoryService.edit(story_id, editedContent),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["content", story_id] });
      setIsEditing(false);
    },
    onError: () => {
      editor?.commands.setContent(content?.content ?? "");
      setIsEditing(false);
    },
  });

  const canEdit = () =>
    story &&
    userId &&
    (story.owner_id === userId || collaborators?.includes(userId));

  if (!story_id)
    return (
      <div className="max-w-screen-md w-full mx-auto mt-16 p-4 min-h-[80vh] flex flex-col justify-center">
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

  if (!userId)
    return (
      <div className="max-w-screen-md w-full mx-auto mt-16 p-4 min-h-[80vh] flex flex-col justify-center">
        <Card className="text-center">
          <CardHeader>
            <CardTitle>Please Login to View</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              You need to be logged in to view this content.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/login")}>Login</Button>
          </CardFooter>
        </Card>
      </div>
    );

  return (
    <div className="max-w-screen-md w-full mx-auto mt-16 p-4 sm:p-8 min-h-[80vh] flex flex-col justify-center">
      <Card className="w-full shadow-lg dark:shadow-gray-800">
        <CardHeader className="flex justify-center text-center">
          <CardTitle className="text-4xl font-bold">
            {loadingStory ? (
              <div className="h-10 bg-gray-300 dark:bg-gray-700 w-1/2 animate-pulse" />
            ) : (
              (story?.title ?? "Error Loading Story")
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="relative min-h-[40vh]">
          {!loadingStory && storyError && (
            <p className="text-center text-red-500">
              Error loading story details.
            </p>
          )}
          {loadingContent ? (
            <div className="animate-pulse">
              <div className="h-80 bg-gray-300 dark:bg-gray-700 rounded" />
            </div>
          ) : contentError ? (
            <p className="text-center text-red-500">Error loading content.</p>
          ) : isEditing ? (
            <div className="prose max-w-none p-4 border rounded-lg relative bg-white dark:bg-gray-900">
              {editor && (
                <>
                  <div className="flex flex-wrap gap-2 mb-4 p-2 bg-gray-50 dark:bg-gray-800 rounded-t-lg border-b border-gray-200 dark:border-gray-700">
                    <Button
                      className="cursor-pointer"
                      variant="ghost"
                      size="sm"
                      onClick={() => editor.chain().focus().undo().run()}
                    >
                      <Undo2 className="h-4 w-4 text-gray-800 dark:text-gray-200" />
                    </Button>
                    <Button
                      className="cursor-pointer"
                      variant="ghost"
                      size="sm"
                      onClick={() => editor.chain().focus().redo().run()}
                    >
                      <Redo2 className="h-4 w-4 text-gray-800 dark:text-gray-200" />
                    </Button>
                    <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => editor.chain().focus().toggleBold().run()}
                      className={cn(
                        "cursor-pointer",
                        editor.isActive("bold")
                          ? "bg-blue-200 dark:bg-blue-700"
                          : "",
                      )}
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        editor.chain().focus().toggleItalic().run()
                      }
                      className={cn(
                        "cursor-pointer",
                        editor.isActive("italic")
                          ? "bg-blue-200 dark:bg-blue-700"
                          : "",
                      )}
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        editor.chain().focus().toggleUnderline().run()
                      }
                      className={cn(
                        "cursor-pointer",
                        editor.isActive("underline")
                          ? "bg-blue-200 dark:bg-blue-700"
                          : "",
                      )}
                    >
                      <UnderlineIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        editor.chain().focus().toggleHighlight().run()
                      }
                      className={cn(
                        "cursor-pointer",
                        editor.isActive("highlight")
                          ? "bg-blue-200 dark:bg-blue-700"
                          : "",
                      )}
                    >
                      <Highlighter className="h-4 w-4" />
                    </Button>
                    <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                      }
                      className={cn(
                        "cursor-pointer",
                        editor.isActive("heading", { level: 1 })
                          ? "bg-blue-200 dark:bg-blue-700"
                          : "",
                      )}
                    >
                      <Heading1 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                      }
                      className={cn(
                        "cursor-pointer",
                        editor.isActive("heading", { level: 2 })
                          ? "bg-blue-200 dark:bg-blue-700"
                          : "",
                      )}
                    >
                      <Heading2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                      }
                      className={cn(
                        "cursor-pointer",
                        editor.isActive("heading", { level: 3 })
                          ? "bg-blue-200 dark:bg-blue-700"
                          : "",
                      )}
                    >
                      <Heading3 className="h-4 w-4" />
                    </Button>
                    <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                      }
                      className={cn(
                        "cursor-pointer",
                        editor.isActive("bulletList")
                          ? "bg-blue-200 dark:bg-blue-700"
                          : "",
                      )}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                      }
                      className={cn(
                        "cursor-pointer",
                        editor.isActive("orderedList")
                          ? "bg-blue-200 dark:bg-blue-700"
                          : "",
                      )}
                    >
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                    <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        editor.chain().focus().toggleBlockquote().run()
                      }
                      className={cn(
                        "cursor-pointer",
                        editor.isActive("blockquote")
                          ? "bg-blue-200 dark:bg-blue-700"
                          : "",
                      )}
                    >
                      <Quote className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        editor.chain().focus().toggleCodeBlock().run()
                      }
                      className={cn(
                        "cursor-pointer",
                        editor.isActive("codeBlock")
                          ? "bg-blue-200 dark:bg-blue-700"
                          : "",
                      )}
                    >
                      <Code className="h-4 w-4" />
                    </Button>
                    <Button
                      className="cursor-pointer"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        editor.chain().focus().setHorizontalRule().run()
                      }
                    >
                      <SeparatorHorizontal className="h-4 w-4" />
                    </Button>
                    <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        editor.chain().focus().setTextAlign("left").run()
                      }
                      className={cn(
                        "cursor-pointer",
                        editor.isActive({ textAlign: "left" })
                          ? "bg-blue-200 dark:bg-blue-700"
                          : "",
                      )}
                    >
                      <AlignLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        editor.chain().focus().setTextAlign("center").run()
                      }
                      className={cn(
                        "cursor-pointer",
                        editor.isActive({ textAlign: "center" })
                          ? "bg-blue-200 dark:bg-blue-700"
                          : "",
                      )}
                    >
                      <AlignCenter className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        editor.chain().focus().setTextAlign("right").run()
                      }
                      className={cn(
                        "cursor-pointer",
                        editor.isActive({ textAlign: "right" })
                          ? "bg-blue-200 dark:bg-blue-700"
                          : "",
                      )}
                    >
                      <AlignRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        editor.chain().focus().setTextAlign("justify").run()
                      }
                      className={cn(
                        "cursor-pointer",
                        editor.isActive({ textAlign: "justify" })
                          ? "bg-blue-200 dark:bg-blue-700"
                          : "",
                      )}
                    >
                      <AlignJustify className="h-4 w-4" />
                    </Button>
                  </div>
                  <EditorContent
                    editor={editor}
                    className="p-4 min-h-[300px]"
                  />
                </>
              )}
            </div>
          ) : content?.content ? (
            <div
              className="prose max-w-none p-4 bg-white dark:bg-gray-900"
              dangerouslySetInnerHTML={{ __html: content.content }}
            />
          ) : (
            <div className="text-center flex flex-col justify-center items-center h-full">
              <p className="mb-4 text-gray-600 dark:text-gray-300 text-lg">
                No content yet. Start writing to get started!
              </p>
              {canEdit() && (
                <Button
                  className="cursor-pointer"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="mr-2 h-4 w-4" /> Start Writing
                </Button>
              )}
            </div>
          )}
        </CardContent>
        {canEdit() && (
          <CardFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-4">
            {isEditing ? (
              <>
                <Button
                  className="cursor-pointer"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    editor?.commands.setContent(content?.content ?? "");
                  }}
                  disabled={saveMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  className="cursor-pointer"
                  onClick={() => saveMutation.mutate()}
                  disabled={saveMutation.isPending}
                >
                  {saveMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              content?.content && (
                <Button
                  className="cursor-pointer"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit Story
                </Button>
              )
            )}
          </CardFooter>
        )}
      </Card>
      <div className="mt-8 flex justify-end">
        <Button
          className="cursor-pointer"
          onClick={() => router.push(`/fork/${story_id}`)}
        >
          <GitBranch className="mr-2 h-4 w-4" /> Fork Story
        </Button>
      </div>
    </div>
  );
}
