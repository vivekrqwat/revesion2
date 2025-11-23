import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Plus, LogIn } from "lucide-react";
import { toast } from "react-toastify";

export default function Collaborative() {
  const [createRoomData, setCreateRoomData] = useState({
    directoryName: "",
    description: "",
  });

  const [joinRoomId, setJoinRoomId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateRoomData((prev) => ({ ...prev, [name]: value }));
  };

  const handleJoinChange = (e) => {
    setJoinRoomId(e.target.value);
  };

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
      
      // TODO: Replace with actual API call
      // const res = await axios.post(`${API}/apii/collab/create`, createRoomData);
      // toast.success("Room created successfully!");
      // Handle room creation response
      
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
      
      // TODO: Replace with actual API call
      // const res = await axios.post(`${API}/apii/collab/join`, { roomId: joinRoomId });
      // toast.success("Joined room successfully!");
      // Handle join response
      
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Collaborate with <span className="text-primary">Friends</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Create a new collaboration room or join an existing one to work together
          </p>
        </div>

        {/* Tabs Container */}
        <Card className="bg-card border-border shadow-lg">
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted rounded-none">
              <TabsTrigger 
                value="create"
                className="gap-2 data-[state=active]:bg-card data-[state=active]:text-primary rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Create Room</span>
                <span className="sm:hidden">Create</span>
              </TabsTrigger>
              <TabsTrigger 
                value="join"
                className="gap-2 data-[state=active]:bg-card data-[state=active]:text-primary rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
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
                    className="text-sm font-semibold text-foreground"
                  >
                    Directory Name
                  </label>
                  <Input
                    id="directoryName"
                    type="text"
                    name="directoryName"
                    placeholder="Enter directory name"
                    value={createRoomData.directoryName}
                    onChange={handleCreateChange}
                    className="bg-muted border-border text-foreground"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label 
                    htmlFor="description"
                    className="text-sm font-semibold text-foreground"
                  >
                    Description
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter a brief description for the collaboration room"
                    value={createRoomData.description}
                    onChange={handleCreateChange}
                    rows={4}
                    className="bg-muted border-border text-foreground resize-none"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Info Message */}
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-xs sm:text-sm text-primary">
                    💡 Tip: You'll receive a unique room ID that you can share with others to join your collaboration.
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-10 gap-2"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
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
                    className="text-sm font-semibold text-foreground"
                  >
                    Room ID
                  </label>
                  <Input
                    id="roomId"
                    type="text"
                    placeholder="Paste the room ID here"
                    value={joinRoomId}
                    onChange={handleJoinChange}
                    className="bg-muted border-border text-foreground text-center font-mono text-lg tracking-wider"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Info Message */}
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <p className="text-xs sm:text-sm text-blue-500">
                    🔗 Ask the room creator to share the room ID with you to join the collaboration.
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-10 gap-2"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
              className="p-4 rounded-lg bg-card border border-border text-center space-y-2"
            >
              <p className="font-semibold text-foreground">{feature.title}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}