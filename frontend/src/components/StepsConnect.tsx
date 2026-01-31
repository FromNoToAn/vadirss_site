import { img } from '../assets';

const STEPS = [
  { n: 1, title: 'Подключаете бота', desc: 'Тренер и игроки заходят в Telegram. Ничего устанавливать не нужно.' },
  { n: 2, title: 'Ставите оценки и получаете метрики', desc: 'ИИ анализирует личностные качества на основе опросов и оценки тренера.' },
  { n: 3, title: 'Формируете составы и даете задания', desc: 'Лидерборд показывает, кто реально заинтересован. Спортсмены получают челленджи на развитие.' },
];

export function StepsConnect() {
  return (
    <section data-type="steps" id="steps" className="s-steps-type-2 sb-text-dark sb-padding-top_l sb-padding-bottom_l">
      <div className="sb-background" style={{ background: '#FFFFFF' }} />
      <div className="sb-container sb-m-clear-bottom">
        <div className="sb-row sb-m-3-bottom">
          <h2 className="sb-col_lg-10 sb-col_md-12 sb-col_sm-12 sb-col_xs-12 sb-font-title sb-font-h2">3 шага к порядку в команде</h2>
        </div>
        <div className="s-steps-type-2__stepper sb-m-clear-bottom">
          <div className="s-steps-type-2__image-wrapper sb-m-5-bottom">
            <div className="sb-image-ratio-1x1">
              <img className="sb-image-crop sb-image-crop_loaded lazy" src={img('93e94d43-cc7f-4059-a045-8eb4a0f60cf4-15643936.png')} alt="3 шага" />
            </div>
          </div>
          <div className="sb-row sb-row_no-margin s-steps-type-2__row sb-p-clear-bottom">
            {STEPS.map(({ n, title, desc }) => (
              <div key={n} className="s-steps-type-2__block-wrapper sb-p-2-bottom">
                <div className="s-steps-type-2__block">
                  <div className="s-steps-type-2__line sb-color-border" />
                  <div className="s-steps-type-2__counter sb-font-title sb-font-h4">
                    <div className="s-steps-type-2__circle sb-color-border">{n}</div>
                  </div>
                  <div className="s-steps-type-2__text sb-m-clear-bottom">
                    <h3 className="sb-font-title sb-font-h4 sb-m-25-bottom">{title}</h3>
                    <div className="sb-text-opacity sb-font-p2">{desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
