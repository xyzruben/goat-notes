"use client";

import React from "react";
import { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Fragment, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "./textarea";
import { ArrowUpIcon } from "lucide-react";
import { askAIAboutNotesAction } from "@/actions/notes";
import '@/app/styles/ai-response.css';
import DOMPurify from 'isomorphic-dompurify';


type Props = {
    user: User | null; 
};

function AskAIButton({user}: Props) {
    const router = useRouter();

    const [isPending] = useTransition();


    const [open, setOpen] = useState(false);
    const [questionText, setQuestionText] = useState("");
    const [questions, setQuestions] = useState<string[]>([]);
    const [responses, setResponses] = useState<string[]>([]);

    const handleOnOpenChange = (isOpen: boolean) => {
      if (!user) {
        router.push("/login")
      } else {
        if (isOpen) {
          setQuestionText("");
          setQuestions([]);
          setResponses([]);

        }
        setOpen(isOpen)
      }
    };

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleInput = () => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }

    const handleClickInput = () => {
      textareaRef.current?.focus();
    }

    const handleSubmit = () => {
      if (!questionText.trim()) return;

      const newQuestions = [...questions, questionText];
      setQuestions(newQuestions);
      setQuestionText("");
      setTimeout(scrollToBottom, 100);

      (async () => {
        const response = await askAIAboutNotesAction(newQuestions, responses);
        setResponses(prev => [...prev, response]);
        setTimeout(scrollToBottom, 100);
      })();
    };

    const scrollToBottom = () => {
      contentRef.current?.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: "smooth",
      })
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key==="Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }

    }

  return <Dialog open={open} onOpenChange={handleOnOpenChange}>
  <DialogTrigger asChild>
    <Button variant="secondary">Ask AI</Button>
  </DialogTrigger>
  <DialogContent 
     className="custom-scrollbar flex h-[85vh] max-w-4xl flex-col overflow-y-auto" 
     ref={contentRef}
     >
    <DialogHeader>
      <DialogTitle>Ask AI About Your Notes</DialogTitle>
      <DialogDescription>
        Our AI can answer questions about all of your notes
      </DialogDescription>
    </DialogHeader>
    <div className="mt-4 flex flex-col gap-8">
      {questions.map((question, index) => (
        <Fragment key={index}>
          <p className="bg-muted text-muted-foreground ml-auto max-w-[60%] rounded-md px-2 py-1 text-sm">
            {question}
          </p>
          {
            responses[index] && (
              <p
              className="bot-response text-muted-foreground text-sm"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(responses[index], {
                  ALLOWED_TAGS: ['p', 'strong', 'em', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'br'],
                  ALLOWED_ATTR: []
                })
              }}

               />
            )
          }
        </Fragment>
      ))}
      {isPending && <p className="animate-pulse text-sm">Thinking....</p>}
    </div>
    <div 
    className="mt-auto flex cursor-text flex-col rounded-lg border p-4" 
    onClick={handleClickInput}
    >
      <Textarea 
      ref={textareaRef} 
      placeholder="Ask me anything about your notes..." 
      className="resize-none rounded-none border-none bg-transparent p-0 shadow-none 
      placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0" 
      style={{
        minHeight: "0",
        lineHeight: "normal",
      }}
      rows={1}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      value={questionText}
      onChange={(e) => setQuestionText(e.target.value)}
       />

    </div>
    <Button className="ml-auto size-8 rounded-full" onClick={handleSubmit}>
      <ArrowUpIcon className="text-background" />
    </Button>
    

  </DialogContent>
</Dialog>
}

export default AskAIButton;