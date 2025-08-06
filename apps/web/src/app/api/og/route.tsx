/* eslint-disable @next/next/no-img-element */
import { APP_URL } from "@/lib/metadata";
import { ImageResponse } from "next/og";
import { SIZE, loadGoogleFont } from "./_utils";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const title =
      (searchParams.has("title") && searchParams.get("title")) ||
      "Tech Companies in Portugal";

    const description =
      (searchParams.has("description") && searchParams.get("description")) ||
      "Discover tech companies in Portugal - from innovative startups to industry leaders. Browse companies, and connect with the tech ecosystem.";
    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          fontFamily: "Geist Mono",
          backgroundColor: "white",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)",
          backgroundSize: "100px 100px",
        }}
      >
        <div
          style={{
            left: 20,
            top: 25,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <img
            height="65"
            width="65"
            src={`${APP_URL}/assets/images/logo.png`}
            alt="Tech companies in Portugal Logo"
          />
          <div
            style={{
              display: "flex",
              fontSize: 25,
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Geist Mono SemiBold",
            }}
          >
            <span
              style={{
                color: "rgb(21 128 61)",
              }}
            >
              {"<"}
            </span>
            <span className="font-bold">TechCompaniesPortugal</span>
            <span
              style={{
                color: "rgb(250 204 21)",
              }}
            >
              {"/"}
            </span>
            <span
              style={{
                color: "rgb(239 68 68)",
              }}
            >
              {">"}
            </span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 50,
          }}
        >
          {title}
        </div>
        <p
          style={{
            marginTop: 20,
            display: "flex",
            fontSize: 25,
            maxWidth: 1100,
          }}
        >
          {description}
        </p>
      </div>,
      {
        ...SIZE,
        fonts: [
          {
            name: "Geist Mono",
            data: await loadGoogleFont("Geist Mono", "TechCompaniesPortugal"),
          },
          {
            name: "Geist Mono SemiBold",
            data: await loadGoogleFont(
              "Geist Mono:wght@600",
              "TechCompaniesPortugal",
            ),
          },
        ],
      },
    );
  } catch (e) {
    return new Response("Failed to generate the og image", {
      status: 500,
    });
  }
}
