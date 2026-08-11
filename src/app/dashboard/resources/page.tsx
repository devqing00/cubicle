"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import HugeIcon from "@/components/ui/HugeIcon";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { toast } from "sonner";

interface LearningResource {
  id: string;
  title: string;
  description: string;
  language: string;
  level: string;
  type: "pdf" | "guide" | "vocab" | "drive" | "video";
  url: string;
  createdAt: string;
  uploadedBy?: string;
}

export default function ResourcesPage() {
  const { user, userData, loading: authLoading } = useAuth();

  const [resources, setResources] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  // Add Resource Modal (Tutors)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newLanguage, setNewLanguage] = useState("Spanish");
  const [newLevel, setNewLevel] = useState("Beginner");
  const [newType, setNewType] = useState<"pdf" | "guide" | "vocab" | "drive" | "video">("pdf");
  const [newUrl, setNewUrl] = useState("");
  const [addingResource, setAddingResource] = useState(false);

  // Delete Resource Modal
  const [resourceToDelete, setResourceToDelete] = useState<LearningResource | null>(null);
  const [deletingResource, setDeletingResource] = useState(false);

  const isTutor = userData?.role === "tutor";

  useEffect(() => {
    const q = query(collection(db, "resources"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as LearningResource[];

        // Sort descending by date
        fetched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setResources(fetched);
        setLoading(false);
      },
      (err) => {
        console.warn("Resources listener warning:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    setAddingResource(true);
    try {
      await addDoc(collection(db, "resources"), {
        title: newTitle.trim(),
        description: newDescription.trim(),
        language: newLanguage,
        level: newLevel,
        type: newType,
        url: newUrl.trim(),
        uploadedBy: userData?.displayName || "Instructor",
        createdAt: new Date().toISOString(),
      });

      toast.success("Learning resource added successfully!");
      setIsAddModalOpen(false);
      setNewTitle("");
      setNewDescription("");
      setNewUrl("");
    } catch (err) {
      console.error("Failed to add resource:", err);
      toast.error("Failed to add resource. Please try again.");
    } finally {
      setAddingResource(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!resourceToDelete) return;
    setDeletingResource(true);
    try {
      await deleteDoc(doc(db, "resources", resourceToDelete.id));
      toast.success("Resource removed from vault.");
      setResourceToDelete(null);
    } catch (err) {
      console.error("Failed to delete resource:", err);
      toast.error("Failed to delete resource.");
    } finally {
      setDeletingResource(false);
    }
  };

  // Filtered resources
  const filteredResources = resources.filter((r) => {
    const matchSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchLang = selectedLanguage === "all" || r.language.toLowerCase() === selectedLanguage.toLowerCase();
    const matchType = selectedType === "all" || r.type === selectedType;

    return matchSearch && matchLang && matchType;
  });

  const getTypeBadge = (type: LearningResource["type"]) => {
    switch (type) {
      case "pdf":
        return <span className="px-2.5 py-0.5 bg-red-50 text-red-600 border border-red-200 rounded-full text-[10px] font-bold uppercase">PDF Doc</span>;
      case "vocab":
        return <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full text-[10px] font-bold uppercase">Vocab Deck</span>;
      case "drive":
        return <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-full text-[10px] font-bold uppercase">Google Drive</span>;
      case "guide":
        return <span className="px-2.5 py-0.5 bg-purple-50 text-purple-600 border border-purple-200 rounded-full text-[10px] font-bold uppercase">Grammar Guide</span>;
      default:
        return <span className="px-2.5 py-0.5 bg-surface-muted text-text-secondary rounded-full text-[10px] font-bold uppercase">Material</span>;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-body text-text-secondary">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
          <span>Opening Learning Vault...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-accent-blue/10 text-accent-blue rounded-full text-[10px] font-bold uppercase tracking-wider border border-accent-blue/20 mb-2 inline-block">
            Curriculum Library
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
            Learning Resources & Vault
          </h1>
          <p className="font-body text-xs sm:text-sm text-text-secondary mt-1">
            Download grammar guides, CEFR practice tests, vocabulary flashcards, and homework materials.
          </p>
        </div>

        {isTutor && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 bg-accent-blue text-white rounded-full font-body text-xs font-semibold hover:bg-accent-blue-hover transition-colors flex items-center gap-2 self-start sm:self-auto shadow-xs"
          >
            <HugeIcon name="sparkles" size={16} />
            <span>+ Add Resource</span>
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-5 rounded-[24px] border border-border-light shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides, worksheets..."
            className="w-full px-4 py-2.5 rounded-full border border-border-light bg-surface-near-white text-xs font-body text-text-primary placeholder:text-text-subtle focus:border-accent-blue transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-3.5 py-2 rounded-full border border-border-light bg-white text-xs font-semibold text-text-primary focus:border-accent-blue"
          >
            <option value="all">All Languages</option>
            <option value="spanish">Spanish</option>
            <option value="french">French</option>
            <option value="english">Business English</option>
            <option value="german">German</option>
            <option value="mandarin">Mandarin</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3.5 py-2 rounded-full border border-border-light bg-white text-xs font-semibold text-text-primary focus:border-accent-blue"
          >
            <option value="all">All Format Types</option>
            <option value="pdf">PDF Documents</option>
            <option value="guide">Grammar Guides</option>
            <option value="vocab">Vocabulary Decks</option>
            <option value="drive">Google Drive Links</option>
          </select>
        </div>
      </div>

      {/* Resource Cards Grid */}
      {filteredResources.length === 0 ? (
        <div className="bg-white rounded-[28px] p-12 text-center border border-border-light shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-surface-muted text-text-subtle flex items-center justify-center mx-auto mb-3">
            <HugeIcon name="book-open" size={24} />
          </div>
          <h3 className="font-heading text-lg font-bold text-text-primary mb-1">No resources found</h3>
          <p className="font-body text-xs text-text-secondary max-w-sm mx-auto">
            {isTutor
              ? "Click '+ Add Resource' to upload your first study worksheet or guide for your students."
              : "Your instructor hasn't uploaded study materials matching these filters yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="bg-white rounded-[28px] border border-border-light shadow-xs p-6 flex flex-col justify-between hover:border-accent-blue/40 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 bg-accent-blue/10 text-accent-blue border border-accent-blue/20 rounded-full text-[10px] font-bold uppercase">
                    {res.language} • {res.level}
                  </span>
                  {getTypeBadge(res.type)}
                </div>

                <h3 className="font-heading font-bold text-base text-text-primary group-hover:text-accent-blue transition-colors">
                  {res.title}
                </h3>

                <p className="font-body text-xs text-text-secondary leading-relaxed line-clamp-3">
                  {res.description || "Comprehensive learning exercise curated for Cubicle students."}
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-border-light flex items-center justify-between">
                <span className="text-[10px] text-text-subtle">
                  Added {new Date(res.createdAt).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-2">
                  {isTutor && (
                    <button
                      onClick={() => setResourceToDelete(res)}
                      className="p-2 rounded-full hover:bg-red-50 text-text-secondary hover:text-red-600 transition-colors"
                      title="Delete Resource"
                    >
                      <HugeIcon name="trash" size={14} />
                    </button>
                  )}

                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-text-primary group-hover:bg-accent-blue text-white rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Open Material</span>
                    <HugeIcon name="arrow-up-right" size={12} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Resource Modal (Tutor Only) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <form
            onSubmit={handleAddResource}
            className="bg-white rounded-[28px] max-w-lg w-full p-6 sm:p-8 border border-border-light shadow-2xl space-y-4 font-body"
          >
            <div className="flex items-center justify-between border-b border-border-light pb-4">
              <div>
                <h3 className="font-heading text-lg font-bold text-text-primary">Add Learning Material</h3>
                <p className="text-xs text-text-secondary">Publish guides and homework for students.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-full hover:bg-surface-muted text-text-subtle hover:text-text-primary"
              >
                <HugeIcon name="cancel" size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-text-primary mb-1">Resource Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Spanish Subjunctive Triggers Cheat Sheet"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border-light bg-surface-near-white text-xs text-text-primary focus:border-accent-blue"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-text-primary mb-1">Language</label>
                  <select
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    className="w-full px-2.5 py-2.5 rounded-xl border border-border-light bg-white text-xs font-semibold text-text-primary focus:border-accent-blue"
                  >
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="English">Business English</option>
                    <option value="German">German</option>
                    <option value="Mandarin">Mandarin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-text-primary mb-1">Level</label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value)}
                    className="w-full px-2.5 py-2.5 rounded-xl border border-border-light bg-white text-xs font-semibold text-text-primary focus:border-accent-blue"
                  >
                    <option value="All Levels">All Levels</option>
                    <option value="Beginner (A1)">Beginner (A1)</option>
                    <option value="Elementary (A2)">Elementary (A2)</option>
                    <option value="Intermediate (B1)">Intermediate (B1)</option>
                    <option value="Upper Intermediate (B2)">Upper Int (B2)</option>
                    <option value="Advanced (C1-C2)">Advanced (C1)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-text-primary mb-1">Format Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-2.5 py-2.5 rounded-xl border border-border-light bg-white text-xs font-semibold text-text-primary focus:border-accent-blue"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="guide">Grammar Guide</option>
                    <option value="vocab">Vocab Deck</option>
                    <option value="drive">Google Drive</option>
                    <option value="video">Video Lesson</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-text-primary mb-1">Resource Link / URL</label>
                <input
                  type="url"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://drive.google.com/... or https://dropbox.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border-light bg-surface-near-white text-xs text-text-primary focus:border-accent-blue"
                />
              </div>

              <div>
                <label className="block font-semibold text-text-primary mb-1">Short Description / Instructions</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="e.g. Complete exercises 1-10 before our Thursday conversation session."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border-light bg-surface-near-white text-xs text-text-primary focus:border-accent-blue resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border-light">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-full border border-border-light text-xs font-semibold text-text-secondary hover:bg-surface-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={addingResource}
                className="px-5 py-2 rounded-full bg-accent-blue text-white text-xs font-semibold hover:bg-accent-blue-hover transition-colors disabled:opacity-50"
              >
                {addingResource ? "Publishing..." : "Publish to Vault"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(resourceToDelete)}
        title={`Delete "${resourceToDelete?.title}"?`}
        description="This learning material will be permanently removed from the student resource vault."
        confirmText="Delete Material"
        cancelText="Keep Material"
        variant="danger"
        iconName="trash"
        loading={deletingResource}
        onConfirm={handleConfirmDelete}
        onCancel={() => setResourceToDelete(null)}
      />
    </div>
  );
}
