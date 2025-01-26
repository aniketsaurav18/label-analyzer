import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import { codeLanguageSubset } from "../lib/constants";
import React from "react";

const MemoizedMarkdown = React.memo(({ content }: { content: string }) => (
  <Markdown
    remarkPlugins={[remarkGfm, [remarkMath]]}
    rehypePlugins={[
      rehypeKatex,
      [
        rehypeHighlight,
        {
          detect: true,
          ignoreMissing: true,
          subset: codeLanguageSubset,
        },
      ],
    ]}
    className="flex flex-col gap-2"
    components={{
      h1: ({ node, ...props }) => <h1 className="margin-y-2" {...props} />,
      h2: ({ node, ...props }) => <h2 className="margin-y-2" {...props} />,
      h3: ({ node, ...props }) => <h3 className="margin-y-2" {...props} />,
      h4: ({ node, ...props }) => <h4 className="margin-y-2" {...props} />,
      h5: ({ node, ...props }) => <h5 className="margin-y-2" {...props} />,
      h6: ({ node, ...props }) => <h6 className="margin-y-2" {...props} />,
      p: ({ node, ...props }) => <p className="margin-y-2" {...props} />,
      ul: ({ node, ...props }) => <ul className="margin-y-2" {...props} />,
      ol: ({ node, ...props }) => <ol className="margin-y-2" {...props} />,
      li: ({ node, ...props }) => <li className="margin-y-2" {...props} />,
      blockquote: ({ node, ...props }) => (
        <blockquote className="margin-y-2" {...props} />
      ),
      pre: ({ node, ...props }) => <pre className="margin-y-2" {...props} />,
      code: ({ node, ...props }) => <code className="margin-y-2" {...props} />,
    }}
  >
    {content}
  </Markdown>
));

// Set display name for better debugging
MemoizedMarkdown.displayName = "MemoizedMarkdown";

export { MemoizedMarkdown };
