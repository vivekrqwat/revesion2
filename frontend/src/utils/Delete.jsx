import axios from 'axios';

const API = import.meta.env.VITE_API_URL; // ✅ backend base URL

export default async function Delete(name, id) {
  console.log("delete is called with:", name, id);

  try {
    if (name === "post") {
      const res = await axios.delete(`${API}/apii/post/postid/${id}`, { withCredentials: true });
      console.log("post deleted", res.data);
      return res.data;
    }

    if (name === "notes") {
      const res = await axios.delete(`${API}/apii/notes/dirdelete/${id}`, { withCredentials: true });
      console.log("note deleted", id, res.data);
      return res.data;
    }

    if (name === "dir") {
      const res = await axios.delete(`${API}/apii/dir/${id}`, { withCredentials: true });
      console.log("dir deleted", id, res.data);
      return res.data;
    }

    if (name === "noteid") {
      const res = await axios.delete(`${API}/apii/notes/${id}`, { withCredentials: true });
      console.log("noteid deleted", id, res.data);
      return res.data;
    }

    if (name === "content") {
      console.log("content delete:", id);
      const res = await axios.delete(`${API}/apii/notes/Notes/${id[0]}/content/${id[1]}`, { withCredentials: true });
      console.log("content deleted", id, res.data);
      return res.data;
    }

  } catch (e) {
    console.error("Delete error:", {
      message: e.message,
      response: e.response?.data,
      status: e.response?.status
    });
    throw e; // Re-throw to allow calling code to handle the error
  }
}
