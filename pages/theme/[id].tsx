"use client";

import { themes } from "../../constants";
import { Button, Grid, TextField } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Theme() {
  const router = useRouter();
  const { id } = router.query;

  const [shortPrompt, setShortPrompt] = useState("");
  const [fullPrompt, setFullPrompt] = useState("");
  const [isFullPromptLoaded, setIsFullPromptLoaded] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(false);

  const selectedImage = themes.find(
    (theme) => theme.id === parseInt(id as string)
  );

  const handleGenerateFullDescription = async () => {
    setFullPrompt("Generating...");

    const paintingTheme = themes.find(
      (theme) => theme.id === parseInt(id as string)
    )?.title;

    const response = await fetch(`/api/full-prompt-message`, {
      method: "POST",
      body: JSON.stringify({
        shortPrompt: `The painting theme/genre is ${paintingTheme}. Create the description considering the mentioned genre. ${shortPrompt}`,
      }),
    });

    const data = await response.json();

    if (data?.result) {
      setFullPrompt(data.result);
      setIsFullPromptLoaded(true);
    } else {
      setFullPrompt("Failed to generate prompt");
      setIsFullPromptLoaded(false);
    }
  };

  const handleGenerateImage = async () => {
    setImageUrl("");
    setIsImageLoading(true);
    const response = await fetch(`/api/generate-image`, {
      method: "POST",
      body: JSON.stringify({ fullPrompt }),
    });

    const data = await response.json();

    if (data?.imageUrl) {
      setImageUrl(data.imageUrl);
    } else {
      setImageUrl("");
    }
    setIsImageLoading(false);
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center my-10">
        Generate an image
      </h1>
      <Grid container spacing={12}>
        <Grid item xl={3} lg={3} md={3} sm={4} xs={4}>
          <div className="flex flex-col gap-[8px] items-center">
            <Image
              style={{ width: 300, objectFit: "cover" }}
              className="rounded-lg"
              width={300}
              height={150}
              src={selectedImage?.src ?? "/type1.webp"}
              alt="winter"
            />
            <p>{selectedImage?.title ?? "Landscape"}</p>
          </div>
        </Grid>
        <Grid item xl={9} lg={9} md={9} sm={8} xs={8}>
          <div className="flex flex-col gap-[24px] items-center padding-24">
            <p className="text-2xl font-bold">
              What kind of image you wanna generate?
            </p>

            <TextField
              sx={{ width: "500px" }}
              id="outlined-multiline-static"
              label="Short prompt"
              multiline
              rows={4}
              placeholder="Type here..."
              value={shortPrompt}
              onChange={(e) => setShortPrompt(e.target.value)}
            />

            <Button
              style={{ textTransform: "capitalize" }}
              variant="contained"
              color="primary"
              onClick={handleGenerateFullDescription}
            >
              Generate detailed prompt
            </Button>

            {fullPrompt && (
              <div
                style={{
                  width: 500,
                  backgroundColor: "#cccccc",
                  padding: 16,
                }}
              >
                {fullPrompt}
              </div>
            )}

            {isFullPromptLoaded && (
              <Button
                style={{ textTransform: "capitalize" }}
                variant="contained"
                color="primary"
                onClick={handleGenerateImage}
              >
                Generate image
              </Button>
            )}

            <div className="mb-24">
              {imageUrl && (
                <div className="flex items-center justify-center">
                  <img
                    style={{ width: 256, height: 256, objectFit: "cover" }}
                    className="rounded-lg"
                    src={imageUrl}
                    alt="generated"
                  />
                </div>
              )}

              {isImageLoading && <p>Loading...</p>}
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
