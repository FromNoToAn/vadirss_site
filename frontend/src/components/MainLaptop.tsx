import { img } from '../assets';

export function MainLaptop() {
  const quote = 'Смирнов: отличная техника, но низкая стрессоустойчивость. В концовках матча теряет концентрацию. Рекомендуем дать ему задание на контроль эмоций в последние 10 минут игры.';
  return (
    <section data-type="main" id="main" className="s-main-type-7 sb-block sb-block_fullscreen sb-text-dark sb-align-center">
      <div className="sb-background sb-background_clear s-main-type-7__content-background" style={{ background: '#F6F7F8' }} />
      <div className="s-main-type-7__additional sb-m-2-top sb-m-1-bottom">
        <div className="s-main-type-7__additional-wrapper">
          <div className="s-main-type-7__laptop-wrapper">
            <svg viewBox="0 0 883 551" className="s-main-type-7__laptop-background" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M48 536H834V20C834 8.95432 825.046 0 814 0H68C56.9543 0 48 8.9543 48 20V536Z" fill="#333333" />
              <path d="M0 536H883C883 544.284 876.284 551 868 551H15C6.71575 551 0 544.284 0 536Z" fill="#222222" />
              <mask id="mask0" maskUnits="userSpaceOnUse" x="68" y="20" width="746" height="484">
                <path d="M68 32C68 25.3726 73.3726 20 80 20H802C808.627 20 814 25.3726 814 32V500C814 502.209 812.209 504 810 504H72C69.7908 504 68 502.209 68 500V32Z" fill="#C4C4C4" />
              </mask>
              <g mask="url(#mask0)">
                <path d="M68 32C68 25.3726 73.3726 20 80 20H802C808.627 20 814 25.3726 814 32V500C814 502.209 812.209 504 810 504H72C69.7908 504 68 502.209 68 500V32Z" fill="white" />
              </g>
            </svg>
            <div className="s-main-type-7__laptop-screen-wrapper">
              <div className="s-main-type-7__laptop-screen">
                <img className="sb-image-crop sb-image-crop_loaded lazy" src={img('e9b69c6e-5bee-4a35-a0bf-1c26a72199d9-15676899.png')} alt="Пример отчета ИИ" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="sb-container s-main-type-7__container">
        <div className="sb-row sb-row_center">
          <div className="sb-col_lg-5 sb-col_md-5 sb-col_sm-12 sb-col_xs-12 sb-m-clear-bottom">
            <h3 className="sb-font-h3 sb-font-title sb-m-14-bottom">Пример отчета ИИ</h3>
            <div className="sb-m-8-bottom sb-text-opacity sb-font-p3">&laquo;{quote}&raquo;</div>
          </div>
          <div className="sb-col_lg-7 sb-col_md-7 sb-col_sm-12 sb-col_xs-12" />
        </div>
      </div>
    </section>
  );
}
