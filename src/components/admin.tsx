'use client';

import { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { supabase } from '@/lib/supabase';

/* ============================================================
   Style constants
   ============================================================ */
const METAL_GRAD = 'linear-gradient(180deg, #cfd2d6 0%, #8a8f97 38%, #4f545c 58%, #8a8f97 78%, #d8dbde 100%)';
const BG         = '#0f1115';
const SURFACE    = '#1a1d24';
const BORDER     = 'rgba(255,255,255,.08)';
const TEXT       = '#e2e4e8';
const TEXT_MUTED = 'rgba(226,228,232,.5)';

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#0f1115',
  border: '1px solid rgba(255,255,255,.12)',
  borderRadius: 4,
  color: TEXT,
  fontFamily: 'Inter, sans-serif',
  fontSize: 13,
  padding: '9px 12px',
  outline: 'none',
  transition: 'border-color .2s',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'Inter, sans-serif',
  fontSize: 11,
  letterSpacing: '0.26em',
  textTransform: 'uppercase',
  color: TEXT_MUTED,
  marginBottom: 6,
};

const btnPrimary: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '9px 20px',
  background: METAL_GRAD,
  border: 'none',
  borderRadius: 4,
  color: '#0f1115',
  fontFamily: 'Inter, sans-serif',
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  cursor: 'pointer',
};

const btnDanger: React.CSSProperties = {
  ...btnPrimary,
  background: 'transparent',
  border: '1px solid rgba(239,68,68,.5)',
  color: '#ef4444',
};

const btnGhost: React.CSSProperties = {
  ...btnPrimary,
  background: 'transparent',
  border: '1px solid rgba(255,255,255,.15)',
  color: TEXT_MUTED,
};

/* ============================================================
   useIsMobile
   ============================================================ */
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);
  return isMobile;
}

/* ============================================================
   Toast system
   ============================================================ */
interface Toast {
  id: number;
  msg: string;
  type: 'success' | 'error';
}

function useToast(): [Toast[], (msg: string, type?: 'success' | 'error') => void] {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }, []);

  return [toasts, addToast];
}

function ToastContainer({ toasts }: { toasts: Toast[] }) {
  if (!toasts.length) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          padding: '12px 18px',
          background: t.type === 'error' ? '#2d1515' : '#131f18',
          border: `1px solid ${t.type === 'error' ? 'rgba(239,68,68,.4)' : 'rgba(34,197,94,.35)'}`,
          borderRadius: 4,
          color: t.type === 'error' ? '#ef4444' : '#22c55e',
          fontFamily: 'Inter, sans-serif',
          fontSize: 13,
          maxWidth: 320,
          boxShadow: '0 8px 32px rgba(0,0,0,.5)',
          animation: 'slideIn .2s ease',
        }}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   LoginScreen
   ============================================================ */
function LoginScreen() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) setError(err.message);
  };

  return (
    <div style={{
      minHeight: '100vh', background: BG,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        width: '100%', maxWidth: 380,
        background: SURFACE, border: `1px solid ${BORDER}`,
        borderRadius: 8, padding: '40px 32px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            fontFamily: 'Cinzel, serif', fontSize: 28, fontWeight: 500,
            letterSpacing: '0.42em', background: METAL_GRAD,
            WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
            marginBottom: 8,
          }}>AURYA</div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: TEXT_MUTED }}>
            Painel Administrativo
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={labelStyle}>E-mail</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              required autoFocus
              style={inputStyle}
              placeholder="admin@aurya.com"
            />
          </div>
          <div>
            <label style={labelStyle}>Senha</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              required
              style={inputStyle}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div style={{ color: '#ef4444', fontFamily: 'Inter, sans-serif', fontSize: 13, textAlign: 'center' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{ ...btnPrimary, justifyContent: 'center', padding: '12px 20px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ============================================================
   Sidebar / Nav
   ============================================================ */
const NAV_ITEMS = [
  { id: 'produtos',   label: 'Produtos',   icon: '◈' },
  { id: 'categorias', label: 'Categorias', icon: '⊞' },
  { id: 'newsletter', label: 'Newsletter', icon: '✉' },
];

interface SidebarProps {
  tab: string;
  setTab: (t: string) => void;
  user: { email?: string } | null;
  onLogout: () => void;
}

function Sidebar({ tab, setTab, user, onLogout }: SidebarProps) {
  return (
    <div style={{
      width: 240, height: '100%',
      background: SURFACE, borderRight: `1px solid ${BORDER}`,
      display: 'flex', flexDirection: 'column',
      padding: '32px 0 24px', overflowY: 'auto',
    }}>
      <div style={{ padding: '0 24px', marginBottom: 32 }}>
        <div style={{
          fontFamily: 'Cinzel, serif', fontSize: 18, fontWeight: 500, letterSpacing: '0.42em',
          background: METAL_GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
        }}>AURYA</div>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: TEXT_MUTED, marginTop: 4 }}>
          Admin
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_ITEMS.map(item => (
          <button key={item.id} onClick={() => setTab(item.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 24px',
              background: tab === item.id ? 'rgba(255,255,255,.06)' : 'transparent',
              border: 'none',
              borderLeft: tab === item.id ? '2px solid rgba(200,204,210,.5)' : '2px solid transparent',
              color: tab === item.id ? TEXT : TEXT_MUTED,
              fontFamily: 'Inter, sans-serif', fontSize: 13,
              cursor: 'pointer', textAlign: 'left',
              transition: 'background .15s, color .15s',
              whiteSpace: 'nowrap',
            }}>
            <span style={{ fontSize: 14, opacity: 0.8 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 'auto', padding: '16px 24px', borderTop: `1px solid ${BORDER}` }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: TEXT_MUTED, marginBottom: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user?.email}
        </div>
        <button onClick={onLogout} style={{ ...btnGhost, fontSize: 11, padding: '7px 14px' }}>
          Sair
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   Modal (ReactDOM.createPortal)
   ============================================================ */
interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({ title, onClose, children }: ModalProps) {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  const content = (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,.7)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: isMobile ? 'flex-end' : 'center', justifyContent: 'center',
      zIndex: 99999, padding: isMobile ? 0 : 16, overflowY: 'auto',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: SURFACE, border: `1px solid ${BORDER}`,
        borderRadius: isMobile ? '12px 12px 0 0' : 8,
        width: '100%', maxWidth: isMobile ? '100%' : 560,
        padding: isMobile ? '20px 16px' : '32px',
        position: 'relative',
        maxHeight: isMobile ? '92vh' : '90vh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 15, fontWeight: 500, letterSpacing: '0.12em', color: TEXT }}>
            {title}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: TEXT_MUTED, fontSize: 22, cursor: 'pointer', padding: 4, lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
  return ReactDOM.createPortal(content, document.body);
}

/* ============================================================
   Toggle switch
   ============================================================ */
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div onClick={() => onChange(!value)} style={{
      width: 40, height: 22, borderRadius: 11,
      background: value ? 'rgba(200,204,210,.6)' : 'rgba(255,255,255,.1)',
      position: 'relative', cursor: 'pointer', transition: 'background .2s', flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', top: 3, left: value ? 21 : 3,
        width: 16, height: 16, borderRadius: '50%',
        background: value ? '#0f1115' : 'rgba(255,255,255,.4)',
        transition: 'left .2s, background .2s',
      }} />
    </div>
  );
}

/* ============================================================
   Field helper
   ============================================================ */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

/* ============================================================
   ProductModal
   ============================================================ */
const SHAPE_OPTIONS = [
  { value: 'ring',     label: 'Anel' },
  { value: 'pendant',  label: 'Pingente' },
  { value: 'earring',  label: 'Brinco / Piercing' },
  { value: 'bracelet', label: 'Pulseira' },
  { value: 'necklace', label: 'Colar' },
];

interface Category {
  id: string;
  name: string;
  display_order: number;
}

interface Product {
  id?: string;
  name?: string;
  category?: string;
  price?: string;
  description?: string;
  shape?: string;
  image_url?: string;
  video_url?: string;
  available?: boolean;
  display_order?: number;
}

interface ProductModalProps {
  product: Product | null;
  categories: Category[];
  onSave: () => void;
  onClose: () => void;
  addToast: (msg: string, type?: 'success' | 'error') => void;
}

function ProductModal({ product, categories, onSave, onClose, addToast }: ProductModalProps) {
  const isNew = !product?.id;
  const [form, setForm] = useState({
    name:          product?.name          ?? '',
    category:      product?.category      ?? (categories[0]?.name ?? ''),
    price:         product?.price         ?? '',
    description:   product?.description   ?? '',
    shape:         product?.shape         ?? 'ring',
    image_url:     product?.image_url     ?? '',
    video_url:     product?.video_url     ?? '',
    available:     product?.available     ?? true,
    display_order: product?.display_order ?? 0,
  });
  const [uploading,      setUploading]      = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [saving, setSaving]                 = useState(false);

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const uploadToStorage = async (file: File) => {
    const ext  = file.name.split('.').pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from('products').upload(path, file, { upsert: false });
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(path);
    return publicUrl;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToStorage(file);
      set('image_url', url);
      addToast('Imagem enviada!');
    } catch (err: unknown) {
      addToast('Erro ao enviar imagem: ' + (err as Error).message, 'error');
    }
    setUploading(false);
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVideo(true);
    try {
      const url = await uploadToStorage(file);
      set('video_url', url);
      addToast('Vídeo enviado!');
    } catch (err: unknown) {
      addToast('Erro ao enviar vídeo: ' + (err as Error).message, 'error');
    }
    setUploadingVideo(false);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { addToast('Nome é obrigatório', 'error'); return; }
    setSaving(true);
    const payload = { ...form, updated_at: new Date().toISOString() };
    let err;
    if (isNew) {
      const res = await supabase.from('products').insert(payload);
      err = res.error;
    } else {
      const res = await supabase.from('products').update(payload).eq('id', product!.id!);
      err = res.error;
    }
    setSaving(false);
    if (err) { addToast('Erro: ' + err.message, 'error'); return; }
    addToast(isNew ? 'Produto criado!' : 'Produto atualizado!');
    onSave();
  };

  return (
    <Modal title={isNew ? 'Novo Produto' : 'Editar Produto'} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Field label="Nome *">
          <input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nome do produto" />
        </Field>

        <Field label="Categoria">
          <select style={inputStyle} value={form.category} onChange={e => set('category', e.target.value)}>
            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </Field>

        <Field label="Preço">
          <input style={inputStyle} value={form.price} onChange={e => set('price', e.target.value)} placeholder="R$ 489" />
        </Field>

        <Field label="Descrição">
          <textarea style={{ ...inputStyle, minHeight: 72, resize: 'vertical' }} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Descrição breve" />
        </Field>

        <Field label="Forma">
          <select style={inputStyle} value={form.shape} onChange={e => set('shape', e.target.value)}>
            {SHAPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>

        <Field label="Ordem de exibição">
          <input style={inputStyle} type="number" value={form.display_order} onChange={e => set('display_order', parseInt(e.target.value) || 0)} />
        </Field>

        {/* Image upload */}
        <Field label="Imagem">
          {form.image_url && (
            <div style={{ marginBottom: 10, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.image_url} alt="preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4, border: `1px solid ${BORDER}` }} />
              <button style={{ ...btnDanger, padding: '4px 10px', fontSize: 10 }} onClick={() => set('image_url', '')}>✕</button>
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleFileUpload}
            style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: TEXT_MUTED }} />
          {uploading && <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: TEXT_MUTED }}>Enviando imagem...</span>}
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: TEXT_MUTED }}>
            Recomendado: JPG ou PNG · HEIC (iPhone) pode não exibir em todos os navegadores
          </span>
          {form.image_url && (
            <input style={{ ...inputStyle, marginTop: 6, fontSize: 11 }} value={form.image_url}
              onChange={e => set('image_url', e.target.value)} placeholder="URL da imagem" />
          )}
        </Field>

        {/* Video upload */}
        <Field label="Vídeo">
          {form.video_url && (
            <div style={{ marginBottom: 10, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <video src={form.video_url} muted controls
                style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 4, border: `1px solid ${BORDER}`, display: 'block' }} />
              <button style={{ ...btnDanger, padding: '4px 10px', fontSize: 10 }} onClick={() => set('video_url', '')}>✕</button>
            </div>
          )}
          <input type="file" accept="video/*" onChange={handleVideoUpload}
            style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: TEXT_MUTED }} />
          {uploadingVideo && <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: TEXT_MUTED }}>Enviando vídeo...</span>}
          {form.video_url && (
            <input style={{ ...inputStyle, marginTop: 6, fontSize: 11 }} value={form.video_url}
              onChange={e => set('video_url', e.target.value)} placeholder="URL do vídeo" />
          )}
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: TEXT_MUTED, marginTop: 4 }}>
            Recomendado: MP4 · MOV pode não reproduzir no Chrome/Windows
          </span>
        </Field>

        <Field label="">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Toggle value={form.available} onChange={v => set('available', v)} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: TEXT_MUTED }}>Disponível</span>
          </div>
        </Field>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8 }}>
          <button style={btnGhost} onClick={onClose}>Cancelar</button>
          <button style={btnPrimary} onClick={handleSave} disabled={saving}>
            {saving ? 'Salvando...' : isNew ? 'Criar' : 'Salvar'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ============================================================
   ProdutosTab
   ============================================================ */
function ProdutosTab({ addToast }: { addToast: (msg: string, type?: 'success' | 'error') => void }) {
  const [products,    setProducts]    = useState<Product[]>([]);
  const [categories,  setCategories]  = useState<Category[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [modal,       setModal]       = useState<Product | 'new' | null>(null);
  const [search,      setSearch]      = useState('');
  const [filterCat,   setFilterCat]   = useState('Todos');
  const [filterAvail, setFilterAvail] = useState('Todos');
  const [sortCol,     setSortCol]     = useState<string | null>(null);
  const [sortDir,     setSortDir]     = useState<'asc' | 'desc'>('asc');
  const isMobile = useIsMobile();

  const load = useCallback(async () => {
    setLoading(true);
    const [pr, cr] = await Promise.all([
      supabase.from('products').select('*').order('display_order'),
      supabase.from('categories').select('*').order('display_order'),
    ]);
    setProducts((pr.data as Product[]) || []);
    setCategories((cr.data as Category[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (p: Product) => {
    if (!window.confirm(`Excluir "${p.name}"?`)) return;
    const { error } = await supabase.from('products').delete().eq('id', p.id);
    if (error) { addToast('Erro: ' + error.message, 'error'); return; }
    addToast('Produto excluído.');
    load();
  };

  const handleToggle = async (p: Product) => {
    const { error } = await supabase.from('products').update({ available: !p.available, updated_at: new Date().toISOString() }).eq('id', p.id);
    if (error) { addToast('Erro: ' + error.message, 'error'); return; }
    setProducts(ps => ps.map(x => x.id === p.id ? { ...x, available: !x.available } : x));
  };

  const toggleSort = (col: string) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  const q = search.toLowerCase().trim();
  const visible = products
    .filter(p => {
      if (filterCat !== 'Todos' && p.category !== filterCat) return false;
      if (filterAvail === 'Disponível' && !p.available) return false;
      if (filterAvail === 'Indisponível' && p.available) return false;
      if (q && !p.name?.toLowerCase().includes(q) && !p.category?.toLowerCase().includes(q) && !String(p.price || '').toLowerCase().includes(q)) return false;
      return true;
    })
    .sort((a, b) => {
      if (!sortCol) return 0;
      const va = (String((a as Record<string, unknown>)[sortCol] ?? '')).toLowerCase();
      const vb = (String((b as Record<string, unknown>)[sortCol] ?? '')).toLowerCase();
      return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    });

  const SortIcon = ({ col }: { col: string }) => {
    if (sortCol !== col) return <span style={{ opacity: 0.25, marginLeft: 4 }}>↕</span>;
    return <span style={{ marginLeft: 4 }}>{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  const thStyle = (col: string | null): React.CSSProperties => ({
    padding: '12px 16px', textAlign: 'left',
    fontFamily: 'Inter, sans-serif', fontSize: 10,
    letterSpacing: '0.28em', textTransform: 'uppercase',
    color: sortCol === col ? TEXT : TEXT_MUTED, fontWeight: 400,
    cursor: col ? 'pointer' : 'default',
    userSelect: 'none', whiteSpace: 'nowrap',
  });

  return (
    <div style={{ padding: 'clamp(16px, 3vw, 32px)', maxWidth: 1100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: 20, fontWeight: 500, letterSpacing: '0.1em', color: TEXT }}>Produtos</h1>
        <button style={btnPrimary} onClick={() => setModal('new')}>+ Adicionar Produto</button>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Pesquisar por nome, categoria ou preço..."
          style={{ ...inputStyle, flex: '1 1 220px', minWidth: 180 }}
        />
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
          style={{ ...inputStyle, width: 'auto', cursor: 'pointer' }}>
          <option value="Todos">Todas as categorias</option>
          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
        <select value={filterAvail} onChange={e => setFilterAvail(e.target.value)}
          style={{ ...inputStyle, width: 'auto', cursor: 'pointer' }}>
          <option value="Todos">Disponibilidade</option>
          <option value="Disponível">Disponível</option>
          <option value="Indisponível">Indisponível</option>
        </select>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: TEXT_MUTED, whiteSpace: 'nowrap' }}>
          {visible.length} de {products.length}
        </span>
        {(q || filterCat !== 'Todos' || filterAvail !== 'Todos') && (
          <button style={{ ...btnGhost, padding: '6px 12px', fontSize: 11 }}
            onClick={() => { setSearch(''); setFilterCat('Todos'); setFilterAvail('Todos'); }}>
            ✕ Limpar
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ color: TEXT_MUTED, fontFamily: 'Inter, sans-serif', fontSize: 13 }}>Carregando...</div>
      ) : isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {visible.map(p => (
            <div key={p.id} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '14px 16px' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  {p.image_url
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={p.image_url} alt={p.name} style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 4, border: `1px solid ${BORDER}`, display: 'block' }} />
                    : <div style={{ width: 52, height: 52, background: '#0f1115', borderRadius: 4, border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: TEXT_MUTED, fontSize: 18 }}>◈</div>
                  }
                  {p.video_url && (
                    <div style={{ position: 'absolute', bottom: 2, right: 2, background: 'rgba(0,0,0,.8)', borderRadius: 2, width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="5" height="6" viewBox="0 0 5 6" fill="#fff"><path d="M0 0 L5 3 L0 6 Z"/></svg>
                    </div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: TEXT, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: TEXT_MUTED, marginBottom: 4 }}>{p.category}</div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: TEXT }}>{p.price}</div>
                </div>
                <Toggle value={!!p.available} onChange={() => handleToggle(p)} />
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button style={{ ...btnGhost, flex: 1, justifyContent: 'center', padding: '9px 12px', fontSize: 11 }} onClick={() => setModal(p)}>✎ Editar</button>
                <button style={{ ...btnDanger, padding: '9px 16px', fontSize: 11 }} onClick={() => handleDelete(p)}>✕</button>
              </div>
            </div>
          ))}
          {visible.length === 0 && (
            <div style={{ padding: 32, textAlign: 'center', color: TEXT_MUTED, fontFamily: 'Inter, sans-serif', fontSize: 13 }}>
              {products.length === 0 ? 'Nenhum produto cadastrado.' : 'Nenhum produto encontrado.'}
            </div>
          )}
        </div>
      ) : (
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                <th style={thStyle(null)}>Imagem</th>
                <th style={thStyle('name')} onClick={() => toggleSort('name')}>Nome <SortIcon col="name" /></th>
                <th style={thStyle('category')} onClick={() => toggleSort('category')}>Categoria <SortIcon col="category" /></th>
                <th style={thStyle('price')} onClick={() => toggleSort('price')}>Preço <SortIcon col="price" /></th>
                <th style={thStyle(null)}>Disponível</th>
                <th style={thStyle(null)}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((p, i) => (
                <tr key={p.id} style={{ borderBottom: i < visible.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                  <td style={{ padding: '10px 16px' }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      {p.image_url
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={p.image_url} alt={p.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, border: `1px solid ${BORDER}`, display: 'block' }} />
                        : <div style={{ width: 40, height: 40, background: '#0f1115', borderRadius: 4, border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: TEXT_MUTED, fontSize: 16 }}>◈</div>
                      }
                      {p.video_url && (
                        <div style={{ position: 'absolute', bottom: 2, right: 2, background: 'rgba(0,0,0,.8)', borderRadius: 2, width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="5" height="6" viewBox="0 0 5 6" fill="#fff"><path d="M0 0 L5 3 L0 6 Z"/></svg>
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '10px 16px', fontFamily: 'Inter, sans-serif', fontSize: 13, color: TEXT }}>{p.name}</td>
                  <td style={{ padding: '10px 16px', fontFamily: 'Inter, sans-serif', fontSize: 12, color: TEXT_MUTED }}>{p.category}</td>
                  <td style={{ padding: '10px 16px', fontFamily: 'Inter, sans-serif', fontSize: 13, color: TEXT }}>{p.price}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <Toggle value={!!p.available} onChange={() => handleToggle(p)} />
                  </td>
                  <td style={{ padding: '10px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button style={{ ...btnGhost, padding: '6px 12px', fontSize: 11 }} onClick={() => setModal(p)}>✎ Editar</button>
                      <button style={{ ...btnDanger, padding: '6px 12px', fontSize: 11 }} onClick={() => handleDelete(p)}>✕</button>
                    </div>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: TEXT_MUTED, fontFamily: 'Inter, sans-serif', fontSize: 13 }}>
                  {products.length === 0 ? 'Nenhum produto cadastrado.' : 'Nenhum produto encontrado.'}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <ProductModal
          product={modal === 'new' ? null : modal as Product}
          categories={categories}
          onSave={() => { setModal(null); load(); }}
          onClose={() => setModal(null)}
          addToast={addToast}
        />
      )}
    </div>
  );
}

/* ============================================================
   CategoriasTab
   ============================================================ */
function CategoriasTab({ addToast }: { addToast: (msg: string, type?: 'success' | 'error') => void }) {
  const [cats,    setCats]    = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [adding,  setAdding]  = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('categories').select('*').order('display_order');
    setCats((data as Category[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setAdding(true);
    const maxOrder = cats.reduce((m, c) => Math.max(m, c.display_order), 0);
    const { error } = await supabase.from('categories').insert({ name: newName.trim(), display_order: maxOrder + 1 });
    setAdding(false);
    if (error) { addToast('Erro: ' + error.message, 'error'); return; }
    setNewName('');
    addToast('Categoria criada!');
    load();
  };

  const handleDelete = async (cat: Category) => {
    const { count } = await supabase.from('products').select('id', { count: 'exact', head: true }).eq('category', cat.name);
    if (count && count > 0) {
      addToast(`Não é possível excluir: ${count} produto(s) usam esta categoria.`, 'error');
      return;
    }
    if (!window.confirm(`Excluir categoria "${cat.name}"?`)) return;
    const { error } = await supabase.from('categories').delete().eq('id', cat.id);
    if (error) { addToast('Erro: ' + error.message, 'error'); return; }
    addToast('Categoria excluída.');
    load();
  };

  return (
    <div style={{ padding: 'clamp(16px, 3vw, 32px)', maxWidth: 600 }}>
      <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: 20, fontWeight: 500, letterSpacing: '0.1em', color: TEXT, marginBottom: 24 }}>Categorias</h1>

      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '20px', marginBottom: 20 }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, letterSpacing: '0.26em', textTransform: 'uppercase', color: TEXT_MUTED, marginBottom: 14 }}>Nova Categoria</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input style={{ ...inputStyle, flex: 1 }} value={newName} onChange={e => setNewName(e.target.value)}
            placeholder="Nome da categoria"
            onKeyDown={e => e.key === 'Enter' && handleAdd()} />
          <button style={btnPrimary} onClick={handleAdd} disabled={adding || !newName.trim()}>
            {adding ? '...' : '+ Adicionar'}
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ color: TEXT_MUTED, fontFamily: 'Inter, sans-serif', fontSize: 13 }}>Carregando...</div>
      ) : (
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8, overflow: 'hidden' }}>
          {cats.map((cat, i) => (
            <div key={cat.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 20px',
              borderBottom: i < cats.length - 1 ? `1px solid ${BORDER}` : 'none',
            }}>
              <div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: TEXT }}>{cat.name}</div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: TEXT_MUTED, marginTop: 2 }}>Ordem: {cat.display_order}</div>
              </div>
              <button style={{ ...btnDanger, padding: '6px 12px', fontSize: 11 }} onClick={() => handleDelete(cat)}>
                Excluir
              </button>
            </div>
          ))}
          {cats.length === 0 && (
            <div style={{ padding: 32, textAlign: 'center', color: TEXT_MUTED, fontFamily: 'Inter, sans-serif', fontSize: 13 }}>Nenhuma categoria cadastrada.</div>
          )}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   NewsletterTab
   ============================================================ */
interface Subscriber {
  id: string;
  email: string;
  name?: string;
  created_at?: string;
}

function NewsletterTab({ addToast }: { addToast: (msg: string, type?: 'success' | 'error') => void }) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading,     setLoading]     = useState(true);
  const isMobile = useIsMobile();

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('subscribers').select('*').order('created_at', { ascending: false });
    setSubscribers((data as Subscriber[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (sub: Subscriber) => {
    if (!window.confirm(`Remover "${sub.email}" da lista?`)) return;
    const { error } = await supabase.from('subscribers').delete().eq('id', sub.id);
    if (error) { addToast('Erro: ' + error.message, 'error'); return; }
    addToast('Inscrito removido.');
    load();
  };

  const fmtDate = (iso?: string) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' }) + ' · ' +
           d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ padding: 'clamp(16px, 3vw, 32px)', maxWidth: 860 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: 20, fontWeight: 500, letterSpacing: '0.1em', color: TEXT }}>Newsletter</h1>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: TEXT_MUTED }}>
          {subscribers.length} inscrito{subscribers.length !== 1 ? 's' : ''}
        </div>
      </div>

      {loading ? (
        <div style={{ color: TEXT_MUTED, fontFamily: 'Inter, sans-serif', fontSize: 13 }}>Carregando...</div>
      ) : isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {subscribers.map(s => (
            <div key={s.id} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: TEXT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.email}</div>
                {s.name && <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: TEXT_MUTED, marginTop: 2 }}>{s.name}</div>}
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: TEXT_MUTED, marginTop: 4 }}>{fmtDate(s.created_at)}</div>
              </div>
              <button style={{ ...btnDanger, padding: '6px 10px', fontSize: 11, flexShrink: 0 }} onClick={() => handleDelete(s)}>✕</button>
            </div>
          ))}
          {subscribers.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: TEXT_MUTED, fontFamily: 'Inter, sans-serif', fontSize: 13 }}>Nenhum inscrito ainda.</div>
          )}
        </div>
      ) : (
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                {['E-mail', 'Nome', 'Data de inscrição', ''].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'Inter, sans-serif', fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: TEXT_MUTED, fontWeight: 400 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s, i) => (
                <tr key={s.id} style={{ borderBottom: i < subscribers.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                  <td style={{ padding: '12px 16px', fontFamily: 'Inter, sans-serif', fontSize: 13, color: TEXT }}>{s.email}</td>
                  <td style={{ padding: '12px 16px', fontFamily: 'Inter, sans-serif', fontSize: 13, color: TEXT_MUTED }}>{s.name || '—'}</td>
                  <td style={{ padding: '12px 16px', fontFamily: 'Inter, sans-serif', fontSize: 12, color: TEXT_MUTED, whiteSpace: 'nowrap' }}>{fmtDate(s.created_at)}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <button style={{ ...btnDanger, padding: '6px 12px', fontSize: 11 }} onClick={() => handleDelete(s)}>✕ Remover</button>
                  </td>
                </tr>
              ))}
              {subscribers.length === 0 && (
                <tr><td colSpan={4} style={{ padding: 40, textAlign: 'center', color: TEXT_MUTED, fontFamily: 'Inter, sans-serif', fontSize: 13 }}>Nenhum inscrito ainda.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   AdminPanel
   ============================================================ */
interface AdminUser {
  email?: string;
}

function AdminPanel({ user }: { user: AdminUser }) {
  const [tab,    setTab]   = useState('produtos');
  const [toasts, addToast] = useToast();
  const isMobile           = useIsMobile();

  const handleLogout = async () => { await supabase.auth.signOut(); };

  const TAB_LABELS: Record<string, string> = { produtos: 'Produtos', categorias: 'Categorias', newsletter: 'Newsletter' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: BG }}>

      {!isMobile && (
        <div style={{ width: 240, flexShrink: 0, position: 'sticky', top: 0, height: '100vh' }}>
          <Sidebar tab={tab} setTab={setTab} user={user} onLogout={handleLogout} />
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0, overflowX: isMobile ? 'visible' : 'hidden', paddingBottom: isMobile ? 64 : 0 }}>

        {isMobile && (
          <div style={{
            position: 'sticky', top: 0, zIndex: 50,
            background: SURFACE, borderBottom: `1px solid ${BORDER}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 16px', height: 52,
          }}>
            <div style={{
              fontFamily: 'Cinzel, serif', fontSize: 16, fontWeight: 500, letterSpacing: '0.38em',
              background: METAL_GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
            }}>AURYA</div>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: TEXT_MUTED }}>
              {TAB_LABELS[tab]}
            </span>
            <button onClick={handleLogout} style={{ ...btnGhost, fontSize: 10, padding: '5px 10px' }}>Sair</button>
          </div>
        )}

        {tab === 'produtos'   && <ProdutosTab   addToast={addToast} />}
        {tab === 'categorias' && <CategoriasTab addToast={addToast} />}
        {tab === 'newsletter' && <NewsletterTab addToast={addToast} />}
      </div>

      {isMobile && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          height: 60, background: SURFACE, borderTop: `1px solid ${BORDER}`,
          display: 'flex', zIndex: 40,
        }}>
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)} style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 3,
              background: 'none', border: 'none', cursor: 'pointer',
              borderTop: tab === item.id ? '2px solid rgba(200,204,210,.6)' : '2px solid transparent',
              color: tab === item.id ? TEXT : TEXT_MUTED,
              transition: 'color .15s',
            }}>
              <span style={{ fontSize: 17 }}>{item.icon}</span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase' }}>{item.label}</span>
            </button>
          ))}
        </div>
      )}

      <ToastContainer toasts={toasts} />

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(40px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ============================================================
   AdminApp — auth gate
   ============================================================ */
export function AdminApp() {
  const [user,    setUser]    = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', color: TEXT_MUTED, fontFamily: 'Inter, sans-serif', fontSize: 13 }}>
        Carregando...
      </div>
    );
  }

  return user ? <AdminPanel user={user} /> : <LoginScreen />;
}
