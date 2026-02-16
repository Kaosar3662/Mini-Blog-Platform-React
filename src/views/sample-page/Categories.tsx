import { useEffect, useState } from "react";
import apiService from "../../Api/Axios";
import { TextInput, Button } from "flowbite-react";

interface Category {
  id: number;
  name: string;
}
interface CategoriesResponse {
  data: Category[];
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState<string>("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState<string>("");

  const fetchCategories = async () => {
    const res = await apiService.request<CategoriesResponse>('get', 'admin/categories');
    if (res) {
      setCategories(res.data);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) return;

    await apiService.request("post", "admin/categories", { name });
    setName("");
    fetchCategories();
  };

  const handleUpdate = async (id: number) => {
    if (!editName.trim()) return;

    await apiService.request("put", `admin/categories/${id}`, {
      name: editName,
    });

    setEditId(null);
    setEditName("");
    fetchCategories();
  };

  const handleDelete = async (id: number) => {
    await apiService.request("delete", `admin/categories/${id}`);
    fetchCategories();
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <TextInput
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button onClick={handleCreate}>Create</Button>
      </div>

      <div className="flex flex-col gap-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between py-2 px-5 rounded-lg bg-white shadow-md "
          >
            {editId === cat.id ? (
              <TextInput value={editName} onChange={(e) => setEditName(e.target.value)} />
            ) : (
              <span>{cat.name}</span>
            )}

            <div className="flex gap-2">
              {editId === cat.id ? (
                <Button size="xs" onClick={() => handleUpdate(cat.id)}>
                  Save
                </Button>
              ) : (
                <Button
                  size="xs"
                  onClick={() => {
                    setEditId(cat.id);
                    setEditName(cat.name);
                  }}
                >
                  Edit
                </Button>
              )}
              <Button size="xs" color="error" onClick={() => handleDelete(cat.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;