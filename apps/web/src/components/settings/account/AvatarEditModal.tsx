"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Slider } from "@/components/ui/slider";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Loader2 } from "lucide-react";
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useState,
} from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";

interface AvatarEditModalProps {
  open: boolean;
  imageUrl: string;
  onClose: () => void;
  onSave: (croppedImage: Blob) => void;
  isSaving?: boolean;
}

export function AvatarEditModal({
  open,
  imageUrl,
  onClose,
  onSave,
  isSaving = false,
}: AvatarEditModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const handleSave = async () => {
    if (!croppedAreaPixels) return;

    try {
      const croppedImage = await getCroppedImg(imageUrl, croppedAreaPixels);
      if (croppedImage) {
        onSave(croppedImage);
      }
    } catch (e) {
      console.error("Error cropping image:", e);
    }
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Avatar</DialogTitle>
            <DialogDescription>
              Adjust the crop and zoom to get the perfect avatar
            </DialogDescription>
          </DialogHeader>

          <EditAvatarForm
            imageUrl={imageUrl}
            crop={crop}
            zoom={zoom}
            setCrop={setCrop}
            setZoom={setZoom}
            onCropComplete={onCropComplete}
            isSaving={isSaving}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="gap-4 p-6">
        <DrawerHeader className="p-0">
          <DrawerTitle>Edit Avatar</DrawerTitle>
          <DrawerDescription>
            Adjust the crop and zoom to get the perfect avatar
          </DrawerDescription>
        </DrawerHeader>
        <EditAvatarForm
          imageUrl={imageUrl}
          crop={crop}
          zoom={zoom}
          setCrop={setCrop}
          setZoom={setZoom}
          onCropComplete={onCropComplete}
          isSaving={isSaving}
        />
        <DrawerFooter className="p-0">
          <Button type="button" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
          <DrawerClose asChild>
            <Button type="button" variant="outline" disabled={isSaving}>
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, "image/jpeg");
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}

interface EditAvatarFormProps {
  imageUrl: string;
  crop: {
    x: number;
    y: number;
  };
  zoom: number;
  setCrop: Dispatch<
    SetStateAction<{
      x: number;
      y: number;
    }>
  >;
  setZoom: Dispatch<SetStateAction<number>>;
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
  isSaving: boolean;
}

const EditAvatarForm = ({
  imageUrl,
  crop,
  zoom,
  setCrop,
  setZoom,
  onCropComplete,
  isSaving,
}: EditAvatarFormProps) => {
  return (
    <>
      <div className="relative h-80 w-full bg-muted rounded-md overflow-hidden">
        <Cropper
          image={imageUrl}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="zoom-slider" className="text-sm font-medium">
          Zoom
        </label>
        <Slider
          id="zoom-slider"
          min={1}
          max={3}
          step={0.1}
          value={[zoom]}
          onValueChange={(value) => setZoom(value[0] ?? 1)}
          className="w-full cursor-grab active:cursor-grabbing"
          disabled={isSaving}
        />
      </div>
    </>
  );
};
