"use client";

import { useCallback, useEffect, useState } from "react";
import { getContentRaw, getImagesRaw, getVideosRaw } from "@/lib/cms";
import SectionEditor from "@/components/admin/SectionEditor";

interface AdminSectionPageProps {
  section: string;
  sectionTitle: string;
  sectionIcon: string;
}

export type LocalisedContentMap = Record<
  string,
  { value: string; value_ar: string }
>;

export type LocalisedImageMap = Record<
  string,
  { url: string; alt: string; alt_ar: string }
>;

export type LocalisedVideoMap = Record<
  string,
  { url: string; alt: string; alt_ar: string }
>;

export default function AdminSectionPage({
  section,
  sectionTitle,
  sectionIcon,
}: AdminSectionPageProps) {
  const [content, setContent] = useState<LocalisedContentMap>({});
  const [images, setImages] = useState<LocalisedImageMap>({});
  const [videos, setVideos] = useState<LocalisedVideoMap>({});
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [c, i, v] = await Promise.all([
      getContentRaw(section),
      getImagesRaw(section),
      getVideosRaw(section),
    ]);
    setContent(c);
    setImages(i);
    setVideos(v);
    setLoading(false);
  }, [section]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function handleContentChange(
    key: string,
    patch: Partial<{ value: string; value_ar: string }>
  ) {
    setContent((prev) => ({
      ...prev,
      [key]: {
        value: prev[key]?.value ?? "",
        value_ar: prev[key]?.value_ar ?? "",
        ...patch,
      },
    }));
  }

  function handleImageChange(
    key: string,
    patch: Partial<{ url: string; alt: string; alt_ar: string }>
  ) {
    setImages((prev) => ({
      ...prev,
      [key]: {
        url: prev[key]?.url ?? "",
        alt: prev[key]?.alt ?? "",
        alt_ar: prev[key]?.alt_ar ?? "",
        ...patch,
      },
    }));
  }

  function handleVideoChange(
    key: string,
    patch: Partial<{ url: string; alt: string; alt_ar: string }>
  ) {
    setVideos((prev) => ({
      ...prev,
      [key]: {
        url: prev[key]?.url ?? "",
        alt: prev[key]?.alt ?? "",
        alt_ar: prev[key]?.alt_ar ?? "",
        ...patch,
      },
    }));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[var(--color-saffron)] border-t-transparent rounded-full animate-spin" />
          <span className="text-[oklch(0.72_0.010_75)] text-xs tracking-[0.3em] uppercase font-mono">
            Loading content
          </span>
        </div>
      </div>
    );
  }

  return (
    <SectionEditor
      section={section}
      sectionTitle={sectionTitle}
      sectionIcon={sectionIcon}
      content={content}
      images={images}
      videos={videos}
      onContentChange={handleContentChange}
      onImageChange={handleImageChange}
      onVideoChange={handleVideoChange}
    />
  );
}
