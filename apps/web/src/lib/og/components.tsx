/* eslint-disable @next/next/no-img-element */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { HeadingParts } from "@/lib/types";

const ACCENT = "#df6f55";

export async function getLogoSrc() {
  try {
    const logoData = await readFile(
      join(process.cwd(), "public/assets/images/logo.svg"),
      "base64",
    );
    return `data:image/svg+xml;base64,${logoData}`;
  } catch {
    return undefined;
  }
}

export function OgLayout({
  children,
  logoSrc,
}: {
  children: React.ReactNode;
  logoSrc?: string;
}) {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Gabarito",
        backgroundColor: "#fcfaf6",
        position: "relative",
        overflow: "hidden",
      }}
    >
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
        <TopBar logoSrc={logoSrc} />
        {children}
      </div>

      <AccentBar />
    </div>
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
        background: "#ef795d",
        display: "flex",
      }}
    />
  );
}

function TopBar({ label, logoSrc }: { label?: string; logoSrc?: string }) {
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
        {logoSrc && <img height={44} width={44} src={logoSrc} alt="Logo" />}
        <div
          style={{
            display: "flex",
            fontSize: 20,
            fontFamily: "Gabarito Bold",
            color: "#171717",
            letterSpacing: "-0.025em",
          }}
        >
          Tech Companies&nbsp;
          <span style={{ color: "#df6f55" }}>Portugal</span>
        </div>
      </div>
      {label && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "6px 18px",
            borderRadius: "999px",
            backgroundColor: "#f9e8df",
            border: "1px solid #f1d1c2",
            fontSize: 15,
            color: "#c95f47",
            fontFamily: "Gabarito Medium",
            letterSpacing: "-0.01em",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}

export function HomepageContent({ description }: { description: string }) {
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
              fontFamily: "Gabarito Bold",
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              color: "#171717",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            Discover Tech Companies
          </div>
          <div
            style={{
              fontSize: 62,
              fontFamily: "Gabarito Bold",
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              color: "#171717",
              display: "flex",
              alignItems: "center",
            }}
          >
            in{" "}
            <span style={{ color: "#df6f55", marginLeft: 16 }}>Portugal</span>
          </div>
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 24,
            color: "#737373",
            lineHeight: 1.6,
            fontFamily: "Gabarito",
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

export function CompanyContent({
  title,
  description,
  companyLogo,
}: { title: string; description: string; companyLogo: string }) {
  const truncated =
    description.length > 180 ? `${description.slice(0, 180)}...` : description;

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
          <img height={80} width={80} src={companyLogo} alt="" />
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
              fontFamily: "Gabarito Bold",
              letterSpacing: "-0.035em",
              lineHeight: 1.1,
              color: "#171717",
            }}
          >
            {title}
          </div>
        </div>
        <div
          style={{
            fontSize: 21,
            color: "#737373",
            lineHeight: 1.6,
            fontFamily: "Gabarito",
            letterSpacing: "-0.01em",
            maxWidth: 750,
            textAlign: "center",
            display: "flex",
          }}
        >
          {truncated}
        </div>
      </div>
    </div>
  );
}

/**
 * Satori collapses the whitespace between flex items, so the words are joined
 * with non-breaking spaces to keep the font's own spacing.
 */
function AccentTitle({ lead, name, trail }: HeadingParts) {
  return (
    <>
      {lead && <span style={{ display: "flex" }}>{lead}&nbsp;</span>}
      <span style={{ display: "flex", color: ACCENT }}>{name}</span>
      {trail && <span style={{ display: "flex" }}>&nbsp;{trail}</span>}
    </>
  );
}

export function PageContent({
  title,
  description,
}: { title: string | HeadingParts; description: string }) {
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
            fontFamily: "Gabarito Bold",
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            color: "#171717",
            display: "flex",
            flexWrap: "wrap",
            maxWidth: 900,
          }}
        >
          {typeof title === "string" ? title : <AccentTitle {...title} />}
        </div>
        <p
          style={{
            fontSize: 24,
            color: "#737373",
            lineHeight: 1.6,
            fontFamily: "Gabarito",
            letterSpacing: "-0.01em",
            maxWidth: 780,
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
