"use client";

import { SingleImageDropzone } from "@/app/common/components/SingleImageDropzone";
import { useEdgeStore } from "@/app/common/utils/edgestore";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAtom } from "jotai";
import { uploadingImageAtom } from "@/app/common/atoms/atoms";

type InputProps = {
  className?: string;
  index: number;
};
export function SingleImageDropzoneUsage(props: InputProps) {
  const [file, setFile] = useState<File>();
  const [imgArr, setImgArr] = useAtom(uploadingImageAtom);
  const { edgestore } = useEdgeStore();

  const uploadFile = async (file: File) => {
    if (file) {
      setImgArr((oldArr: string[]) => {
        oldArr[props.index] = "";
        return oldArr;
      });
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress: any) => {
          // you can use this to show a progress bar
          // console.log(progress);
        },
      });
      if (res?.url) {
        setImgArr((oldArr: string[]) => {
          oldArr[props.index] = res.url;
          return oldArr;
        });
      }

      // you can run some server action or api here
      // to add the necessary data to your database
    } else if (file === null || file === undefined) {
      setImgArr((oldArr: string[]) => {
        oldArr.splice(props.index, 1);
        return oldArr;
      });
    }
  };

  return (
    <section
      className={cn(
        "w-full flex items-center flex-col gap-2",
        props?.className
      )}>
      <SingleImageDropzone
        width={200}
        height={160}
        value={file}
        onChange={(file: any) => {
          setFile(file);
          uploadFile(file);
        }}
      />
      {/* <Button
        onClick={async () => {
          if (file) {
            const res = await edgestore.publicFiles.upload({
              file,
              onProgressChange: (progress: any) => {
                // you can use this to show a progress bar
                console.log(progress);
              },
            });
            // you can run some server action or api here
            // to add the necessary data to your database
            console.log(res);
          }
        }}>
        Upload
      </Button> */}
    </section>
  );
}
