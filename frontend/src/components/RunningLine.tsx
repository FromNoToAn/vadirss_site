const T = 'Данные вместо мнений. Справедливость вместо обид. Поставьте точку в спорах вместе с sport.vadirss.ru';
const S = '\u00A0\u00A0\u00A0';

export function RunningLine() {
  const html = Array(8).fill(null).map(() => `${T}<br /><span>${S}</span>`).join('');
  return (
    <section data-type="running-line" id="running-line" className="s-running-line-type-1 s-running-line-type-1-pub scroll-left sb-text-white sb-padding-top_s sb-padding-bottom_s">
      <div className="sb-background" style={{ background: '#111111' }} />
      <div className="sb-container container_animation full-width">
        <div className="sb-row s-running-line-type-1__row sb-m-clear-top">
          <h2 className="scroll-left__text display-inline sb-align-center sb-font-p1" style={{ ['--sb-running-line-animation-duration' as string]: '98s' }} dangerouslySetInnerHTML={{ __html: html }} />
          <h2 className="scroll-left__text_visibility-hidden display-inline sb-align-center sb-font-p1" dangerouslySetInnerHTML={{ __html: `${T}<br />` }} />
        </div>
      </div>
    </section>
  );
}
