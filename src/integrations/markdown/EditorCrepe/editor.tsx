"use client";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/nord.css";
import "./styles.css";
import useTheme from "@/hooks/use-theme";
import { uploadFile } from "@/lib/file.client";
import { cn } from "@/lib/utils";
import { Crepe } from "@milkdown/crepe";
import { editorViewCtx, parserCtx } from "@milkdown/kit/core";
import { listener, listenerCtx } from "@milkdown/kit/plugin/listener";
import { upload, uploadConfig } from "@milkdown/kit/plugin/upload";
import { Slice } from "@milkdown/kit/prose/model";
import { Selection } from "@milkdown/kit/prose/state";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import { throttle } from "radashi";
import {
  type FC,
  type RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { toast } from "sonner";
import { callUploadFiles } from "./upload/callUploadFiles";
import { filesUploader } from "./upload/filesUploader";
import { iconUpload } from "./upload/icon";
import { uploadWidgetFactory } from "./uploadWidgetFactory";

interface MilkdownProps {
  defaultValue?: string;
  onChange?: (markdown: string) => void;
  className?: string;
  refCtrl?: RefObject<{
    getCrepe: () => Crepe;
    setMarkdown: (markdown: string) => void;
  }>;
}

const EditorCrepe: FC<MilkdownProps> = ({
  onChange = () => {},
  refCtrl,
  defaultValue = "",
  className,
}) => {
  const crepeRef = useRef<Crepe>(null);
  const { resolvedTheme } = useTheme();
  const darkMode = resolvedTheme === "dark";
  const divRef = useRef<HTMLDivElement>(null);
  const loading = useRef(false);
  const refDefaultContent = useRef<string>(defaultValue);
  const setMarkdown = useCallback((markdown: string) => {
    const crepe = crepeRef.current;
    if (!crepe) return;
    crepe.editor.action((ctx) => {
      const view = ctx.get(editorViewCtx);
      const parser = ctx.get(parserCtx);
      const doc = parser(markdown);
      if (!doc) return;
      const state = view.state;
      const selection = state.selection;
      const { from } = selection;
      let tr = state.tr;
      tr = tr.replace(0, state.doc.content.size, new Slice(doc.content, 0, 0));
      tr = tr.setSelection(Selection.near(tr.doc.resolve(from)));
      view.dispatch(tr);
    });
  }, []);
  const getCrepe = useCallback(() => {
    return crepeRef.current!;
  }, []);
  useEffect(() => {
    if (!refCtrl) return;
    refCtrl.current = {
      getCrepe,
      setMarkdown,
    };
  }, [getCrepe, setMarkdown, refCtrl]);
  useLayoutEffect(() => {
    if (!divRef.current || loading.current) return;

    loading.current = true;
    const crepe = new Crepe({
      root: divRef.current,
      defaultValue: refDefaultContent.current,
      featureConfigs: {
        [Crepe.Feature.CodeMirror]: {
          theme: darkMode ? vscodeDark : vscodeLight,
        },
        [Crepe.Feature.LinkTooltip]: {
          onCopyLink: () => {
            toast.success("Link copied");
          },
        },
        [Crepe.Feature.ImageBlock]: {
          async onUpload(file) {
            const res = await uploadFile(file);
            return res.url;
          },
        },
        [Crepe.Feature.BlockEdit]: {
          callUploadFiles,
          slashMenuUploadFilesIcon: iconUpload,
          slashMenuUploadFilesLabel: "Upload Files",
          // biome-ignore lint/suspicious/noExplicitAny: Hack to implement the upload files feature
        } as any,
      },
    });

    crepe.editor
      .config((ctx) => {
        ctx.get(listenerCtx).markdownUpdated(
          throttle({ interval: 200, trailing: true }, (_, markdown) => {
            onChange(markdown);
          }),
        );
        ctx.update(uploadConfig.key, (prev) => ({
          ...prev,
          uploader: filesUploader,
          enableHtmlFileUploader: true,
          uploadWidgetFactory,
        }));
      })
      .use(upload)
      .use(listener);

    crepe.create().then(() => {
      (crepeRef as RefObject<Crepe>).current = crepe;
      loading.current = false;
    });
    return () => {
      if (loading.current) return;
      crepe.destroy();
    };
  }, [darkMode, onChange]);

  return (
    <div
      className={cn(
        "crepe flex h-full flex-1 flex-col",
        "custom-crepe-editor",
        className,
      )}
      ref={divRef}
    />
  );
};

export default EditorCrepe;
