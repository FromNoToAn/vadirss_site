import { useState, useRef, useEffect } from 'react';
import { img } from '../assets';

const NAV = [
  { href: '#steps-2', label: 'О сервисе' },
  { href: '#tariffs-card', label: 'Тарифы' },
  { href: '#reviews', label: 'Отзывы' },
  { href: '#footer-customer', label: 'Контакты' },
];

export function MainHero() {
  const [open, setOpen] = useState(false);
  const [titleInView, setTitleInView] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bg = img('2b856b08-2e27-4d66-9453-65f4af4625ff-15595602.png');

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setTitleInView(e.isIntersecting),
      { threshold: 0.2, rootMargin: '0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section data-type="main" id="main-2" className="s-main-type-11 sb-block sb-block_fullscreen sb-text-white sb-align-center">
      <div className="sb-background-image sb-background" style={{ backgroundImage: `url(${bg})` }}>
        <div className="sb-background-overlay" style={{ opacity: 0.5 }} />
      </div>
      <div className="sb-container s-main-type-11__container">
        <div className="s-main-type-11__navigation">
          <div className={`sb-header-default sb-text-white ${open ? 'sb-header-default_active' : ''}`}>
            <div className="sb-container">
              <div className="sb-header-default__wrapper sb-header-default__wrapper_right-align-links">
                <button type="button" className={`sb-header-default__burger sb-header-default__mark-links ${open ? 'sb-header-default__burger_open' : ''}`} onClick={() => setOpen(!open)} aria-label="Меню">
                  <span className="sb-header-default__burger-line" />
                </button>
                <h5 className="sb-header-default__logo sb-font-h5 sb-font-title">sport.vadirss.ru</h5>
                <nav className={`sb-header-default__menu sb-header-default__menu_solid ${open ? 'sb-header-default__menu_open' : ''}`}>
                  <div className="sb-background" />
                  <ul className="sb-header-default__link-wrapper">
                    {NAV.map(({ href, label }) => (
                      <li key={href} className="sb-header-default__link-item sb-submenu-link">
                        <a href={href} className="sb-header-default__link sb-header-default__link_menu-color-inherit sb-font-p3" onClick={() => setOpen(false)}>{label}</a>
                      </li>
                    ))}
                  </ul>
                  <a href="#advantages-blocks-2" className="sb-header-default__button sb-button-type_inherit-color sb-button-secondary sb-button-type_bordered" style={{ borderColor: 'rgba(255,255,255,0.56)' }} onClick={() => setOpen(false)}>3 шага к подключению</a>
                </nav>
                <a href="#advantages-blocks-2" className="sb-header-default__button sb-header-default__button_tablet-visible sb-button-secondary sb-button-type_bordered" style={{ borderColor: 'rgba(255,255,255,0.56)' }}>3 шага к подключению</a>
              </div>
            </div>
          </div>
        </div>
        <div className="sb-row s-main-type-11__row sb-m-clear-bottom">
          <div className="sb-col_lg-6 sb-col_md-8 sb-col_sm-12 sb-col_xs-12 sb-col-offset_lg-3 sb-col-offset_md-2">
            <h2 ref={titleRef} className={`hero-title sb-align-center sb-font-h2 sb-font-title sb-m-12-bottom ${titleInView ? 'hero-title_in-view' : ''}`}><b>Цифровой сервис для вашей команды</b></h2>
            <div className="sb-m-7-bottom sb-font-p3">Аналитика, мотивация, сплочённость — всё в одном боте.<br />Подключитесь за 5 минут.</div>
            <div className="s-main-type-11__buttons sb-m-19-top-minus">
              <a href="#advantages-blocks-2" className="s-main-type-11__button sb-button-primary sb-m-19-top sb-button-scheme-dark" style={{ backgroundColor: '#FFFFFF' }}>Подключить бесплатно</a>
              <a href="#steps-2" className="s-main-type-11__button sb-button-secondary sb-m-19-top sb-button-type_bordered" style={{ borderColor: 'rgba(255,255,255,0.56)' }}>Подробнее о сервисе</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
