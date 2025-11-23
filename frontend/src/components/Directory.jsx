import { useState, useEffect } from "react";
import { ChevronDown, Trash2, Plus, ArrowRight, Lock, Unlock } from "lucide-react";
import axios from "axios";
import { UserStore } from "../store/Userstroe";
import { useNavigate } from 'react-router-dom';
import Delete from "../utils/Delete";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const API = import.meta.env.VITE_API_URL;

export default function Directory() {
  const [openDir, setOpenDir] = useState(null);
  const [showFormIndex, setShowFormIndex] = useState(null);
  const [dirdata, setdirdata] = useState([]);
  const [notesMap, setNotesMap] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [updatingDirId, setUpdatingDirId] = useState(null);
  const { user } = UserStore();
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();

  const fetchDirData = async () => {
    try {
      const resdata = await axios.get(`${API}/apii/dir/${user._id}`, {
        withCredentials: true,
      });
      setdirdata(resdata.data);
    } catch (e) {
      console.log(e);
    }
  };

  const togglePublicPrivate = async (dirId, currentStatus) => {
    try {
      setUpdatingDirId(dirId);
      const newStatus = !currentStatus;
      console.log(newStatus,"nest status");
      const response = await axios.put(
        `${API}/apii/dir/${dirId}`,
        { isPublic: newStatus },
        { withCredentials: true }
      );
      console.log("Directory privacy updated:", response.data);

      setdirdata((prev) =>
        prev.map((dir) =>
          dir._id === dirId ? { ...dir, isPublic: newStatus } : dir
        )
      );
    } catch (e) {
      console.error("Error updating directory privacy:", e);
    } finally {
      setUpdatingDirId(null);
    }
  };

  const Delnotes = async (noteId, dirId) => {
    try {
      await Delete("noteid", noteId);
      setNotesMap((prev) => ({
        ...prev,
        [dirId]: prev[dirId].filter((note) => note._id !== noteId),
      }));
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeleteNoteConfirm = (noteId, dirId, noteName) => {
    setDeleteConfirm({ type: "note", id: noteId, dirId, itemName: noteName });
  };

  const handleDeleteDirConfirm = (dirId, dirName) => {
    setDeleteConfirm({ type: "directory", id: dirId, itemName: dirName });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      if (deleteConfirm.type === "note") {
        await Delnotes(deleteConfirm.id, deleteConfirm.dirId);
      } else if (deleteConfirm.type === "directory") {
        await Deldir(deleteConfirm.id);
      }
    } catch (e) {
      console.error("Error during deletion:", e);
    } finally {
      setDeleteConfirm(null);
    }
  };

  useEffect(() => {
    fetchDirData();
    localStorage.removeItem("noteid");
  }, []);

  const getnotes = async (id) => {
    setOpenDir(openDir === id ? null : id);
    try {
      const notesdata = await axios.get(`${API}/apii/notes/${id}`, {
        withCredentials: true,
      });
      setNotesMap((prev) => ({
        ...prev,
        [id]: notesdata.data,
      }));
    } catch (e) {
      console.log(e);
    }
  };

  const Deldir = async (id) => {
    try {
      console.log("Starting directory deletion for:", id);

      console.log("Deleting notes for directory:", id);
      await Delete("notes", id);
      console.log("Notes deleted successfully");

      console.log("Deleting directory:", id);
      const dirResponse = await Delete("dir", id);
      console.log("Directory deleted response:", dirResponse);

      setdirdata((prev) => {
        const updated = prev.filter((dir) => dir._id !== id);
        console.log("Updated dirdata after delete, remaining items:", updated.length);
        return updated;
      });

      setNotesMap((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });

      console.log("UI state updated after deletion");
    } catch (e) {
      console.error("Error deleting directory:", e.message);
      console.error("Full error:", e);
      fetchDirData();
    }
  };

  const setNotes = async (id, e) => {
    e.preventDefault();
    const data = {
      dirid: id,
      desc: e.target.desc.value,
      heading: e.target.heading.value,
      grade: e.target.grade.value,
    };
    try {
      setloading(true);
      await axios.post(`${API}/apii/notes/`, data, {
        withCredentials: true,
      });
      await axios.post(
        `${API}/apii/user/submission/${user._id}`,
        {},
        {
          withCredentials: true,
        }
      );
      getnotes(id);
      e.target.reset();
    } catch (e) {
      console.log(e);
    } finally {
      setloading(false);
    }
  };

  const getGradeColorClass = (grade) => {
    const colors = {
      green: "bg-green-500",
      red: "bg-red-500",
      yellow: "bg-yellow-400",
    };
    return colors[grade] || "bg-gray-500";
  };

  const getGradeBadgeClass = (grade) => {
    const colors = {
      green: "bg-green-500/20 text-green-700 border-green-500/30",
      red: "bg-red-500/20 text-red-700 border-red-500/30",
      yellow: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
    };
    return colors[grade] || "bg-gray-500/20 text-gray-700 border-gray-500/30";
  };

  const getGrade = (grade) => {
    const grades = {
      green: "Easy",
      red: "Hard",
      yellow: "Medium",
    };
    return grades[grade] || "Unknown";
  };

  const gotoNotes = (id, e) => {
    e.preventDefault();
    localStorage.setItem("noteid", id);
    navigate(`/notes/${user._id}`);
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-foreground font-semibold">Creating your note...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full px-3 sm:px-6 py-4 bg-background text-foreground overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <span className="text-2xl">📁</span>
          Your Directories
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          {dirdata?.length} {dirdata?.length === 1 ? "directory" : "directories"}
        </p>
      </div>

      {/* Directories List */}
      <div className="space-y-3 min-w-[240px]">
        {dirdata?.map((dir, index) => (
          <Card
            key={dir._id}
            className="bg-card border-border hover:border-primary/50 transition-colors shadow-sm"
          >
            <CardContent className="p-4 sm:p-5 space-y-4">
              {/* Directory Header */}
              <div className="flex justify-between items-start gap-3">
                <div className="flex gap-3 items-start flex-1 min-w-0">
                  <div
                    className={`h-4 w-4 rounded flex-shrink-0 mt-0.5 ${getGradeColorClass(dir.grade)}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-lg sm:text-xl font-semibold truncate">
                      {dir.Dirname}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 mt-0.5">
                      {dir.desc}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-1 sm:gap-2 items-center flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs sm:text-sm gap-1 border-border"
                    onClick={() =>
                      setShowFormIndex(showFormIndex === index ? null : index)
                    }
                  >
                    <Plus size={14} />
                    <span className="hidden sm:inline">Add</span>
                  </Button>

                  <Button
                    size="icon"
                    variant={dir.isPublic ? "default" : "outline"}
                    onClick={() => togglePublicPrivate(dir._id, dir.isPublic)}
                    disabled={updatingDirId === dir._id}
                    className="h-8 w-8 sm:h-9 sm:w-9"
                    title={dir.isPublic ? "Public" : "Private"}
                  >
                    {!dir.isPublic ? (
                      <Lock size={16}  />
                    ) : (
                      <Unlock size={16} />
                    )}
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => getnotes(dir._id)}
                    className="h-8 w-8 sm:h-9 sm:w-9"
                  >
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-300 ${
                        openDir === dir._id ? "rotate-180" : ""
                      }`}
                    />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDeleteDirConfirm(dir._id, dir.Dirname)}
                    className="h-8 w-8 sm:h-9 sm:w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>

              {/* Add Note Form */}
              {showFormIndex === index && (
                <form
                  onSubmit={(e) => setNotes(dir._id, e)}
                  className="pt-4 border-t border-border space-y-3"
                >
                  <Input
                    name="heading"
                    placeholder="Note Heading"
                    required
                    className="bg-muted border-border text-sm"
                  />

                  <Textarea
                    name="desc"
                    placeholder="Note Description"
                    rows={3}
                    required
                    className="bg-muted border-border text-sm resize-none"
                  />

                  {/* Grade Selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Difficulty
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["green", "red", "yellow"].map((color) => (
                        <label
                          key={color}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="grade"
                            value={color}
                            required
                            className="cursor-pointer"
                          />
                          <Badge
                            className={`${getGradeBadgeClass(color)} border cursor-pointer text-xs`}
                          >
                            {getGrade(color)}
                          </Badge>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-primary hover:bg-primary/90 text-sm"
                    >
                      {loading ? "Creating..." : "Add Note"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 border-border text-sm"
                      onClick={() => setShowFormIndex(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}

              {/* Notes List */}
              {openDir === dir._id && notesMap[dir._id]?.length > 0 && (
                <div className="pt-4 border-t border-border space-y-2">
                  {notesMap[dir._id].map((note) => (
                    <div
                      key={note._id}
                      className="flex items-start gap-3 p-3 rounded-md bg-muted/50 hover:bg-accent border border-border hover:border-primary/50 transition-all cursor-pointer group"
                      onClick={(e) => gotoNotes(note._id, e)}
                    >
                      <div
                        className={`h-3 w-3 rounded flex-shrink-0 mt-0.5 ${getGradeColorClass(note.grade)}`}
                      />

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {note.heading}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {note.desc}
                        </p>
                      </div>

                      <div className="flex gap-2 items-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNoteConfirm(note._id, dir._id, note.heading);
                          }}
                          className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 size={14} />
                        </Button>
                        <ArrowRight
                          size={16}
                          className="text-muted-foreground group-hover:text-primary transition-colors"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty Notes State */}
              {openDir === dir._id && notesMap[dir._id]?.length === 0 && (
                <div className="text-center py-6 text-muted-foreground text-sm border-t border-border">
                  No notes yet in this directory
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {dirdata?.length === 0 && (
        <Card className="bg-muted/30 border-dashed border-2 border-border">
          <CardContent className="p-8 sm:p-12 text-center space-y-3">
            <p className="text-3xl">📂</p>
            <p className="text-foreground font-semibold">No directories yet</p>
            <p className="text-sm text-muted-foreground">
              Create your first directory to organize your learning materials.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteConfirm?.type === "directory" ? "Delete Directory" : "Delete Note"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteConfirm?.type === "directory"
                ? `Are you sure you want to delete the directory "${deleteConfirm?.itemName}"? This action cannot be undone. All notes in this directory will also be deleted.`
                : `Are you sure you want to delete the note "${deleteConfirm?.itemName}"? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}