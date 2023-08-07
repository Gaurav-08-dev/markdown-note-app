import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { Routes, Route, Navigate } from "react-router-dom";
import NewNote from "./NewNote";
import { useLocalStorage } from "./useLocalStorageHook";
import { useMemo } from "react";
import { v4 as uuidV4 } from "uuid";
import NoteList from "./NoteList";

export type NoteData = {
  title: string;
  markDown: string;
  tags: Tag[];
};
export type Note = {
  id: string;
} & NoteData;

export type Tag = {
  id: string;
  label: string;
};

export type RawNoteData = {
  markdown: string;
  tagIds: string[];
  title: string;
};

export type RawNote = {
  id: string;
} & RawNoteData;

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

  const onAddTag = (tag: Tag) => {
    setTags((prev) => [...prev, tag]);
  };

  const notesWithTags = useMemo(() => {
    return notes.map((note) => {
      return {
        ...note,
        tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
      };
    });
  }, [notes, tags]);

  function onCreateNote({ tags, ...data }: NoteData) {
    setNotes((prevNotes) => {
      const newNote: RawNote = {
        id: uuidV4(),
        markdown: data.markDown,
        tagIds: tags.map((tag) => tag.id),
        title: data.title,
      };

      return [...prevNotes, newNote];
    });
  }

  return (
    <Container className="my-4">
      <Routes>
        <Route path="/" element={<NoteList notes={notesWithTags} availableTags={tags} />} />
        <Route
          path="/new"
          element={
            <NewNote
              onSubmit={onCreateNote}
              onAddTag={onAddTag}
              availableTags={tags}
            />
          }
        />
        <Route path="/:id">
          <Route index element={<h1>Show</h1>} />
          <Route path="edit" element={<h1>Edit</h1>} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  );
}

export default App;
