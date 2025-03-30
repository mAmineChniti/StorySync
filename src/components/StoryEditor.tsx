"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type Extension } from "@tiptap/core";
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
  AlertCircle,
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
  Loader2,
  Quote,
  Redo2,
  SeparatorHorizontal,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";
import Head from "next/head";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthService, StoryService } from "@/lib/requests";
import { cn, formatDate, getUserId } from "@/lib/utils";
import { type ForkStoryResponse } from "@/types/storyInterfaces";
export default function StoryEditor({
  skeletonLoading,
}: {
  skeletonLoading?: React.ReactNode;
}) {
  const router = useRouter();
  const parameters = useParams<{ story_id: string }>();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [userId, setUserId] = useState<string | null>("");
  const [isForkLoading, setIsForkLoading] = useState(false);
  const [forkedStoryId, setForkedStoryId] = useState<string | null>(null);
  const [storyTitle, setStoryTitle] = useState<string>("Story Details");
  useEffect(() => {
    const fetchUserId = async () => {
      const user = await getUserId();
      setUserId(user);
    };
    void fetchUserId();
  }, []);

  const story_id = parameters?.story_id;
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
    retry: 1,
  });

  useEffect(() => {
    if (storyError) {
      toast.error("Failed to load story", {
        description:
          "Unable to retrieve story details. Please try again later.",
        duration: 5000,
      });
    }
  }, [storyError]);

  useEffect(() => {
    if (story?.title) {
      document.title = `StorySync | ${story.title}`;
      setStoryTitle(story.title);
    }
  }, [story]);

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
    retry: 1,
  });

  const { data: collaborators } = useQuery<string[]>({
    queryKey: ["collaborators", story_id],
    queryFn: () => StoryService.getCollaborators(story_id),
    staleTime: 60 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !!story_id,
    retry: 1,
  });

  const OwnerName = ({ ownerId }: { ownerId: string }) => {
    const { data, isPending, error } = useQuery({
      queryKey: ["ownerName", ownerId],
      queryFn: () => AuthService.getUserName(ownerId),
      staleTime: 60 * 60 * 1000,
      gcTime: 2 * 60 * 60 * 1000,
      retry: 1,
    });

    if (isPending)
      return <span className="line-clamp-1">Loading author...</span>;
    if (error)
      return (
        <span className="line-clamp-1 text-destructive/80 dark:text-destructive/70">
          Unknown Author
        </span>
      );
    return (
      <span className="line-clamp-1">
        {data?.first_name} {data?.last_name}
      </span>
    );
  };

  const forkQuery = useQuery<ForkStoryResponse, Error>({
    queryKey: ["fork", story_id],
    queryFn: async () => StoryService.forkStory(story_id),
    enabled: false,
    retry: false,
  });

  const handleForkStory = async () => {
    setIsForkLoading(true);
    await forkQuery
      .refetch()
      .then((result) => {
        if (result.data?.story_id) {
          setForkedStoryId(result.data.story_id);
          toast.success("Story forked successfully");
        }
      })
      .catch((error: Error) => {
        let errormsg = "";
        errormsg =
          typeof error.message === "string"
            ? error.message
            : (JSON.parse(error.message) as { message: string }).message;
        toast.error(errormsg);
      });
    setIsForkLoading(false);
  };

  const handleStartWriting = () => {
    if (forkedStoryId) {
      router.push(`/story/${forkedStoryId}`);
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        horizontalRule: false,
      }) as Extension,
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
    onError: (error: Error) => {
      editor?.commands.setContent(content?.content ?? "");
      let errormsg = "";
      errormsg =
        typeof error.message === "string"
          ? error.message
          : (JSON.parse(error.message) as { message: string }).message;
      toast.error(errormsg);
      setIsEditing(false);
    },
  });

  const canEdit = () =>
    story &&
    userId &&
    (story.owner_id === userId ||
      (Array.isArray(collaborators) && collaborators.includes(userId)));

  if (loadingStory) {
    return skeletonLoading;
  }

  if (storyError || !story) {
    return (
      <div className="flex flex-col justify-center items-center h-full min-h-[500px] p-6 text-center bg-background">
        <AlertCircle className="h-16 w-16 text-destructive dark:text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2 text-foreground dark:text-foreground">
          Story Not Found
        </h2>
        <p className="text-muted-foreground dark:text-muted-foreground mb-4">
          The story you are looking for may have been deleted, is no longer
          accessible, or the link is incorrect.
        </p>
        <Button
          variant="outline"
          onClick={() => router.push("/browse")}
          className="text-primary dark:text-white/90 hover:text-primary/80 dark:hover:text-white cursor-pointer"
        >
          Browse Other Stories
        </Button>
      </div>
    );
  }

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
            <Button
              variant="outline"
              onClick={() => router.push("/login")}
              className="text-primary dark:text-white/90 hover:text-primary/80 dark:hover:text-white cursor-pointer"
            >
              Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );

  return (
    <>
      <Head>
        <title>StorySync | {storyTitle}</title>
      </Head>
      <div className="max-w-screen-md w-full mx-auto mt-16 p-4 sm:p-8 min-h-[80vh] flex flex-col justify-center">
        <Card className="w-full shadow-lg dark:shadow-gray-800">
          {loadingStory && storyError && loadingContent && contentError && (
            <CardHeader className="flex justify-center text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
              <CardTitle className="text-2xl font-semibold text-destructive mb-2">
                {loadingStory
                  ? "Loading Story"
                  : storyError
                    ? "Story Unavailable"
                    : loadingContent
                      ? "Loading Content"
                      : "Content Unavailable"}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {loadingStory
                  ? "Retrieving story details..."
                  : storyError
                    ? "Unable to load story. Please check your connection."
                    : loadingContent
                      ? "Fetching story content..."
                      : "Failed to retrieve story content. Please try again later."}
              </CardDescription>
            </CardHeader>
          )}

          {!loadingStory && !storyError && (
            <CardHeader className="flex flex-col items-center text-center space-y-3 pb-2">
              <CardTitle className="text-2xl font-semibold mb-1">
                {story?.title ?? "Untitled Story"}
              </CardTitle>
              {story && (
                <CardDescription className="flex flex-col items-center space-y-1">
                  <div className="flex flex-col items-center text-center text-muted-foreground">
                    <OwnerName ownerId={story.owner_id} />
                    <time
                      dateTime={story.created_at}
                      className="text-[0.7rem] text-muted-foreground"
                    >
                      {formatDate(story.created_at)}
                    </time>
                  </div>
                  {story.genre && (
                    <div className="text-[0.6rem] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full mt-1">
                      {story.genre}
                    </div>
                  )}
                </CardDescription>
              )}
            </CardHeader>
          )}

          <CardContent className="relative min-h-[40vh]">
            {!loadingStory &&
              !storyError &&
              !loadingContent &&
              !contentError && (
                <>
                  {isEditing ? (
                    <div className="prose max-w-none p-4 border rounded-lg relative bg-white dark:bg-gray-900">
                      {editor && (
                        <>
                          <div className="flex flex-wrap gap-2 mb-4 p-2 bg-gray-50 dark:bg-gray-800 rounded-t-lg border-b border-gray-200 dark:border-gray-700">
                            <Button
                              className="cursor-pointer"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                editor.chain().focus().undo().run()
                              }
                            >
                              <Undo2 className="h-4 w-4 text-gray-800 dark:text-gray-200" />
                            </Button>
                            <Button
                              className="cursor-pointer"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                editor.chain().focus().redo().run()
                              }
                            >
                              <Redo2 className="h-4 w-4 text-gray-800 dark:text-gray-200" />
                            </Button>
                            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2" />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                editor.chain().focus().toggleBold().run()
                              }
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
                                editor
                                  .chain()
                                  .focus()
                                  .toggleHeading({ level: 1 })
                                  .run()
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
                                editor
                                  .chain()
                                  .focus()
                                  .toggleHeading({ level: 2 })
                                  .run()
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
                                editor
                                  .chain()
                                  .focus()
                                  .toggleHeading({ level: 3 })
                                  .run()
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
                                editor
                                  .chain()
                                  .focus()
                                  .setTextAlign("left")
                                  .run()
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
                                editor
                                  .chain()
                                  .focus()
                                  .setTextAlign("center")
                                  .run()
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
                                editor
                                  .chain()
                                  .focus()
                                  .setTextAlign("right")
                                  .run()
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
                                editor
                                  .chain()
                                  .focus()
                                  .setTextAlign("justify")
                                  .run()
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
                </>
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
            onClick={forkedStoryId ? handleStartWriting : handleForkStory}
            disabled={isForkLoading || forkQuery.isLoading}
            className="flex items-center gap-2 cursor-pointer"
          >
            {forkedStoryId ? (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Start Writing Now
              </>
            ) : (
              <>
                {isForkLoading || forkQuery.isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary dark:text-white/90" />
                    Forking Story...
                  </>
                ) : (
                  <>
                    <GitBranch className="mr-2 h-4 w-4" />
                    Fork Story
                  </>
                )}
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
