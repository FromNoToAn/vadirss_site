import { img } from '../assets';

export function Gallery4() {
  return (
    <section data-type="gallery" id="gallery-2" className="s-gallery-type-4 sb-text-dark sb-align-center sb-padding-top_l sb-padding-bottom_l">
      <div className="sb-background" style={{ background: '#ffffff' }} />
      <div className="sb-container sb-m-clear-bottom">
        <div className="sb-row s-gallery__top sb-m-5-bottom sb-m-clear-bottom">
          <h2 className="sb-col_lg-8 sb-col-offset_lg-2 sb-col_md-12 sb-col_sm-12 sb-col_xs-12 sb-font-h2 sb-font-title sb-m-12-bottom">ОНИ УЖЕ ИГРАЮТ ПО-НОВОМУ</h2>
        </div>
        <div className="s-gallery-type-4__list sb-m-clear-bottom">
          <figure className="s-gallery-type-4__item">
            <div className="s-gallery-type-4__image-wrapper sb-image-square">
              <span className="sb-image-overlay" style={{ opacity: 0.3 }} />
              <img className="sb-image-crop sb-image-crop_loaded lazy" src={img('85c999b6-b89c-42a8-adaf-9e0035994abe-15614067.jpeg')} alt="Изображение" />
            </div>
            <h5 className="s-gallery-type-4__description sb-text-opacity sb-font-h5 sb-font-title"><span style={{ color: '#ffffff' }}>ФК "ПроффЛойд"</span></h5>
          </figure>
        </div>
      </div>
    </section>
  );
}
