import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Upload from '../utils/Upload';
import Delete from '../utils/Delete';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Speech from './Speech.jsx';
import { UserStore } from '../store/Userstroe.jsx';
import CodeEditor from './CodeEditor.jsx';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Copy, Maximize2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReadMore from './Readmore.jsx';

const API = import.meta.env.VITE_API_URL;

export default function Notes() {
  const [noteid, setNoteid] = useState(localStorage.getItem('noteid'));
  const { id: paramsUserId } = useParams(); // Get user ID from URL params
  const [notedata, setNotedata] = useState();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [contentdata, setcontentdata] = useState([]);
  const [show, setShow] = useState(false);
  const [descvalue, setdescvalue] = useState('');
  const [editid, seteditid] = useState(null);
  const [imgsrc, setimgsrc] = useState('');
  const { user } = UserStore();
  const [isOwner, setIsOwner] = useState(false);
  const [formData, setFormData] = useState({
    heading: '',
    desc: '',
    grade: '',
    image: null,
    code: '',
    Approach: '',
  });
  const [showcode, setshowcode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { id: [noteid, contentId], itemName }

  // Check if current user is the owner by comparing params user ID with logged-in user ID
  useEffect(() => {
    if (paramsUserId && user?._id) {
      setIsOwner(paramsUserId === user._id);
    } else {
      setIsOwner(false);
    }
  }, [paramsUserId, user?._id]);
  

  const edit = (idx) => {
    seteditid(idx);
    setdescvalue(contentdata[idx]?.desc || '');
  };

  const saveDesc = async (noteId) => {
    try {
      const updatedContent = contentdata.map((item) =>
        item._id === noteId ? { ...item, desc: descvalue } : item
      );

      await axios.put(
        `${API}/apii/notes/${noteid}`,
        { content: updatedContent },
        { withCredentials: true }
      );

      setcontentdata(updatedContent);
      seteditid(null);
    } catch (error) {
      console.error('Error saving description:', error);
      toast.error('Failed to save description');
    }
  };

  const fetchNote = async () => {
    if (!noteid) return;
    try {
      const res = await axios.get(`${API}/apii/notes/all/${noteid}`);
      setNotedata(res.data);
      setcontentdata(res.data.content);
    } catch (err) {
      console.log('Error fetching notes:', err);
      // toast.error('Failed to fetch notes');
    }
  };

  const delnotes = async (id) => {
    try {
      await Delete('content', id);
      fetchNote();
    } catch (e) {
      console.log(e);
      toast.error('Failed to delete note');
    }
  };

  const handleDeleteConfirm = (contentId, contentHeading) => {
    setDeleteConfirm({ id: [noteid, contentId], itemName: contentHeading });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await Delete('content', deleteConfirm.id);
      toast.success('Note deleted');
      fetchNote();
    } catch (e) {
      console.error('Delete failed', e);
      toast.error('Failed to delete note');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Validate required fields
      if (!formData.heading.trim()) {
        toast.error('Please enter a heading');
        setLoading(false);
        return;
      }
      if (!formData.desc.trim()) {
        toast.error('Please enter a description');
        setLoading(false);
        return;
      }
      if (!formData.grade) {
        toast.error('Please select a difficulty level');
        setLoading(false);
        return;
      }

      let Img = "";
      try {
        Img = await Upload(formData.image);
      } catch (uploadErr) {
        console.error('Upload failed:', uploadErr);
        toast.error('Failed to upload image. Continuing without image...');
        // Continue without image if upload fails
      }

      const noteToAdd = {
        heading: formData.heading,
        desc: formData.desc,
        grade: formData.grade,
        code: formData.code,
        Approach: formData.Approach,
        img: Img,
      };
      const data = {
        content: [...(notedata?.content || []), noteToAdd],
      };
      
      console.log('Submitting note data:', data);
      console.log('Note ID:', noteid);
      
      const response = await axios.put(`${API}/apii/notes/${noteid}`, data, {
        withCredentials: true,
      });
      
      console.log('Note saved response:', response.data);
      
      await axios.post(`${API}/apii/user/submission/${user._id}`, {}, {
        withCredentials: true,
      });
      
      setNotedata((prev) => ({ ...prev, content: data.content }));
      setFormData({
        heading: '',
        desc: '',
        grade: '',
        image: null,
        code: '',
        Approach: '',
      });
      setShowForm(false);
      fetchNote();
      toast.success('Note added successfully');
    } catch (err) {
      console.error('Error saving note:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error message:', err.message);
      toast.error(err.response?.data?.message || 'Failed to save note');
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    const colors = {
      green: 'bg-green-500',
      red: 'bg-red-500',
      yellow: 'bg-yellow-400',
    };
    return colors[grade] || 'bg-gray-500';
  };

  const handlecopy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success('Copied to clipboard');
    } catch {
      toast.error('Failed to copy');
    }
  };

  useEffect(() => {
    if (noteid) {
      localStorage.setItem('noteid', noteid);
      fetchNote();
    }
  }, [noteid]);

  if (!noteid) return <div className="text-center p-8">No note selected</div>;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6">
      {show && <Speech setshow={setShow} desc={setFormData} />}

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{notedata?.heading}</h1>
          {isOwner && (
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-primary hover:bg-primary/90"
            >
              {showForm ? 'Close' : 'Add Note'}
            </Button>
          )}
        </div>

        {showForm && isOwner && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Create New Note</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Write heading"
                  value={formData.heading}
                  onChange={(e) =>
                    setFormData({ ...formData, heading: e.target.value })
                  }
                  required
                  className="bg-input border-border"
                />

                <Textarea
                  placeholder={
                    showcode ? 'Write question' : 'Write description'
                  }
                  value={formData.desc}
                  onChange={(e) =>
                    setFormData({ ...formData, desc: e.target.value })
                  }
                  required
                  rows={8}
                  className="bg-input border-border"
                />

                <Button
                  type="button"
                  onClick={() => setshowcode((prev) => !prev)}
                  variant="outline"
                  className="w-full border-border"
                >
                  {showcode ? 'Hide Code' : 'Show Code'}
                </Button>

                {showcode && (
                  <>
                    <Textarea
                      placeholder="Write approach"
                      value={formData.Approach}
                      onChange={(e) =>
                        setFormData({ ...formData, Approach: e.target.value })
                      }
                      rows={5}
                      className="bg-input border-border"
                    />
                    <Textarea
                      placeholder="Write code"
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({ ...formData, code: e.target.value })
                      }
                      rows={7}
                      className="bg-input border-border font-mono"
                    />
                  </>
                )}

                <Input
                  type="file"
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.files[0] })
                  }
                  className="bg-input border-border"
                />

                <div className="flex gap-3">
                  {['yellow', 'green', 'red'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-md transition-transform hover:scale-110 ${getGradeColor(color)} ${
                        formData.grade === color ? 'ring-2 ring-ring' : ''
                      }`}
                      onClick={() => setFormData({ ...formData, grade: color })}
                    />
                  ))}
                </div>

                <div className="flex gap-3 flex-col sm:flex-row">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-primary hover:bg-primary/90 flex-1"
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShow(true)}
                    className="bg-secondary hover:bg-secondary/90 flex-1"
                  >
                    Audio to Text
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
          {contentdata.map((note, idx) => (
            <Card
              key={idx}
              className="bg-card border-border hover:border-primary/50 transition-colors"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-md ${getGradeColor(
                        note.grade
                      )}`}
                    />
                    <CardTitle className="text-2xl capitalize">
                      {note.heading}
                    </CardTitle>
                  </div>
                  {isOwner && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteConfirm(note._id, note.heading)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 size={18} />
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {editid === idx ? (
                  <div className="space-y-3">
                    <Textarea
                      value={descvalue}
                      onChange={(e) => setdescvalue(e.target.value)}
                      rows={18}
                      className="bg-input border-border font-mono"
                    />
                    <div className="flex gap-3 justify-end">
                      <Button
                        onClick={() => saveDesc(note._id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => seteditid(null)}
                        variant="outline"
                        className="border-border"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p
                    onClick={() => isOwner && edit(idx)}
                    className={`text-base text-muted-foreground whitespace-pre-wrap leading-relaxed ${
                      isOwner ? 'cursor-pointer hover:text-foreground transition-colors' : 'cursor-default'
                    }`}
                  >
                    {/* {note.desc} */}
                    <ReadMore text={note.desc} onEdit={isOwner ? () => edit(idx) : null} />
                  </p>
                )}

                {note.Approach && (
                  <>
                    <hr className="border-border" />
                    <p className="text-base text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {note.Approach}
                    </p>
                  </>
                )}

                {note.img && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <img
                        src={note.img}
                        alt="note-img"
                        className="rounded-md w-full cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl bg-card border-border">
                     <img
  src={note.img}
  alt="note-img-expanded"
  className="w-full aspect-video object-cover rounded-md object-center"
/>
                    </DialogContent>
                  </Dialog>
                )}

                {note.code && (
                  <>
                    <hr className="border-border" />
                    <Button
                      onClick={() => handlecopy(note.code)}
                      size="sm"
                      variant="outline"
                      className="border-border"
                    >
                      <Copy size={16} className="mr-2" />
                      Copy Code
                    </Button>
                    <CodeEditor cd={note.code} />
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Note</AlertDialogTitle>
              <AlertDialogDescription>
                {`Are you sure you want to delete the note "${deleteConfirm?.itemName}"? This action cannot be undone.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex gap-3 justify-end">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}