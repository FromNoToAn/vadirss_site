import { img } from '../assets';

const ROWS: { label: string; data: string }[] = [
  { label: 'Юридический адрес организации', data: '630060, РОССИЯ, НОВОСИБИРСКАЯ ОБЛАСТЬ, Г.О. ГОРОД НОВОСИБИРСК, Г НОВОСИБИРСК, УЛ ЧЕРНОСЕЛЬСКАЯ, Д. 82А' },
  { label: 'ИНН', data: '5404954280' },
  { label: 'ОГРН', data: '1245400027223' },
  { label: 'КПП', data: '547301001' },
  { label: 'Банк', data: 'АО «ТБанк»' },
  { label: 'Юридический адрес банка', data: '127287, г. Москва, ул. Хуторская 2-я, д. 38А, стр. 26' },
  { label: 'Корр.счет банка', data: '30101810145250000974' },
  { label: 'ИНН банка', data: '7710140679' },
  { label: 'БИК банка', data: '044525974' },
];

export function CompanyCard() {
  return (
    <section data-type="company-card" id="company-card" className="s-company-card-type-2 sb-block sb-block_fullscreen sb-text-white sb-padding-top_l sb-padding-bottom_l">
      <div className="sb-background-image sb-background s-company-card-type-2__background" style={{ backgroundImage: `url(${img('bc545f5f-dffe-40fa-88ec-f6465bf1d757-15684338.png')})` }}>
        <div className="sb-background-overlay" style={{ opacity: 0.3 }} />
      </div>
      <div className="sb-container">
        <div className="sb-row sb-row_center">
          <div className="sb-col_sm-12 sb-col_xs-12 sb-col_lg-10 sb-col_md-10">
            <div className="s-company-card-type-2__top sb-m-5-bottom">
              <h4 className="s-company-card-type-2__title sb-align-left sb-font-h4 sb-font-title">ООО "ПРОФФЛОЙД"</h4>
            </div>
          </div>
          <div className="sb-col_lg-10 sb-col_md-10 sb-col_sm-12 sb-col_xs-12">
            <div className="s-company-card-type-2__details sb-element-white">
              {ROWS.map((r) => (
                <div key={r.label} className="s-company-card-type-2__row s-company-card-type-2__row-wrapper">
                  <div className="s-company-card-type-2__label sb-text-opacity sb-align-left sb-font-p4">{r.label}</div>
                  <div className="s-company-card-type-2__data sb-align-left sb-font-p4">{r.data}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
