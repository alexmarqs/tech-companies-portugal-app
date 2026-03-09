/* eslint-disable @next/next/no-img-element */
import { APP_URL } from "@/lib/metadata";
import { ImageResponse } from "next/og";
import { SIZE, loadGoogleFont } from "./_utils";

export const runtime = "edge";

const SITE_LOGO = `${APP_URL}/assets/images/logo.png`;
const DEFAULT_TITLE = "Tech Companies in Portugal";
const DEFAULT_DESCRIPTION =
  "Discover tech companies in Portugal - from innovative startups to industry leaders. Browse companies, and connect with the tech ecosystem.";

function AuroraOrbs() {
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "-120px",
          left: "-80px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, rgba(5, 150, 105, 0.06) 40%, transparent 65%)",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-140px",
          right: "-100px",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(20, 184, 166, 0.14) 0%, rgba(20, 184, 166, 0.04) 40%, transparent 65%)",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "100px",
          right: "150px",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(244, 63, 94, 0.08) 0%, transparent 55%)",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "250px",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(245, 158, 11, 0.06) 0%, transparent 55%)",
          display: "flex",
        }}
      />
    </>
  );
}

function AccentBar() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "4px",
        background:
          "linear-gradient(to right, #10b981 0%, #14b8a6 40%, #f43f5e 70%, #f59e0b 100%)",
        display: "flex",
      }}
    />
  );
}

function TopBar({ label }: { label?: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <img height="44" width="44" src={SITE_LOGO} alt="Logo" />
        <div
          style={{
            display: "flex",
            fontSize: 20,
            fontFamily: "Inter Bold",
            color: "#171717",
            letterSpacing: "-0.025em",
          }}
        >
          TechCompaniesPortugal
        </div>
      </div>
      {label && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "6px 18px",
            borderRadius: "999px",
            backgroundColor: "rgba(16, 185, 129, 0.08)",
            border: "1px solid rgba(16, 185, 129, 0.18)",
            fontSize: 15,
            color: "#059669",
            fontFamily: "Inter Medium",
            letterSpacing: "-0.01em",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}

function HomepageContent({ description }: { description: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        flexGrow: 1,
        paddingTop: 24,
      }}
    >
      {/* Hero text */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          justifyContent: "center",
          maxWidth: 860,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 62,
              fontFamily: "Inter Bold",
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              color: "#171717",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            Find your next{" "}
            <span style={{ color: "#059669", marginLeft: 18 }}>
              tech company
            </span>
          </div>
          <div
            style={{
              fontSize: 62,
              fontFamily: "Inter Bold",
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              color: "#171717",
              display: "flex",
              alignItems: "center",
            }}
          >
            in{" "}
            <span
              style={{ position: "relative", display: "flex", marginLeft: 16 }}
            >
              <span style={{ position: "relative", zIndex: 1 }}>Portugal</span>
              <div
                style={{
                  position: "absolute",
                  bottom: 4,
                  left: -4,
                  right: -4,
                  height: 16,
                  background:
                    "linear-gradient(to right, rgba(110, 231, 183, 0.4), rgba(252, 165, 165, 0.3))",
                  borderRadius: 3,
                  transform: "rotate(-0.5deg)",
                  display: "flex",
                }}
              />
            </span>
          </div>
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 24,
            color: "#737373",
            lineHeight: 1.6,
            fontFamily: "Inter",
            letterSpacing: "-0.01em",
            maxWidth: 680,
            display: "flex",
          }}
        >
          {description}
        </div>
      </div>
    </div>
  );
}

function CompanyContent({
  title,
  description,
  companyLogo,
}: { title: string; description: string; companyLogo: string }) {
  const truncated =
    description.length > 180
      ? `${description.slice(0, 180)}...`
      : description;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        flexGrow: 1,
        paddingTop: 32,
      }}
    >
      {/* Center block */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1,
          gap: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 110,
            height: 110,
            borderRadius: 28,
            backgroundColor: "white",
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow:
              "0 8px 24px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04)",
          }}
        >
          <img
            height="80"
            width="80"
            src={companyLogo}
            alt=""
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div
            style={{
              fontSize: 54,
              fontFamily: "Inter Bold",
              letterSpacing: "-0.035em",
              lineHeight: 1.1,
              color: "#171717",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 18,
              fontFamily: "Inter Medium",
              color: "#059669",
              letterSpacing: "-0.01em",
            }}
          >
            Tech Company in Portugal
          </div>
        </div>
        <div
          style={{
            fontSize: 21,
            color: "#737373",
            lineHeight: 1.6,
            fontFamily: "Inter",
            letterSpacing: "-0.01em",
            maxWidth: 750,
            textAlign: "center",
            display: "flex",
          }}
        >
          {truncated}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 16,
            fontFamily: "Inter Medium",
            color: "#a3a3a3",
          }}
        >
          <span style={{ color: "#059669" }}>techcompaniesportugal.fyi</span>
          <span style={{ color: "#a3a3a3" }}>/</span>
          <span style={{ color: "#525252" }}>{title}</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 18px",
            borderRadius: 12,
            backgroundColor: "white",
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            fontSize: 15,
            color: "#059669",
            fontFamily: "Inter Medium",
          }}
        >
          {"View Profile & Careers"}
        </div>
      </div>
    </div>
  );
}

function PageContent({
  title,
  description,
}: { title: string; description: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        flex: 1,
        gap: 24,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div
          style={{
            fontSize: 56,
            fontFamily: "Inter Bold",
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            color: "#171717",
            display: "flex",
            flexWrap: "wrap",
            maxWidth: 900,
          }}
        >
          {title}
        </div>
        <p
          style={{
            fontSize: 24,
            color: "#737373",
            lineHeight: 1.6,
            fontFamily: "Inter",
            letterSpacing: "-0.01em",
            maxWidth: 780,
          }}
        >
          {description}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 16,
          fontFamily: "Inter Medium",
          color: "#a3a3a3",
        }}
      >
        <span style={{ color: "#059669" }}>techcompaniesportugal.fyi</span>
        <span>/</span>
        <span style={{ color: "#525252" }}>{title}</span>
      </div>
    </div>
  );
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const title = searchParams.get("title") || "";
    const description = searchParams.get("description") || "";
    const companyLogo = searchParams.get("logo") || "";

    const isHomepage = !title && !description;
    const isCompany = !!companyLogo;

    const topLabel = isHomepage
      ? "techcompaniesportugal.fyi"
      : isCompany
        ? "Company Profile"
        : undefined;

    const allText = [
      title || DEFAULT_TITLE,
      description || DEFAULT_DESCRIPTION,
      "TechCompaniesPortugal",
      "techcompaniesportugal.fyi",
      "Find your next tech company in Portugal",
      "Tech Company in Portugal",
      "Company Profile",
      "View Profile & Careers",
    ].join("");

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Inter",
          backgroundColor: "#fafafa",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <AuroraOrbs />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            padding: "40px 56px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <TopBar label={topLabel} />

          {isHomepage ? (
            <HomepageContent description={DEFAULT_DESCRIPTION} />
          ) : isCompany ? (
            <CompanyContent
              title={title}
              description={description || DEFAULT_DESCRIPTION}
              companyLogo={companyLogo}
            />
          ) : (
            <PageContent
              title={title}
              description={description || DEFAULT_DESCRIPTION}
            />
          )}
        </div>

        <AccentBar />
      </div>,
      {
        ...SIZE,
        fonts: [
          {
            name: "Inter",
            data: await loadGoogleFont("Inter", allText),
          },
          {
            name: "Inter Medium",
            data: await loadGoogleFont("Inter:wght@500", allText),
          },
          {
            name: "Inter Bold",
            data: await loadGoogleFont("Inter:wght@700", allText),
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
