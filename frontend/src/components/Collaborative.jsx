import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Separator is imported but not used, so it can be removed
import { Plus, LogIn } from "lucide-react";
import { toast } from "react-toastify";

export default function Collaborative() {
  const [createRoomData, setCreateRoomData] = useState({
    directoryName: "",
    description: "",
  });

  const [joinRoomId, setJoinRoomId] = useState("");
  const [loading, setLoading] = useState(false);

  // Simplified handler for all form fields
  const handleInputChange = (e, setData) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };
  
  // NOTE: API calls are currently simulated using toast.success

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    if (!createRoomData.directoryName.trim()) {
      toast.error("Please enter a directory name");
      return;
    }

    if (!createRoomData.description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    try {
      setLoading(true);
      console.log("Creating Room with:", createRoomData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Room created successfully!");
      setCreateRoomData({ directoryName: "", description: "" });
    } catch (error) {
      console.error("Create room error:", error);
      toast.error("Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSubmit = async (e) => {
    e.preventDefault();

    if (!joinRoomId.trim()) {
      toast.error("Please enter a room ID");
      return;
    }

    try {
      setLoading(true);
      console.log("Joining Room:", joinRoomId);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Joined room successfully!");
      setJoinRoomId("");
    } catch (error) {
      console.error("Join room error:", error);
      toast.error("Failed to join room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg)] text-[var(--fg)] px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-[var(--fg)]">
            Collaborate with <span className="text-[var(--primary)]">Friends</span>
          </h1>
          <p className="text-sm sm:text-base text-[var(--muted)]">
            Create a new collaboration room or join an existing one to work together
          </p>
        </div>

        {/* Tabs Container */}
        <Card className="bg-[var(--card)] border-[var(--border)] shadow-lg">
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[var(--border)] rounded-none">
              <TabsTrigger 
                value="create"
                // Use var(--card) for active background, var(--primary) for active text/border
                className="gap-2 data-[state=active]:bg-[var(--card)] data-[state=active]:text-[var(--primary)] rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--primary)]"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Create Room</span>
                <span className="sm:hidden">Create</span>
              </TabsTrigger>
              <TabsTrigger 
                value="join"
                // Use var(--card) for active background, var(--primary) for active text/border
                className="gap-2 data-[state=active]:bg-[var(--card)] data-[state=active]:text-[var(--primary)] rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--primary)]"
              >
                <LogIn size={18} />
                <span className="hidden sm:inline">Join Room</span>
                <span className="sm:hidden">Join</span>
              </TabsTrigger>
            </TabsList>

            {/* Create Room Tab */}
            <TabsContent value="create" className="p-6 sm:p-8 space-y-6">
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                {/* Directory Name */}
                <div className="space-y-2">
                  <label 
                    htmlFor="directoryName"
                    className="text-sm font-semibold text-[var(--fg)]"
                  >
                    Directory Name
                  </label>
                  <Input
                    id="directoryName"
                    type="text"
                    name="directoryName"
                    placeholder="Enter directory name"
                    value={createRoomData.directoryName}
                    onChange={(e) => handleInputChange(e, setCreateRoomData)}
                    className="bg-[var(--bg)] border-[var(--border)] text-[var(--fg)]"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label 
                    htmlFor="description"
                    className="text-sm font-semibold text-[var(--fg)]"
                  >
                    Description
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter a brief description for the collaboration room"
                    value={createRoomData.description}
                    onChange={(e) => handleInputChange(e, setCreateRoomData)}
                    rows={4}
                    className="bg-[var(--bg)] border-[var(--border)] text-[var(--fg)] resize-none"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Info Message - Uses Primary Accent */}
                <div className="p-3 rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/20">
                  <p className="text-xs sm:text-sm text-[var(--primary)]">
                    💡 Tip: You'll receive a unique room ID that you can share with others to join your collaboration.
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  // Uses Primary variable
                  className="w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] font-semibold h-10 gap-2"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-[var(--primary-foreground)] border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Create Room
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Join Room Tab */}
            <TabsContent value="join" className="p-6 sm:p-8 space-y-6">
              <form onSubmit={handleJoinSubmit} className="space-y-4">
                {/* Room ID */}
                <div className="space-y-2">
                  <label 
                    htmlFor="roomId"
                    className="text-sm font-semibold text-[var(--fg)]"
                  >
                    Room ID
                  </label>
                  <Input
                    id="roomId"
                    type="text"
                    placeholder="Paste the room ID here"
                    value={joinRoomId}
                    onChange={(e) => setJoinRoomId(e.target.value)}
                    className="bg-[var(--bg)] border-[var(--border)] text-[var(--fg)] text-center font-mono text-lg tracking-wider"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Info Message - INTEGRATED WITH PRIMARY THEME */}
                <div className="p-3 rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/20">
                  <p className="text-xs sm:text-sm text-[var(--primary)]">
                    🔗 Ask the room creator to share the room ID with you to join the collaboration.
                  </p>
                </div>

                {/* Submit Button - INTEGRATED WITH PRIMARY THEME */}
                <Button
                  type="submit"
                  disabled={loading}
                  // Uses Primary variable
                  className="w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] font-semibold h-10 gap-2"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-[var(--primary-foreground)] border-t-transparent rounded-full animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      <LogIn size={18} />
                      Join Room
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: "Real-time Sync", desc: "Changes sync instantly" },
            { title: "Easy Sharing", desc: "Share room ID with anyone" },
            { title: "Safe & Secure", desc: "End-to-end encrypted" },
          ].map((feature, idx) => (
            <div
              key={idx}
              // Use theme variables for features card
              className="p-4 rounded-lg bg-[var(--card)] border border-[var(--border)] text-center space-y-2"
            >
              <p className="font-semibold text-[var(--fg)]">{feature.title}</p>
              <p className="text-xs sm:text-sm text-[var(--muted)]">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}