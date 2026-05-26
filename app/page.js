'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const ITEMS_PER_PAGE = 24
const LOGO_SVG = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiID8+PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiPjxwYXRoIGZpbGw9IiNGRkZFRjQiIGQ9Ik0wIDBMNTAwIDBMNTAwIDUwMEwwIDUwMEwwIDBaIi8+PHBhdGggZD0iTTk5LjAxNzEgMjc0LjdDOTkuODAwNyAyNzEuMDI4IDEwMS40NDggMjY2LjI4NCAxMDIuNzY4IDI2Mi42MzdDMTA0LjIxOSAyNTguNjMgMTA3Ljk4MyAyNTMuMzgzIDExMC41NDggMjQ5LjkxMUMxMTEuNTU1IDI0OC41NDggMTE0LjA5NyAyNDYuOTQ5IDExNS4zODMgMjQ1Ljg1MUMxMjEuNDIgMjQwLjcgMTI4LjU3NyAyMzcuODcyIDEzNS43MDkgMjM0LjYyNEMxMzguOTU1IDIzMy4xODEgMTQ0Ljk0NCAyMzAuNTU1IDE0OC4xOTMgMjI5LjU2QzE1MS42OTEgMjI4LjQ4OCAxNTcuMjM2IDIyNy41IDE2MC45NTYgMjI2LjY0NUMxNzIuNDM3IDIyNC4wMDcgMTgzLjk4OCAyMjEuNzUxIDE5NS42OTQgMjIwLjM2QzIwMC44NzcgMjE5Ljc0NSAyMDUuNzYzIDIxOC45ODkgMjEwLjkwNSAyMTguMTY1QzIxNC4wNSAyMTcuNjYxIDIxOC45MSAyMTYuNjYxIDIyMi4wMDggMjE2LjQzM0MyMzIuMjUyIDIxNS42NzkgMjQyLjcyMSAyMTUuODQgMjUyLjk5MiAyMTUuOTkxQzI1NC4yMDEgMjE1LjkxMiAyNTUuOTM2IDIxNi41MjQgMjU3LjA0NSAyMTYuNDgzQzI2Mi4wOTEgMjE2LjI0NCAyNjcuMTk4IDIxNi45MTggMjcyLjIyNiAyMTcuMTY4QzI5MS43NjggMjE4LjEzOCAzMTEuMDUyIDIxOS44ODggMzMwLjIwMSAyMjQuMDY2QzMzNi4wODkgMjI1LjM1MSAzNDIuNzAxIDIyNS42NDIgMzQ4LjYxMSAyMjcuMDhDMzUzLjc1NyAyMjguMzMyIDM1OS4wNSAyMzAuMjE2IDM2NC4wNzggMjMxLjkwOUMzNjUuMDYzIDIzMi4yMzcgMzY4Ljc5NiAyMzQuMzU3IDM2OS45MDEgMjM0Ljk2TDM4MC4zNjUgMjQwLjY1OUMzODIuMTMzIDI0MS42MTIgMzkxLjI0NCAyNDYuMjkzIDM5Mi4wMDkgMjQ2Ljk4N0MzOTQuMzA0IDI0OS4wNjkgNDAyLjEwNiAyNTcuOTM0IDQwMy4wNDEgMjYwLjg3OEM0MDMuNjk5IDI2Mi45NSA0MDcuMzcxIDI3My41MjIgNDA2LjYzNyAyNzUuMjhMNDA2LjcyNiAyNzYuMzg2QzQwNy40MTQgMjc4LjYyOSA0MDcuNTMyIDI5MS45OTggNDA3LjYxOCAyOTUuMDM4TDQwOC43OTkgMzQwLjg4N0MzOTcuMzU2IDM0OC4zNDYgMzg2Ljc5OCAzNTcuMDUgMzc0Ljc2MyAzNjMuNjgxQzM3MS45NTggMzY1LjIyNiAzNjguMzgyIDM2Ny44ODkgMzY1LjUxNSAzNjkuMDYzTDM2NS4xMTYgMzY4LjY4MkMzNjUuMjgzIDM2Ny40MTUgMzY2LjkwNCAzNjcuMDQyIDM2Ny45OTggMzY2LjY0MUwzNjguMDcgMzM5Ljk3MUMzNjguMDMgMzMxLjc3OCAzNjcuNzk3IDMyMi43NiAzNjguMDE1IDMxNC41ODlDMzU5Ljk2NyAzMTguNjA0IDM1MC43MjcgMzIxLjQyMyAzNDEuOTk5IDMyMy42NTVDMzM4LjA5NSAzMjQuNjUyIDMzMy4yNzMgMzI0LjU1IDMyOS4zIDMyNS41NjZMMzI5LjA0OCAzMjUuODM1QzMyNC40MzEgMzI2Ljc2MyAzMTkuMzUxIDMyOC42NTggMzE0LjY4NyAzMjkuNTM4QzMxMS4wMzcgMzMwLjIyOCAzMDYuODM5IDMyOS44MzYgMzAzLjIwMSAzMzAuMDE3QzMwMS42NzggMzMwLjA5MyAyOTguMTM0IDMyOS44NTEgMjk3Ljg2NiAzMzEuMDI1QzI5Ny44IDMzMS4xMzcgMjk3LjczNCAzMzEuMjUgMjk3LjY2OSAzMzEuMzYzTDI5Ny4xMDcgMzMxLjQ1M0MyOTYuNzkzIDMzMS4wNzYgMjk2LjY4OCAzMzAuOTU5IDI5Ni4yODYgMzMwLjY1OUMyOTQuMDM2IDMzMC42MjMgMjg0LjA5MiAzMzAuNzQyIDI4Mi43MjYgMzMxLjg3OUwyODIuNjI2IDMzMS42OEwyODEuMTM3IDMzMS40NzdDMjc4LjcxMiAzMzEuNTEyIDI3My4zNDUgMzMyLjM3OCAyNzEuMjQ0IDMzMi4zMTVDMjY1LjQ1MiAzMzIuMTQgMjI5LjA5IDMzNS4yNjYgMjI2LjU5NSAzMzEuOTY5QzIyNi42MjggMzMxLjE0OSAyMjYuNzA0IDMzMC44MzIgMjI2LjM4NSAzMzAuMDY3QzIyNS4xODggMzI5LjM0OCAxODcuODMyIDMyNS4wODcgMTgyLjc1MiAzMjQuMzQ0QzE4My4xMzEgMzI1LjEzNiAxODMuMzAzIDMyNS4zODQgMTgzLjQwNSAzMjYuMjczTDE4My4xMzIgMzI2LjUxMkMxODIuMTM1IDMyNi41NSAxODAuODQ3IDMyNi4xODMgMTc5Ljg1IDMyNS45MTRDMTcwLjk0NCAzMjMuNTE0IDE2MS4zODcgMzIzLjQ1MyAxNTIuOCAzMTkuOTk4QzE1MC4wNDYgMzE4Ljg5IDE0Ny4zIDMxNy44MjkgMTQ0LjU1NyAzMTYuNzM2TDE0NC41MjMgMzEyLjk1OUMxNDMuMzUgMzEyLjQxNiAxNDAuODU0IDMxMS4wMjUgMTM5LjcwMSAzMTEuMzUxQzEzOS43NjUgMzEyLjE5MyAxMzkuODMgMzEyLjQ4NSAxMzkuNjM4IDMxMy4zMjZMMTM5LjI3OSAzMTMuMzY0QzEzNy4yOTEgMzEyLjM0MSAxMjQuNjc2IDMwMy45MzUgMTIzLjEwNiAzMDIuNDI0QzExNC41OCAyOTQuMjIxIDEwNy40MDkgMjgzLjEzNiA5OS4wMTcxIDI3NC43WiIvPjxwYXRoIGZpbGw9IiNGRkZFRjQiIGQ9Ik00MDYuNjM3IDI3NS4yOEw0MDYuNzI2IDI3Ni4zODZDNDA2LjM3NCAyNzguMDQgNDA1LjEyNyAyODYuOTgzIDQwNC4zODYgMjg3Ljk4OEMzOTguNzE3IDI5NS4zNiAzOTEuMTU1IDMwMi4xMTIgMzgzLjY5OSAzMDcuNjQ0QzM4Mi4xMTYgMzA4LjgxOSAzNjkuNDY2IDMxNC40OTggMzY3LjgxOSAzMTMuNzQ2QzM2Ny41NzUgMzEwLjQ0NCAzODIuNzY2IDMwNS40MjEgMzg1LjU4MSAzMDIuOTM2QzM4Ny40NjcgMzAxLjcyIDM4OS4zMTIgMjk5Ljc3OSAzOTEuMDk0IDI5OC41MzVDMzk4Ljg4NCAyOTMuMDk3IDQwMS4yMTcgMjgyLjU0OCA0MDYuNjM3IDI3NS4yOFoiLz48L3N2Zz4="

const LIGAS  = ['Selección', 'La Liga', 'Premier League', 'Serie A', 'Bundesliga', 'Ligue 1', 'Liga MX', 'Otro']
const EPOCAS = ['70s', '80s', '90s', '2000s', '2010s', '2020s']

export default function Home() {
  const [playeras, setPlayeras]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [total, setTotal]             = useState(0)
  const [page, setPage]               = useState(0)
  const [menuOpen, setMenuOpen]       = useState(false)
  const [activeFilter, setActive]     = useState({ liga: '', epoca: '', search: '' })
  const [hoveredId, setHoveredId]     = useState(null)
  const [selectedPlayera, setSelectedPlayera] = useState(null)
  const [fotos, setFotos]             = useState([])
  const [fotoIndex, setFotoIndex]     = useState(0)
  const [loadingFotos, setLoadingFotos] = useState(false)
  const [ediciones, setEdiciones]       = useState({})

  const scrollToSection = (section) => {
    setMenuOpen(false)
    setTimeout(() => {
      const el = document.getElementById(section)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 300)
  }

  const fetchPlayeras = useCallback(async () => {
    setLoading(true)
    let q = supabase
      .from('playeras')
      .select('*', { count: 'exact' })
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1)

    if (activeFilter.liga)   q = q.eq('liga', activeFilter.liga)
    if (activeFilter.epoca)  q = q.eq('epoca', activeFilter.epoca)
    if (activeFilter.search) q = q.ilike('nombre_display', `%${activeFilter.search}%`)

    const { data, count } = await q
    setPlayeras(data || [])
    setTotal(count || 0)
    setLoading(false)
  }, [page, activeFilter])

  useEffect(() => { fetchPlayeras() }, [fetchPlayeras])

  useEffect(() => {
    const fetchEdiciones = async () => {
      const { data } = await supabase.from('ediciones_especiales').select('nombre, logo_url')
      if (data) {
        const map = {}
        data.forEach(e => { map[e.nombre] = e.logo_url })
        setEdiciones(map)
      }
    }
    fetchEdiciones()
  }, [])

  const setFilter = (key, val) => {
    setActive(p => ({ ...p, [key]: p[key] === val ? '' : val }))
    setPage(0)
  }

  const openPlayera = async (playera) => {
    setSelectedPlayera(playera)
    setFotoIndex(0)
    setLoadingFotos(true)
    const { data } = await supabase
      .from('playera_fotos')
      .select('url, orden')
      .eq('playera_id', playera.id)
      .order('orden', { ascending: true })
    setFotos(data || [])
    setLoadingFotos(false)
  }

  const closePlayera = () => {
    setSelectedPlayera(null)
    setFotos([])
    setFotoIndex(0)
  }

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

  return (
    <div style={{ background: '#f8f4ee', minHeight: '100vh' }}>

      {/* ── NAV ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: '#f8f4ee', borderBottom: '1px solid #e0d8cc',
        padding: '0 24px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: '60px',
      }}>
        <button onClick={() => setMenuOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <span style={{ display: 'block', width: '22px', height: '1.5px', background: '#1a1a1a' }}/>
          <span style={{ display: 'block', width: '22px', height: '1.5px', background: '#1a1a1a' }}/>
          <span style={{ display: 'block', width: '22px', height: '1.5px', background: '#1a1a1a' }}/>
        </button>
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={LOGO_SVG} alt="Derby 86 logo" style={{ width: '40px', height: '40px', borderRadius: '50%' }}/>
          <div>
            <p style={{ fontFamily: 'Mexcellent, serif', fontSize: '20px', letterSpacing: '2px', color: '#1a1a1a', lineHeight: 1 }}>DERBY 86</p>
            <p style={{ fontSize: '9px', letterSpacing: '3px', color: '#999', textTransform: 'uppercase' }}>Football Jerseys</p>
          </div>
        </div>
      </nav>

      {/* ── MENU DRAWER ── */}
      {menuOpen && (
        <>
          <div onClick={() => setMenuOpen(false)} style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 200,
            animation: 'fadeIn 0.3s ease-out',
          }}/>
          <div style={{
            position: 'fixed', top: 0, left: 0, bottom: 0, width: '300px',
            background: '#f8f4ee', zIndex: 300, padding: '32px',
            display: 'flex', flexDirection: 'column',
            animation: 'slideIn 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
          }}>
            <button onClick={() => setMenuOpen(false)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '20px', alignSelf: 'flex-end', marginBottom: '32px', color: '#1a1a1a',
            }}>✕</button>
            <img src={LOGO_SVG} alt="Derby 86" style={{
              width: '80px', height: '80px', borderRadius: '50%', marginBottom: '24px',
              animation: 'fadeUp 0.4s ease-out 0.1s both',
            }}/>
            {[
                { label: 'Inicio',    id: 'hero' },
                { label: 'Catálogo', id: 'catalogo' },
                { label: 'Contacto', id: 'cta' },
                { label: 'Envíos',   id: 'cta' },
                { label: 'Nosotros', id: 'footer' },
              ].map((item, i) => (
              <p key={item.label} onClick={() => scrollToSection(item.id)} style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: '26px', letterSpacing: '1px', color: '#1a1a1a',
                cursor: 'pointer', padding: '10px 0', borderBottom: '1px solid #e0d8cc',
                animation: `fadeUp 0.4s ease-out ${0.15 + i * 0.08}s both`,
              }}>{item.label}</p>
            ))}
            <div style={{
              marginTop: 'auto', display: 'flex', gap: '20px',
              animation: 'popUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.65s both',
            }}>
              <a href="https://instagram.com/derby.86" target="_blank" rel="noopener noreferrer"
                style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: 'linear-gradient(45deg, #474747, #d4c1ba, #1e1e1e, #413e3f, #050505)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <span style={{ fontSize: '10px', letterSpacing: '1px', color: '#888', textTransform: 'uppercase' }}>Instagram</span>
              </a>
              <a href="https://wa.me/521XXXXXXXXXX" target="_blank" rel="noopener noreferrer"
                style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px', background: '#000000',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <span style={{ fontSize: '10px', letterSpacing: '1px', color: '#888', textTransform: 'uppercase' }}>WhatsApp</span>
              </a>
            </div>
          </div>
        </>
      )}

      {/* ── HERO ── */}
      <section id="hero" style={{ padding: '48px 24px 32px', borderBottom: '1px solid #e0d8cc' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', letterSpacing: '4px', color: '#888', textTransform: 'uppercase', marginBottom: '12px' }}>
            Monterrey · Envíos a todo México
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
            <h1 style={{ fontFamily: 'Mexcellent, serif', fontSize: 'clamp(36px, 7vw, 72px)', color: '#1a1a1a', letterSpacing: '2px', lineHeight: 1 }}>
              PLAYERAS DE FÚTBOL RETRO
            </h1>
            <p style={{ fontSize: '14px', color: '#888', maxWidth: '280px', lineHeight: 1.6, fontFamily: 'Barlow Condensed' }}>
              Somos aficionados del fútbol. Selecciones, clubes y ediciones especiales de todo el mundo.
            </p>
          </div>
        </div>
      </section>

      {/* ── CATEGORÍAS ── */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '1px solid #e0d8cc' }}>
        {[
          { foto: 'https://eebsggdfdhykoexfszvs.supabase.co/storage/v1/object/public/imagenes/left-photo-2.JPG', filtroKey: 'epoca', filtroVal: '90s' },
          { foto: 'https://eebsggdfdhykoexfszvs.supabase.co/storage/v1/object/public/imagenes/background-photo.JPG', filtroKey: 'liga', filtroVal: 'Selección' },
          { foto: 'https://eebsggdfdhykoexfszvs.supabase.co/storage/v1/object/public/imagenes/quad-photo.JPG', filtroKey: 'liga', filtroVal: 'La Liga' },
        ].map((cat, i) => (
          <div key={i} onClick={() => setFilter(cat.filtroKey, cat.filtroVal)}
            style={{
              cursor: 'pointer', position: 'relative', overflow: 'hidden',
              borderRight: i < 2 ? '1px solid #e0d8cc' : 'none', minHeight: '260px',
            }}>
            <img src={cat.foto} alt="" style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', transition: 'transform 0.4s',
            }}
              onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.target.style.transform = 'scale(1)'}
            />
          </div>
        ))}
      </section>

      {/* ── FILTROS ── */}
      <div id="catalogo" style={{
        position: 'sticky', top: '60px', zIndex: 90,
        background: '#f8f4ee', borderBottom: '1px solid #e0d8cc', padding: '10px 24px',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '6px', alignItems: 'center', overflowX: 'auto' }}>
          <input type="text" placeholder="Buscar..." value={activeFilter.search}
            onChange={e => { setActive(p => ({ ...p, search: e.target.value })); setPage(0) }}
            style={{ border: '1px solid #ccc', borderRadius: '2px', padding: '5px 10px', fontSize: '12px', background: 'transparent', color: '#1a1a1a', outline: 'none', width: '140px', flexShrink: 0 }}
          />
          <div style={{ width: '1px', height: '18px', background: '#ddd', flexShrink: 0 }}/>
          {LIGAS.map(l => (
            <button key={l} onClick={() => setFilter('liga', l)} style={{
              background: activeFilter.liga === l ? '#1a1a1a' : 'transparent',
              color: activeFilter.liga === l ? '#f8f4ee' : '#888',
              border: `1px solid ${activeFilter.liga === l ? '#1a1a1a' : '#ddd'}`,
              borderRadius: '2px', padding: '4px 10px', fontSize: '11px',
              letterSpacing: '1px', cursor: 'pointer', whiteSpace: 'nowrap',
              textTransform: 'uppercase', flexShrink: 0,
            }}>{l}</button>
          ))}
          <div style={{ width: '1px', height: '18px', background: '#ddd', flexShrink: 0 }}/>
          {EPOCAS.map(e => (
            <button key={e} onClick={() => setFilter('epoca', e)} style={{
              background: activeFilter.epoca === e ? '#1a1a1a' : 'transparent',
              color: activeFilter.epoca === e ? '#f8f4ee' : '#888',
              border: `1px solid ${activeFilter.epoca === e ? '#1a1a1a' : '#ddd'}`,
              borderRadius: '2px', padding: '4px 10px', fontSize: '11px',
              letterSpacing: '1px', cursor: 'pointer', whiteSpace: 'nowrap',
              textTransform: 'uppercase', flexShrink: 0,
            }}>{e}</button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#aaa', letterSpacing: '1px', flexShrink: 0 }}>{total} jerseys</span>
        </div>
      </div>

      {/* ── GRID ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#aaa', fontSize: '12px', letterSpacing: '3px' }}>Cargando...</div>
        ) : playeras.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#aaa', fontSize: '12px', letterSpacing: '3px' }}>Sin resultados</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1px' }}>
            {playeras.map(p => {
              const nombre = p.nombre_display || 'Playera retro'
              const imagen = p.foto_portada || null
              const hov = hoveredId === p.id
              return (
                <div key={p.id}
                  onMouseEnter={() => setHoveredId(p.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => openPlayera(p)}
                  style={{ background: '#f8f4ee', position: 'relative', overflow: 'hidden', cursor: 'pointer', boxShadow: '1px 0 0 #e0d8cc, 0 1px 0 #e0d8cc' }}>
                  <div style={{ aspectRatio: '1', overflow: 'hidden', background: '#ede8df' }}>
                    {imagen ? (
                      <img src={imagen} alt={nombre}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s', transform: hov ? 'scale(1.06)' : 'scale(1)' }}
                        onError={e => { e.target.style.display = 'none' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>🎽</div>
                    )}
                  </div>
                  <div style={{ padding: '14px 14px 18px', borderTop: '1px solid #e0d8cc' }}>
                    <p style={{ fontSize: '10px', letterSpacing: '2px', color: '#aaa', textTransform: 'uppercase', marginBottom: '5px' }}>
                      {p.liga || 'Jersey'}{p.anio ? ` · ${p.anio}` : ''}
                    </p>
                    <p style={{ fontFamily: 'Barlow Condensed', fontSize: '16px', color: '#1a1a1a', fontWeight: 600, lineHeight: 1.2, margin: 0 }}>
                      {nombre}
                    </p>
                    {p.edicion_especial && ediciones[p.edicion_especial] && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', padding: '4px 8px', background: '#f0ece4', borderRadius: '4px', width: 'fit-content' }}>
                        <img src={ediciones[p.edicion_especial]} alt={p.edicion_especial} style={{ height: '16px', width: 'auto', objectFit: 'contain' }} />
                        <span style={{ fontSize: '9px', letterSpacing: '1.5px', color: '#888', textTransform: 'uppercase' }}>{p.edicion_especial}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '48px' }}>
            <button onClick={() => setPage(p => Math.max(0, p-1))} disabled={page === 0}
              style={{ background: 'none', border: '1px solid #ccc', padding: '10px 24px', fontSize: '11px', letterSpacing: '2px', cursor: page === 0 ? 'not-allowed' : 'pointer', color: page === 0 ? '#ccc' : '#1a1a1a', textTransform: 'uppercase' }}>
              ← Anterior
            </button>
            <span style={{ display: 'flex', alignItems: 'center', fontSize: '11px', letterSpacing: '2px', color: '#aaa' }}>
              {page+1} / {totalPages}
            </span>
            <button onClick={() => setPage(p => Math.min(totalPages-1, p+1))} disabled={page === totalPages-1}
              style={{ background: page === totalPages-1 ? '#eee' : '#1a1a1a', border: '1px solid #1a1a1a', padding: '10px 24px', fontSize: '11px', letterSpacing: '2px', cursor: page === totalPages-1 ? 'not-allowed' : 'pointer', color: page === totalPages-1 ? '#aaa' : '#f8f4ee', textTransform: 'uppercase' }}>
              Siguiente →
            </button>
          </div>
        )}
      </section>

      {/* ── CTA ── */}
      <section id="cta" style={{ background: '#1a1a1a', padding: '48px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <p style={{ fontFamily: 'Mexcellent, serif', fontSize: 'clamp(20px, 4vw, 36px)', color: '#f8f4ee', letterSpacing: '2px', marginBottom: '8px' }}>¿BUSCAS UNA ESPECIAL?</p>
          <p style={{ fontSize: '13px', color: '#666', letterSpacing: '1px' }}>Escríbenos y la conseguimos · @derby.86</p>
        </div>
        <a href="https://wa.me/521XXXXXXXXXX" target="_blank" rel="noopener noreferrer"
          style={{ background: '#25D366', color: 'white', padding: '14px 28px', borderRadius: '2px', fontSize: '12px', letterSpacing: '2px', textDecoration: 'none', textTransform: 'uppercase' }}>
          WhatsApp →
        </a>
      </section>

      {/* ── FOOTER ── */}
      <footer id="footer" style={{ padding: '24px', borderTop: '1px solid #e0d8cc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <p style={{ fontFamily: 'Mexcellent, serif', fontSize: '14px', letterSpacing: '2px', color: '#aaa' }}>DERBY 86</p>
        <p style={{ fontSize: '11px', letterSpacing: '1px', color: '#ccc' }}>Monterrey, NL · Envíos a todo México · @derby.86</p>
      </footer>

      {/* ── POPUP GLASSMORPHISM ── */}
      {selectedPlayera && (
        <>
          {/* Backdrop blur */}
          <div onClick={closePlayera} style={{
            position: 'fixed', inset: 0, zIndex: 500,
            backdropFilter: 'blur(28px) saturate(1.2)',
            WebkitBackdropFilter: 'blur(28px) saturate(1.2)',
            background: 'rgba(180, 170, 160, 0.25)',
            animation: 'fadeIn 0.25s ease-out',
          }}/>

          {/* Burbuja mirror */}
          <div style={{
            position: 'fixed', inset: 0, zIndex: 501,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.22)',
              backdropFilter: 'blur(60px) saturate(2.2) brightness(1.35)',
              WebkitBackdropFilter: 'blur(60px) saturate(2.2) brightness(1.35)',
              border: '1.5px solid rgba(255, 255, 255, 0.65)',
              borderRadius: '28px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10), inset 0 1.5px 0 rgba(255,255,255,0.85), inset 0 -1px 0 rgba(255,255,255,0.3), inset 1px 0 0 rgba(255,255,255,0.5)',
              outline: '1px solid rgba(255,255,255,0.18)',
              width: '100%', maxWidth: '1100px',
              maxHeight: '92vh', overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
              animation: 'popUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}>

              {/* Header */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '20px 24px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.35)',
              }}>
                <div>
                  <p style={{ fontSize: '10px', letterSpacing: '3px', color: 'rgba(30,20,10,0.55)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    {selectedPlayera.liga || 'Jersey'}{selectedPlayera.anio ? ` · ${selectedPlayera.anio}` : ''}
                  </p>
                  <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '26px', fontWeight: 700, color: 'rgba(15,10,5,0.9)', letterSpacing: '0.5px', lineHeight: 1.1 }}>
                    {selectedPlayera.nombre_display || 'Playera retro'}
                  </p>
                </div>
                <button onClick={closePlayera} style={{
                  background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.75)',
                  borderRadius: '50%', width: '36px', height: '36px',
                  color: 'rgba(20,15,10,0.8)', fontSize: '16px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>✕</button>
              </div>

              {/* Contenido */}
              <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>

                {/* Slideshow */}
                <div style={{ flex: '0 0 62%', position: 'relative', background: 'rgba(255,255,255,0.15)', minHeight: '480px' }}>
                  {loadingFotos ? (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(20,15,10,0.4)', fontSize: '11px', letterSpacing: '3px' }}>
                      CARGANDO...
                    </div>
                  ) : fotos.length > 0 ? (
                    <>
                      <img
                        key={fotoIndex}
                        src={fotos[fotoIndex]?.url}
                        alt={`Foto ${fotoIndex + 1}`}
                        style={{
                          width: '100%', height: '100%', objectFit: 'contain',
                          animation: 'fadeIn 0.2s ease-out',
                        }}
                      />
                      {fotos.length > 1 && (
                        <>
                          <button onClick={() => setFotoIndex(i => (i - 1 + fotos.length) % fotos.length)} style={{
                            position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                            background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.8)',
                            borderRadius: '50%', width: '38px', height: '38px', color: 'rgba(20,15,10,0.8)',
                            fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>‹</button>
                          <button onClick={() => setFotoIndex(i => (i + 1) % fotos.length)} style={{
                            position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                            background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.8)',
                            borderRadius: '50%', width: '38px', height: '38px', color: 'rgba(20,15,10,0.8)',
                            fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>›</button>
                          <div style={{ position: 'absolute', bottom: '14px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
                            {fotos.map((_, i) => (
                              <div key={i} onClick={() => setFotoIndex(i)} style={{
                                width: i === fotoIndex ? '20px' : '6px', height: '6px',
                                borderRadius: '3px', cursor: 'pointer', transition: 'all 0.25s',
                                background: i === fotoIndex ? 'rgba(20,15,10,0.7)' : 'rgba(255,255,255,0.6)',
                              }}/>
                            ))}
                          </div>
                        </>
                      )}
                      <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,255,255,0.55)', borderRadius: '12px', padding: '3px 10px', fontSize: '10px', color: 'rgba(20,15,10,0.7)', letterSpacing: '1px', backdropFilter: 'blur(8px)' }}>
                        {fotoIndex + 1} / {fotos.length}
                      </div>
                    </>
                  ) : selectedPlayera.foto_portada ? (
                    <img src={selectedPlayera.foto_portada} alt={selectedPlayera.nombre_display}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px' }}>🎽</div>
                  )}
                </div>

                {/* Info lateral */}
                <div style={{
                  flex: 1, padding: '24px', overflowY: 'auto',
                  borderLeft: '1px solid rgba(255,255,255,0.4)',
                  display: 'flex', flexDirection: 'column', gap: '20px',
                }}>
                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {[selectedPlayera.equipo, selectedPlayera.liga, selectedPlayera.epoca, selectedPlayera.tipo].filter(Boolean).map((tag, i) => (
                      <span key={i} style={{
                        background: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.7)',
                        borderRadius: '4px', padding: '3px 10px',
                        fontSize: '10px', letterSpacing: '2px', color: 'rgba(20,15,10,0.75)',
                        textTransform: 'uppercase',
                      }}>{tag}</span>
                    ))}
                  </div>

                  {/* Badge edición especial */}
                  {selectedPlayera.edicion_especial && ediciones[selectedPlayera.edicion_especial] && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '10px', width: 'fit-content' }}>
                      <img src={ediciones[selectedPlayera.edicion_especial]} alt={selectedPlayera.edicion_especial} style={{ height: '28px', width: 'auto', objectFit: 'contain' }} />
                      <span style={{ fontSize: '11px', letterSpacing: '2px', color: 'rgba(20,15,10,0.7)', textTransform: 'uppercase', fontWeight: 600 }}>{selectedPlayera.edicion_especial}</span>
                    </div>
                  )}

                  {/* Precio */}
                  {selectedPlayera.precio_proveedor && (
                    <div>
                      <p style={{ fontSize: '10px', letterSpacing: '2px', color: 'rgba(20,15,10,0.45)', textTransform: 'uppercase', marginBottom: '4px' }}>Precio</p>
                      <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '32px', fontWeight: 700, color: 'rgba(15,10,5,0.9)', lineHeight: 1 }}>
                        ${selectedPlayera.precio_proveedor} <span style={{ fontSize: '14px', color: 'rgba(20,15,10,0.4)' }}>MXN</span>
                      </p>
                    </div>
                  )}

                  {/* Descripción */}
                  {selectedPlayera.descripcion && (
                    <div>
                      <p style={{ fontSize: '10px', letterSpacing: '2px', color: 'rgba(20,15,10,0.45)', textTransform: 'uppercase', marginBottom: '6px' }}>Descripción</p>
                      <p style={{ fontSize: '13px', color: 'rgba(20,15,10,0.7)', lineHeight: 1.7 }}>
                        {selectedPlayera.descripcion}
                      </p>
                    </div>
                  )}

                  {/* Thumbnails galería */}
                  {fotos.length > 1 && (
                    <div>
                      <p style={{ fontSize: '10px', letterSpacing: '2px', color: 'rgba(20,15,10,0.45)', textTransform: 'uppercase', marginBottom: '8px' }}>Galería</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {fotos.map((f, i) => (
                          <img key={i} src={f.url} alt={`Foto ${i+1}`}
                            onClick={() => setFotoIndex(i)}
                            style={{
                              width: '52px', height: '52px', objectFit: 'cover',
                              borderRadius: '8px', cursor: 'pointer',
                              border: i === fotoIndex ? '2px solid rgba(255,255,255,0.9)' : '2px solid rgba(255,255,255,0.15)',
                              opacity: i === fotoIndex ? 1 : 0.6,
                              transition: 'all 0.2s',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* WhatsApp */}
                  <div style={{ marginTop: 'auto' }}>
                    <a
                      href={`https://wa.me/521XXXXXXXXXX?text=Hola! Me interesa esta playera: ${encodeURIComponent(selectedPlayera.nombre_display || 'Playera retro')}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        background: '#25D366', color: 'white', padding: '14px 20px',
                        borderRadius: '12px', fontSize: '13px', letterSpacing: '1px',
                        textDecoration: 'none', fontWeight: 600, textTransform: 'uppercase',
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Pedir por WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  )
}
