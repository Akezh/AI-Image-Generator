"use client";

import { Grid } from "@mui/material";
import Image from "next/image";
import { themes } from "../constants";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center my-10">Painting themes</h1>
      <Grid container spacing={4}>
        {themes.map((theme) => (
          <Grid key={theme.title} item xl={3} lg={3} md={3} sm={4} xs={6}>
            <div
              className="flex flex-col gap-[8px] items-center cursor-pointer"
              onClick={() => router.push(`/theme/${theme.id}`)}
            >
              <Image
                style={{ width: 275, height: 175, objectFit: "cover" }}
                className="rounded-lg"
                width={275}
                height={175}
                src={theme.src}
                alt="winter"
              />
              <p>{theme.title}</p>
            </div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
