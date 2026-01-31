import { useState, useRef, useEffect } from 'react';
import type { TariffForModal } from './SubscribeModal';
import { SubscribeModal } from './SubscribeModal';

const CTA = 'Оформить';

function formatPrice(kopecks: number): string {
  const rub = Math.round(kopecks / 100);
  return rub.toLocaleString('ru-RU') + ' ₽';
}

type SubscriptionApi = {
  id: string;
  level: string;
  title: string;
  description: string;
  badge: string | null;
  price_kopecks: number;
  price_discount_kopecks: number;
  accent_color: string;
  sort_order: number;
  features: string[];
  accent_icons: string[];
  tooltips: string[];
};

type Card = {
  id: string;
  level: 'BASE' | 'EXTENDED' | 'PREMIUM';
  border: string;
  title: string;
  strike: string;
  price: string;
  desc: string;
  features: string[];
  accentIcons: string[];
  badge?: string;
  cta: string;
  tooltips: string[];
};

function mapApiToCard(s: SubscriptionApi): Card {
  const icons = s.accent_icons?.length ? s.accent_icons : [s.accent_color];
  return {
    id: s.id,
    level: s.level as 'BASE' | 'EXTENDED' | 'PREMIUM',
    border: s.accent_color,
    title: s.title,
    strike: formatPrice(s.price_kopecks),
    price: formatPrice(s.price_discount_kopecks),
    desc: s.description || '',
    features: s.features || [],
    accentIcons: icons,
    badge: s.badge || undefined,
    cta: CTA,
    tooltips: s.tooltips || [],
  };
}

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23ZM18.2 8.88424L10.9383 16.146L6.2 11.4084C7.04556 10.5628 8.41664 10.5626 9.2623 11.408L10.9383 13.0836L15.1377 8.88424C15.9833 8.03861 17.3544 8.03861 18.2 8.88424Z" />
  </svg>
);

function badgeBg(id: string): string {
  if (id === 'extended') return 'rgba(133, 213, 62, 1)';
  if (id === 'premium') return 'rgba(51, 137, 149, 1)';
  return 'rgba(255,255,255,0.2)';
}

export function Tariffs() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [modalTariff, setModalTariff] = useState<TariffForModal | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const isFirstMount = useRef(true);
  const count = cards.length;

  useEffect(() => {
    let ok = true;
    fetch('/api/subscriptions')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: SubscriptionApi[]) => {
        if (!ok) return;
        setCards(data.map(mapApiToCard));
        setError(null);
      })
      .catch((e) => {
        if (!ok) return;
        setError(e instanceof Error ? e.message : 'Не удалось загрузить тарифы');
        setCards([]);
      })
      .finally(() => {
        if (ok) setLoading(false);
      });
    return () => { ok = false; };
  }, []);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    const container = listRef.current;
    if (!container) return;
    const card = container.querySelector(`[data-tariff-index="${index}"]`) as HTMLElement;
    if (!card) return;
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (maxScroll <= 0) return;
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const containerCenter = container.clientWidth / 2;
    const target = Math.max(0, Math.min(maxScroll, cardCenter - containerCenter));
    container.scrollTo({ left: target, behavior: 'smooth' });
  }, [index, cards.length]);

  const go = (delta: number) => setIndex((i) => Math.max(0, Math.min(count - 1, i + delta)));

  return (
    <section data-type="tariffs-card" id="tariffs-card" className="s-tariffs-card-type-1 sb-text-white sb-padding-top_l sb-padding-bottom_l">
      <div className="sb-background" style={{ background: '#111111' }} />
      <div className="sb-container sb-m-clear-bottom">
        <div className="sb-row s-tariffs-card-type-1">
          <h2 className="sb-col_lg-10 sb-col_md-12 sb-col_sm-12 sb-col_xs-12 s-tariffs-card-type-1__title sb-font-h2 sb-font-title sb-m-16-bottom">Тарифы</h2>
          <div className="sb-col_lg-10 sb-col_md-12 sb-col_sm-12 sb-col_xs-12 s-tariffs-card-type-1__description sb-font-p2 sb-text-opacity">vadirss.ru — доступно каждому</div>
        </div>
        <div className="s-tariffs-card-type-1 s-tariffs-card-type-1-containers">
          <div className="s-tariffs-card-type-1__arrow s-tariffs-card-type-1__arrow_previous pointer-events-auto">
            <button type="button" className="button-arrow button-arrow_previous" aria-label="Назад" onClick={() => go(-1)} disabled={count <= 1}>
              <svg viewBox="0 0 12 13" className="button-arrow-icon" width={12} height={13} fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M2.58225 6.20351C2.3685 6.41726 2.25 6.69851 2.25 6.99851C2.25 7.30076 2.3685 7.58351 2.58225 7.79501L7.707 12.7803C8.00325 13.0728 8.48175 13.0728 8.778 12.7803C9.07425 12.4878 9.07425 12.0123 8.778 11.7205L3.921 6.99851L8.778 2.27801C9.07425 1.98551 9.07425 1.51001 8.778 1.21676C8.48175 0.924258 8.00325 0.924259 7.707 1.21826L2.58225 6.20276V6.20351Z" fill="currentColor" />
              </svg>
            </button>
          </div>
          <div className="s-tariffs-card-type-1__arrow s-tariffs-card-type-1__arrow_next pointer-events-auto">
            <button type="button" className="button-arrow button-arrow_next" aria-label="Вперёд" onClick={() => go(1)} disabled={count <= 1}>
              <svg viewBox="0 0 12 13" className="button-arrow-icon" width={12} height={13} fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M2.58225 6.20351C2.3685 6.41726 2.25 6.69851 2.25 6.99851C2.25 7.30076 2.3685 7.58351 2.58225 7.79501L7.707 12.7803C8.00325 13.0728 8.48175 13.0728 8.778 12.7803C9.07425 12.4878 9.07425 12.0123 8.778 11.7205L3.921 6.99851L8.778 2.27801C9.07425 1.98551 9.07425 1.51001 8.778 1.21676C8.48175 0.924258 8.00325 0.924259 7.707 1.21826L2.58225 6.20276V6.20351Z" fill="currentColor" />
              </svg>
            </button>
          </div>
          <div ref={listRef} className="s-tariffs-card-type-1__cards-container sb-m-3-top js-list-wrapper">
            {loading && <p className="sb-text-opacity">Загрузка тарифов…</p>}
            {error && <p className="sb-text-opacity" style={{ color: '#e57373' }}>{error}</p>}
            {!loading && !error && cards.map((c, i) => (
              <div key={c.id} data-tariff-index={i} className="s-tariffs-card-type-1__item js-slide">
                <div className="s-tariffs-card-type-1__card s-tariffs-card-type-1__card-background__overflow s-tariffs-card-type-1__card-rounded-borders s-tariffs-card-type-1__card-border sb-m-clear-top sb-m-clear-bottom sb-text-dark" style={{ ['--card-border-color' as string]: c.border }}>
                  <div className="sb-background s-tariffs-card-type-1__card-rounded-inner-borders" style={{ background: '#111111' }} />
                  <div className="s-tariffs-card-type-1__card-container sb-text">
                    {c.badge && (
                      <div className="s-tariffs-card-type-1__card-title-special-container">
                        <div className="s-tariffs-card-type-1__card-special-container sb-text-white" style={{ ['--card-special-background' as string]: badgeBg(c.id) }}>
                          <div className="s-tariffs-card-type-1__row-icon s-tariffs-card-type-1__card-special-icon" style={{ color: 'white' }}><CheckIcon /></div>
                          <p className="s-tariffs-card-type-1__card-special sb-font-p3 sb-text-editor sb-text-opacity"><span style={{ color: '#ffffff' }}>{c.badge}</span></p>
                        </div>
                      </div>
                    )}
                    <div className="s-tariffs-card-type-1__item-container sb-text-white">
                      <div className="s-tariffs-card-type-1__card-content s-tariffs-card-type-1__card-background__overflow s-tariffs-card-type-1__card-overflow s-tariffs-card-type-1__card-rounded-border sb-m-clear-bottom sb-m-5-bottom s-tariffs-card-type-1__card-content-margin-bottom">
                        <div className="s-tariffs-card-type-1__card-main-content sb-m-clear-bottom sb-m-5-bottom">
                          <div className="sb-col_lg-10 sb-col_md-12 sb-col_sm-12 sb-col_xs-12 s-tariffs-card-type-1__card-header-title s-tariffs-card-type-1__no-paddings sb-font-p2 sb-text-opacity s-tariffs-card-type-1__width-auto">{c.title}</div>
                          <div className="s-tariffs-card-type-1__card-header-price-per-time s-tariffs-card-type-1__card-header-price-per-time_margin-top sb-m-5-bottom">
                            <h3 className="sb-col_lg-10 sb-col_md-12 sb-col_sm-12 sb-col_xs-12 s-tariffs-card-type-1__card-header-price s-tariffs-card-type-1__no-paddings sb-font-h3 sb-font-title s-tariffs-card-type-1__width-auto">
                              <s>{c.strike}</s><br />{c.price}
                            </h3>
                            <span className="s-tariffs-card-type-1__card-header-per-time sb-font-p3 sb-text-opacity">в месяц за футболиста</span>
                          </div>
                          <span className="sb-col_lg-10 sb-col_md-12 sb-col_sm-12 sb-col_xs-12 s-tariffs-card-type-1__card-header-description s-tariffs-card-type-1__no-paddings sb-font-p3 sb-text-opacity">{c.desc}</span>
                        </div>
                        <div className="s-tariffs-card-type-1__card-rows sb-m-16-bottom">
                          {c.features.map((f, j) => (
                            <div key={j} className="s-tariffs-card-type__1-no-padding">
                              <div className="s-tariffs-card-type-1__row sb-text-white">
                                <div className="s-tariffs-card-type-1__row-items sb-m-clear-top sb-m-clear-bottom">
                                  <div className="s-tariffs-card-type-1__row-icon" style={{ color: c.accentIcons[j] ?? c.accentIcons[0] }}><CheckIcon /></div>
                                  <span className="sb-col_lg-10 sb-col_md-12 sb-col_sm-12 sb-col_xs-12 s-tariffs-card-type-1__row-title s-tariffs-card-type-1__no-paddings s-tariffs-card-type-1__width-auto sb-font-p3">{f}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="sb-text-white">
                          <button type="button" className="s-tariffs-card-type-1__card-button sb-button-secondary sb-m-24-top sb-button-type_bordered" style={{ borderColor: c.border }} onClick={() => setModalTariff({ id: c.id, title: c.title, border: c.border, level: c.level })}>
                            {c.cta}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {!loading && !error && count > 0 && (
            <div className="s-tariffs-card-type-1__dots sb-dots">
              <ul className="sb-dots__dots-wrapper">
                {cards.map((_, i) => (
                  <li key={i}>
                    <button type="button" className={i === index ? 'active' : ''} onClick={() => setIndex(i)} aria-label={`Тариф ${i + 1}`} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <SubscribeModal open={!!modalTariff} onClose={() => setModalTariff(null)} tariff={modalTariff} />
    </section>
  );
}
