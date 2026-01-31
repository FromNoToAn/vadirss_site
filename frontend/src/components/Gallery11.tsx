import { img } from '../assets';

const ITEMS = [
  { src: '4cd7a2a8-bc52-4535-911d-60fd858209cb-15676600.png', descCls: 'sb-font-h3', desc: <>Измеряйте <span style={{ color: '#85d53e' }}>футбольные показатели</span></> },
  { src: '9f6a514e-5827-4841-b631-a3549135c767-15676606.png', descCls: 'sb-align-left sb-font-h4', desc: <><span style={{ color: '#fff' }}>• Технические<br />• Физические<br />• Ментальные</span></> },
  { src: '830e35d2-50ef-4773-8358-32231de7bb35-15676701.png', descCls: 'sb-font-h3', desc: <>А также <span style={{ color: '#85d53e' }}>психологические показатели личности</span></> },
  { src: '82aeb5a2-e173-426e-a57e-9a055a29a9db-15676670.png', descCls: 'sb-align-left sb-font-h4', desc: <><span style={{ color: '#fff' }}>• Стрессоустойчивость<br />• Ответственность<br />• Адаптивность и др.</span></> },
];

export function Gallery11() {
  return (
    <section data-type="gallery" id="gallery" className="s-gallery-type-11 s-gallery-type-11_inner-description sb-text-white sb-padding-top_l sb-padding-bottom_l">
      <div className="sb-background" style={{ background: '#FFFFFF' }} />
      <div className="sb-container sb-m-clear-bottom">
        <div className="sb-row sb-m-5-top-minus">
          {ITEMS.map(({ src: s, descCls, desc }) => (
            <div key={s} className="sb-col_sm-12 sb-col_xs-12 sb-m-5-top s-gallery-type-11__item-container sb-col_lg-6 sb-col_md-6">
              <figure className="s-gallery-type-11__item sb-m-clear-bottom">
                <div className="s-gallery-type-11__image-wrapper s-gallery-type-11__image-rectangle">
                  <span className="sb-image-overlay" style={{ opacity: 0.55 }} />
                  <img className="sb-image-crop sb-image-crop_loaded lazy" src={img(s)} alt="" />
                </div>
                <h3 className={`s-gallery-type-11__description sb-text-opacity sb-font-title ${descCls}`}>{desc}</h3>
              </figure>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
