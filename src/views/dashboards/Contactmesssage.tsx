import { useEffect, useState } from 'react';
import { TextInput, Select, Button } from 'flowbite-react';
import { apiService, useUI } from 'src/Api/Axios';
import Pagination from '../../components/frontend/Pagination';
import Search from '../../components/frontend/Search';

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'read' | 'unread';
  created_at: string;
}

const Contactmesssage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const { setLoader, setAlert } = useUI();

  const fetchMessages = async () => {
    const offset = (currentPage - 1) * limit;

        setAlert(null);
    const res = await apiService.request(
      'get',
      '/admin/messages',
      {},
      {
        params: {
          limit,
          offset,
          status,
          search: searchTerm,
        },
      },
      setLoader,
      setAlert,
    );
    setMessages(res.data.data);
    setTotal(res.data.meta.total);
  };

  const fetchSingleMessage = async (id: number) => {

    setAlert(null);
    const res = await apiService.request(
      'get',
      `/admin/messages/${id}`,
      {},
      {},
      setLoader,
      setAlert,
    );

    return res.data;
  };
  const handleSingleMsg = async (id: number) => {
    const message = await fetchSingleMessage(id);
    setSelectedMessage(message);
    setShowModal(true);
    fetchMessages();
  };

  useEffect(() => {
    fetchMessages();
  }, [currentPage, searchTerm, status]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex flex-col h-full space-y-6 p-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-semibold mb-4">Contact Messages</h2>

        <div className="flex gap-4 mb-4 flex-wrap">
          <Search searchTerm={searchTerm} onSearch={(value) => setSearchTerm(value)} />

          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-auto min-w-40"
          >
            <option value="">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </Select>
        </div>

        <div className="overflow-x-auto w-full">
          <table className=" w-full bg-white rounded-2xl shadow-md overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Subject</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr
                  key={msg.id}
                  onClick={() => handleSingleMsg(msg.id)}
                  className={`cursor-pointer hover:bg-gray-100 ${
                    msg.status === 'read' ? 'text-gray-400' : ''
                  }`}
                >
                  <td className="px-6 py-4">{msg.name}</td>
                  <td className="px-6 py-4">{msg.email}</td>
                  <td className="px-6 py-4">{msg.subject}</td>
                  <td className="px-6 py-4">{new Date(msg.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between w-full mt-4">
          <h6>Total: {total}</h6>

          {totalPages > 1 && (
            <div className="flex justify-end">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page: number) => setCurrentPage(page)}
              />
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="absolute inset-0 bg-[#EEF3F8] h-full flex justify-start items-start z-50">
          <div className=" bg-white w-full h-fit rounded-2xl shadow-md p-6 my-10">
            <Button
              size="xs"
              onClick={() => {
                setShowModal(false);
                setSelectedMessage(null);
              }}
            >
              Back
            </Button>

            <p className="text-sm text-gray-500  mb-4 mt-6">
              From: {selectedMessage?.name} ({selectedMessage?.email})
            </p>
            <h3 className="text-lg font-semibold  my-2">Subject: {selectedMessage?.subject}</h3>
            <p className='pb-2'> message:</p>
            <p className="border-t pt-2 text-xl">{selectedMessage?.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contactmesssage;
