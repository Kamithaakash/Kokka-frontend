import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getInbox, getConversation, sendMessage } from '../services/messageService';
import { getProfileById } from '../services/profileService';
import { useAuth } from '../context/AuthContext';
import './Inbox.css';

export default function Inbox() {
  const { t } = useTranslation();
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [activeUserId, setActiveUserId] = useState(userId || null);
  const [activeProfile, setActiveProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const messagesEndRef = useRef(null);

  // Load inbox conversations
  useEffect(() => {
    getInbox()
      .then(r => setConversations(r.data || []))
      .catch(console.error);
  }, []);

  // When userId changes (from URL), open that conversation
  useEffect(() => {
    if (userId) {
      setActiveUserId(userId);
      loadConversation(userId);
    }
  }, [userId]);

  const loadConversation = async (uid) => {
    setLoadingChat(true);
    setMessages([]);
    try {
      // Load conversation messages
      const conv = await getConversation(uid);
      setMessages(conv.data.messages || []);

      // Load the other person's profile for the header
      try {
        const profileRes = await getProfileById(uid);
        setActiveProfile(profileRes.data);
      } catch {
        // profile not found by profileId — try getting from conversations list
        const found = conversations.find(c =>
          c.participants?.some(p => p._id === uid)
        );
        if (found) {
          const other = found.participants?.find(p => p._id !== user?.id);
          setActiveProfile(other?.profile || null);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingChat(false);
    }
  };

  const openConversation = (conv) => {
    const other = conv.participants?.find(p => p._id !== user?.id);
    if (!other) return;
    setActiveUserId(other._id);
    navigate(`/inbox/${other._id}`, { replace: true });
    setActiveProfile(other.profile);
    setMessages(conv.messages || []);
    loadConversation(other._id);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeUserId || sending) return;
    setSending(true);
    try {
      const { data: msg } = await sendMessage(activeUserId, text.trim());
      setMessages(prev => [...prev, msg]);
      setText('');
      // Refresh inbox list to show new conversation
      getInbox().then(r => setConversations(r.data || []));
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const getOtherParticipant = (conv) => {
    return conv.participants?.find(p => p._id !== user?.id);
  };

  const displayName = activeProfile?.displayName
    || activeProfile?.email
    || 'User';

  return (
    <div className="inbox-page page-wrapper">
      <div className="container">
        <h1 className="inbox-title">{t('inbox.title')}</h1>
        <div className="inbox-layout">

          {/* ── Conversation List ── */}
          <div className="inbox-sidebar card">
            {conversations.length === 0 ? (
              <div className="inbox-empty-list">
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>💬</div>
                <p>{t('inbox.no_messages')}</p>
                <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }}
                  onClick={() => navigate('/browse')}>
                  Browse Profiles
                </button>
              </div>
            ) : (
              conversations.map(conv => {
                const other = getOtherParticipant(conv);
                const lastMsg = conv.messages?.[conv.messages.length - 1];
                const isActive = other?._id === activeUserId;
                return (
                  <div
                    key={conv._id}
                    className={`inbox-conv-item ${isActive ? 'active' : ''}`}
                    onClick={() => openConversation(conv)}
                  >
                    <div className="inbox-conv-avatar">
                      {other?.profile?.profilePhoto
                        ? <img src={other.profile.profilePhoto} alt=""
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                        : <span>{(other?.profile?.displayName || other?.email || '?')[0].toUpperCase()}</span>
                      }
                    </div>
                    <div className="inbox-conv-info">
                      <div className="inbox-conv-name">
                        {other?.profile?.displayName || other?.email || 'User'}
                      </div>
                      {lastMsg && (
                        <div className="inbox-conv-last">
                          {lastMsg.text?.substring(0, 40)}{lastMsg.text?.length > 40 ? '…' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ── Chat Window ── */}
          <div className="inbox-chat card">
            {!activeUserId ? (
              <div className="inbox-chat-empty">
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>💬</div>
                <p>Select a conversation to start chatting</p>
                <button className="btn btn-primary" onClick={() => navigate('/browse')}>
                  Browse Profiles
                </button>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="inbox-chat-header">
                  <div className="inbox-conv-avatar" style={{ flexShrink: 0 }}>
                    {activeProfile?.profilePhoto
                      ? <img src={activeProfile.profilePhoto} alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                      : <span>{displayName[0]?.toUpperCase()}</span>
                    }
                  </div>
                  <div>
                    <div className="inbox-chat-name">{displayName}</div>
                    {activeProfile?.occupation?.jobTitle && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {activeProfile.occupation.jobTitle}
                      </div>
                    )}
                  </div>
                </div>

                {/* Messages */}
                <div className="inbox-messages">
                  {loadingChat ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                      <div className="spinner" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                      <div style={{ fontSize: '2rem', marginBottom: 12 }}>👋</div>
                      <p>Start the conversation! Say hello to <strong>{displayName}</strong></p>
                    </div>
                  ) : (
                    messages.map((msg, i) => {
                      const isMe = msg.sender?.toString() === user?.id?.toString();
                      return (
                        <div key={msg._id || i} className={`msg-bubble ${isMe ? 'msg-me' : 'msg-them'}`}>
                          <div className="msg-text">{msg.text}</div>
                          <div className="msg-time">
                            {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form className="inbox-input-row" onSubmit={handleSend}>
                  <input
                    type="text"
                    className="form-input inbox-text-input"
                    placeholder={t('inbox.type_message') || 'Type a message...'}
                    value={text}
                    onChange={e => setText(e.target.value)}
                    autoFocus
                  />
                  <button type="submit" className="btn btn-primary"
                    disabled={sending || !text.trim()}>
                    {sending ? '...' : t('inbox.send') || 'Send'}
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
