import axios from "axios";
import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { UserStore } from "../store/Userstroe";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;

export default function DirectoryForm({ handleClose }) {
  const initialData = {
    Dirname: "",
    desc: "",
    grade: "",
  };

  const { user } = UserStore();
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGradeSelect = (grade) => {
    setFormData((prev) => ({ ...prev, grade }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("form data", formData);

    if (!formData.grade) {
      toast.error("Please select a difficulty level");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${API}/apii/dir`,
        {
          uid: user._id,
          ...formData,
        },
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
      toast.success("Directory created successfully!");
      setFormData(initialData);
      handleClose();
      navigate("/dir");
    } catch (err) {
      console.log("dir ", err);
      toast.error(err.response?.data?.message || "Failed to create directory");
    } finally {
      setLoading(false);
    }
  };

  const handleFormClose = () => {
    setFormData(initialData);
    handleClose();
  };

  const getGradeColor = (grade) => {
    const colors = {
      red: "bg-red-500/20 text-red-700 border-red-500/30",
      yellow: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
      green: "bg-green-500/20 text-green-700 border-green-500/30",
    };
    return colors[grade] || "";
  };

  const getGradeLabel = (grade) => {
    const labels = {
      red: "Difficult",
      yellow: "Medium",
      green: "Easy",
    };
    return labels[grade] || grade;
  };

  const getGradeBgColor = (grade) => {
    const colors = {
      red: "bg-red-500",
      yellow: "bg-yellow-400",
      green: "bg-green-500",
    };
    return colors[grade] || "bg-gray-500";
  };

  return (
    <Card className="relative bg-card border-border max-w-md mx-auto mt-10 shadow-lg">
      <Button
        onClick={handleFormClose}
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <X size={22} />
      </Button>

      <CardHeader className="pr-10">
        <CardTitle className="text-2xl sm:text-3xl">
          Create New Directory
        </CardTitle>
        <p className="text-xs sm:text-sm text-muted-foreground italic mt-2">
          You don't have to see the whole staircase, just take the first step
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Directory Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Directory Name
            </label>
            <Input
              type="text"
              name="Dirname"
              value={formData.Dirname}
              onChange={handleChange}
              placeholder="Enter directory name"
              className="bg-muted border-border"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Description
            </label>
            <Textarea
              name="desc"
              value={formData.desc}
              onChange={handleChange}
              rows={4}
              placeholder="Enter description..."
              className="bg-muted border-border resize-none"
              required
            />
          </div>

          {/* Difficulty Level */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">
              Difficulty Level
            </label>
            <div className="flex gap-3 flex-wrap">
              {["red", "yellow", "green"].map((grade) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => handleGradeSelect(grade)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    formData.grade === grade
                      ? `${getGradeBgColor(grade)} text-white ring-2 ring-offset-2 ring-offset-background`
                      : `${getGradeColor(grade)} border cursor-pointer hover:opacity-80`
                  }`}
                >
                  {getGradeLabel(grade)}
                </button>
              ))}
            </div>
            {!formData.grade && (
              <p className="text-xs text-destructive">
                Please select a difficulty level
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 h-10 mt-6"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Directory"
            )}
          </Button>

          {/* Cancel Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleFormClose}
            className="w-full border-border"
          >
            Cancel
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}