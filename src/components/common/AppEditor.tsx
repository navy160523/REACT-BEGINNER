import { useCreateBlockNote } from "@blocknote/react";
// Or, you can use ariakit, shadcn, etc.
import { BlockNoteView } from "@blocknote/mantine";
import { ko } from "@blocknote/core/locales";
// Default styles for the mantine editor
import "@blocknote/mantine/style.css";
// Include the included Inter font
import "@blocknote/core/fonts/inter.css";
import type { Block } from "@blocknote/core";
import { useEffect } from "react";

interface Props {
    initialBlocks?: Block[];
    setContent: (content: Block[]) => void;
}

export function AppEditor({ initialBlocks, setContent }: Props) {
    const locale = ko;
    const editor = useCreateBlockNote({
        dictionary: {
            ...locale,
            placeholders: {
                ...locale.placeholders,
                emptyDocument: "텍스트를 입력하거나 '/'를 눌러 명령어를 입력하세요.",
            }
        }
    });

    useEffect(() => {
        if (initialBlocks && initialBlocks.length > 0) {
            const currentContent = JSON.stringify(editor.document);
            const nextContent = JSON.stringify(initialBlocks);

            if (currentContent !== nextContent) {
                editor.replaceBlocks(editor.document, initialBlocks);
            }
        }
    }, [initialBlocks, editor]);

    return <BlockNoteView editor={editor} onChange={() => setContent(editor.document)} />;
}