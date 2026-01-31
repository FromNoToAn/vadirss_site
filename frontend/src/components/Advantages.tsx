import { img } from '../assets';

const CARDS = [
  { img: '6d54bab1-edc9-4921-ba58-fd3d7c37c792-15659786.jpeg', text: '1. Напишите менеджеру и получите 14 дней ПОЛНОГО "Премиум" доступа.' },
  { img: '3509da77-ec05-42db-9ee7-a4a431d5ed4a-15659784.jpeg', text: '2. Полное инструктирование представителя команды.' },
  { img: '60ecaa82-6de8-481e-8637-4e1dff3ef505-15659785.png', text: '3. Подключение к боту всех игроков состава.' },
];

const TG = 'https://t.me/proffmanagers';

export function Advantages() {
  return (
    <section data-type="advantages-blocks" id="advantages-blocks-2" className="s-advantages-blocks-type-5 s-advantages-blocks-type-5_with-image sb-text-white sb-padding-top_l sb-padding-bottom_l">
      <div className="sb-background" style={{ background: '#111111' }} />
      <div className="sb-container sb-m-clear-bottom">
        <div className="sb-row sb-m-6-bottom">
          <div className="sb-col_md-12 sb-col_sm-12 sb-col_xs-12 sb-col_lg-10">
            <h2 className="sb-font-title sb-font-h2">3 простых шага к подключению:</h2>
          </div>
        </div>
        <div className="s-advantages-blocks-type-5__list">
          <div className="sb-row-square">
            {CARDS.map(({ img: i, text }) => (
              <div key={i} className="s-advantages-blocks-type-5__col sb-col_lg-4 sb-col_md-4 sb-col_sm-6 sb-col_xs-12">
                <div className="s-advantages-blocks-type-5__wrapper sb-text-white">
                  <div className="sb-background-image sb-background" style={{ backgroundImage: `url(${img(i)})` }}>
                    <div className="sb-background-overlay" style={{ opacity: 0.65 }} />
                  </div>
                  <div className="s-advantages-blocks-type-5__content sb-m-clear-bottom">
                    <div className="s-advantages-blocks-type-5__text sb-m-13-bottom sb-m-clear-bottom">
                      <div className="sb-font-title sb-font-h5 sb-m-21-bottom">{text}</div>
                    </div>
                    <a href={TG} className="sb-button-primary sb-button-primary_white s-advantages-blocks-type-5__button sb-button-scheme-dark" style={{ backgroundColor: '#FFFFFF' }} target="_blank" rel="noreferrer">Получить доступ</a>
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
