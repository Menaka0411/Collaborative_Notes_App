import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';
import { FaLink, FaRegCopy, FaEnvelope } from 'react-icons/fa';

const NoteShare = ({ note, onClose }) => {
  const [shareLink, setShareLink] = useState('');
  const [permissions, setPermissions] = useState('view');
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);

  const handlePermissionChange = (e) => setPermissions(e.target.value);

  const generateShareLink = () => {
    const link = `${window.location.origin}/notes/${note._id}`;
    setShareLink(link);
    setCopied(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
  };

  const handleSendEmail = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/notes/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, noteId: note._id, permissions }),
      });

      if (res.ok) {
        alert('Note shared successfully via email!');
        onClose();
      } else {
        alert('Failed to share note via email.');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative text-black">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black transition"
        >
          <MdClose size={22} />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-gray-800">Share Note</h2>

        {/* Link Section */}
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <button
              onClick={shareLink ? handleCopyLink : generateShareLink}
              className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition ${
                shareLink
                  ? 'bg-gray-700 hover:bg-gray-800'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {shareLink ? <FaRegCopy /> : <FaLink />}
              {shareLink ? (copied ? 'Copied!' : 'Copy') : 'Link'}
            </button>
            <input
              type="text"
              value={shareLink}
              readOnly
              placeholder="Click 'Generate Link'"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700 focus:outline-none"
            />
          </div>
          {shareLink && (
            <p className="text-xs text-gray-500 mt-2">
              This link allows {permissions === 'edit' ? 'editing' : 'view only'} access.
            </p>
          )}
        </div>

        {/* Permissions */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">Permissions:</label>
          <select
            value={permissions}
            onChange={handlePermissionChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-800"
          >
            <option value="view">View Only</option>
            <option value="edit">Editable</option>
          </select>
        </div>

        {/* Email Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Send via Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Recipient's email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 mb-3"
          />
          <button
            onClick={handleSendEmail}
            className="w-full py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition"
          >
            <FaEnvelope /> Send Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteShare;
