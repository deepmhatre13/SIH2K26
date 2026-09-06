import React, { useState, useRef, useEffect } from 'react';
import type { LLMChatMessage } from '../../types';
import { projectService } from '../../services/projectService';
import { Bot, Send, X, Sparkles, User } from 'lucide-react';

interface ProjectIntelligenceCopilotProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProject?: (projectId: string) => void;
}

export const ProjectIntelligenceCopilot: React.FC<ProjectIntelligenceCopilotProps> = ({
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<LLMChatMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      timestamp: 'Just now',
      content: `### 🤖 Welcome to PAIMANA Project Intelligence Copilot
I am your generative decision-support assistant trained on **2 decades of historical OCMS infrastructure data** and live **April 2026 PAIMANA telemetry** (1,981 Central Sector projects valued at ₹42.78 Lakh Crore).

How can I assist you with infrastructure risk diagnosis, ministerial benchmarking, or prescriptive interventions today?`
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(0);

  const promptSuggestions = [
    "Which Railway projects face critical cost overruns?",
    "Explain top 3 escalation drivers for MAHSR Bullet Train",
    "How does PAIMANA AI outperform conventional statistical methods?",
    "What interventions are proposed for Char Dham Silkyara tunnel?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (queryText?: string) => {
    const query = queryText || inputQuery;
    if (!query.trim() || isTyping) return;
    messageIdRef.current += 1;
    const messageId = messageIdRef.current;

    const userMsg: LLMChatMessage = {
      id: `usr-${messageId}`,
      sender: 'user',
      timestamp: 'Just now',
      content: query
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    try {
      const reply = await projectService.queryIntelligenceCopilot(query, messages);
      const assistantMsg: LLMChatMessage = {
        id: `ast-${messageId}`,
        sender: 'assistant',
        timestamp: 'Just now',
        content: reply
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      const errorMsg: LLMChatMessage = {
        id: `err-${messageId}`,
        sender: 'assistant',
        timestamp: 'Just now',
        content: 'I encountered an error retrieving intelligence telemetry. Please try again.'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '440px',
      maxWidth: 'calc(100vw - 40px)',
      height: '620px',
      maxHeight: 'calc(100vh - 40px)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-medium)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-lg)',
      overflow: 'hidden',
      animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      {/* Copilot Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 18px',
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(99, 102, 241, 0.12) 100%)',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--accent-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#070c18',
            boxShadow: '0 0 10px rgba(6, 182, 212, 0.4)'
          }}>
            <Bot size={18} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              PAIMANA Copilot <span className="badge badge-cyan" style={{ fontSize: '0.62rem' }}>LLM Active</span>
            </h4>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
              Executive Infrastructure Intelligence
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages Feed */}
      <div style={{
        flex: 1,
        padding: '16px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        {messages.map(msg => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start',
                gap: '4px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>
                {isUser ? <User size={12} /> : <Bot size={12} color="var(--accent-cyan)" />}
                <span>{isUser ? 'You (Administrator)' : 'PAIMANA Intelligence'}</span>
                <span>• {msg.timestamp}</span>
              </div>

              <div style={{
                maxWidth: '92%',
                padding: '12px 14px',
                borderRadius: isUser ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                background: isUser ? 'var(--accent-cyan)' : 'var(--bg-tertiary)',
                color: isUser ? '#070c18' : 'var(--text-primary)',
                fontWeight: isUser ? 600 : 400,
                fontSize: '0.78rem',
                lineHeight: 1.5,
                border: isUser ? 'none' : '1px solid var(--border-subtle)',
                whiteSpace: 'pre-wrap'
              }}>
                {msg.content}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'var(--bg-tertiary)', borderRadius: '16px', maxWidth: '180px', fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
            <Sparkles size={14} color="var(--accent-cyan)" />
            <span>Analyzing telemetry...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div style={{
        padding: '8px 14px',
        background: 'var(--bg-tertiary)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        gap: '6px',
        overflowX: 'auto'
      }}>
        {promptSuggestions.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-medium)',
              color: 'var(--text-secondary)',
              fontSize: '0.7rem',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'background var(--transition-fast)'
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = 'var(--accent-cyan)')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--bg-secondary)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <input
          type="text"
          placeholder="Ask anything about 1,981 projects, bottlenecks, or costs..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            fontSize: '0.8rem',
            outline: 'none'
          }}
        />

        <button
          onClick={() => handleSend()}
          disabled={!inputQuery.trim() || isTyping}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: inputQuery.trim() ? 'var(--accent-cyan)' : 'var(--bg-tertiary)',
            color: inputQuery.trim() ? '#070c18' : 'var(--text-tertiary)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: inputQuery.trim() ? 'pointer' : 'default',
            transition: 'background var(--transition-fast)'
          }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};
