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
import { Trash2, Copy, Maximize2, Download, DownloadCloudIcon } from 'lucide-react';
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
import Loading from '../pages/Loading.jsx';

import TiptapEditor from './TipTapEditor.jsx';
import ReadOnlyTipTap from './ReadOnlyTipTap.jsx';
import { NoteSkeleton } from './Sekelton .jsx';


const API = import.meta.env.VITE_API_URL;

export default function Notes() {
  const [noteid, setNoteid] = useState(localStorage.getItem('noteid'));
  const { id: paramsUserId } = useParams();
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [formData, setFormData] = useState({
    heading: '',
    desc: '',
    grade: '',
    image: null,
    code: '',
    Approach: '',
  });
  const [showcode, setshowcode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [noteLoading, setNoteLoading] = useState(false);

  useEffect(() => {
    if (paramsUserId && user?._id) {
      setIsOwner(paramsUserId === user._id);
    } else {
      setIsOwner(false);
    }
  }, [paramsUserId, user?._id]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredNotes(contentdata);
    } else {
      const filtered = contentdata.filter(
        (note) =>
          note.heading?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.desc?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNotes(filtered);
    }
  }, [searchTerm, contentdata]);

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
      setNoteLoading(true);
      const res = await axios.get(`${API}/apii/notes/all/${noteid}`);
      setNotedata(res.data);
      setcontentdata(res.data.content);
      setNoteLoading(false);  
    } catch (err) {
      setNoteLoading(false);  
      console.log('Error fetching notes:', err);
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
      console.log('Deleting note with id:', deleteConfirm.id);
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
      
      const response = await axios.put(`${API}/apii/notes/${noteid}`, data, {
        withCredentials: true,
      });
      
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

  const Downloadpdf = async () => {
    try {
      const res = await axios.get(`${API}/apii/pdfdownlaod/pdf/${noteid}`, {
        responseType: 'blob',
        withCredentials: true,
      });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "mynotes.pdf";
      a.click();
      toast.success('PDF Downloaded Successfully');
    } catch (err) {
      console.log('Error downloading PDF:', err);
      toast.error('Failed to download PDF');
    }
  };

  useEffect(() => {
    if (noteid) {
      localStorage.setItem('noteid', noteid);
      fetchNote();
    }
  }, [noteid]);

  if (!noteid) return <div className="text-center p-8 text-[var(--color-text)]">No note selected</div>;
  if (noteLoading) return <NoteSkeleton />;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--color-text)] p-2 sm:p-6 transition-colors duration-300">
      {show && <Speech setshow={setShow} desc={setFormData} />}

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-3xl font-bold">{notedata?.heading}</h1>
          <div className="flex items-center gap-3">
            <Button 
              onClick={Downloadpdf} 
              className="p-2 h-9 w-9 flex items-center justify-center"
              variant="outline"
            >
              <DownloadCloudIcon />
            </Button>

            {isOwner && (
              <Button
                onClick={() => setShowForm(!showForm)}
                className="bg-[var(--primary)] hover:bg-[var(--primary)]/80 text-white px-4"
              >
                {showForm ? 'Close' : 'Add Note'}
              </Button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-[var(--color-card)] border border-[var(--border)] rounded-lg p-3">
          <input
            type="text"
            placeholder="Search notes by heading or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-5 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--color-text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-colors duration-300"
          />
        </div>

        {/* Create Note Form */}
        {showForm && isOwner && (
          <div className="bg-[var(--color-card)] border border-[var(--border)] rounded-lg p-4 sm:p-6 space-y-4">
            <h2 className="text-xl font-semibold">Create New Note</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Write heading"
                value={formData.heading}
                onChange={(e) =>
                  setFormData({ ...formData, heading: e.target.value })
                }
                required
                className="bg-[var(--bg)] border-[var(--border)] text-[var(--color-text)]"
              />

              <TiptapEditor
                value={formData.desc}
                onChange={(value) => setFormData({ ...formData, desc: value })}
                placeholder={showcode ? 'Write question' : 'Write description'}
                className="min-h-[200px]"
              />

              <Button
                type="button"
                onClick={() => setshowcode((prev) => !prev)}
                variant="outline"
                className="w-full border-[var(--border)]"
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
                    className="bg-[var(--bg)] border-[var(--border)] text-[var(--color-text)]"
                  />
                  <Textarea
                    placeholder="Write code"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    rows={7}
                    className="bg-[var(--bg)] border-[var(--border)] text-[var(--color-text)] font-mono"
                  />
                </>
              )}

              <Input
                type="file"
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.files[0] })
                }
                className="bg-[var(--bg)] border-[var(--border)]"
              />

              <div className="flex gap-3">
                {['yellow', 'green', 'red'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-md transition-transform hover:scale-110 ${getGradeColor(color)} ${
                      formData.grade === color ? 'ring-2 ring-[var(--primary)]' : ''
                    }`}
                    onClick={() => setFormData({ ...formData, grade: color })}
                  />
                ))}
              </div>

              <div className="flex gap-3 flex-col sm:flex-row">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[var(--primary)] hover:bg-[var(--primary)]/80 text-white flex-1"
                >
                  {loading ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  type="button"
                  onClick={() => setShow(true)}
                  className="bg-[var(--secondary)] hover:bg-[var(--secondary)]/80 text-white flex-1"
                >
                  Audio to Text
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Notes Display */}
        <div className="space-y-6 max-h-[80vh] overflow-y-auto pl-2 w-full">
          {filteredNotes.map((note, idx) => (
            <div key={idx} className="w-full">
              {/* Header Section */}
              <div className="pb-3">
                <div className="flex items-center justify-between gap-3 w-full flex-wrap">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className={`w-4 h-4 rounded-md flex-shrink-0 ${getGradeColor(
                        note.grade
                      )}`}
                    />
                    <h2 className="text-2xl font-semibold capitalize break-words flex-1">
                      {note.heading}
                    </h2>
                  </div>
                  {isOwner && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteConfirm(note._id, note.heading)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10 flex-shrink-0"
                    >
                      <Trash2 size={18} />
                    </Button>
                  )}
                </div>
              </div>

              {/* Content Section */}
              <div className="space-y-4 w-full">
                {editid === idx ? (
                  <div className="space-y-3 w-full">
                    <TiptapEditor
                      value={descvalue}
                      onChange={setdescvalue}
                      className="min-h-[300px]"
                    />
                    <div className="flex gap-3 justify-end flex-wrap">
                      <Button
                        onClick={() => saveDesc(note._id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => seteditid(null)}
                        variant="outline"
                        className=" hover:bg-[var(--secondary)]"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => isOwner && edit(idx)}
                    className="w-full cursor-pointer"
                  >
                    <ReadOnlyTipTap content={note.desc} />
                  </div>
                )}

                {note.Approach && (
                  <>
                    <hr className="border-[var(--border)]" />
                    <p className="text-base text-[var(--muted)] whitespace-pre-wrap leading-relaxed w-full break-words">
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
                    <DialogContent className="max-w-4xl bg-[var(--color-card)] border-[var(--border)]">
                      <img
                        src={note.img}
                        alt="note-img-expanded"
                        className="w-full aspect-video object-cover rounded-md"
                      />
                    </DialogContent>
                  </Dialog>
                )}

                {note.code && (
                  <>
                    <hr className="border-[var(--border)]" />
                    <Button
                      onClick={() => handlecopy(note.code)}
                      size="sm"
                      variant="outline"
                      className="border-[var(--border)]"
                    >
                      <Copy size={16} className="mr-2" />
                      Copy Code
                    </Button>
                    <div className="w-full overflow-x-auto">
                      <CodeEditor cd={note.code} />
                    </div>
                  </>
                )}
              </div>

              {/* Separator */}
              {idx < filteredNotes.length - 1 && (
                <hr className="border-t border-[var(--border)]/50 mt-10" />
              )}
            </div>
          ))}
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
          <AlertDialogContent className="bg-[var(--color-card)] border-[var(--border)]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[var(--color-text)]">Delete Note</AlertDialogTitle>
              <AlertDialogDescription className="text-[var(--muted)]">
                {`Are you sure you want to delete the note "${deleteConfirm?.itemName}"? This action cannot be undone.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex gap-3 justify-end">
              <AlertDialogCancel className="border-[var(--border)]">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-600 text-white hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}