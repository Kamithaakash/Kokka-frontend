import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getInbox, getConversation, sendMessage } from '../services/messageService';
import './Inbox.css';

export default function Inbox() {
  const { t } = useTranslation();
  const { userId } = useParams(); // /inbox/:userId
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    getInbox().then(r => {
      setConversations(r.data);
      if (userId && !active) {
        const found = r.data.find(c => c.participants.find(p => p._id === userId));
        if (found) openConversation(found);
      }
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const openConversation = async (conv) => {
    setActive(conv);
    const other = conv.participants.find(p => p._id !== conv._currentUserId);
    const { data } = await getConversation(other?._id || conv.participants[0]._id);
    setMessages(data.messages || []);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !active || sending) return;
    setSending(true);
    try {
      const other = active.participants[0];
      const { data: msg } = await sendMessage(other._id, text.trim());
      setMessages(prev => [...prev, msg]);
      setText('');
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="inbox-page page-wrapper">
      <div className="container">
        <h1 className="inbox-title">{t('inbox.title')}</h1>
        <div className="inbox-layout">
          {/* Conversation List */}
          <div className="inbox-sidebar card">
            {conversations.length === 0 ? (
              <p className="inbox-empty-list">{t('inbox.no_messages')}</p>
            ) : (
              conversations.map(conv => {
                const other = conv.participants?.[0];
                const lastMsg = conv.messages?.[conv.messages.length - 1];
                return (
                  <div
                    key={conv._id}
                    className={`inbox-conv-item ${active?._id === conv._id ? 'active' : ''}`}
                    onClick={() => openConversation(conv)}
                  >
                    <div className="avatar avatar-sm inbox-conv-avatar">
                      {other?.profile?.profilePhoto
                        ? <img src={other.profile.profilePhoto} alt="" className="avatar avatar-sm" />
                        : <span>{(other?.profile?.displayName || other?.email || '?')[0].toUpperCase()}</span>
                      }
                    </div>
                    <div className="inbox-conv-info">
                      <div className="inbox-conv-name">{other?.profile?.displayName || other?.email}</div>
                      {lastMsg && <div className="inbox-conv-last">{lastMsg.text?.substring(0, 40)}{lastMsg.text?.length > 40 ? '…' : ''}</div>}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Chat Window */}
          <div className="inbox-chat card">
            {!active ? (
              <div className="inbox-chat-empty">
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>💬</div>
                <p>Select a conversation to start chatting</p>
                <button className="btn btn-primary" onClick={() => navigate('/browse')}>Browse Profiles</button>
              </div>
            ) : (
              <>
                <div className="inbox-chat-header">
                  <div className="avatar avatar-sm">
                    <span>{(active.participants?.[0]?.profile?.displayName || '?')[0].toUpperCase()}</span>
                  </div>
                  <span className="inbox-chat-name">{active.participants?.[0]?.profile?.displayName}</span>
                </div>
                <div className="inbox-messages">
                  {messages.map((msg, i) => (
                    <div key={msg._id || i} className={`msg-bubble ${msg.sender === active.participants?.[0]?._id ? 'msg-them' : 'msg-me'}`}>
                      <div className="msg-text">{msg.text}</div>
                      <div className="msg-time">{new Date(msg.sentAt).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}</div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <form className="inbox-input-row" onSubmit={handleSend}>
                  <input
                    type="text"
                    className="form-input inbox-text-input"
                    placeholder={t('inbox.type_message')}
                    value={text}
                    onChange={e => setText(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary" disabled={sending || !text.trim()}>
                    {t('inbox.send')}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
