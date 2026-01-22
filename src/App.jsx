import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";

function App() {
  // const [count, setCount] = useState(0);
  const baseURL = `http://localhost:3000/api/tasks`;
  useEffect(() => {
    fetch(
      "http://localhost:3000/bypass-cors?url=https://api-gateway.fullstack.edu.vn/api/analytics",
      { method: "GET" },
    )
      .then((res) => res.json())
      .then((result) => console.log(result));
  }, []);

  const [tasks, setTasks] = useState([
    { id: 1, title: "Học React Hooks", isCompleted: true },
    { id: 2, title: "Xây dựng Todo App", isCompleted: false },
    { id: 3, title: "Tích hợp API backend", isCompleted: false },
    { id: 4, title: "Deploy lên production", isCompleted: false },
  ]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetch(baseURL)
      .then((res) => res.json())
      .then((result) => setTasks(result))
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const completedCount = tasks.filter((task) => task?.isCompleted)?.length;

  const totalCount = tasks.length;

  const handleAddNewTask = () => {
    if (!newTask.trim()) return;
    const payload = {
      title: newTask,
    };
    fetch(baseURL, {
      method: "POST",
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((result) => {
        setTasks([...tasks, result]);
        setNewTask("");
        console.log(tasks);
      })
      .catch((err) => console.log(err));
  };
  // xoa
  const handleDelete = (id) => {
    if (id && window.confirm("Bạn muốn xoá chứ")) {
      console.log(baseURL + `/${id}`);
      fetch(baseURL + `/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.message === "Deleted successfully") {
            setTasks(tasks.filter((task) => task.id != id));
          }
        })
        .catch((err) => console.log(err));
    }
  };
  // sửa
  const handleComplete = (id) => {
    const currentTask = tasks.find((task) => task.id === id);
    if (currentTask) {
      fetch(baseURL + `/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: currentTask.title,
          isCompleted: !currentTask.isCompleted,
        }),
      })
        .then((res) => res.json())
        .then((result) =>
          setTasks(tasks.map((task) => (task.id === id ? result : task))),
        );
    }
  };
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
            <h1 className="text-3xl font-bold mb-2">📝 Todo List</h1>
            <p className="text-blue-100">
              {completedCount} / {totalCount} tasks hoàn thành
            </p>
          </div>

          {/* Input thêm task */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Thêm task mới..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                onClick={handleAddNewTask}
              >
                <Plus className="w-5 h-5" />
                <span>Thêm</span>
              </button>
            </div>
          </div>

          {/* Danh sách tasks */}
          <div className="p-6">
            {tasks.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">Chưa có task nào</p>
                <p className="text-sm mt-2">Hãy thêm task đầu tiên của bạn!</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    {/* Checkbox toggle */}
                    <button
                      className="shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                      onClick={() => {
                        handleComplete(task.id);
                      }}
                    >
                      {task.isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400 group-hover:text-gray-600" />
                      )}
                    </button>

                    {/* Tên task */}
                    <span
                      className={`flex-1 text-lg ${
                        task.isCompleted
                          ? "line-through text-gray-400"
                          : "text-gray-800"
                      }`}
                    >
                      {task.title}
                    </span>

                    {/* Button xóa */}
                    <button
                      className="shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                      title="Xóa task"
                      onClick={() => {
                        handleDelete(task.id);
                      }}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-sm text-gray-600 bg-white rounded-lg p-4 shadow">
          <p className="font-medium mb-2">🚀 Chức năng cần implement:</p>
          <ul className="text-left max-w-md mx-auto space-y-1">
            <li>✅ Hiển thị danh sách tasks (GET API)</li>
            <li>➕ Thêm task mới (POST API)</li>
            <li>✔️ Toggle trạng thái completed (PUT API)</li>
            <li>🗑️ Xóa task (DELETE API)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
