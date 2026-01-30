import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function UploadImage() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full py-12">
      <Card>
        <CardHeader>
          <CardTitle>Upload Images</CardTitle>
          <CardDescription>
            Drag and drop your images here or browse from your device.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg shadow-md">
          <IconUpload className="h-16 w-16 text-gray-500 dark:text-gray-400" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            Drag and drop your images here
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline">
            <Input
              accept="image/*"
              className="sr-only"
              id="image-upload"
              multiple
              type="file"
            />
            <label htmlFor="image-upload">Or Browse</label>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function IconUpload(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}
