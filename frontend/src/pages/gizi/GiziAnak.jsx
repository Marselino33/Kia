import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Clock3 } from "lucide-react";
import { contentService } from "../../api/contentService";
import "../../styles/pages/gizi-gizi-anak.css";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=960&q=80";

export default function GiziAnak() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const list = await contentService.getGiziAnak();
        setItems(Array.isArray(list) ? list : []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const cards = useMemo(() => {
    return items.map((item) => ({
      id: item.id,
      title: item.judul || "Artikel Gizi Anak",
      subtitle: item.ringkasan || "Artikel gizi anak dari bidan KIA.",
      duration: `${item.read_minutes || 5} Menit`,
      image: item.gambar_url || DEFAULT_IMAGE,
      badge: item.kategori || "",
      slug: item.slug,
    }));
  }, [items]);

  return (
    <section className="gizi-anak-page">
      <div className="gizi-anak-container">
        <div className="gizi-anak-breadcrumb">
          <span
            onClick={() => navigate("/beranda")}
            className="gizi-anak-breadcrumb-link"
          >
            Beranda
          </span>
          <span className="gizi-anak-breadcrumb-sep">›</span>
          <span className="gizi-anak-breadcrumb-parent">Gizi</span>
          <span className="gizi-anak-breadcrumb-sep">›</span>
          <span className="gizi-anak-breadcrumb-current">Gizi Anak</span>
        </div>

        <div className="gizi-anak-head">
          <h1 className="gizi-anak-title">Panduan Gizi Anak</h1>
          <p className="gizi-anak-subtitle">
            Artikel gizi anak terbaru dari bidan dan tim KIA.
          </p>
          <p className="gizi-anak-subtitle">
            Temukan panduan harian untuk tumbuh kembang optimal.
          </p>
        </div>

        {loading ? (
          <p className="gizi-anak-subtitle">Memuat artikel...</p>
        ) : null}

        {!loading && cards.length === 0 ? (
          <p className="gizi-anak-subtitle">
            Belum ada artikel gizi anak yang dipublikasikan.
          </p>
        ) : null}

        <div className="gizi-anak-grid">
          {cards.map((item) => {
            return (
              <article
                key={item.id}
                className="gizi-anak-card"
                onClick={() => navigate(`/gizi/${item.slug}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && navigate(`/gizi/${item.slug}`)
                }
              >
                <div className="gizi-anak-card-image-wrap">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="gizi-anak-card-image"
                  />
                </div>

                <div className="gizi-anak-card-content">
                  <div className="gizi-anak-card-meta">
                    {item.badge && (
                      <span className="gizi-anak-card-badge">{item.badge}</span>
                    )}
                    <span className="gizi-anak-card-time">
                      <Clock3 size={12} /> {item.duration}
                    </span>
                  </div>
                  <h3 className="gizi-anak-card-heading">{item.title}</h3>
                  <p className="gizi-anak-card-content-text">{item.subtitle}</p>
                  <button className="gizi-anak-read-btn" type="button">
                    Baca Artikel <ChevronRight size={14} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
