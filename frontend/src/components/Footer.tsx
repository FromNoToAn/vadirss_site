import { img } from '../assets';

const NAV = [
  { href: '#main-2', label: 'Главная' },
  { href: '#steps-2', label: 'О сервисе' },
  { href: '#reviews', label: 'Отзывы' },
  { href: '#faq-2', label: 'Вопросы' },
  { href: '#tariffs-card', label: 'Тарифы' },
];

const BASE_DOCS = 'https://90f1661d-2ff4-4f29-b07c-0e47453ca691.selstorage.ru/site1121363';

const DOCS: { href: string; label: string; download: string }[] = [
  { href: `${BASE_DOCS}/ПОЛИТИКА%20КОНФИДЕНЦИАЛЬНОСТИ.pdf`, label: 'Политика конфиденциальности', download: 'ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ.pdf' },
  { href: `${BASE_DOCS}/СОГЛАСИЕ%20НА%20ОБРАБОТКУ%20ПЕРСОНАЛЬНЫХ%20ДАННЫХ.pdf`, label: 'Согласие на обработку персональных данных', download: 'СОГЛАСИЕ НА ОБРАБОТКУ ПЕРСОНАЛЬНЫХ ДАННЫХ.pdf' },
  { href: `${BASE_DOCS}/Биометрия.%20СОГЛАСИЕ%20НА%20ОБРАБОТКУ%20ПЕРСОНАЛЬНЫХ%20ДАННЫХ.pdf`, label: 'Согласие на использование биометрии', download: 'Биометрия. СОГЛАСИЕ НА ОБРАБОТКУ ПЕРСОНАЛЬНЫХ ДАННЫХ.pdf' },
  { href: `${BASE_DOCS}/СОГЛАСИЕ%20НА%20ОБРАБОТКУ%20ПЕРСОНАЛЬНЫХ%20ДАННЫХ%20ДЛЯ%20РЕКЛАМНЫХ%20И%20МАРКЕТИНГОВЫХ%20КОММУНИКАЦИЙ.pdf`, label: 'Реклама. Согласие на обработку персональных данных', download: 'СОГЛАСИЕ НА ОБРАБОТКУ ПЕРСОНАЛЬНЫХ ДАННЫХ ДЛЯ РЕКЛАМНЫХ И МАРКЕТИНГОВЫХ КОММУНИКАЦИЙ.pdf' },
  { href: `${BASE_DOCS}/Договор%20публичной%20оферты%20об%20оказании%20услуг.pdf`, label: 'Оферта', download: 'Договор публичной оферты об оказании услуг.pdf' },
];

export function Footer() {
  return (
    <section data-type="footer-customer" id="footer-customer" className="s-footer-customer-type-5 sb-text-dark sb-padding-top_l sb-padding-bottom_l">
      <div className="sb-background" style={{ background: '#fff' }} />
      <div className="sb-container">
        <div className="sb-row sb-m-clear-bottom">
          <div className="s-footer-customer-type-5__logo-column sb-col_xs-12 sb-col_sm-12 sb-col_md-12 sb-m-clear-bottom sb-col_lg-4">
            <a href="/" className="sb-logotype-wrapper s-footer-customer-type-5__image-wrapper sb-logotype-wrapper_fixed_size-s">
              <img className="lazy sb-logotype-wrapper__image" src={img('c1ad6d70-17f4-42f9-9dfe-49147ca12c86-15586101.png')} alt="Логотип" />
            </a>
            <div className="sb-text-opacity sb-font-p3">© ООО "ПРОФФЛОЙД" 2026. Все права защищены.</div>
          </div>
          <div className="s-footer-customer-type-5__links sb-col_xs-12 sb-col_sm-12 sb-col_md-8 sb-col_lg-5">
            <nav className="sb-row s-footer-customer-type-5__links-row">
              <ul className="sb-col_xs-12 sb-col_sm-5 sb-col_md-6 sb-col_lg-5">
                {NAV.map(({ href, label }) => (
                  <li key={href} className="s-footer-customer-type-5__link-wrapper">
                    <a href={href} className="s-footer-customer-type-5__link sb-font-p3">{label}</a>
                  </li>
                ))}
              </ul>
              <ul className="sb-col_xs-12 sb-col_sm-5 sb-col_md-6 sb-col_lg-7">
                {DOCS.map(({ href, label, download }) => (
                  <li key={label} className="s-footer-customer-type-5__link-wrapper">
                    <a href={href} className="s-footer-customer-type-5__link sb-font-p3" target="_blank" rel="noreferrer" download={download}>{label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="sb-col_xs-12 sb-col_sm-12 sb-col_md-4 sb-col_lg-3">
            <div className="sb-font-p3"><b>8 (993) 953-52-28</b><br />Круглосуточно<br /><b>Адрес</b><br />г. Новосибирск</div>
          </div>
        </div>
      </div>
    </section>
  );
}
